import { useState } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface GSTRate {
  id: number;
  name: string;
  percentage: number;
  isDefault: boolean;
}

interface HSNCode {
  id: number;
  code: string;
  description: string;
  gstRate: number;
}

export function TaxSettingsPage() {
  const [activeTab, setActiveTab] = useState<'gst' | 'hsn'>('gst');
  const [showGSTModal, setShowGSTModal] = useState(false);
  const [showHSNModal, setShowHSNModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [gstRates, setGstRates] = useState<GSTRate[]>([
    { id: 1, name: 'GST 5%', percentage: 5, isDefault: false },
    { id: 2, name: 'GST 12%', percentage: 12, isDefault: false },
    { id: 3, name: 'GST 18%', percentage: 18, isDefault: true },
    { id: 4, name: 'GST 28%', percentage: 28, isDefault: false },
  ]);

  const [hsnCodes, setHsnCodes] = useState<HSNCode[]>([
    { id: 1, code: '6217', description: 'Other made up clothing accessories', gstRate: 12 },
    { id: 2, code: '6203', description: 'Men\'s or boys\' suits, ensembles', gstRate: 12 },
    { id: 3, code: '6204', description: 'Women\'s or girls\' suits, ensembles', gstRate: 12 },
    { id: 4, code: '6206', description: 'Women\'s or girls\' blouses, shirts', gstRate: 12 },
    { id: 5, code: '6105', description: 'Men\'s or boys\' shirts, knitted', gstRate: 5 },
  ]);

  const [newGSTRate, setNewGSTRate] = useState({
    name: '',
    percentage: 0,
    isDefault: false,
  });

  const [newHSNCode, setNewHSNCode] = useState({
    code: '',
    description: '',
    gstRate: 0,
  });

  // GST Rate Functions
  const handleAddGSTRate = () => {
    if (!newGSTRate.name || newGSTRate.percentage <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const gstData: GSTRate = {
      id: Math.max(...gstRates.map(g => g.id)) + 1,
      ...newGSTRate,
    };

    // If this is set as default, unset all others
    if (newGSTRate.isDefault) {
      setGstRates(gstRates.map(g => ({ ...g, isDefault: false })));
    }

    setGstRates([...gstRates, gstData]);
    resetGSTModal();
  };

  const handleUpdateGSTRate = () => {
    if (!newGSTRate.name || newGSTRate.percentage <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId !== null) {
      const updatedRates = gstRates.map(rate =>
        rate.id === editingId ? { ...rate, ...newGSTRate } : rate
      );

      // If this is set as default, unset all others
      if (newGSTRate.isDefault) {
        setGstRates(updatedRates.map(g => g.id === editingId ? g : { ...g, isDefault: false }));
      } else {
        setGstRates(updatedRates);
      }
    }

    resetGSTModal();
  };

  const handleEditGSTRate = (rateId: number) => {
    const rateToEdit = gstRates.find(g => g.id === rateId);
    if (rateToEdit) {
      setIsEditMode(true);
      setEditingId(rateId);
      setNewGSTRate({
        name: rateToEdit.name,
        percentage: rateToEdit.percentage,
        isDefault: rateToEdit.isDefault,
      });
      setShowGSTModal(true);
    }
  };

  const handleDeleteGSTRate = (rateId: number) => {
    if (window.confirm('Are you sure you want to delete this GST rate?')) {
      setGstRates(gstRates.filter(g => g.id !== rateId));
    }
  };

  const resetGSTModal = () => {
    setShowGSTModal(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewGSTRate({
      name: '',
      percentage: 0,
      isDefault: false,
    });
  };

  // HSN Code Functions
  const handleAddHSNCode = () => {
    if (!newHSNCode.code || !newHSNCode.description || newHSNCode.gstRate <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const hsnData: HSNCode = {
      id: Math.max(...hsnCodes.map(h => h.id)) + 1,
      ...newHSNCode,
    };

    setHsnCodes([...hsnCodes, hsnData]);
    resetHSNModal();
  };

  const handleUpdateHSNCode = () => {
    if (!newHSNCode.code || !newHSNCode.description || newHSNCode.gstRate <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId !== null) {
      const updatedCodes = hsnCodes.map(code =>
        code.id === editingId ? { ...code, ...newHSNCode } : code
      );
      setHsnCodes(updatedCodes);
    }

    resetHSNModal();
  };

  const handleEditHSNCode = (codeId: number) => {
    const codeToEdit = hsnCodes.find(h => h.id === codeId);
    if (codeToEdit) {
      setIsEditMode(true);
      setEditingId(codeId);
      setNewHSNCode({
        code: codeToEdit.code,
        description: codeToEdit.description,
        gstRate: codeToEdit.gstRate,
      });
      setShowHSNModal(true);
    }
  };

  const handleDeleteHSNCode = (codeId: number) => {
    if (window.confirm('Are you sure you want to delete this HSN code?')) {
      setHsnCodes(hsnCodes.filter(h => h.id !== codeId));
    }
  };

  const resetHSNModal = () => {
    setShowHSNModal(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewHSNCode({
      code: '',
      description: '',
      gstRate: 0,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tax Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage GST rates and HSN codes for your business</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('gst')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'gst'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              GST Rates
            </button>
            <button
              onClick={() => setActiveTab('hsn')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'hsn'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              HSN Codes
            </button>
          </div>
        </div>

        {/* GST Rates Tab */}
        {activeTab === 'gst' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">GST Rates</h2>
                <p className="text-sm text-gray-600 mt-1">Configure GST rates for your tailoring services</p>
              </div>
              <button
                onClick={() => setShowGSTModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add GST Rate
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Percentage</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Default</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gstRates.map((rate) => (
                    <tr key={rate.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{rate.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{rate.percentage}%</td>
                      <td className="py-3 px-4">
                        {rate.isDefault && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditGSTRate(rate.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGSTRate(rate.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HSN Codes Tab */}
        {activeTab === 'hsn' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">HSN Codes</h2>
                <p className="text-sm text-gray-600 mt-1">Configure HSN codes for your products and services</p>
              </div>
              <button
                onClick={() => setShowHSNModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add HSN Code
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">HSN Code</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">GST Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hsnCodes.map((code) => (
                    <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{code.code}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{code.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{code.gstRate}%</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditHSNCode(code.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHSNCode(code.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* GST Rate Modal */}
      {showGSTModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit GST Rate' : 'Add GST Rate'}
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={resetGSTModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newGSTRate.name}
                  onChange={(e) => setNewGSTRate({ ...newGSTRate, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., GST 18%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newGSTRate.percentage || ''}
                  onChange={(e) => setNewGSTRate({ ...newGSTRate, percentage: e.target.value ? parseFloat(e.target.value) : 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter percentage"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newGSTRate.isDefault}
                  onChange={(e) => setNewGSTRate({ ...newGSTRate, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Set as default rate</label>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={resetGSTModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateGSTRate : handleAddGSTRate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HSN Code Modal */}
      {showHSNModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit HSN Code' : 'Add HSN Code'}
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={resetHSNModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HSN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newHSNCode.code}
                  onChange={(e) => setNewHSNCode({ ...newHSNCode, code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 6217"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newHSNCode.description}
                  onChange={(e) => setNewHSNCode({ ...newHSNCode, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Rate (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newHSNCode.gstRate || ''}
                  onChange={(e) => setNewHSNCode({ ...newHSNCode, gstRate: e.target.value ? parseFloat(e.target.value) : 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter GST rate"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={resetHSNModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateHSNCode : handleAddHSNCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}