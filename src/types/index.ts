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

export interface IBasketModel {
  addProduct(product: IProduct): void;
  removeProduct(productId: string): void;
  getItems(): IProduct[];
  has(productId: string): boolean;
  clear(): void;
  count(): number;
  total(): number;
  buildOrderItems(): string[];
}

export interface ICustomerModel {
  update(data: Partial<ICustomer>): void;
  getData(): ICustomer;
  validate(): string[];
  clear(): void;
}

export type CatalogMain = Omit<IProduct, 'description'>;

export type BasketItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;

export type CheckoutPayModalData = Pick<ICustomer, 'payment' | 'address'>;

export type CheckoutContactModalData = Pick<ICustomer, 'email' | 'phone'>;

export type OrderPayload = ICustomer & { items: string[] };

export type OrderResponse = { total: number };
