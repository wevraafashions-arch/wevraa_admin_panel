import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Shield, Mail, Edit, Trash2, X } from 'lucide-react';
import { usersService } from '../../api/services/usersService';
import type { ApiUser } from '../../api/types/user';
import type { CreateUserRequest, UpdateUserRequest } from '../../api/types/user';
import { ConfirmDeleteDialog } from '../ui/ConfirmDeleteDialog';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'SELLER', label: 'Seller', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'CUSTOMER', label: 'Customer', color: 'bg-green-100 text-green-800 border-green-200' },
];

function getRoleColor(roleValue: string) {
  return ROLE_OPTIONS.find((r) => r.value === roleValue)?.color ?? 'bg-gray-100 text-gray-800 border-gray-200';
}

function getRoleLabel(roleValue: string) {
  return ROLE_OPTIONS.find((r) => r.value === roleValue)?.label ?? roleValue;
}

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<(typeof ROLE_OPTIONS)[0] | null>(null);

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formUser, setFormUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'SELLER',
    isActive: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await usersService.getList();
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to load users';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim().toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      (user.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone ?? '').includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleCount = (roleValue: string) => users.filter((u) => u.role === roleValue).length;

  const handleAddUser = async () => {
    if (!formUser.firstName?.trim() || !formUser.lastName?.trim() || !formUser.email?.trim() || !formUser.password) {
      setError('First name, last name, email and password are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: CreateUserRequest = {
        email: formUser.email.trim(),
        password: formUser.password,
        firstName: formUser.firstName.trim(),
        lastName: formUser.lastName.trim(),
        phone: formUser.phone?.trim() || undefined,
        role: formUser.role,
        isActive: formUser.isActive,
      };
      await usersService.create(body);
      resetModal();
      await fetchUsers();
    } catch (e) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to add user';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUserId) return;
    if (!formUser.firstName?.trim() || !formUser.lastName?.trim()) {
      setError('First name and last name are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: UpdateUserRequest = {
        firstName: formUser.firstName.trim(),
        lastName: formUser.lastName.trim(),
        phone: formUser.phone?.trim() || undefined,
        role: formUser.role,
        isActive: formUser.isActive,
      };
      await usersService.update(editingUserId, body);
      resetModal();
      await fetchUsers();
    } catch (e) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to update user';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = (user: ApiUser) => {
    setIsEditMode(true);
    setEditingUserId(user.id);
    setFormUser({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      password: '',
      role: user.role ?? 'SELLER',
      isActive: user.isActive ?? true,
    });
    setShowAddModal(true);
  };

  const openDeleteDialog = (userId: string) => {
    setPendingDeleteUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!pendingDeleteUserId) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await usersService.delete(pendingDeleteUserId);
      setUsers((prev) => prev.filter((u) => u.id !== pendingDeleteUserId));
      setDeleteDialogOpen(false);
      setPendingDeleteUserId(null);
    } catch (e) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to delete user';
      setError(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setEditingUserId(null);
    setFormUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'SELLER',
      isActive: true,
    });
    setError(null);
  };

  const handleViewPermissions = (roleOption: (typeof ROLE_OPTIONS)[0]) => {
    setSelectedRoleForPermissions(roleOption);
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

      {error && !showAddModal && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-600 hover:underline font-medium">Dismiss</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Inactive Users</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {users.filter((u) => !u.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Roles</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{ROLE_OPTIONS.length}</p>
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
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <p className="text-sm text-gray-500">{user.phone ?? '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">—</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>

            {!loading && filteredUsers.length === 0 && (
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
            {ROLE_OPTIONS.map((role) => (
              <div
                key={role.value}
                className={`p-4 border-2 rounded-lg hover:shadow-md transition-shadow ${role.color}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{role.label}</h4>
                  </div>
                  <span className="text-sm font-medium ml-2">{getRoleCount(role.value)}</span>
                </div>
                {/* <button
                  onClick={() => handleViewPermissions(role)}
                  className="text-xs font-medium underline hover:no-underline"
                >
                  View Permissions
                </button> */}
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

            {error && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex justify-between items-center">
                <span>{error}</span>
                <button type="button" onClick={() => setError(null)} className="text-red-600 hover:underline font-medium">Dismiss</button>
              </div>
            )}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formUser.firstName}
                    onChange={(e) => setFormUser({ ...formUser, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formUser.lastName}
                    onChange={(e) => setFormUser({ ...formUser, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formUser.email}
                  onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                  disabled={isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                  placeholder="user@example.com"
                />
                {isEditMode && <p className="text-xs text-gray-500 mt-1">Email cannot be changed when editing.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formUser.phone}
                  onChange={(e) => setFormUser({ ...formUser, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 9123456789"
                />
              </div>

              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={formUser.password}
                    onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
                  <select
                    value={formUser.role}
                    onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formUser.isActive ? 'Active' : 'Inactive'}
                    onChange={(e) => setFormUser({ ...formUser, isActive: e.target.value === 'Active' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={resetModal}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateUser : handleAddUser}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : isEditMode ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedRoleForPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedRoleForPermissions.label}</h2>
                  <p className="text-sm text-gray-600">Role: {selectedRoleForPermissions.value}</p>
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
              <p className="text-sm text-gray-600">
                Permissions for this role are managed by the backend. Users with this role have access as defined in your API.
              </p>
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

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPendingDeleteUserId(null);
        }}
        title="Delete user"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDeleteUser}
        isLoading={deleteLoading}
      />
    </div>
  );
}