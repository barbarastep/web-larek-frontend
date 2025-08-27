import type { IProduct, ICustomer, IProductData, IBasketModel, ICustomerModel } from '../types';

export class Catalog implements IProductData {
  private productsData: IProduct[] = [];
  private previewId: string | null = null;

  get products(): IProduct[] { return [...this.productsData]; }
  get preview(): string | null { return this.previewId; }

  getProducts(): IProduct[] { return [...this.productsData]; }

  setProducts(products: IProduct[]): void {
    this.productsData = products;
  }

  getSelectedProduct(): IProduct | null {
    return this.previewId
      ? this.productsData.find(p => p.id === this.previewId) ?? null
      : null;
  }

  setSelectedProduct(product: IProduct): void {
    this.previewId = product.id;
  }

  setSelectedProductId(id: string): void {
    this.previewId = id;
  }
}

export class Basket implements IBasketModel {
  private items: IProduct[] = [];

  addProduct(prod: IProduct): void {
    if (!this.has(prod.id)) this.items.push(prod);
    // events.emit('cart:changed', this);
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(p => p.id !== productId);
    // events.emit('cart:changed', this);
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  has(productId: string): boolean {
    return this.items.some(p => p.id === productId);
  }

  clear(): void {
    this.items = [];
    // events.emit('cart:changed', this);
  }

  count(): number {
    return this.items.length;
  }

  total(): number {
    return this.items.reduce((sum, p) => (p.price == null ? sum : sum + p.price), 0);
  }

  buildOrderItems(): string[] {
    return this.items.map(p => p.id);
  }
}

export class Customer implements ICustomerModel {
  private payment: 'card' | 'online' | '' = '';
  private email = '';
  private phone = '';
  private address = '';

  update(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.address) errors.push('Необходимо указать адрес');
    return errors;
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }
}
