import React from 'react';
import { useData } from '../contexts/DataContext';
import { Users, Package, CheckSquare, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Dashboard: React.FC = () => {
  const { customers, products, tasks, invoices } = useData();

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Calculate current month statistics
  const completedInstallationsThisMonth = tasks.filter(task => 
    task.type === 'installation' && 
    task.status === 'completed' && 
    task.completedDate &&
    isWithinInterval(new Date(task.completedDate), { start: monthStart, end: monthEnd })
  ).length;

  const totalKwThisMonth = customers
    .filter(customer => 
      customer.installationDate &&
      isWithinInterval(new Date(customer.installationDate), { start: monthStart, end: monthEnd })
    )
    .reduce((sum, customer) => sum + customer.solarCapacity, 0);

  const pendingInstallations = tasks.filter(task => 
    task.type === 'installation' && task.status !== 'completed'
  ).length;

  const lowStockProducts = products.filter(product => 
    product.quantity <= product.minThreshold
  ).length;

  const monthlyRevenue = invoices
    .filter(invoice => 
      isWithinInterval(new Date(invoice.createdAt), { start: monthStart, end: monthEnd })
    )
    .reduce((sum, invoice) => sum + invoice.finalAmount, 0);

  const stats = [
    {
      name: 'Installations This Month',
      value: completedInstallationsThisMonth,
      icon: CheckSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'kW Installed (Month)',
      value: `${totalKwThisMonth.toFixed(1)} kW`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Monthly Revenue',
      value: `₹${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const alerts = [
    ...(lowStockProducts > 0 ? [{
      type: 'warning' as const,
      message: `${lowStockProducts} product${lowStockProducts > 1 ? 's' : ''} running low on stock`,
      action: 'View Inventory'
    }] : []),
    ...(pendingInstallations > 0 ? [{
      type: 'info' as const,
      message: `${pendingInstallations} installation${pendingInstallations > 1 ? 's' : ''} pending`,
      action: 'View Tasks'
    }] : [])
  ];

  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Spectra Solar Solutions Dashboard</h1>
            <p className="mt-2 text-blue-100">
              {format(currentMonth, 'MMMM yyyy')} - Monitor your solar installation business performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src="/SPECTRA_LOGO_NEW.png" 
              alt="Spectra Solar Solutions" 
              className="h-16 w-auto"
            />
            <div className="text-white">
              <div className="text-xl font-bold">SPECTRA</div>
              <div className="text-sm text-blue-100">Solar Solutions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`rounded-md p-4 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-sm ${
                    alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button className={`text-sm font-medium ${
                    alert.type === 'warning' ? 'text-yellow-700 hover:text-yellow-600' : 'text-blue-700 hover:text-blue-600'
                  }`}>
                    {alert.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Customers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentCustomers.length > 0 ? (
              recentCustomers.map((customer) => (
                <div key={customer.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{customer.solarCapacity} kW</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(customer.createdAt), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No customers yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Tasks</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.customerName}</p>
                      <p className="text-sm text-gray-500 capitalize">{task.type}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        task.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(task.scheduledDate), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No upcoming tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;