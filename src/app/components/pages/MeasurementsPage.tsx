import { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, ChevronRight, Ruler, ToggleLeft, ToggleRight, X, Image as ImageIcon } from 'lucide-react';

interface Measurement {
  id: number;
  name: string;
  value: string;
  unit: string;
  enabled: boolean;
  imageUrl?: string;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
  measurementCount: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  subCategoryCount: number;
}

export function MeasurementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [measurements, setMeasurements] = useState<{ [key: string]: Measurement[] }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [newMeasurement, setNewMeasurement] = useState({
    name: '',
    value: '',
    unit: 'inches',
    enabled: true,
    imageUrl: '',
  });

  const categories: Category[] = [
    { id: 1, name: 'Blouse', description: 'Blouse stitching measurements', subCategoryCount: 7 },
    { id: 2, name: 'Topwear', description: 'Kurtas, shirts, tops measurements', subCategoryCount: 6 },
    { id: 3, name: 'Bottomwear', description: 'Pants, salwars, skirts measurements', subCategoryCount: 6 },
    { id: 4, name: 'Others', description: 'Saree and miscellaneous measurements', subCategoryCount: 2 },
  ];

  const subCategoriesData: { [key: number]: SubCategory[] } = {
    1: [ // Blouse
      { id: 1, name: 'Hand Embroidery', description: 'Blouse with hand embroidery work', measurementCount: 20 },
      { id: 2, name: 'Machine Embroidery', description: 'Blouse with machine embroidery', measurementCount: 20 },
      { id: 3, name: 'Princes Cut Blouse', description: 'Princes cut style blouse design', measurementCount: 20 },
      { id: 4, name: 'Katori Blouse', description: 'Katori style blouse stitching', measurementCount: 20 },
      { id: 5, name: 'Lining Blouse', description: 'Blouse with lining work', measurementCount: 20 },
      { id: 6, name: 'Lehenga Blouse', description: 'Blouse for lehenga outfit', measurementCount: 20 },
      { id: 7, name: 'Plain Blouse', description: 'Simple plain blouse stitching', measurementCount: 20 },
    ],
    2: [ // Topwear
      { id: 1, name: 'Gown', description: 'Gown stitching and designing', measurementCount: 12 },
      { id: 2, name: 'Kurta', description: 'Kurta stitching service', measurementCount: 10 },
      { id: 3, name: 'Salwar', description: 'Salwar stitching service', measurementCount: 9 },
      { id: 4, name: 'Ghagra', description: 'Ghagra stitching and designing', measurementCount: 11 },
      { id: 5, name: 'Lehenga Blouse', description: 'Lehenga blouse stitching', measurementCount: 9 },
      { id: 6, name: 'Churidar', description: 'Churidar stitching service', measurementCount: 8 },
    ],
    3: [ // Bottomwear
      { id: 1, name: 'Chudi Bottom', description: 'Chudi bottom stitching', measurementCount: 7 },
      { id: 2, name: 'Salwar Bottom', description: 'Salwar bottom stitching', measurementCount: 7 },
      { id: 3, name: 'Patiala', description: 'Patiala pants stitching', measurementCount: 8 },
      { id: 4, name: 'Palazzo', description: 'Palazzo pants stitching', measurementCount: 7 },
      { id: 5, name: 'Straight Pant', description: 'Straight pant stitching', measurementCount: 8 },
      { id: 6, name: 'Lehenga Bottom', description: 'Lehenga bottom stitching', measurementCount: 9 },
    ],
    4: [ // Others
      { id: 1, name: 'Saree Krosha', description: 'Saree krosha work and finishing', measurementCount: 5 },
      { id: 2, name: 'Saree Zig-Zag & Falls', description: 'Saree zig-zag stitching and falls work', measurementCount: 4 },
    ],
  };

  // Measurements data for each sub-category
  const measurementsData: { [key: string]: Measurement[] } = {
    // Blouse - Hand Embroidery
    '1-1': [
      { id: 1, name: 'Full Length', value: '15', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '15', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '6', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '12', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '18', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '14', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '34', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '38', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '30', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '17', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '6', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '4', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '30', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '6', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5', unit: 'inches', enabled: true },
    ],
    // Blouse - Machine Embroidery
    '1-2': [
      { id: 1, name: 'Full Length', value: '14', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '16', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '6.5', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '11', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '19', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '15', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '38', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '40', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '32', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7.5', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '18', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '5', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '3', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '32', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '6.5', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5.5', unit: 'inches', enabled: true },
    ],
    // Blouse - Princes Cut Blouse
    '1-3': [
      { id: 1, name: 'Full Length', value: '16', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '14', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '5.5', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '13', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '17', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '13', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '32', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '34', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '28', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '16', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '7', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '4', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '28', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '5.5', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5', unit: 'inches', enabled: true },
    ],
    // Blouse - Katori Blouse
    '1-4': [
      { id: 1, name: 'Full Length', value: '14', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '15', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '6', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '10', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '18', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '14', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '34', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '38', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '30', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '17', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '6', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '3', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '30', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '6', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5', unit: 'inches', enabled: true },
    ],
    // Blouse - Lining Blouse
    '1-5': [
      { id: 1, name: 'Full Length', value: '15', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '16', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '6.5', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '12', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '19', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '15', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '38', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '40', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '32', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7.5', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '18', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '5', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '3', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '32', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '6.5', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5.5', unit: 'inches', enabled: true },
    ],
    // Blouse - Lehenga Blouse
    '1-6': [
      { id: 1, name: 'Full Length', value: '13', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '14', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '5.5', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '14', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '17', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '13', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '32', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '34', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '28', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '16', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '8', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '5', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '28', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '5.5', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5', unit: 'inches', enabled: true },
    ],
    // Blouse - Plain Blouse
    '1-7': [
      { id: 1, name: 'Full Length', value: '14', unit: 'inches', enabled: true },
      { id: 2, name: 'Shoulder', value: '15', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder Gap', value: '6', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeves Length', value: '11', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole Round', value: '18', unit: 'inches', enabled: true },
      { id: 6, name: 'Circle Down Loose', value: '2', unit: 'inches', enabled: true },
      { id: 7, name: 'Sleeves Round', value: '14', unit: 'inches', enabled: true },
      { id: 8, name: 'Upper Chest Round', value: '34', unit: 'inches', enabled: true },
      { id: 9, name: 'Chest Round', value: '36', unit: 'inches', enabled: true },
      { id: 10, name: 'Lower Chest Round', value: '38', unit: 'inches', enabled: true },
      { id: 11, name: 'Waist Round', value: '30', unit: 'inches', enabled: true },
      { id: 12, name: 'First Dart Point', value: '5', unit: 'inches', enabled: true },
      { id: 13, name: 'Second Dart Point', value: '8', unit: 'inches', enabled: true },
      { id: 14, name: 'Bust Point', value: '7', unit: 'inches', enabled: true },
      { id: 15, name: 'Front AC', value: '17', unit: 'inches', enabled: true },
      { id: 16, name: 'Front Neck Deep', value: '5', unit: 'inches', enabled: true },
      { id: 17, name: 'Back Neck Deep', value: '3', unit: 'inches', enabled: true },
      { id: 18, name: 'Waist Band Length', value: '30', unit: 'inches', enabled: true },
      { id: 19, name: 'Neck Width', value: '6', unit: 'inches', enabled: true },
      { id: 20, name: 'Back Neck Width', value: '5', unit: 'inches', enabled: true },
    ],
    // Topwear - Gown
    '2-1': [
      { id: 1, name: 'Bust', value: '38', unit: 'inches', enabled: true },
      { id: 2, name: 'Waist', value: '32', unit: 'inches', enabled: true },
      { id: 3, name: 'Hip', value: '40', unit: 'inches', enabled: true },
      { id: 4, name: 'Shoulder', value: '16', unit: 'inches', enabled: true },
      { id: 5, name: 'Sleeve Length', value: '22', unit: 'inches', enabled: true },
      { id: 6, name: 'Armhole', value: '19', unit: 'inches', enabled: true },
      { id: 7, name: 'Gown Length', value: '52', unit: 'inches', enabled: true },
      { id: 8, name: 'Neck Depth Front', value: '8', unit: 'inches', enabled: true },
      { id: 9, name: 'Neck Depth Back', value: '6', unit: 'inches', enabled: true },
      { id: 10, name: 'Slit Length', value: '18', unit: 'inches', enabled: true },
      { id: 11, name: 'Flare Width', value: '60', unit: 'inches', enabled: true },
      { id: 12, name: 'Waist to Hip', value: '9', unit: 'inches', enabled: true },
    ],
    // Topwear - Kurta
    '2-2': [
      { id: 1, name: 'Bust', value: '40', unit: 'inches', enabled: true },
      { id: 2, name: 'Waist', value: '34', unit: 'inches', enabled: true },
      { id: 3, name: 'Hip', value: '42', unit: 'inches', enabled: true },
      { id: 4, name: 'Shoulder', value: '17', unit: 'inches', enabled: true },
      { id: 5, name: 'Sleeve Length', value: '20', unit: 'inches', enabled: true },
      { id: 6, name: 'Armhole', value: '20', unit: 'inches', enabled: true },
      { id: 7, name: 'Kurta Length', value: '42', unit: 'inches', enabled: true },
      { id: 8, name: 'Neck Depth Front', value: '9', unit: 'inches', enabled: true },
      { id: 9, name: 'Neck Depth Back', value: '5', unit: 'inches', enabled: true },
      { id: 10, name: 'Slit Length', value: '14', unit: 'inches', enabled: true },
    ],
    // Topwear - Salwar
    '2-3': [
      { id: 1, name: 'Bust', value: '36', unit: 'inches', enabled: true },
      { id: 2, name: 'Waist', value: '30', unit: 'inches', enabled: true },
      { id: 3, name: 'Hip', value: '38', unit: 'inches', enabled: true },
      { id: 4, name: 'Shoulder', value: '15', unit: 'inches', enabled: true },
      { id: 5, name: 'Sleeve Length', value: '19', unit: 'inches', enabled: true },
      { id: 6, name: 'Armhole', value: '18', unit: 'inches', enabled: true },
      { id: 7, name: 'Kameez Length', value: '38', unit: 'inches', enabled: true },
      { id: 8, name: 'Neck Depth Front', value: '8', unit: 'inches', enabled: true },
      { id: 9, name: 'Slit Length', value: '12', unit: 'inches', enabled: true },
    ],
    // Topwear - Ghagra
    '2-4': [
      { id: 1, name: 'Waist', value: '28', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '36', unit: 'inches', enabled: true },
      { id: 3, name: 'Ghagra Length', value: '40', unit: 'inches', enabled: true },
      { id: 4, name: 'Flare Width', value: '120', unit: 'inches', enabled: true },
      { id: 5, name: 'Waist to Hip', value: '9', unit: 'inches', enabled: true },
      { id: 6, name: 'Kali Count', value: '8', unit: 'pieces', enabled: true },
      { id: 7, name: 'Hip to Floor', value: '31', unit: 'inches', enabled: true },
      { id: 8, name: 'Side Seam', value: '40', unit: 'inches', enabled: true },
      { id: 9, name: 'Panel Width', value: '15', unit: 'inches', enabled: true },
      { id: 10, name: 'Hem Circumference', value: '120', unit: 'inches', enabled: true },
      { id: 11, name: 'Thigh', value: '22', unit: 'inches', enabled: true },
    ],
    // Topwear - Lehenga Blouse
    '2-5': [
      { id: 1, name: 'Bust', value: '34', unit: 'inches', enabled: true },
      { id: 2, name: 'Waist', value: '28', unit: 'inches', enabled: true },
      { id: 3, name: 'Shoulder', value: '14', unit: 'inches', enabled: true },
      { id: 4, name: 'Sleeve Length', value: '14', unit: 'inches', enabled: true },
      { id: 5, name: 'Armhole', value: '17', unit: 'inches', enabled: true },
      { id: 6, name: 'Blouse Length', value: '13', unit: 'inches', enabled: true },
      { id: 7, name: 'Neck Depth Front', value: '8', unit: 'inches', enabled: true },
      { id: 8, name: 'Neck Depth Back', value: '5', unit: 'inches', enabled: true },
      { id: 9, name: 'Back Opening', value: '6', unit: 'inches', enabled: true },
    ],
    // Topwear - Churidar
    '2-6': [
      { id: 1, name: 'Bust', value: '36', unit: 'inches', enabled: true },
      { id: 2, name: 'Waist', value: '30', unit: 'inches', enabled: true },
      { id: 3, name: 'Hip', value: '38', unit: 'inches', enabled: true },
      { id: 4, name: 'Shoulder', value: '15', unit: 'inches', enabled: true },
      { id: 5, name: 'Sleeve Length', value: '19', unit: 'inches', enabled: true },
      { id: 6, name: 'Kameez Length', value: '40', unit: 'inches', enabled: true },
      { id: 7, name: 'Neck Depth Front', value: '8', unit: 'inches', enabled: true },
      { id: 8, name: 'Slit Length', value: '13', unit: 'inches', enabled: true },
    ],
    // Bottomwear - Chudi Bottom
    '3-1': [
      { id: 1, name: 'Waist', value: '30', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '38', unit: 'inches', enabled: true },
      { id: 3, name: 'Thigh', value: '22', unit: 'inches', enabled: true },
      { id: 4, name: 'Knee', value: '16', unit: 'inches', enabled: true },
      { id: 5, name: 'Ankle', value: '10', unit: 'inches', enabled: true },
      { id: 6, name: 'Length', value: '38', unit: 'inches', enabled: true },
      { id: 7, name: 'Crotch Depth', value: '12', unit: 'inches', enabled: true },
    ],
    // Bottomwear - Salwar Bottom
    '3-2': [
      { id: 1, name: 'Waist', value: '32', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '40', unit: 'inches', enabled: true },
      { id: 3, name: 'Thigh', value: '24', unit: 'inches', enabled: true },
      { id: 4, name: 'Knee', value: '18', unit: 'inches', enabled: true },
      { id: 5, name: 'Ankle', value: '12', unit: 'inches', enabled: true },
      { id: 6, name: 'Length', value: '36', unit: 'inches', enabled: true },
      { id: 7, name: 'Crotch Depth', value: '11', unit: 'inches', enabled: true },
    ],
    // Bottomwear - Patiala
    '3-3': [
      { id: 1, name: 'Waist', value: '28', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '36', unit: 'inches', enabled: true },
      { id: 3, name: 'Thigh', value: '26', unit: 'inches', enabled: true },
      { id: 4, name: 'Knee', value: '22', unit: 'inches', enabled: true },
      { id: 5, name: 'Ankle', value: '14', unit: 'inches', enabled: true },
      { id: 6, name: 'Length', value: '37', unit: 'inches', enabled: true },
      { id: 7, name: 'Crotch Depth', value: '13', unit: 'inches', enabled: true },
      { id: 8, name: 'Pleats Width', value: '18', unit: 'inches', enabled: true },
    ],
    // Bottomwear - Palazzo
    '3-4': [
      { id: 1, name: 'Waist', value: '30', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '38', unit: 'inches', enabled: true },
      { id: 3, name: 'Thigh', value: '24', unit: 'inches', enabled: true },
      { id: 4, name: 'Knee', value: '20', unit: 'inches', enabled: true },
      { id: 5, name: 'Bottom Opening', value: '22', unit: 'inches', enabled: true },
      { id: 6, name: 'Length', value: '39', unit: 'inches', enabled: true },
      { id: 7, name: 'Crotch Depth', value: '12', unit: 'inches', enabled: true },
    ],
    // Bottomwear - Straight Pant
    '3-5': [
      { id: 1, name: 'Waist', value: '32', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '40', unit: 'inches', enabled: true },
      { id: 3, name: 'Thigh', value: '22', unit: 'inches', enabled: true },
      { id: 4, name: 'Knee', value: '17', unit: 'inches', enabled: true },
      { id: 5, name: 'Bottom Opening', value: '16', unit: 'inches', enabled: true },
      { id: 6, name: 'Length', value: '40', unit: 'inches', enabled: true },
      { id: 7, name: 'Crotch Depth', value: '11', unit: 'inches', enabled: true },
      { id: 8, name: 'Inseam', value: '30', unit: 'inches', enabled: true },
    ],
    // Bottomwear - Lehenga Bottom
    '3-6': [
      { id: 1, name: 'Waist', value: '28', unit: 'inches', enabled: true },
      { id: 2, name: 'Hip', value: '36', unit: 'inches', enabled: true },
      { id: 3, name: 'Lehenga Length', value: '42', unit: 'inches', enabled: true },
      { id: 4, name: 'Flare Width', value: '140', unit: 'inches', enabled: true },
      { id: 5, name: 'Waist to Hip', value: '9', unit: 'inches', enabled: true },
      { id: 6, name: 'Kali Count', value: '10', unit: 'pieces', enabled: true },
      { id: 7, name: 'Hip to Floor', value: '33', unit: 'inches', enabled: true },
      { id: 8, name: 'Panel Width', value: '14', unit: 'inches', enabled: true },
      { id: 9, name: 'Hem Circumference', value: '140', unit: 'inches', enabled: true },
    ],
    // Others - Saree Krosha
    '4-1': [
      { id: 1, name: 'Saree Length', value: '6', unit: 'yards', enabled: true },
      { id: 2, name: 'Border Width', value: '4', unit: 'inches', enabled: true },
      { id: 3, name: 'Pallu Length', value: '48', unit: 'inches', enabled: true },
      { id: 4, name: 'Krosha Thread Count', value: '150', unit: 'threads', enabled: true },
      { id: 5, name: 'Edge Finish Width', value: '0.5', unit: 'inches', enabled: true },
    ],
    // Others - Saree Zig-Zag & Falls
    '4-2': [
      { id: 1, name: 'Saree Length', value: '6', unit: 'yards', enabled: true },
      { id: 2, name: 'Falls Width', value: '2', unit: 'inches', enabled: true },
      { id: 3, name: 'Zig-Zag Stitch Width', value: '0.25', unit: 'inches', enabled: true },
      { id: 4, name: 'Pallu Length', value: '48', unit: 'inches', enabled: true },
    ],
  };

  // If a sub-category is selected, show measurements
  if (selectedSubCategory && selectedCategory) {
    const measurementKey = `${selectedCategory.id}-${selectedSubCategory.id}`;
    const currentMeasurements = measurements[measurementKey] || measurementsData[measurementKey] || [];

    const toggleMeasurement = (measurementId: number) => {
      const updatedMeasurements = currentMeasurements.map(m =>
        m.id === measurementId ? { ...m, enabled: !m.enabled } : m
      );
      setMeasurements({ ...measurements, [measurementKey]: updatedMeasurements });
    };

    const handleAddMeasurement = () => {
      if (!newMeasurement.name || !newMeasurement.value) {
        alert('Please fill in all required fields');
        return;
      }

      const newId = currentMeasurements.length > 0 ? Math.max(...currentMeasurements.map(m => m.id)) + 1 : 1;
      const updatedMeasurements = [
        ...currentMeasurements,
        {
          id: newId,
          name: newMeasurement.name,
          value: newMeasurement.value,
          unit: newMeasurement.unit,
          enabled: newMeasurement.enabled,
          imageUrl: newMeasurement.imageUrl,
        }
      ];
      
      setMeasurements({ ...measurements, [measurementKey]: updatedMeasurements });
      setShowAddModal(false);
      setNewMeasurement({ name: '', value: '', unit: 'inches', enabled: true, imageUrl: '' });
    };

    const handleEditMeasurement = () => {
      if (!editingMeasurement || !newMeasurement.name || !newMeasurement.value) {
        alert('Please fill in all required fields');
        return;
      }

      const updatedMeasurements = currentMeasurements.map(m =>
        m.id === editingMeasurement.id ? { ...m, ...newMeasurement } : m
      );
      
      setMeasurements({ ...measurements, [measurementKey]: updatedMeasurements });
      setShowEditModal(false);
      setEditingMeasurement(null);
      setNewMeasurement({ name: '', value: '', unit: 'inches', enabled: true, imageUrl: '' });
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb and Header */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => {
              setSelectedSubCategory(null);
            }}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {selectedCategory.name} Sub-categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{selectedSubCategory.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{selectedSubCategory.name} - Measurements</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedSubCategory.description}</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5" />
            Add Measurement
          </button>
        </div>

        {/* Measurements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Measurement Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMeasurements.map((measurement) => (
                <tr key={measurement.id} className={`hover:bg-gray-50 ${!measurement.enabled ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedMeasurement(measurement)}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <Ruler className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{measurement.name}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">{measurement.value}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{measurement.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleMeasurement(measurement.id)}
                      className="flex items-center gap-2 text-sm"
                    >
                      {measurement.enabled ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-green-600" />
                          <span className="text-green-700 font-medium">Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-500 font-medium">Disabled</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingMeasurement(measurement);
                          setNewMeasurement({ ...measurement });
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Ruler className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Measurement Guidelines</h4>
            <p className="text-sm text-blue-700 mt-1">
              All measurements should be taken with a flexible measuring tape. Record measurements accurately for best fitting results.
              Toggle measurements to enable or disable them for this sub-category.
            </p>
          </div>
        </div>

        {/* Add Measurement Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Add New Measurement</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMeasurement({ name: '', value: '', unit: 'inches', enabled: true, imageUrl: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Measurement Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Measurement Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMeasurement.name}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
                    placeholder="e.g., Bust, Waist, Hip"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                    placeholder="e.g., 36"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={newMeasurement.unit}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="inches">inches</option>
                    <option value="cm">cm</option>
                    <option value="yards">yards</option>
                    <option value="meters">meters</option>
                    <option value="pieces">pieces</option>
                    <option value="cup">cup</option>
                    <option value="threads">threads</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <button
                    onClick={() => setNewMeasurement({ ...newMeasurement, enabled: !newMeasurement.enabled })}
                    className="flex items-center gap-2 text-sm"
                  >
                    {newMeasurement.enabled ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-green-600" />
                        <span className="text-green-700 font-medium">Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-500 font-medium">Disabled</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newMeasurement.imageUrl}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, imageUrl: e.target.value })}
                    placeholder="e.g., https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMeasurement({ name: '', value: '', unit: 'inches', enabled: true, imageUrl: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMeasurement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Measurement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Measurement Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Edit Measurement</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMeasurement(null);
                    setNewMeasurement({ name: '', value: '', unit: 'inches', enabled: true, imageUrl: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Measurement Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Measurement Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMeasurement.name}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, name: e.target.value })}
                    placeholder="e.g., Bust, Waist, Hip"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                    placeholder="e.g., 36"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={newMeasurement.unit}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="inches">inches</option>
                    <option value="cm">cm</option>
                    <option value="yards">yards</option>
                    <option value="meters">meters</option>
                    <option value="pieces">pieces</option>
                    <option value="cup">cup</option>
                    <option value="threads">threads</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <button
                    onClick={() => setNewMeasurement({ ...newMeasurement, enabled: !newMeasurement.enabled })}
                    className="flex items-center gap-2 text-sm"
                  >
                    {newMeasurement.enabled ? (
                      <>
                        <ToggleRight className="w-6 h-6 text-green-600" />
                        <span className="text-green-700 font-medium">Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-500 font-medium">Disabled</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newMeasurement.imageUrl}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, imageUrl: e.target.value })}
                    placeholder="e.g., https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMeasurement(null);
                    setNewMeasurement({ name: '', value: '', unit: 'inches', enabled: true, imageUrl: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditMeasurement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Measurement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Measurement Image Modal */}
        {selectedMeasurement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMeasurement.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMeasurement.value} {selectedMeasurement.unit}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMeasurement(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {selectedMeasurement.imageUrl ? (
                  <div className="rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={selectedMeasurement.imageUrl}
                      alt={selectedMeasurement.name}
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No image available for this measurement</p>
                    <p className="text-gray-400 text-xs mt-1">Add an image URL to display measurement guide</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedMeasurement(null)}
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

  // If a category is selected, show sub-categories
  if (selectedCategory) {
    const subCategories = subCategoriesData[selectedCategory.id] || [];

    return (
      <div className="space-y-6">
        {/* Breadcrumb and Header */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{selectedCategory.name} - Sub-categories</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedCategory.description}</p>
          </div>
        </div>

        {/* Sub-categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              onClick={() => setSelectedSubCategory(subCategory)}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{subCategory.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{subCategory.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{subCategory.measurementCount}</span> measurements
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main categories grid view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Measurements</h2>
          <p className="text-sm text-gray-600 mt-1">Manage measurement specifications for all garment types</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{category.subCategoryCount}</span> sub-categories
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Ruler className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900">Measurement System</h4>
          <p className="text-sm text-blue-700 mt-1">
            Browse by category to view specific measurement requirements for each garment type. All measurements are standardized for consistency.
          </p>
        </div>
      </div>
    </div>
  );
}