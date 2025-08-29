// Базовые типы данных
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface ICustomer {
  payment: 'card' | 'online' | '';
  email: string;
  phone: string;
  address: string;
}

export type CatalogMain = Omit<IProduct, 'description'>;
export type BasketItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;
export type CheckoutPayModalData = Pick<ICustomer, 'payment' | 'address'>;
export type CheckoutContactModalData = Pick<ICustomer, 'email' | 'phone'>;
export type OrderPayload = ICustomer & { items: string[] };
export type OrderResponse = { total: number };
export type CustomerErrors = Record<string, string>;

// Интерфейсы модели данных
export interface IProductData {
  products: IProduct[];
  preview: string | null;

  getProducts(): IProduct[];
  setProducts(products: IProduct[]): void;

  getSelectedProduct(): IProduct | null;
  setSelectedProduct(product: IProduct): void;
  setSelectedProductId(id: string): void;
}

export interface IBasketModel {
  addItem(product: IProduct): void;
  removeProduct(productId: string): void;
  getItems(): IProduct[];
  hasInBasket(productId: string): boolean;
  clearBasket(): void;
  getCount(): number;
  getTotal(): number;
  buildOrderItems(): string[];
}

export interface ICustomerModel {
  updateData(data: Partial<ICustomer>): void;
  getData(): ICustomer;
  validateData(): CustomerErrors;
  clearData(): void;
}

// API-клиент
export interface IApiClient {
  get<T = unknown>(uri: string): Promise<T>;
  post<T = unknown>(
    uri: string,
    data: object,
    method?: 'POST' | 'PUT' | 'DELETE'
  ): Promise<T>;
}

// Интерфейсы представления
// Каталог (список карточек)
export interface ICatalogView {
  render(list: CatalogMain[]): void;
  onOpenDetails(handler: (productId: string) => void): void; // клик по карточке
}

// Корзина
export interface IBasketView {
  render(lines: BasketItemSummary[], total: number, count: number): void;
  onRemove(handler: (productId: string) => void): void;
  onCheckout(handler: () => void): void;
}


// Модалка оплаты/адреса
export interface ICheckoutPayView {
  setData(data: CheckoutPayModalData): void;
  onSubmit(handler: (data: CheckoutPayModalData) => void): void;
}

// Модалка контактов
export interface ICheckoutContactView {
  setData(data: CheckoutContactModalData): void;
  onSubmit(handler: (data: CheckoutContactModalData) => void): void;
}

// События
export const Events = {
  // данные
  CatalogUpdated: 'catalog:updated',
  PreviewChanged: 'catalog:previewChanged',
  BasketChanged: 'basket:changed',
  CustomerUpdated: 'customer:updated',
  OrderCreated: 'order:created',
  OrderError: 'order:error',

  // UI
  HeaderBasketClick: 'header:basketClick',
  GalleryCardClick: 'gallery:cardClick',
  ModalClose: 'modal:close',
  BasketAddItem: 'basket:addItem',
  BasketRemoveItem: 'basket:removeItem',
  BasketCheckout: 'basket:checkout',
  CheckoutPaymentSelect: 'checkout:paymentSelect',
  CheckoutPayValidate: 'checkout:payValidate',
  CheckoutPaySubmit: 'checkout:paySubmit',
  CheckoutContactValidate: 'checkout:contactValidate',
  CheckoutContactSubmit: 'checkout:contactSubmit',
  SuccessContinue: 'success:continue',
} as const;

export interface IEvents {
  on(event: string | RegExp, cb: (data?: unknown) => void): void;
  off(event: string | RegExp, cb: (data?: unknown) => void): void;
  emit(event: string, data?: unknown): void;
  trigger(event: string, context?: object): (data?: object) => void;
}

// Ответ списков
export type ApiListResponse<T> = { total: number; items: T[] };
