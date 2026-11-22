export type Category =
  | "keyboard"
  | "mouse"
  | "mousepad"
  | "monitor-stand"
  | "headset"
  | "accessory";

export type Product = {
  id: string;
  name: string;
  category: Category;
  priceInCents: number;
  stock: number;
  specs: Record<string, string>;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  totalInCents: number;
  createdAt: Date;
};
