// /

//*************************************************************************************************************************************************************************************************************************************************************** */



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, AlertTriangle, Target, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useState } from "react";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    region: "All Regions",
    towerType: "All Types",
    projectStatus: "All Projects",
    timePeriod: "6 Months"
  });

  // Mock data for material demand forecast
  const demandData = [
    { month: "Month 1", material1: 450, material2: 380, material3: 520 },
    { month: "Month 2", material1: 480, material2: 400, material3: 540 },
    { month: "Month 3", material1: 520, material2: 420, material3: 560 },
    { month: "Month 4", material1: 630, material2: 480, material3: 580 },
    { month: "Month 5", material1: 720, material2: 520, material3: 600 },
    { month: "Month 6", material1: 780, material2: 580, material3: 620 },
  ];

  // Mock data for project distribution
  const projectData = [
    { name: "North", value: 2, color: "#3b82f6" },
    { name: "South", value: 45, color: "#10b981" },
    { name: "East", value: 28, color: "#f59e0b" },
    { name: "West", value: 25, color: "#ef4444" },
  ];

  const kpis = [
    {
      title: "Active Projects",
      value: "178",
      change: "↑ 12% from last month",
      changeType: "positive",
      icon: Activity,
      color: "blue"
    },
    {
      title: "Budget Utilization",
      value: "87.4%",
      change: "↑ 5.2% from last month",
      changeType: "positive",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Material Shortages",
      value: "7",
      change: "↓ 3% from last month",
      changeType: "negative",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      title: "Forecast Accuracy",
      value: "94.2%",
      change: "↑ 6.1% from last month",
      changeType: "positive",
      icon: Target,
      color: "green"
    }
  ];

  const FilterDropdown = ({ label, value, options }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="relative">
        <select 
          value={value}
          className="w-full px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GRIDAURA Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Material Demand Forecasting & Project Analytics</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Last Updated</p>
          <p className="text-sm font-semibold text-gray-900">15/10/2025</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FilterDropdown 
              label="Region"
              value={filters.region}
              options={["All Regions", "North", "South", "East", "West"]}
            />
            <FilterDropdown 
              label="Tower Type"
              value={filters.towerType}
              options={["All Types", "Type A", "Type B", "Type C"]}
            />
            <FilterDropdown 
              label="Project Status"
              value={filters.projectStatus}
              options={["All Projects", "Active", "Completed", "Planned"]}
            />
            <FilterDropdown 
              label="Time Period"
              value={filters.timePeriod}
              options={["6 Months", "3 Months", "1 Year", "2 Years"]}
            />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    kpi.color === 'blue' ? 'bg-blue-100' :
                    kpi.color === 'green' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      kpi.color === 'blue' ? 'text-blue-600' :
                      kpi.color === 'green' ? 'text-green-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    kpi.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {kpi.color === 'green' ? (
                      <span className="text-green-600 text-xs">✓</span>
                    ) : (
                      <span className="text-orange-600 text-xs">!</span>
                    )}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                <p className={`text-xs ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Demand Forecast Chart */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Material Demand Forecast</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Projected material requirements for the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="material1" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Material Type 1"
                />
                <Line 
                  type="monotone" 
                  dataKey="material2" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Material Type 2"
                />
                <Line 
                  type="monotone" 
                  dataKey="material3" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Material Type 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Distribution Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Project Distribution</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Active projects across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string, entry: any) => (
                    <span className="text-sm text-gray-600">
                      {entry && entry.payload && 'name' in entry.payload ? entry.payload.name : value}: {entry && entry.payload && 'value' in entry.payload ? entry.payload.value : ''}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;