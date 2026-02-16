import { useState, useEffect, useCallback } from 'react';
import { Package, AlertTriangle, TrendingUp, Plus, X, Search } from 'lucide-react';
import { inventoryService } from '../../api/services/inventoryService';
import type { InventoryItem } from '../../api/types/inventory';

type StockStatus = 'Good' | 'Low' | 'Critical';

const UNIT_OPTIONS = [
  { value: 'METERS', label: 'Meters' },
  { value: 'KILOGRAMS', label: 'Kilograms' },
  { value: 'GRAMS', label: 'Grams' },
  { value: 'PIECES', label: 'Pieces' },
  { value: 'LITERS', label: 'Liters' },
  { value: 'UNITS', label: 'Units' },
  { value: 'BOXES', label: 'Boxes' },
  { value: 'ROLLS', label: 'Rolls' },
];

export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  const [newItem, setNewItem] = useState({
    itemName: '',
    sku: '',
    quantity: 0,
    unit: 'METERS',
    reorderLevel: 10,
  });

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await inventoryService.getList();
      setInventoryItems(list);
    } catch (e) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Failed to load inventory';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (
    quantity: number,
    reorderLevel: number
  ): StockStatus => {
    if (quantity <= reorderLevel * 0.5) return 'Critical';
    if (quantity <= reorderLevel) return 'Low';
    return 'Good';
  };

  const handleRestock = () => {
    if (selectedItem && restockQuantity > 0) {
      const updatedItems = inventoryItems.map((item) => {
        if (item.id === selectedItem.id) {
          const newQuantity = item.quantity + restockQuantity;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setInventoryItems(updatedItems);
      setShowRestockModal(false);
      setRestockQuantity(0);
      setSelectedItem(null);
    }
  };

  const handleAdjust = () => {
    if (selectedItem && adjustReason.trim()) {
      const updatedItems = inventoryItems.map((item) => {
        if (item.id === selectedItem.id) {
          const newQuantity = Math.max(0, adjustQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setInventoryItems(updatedItems);
      setShowAdjustModal(false);
      setAdjustQuantity(0);
      setAdjustReason('');
      setSelectedItem(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSubmitting(true);
    try {
      const created = await inventoryService.create({
        itemName: newItem.itemName,
        sku: newItem.sku,
        quantity: newItem.quantity,
        unit: newItem.unit,
        reorderLevel: newItem.reorderLevel,
      });
      setInventoryItems((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewItem({
        itemName: '',
        sku: '',
        quantity: 0,
        unit: 'METERS',
        reorderLevel: 10,
      });
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to add item';
      setError(message);
    } finally {
      setAddSubmitting(false);
    }
  };

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventoryItems.filter(
    (item) => getStatus(item.quantity, item.reorderLevel) === 'Low'
  ).length;
  const criticalStockItems = inventoryItems.filter(
    (item) => getStatus(item.quantity, item.reorderLevel) === 'Critical'
  ).length;

  const stats = [
    { label: 'Total Items', value: totalItems.toString(), icon: Package, color: 'bg-blue-500' },
    { label: 'Low Stock Items', value: lowStockItems.toString(), icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Restock Required', value: criticalStockItems.toString(), icon: TrendingUp, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Inventory Management</h2>
          <p className="text-sm text-gray-600 mt-1">Track materials and supplies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">Loading inventory...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const status = getStatus(item.quantity, item.reorderLevel);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.quantity} {item.unit.toLowerCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.reorderLevel} {item.unit.toLowerCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            status === 'Good'
                              ? 'bg-green-100 text-green-800'
                              : status === 'Low'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setRestockQuantity(0);
                            setShowRestockModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setAdjustQuantity(item.quantity);
                            setAdjustReason('');
                            setShowAdjustModal(true);
                          }}
                          className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Restock Item</h3>
              <button
                onClick={() => {
                  setShowRestockModal(false);
                  setSelectedItem(null);
                  setRestockQuantity(0);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Item</p>
                <p className="font-semibold text-gray-900">{selectedItem.itemName}</p>
                <p className="text-sm text-gray-600 mt-2">Current Stock</p>
                <p className="font-semibold text-gray-900">{selectedItem.quantity} {selectedItem.unit.toLowerCase()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>
              {restockQuantity > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">New Stock Level</p>
                  <p className="text-2xl font-semibold text-green-700">
                    {selectedItem.quantity + restockQuantity} {selectedItem.unit.toLowerCase()}
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRestockModal(false);
                    setSelectedItem(null);
                    setRestockQuantity(0);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestock}
                  disabled={restockQuantity <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Adjust Inventory</h3>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedItem(null);
                  setAdjustQuantity(0);
                  setAdjustReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Item</p>
                <p className="font-semibold text-gray-900">{selectedItem.itemName}</p>
                <p className="text-sm text-gray-600 mt-2">Current Stock</p>
                <p className="font-semibold text-gray-900">{selectedItem.quantity} {selectedItem.unit.toLowerCase()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Adjustment *
                </label>
                <textarea
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Damaged stock, Inventory count correction, etc."
                />
              </div>
              {adjustQuantity !== selectedItem.quantity && (
                <div className={`p-4 rounded-lg ${adjustQuantity > selectedItem.quantity ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className="text-sm text-gray-600">Adjustment</p>
                  <p className={`text-lg font-semibold ${adjustQuantity > selectedItem.quantity ? 'text-green-700' : 'text-yellow-700'}`}>
                    {adjustQuantity > selectedItem.quantity ? '+' : ''}{adjustQuantity - selectedItem.quantity} {selectedItem.unit.toLowerCase()}
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedItem(null);
                    setAdjustQuantity(0);
                    setAdjustReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjust}
                  disabled={!adjustReason.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add Inventory Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Silk Fabric - Red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., FAB-101"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Level *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newItem.reorderLevel}
                  onChange={(e) => setNewItem({ ...newItem, reorderLevel: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum stock level"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={addSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addSubmitting ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
