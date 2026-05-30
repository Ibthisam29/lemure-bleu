export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "appointment_booked"
  | "converted"
  | "not_suitable";

export type AllocationStatus =
  | "pending"
  | "allocated"
  | "in_consultation"
  | "fulfilled"
  | "refunded";

export type StoneStatus =
  | "available"
  | "reserved"
  | "sold"
  | "private_viewing_only";

export type CollectionStatus = "draft" | "published" | "sold_out";

export type AppointmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export interface VipLead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  preferred_contact: string;
  interest_type: string;
  budget_range: string;
  message?: string;
  status: LeadStatus;
  admin_notes?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  appointment_type: string;
  budget_range: string;
  message?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
}

export interface Preorder {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  stripe_customer_id?: string;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  preorder_tier: "blue_entry" | "maison" | "legacy";
  amount: number;
  currency: string;
  payment_status: string;
  allocation_status: AllocationStatus;
  assigned_stone_id?: string;
  admin_notes?: string;
  created_at: string;
}

export interface Stone {
  id: string;
  stone_name: string;
  stone_type: string;
  origin: string;
  carat: number;
  cut?: string;
  colour: string;
  clarity?: string;
  treatment?: string;
  certificate_lab?: string;
  certificate_number?: string;
  description?: string;
  image_url?: string;
  price?: number;
  price_visibility: "price_on_request" | "starting_from" | "hidden";
  status: StoneStatus;
  created_at: string;
}

export interface Collection {
  id: string;
  collection_name: string;
  description: string;
  launch_date?: string;
  quantity_total: number;
  quantity_available: number;
  price_range?: string;
  image_url?: string;
  stripe_price_id?: string;
  status: CollectionStatus;
  created_at: string;
}
