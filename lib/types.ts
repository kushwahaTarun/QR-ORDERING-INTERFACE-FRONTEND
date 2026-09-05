export type StaffRole = "SUPER_ADMIN" | "OWNER" | "MANAGER";

export type Staff = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  restaurantId: string | null;
  restaurant: RestaurantRef | null;
};

export type RestaurantRef = {
  id: string;
  slug: string;
  name: string;
  isActive?: boolean;
  location?: string | null;
};

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export type OrderLine = {
  lineId?: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
};

export type HouseOrder = {
  id: string;
  orderNumber: string;
  tableNumber: string;
  customerName: string;
  mobile: string;
  wantsOffers: boolean;
  items: OrderLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyAt: string;
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  diet: "veg" | "non-veg" | "egg";
  available: boolean;
  popular: boolean;
  chefPick: boolean;
  tags: string[];
};

export type TableQr = {
  tableNumber: string;
  accessKey: string;
  url: string;
};

export type Guest = {
  name: string;
  mobile: string;
  wantsOffers: boolean;
  lastVisit: string;
  orders: number;
  spent: number;
};

export type Insight = {
  title: string;
  body: string;
  tone: "good" | "watch" | "action" | string;
  tags?: string[];
};
