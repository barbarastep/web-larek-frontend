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

export interface IApiClient {
  get<T = unknown>(uri: string): Promise<T>;
  post<T = unknown>(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>;
}

export interface ICatalogView {
  render(list: CatalogMain[]): void;
  onAddToCart(handler: (productId: string) => void): void;
  onOpenDetails(handler: (productId: string) => void): void;
}

export interface ICartView {
  render(lines: CartItemWithQty[], total: number, count: number): void;
  onRemove(handler: (productId: string) => void): void;
  onQtyChange(handler: (productId: string, qty: number) => void): void;
  onCheckout(handler: () => void): void;
}

export interface ICheckoutPayView {
  setData(data: CartPayModal): void;
  onSubmit(handler: (data: CartPayModal) => void): void;
}

export interface ICheckoutContactView {
  setData(data: CartContactModal): void;
  onSubmit(handler: (data: CartContactModal) => void): void;
}

export const Events = {
  CatalogUpdated: 'catalog:updated',
  PreviewChanged: 'catalog:previewChanged',
  CartChanged: 'cart:changed',
  OrderCreated: 'order:created',
  OrderError: 'order:error',
  CustomerUpdated: 'customer:updated',
} as const;

export interface IEvents {
  on(event: string | RegExp, cb: (data?: unknown) => void): void;
  off(event: string | RegExp, cb: (data?: unknown) => void): void;
  emit(event: string, data?: unknown): void;
  trigger(event: string, context?: object): (data?: object) => void;
}

export type ApiListResponse<T> = { total: number; items: T[] };
