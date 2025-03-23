
//file: src/components/ChartsWidgetsDashboard.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";

const ChartsWidgetsDashboards = ({ client_code }) => {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Logs whenever 'metrics' updates
    useEffect(() => {
        console.log("Updated Metrics State:", metrics);
    }, [metrics]);

    useEffect(() => {
        let isMounted = true;
        const fetchMetrics = async () => {
            try {
                console.log("Fetching metrics from API:", `http://localhost:3000/api/v1/campaign-metrics?client_code=${client_code}`);
                const response = await fetch(`http://localhost:3000/api/v1/campaign-metrics?client_code=${client_code}`);
                
                if (!response.ok) {
                    throw new Error(`API returned error status: ${response.status}`);
                }
    
                const result = await response.json();
                console.log("Full API Response:", JSON.stringify(result, null, 2));

                if (isMounted && result.success && Array.isArray(result.data)) {
                    console.log("Unfiltered Metrics Data:", result.data);
                    
                    const filteredMetrics = result.data;
                    setMetrics(filteredMetrics);
                    console.log("Filtered Metrics Data:", filteredMetrics);
                } else {
                    console.warn("API Response did not contain expected data format:", result);
                }
                
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch metrics:", error);
                    setError(error.message);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
    
        fetchMetrics();
        return () => { isMounted = false; };
    }, [client_code]);

    console.log("All metric types received:", metrics.map(m => m.metric_type));

    const singleValues = metrics.filter(m => m.metric_type?.trim().toLowerCase() === "single_value");
    const timeSeries = metrics.filter(m => m.metric_type?.trim().toLowerCase() === "time_series");
    const categories = metrics.filter(m => m.metric_type?.trim().toLowerCase() === "category");

    console.log("Single Value Metrics:", singleValues);
    console.log("Time Series Metrics:", timeSeries);
    console.log("Category Metrics:", categories);

    const timeSeriesData = timeSeries.map(m => ({
        name: m.date_event || "N/A", 
        value: Number(m.metric_value) || 0 
    }));

    const categoryData = categories.map(m => ({
        name: m.metric_name || "N/A",
        value: Number(m.metric_value) || 0
    }));

    if (loading) return <div className="text-center p-4">Loading metrics...</div>;
    if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    if (metrics.length === 0) return <div className="text-center p-4">No metrics available.</div>;

    try {
        return (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {singleValues.map((metric, index) => (
                    <div key={index} className="bg-white shadow-md p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold">{metric.metric_name}</h3>
                        <p className="text-2xl font-bold">{metric.metric_value}</p>
                    </div>
                ))}

                {timeSeriesData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={timeSeriesData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {categoryData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        );
    } catch (error) {
        console.error("Rendering error:", error);
        return <div className="text-red-500 p-4">Error rendering metrics</div>;
    }
};

export default ChartsWidgetsDashboards;
