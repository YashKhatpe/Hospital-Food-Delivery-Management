// Enum types
export type MealType = 'MORNING' | 'EVENING' | 'NIGHT';
export type MealStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERING' | 'DELIVERED';
export type UserRole = 'ADMIN' | 'PANTRY_STAFF' | 'DELIVERY_STAFF';

// User Type
export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  pantryStaff?: PantryStaff;
  deliveryStaff?: DeliveryStaff;
};

// Patient Type
export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  roomNumber: string;
  bedNumber: string;
  floorNumber: string;
  contactNumber: string;
  emergencyContact: string;
  diseases: string[];
  allergies: string[];
  createdAt: string;
  updatedAt: string;

  // Relations
  dietCharts: DietChart[];
  mealBoxes: MealBox[];
};

// DietChart Type
export type DietChart = {
  id?: string;
  patientId: string;
  mealType: MealType;
  items: string[];
  instructions: string[];
  createdAt: string;
  updatedAt: string;

  // Relations
  patient: Patient;
  mealBoxes: MealBox[];
};

// PantryStaff Type
export type PantryStaff = {
  id: string;
  userId: string;
  location: string;

  // Relations
  user: User;
  mealBoxes: MealBox[];
};

// DeliveryStaff Type
export type DeliveryStaff = {
  id: string;
  userId: string;

  // Relations
  user: User;
  mealBoxes: MealBox[];
};

// MealBox Type
export type MealBox = {
  id: string;
  patientId: string;
  dietChartId: string;
  pantryStaffId?: string;
  deliveryStaffId?: string;
  status: MealStatus;
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  patient: Patient;
  dietChart: DietChart;
  pantryStaff?: PantryStaff;
  deliveryStaff?: DeliveryStaff;
};

// DietCharts for Admin View
export type DietChartForAdmin = {
  dietChart: DietChart;
  patient: Patient;
  mealBoxes: MealBox[];
  status: MealStatus;
  pantryStaff?: PantryStaff;
  deliveryStaff?: DeliveryStaff;
  mealDetails: {
    items: string[];
    instructions: string[];
  };
  actions: {
    updateStatus: MealStatus;
    assignPantryStaff: string;
    assignDeliveryStaff: string;
    addNotes: string;
  };
};
