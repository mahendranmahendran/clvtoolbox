//Components/ChartsWidgetsDashboard.jsx

import React from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";


const COLORS = ["#0a369d", "#4472ca", "#5e7ce2", "#92b4f4", "#cfdee7"];
const backgroundColor = "#ffffff";

const dataExample = [
  { name: "Jan", engagement: 65, openRate: 45, ctr: 30 },
  { name: "Feb", engagement: 70, openRate: 50, ctr: 35 },
  { name: "Mar", engagement: 75, openRate: 55, ctr: 40 },
  { name: "Apr", engagement: 80, openRate: 60, ctr: 45 },
];

const KPIWidgets = [
  { title: "Total Active Users", value: "12,345" },
  { title: "Click-Through Rate", value: "4.5%" },
  { title: "Conversion Rate", value: "2.1%" },
  { title: "Bounce Rate", value: "32%" },
  { title: "Opt-Out Rate", value: "1.8%" },
];

const ChartsWidgetsDashboard = () => {
  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {KPIWidgets.map((kpi, index) => (
          <Card key={index} style={{ flex: 1, minWidth: "200px" }}>
            <CardContent>
              <Typography variant="h6">{kpi.title}</Typography>
              <Typography variant="h4" color="primary">{kpi.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataExample} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="engagement" stroke={COLORS[0]} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataExample} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="openRate" fill={COLORS[1]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={dataExample} dataKey="ctr" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {dataExample.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Table */}
      <MaterialReactTable
        columns={[
          { accessorKey: "name", header: "Month" },
          { accessorKey: "engagement", header: "Engagement Rate (%)" },
          { accessorKey: "openRate", header: "Open Rate (%)" },
          { accessorKey: "ctr", header: "Click-Through Rate (%)" },
        ]}
        data={dataExample}
      />
    </div>
  );
};

export default ChartsWidgetsDashboard;

//C:\Users\raksh\OneDrive\Documents\mahendran_projects\omni\root-folder\frontend\src\components\ChartsWidgetsDashboard.jsx
