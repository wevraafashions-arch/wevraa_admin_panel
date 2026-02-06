import { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, Tag, Package } from 'lucide-react';
import { AddOnModal } from '../AddOnModal';
import { DesignGalleryModal } from '../DesignGalleryModal';

interface AddOn {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  fabricImage?: string;
  designImages: string[];
  drawingImage?: string;
  cups: boolean;
  piping: boolean;
  zipType: boolean;
  hooks: boolean;
  hangings: string[];
  cupsSubOptions: string[];
  pipingSubOptions: string[];
  zipTypeSubOptions: string[];
  hooksSubOptions: string[];
  requiredFields: {
    fabricImage: boolean;
    designImages: boolean;
    drawingImage: boolean;
    cups: boolean;
    piping: boolean;
    zipType: boolean;
    hooks: boolean;
    hangings: boolean;
  };
  status: string;
}

export function AddOnsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryCallback, setGalleryCallback] = useState<((images: string[]) => void) | null>(null);
  const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);

  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: 1,
      name: 'Blouse Add-Ons Configuration',
      category: 'Blouse',
      subCategory: 'Hand Embroidery',
      fabricImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
      designImages: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
        'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
        'https://images.unsplash.com/photo-1610652490818-a7e4c4d0e3f0?w=400'
      ],
      drawingImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1c8347?w=400',
      cups: true,
      piping: true,
      zipType: true,
      hooks: true,
      hangings: [
        'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'
      ],
      cupsSubOptions: ['Padded Cups', 'Removable Cups'],
      pipingSubOptions: ['Contrast Piping', 'Gold Piping'],
      zipTypeSubOptions: ['Back Zip', 'Hidden Zip'],
      hooksSubOptions: ['Back Hooks', 'Hidden Hooks'],
      requiredFields: {
        fabricImage: true,
        designImages: true,
        drawingImage: false,
        cups: true,
        piping: true,
        zipType: true,
        hooks: true,
        hangings: false,
      },
      status: 'Active'
    },
    {
      id: 2,
      name: 'Kurta Customization',
      category: 'Topwear',
      subCategory: 'Kurta',
      fabricImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
      designImages: [
        'https://images.unsplash.com/photo-1622124358717-e0b1a3cf5c61?w=400'
      ],
      drawingImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1c8347?w=400',
      cups: false,
      piping: true,
      zipType: false,
      hooks: true,
      hangings: [],
      cupsSubOptions: [],
      pipingSubOptions: ['Gold Piping', 'Silver Piping'],
      zipTypeSubOptions: [],
      hooksSubOptions: ['Front Hooks', 'Hidden Hooks'],
      requiredFields: {
        fabricImage: true,
        designImages: true,
        drawingImage: true,
        cups: false,
        piping: true,
        zipType: false,
        hooks: true,
        hangings: false,
      },
      status: 'Active'
    },
    {
      id: 3,
      name: 'Palazzo Design Options',
      category: 'Bottomwear',
      subCategory: 'Palazzo',
      fabricImage: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400',
      designImages: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
      ],
      drawingImage: undefined,
      cups: false,
      piping: true,
      zipType: true,
      hooks: false,
      hangings: [],
      cupsSubOptions: [],
      pipingSubOptions: ['Contrast Piping', 'Matching Piping'],
      zipTypeSubOptions: ['Side Zip', 'Hidden Zip'],
      hooksSubOptions: [],
      requiredFields: {
        fabricImage: true,
        designImages: true,
        drawingImage: false,
        cups: false,
        piping: true,
        zipType: true,
        hooks: false,
        hangings: false,
      },
      status: 'Active'
    }
  ]);

  const handleEdit = (addOn: AddOn) => {
    setEditingAddOn(addOn);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this add-on configuration?')) {
      setAddOns(addOns.filter(a => a.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingAddOn(null);
  };

  const handleSaveAddOn = (addOnData: any) => {
    if (editingAddOn) {
      setAddOns(addOns.map(a => a.id === editingAddOn.id ? addOnData : a));
    } else {
      setAddOns([...addOns, addOnData]);
    }
  };

  const getRequiredFieldsCount = (addOn: AddOn) => {
    return Object.values(addOn.requiredFields).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add-Ons Configuration</h1>
          <p className="text-gray-600 mt-1">Manage tailoring add-ons and customization options for products</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Configuration
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Configurations</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{addOns.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {addOns.filter(a => a.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blouse Configs</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {addOns.filter(a => a.category === 'Blouse').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Required Fields</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {addOns.length > 0 ? Math.round(addOns.reduce((sum, a) => sum + getRequiredFieldsCount(a), 0) / addOns.length) : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add-Ons List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Configuration Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Design Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Fields
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {addOns.map((addOn) => (
                <tr key={addOn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {addOn.fabricImage ? (
                        <img
                          src={addOn.fabricImage}
                          alt={addOn.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{addOn.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{addOn.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{addOn.subCategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-2">
                      {addOn.designImages.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Design ${index + 1}`}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {addOn.designImages.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                          +{addOn.designImages.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {addOn.requiredFields.fabricImage && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Fabric</span>
                      )}
                      {addOn.requiredFields.designImages && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Designs</span>
                      )}
                      {addOn.requiredFields.cups && (
                        <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">Cups</span>
                      )}
                      {addOn.requiredFields.piping && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Piping</span>
                      )}
                      {addOn.requiredFields.zipType && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Zip</span>
                      )}
                      {addOn.requiredFields.hooks && (
                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">Hooks</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      addOn.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {addOn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(addOn)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(addOn.id)}
                        className="text-red-600 hover:text-red-900"
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

      {/* Empty State */}
      {addOns.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No add-on configurations</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first add-on configuration.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Configuration
          </button>
        </div>
      )}

      {/* Add-On Modal */}
      <AddOnModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddOn}
        editingAddOn={editingAddOn}
        onOpenGallery={(callback) => {
          setGalleryCallback(() => callback);
          setIsGalleryModalOpen(true);
        }}
      />

      {/* Design Gallery Modal */}
      <DesignGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSelect={(images) => {
          if (galleryCallback) {
            galleryCallback(images);
          }
          setIsGalleryModalOpen(false);
        }}
      />
    </div>
  );
}