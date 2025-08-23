export interface IProduct {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

export interface ICustomer {
  payment: 'card' | 'online' | ''
  email: string
  phone: string
  address: string
}
export interface IProductData {
  products: IProduct[];
  preview: string | null;
  getProducts(): IProduct[];
  setProducts(products: IProduct[]): void;
  getSelectedProduct(): IProduct | null;
  setSelectedProduct(product: IProduct): void;
}

export interface ICartModel {
  addProduct(product: IProduct): void;
  setQuantity(productId: string, qty: number): void;
  removeProduct(productId: string): void;
  count(): number;
  total(): number;
  getItems(): CartItem[];
  has(productId: string): boolean;
  clear(): void;
  buildOrderItems(): string[];
}

export interface ICustomerModel {
  update(data: Partial<ICustomer>): void;
  getData(): ICustomer;
  validate(): string[];
  clear(): void;
}

export type CatalogMain = Omit<IProduct, 'description'>;

export type CartItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;

export type CartItemWithQty = CartItemSummary & { qty: number };

export type CartPayModal = Pick<ICustomer, 'payment' | 'address'>;

export type CartContactModal = Pick<ICustomer, 'email' | 'phone'>;

export type OrderPayload = ICustomer & { items: string[] };

export type OrderResponse = { total: number };

export type CartItem = { product: IProduct; qty: number };
