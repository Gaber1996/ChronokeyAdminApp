import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCircle2,
  Activity,
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart,
} from 'lucide-react';
import BASE_URL from './apis';

const MetricCard = ({ icon: Icon, title, value, change, trend }) => (
  <div className="stat-card">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="stat-label">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
      <div className="icon-wrapper">
        <Icon size={24} />
      </div>
    </div>
    {change && (
      <div className="flex items-center mt-2">
        <span className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
          {trend === 'up' ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs. last month</span>
      </div>
    )}
  </div>
);

const ChartCard = ({ title, subtitle, icon: Icon, children }) => (
  <div className="card h-full">
    <div className="card-header flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-blue-600" />
          <h4 className="text-lg font-medium text-gray-800">{title}</h4>
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
    <div className="card-body">{children}</div>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    normalUserCount: 0,
    maleUsers: 0,
    femaleUsers: 0,
    under18: 0,
    age18to24: 0,
    age25to34: 0,
    age35to44: 0,
    age45plus: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL.BASE_URL}/admin/v1/users`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Expected an array but got an object');

        setStats({
          totalUsers: data.length,
          adminCount: data.filter(user => user.roles?.name === 'ADMIN').length,
          normalUserCount: data.filter(user => user.roles?.name === 'USER').length,
          maleUsers: data.filter(user => user.gender?.toLowerCase() === 'male').length,
          femaleUsers: data.filter(user => user.gender?.toLowerCase() === 'female').length,
          under18: data.filter(user => user.age < 18).length,
          age18to24: data.filter(user => user.age >= 18 && user.age <= 24).length,
          age25to34: data.filter(user => user.age >= 25 && user.age <= 34).length,
          age35to44: data.filter(user => user.age >= 35 && user.age <= 44).length,
          age45plus: data.filter(user => user.age >= 45).length,
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-area">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard icon={Users} title="Total Users" value={stats.totalUsers} change={12.5} trend="up" />
            <MetricCard icon={UserCircle2} title="Admin Users" value={stats.adminCount} />
            <MetricCard icon={Activity} title="Normal Users" value={stats.normalUserCount} change={-2.4} trend="down" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
                     icon={PieChart}
                     title="Gender Distribution"
                     subtitle="Breakdown of users by gender"
                   >
                     <div className="space-y-4">
                       <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                           <span className="text-sm font-medium">Male</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-semibold">{stats.maleUsers} users</span>
                           <span className="badge badge-primary">{Math.ceil((stats.maleUsers / stats.totalUsers)*100)} %</span>
                         </div>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                           <span className="text-sm font-medium">Female</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-semibold">{stats.femaleUsers} users</span>
                           <span className="badge badge-primary">{Math.ceil((stats.femaleUsers / stats.totalUsers)*100)} %</span>
                         </div>
                       </div>
                     </div>
                   </ChartCard>

            <ChartCard icon={BarChart} title="Age Distribution" subtitle="Users by age groups">
              <div className="space-y-4">
                {[['0-18', stats.under18], ['18-24', stats.age18to24], ['25-34', stats.age25to34], ['35-44', stats.age35to44], ['45+', stats.age45plus]].map(([label, value]) => (
                  <div key={label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{label} years</span>
                      <span className="text-gray-600">{value} users ({Math.ceil((value / stats.totalUsers) * 100)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.ceil((value / stats.totalUsers) * 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
