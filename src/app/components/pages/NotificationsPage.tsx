import { Bell, Package, DollarSign, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function NotificationsPage() {
  const notifications = [
    { 
      id: 1, 
      type: 'order', 
      title: 'New Order Received', 
      message: 'Order #TO-009 from Emily Davis has been placed',
      time: '5 minutes ago',
      read: false,
      icon: Package,
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      type: 'payment', 
      title: 'Payment Received', 
      message: 'Payment of $890 received for Invoice #INV-002',
      time: '1 hour ago',
      read: false,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    { 
      id: 3, 
      type: 'alert', 
      title: 'Low Stock Alert', 
      message: 'Thread - Black is running low (12 spools remaining)',
      time: '2 hours ago',
      read: false,
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    },
    { 
      id: 4, 
      type: 'success', 
      title: 'Order Completed', 
      message: 'Order #TO-008 has been completed and is ready for pickup',
      time: '3 hours ago',
      read: true,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    { 
      id: 5, 
      type: 'info', 
      title: 'Measurement Updated', 
      message: 'Customer measurements for John Doe have been updated',
      time: '5 hours ago',
      read: true,
      icon: Info,
      color: 'bg-blue-500'
    },
    { 
      id: 6, 
      type: 'alert', 
      title: 'Overdue Invoice', 
      message: 'Invoice #INV-004 is overdue by 3 days',
      time: '1 day ago',
      read: true,
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    { 
      id: 7, 
      type: 'order', 
      title: 'Order Status Update', 
      message: 'Order #TO-006 has moved to Fitting stage',
      time: '1 day ago',
      read: true,
      icon: Package,
      color: 'bg-blue-500'
    },
    { 
      id: 8, 
      type: 'info', 
      title: 'New Design Added', 
      message: 'Maria Garcia added a new design to the gallery',
      time: '2 days ago',
      read: true,
      icon: Info,
      color: 'bg-purple-500'
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`${notification.color} p-3 rounded-lg flex-shrink-0`}>
                <notification.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Notification Settings</h4>
          <p className="text-sm text-blue-700 mt-1">
            Customize your notification preferences in Settings to control which alerts you receive.
          </p>
        </div>
      </div>
    </div>
  );
}
