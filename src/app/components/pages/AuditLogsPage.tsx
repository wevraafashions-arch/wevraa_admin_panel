import { Search, Filter, FileText } from 'lucide-react';

export function AuditLogsPage() {
  const logs = [
    { id: 1, timestamp: '2026-01-12 10:45:23', user: 'Admin User', action: 'Created Order', details: 'Order #TO-009 created for Emily Davis', category: 'Order' },
    { id: 2, timestamp: '2026-01-12 10:30:15', user: 'Maria Garcia', action: 'Updated Status', details: 'Changed order #TO-006 status to Fitting', category: 'Order' },
    { id: 3, timestamp: '2026-01-12 09:15:42', user: 'Sales Manager', action: 'Payment Recorded', details: 'Payment of $890 recorded for Invoice #INV-002', category: 'Payment' },
    { id: 4, timestamp: '2026-01-12 08:45:30', user: 'Robert Chen', action: 'Updated Measurements', details: 'Updated measurements for John Doe', category: 'Customer' },
    { id: 5, timestamp: '2026-01-12 08:20:18', user: 'Admin User', action: 'Added User', details: 'New user account created for Support Staff', category: 'System' },
    { id: 6, timestamp: '2026-01-11 17:30:55', user: 'Linda Park', action: 'Added Design', details: 'New design "Tailored Coat" added to gallery', category: 'Design' },
    { id: 7, timestamp: '2026-01-11 16:45:22', user: 'Admin User', action: 'Updated Inventory', details: 'Restocked Silk Fabric - White (50 yards)', category: 'Inventory' },
    { id: 8, timestamp: '2026-01-11 15:20:10', user: 'Sales Manager', action: 'Created Invoice', details: 'Invoice #INV-008 created for Lisa Anderson', category: 'Invoice' },
    { id: 9, timestamp: '2026-01-11 14:10:33', user: 'Maria Garcia', action: 'Completed Order', details: 'Order #TO-008 marked as completed', category: 'Order' },
    { id: 10, timestamp: '2026-01-11 13:05:45', user: 'Admin User', action: 'Updated Product', details: 'Price updated for Classic Navy Suit', category: 'Product' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Audit Logs</h2>
        <p className="text-sm text-gray-600 mt-1">Track all system activities and changes</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Order</option>
            <option>Payment</option>
            <option>Customer</option>
            <option>System</option>
            <option>Design</option>
            <option>Inventory</option>
            <option>Invoice</option>
            <option>Product</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {log.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1 to 10 of 1,247 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Data Retention</h4>
          <p className="text-sm text-blue-700 mt-1">
            Audit logs are retained for 90 days. Export logs regularly for long-term record keeping.
          </p>
        </div>
      </div>
    </div>
  );
}
