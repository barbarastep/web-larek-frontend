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
  payment: 'online' | 'cash' | '';
  email: string;
  phone: string;
  address: string;
}

export type CatalogMain = Omit<IProduct, 'description'>;
export type BasketItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;
export type CheckoutPayModalData = Pick<ICustomer, 'payment' | 'address'>;
export type CheckoutContactModalData = Pick<ICustomer, 'email' | 'phone'>;
export type OrderPayload = ICustomer & { items: string[]; total: number };
export type OrderResponse = { total: number };
export type CustomerErrors = Record<string, string>;
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейсы модели данных
export interface IProductData {
  products: IProduct[];
  preview: string | null;
  getProducts(): IProduct[];
  setProducts(products: IProduct[]): void;
  getSelectedProduct(): IProduct | null;
  setSelectedProduct(product: IProduct): void;
  setSelectedProductId(id: string): void;
  getProductById(id: string): IProduct | null;
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
  validateData(stage?: 'pay' | 'contact' | 'all', draft?: Partial<ICustomer>): CustomerErrors;
  validatePay(draft?: Partial<ICustomer>): CustomerErrors;
  validateContacts(draft?: Partial<ICustomer>): CustomerErrors;
  clearData(): void;
}

// API-клиент
export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

// Интерфейсы представления
// Каталог (контейнер для карточек)
export interface ICatalogView {
  setCatalog(items: HTMLElement[]): void;
}

// Корзина (вид)
export interface IBasketView {
  setItems(items: HTMLElement[]): void;
  setTotal(value: number): void;
  onCheckout(handler: () => void): void;
  getElement(): HTMLElement;
}

// Шапка
export interface IHeaderView {
  setCounter(value: number): void;
}

// Модалка товара (preview)
export interface IProductModalView {
  render(product: IProduct): HTMLElement;
  onAddItem(handler: () => void): void;
  setPurchaseState(inBasket: boolean, isAvailable: boolean): void;
  getElement(): HTMLElement;
}

// Форма: способ оплаты + адрес
export interface ICheckoutPayView {
  render(data: CheckoutPayModalData, errors?: Record<string, string>): void;
  onPaymentSelect(handler: (payment: 'online' | 'cash') => void): void;
  onAddressChange(handler: (value: string) => void): void;
  onSubmit(handler: () => void): void;
  getElement(): HTMLFormElement;
}

// Форма: контакты (email + phone)
export interface ICheckoutContactView {
  render(data: CheckoutContactModalData, errors: Record<string, string>): void;
  onChange(handler: (data: CheckoutContactModalData) => void): void;
  onSubmit(handler: (data: CheckoutContactModalData) => void): void;
  getElement(): HTMLFormElement;
}

// События (общий словарь для взаимодействия между модулями)
export const Events = {
  CatalogUpdated: 'catalog:updated',
  PreviewChanged: 'catalog:previewChanged',

  GalleryCardClick: 'gallery:cardClick',
  BasketChanged: 'basket:changed',
  BasketAddItem: 'basket:addItem',
  BasketRemoveItem: 'basket:removeItem',
  BasketCheckout: 'basket:checkout',
  BasketOpen: 'basket:open',

  CustomerUpdated: 'customer:updated',
  CheckoutContactSubmit: 'checkout:contactSubmit',

  ModalOpen: 'modal:open',
  ModalClose: 'modal:close',
} as const;

// Ответ списков
export type ApiListResponse<T> = { total: number; items: T[] };
