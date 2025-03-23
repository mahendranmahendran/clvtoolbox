//filename:src/pages/Metrics.jsx

import ChartsWidgetsDashboards from "../components/ChartsWidgetsDashboard";

const Metrics = () => {
    const client_code = "ECOM1"; // This can be dynamic in the future

    console.log("Metrics.jsx loaded");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Campaign Metrics</h1>
            <ChartsWidgetsDashboards client_code={client_code} />
        </div>
    );
};

export default Metrics;
