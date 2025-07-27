import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  const { customers, tasks, invoices, products } = useData();

  // Generate last 6 months data
  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date()
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const completedInstallations = tasks.filter(task => 
        task.type === 'installation' && 
        task.status === 'completed' && 
        task.completedDate &&
        isWithinInterval(new Date(task.completedDate), { start: monthStart, end: monthEnd })
      ).length;

      const totalKw = customers
        .filter(customer => 
          customer.installationDate &&
          isWithinInterval(new Date(customer.installationDate), { start: monthStart, end: monthEnd })
        )
        .reduce((sum, customer) => sum + customer.solarCapacity, 0);

      const revenue = invoices
        .filter(invoice => 
          isWithinInterval(new Date(invoice.createdAt), { start: monthStart, end: monthEnd })
        )
        .reduce((sum, invoice) => sum + invoice.finalAmount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        installations: completedInstallations,
        totalKw: parseFloat(totalKw.toFixed(1)),
        revenue: revenue
      };
    });
  }, [customers, tasks, invoices]);

  // Product category distribution
  const categoryData = useMemo(() => {
    const categories = products.reduce((acc, product) => {
      const category = product.category || 'Other';
      acc[category] = (acc[category] || 0) + product.quantity * product.unitCost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, value]) => ({
      name: category,
      value: Math.round(value)
    }));
  }, [products]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Calculate current month stats
  const currentMonth = new Date();
  const currentMonthStart = startOfMonth(currentMonth);
  const currentMonthEnd = endOfMonth(currentMonth);

  const currentMonthStats = {
    installations: tasks.filter(task => 
      task.type === 'installation' && 
      task.status === 'completed' && 
      task.completedDate &&
      isWithinInterval(new Date(task.completedDate), { start: currentMonthStart, end: currentMonthEnd })
    ).length,
    totalKw: customers
      .filter(customer => 
        customer.installationDate &&
        isWithinInterval(new Date(customer.installationDate), { start: currentMonthStart, end: currentMonthEnd })
      )
      .reduce((sum, customer) => sum + customer.solarCapacity, 0),
    revenue: invoices
      .filter(invoice => 
        isWithinInterval(new Date(invoice.createdAt), { start: currentMonthStart, end: currentMonthEnd })
      )
      .reduce((sum, invoice) => sum + invoice.finalAmount, 0),
    customers: customers.filter(customer =>
      isWithinInterval(new Date(customer.createdAt), { start: currentMonthStart, end: currentMonthEnd })
    ).length
  };

  const stats = [
    {
      name: 'Total Customers',
      value: customers.length,
      thisMonth: currentMonthStats.customers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Installations (Month)',
      value: currentMonthStats.installations,
      thisMonth: currentMonthStats.installations,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total kW Installed',
      value: `${currentMonthStats.totalKw.toFixed(1)} kW`,
      thisMonth: currentMonthStats.totalKw,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Monthly Revenue',
      value: `₹${currentMonthStats.revenue.toLocaleString()}`,
      thisMonth: currentMonthStats.revenue,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Monitor your solar installation business performance and trends
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Installations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Installations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="installations" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly kW Installed */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly kW Installed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} kW`, 'Total kW']} />
              <Line type="monotone" dataKey="totalKw" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Value by Category */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Value by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80">
              <p className="text-gray-500">No inventory data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Total Installations Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {customers.reduce((sum, c) => sum + c.solarCapacity, 0).toFixed(1)} kW
            </div>
            <div className="text-sm text-gray-500">Total Solar Capacity Installed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₹{invoices.reduce((sum, i) => sum + i.finalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Revenue Generated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;