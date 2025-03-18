// path: root-folder/frontend/src/components/ChartsWidgetsDashboard.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts";

const ChartsWidgetsDashboards = ({ client_code }) => {
    const [metrics, setMetrics] = useState([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            const response = await fetch(`http://localhost:3000/api/campaign-metrics?client_code=${client_code}`);
            const data = await response.json();
            setMetrics(data);
        };
        fetchMetrics();
    }, [client_code]);

    const singleValues = metrics.filter(m => m.metric_type === "single_value");
    const timeSeries = metrics.filter(m => m.metric_type === "time_series");
    const categories = metrics.filter(m => m.metric_type === "category");

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {singleValues.map((metric, index) => (
                <div key={index} className="bg-white shadow-md p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold">{metric.metric_name}</h3>
                    <p className="text-2xl font-bold">{metric.metric_value}</p>
                </div>
            ))}

            {timeSeries.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeries.map(m => ({ name: m.metric_name, value: m.metric_value }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {categories.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categories.map(m => ({ name: m.metric_name, value: m.metric_value }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ChartsWidgetsDashboards;
// Path: root-folder/frontend/src/components/ClientDashboard.jsx 