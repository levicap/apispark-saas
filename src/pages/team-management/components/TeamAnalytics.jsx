import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const TeamAnalytics = () => {
  const roleDistributionData = [
    { name: 'Admin', value: 3, color: '#EF4444' },
    { name: 'Developer', value: 12, color: '#3B82F6' },
    { name: 'Read-only', value: 5, color: '#6B7280' }
  ];

  const activityData = [
    { name: 'Mon', apis: 24, databases: 12, deployments: 8 },
    { name: 'Tue', apis: 32, databases: 18, deployments: 12 },
    { name: 'Wed', apis: 28, databases: 15, deployments: 10 },
    { name: 'Thu', apis: 35, databases: 22, deployments: 15 },
    { name: 'Fri', apis: 42, databases: 28, deployments: 18 },
    { name: 'Sat', apis: 18, databases: 8, deployments: 5 },
    { name: 'Sun', apis: 15, databases: 6, deployments: 3 }
  ];

  const collaborationData = [
    { month: 'Jan', collaborations: 145 },
    { month: 'Feb', collaborations: 168 },
    { month: 'Mar', collaborations: 192 },
    { month: 'Apr', collaborations: 224 },
    { month: 'May', collaborations: 256 },
    { month: 'Jun', collaborations: 289 }
  ];

  const topContributors = [
    { name: 'Sarah Johnson', contributions: 89, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Michael Rodriguez', contributions: 76, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'David Kim', contributions: 64, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Lisa Park', contributions: 52, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { name: 'Alex Chen', contributions: 48, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' }
  ];

  const stats = [
    { label: 'Total Members', value: '20', change: '+2', trend: 'up', icon: 'Users' },
    { label: 'Active Projects', value: '8', change: '+1', trend: 'up', icon: 'Folder' },
    { label: 'API Endpoints', value: '156', change: '+24', trend: 'up', icon: 'Layers' },
    { label: 'Deployments', value: '42', change: '+8', trend: 'up', icon: 'Rocket' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat?.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat?.value}</p>
                <div className="flex items-center mt-1">
                  <Icon 
                    name={stat?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                    className={stat?.trend === 'up' ? 'text-green-500' : 'text-red-500'} 
                  />
                  <span className={`text-sm ml-1 ${stat?.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat?.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Role Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistributionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {roleDistributionData?.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item?.color }}
                ></div>
                <span className="text-sm text-gray-600">{item?.name} ({item?.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Team Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="apis" fill="#3B82F6" name="API Changes" />
                <Bar dataKey="databases" fill="#10B981" name="DB Changes" />
                <Bar dataKey="deployments" fill="#F59E0B" name="Deployments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaboration Trends */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={collaborationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="collaborations" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
          <div className="space-y-4">
            {topContributors?.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={contributor?.avatar}
                      alt={contributor?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contributor?.name}</p>
                    <p className="text-xs text-gray-500">{contributor?.contributions} contributions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(contributor?.contributions / 100) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{contributor?.contributions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;