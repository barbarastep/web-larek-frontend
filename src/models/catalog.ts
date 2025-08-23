import type { IProduct, ICustomer, IProductData, ICartModel, ICustomerModel, CartItem } from '../types';

class Catalog implements IProductData {
  private _products: IProduct[] = [];
  private _preview: string | null = null;


  get products() { return this._products; }
  get preview() { return this._preview; }

  getProducts(): IProduct[] { return [...this._products]; }
  setProducts(products: IProduct[]) { this._products = products; }
  getSelectedProduct(): IProduct | null {
  return this._preview ? this._products.find(p => p.id === this._preview) ?? null : null;}
  setSelectedProduct(product: IProduct) { this._preview = product.id; }
  setSelectedProductId(id: string) { this._preview = id; }
}

class Cart implements ICartModel {
  private _items: CartItem[] = [];

  addProduct(prod: IProduct): void {
    const item = this._items.find(i => i.product.id === prod.id);
    if (item) item.qty += 1;
    else this._items.push({ product: prod, qty: 1 });
    // events.emit('cart:changed', this);
  }

  setQuantity(productId: string, qty: number): void {
    const item = this._items.find(i => i.product.id === productId);
    if (!item) return;
    if (qty <= 0) this.removeProduct(productId);
    else item.qty = qty;
    // events.emit('cart:changed', this);
  }

  removeProduct(productId: string): void {
    this._items = this._items.filter(i => i.product.id !== productId);
    // events.emit('cart:changed', this);
  }

  count(): number {
    return this._items.reduce((n, i) => n + i.qty, 0);
  }

  total(): number {
    return this._items.reduce((sum, { product, qty }) =>
      product.price == null ? sum : sum + product.price * qty, 0);
  }

  getItems(): CartItem[] {
  return this._items.map(i => ({ product: i.product, qty: i.qty }));
}

  has(productId: string): boolean {
    return this._items.some(i => i.product.id === productId);
  }

  clear(): void {
    this._items = [];
    // events.emit('cart:changed', this);
  }

  buildOrderItems(): string[] {
    return this._items.flatMap(i => Array(i.qty).fill(i.product.id));
  }
}

class Customer implements ICustomerModel {
  private _payment: 'card' | 'online' | '' = '';
  private _email = '';
  private _phone = '';
  private _address = '';

  update(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email   !== undefined) this._email   = data.email;
    if (data.phone   !== undefined) this._phone   = data.phone;
    if (data.address !== undefined) this._address = data.address;
  }

  getData(): ICustomer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    };
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this._address) errors.push('Необходимо указать адрес');
    return errors;
  }

  clear(): void {
    this._payment = '';
    this._email = '';
    this._phone = '';
    this._address = '';
  }
}
