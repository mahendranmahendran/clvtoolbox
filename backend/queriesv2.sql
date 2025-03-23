-- Updated SQL Queries to Reference `events_metrics_mv` or `events_metrics`

-- 1. Campaign Engagement Over Time (Engagement Rate %)
SELECT 
    DATE_TRUNC('day', e.created_at) AS date,
    c.name AS campaign_name,
    COUNT(*) FILTER (WHERE e.event_name = 'engaged')::float / COUNT(*) * 100 AS engagement_rate
FROM events_metrics_mv e
JOIN campaigns c ON e.event_data->>'campaign_id' = c.id::text
GROUP BY date, campaign_name;

-- 2. Campaign Open Rate Trends (Open Rate %)
SELECT 
    DATE_TRUNC('day', e.created_at) AS date,
    c.type AS campaign_type,
    COUNT(*) FILTER (WHERE e.event_name = 'opened')::float / COUNT(*) * 100 AS open_rate
FROM events_metrics_mv e
JOIN campaigns c ON e.event_data->>'campaign_id' = c.id::text
GROUP BY date, campaign_type;

-- 3. Click-Through Rate by Campaign (CTR %)
SELECT 
    c.name AS campaign_name,
    COUNT(*) FILTER (WHERE e.event_name = 'clicked')::float / COUNT(*) * 100 AS ctr
FROM events_metrics_mv e
JOIN campaigns c ON e.event_data->>'campaign_id' = c.id::text
GROUP BY campaign_name;

-- 4. Conversion Rate by Channel (Conversion Rate %)
SELECT 
    c.type AS campaign_type,
    COUNT(*) FILTER (WHERE e.event_name = 'converted')::float / COUNT(*) * 100 AS conversion_rate
FROM events_metrics_mv e
JOIN campaigns c ON e.event_data->>'campaign_id' = c.id::text
GROUP BY campaign_type;

-- 5. Active Users Over Time (Active User Ratio)
SELECT 
    DATE_TRUNC('day', e.created_at) AS date,
    COUNT(DISTINCT e.user_id) / (SELECT COUNT(*) FROM users)::float * 100 AS active_user_ratio
FROM events_metrics_mv e
GROUP BY date;

-- 6. User Retention Trends (Retention Rate %)
WITH first_seen AS (
    SELECT user_id, MIN(created_at) AS first_active_date FROM events_metrics_mv GROUP BY user_id
), retained AS (
    SELECT e.user_id, DATE_TRUNC('day', e.created_at) AS active_date
    FROM events_metrics_mv e JOIN first_seen f ON e.user_id = f.user_id AND e.created_at > f.first_active_date
)
SELECT active_date, COUNT(DISTINCT user_id) / (SELECT COUNT(*) FROM users)::float * 100 AS retention_rate
FROM retained
GROUP BY active_date;

-- 7. Churn Rate Analysis (Churn Rate %)
WITH last_active AS (
    SELECT user_id, MAX(created_at) AS last_active_date FROM events_metrics_mv GROUP BY user_id
)
SELECT DATE_TRUNC('day', last_active_date) AS date, COUNT(*) / (SELECT COUNT(*) FROM users)::float * 100 AS churn_rate
FROM last_active
GROUP BY date;

-- 8. Response Time Analysis (Time to First Response)
SELECT 
    DATE_TRUNC('day', r.received_at) AS date,
    c.name AS campaign_name,
    AVG(EXTRACT(EPOCH FROM (r.received_at - e.created_at))) AS avg_response_time_sec
FROM responses r
JOIN events_metrics_mv e ON r.user_id = e.user_id
JOIN campaigns c ON r.campaign_id = c.id
WHERE e.event_name = 'engaged'
GROUP BY date, campaign_name;

-- 9. Most Engaged Time Period (Heatmap by Hour)
SELECT 
    EXTRACT(HOUR FROM e.created_at) AS hour_of_day,
    COUNT(*) AS engagement_frequency
FROM events_metrics_mv e
WHERE e.event_name = 'engaged'
GROUP BY hour_of_day
ORDER BY hour_of_day;

-- 10. Most Used Device Type (Pie Chart)
SELECT 
    u.device_type,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users) AS percentage_of_users
FROM users u
GROUP BY device_type;

-- 11. Stickiness Ratio
WITH dau AS (
    SELECT COUNT(DISTINCT user_id) AS daily_active_users
    FROM events_metrics_mv
    WHERE DATE_TRUNC('day', created_at) = CURRENT_DATE
),
mau AS (
    SELECT COUNT(DISTINCT user_id) AS monthly_active_users
    FROM events_metrics_mv
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
)
SELECT (dau.daily_active_users::decimal / NULLIF(mau.monthly_active_users, 0)) AS stickiness_ratio
FROM dau, mau;

-- 12. Reengagement Rate
WITH previously_inactive AS (
    SELECT DISTINCT user_id
    FROM events_metrics_mv
    WHERE created_at < NOW() - INTERVAL '30 days'
),
reengaged_users AS (
    SELECT DISTINCT user_id
    FROM events_metrics_mv
    WHERE created_at >= NOW() - INTERVAL '30 days'
)
SELECT (COUNT(reengaged_users.user_id)::decimal / NULLIF(COUNT(previously_inactive.user_id), 0)) * 100 AS reengagement_rate
FROM previously_inactive
LEFT JOIN reengaged_users ON previously_inactive.user_id = reengaged_users.user_id;

-- 13. Average Time Between Sessions
WITH session_times AS (
    SELECT user_id, created_at AS session_time,
           LEAD(created_at) OVER (PARTITION BY user_id ORDER BY created_at) AS next_session_time
    FROM events_metrics_mv
)
SELECT AVG(EXTRACT(EPOCH FROM (next_session_time - session_time))) / 60 AS avg_time_between_sessions_minutes
FROM session_times
WHERE next_session_time IS NOT NULL;

-- 14. Bounce Rate Trends
SELECT DATE_TRUNC('day', e.created_at) AS date, 
       COUNT(e.id)::decimal / (SELECT COUNT(*) FROM events_metrics_mv) * 100 AS bounce_rate
FROM events_metrics_mv e
WHERE e.event_name = 'BOUNCE'
GROUP BY date;

-- 15. Inactivity Rate Over Time
SELECT DATE_TRUNC('day', u.last_login) AS date, 
       COUNT(u.id)::decimal / (SELECT COUNT(*) FROM users) * 100 AS inactivity_rate
FROM users u
WHERE u.last_login < NOW() - INTERVAL '30 days'
GROUP BY date;
