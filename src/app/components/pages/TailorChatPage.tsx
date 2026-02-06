import { useState } from 'react';
import { MessageCircle, User, Send, FileText, CheckCircle, Clock, XCircle, Receipt, Eye, Package, IndianRupee, Calculator } from 'lucide-react';

interface Message {
  id: number;
  sender: 'customer' | 'tailor';
  text: string;
  timestamp: string;
  orderDetails?: OrderDetails;
  quotation?: Quotation;
}

interface OrderDetails {
  itemType: string;
  fabric: string;
  measurements: {
    chest?: string;
    waist?: string;
    length?: string;
    shoulder?: string;
  };
  specialInstructions?: string;
  images?: string[];
}

interface Quotation {
  itemType: string;
  baseCost: number;
  fabricCost?: number;
  embroideryWork?: number;
  liningCost?: number;
  otherCharges?: number;
  totalAmount: number;
  deliveryDays: number;
  validUntil: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

interface Chat {
  id: number;
  customerName: string;
  customerIcon: string;
  tailorName: string;
  lastMessage: string;
  timestamp: string;
  status: 'New' | 'In Progress' | 'Invoice Created' | 'Completed' | 'Cancelled';
  unreadCount: number;
  messages: Message[];
  hasOrderDetails: boolean;
  invoiceId?: string; // Added to track invoice
  invoiceNumber?: string; // Added for display
}

const mockChats: Chat[] = [
  {
    id: 1,
    customerName: 'Priya Sharma',
    customerIcon: 'PS',
    tailorName: 'Ramesh Kumar',
    lastMessage: 'Thank you! I accept the quotation',
    timestamp: '2026-01-13 10:30 AM',
    status: 'In Progress',
    unreadCount: 0,
    hasOrderDetails: true,
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Namaste! I need a custom lehenga for my wedding.',
        timestamp: '2026-01-13 10:15 AM'
      },
      {
        id: 2,
        sender: 'customer',
        text: 'Here are the order details:',
        timestamp: '2026-01-13 10:16 AM',
        orderDetails: {
          itemType: 'Bridal Lehenga',
          fabric: 'Silk with heavy embroidery',
          measurements: {
            waist: '28 inches',
            length: '42 inches'
          },
          specialInstructions: 'Red and gold color combination, heavy zari work on borders'
        }
      },
      {
        id: 3,
        sender: 'tailor',
        text: 'Thank you for sharing the details. Here is the quotation:',
        timestamp: '2026-01-13 10:20 AM',
        quotation: {
          itemType: 'Bridal Lehenga',
          baseCost: 25000,
          fabricCost: 15000,
          embroideryWork: 10000,
          liningCost: 3000,
          otherCharges: 2000,
          totalAmount: 55000,
          deliveryDays: 21,
          validUntil: '2026-01-20',
          status: 'Accepted'
        }
      },
      {
        id: 4,
        sender: 'customer',
        text: 'Thank you! I accept the quotation. Please proceed with the work.',
        timestamp: '2026-01-13 10:30 AM'
      }
    ]
  },
  {
    id: 2,
    customerName: 'Rahul Verma',
    customerIcon: 'RV',
    tailorName: 'Suresh Tailors',
    lastMessage: 'Waiting for response on quotation',
    timestamp: '2026-01-13 09:45 AM',
    status: 'New',
    unreadCount: 1,
    hasOrderDetails: true,
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Can you stitch a sherwani for next week?',
        timestamp: '2026-01-13 09:30 AM',
        orderDetails: {
          itemType: 'Wedding Sherwani',
          fabric: 'Banarasi Silk',
          measurements: {
            chest: '40 inches',
            waist: '34 inches',
            shoulder: '17 inches',
            length: '42 inches'
          },
          specialInstructions: 'Cream color with golden buttons'
        }
      },
      {
        id: 2,
        sender: 'tailor',
        text: 'Here is the quotation for your sherwani:',
        timestamp: '2026-01-13 09:45 AM',
        quotation: {
          itemType: 'Wedding Sherwani',
          baseCost: 18000,
          fabricCost: 8000,
          embroideryWork: 0,
          liningCost: 2000,
          otherCharges: 1000,
          totalAmount: 29000,
          deliveryDays: 7,
          validUntil: '2026-01-18',
          status: 'Pending'
        }
      }
    ]
  },
  {
    id: 3,
    customerName: 'Ananya Patel',
    customerIcon: 'AP',
    tailorName: 'Designer Boutique',
    lastMessage: 'Invoice received, thank you!',
    timestamp: '2026-01-12 05:20 PM',
    status: 'Invoice Created',
    unreadCount: 0,
    hasOrderDetails: true,
    invoiceId: 'INV-2026-003',
    invoiceNumber: 'INV-2026-003',
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'I need 3 salwar suits for office wear',
        timestamp: '2026-01-12 02:00 PM',
        orderDetails: {
          itemType: 'Salwar Suit Set (3 pieces)',
          fabric: 'Cotton blend',
          measurements: {
            chest: '36 inches',
            waist: '30 inches',
            length: '38 inches'
          },
          specialInstructions: 'Simple designs, pastel colors'
        }
      },
      {
        id: 2,
        sender: 'tailor',
        text: 'Here is your quotation:',
        timestamp: '2026-01-12 03:00 PM',
        quotation: {
          itemType: 'Salwar Suit Set (3 pieces)',
          baseCost: 6000,
          fabricCost: 3000,
          embroideryWork: 0,
          liningCost: 0,
          otherCharges: 500,
          totalAmount: 9500,
          deliveryDays: 5,
          validUntil: '2026-01-17',
          status: 'Accepted'
        }
      },
      {
        id: 3,
        sender: 'customer',
        text: 'Accepted! Please proceed.',
        timestamp: '2026-01-12 04:00 PM'
      },
      {
        id: 4,
        sender: 'tailor',
        text: 'Invoice has been created. Total: ₹9,500',
        timestamp: '2026-01-12 05:20 PM'
      }
    ]
  },
  {
    id: 4,
    customerName: 'Vikram Singh',
    customerIcon: 'VS',
    tailorName: 'Modern Tailors',
    lastMessage: 'Order completed and delivered',
    timestamp: '2026-01-11 03:15 PM',
    status: 'Completed',
    unreadCount: 0,
    hasOrderDetails: true,
    invoiceId: 'INV-2026-004',
    invoiceNumber: 'INV-2026-004',
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Need alteration for 2 kurtas',
        timestamp: '2026-01-10 11:00 AM',
        orderDetails: {
          itemType: 'Kurta Alteration',
          fabric: 'Existing kurtas',
          measurements: {
            length: 'Shorten by 2 inches'
          },
          specialInstructions: 'Make sleeves slimmer'
        }
      },
      {
        id: 2,
        sender: 'tailor',
        text: 'Alterations completed. Ready for pickup.',
        timestamp: '2026-01-11 03:15 PM'
      }
    ]
  },
  {
    id: 5,
    customerName: 'Sneha Gupta',
    customerIcon: 'SG',
    tailorName: 'Elite Tailors',
    lastMessage: 'Looking for designer blouses',
    timestamp: '2026-01-13 08:00 AM',
    status: 'New',
    unreadCount: 1,
    hasOrderDetails: true,
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Looking for designer blouses for 5 sarees',
        timestamp: '2026-01-13 08:00 AM',
        orderDetails: {
          itemType: 'Designer Blouse (5 pieces)',
          fabric: 'Mix of silk and cotton',
          measurements: {
            chest: '34 inches',
            length: '15 inches'
          },
          specialInstructions: 'Different neck designs for each'
        }
      }
    ]
  }
];

export function TailorChatPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'In Progress' | 'Invoice Created' | 'Completed'>('All');

  const filteredChats = chats.filter(chat => 
    filterStatus === 'All' || chat.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <Clock className="w-4 h-4" />;
      case 'In Progress':
        return <MessageCircle className="w-4 h-4" />;
      case 'Invoice Created':
        return <Receipt className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Invoice Created':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInvoice = (chat: Chat) => {
    const updatedChats = chats.map(c => 
      c.id === chat.id ? { ...c, status: 'Invoice Created' as const } : c
    );
    setChats(updatedChats);
    
    if (selectedChat && selectedChat.id === chat.id) {
      setSelectedChat({ ...selectedChat, status: 'Invoice Created' });
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: selectedChat.messages.length + 1,
      sender: 'tailor',
      text: messageText,
      timestamp: new Date().toLocaleString('en-IN', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastMessage: messageText
    };

    setChats(chats.map(c => c.id === selectedChat.id ? updatedChat : c));
    setSelectedChat(updatedChat);
    setMessageText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tailor Chat Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer orders and conversations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Total Chats</div>
          <div className="text-2xl font-semibold text-gray-900">{chats.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">New Requests</div>
          <div className="text-2xl font-semibold text-blue-600">
            {chats.filter(c => c.status === 'New').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">In Progress</div>
          <div className="text-2xl font-semibold text-yellow-600">
            {chats.filter(c => c.status === 'In Progress').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Invoices Created</div>
          <div className="text-2xl font-semibold text-purple-600">
            {chats.filter(c => c.status === 'Invoice Created').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Completed</div>
          <div className="text-2xl font-semibold text-green-600">
            {chats.filter(c => c.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          {(['All', 'New', 'In Progress', 'Invoice Created', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Conversations</h3>
          </div>
          <div className="overflow-y-auto max-h-[600px]">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {chat.customerIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{chat.customerName}</h4>
                      {chat.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Tailor: {chat.tailorName}</p>
                    <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(chat.status)}`}>
                        {getStatusIcon(chat.status)}
                        {chat.status}
                      </span>
                      {chat.hasOrderDetails && (
                        <Package className="w-4 h-4 text-blue-500" title="Has order details" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {selectedChat.customerIcon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedChat.customerName}</h3>
                      <p className="text-xs text-gray-500">with {selectedChat.tailorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedChat.status)}`}>
                      {getStatusIcon(selectedChat.status)}
                      {selectedChat.status}
                    </span>
                    
                    {/* Invoice Status Display */}
                    {selectedChat.invoiceId ? (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-medium text-purple-900 dark:text-purple-300">
                              {selectedChat.invoiceNumber}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Viewing invoice: ${selectedChat.invoiceNumber}\n\nThis would open the invoice details page.`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Invoice
                        </button>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          No Invoice Created
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {selectedChat.messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex ${message.sender === 'tailor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${message.sender === 'tailor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'tailor' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Order Details Card */}
                    {message.orderDetails && (
                      <div className="mt-2 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 max-w-[70%]">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-900">Order Details</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Item Type:</span>
                            <span className="ml-2 text-gray-900">{message.orderDetails.itemType}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Fabric:</span>
                            <span className="ml-2 text-gray-900">{message.orderDetails.fabric}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Measurements:</span>
                            <div className="ml-2 mt-1 space-y-1">
                              {Object.entries(message.orderDetails.measurements).map(([key, value]) => (
                                <div key={key} className="text-gray-900">
                                  <span className="capitalize">{key}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                          {message.orderDetails.specialInstructions && (
                            <div>
                              <span className="font-medium text-gray-700">Special Instructions:</span>
                              <p className="ml-2 mt-1 text-gray-900">{message.orderDetails.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quotation Card */}
                    {message.quotation && (
                      <div className={`mt-2 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 max-w-[80%] ${message.sender === 'tailor' ? 'ml-auto' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-gray-900">Quotation</h4>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            message.quotation.status === 'Accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : message.quotation.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {message.quotation.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="bg-white rounded-lg p-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Item:</span>
                              <span className="font-medium text-gray-900">{message.quotation.itemType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Base Cost:</span>
                              <span className="text-gray-900">₹{message.quotation.baseCost.toLocaleString('en-IN')}</span>
                            </div>
                            {message.quotation.fabricCost ? (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Fabric Cost:</span>
                                <span className="text-gray-900">₹{message.quotation.fabricCost.toLocaleString('en-IN')}</span>
                              </div>
                            ) : null}
                            {message.quotation.embroideryWork ? (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Embroidery Work:</span>
                                <span className="text-gray-900">₹{message.quotation.embroideryWork.toLocaleString('en-IN')}</span>
                              </div>
                            ) : null}
                            {message.quotation.liningCost ? (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Lining:</span>
                                <span className="text-gray-900">₹{message.quotation.liningCost.toLocaleString('en-IN')}</span>
                              </div>
                            ) : null}
                            {message.quotation.otherCharges ? (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Other Charges:</span>
                                <span className="text-gray-900">₹{message.quotation.otherCharges.toLocaleString('en-IN')}</span>
                              </div>
                            ) : null}
                          </div>
                          
                          <div className="bg-green-100 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-5 h-5 text-green-700" />
                              <span className="font-semibold text-green-900">Total Amount:</span>
                            </div>
                            <span className="text-xl font-bold text-green-700">
                              ₹{message.quotation.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-white rounded p-2 text-center">
                              <div className="text-xs text-gray-600">Delivery</div>
                              <div className="font-semibold text-gray-900">{message.quotation.deliveryDays} days</div>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <div className="text-xs text-gray-600">Valid Until</div>
                              <div className="font-semibold text-gray-900">{message.quotation.validUntil}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}