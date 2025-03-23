CREATE MATERIALIZED VIEW campaign_metrics AS

-- 1. Campaign Engagement Over Time (Engagement Rate)
SELECT 
    campaign_id,
    event_date,
    'campaign_engagement_rate' AS metric_name,
    'rate' AS metric_type,
    1 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM campaign_events
WHERE event_type IN ('open', 'click', 'conversion')
GROUP BY campaign_id, event_date

UNION ALL

-- 2. Campaign Open Rate Trends (Open Rate)
SELECT 
    campaign_id,
    event_date,
    'campaign_open_rate' AS metric_name,
    'rate' AS metric_type,
    2 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM campaign_events
WHERE event_type = 'open'
GROUP BY campaign_id, event_date

UNION ALL

-- 3. Click-Through Rate by Campaign (CTR)
SELECT 
    campaign_id,
    event_date,
    'ctr' AS metric_name,
    'rate' AS metric_type,
    3 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM campaign_events
WHERE event_type = 'click'
GROUP BY campaign_id, event_date

UNION ALL

-- 4. Conversion Rate by Channel
SELECT 
    campaign_id,
    event_date,
    'conversion_rate' AS metric_name,
    'rate' AS metric_type,
    4 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM campaign_events
WHERE event_type = 'conversion'
GROUP BY campaign_id, event_date

UNION ALL

-- 5. Active Users Over Time
SELECT 
    999 AS campaign_id, -- Non-campaign specific
    event_date,
    'active_users' AS metric_name,
    'count' AS metric_type,
    5 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    1 AS denominator,
    COUNT(DISTINCT user_id) AS metric_value
FROM user_activity
GROUP BY event_date

UNION ALL

-- 6. User Retention Trends
SELECT 
    999 AS campaign_id,
    event_date,
    'retention_rate' AS metric_name,
    'rate' AS metric_type,
    6 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM user_retention
GROUP BY event_date

UNION ALL

-- 7. Churn Rate Analysis
SELECT 
    999 AS campaign_id,
    event_date,
    'churn_rate' AS metric_name,
    'rate' AS metric_type,
    7 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM user_churn
GROUP BY event_date

UNION ALL

-- 8. Response Time Analysis (Time to First Response)
SELECT 
    campaign_id,
    event_date,
    'response_time' AS metric_name,
    'time' AS metric_type,
    8 AS sequence,
    AVG(response_time) AS numerator,
    1 AS denominator,
    AVG(response_time) AS metric_value
FROM campaign_responses
GROUP BY campaign_id, event_date

UNION ALL

-- 9. Most Engaged Time Period (Heatmap by Hour)
SELECT 
    999 AS campaign_id,
    event_hour AS event_date,
    'most_engaged_time' AS metric_name,
    'time' AS metric_type,
    9 AS sequence,
    COUNT(*) AS numerator,
    1 AS denominator,
    COUNT(*) AS metric_value
FROM user_activity
GROUP BY event_hour

UNION ALL

-- 10. Most Used Device Type (Pie Chart)
SELECT 
    999 AS campaign_id,
    event_date,
    'most_used_device' AS metric_name,
    'category' AS metric_type,
    10 AS sequence,
    device_type AS numerator,
    1 AS denominator,
    COUNT(*) AS metric_value
FROM user_activity
GROUP BY event_date, device_type

UNION ALL

-- 11. Stickiness Ratio (DAU/MAU)
SELECT 
    999 AS campaign_id,
    event_date,
    'stickiness_ratio' AS metric_name,
    'ratio' AS metric_type,
    11 AS sequence,
    (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date = current_date) AS numerator,
    (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date >= current_date - interval '30 days') AS denominator,
    (SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date = current_date)::DECIMAL 
    / NULLIF((SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE event_date >= current_date - interval '30 days'), 0) 
    AS metric_value
FROM user_activity
LIMIT 1

UNION ALL

-- 12. Re-engagement Rate
SELECT 
    999 AS campaign_id,
    event_date,
    'reengagement_rate' AS metric_name,
    'rate' AS metric_type,
    12 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM reengaged_users
GROUP BY event_date

UNION ALL

-- 13. Average Time Between Sessions
SELECT 
    999 AS campaign_id,
    event_date,
    'avg_time_between_sessions' AS metric_name,
    'time' AS metric_type,
    13 AS sequence,
    AVG(time_diff) AS numerator,
    1 AS denominator,
    AVG(time_diff) AS metric_value
FROM user_sessions
GROUP BY event_date

UNION ALL

-- 14. Bounce Rate Trends
SELECT 
    campaign_id,
    event_date,
    'bounce_rate' AS metric_name,
    'rate' AS metric_type,
    14 AS sequence,
    COUNT(*) FILTER (WHERE event_type = 'bounce') AS numerator,
    COUNT(*) AS denominator,
    COUNT(*) FILTER (WHERE event_type = 'bounce')::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM campaign_events
GROUP BY campaign_id, event_date

-- 15. Inactivity Rate Over Time
SELECT 
    999 AS campaign_id,
    event_date,
    'inactivity_rate' AS metric_name,
    'rate' AS metric_type,
    15 AS sequence,
    COUNT(DISTINCT user_id) AS numerator,
    COUNT(*) AS denominator,
    COUNT(DISTINCT user_id)::DECIMAL / NULLIF(COUNT(*), 0) AS metric_value
FROM inactive_users
GROUP BY event_date; -- Final query ends with a semicolon