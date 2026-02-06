import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Scissors,
  UserCircle,
  Package,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';

export function DashboardPage() {
  const stats = [
    {
      label: 'E-commerce Customers',
      value: '1,842',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500',
      description: 'Total online customers',
    },
    {
      label: 'Tailor Customers',
      value: '567',
      change: '+22.8%',
      trend: 'up',
      icon: UserCircle,
      color: 'bg-purple-500',
      description: 'Custom tailoring clients',
    },
    {
      label: 'Active Tailors',
      value: '24',
      change: '+12.5%',
      trend: 'up',
      icon: Scissors,
      color: 'bg-green-500',
      description: 'Tailors on the team',
    },
    {
      label: 'E-commerce Orders',
      value: '3,456',
      change: '+18.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-orange-500',
      description: 'Total online orders',
    },
  ];

  const tailorGrowthData = [
    { month: 'Jan', tailors: 18, orders: 145 },
    { month: 'Feb', tailors: 19, orders: 168 },
    { month: 'Mar', tailors: 20, orders: 192 },
    { month: 'Apr', tailors: 21, orders: 215 },
    { month: 'May', tailors: 22, orders: 238 },
    { month: 'Jun', tailors: 24, orders: 267 },
  ];

  const ecommerceOrders = [
    { 
      id: 'EC-ORD-2024-001', 
      customer: 'Priya Sharma', 
      items: 2,
      products: 'Silk Saree, Blouse Piece',
      status: 'Delivered', 
      amount: 5300,
      date: '2024-01-10'
    },
    { 
      id: 'EC-ORD-2024-002', 
      customer: 'Rajesh Kumar', 
      items: 3,
      products: 'Cotton Kurta Set (x2), Ethnic Jacket',
      status: 'Shipped', 
      amount: 5800,
      date: '2024-01-10'
    },
    { 
      id: 'EC-ORD-2024-003', 
      customer: 'Anita Desai', 
      items: 2,
      products: 'Designer Lehenga, Embroidered Dupatta',
      status: 'Processing', 
      amount: 15000,
      date: '2024-01-12'
    },
    { 
      id: 'EC-ORD-2024-004', 
      customer: 'Vikram Singh', 
      items: 5,
      products: 'Formal Shirt (x3), Black Trousers (x2)',
      status: 'Processing', 
      amount: 6600,
      date: '2024-01-11'
    },
    { 
      id: 'EC-ORD-2024-005', 
      customer: 'Suresh Patel', 
      items: 6,
      products: 'Cotton Shirts (x4), Blue Jeans (x2)',
      status: 'Delivered', 
      amount: 7200,
      date: '2024-01-07'
    },
    { 
      id: 'EC-ORD-2024-006', 
      customer: 'Divya Nair', 
      items: 3,
      products: 'Anarkali Suit, Palazzo Pants (x2)',
      status: 'Received', 
      amount: 5900,
      date: '2024-01-12'
    },
  ];

  const orderStatusStats = {
    received: 45,
    processing: 32,
    shipped: 28,
    delivered: 156,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received':
        return 'bg-purple-100 text-purple-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received':
        return <Clock className="w-3 h-3" />;
      case 'Processing':
        return <Package className="w-3 h-3" />;
      case 'Shipped':
        return <Truck className="w-3 h-3" />;
      case 'Delivered':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const maxOrders = Math.max(...tailorGrowthData.map(d => d.orders));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with Wevraa.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tailors Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tailors Growth</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly tailor count and order volume</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Tailors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Orders</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tailorGrowthData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">{data.month}</span>
                    <div className="flex-1 mx-4 space-y-1">
                      {/* Tailors Bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                          <div 
                            className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500 hover:bg-green-600"
                            style={{ width: `${(data.tailors / 24) * 100}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{data.tailors}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-16">Tailors</span>
                      </div>
                      {/* Orders Bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500 hover:bg-blue-600"
                            style={{ width: `${(data.orders / maxOrders) * 100}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{data.orders}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-16">Orders</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* E-commerce Order Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">E-commerce Order Status</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current order breakdown</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Received</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">New orders</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{orderStatusStats.received}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Processing</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Being prepared</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{orderStatusStats.processing}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Shipped</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">In transit</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{orderStatusStats.shipped}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Delivered</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{orderStatusStats.delivered}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Orders:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderStatusStats.received + orderStatusStats.processing + orderStatusStats.shipped + orderStatusStats.delivered}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-commerce Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent E-commerce Orders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest orders from online customers</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Orders →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {ecommerceOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{order.customer}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{order.products}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{order.items} items</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}