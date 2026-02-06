import { Plus, Search, Mail, Phone, Ruler } from 'lucide-react';

export function TailorCustomersPage() {
  const customers = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91 98765-43210', measurements: 'Complete', lastOrder: '2026-01-10', totalOrders: 8 },
    { id: 2, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 98765-43211', measurements: 'Complete', lastOrder: '2026-01-08', totalOrders: 12 },
    { id: 3, name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91 98765-43212', measurements: 'Partial', lastOrder: '2026-01-05', totalOrders: 3 },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 98765-43213', measurements: 'Complete', lastOrder: '2026-01-11', totalOrders: 15 },
    { id: 5, name: 'Vikram Singh', email: 'v.singh@email.com', phone: '+91 98765-43214', measurements: 'None', lastOrder: 'Never', totalOrders: 0 },
    { id: 6, name: 'Ananya Desai', email: 'ananya.d@email.com', phone: '+91 98765-43215', measurements: 'Complete', lastOrder: '2026-01-09', totalOrders: 20 },
    { id: 7, name: 'Arjun Mehta', email: 'arjun.m@email.com', phone: '+91 98765-43216', measurements: 'Complete', lastOrder: '2026-01-07', totalOrders: 6 },
    { id: 8, name: 'Kavya Iyer', email: 'kavya.iyer@email.com', phone: '+91 98765-43217', measurements: 'Partial', lastOrder: '2026-01-06', totalOrders: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Tailor Customers</h2>
          <p className="text-sm text-gray-600 mt-1">Manage customer profiles and measurements</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurements</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                      customer.measurements === 'Complete' 
                        ? 'bg-green-100 text-green-800' 
                        : customer.measurements === 'Partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Ruler className="w-3 h-3" />
                      {customer.measurements}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.lastOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{customer.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Measure</button>
                    <button className="text-gray-600 hover:text-gray-900">View</button>
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