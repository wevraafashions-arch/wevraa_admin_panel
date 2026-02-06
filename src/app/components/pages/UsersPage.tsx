import { useState } from 'react';
import { Plus, Search, Shield, Mail, Edit, Trash2, X, Eye, EyeOff } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Product & E-commerce Manager' | 'Tailors Manager' | 'Design Manager';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdDate: string;
}

interface Role {
  name: 'Admin' | 'Product & E-commerce Manager' | 'Tailors Manager' | 'Design Manager';
  description: string;
  permissions: string[];
  color: string;
}

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Product & E-commerce Manager' as User['role'],
    status: 'Active' as User['status'],
  });

  const roles: Role[] = [
    {
      name: 'Admin',
      description: 'Full system access with all permissions',
      permissions: [
        'Dashboard - View & Manage',
        'E-commerce - Full Access (Orders, Products, Inventory, Customers, Categories, Collections)',
        'Tailoring - Full Access (Tailors, Orders, Customers, Categories, Measurements, Design Gallery)',
        'Payments - View & Manage All Payments',
        'Users & Roles - Create, Edit, Delete Users',
        'Locations - Manage All Locations',
        'Notifications - Send & Manage',
        'Audit Logs - View All Activities',
        'Settings - Modify System Settings',
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      name: 'Product & E-commerce Manager',
      description: 'Manages products, inventory, and e-commerce operations',
      permissions: [
        'Dashboard - View Only',
        'Products - Create, Edit, Delete',
        'Inventory - Manage Stock Levels',
        'E-commerce Orders - View, Update Status',
        'Customers - View & Manage',
        'Categories - Create, Edit, Delete',
        'Collections - Create, Edit, Delete',
        'Payments - View E-commerce Payments Only',
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      name: 'Tailors Manager',
      description: 'Manages tailors, tailor orders, and measurements',
      permissions: [
        'Dashboard - View Only',
        'Tailors - Create, Edit, Delete',
        'Tailor Orders - View, Create, Update',
        'Tailor Customers - View & Manage',
        'Tailor Categories - Manage Categories',
        'Measurements - View, Edit, Add New',
        'Tailor Payments - View & Update',
      ],
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    {
      name: 'Design Manager',
      description: 'Manages design gallery and visual content',
      permissions: [
        'Dashboard - View Only',
        'Design Gallery - Upload, Edit, Delete Designs',
        'Tailor Categories - View Only',
        'Measurements - View Only',
      ],
      color: 'bg-orange-100 text-orange-800 border-orange-200',
    },
  ];

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Raaghu',
      email: 'raaghu@wevraa.com',
      phone: '+91 98765 43210',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-12 10:30 AM',
      createdDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@wevraa.com',
      phone: '+91 99876 54321',
      role: 'Product & E-commerce Manager',
      status: 'Active',
      lastLogin: '2024-01-12 09:15 AM',
      createdDate: '2023-03-20',
    },
    {
      id: 3,
      name: 'Anita Desai',
      email: 'anita.desai@wevraa.com',
      phone: '+91 97654 32109',
      role: 'Tailors Manager',
      status: 'Active',
      lastLogin: '2024-01-12 08:45 AM',
      createdDate: '2023-02-10',
    },
    {
      id: 4,
      name: 'Vikram Singh',
      email: 'vikram.singh@wevraa.com',
      phone: '+91 96543 21098',
      role: 'Design Manager',
      status: 'Active',
      lastLogin: '2024-01-11 05:30 PM',
      createdDate: '2023-04-05',
    },
    {
      id: 5,
      name: 'Lakshmi Iyer',
      email: 'lakshmi.iyer@wevraa.com',
      phone: '+91 95432 10987',
      role: 'Product & E-commerce Manager',
      status: 'Active',
      lastLogin: '2024-01-12 11:00 AM',
      createdDate: '2023-05-12',
    },
    {
      id: 6,
      name: 'Arjun Reddy',
      email: 'arjun.reddy@wevraa.com',
      phone: '+91 94321 09876',
      role: 'Tailors Manager',
      status: 'Inactive',
      lastLogin: '2024-01-08 03:20 PM',
      createdDate: '2023-06-18',
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    return role?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleCount = (roleName: string) => {
    return users.filter(u => u.role === roleName).length;
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    const userData: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status,
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, userData]);
    resetModal();
  };

  const handleUpdateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingUserId !== null) {
      const updatedUsers = users.map(user =>
        user.id === editingUserId
          ? { ...user, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, status: newUser.status }
          : user
      );
      setUsers(updatedUsers);
    }

    resetModal();
  };

  const handleEditUser = (userId: number) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setIsEditMode(true);
      setEditingUserId(userId);
      setNewUser({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        password: '',
        role: userToEdit.role,
        status: userToEdit.status,
      });
      setShowAddModal(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingUserId(null);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'Product & E-commerce Manager',
      status: 'Active',
    });
  };

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users & Roles</h1>
          <p className="text-sm text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {users.filter(u => u.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Inactive Users</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {users.filter(u => u.status === 'Inactive').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Roles</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{roles.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.name} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Roles</h3>
          </div>
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.name}
                className={`p-4 border-2 rounded-lg hover:shadow-md transition-shadow ${getRoleColor(role.name)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{role.name}</h4>
                    <p className="text-xs opacity-80 mb-2">{role.description}</p>
                  </div>
                  <span className="text-sm font-medium ml-2">{getRoleCount(role.name)}</span>
                </div>
                <button
                  onClick={() => handleViewPermissions(role)}
                  className="text-xs font-medium underline hover:no-underline"
                >
                  View Permissions
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={resetModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@wevraa.com"
                />
              </div>

              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map(role => (
                      <option key={role.name} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Role Description */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Role Description:</p>
                <p className="text-sm text-blue-800">
                  {roles.find(r => r.name === newUser.role)?.description}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={resetModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateUser : handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditMode ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedRole.name}</h2>
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowPermissionsModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Permissions:</h3>
              <div className="space-y-2">
                {selectedRole.permissions.map((permission, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{permission}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}