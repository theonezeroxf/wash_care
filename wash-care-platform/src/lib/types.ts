export type OrderStatus =
  | "PENDING"
  | "PICKED_UP"
  | "WASHING"
  | "DELIVERING"
  | "COMPLETED";

export type ServiceCategoryRecord = {
  id: string;
  name: string;
  description: string;
  seoSlug: string;
  basePrice: number;
};

export type OrderItemRecord = {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  extraServices?: string | null;
  serviceCategory: ServiceCategoryRecord;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  pickupAddress: string;
  notes?: string | null;
  status: OrderStatus;
  createdAt: string;
  user: {
    id: string;
    fullName?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  items: OrderItemRecord[];
};

export type BookingFormValues = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  notes?: string;
  categoryId: string;
  itemName: string;
  quantity: number;
  extraServices?: string;
};
