import type { IProduct, ICustomer, IProductData, IBasketModel, ICustomerModel, CustomerErrors } from '../types';


// Каталог (данные)
export class Catalog implements IProductData {
  private productsData: IProduct[] = [];
  private previewId: string | null = null;

  get products(): IProduct[] { return [...this.productsData]; }
  get preview(): string | null { return this.previewId; }

  getProducts(): IProduct[] { return [...this.productsData]; }

  setProducts(products: IProduct[]): void {
    this.productsData = products;
    // events.emit('catalog:updated', this.productsData);
  }

  getSelectedProduct(): IProduct | null {
    return this.previewId
      ? this.productsData.find(p => p.id === this.previewId) ?? null
      : null;
  }

  setSelectedProduct(product: IProduct): void {
    this.previewId = product.id;
    // events.emit('catalog:previewChanged', this.previewId);
  }

  setSelectedProductId(id: string): void {
    this.previewId = id;
    // events.emit('catalog:previewChanged', this.previewId);
  }
}

// Корзина (модель данных)
export class Basket implements IBasketModel {
  private items: IProduct[] = [];

  addItem(product: IProduct): void {
    if (!this.hasInBasket(product.id)) this.items.push(product);
    // events.emit('basket:changed', this.getItems());
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(p => p.id !== productId);
    // events.emit('basket:changed', this.getItems());
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  hasInBasket(productId: string): boolean {
    return this.items.some(p => p.id === productId);
  }

  clearBasket(): void {
    this.items = [];
    // events.emit('basket:changed', this.getItems());
  }

  getCount(): number {
    return this.items.length;
  }

  getTotal(): number {
    return this.items.reduce((sum, p) => (p.price == null ? sum : sum + p.price), 0);
  }

  buildOrderItems(): string[] {
    return this.items.map(p => p.id);
  }
}

// Клиент (модель данных)
export class Customer implements ICustomerModel {
  private payment: 'card' | 'online' | '' = '';
  private email = '';
  private phone = '';
  private address = '';

  updateData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    // events.emit('customer:updated', this.getData());
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  validateData(): CustomerErrors {
    const errors: CustomerErrors = {};
    if (!this.address) errors.address = 'Необходимо указать адрес';
    return errors;
  }

  clearData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    // events.emit('customer:updated', this.getData());
  }
}
