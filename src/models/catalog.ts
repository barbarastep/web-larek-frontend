import type { IProduct, TCartItem, ICustomer } from '../types';

class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  getProducts(): IProduct[] {
    return this.products;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }
}

class Cart {
  private items: TCartItem[] = [];

  addProduct(prod: IProduct): void {
    const item = this.items.find(i => i.product.id === prod.id);
    if (item) item.qty += 1;
    else this.items.push({ product: prod, qty: 1 });
    // events.emit('cart:changed', this);
  }

  setQuantity(productId: string, qty: number): void {
    const item = this.items.find(i => i.product.id === productId);
    if (!item) return;
    if (qty <= 0) this.removeProduct(productId);
    else item.qty = qty;
    // events.emit('cart:changed', this);
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(i => i.product.id !== productId);
    // events.emit('cart:changed', this);
  }

  count(): number {
    return this.items.reduce((n, i) => n + i.qty, 0);
  }

  total(): number {
    return this.items.reduce((sum, { product, qty }) =>
      product.price == null ? sum : sum + product.price * qty, 0);
  }

  buildOrderItems(): string[] {
    return this.items.flatMap(i => Array(i.qty).fill(i.product.id));
  }
}

class Customer {
  private payment: string;
  private email: string;
  private phone: string;
  private address: string;

  update(payment: string, email: string, phone: string, address: string): void {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  getData(): { payment: string; email: string; phone: string; address: string } {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  validate(): string[] {
    const errors: string[] = [];
    if (!this.address) errors.push('Необходимо указать адрес');
    return errors;
  }
}
