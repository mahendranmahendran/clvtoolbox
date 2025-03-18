// // Metrics.js 
// import ChartsWidgetsDashboard from "../components/ChartsWidgetsDashboard.jsx";


// console.log("Dashboard.js loaded");

// export default function Metrics() {
//   return (
//     <div>
//       <h2>Metrics</h2>
//       <p>Welcome to your Metrics</p>
//       <ChartsWidgetsDashboard /> 
//     </div>
//   );
// }


import ChartsWidgetsDashboards from "../components/ChartsWidgetsDashboard";

const Metrics = () => {
    const client_code = "ECOM1"; // Can be dynamic
console.log("Dashboard.js loaded");
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Campaign Metrics</h1>
            <ChartsWidgetsDashboards client_code={client_code} />
        </div>
    );
};

export default Metrics;
