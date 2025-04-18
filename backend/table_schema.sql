create table public.campaigns (
  id uuid not null default gen_random_uuid (),
  name text not null,
  type text null,
  content text not null,
  target_audience jsonb not null,
  status text null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  client_code text null,
  constraint campaigns_pkey primary key (id),
  constraint campaigns_status_check check (
    (
      status = any (
        array[
          'Draft'::text,
          'Scheduled'::text,
          'Sent'::text,
          'Failed'::text
        ]
      )
    )
  ),
  constraint campaigns_type_check check (
    (
      type = any (
        array[
          'PUSH'::text,
          'EMAIL'::text,
          'SMS'::text,
          'WHATSAPP'::text,
          'INAPP'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.clients (
  id bigint generated by default as identity not null,
  client_name text null,
  client_short_name text null,
  client_code text null,
  created_at timestamp with time zone not null default now(),
  constraint clients_pkey primary key (id)
) TABLESPACE pg_default;

create table public.events (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  event_name text not null,
  event_data jsonb not null,
  created_at timestamp without time zone null default now(),
  client_code text null,
  constraint events_pkey primary key (id)
) TABLESPACE pg_default;

create table public.responses (
  id uuid not null default gen_random_uuid (),
  campaign_id uuid null,
  user_id uuid null,
  response_data jsonb not null,
  received_at timestamp without time zone null default now(),
  client_code text null,
  constraint responses_pkey primary key (id)
) TABLESPACE pg_default;

create table public.users (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text null,
  phone text null,
  password_hash text not null,
  date_of_birth date null,
  gender text null,
  device_id text null,
  device_type text null,
  app_version text null,
  os_version text null,
  fcm_token text null,
  country text null,
  state text null,
  city text null,
  timezone text null,
  last_known_latitude numeric(9, 6) null,
  last_known_longitude numeric(9, 6) null,
  preferred_language text null,
  notification_preferences jsonb null,
  marketing_opt_in boolean null default true,
  dark_mode boolean null default false,
  last_login timestamp without time zone null,
  total_sessions integer null default 0,
  referral_code text null,
  referred_by uuid null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  client_code text null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_phone_key unique (phone),
  constraint users_device_type_check check (
    (
      device_type = any (
        array[
          'Android'::text,
          'iOS'::text,
          'Web'::text,
          'Other'::text
        ]
      )
    )
  ),
  constraint users_gender_check check (
    (
      gender = any (
        array[
          'Male'::text,
          'Female'::text,
          'Other'::text,
          'Prefer not to say'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create materialized view public.events_metrics_mv as
with
  clicks as (
    select
      responses.client_code,
      count(*) as total_clicks
    from
      responses
    group by
      responses.client_code
  ),
  ctr as (
    select
      events.client_code,
      count(*) filter (
        where
          events.event_name = 'clicked'::text
      )::numeric * 100.0 / NULLIF(
        count(*) filter (
          where
            events.event_name = 'engaged'::text
        ),
        0
      )::numeric as ctr
    from
      events
    group by
      events.client_code
  ),
  event_time as (
    select
      events.client_code,
      events.event_name,
      count(*) as total_events,
      date_trunc('day'::text, events.created_at) as date_event,
      date_trunc('month'::text, events.created_at) as month_event
    from
      events
    group by
      events.client_code,
      events.event_name,
      (date_trunc('day'::text, events.created_at)),
      (date_trunc('month'::text, events.created_at))
  )
select
  e.client_code,
  e.event_name as metric_name,
  e.total_events as metric_value,
  COALESCE(mc.metric_type, 'unknown'::text) as metric_type,
  COALESCE(mc.chart, 'default_chart'::text) as chart,
  COALESCE(mc.metric_category, 'uncategorized'::text) as metric_category,
  COALESCE(mc.sequence, 999) as sequence,
  e.date_event,
  e.month_event
from
  event_time e
  left join metric_config mc on e.event_name = mc.metric_name
union all
select
  clicks.client_code,
  'Total Clicks'::text as metric_name,
  clicks.total_clicks as metric_value,
  COALESCE(mc.metric_type, 'unknown'::text) as metric_type,
  COALESCE(mc.chart, 'default_chart'::text) as chart,
  COALESCE(mc.metric_category, 'uncategorized'::text) as metric_category,
  COALESCE(mc.sequence, 999) as sequence,
  null::timestamp without time zone as date_event,
  null::timestamp without time zone as month_event
from
  clicks
  left join metric_config mc on 'Total Clicks'::text = mc.metric_name
union all
select
  ctr.client_code,
  'CTR'::text as metric_name,
  ctr.ctr as metric_value,
  COALESCE(mc.metric_type, 'unknown'::text) as metric_type,
  COALESCE(mc.chart, 'default_chart'::text) as chart,
  COALESCE(mc.metric_category, 'uncategorized'::text) as metric_category,
  COALESCE(mc.sequence, 999) as sequence,
  null::timestamp without time zone as date_event,
  null::timestamp without time zone as month_event
from
  ctr
  left join metric_config mc on 'CTR'::text = mc.metric_name;


create table public.events_metrics (
  client_code text not null,
  metric_name text not null,
  metric_value numeric null,
  metric_type text null,
  refreshed_at timestamp without time zone null default now(),
  constraint events_metrics_pkey primary key (client_code, metric_name)
) TABLESPACE pg_default;

--We are dropping metrics_config
create table public.metric_config (
  metric_name text not null,
  metric_type text null,
  chart text null,
  metric_category text null,
  sequence integer null default 999,
  created_at timestamp with time zone null,
  constraint metric_config_pkey primary key (metric_name)
) TABLESPACE pg_default;


CREATE MATERIALIZED VIEW event_metrics_mv AS 

WITH daily_metrics AS (
    SELECT 
        campaign_id,
        event_date,
        'campaign_engagement' AS metric_name,
        'rate' AS metric_type,
        1 AS sequence,
        COUNT(DISTINCT user_id) AS numerator,
        COUNT(*) AS denominator,
        COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value,
        NOW() AS created_at
    FROM event_logs
    GROUP BY campaign_id, event_date

    UNION ALL

    SELECT 
        campaign_id,
        event_date,
        'campaign_open_rate' AS metric_name,
        'rate' AS metric_type,
        2 AS sequence,
        SUM(CASE WHEN event_type = 'open' THEN 1 ELSE 0 END) AS numerator,
        COUNT(*) AS denominator,
        SUM(CASE WHEN event_type = 'open' THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value,
        NOW() AS created_at
    FROM event_logs
    GROUP BY campaign_id, event_date
),

non_daily_metrics AS (
    SELECT 
        campaign_id,
        DATE_TRUNC('month', CURRENT_DATE) AS event_date,  -- Month-level grouping
        'monthly_active_users' AS metric_name,
        'count' AS metric_type,
        5 AS sequence,
        COUNT(DISTINCT user_id) AS numerator,
        1 AS denominator,
        COUNT(DISTINCT user_id) AS metric_value,
        NOW() AS created_at
    FROM user_activity
    WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY campaign_id, event_date

    UNION ALL

    SELECT 
        campaign_id,
        DATE_TRUNC('month', CURRENT_DATE) AS event_date,
        'churn_rate' AS metric_name,
        'rate' AS metric_type,
        7 AS sequence,
        COUNT(DISTINCT user_id) AS numerator,
        (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date >= CURRENT_DATE - INTERVAL '30 days' AND campaign_id = u.campaign_id) AS denominator,
        COUNT(DISTINCT user_id)::DECIMAL / NULLIF(
            (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date >= CURRENT_DATE - INTERVAL '30 days' AND campaign_id = u.campaign_id), 0
        ) AS metric_value,
        NOW() AS created_at
    FROM user_churn u
    WHERE churn_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY campaign_id, event_date

    UNION ALL

    SELECT 
        campaign_id,
        DATE_TRUNC('month', CURRENT_DATE) AS event_date,
        'stickiness_ratio' AS metric_name,
        'ratio' AS metric_type,
        11 AS sequence,
        (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date = CURRENT_DATE AND campaign_id = u.campaign_id) AS numerator,
        (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date >= CURRENT_DATE - INTERVAL '30 days' AND campaign_id = u.campaign_id) AS denominator,
        (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date = CURRENT_DATE AND campaign_id = u.campaign_id)::DECIMAL 
        / NULLIF((SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date >= CURRENT_DATE - INTERVAL '30 days' AND campaign_id = u.campaign_id), 0) 
        AS metric_value,
        NOW() AS created_at
    FROM user_activity u
    GROUP BY campaign_id, event_date

    UNION ALL

    SELECT 
        campaign_id,
        DATE_TRUNC('month', CURRENT_DATE) AS event_date,
        'retention_rate_d30' AS metric_name,
        'rate' AS metric_type,
        6 AS sequence,
        COUNT(DISTINCT user_id) AS numerator,
        (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE first_seen_date = CURRENT_DATE - INTERVAL '30 days' AND campaign_id = u.campaign_id) AS denominator,
        COUNT(DISTINCT user_id)::DECIMAL / NULLIF(
            (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE first_seen_date = CURRENT_DATE - INTERVAL '30 days' AND campaign_id = u.campaign_id), 0
        ) AS metric_value,
        NOW() AS created_at
    FROM user_retention u
    WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY campaign_id, event_date
)

SELECT * FROM daily_metrics
UNION ALL
SELECT * FROM non_daily_metrics;
