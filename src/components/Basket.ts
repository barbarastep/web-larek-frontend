import type { IProduct, IBasketModel } from '../types';
import { Events } from '../types';
import { IEvents } from './base/events';

// Корзина (модель данных)
export class Basket implements IBasketModel {
  private items: IProduct[] = [];
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  addItem(product: IProduct): void {
    if (!this.hasInBasket(product.id)) {
      this.items.push(product);
      this.events.emit(Events.BasketChanged, this.getItems());
    }
  }

  removeProduct(productId: string): void {
    this.items = this.items.filter(p => p.id !== productId);
    this.events.emit(Events.BasketChanged, this.getItems());
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  hasInBasket(productId: string): boolean {
    return this.items.some(p => p.id === productId);
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit(Events.BasketChanged, this.getItems());
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
