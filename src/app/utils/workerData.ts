export interface FieldRequirement {
  name: string;
  label: string;
  type: 'text' | 'phone' | 'email' | 'number';
  required: boolean;
}

export interface Specialization {
  id: number;
  name: string;
  phone: string;
  required: boolean;
  fields: FieldRequirement[];
}

// Worker specializations with contact info and field requirements
export const WORKER_SPECIALIZATIONS: Specialization[] = [
  { 
    id: 1, 
    name: 'Cutting Master', 
    phone: '+91 98765 11111', 
    required: true,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
      { name: 'experience', label: 'Years of Experience', type: 'number', required: true },
    ]
  },
  { 
    id: 2, 
    name: 'Hand Embroidery Specialist', 
    phone: '+91 98765 22222', 
    required: false,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: false },
    ]
  },
  { 
    id: 3, 
    name: 'Machine Embroidery Specialist', 
    phone: '+91 98765 33333', 
    required: false,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
    ]
  },
  { 
    id: 4, 
    name: 'Stitching Master', 
    phone: '+91 98765 44444', 
    required: true,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
      { name: 'experience', label: 'Years of Experience', type: 'number', required: true },
    ]
  },
  { 
    id: 5, 
    name: 'Finishing Specialist', 
    phone: '+91 98765 55555', 
    required: true,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
    ]
  },
  { 
    id: 6, 
    name: 'Quality Checker', 
    phone: '+91 98765 66666', 
    required: false,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: false },
    ]
  },
  { 
    id: 7, 
    name: 'Designer', 
    phone: '+91 98765 77777', 
    required: false,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: false },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
    ]
  },
  { 
    id: 8, 
    name: 'Measurement Specialist', 
    phone: '+91 98765 88888', 
    required: true,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
    ]
  },
  { 
    id: 9, 
    name: 'Fitting Specialist', 
    phone: '+91 98765 99999', 
    required: false,
    fields: [
      { name: 'workerName', label: 'Worker Name', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'phone', required: true },
    ]
  },
];

// Sample workers database
export const WORKERS: Worker[] = [
  // Ramesh Tailors Workers
  { id: 1, name: 'Ramesh Singh', specialization: 'Cutting Master', boutiqueId: 'BTQ-001', boutiqueName: 'Ramesh Tailors', phone: '+91 98765 00001', active: true },
  { id: 2, name: 'Lakshmi Devi', specialization: 'Hand Embroidery Specialist', boutiqueId: 'BTQ-001', boutiqueName: 'Ramesh Tailors', phone: '+91 98765 00002', active: true },
  { id: 3, name: 'Amit Kumar', specialization: 'Stitching Master', boutiqueId: 'BTQ-001', boutiqueName: 'Ramesh Tailors', phone: '+91 98765 00003', active: true },
  { id: 4, name: 'Priya Sharma', specialization: 'Finishing Specialist', boutiqueId: 'BTQ-001', boutiqueName: 'Ramesh Tailors', phone: '+91 98765 00004', active: true },
  { id: 5, name: 'Suresh Patel', specialization: 'Quality Checker', boutiqueId: 'BTQ-001', boutiqueName: 'Ramesh Tailors', phone: '+91 98765 00005', active: true },
  
  // Lakshmi Boutique Workers
  { id: 6, name: 'Meena Iyer', specialization: 'Designer', boutiqueId: 'BTQ-002', boutiqueName: 'Lakshmi Boutique', phone: '+91 98765 00006', active: true },
  { id: 7, name: 'Divya Nair', specialization: 'Cutting Master', boutiqueId: 'BTQ-002', boutiqueName: 'Lakshmi Boutique', phone: '+91 98765 00007', active: true },
  { id: 8, name: 'Ravi Krishna', specialization: 'Machine Embroidery Specialist', boutiqueId: 'BTQ-002', boutiqueName: 'Lakshmi Boutique', phone: '+91 98765 00008', active: true },
  { id: 9, name: 'Anita Reddy', specialization: 'Stitching Master', boutiqueId: 'BTQ-002', boutiqueName: 'Lakshmi Boutique', phone: '+91 98765 00009', active: true },
  { id: 10, name: 'Kavita Singh', specialization: 'Fitting Specialist', boutiqueId: 'BTQ-002', boutiqueName: 'Lakshmi Boutique', phone: '+91 98765 00010', active: true },
  
  // Meena Fashions Workers
  { id: 11, name: 'Sunita Devi', specialization: 'Measurement Specialist', boutiqueId: 'BTQ-003', boutiqueName: 'Meena Fashions', phone: '+91 98765 00011', active: true },
  { id: 12, name: 'Vikram Mehta', specialization: 'Cutting Master', boutiqueId: 'BTQ-003', boutiqueName: 'Meena Fashions', phone: '+91 98765 00012', active: true },
  { id: 13, name: 'Pooja Gupta', specialization: 'Hand Embroidery Specialist', boutiqueId: 'BTQ-003', boutiqueName: 'Meena Fashions', phone: '+91 98765 00013', active: true },
  { id: 14, name: 'Rajesh Verma', specialization: 'Stitching Master', boutiqueId: 'BTQ-003', boutiqueName: 'Meena Fashions', phone: '+91 98765 00014', active: true },
  { id: 15, name: 'Deepa Nair', specialization: 'Finishing Specialist', boutiqueId: 'BTQ-003', boutiqueName: 'Meena Fashions', phone: '+91 98765 00015', active: true },
];

// Utility function to get workers by boutique
export const getWorkersByBoutique = (boutiqueId: string): Worker[] => {
  return WORKERS.filter(w => w.boutiqueId === boutiqueId && w.active);
};

// Utility function to get workers by specialization
export const getWorkersBySpecialization = (boutiqueId: string, specialization: string): Worker[] => {
  return WORKERS.filter(w => w.boutiqueId === boutiqueId && w.specialization === specialization && w.active);
};

// Utility function to get worker by ID
export const getWorkerById = (workerId: number): Worker | undefined => {
  return WORKERS.find(w => w.id === workerId);
};