import type { IProduct, IBasketModel } from '../types';
import { Events } from '../types';
import { IEvents } from './base/events';

// Класс-модель корзины
// Хранит товары и оповещает систему об изменениях через events
export class Basket implements IBasketModel {
  private items: IProduct[] = [];
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Добавить товар в корзину (если ещё не добавлен)
  addItem(product: IProduct): void {
    if (!this.hasInBasket(product.id)) {
      this.items.push(product);
      this.events.emit(Events.BasketChanged, this.getItems());
    }
  }

  // Удалить товар из корзины по id
  removeProduct(productId: string): void {
    this.items = this.items.filter(p => p.id !== productId);
    this.events.emit(Events.BasketChanged, this.getItems());
  }

  // Получить копию списка товаров
  getItems(): IProduct[] {
    return [...this.items];
  }

  // Проверить, есть ли товар в корзине
  hasInBasket(productId: string): boolean {
    return this.items.some(p => p.id === productId);
  }

  // Очистить корзину
  clearBasket(): void {
    this.items = [];
    this.events.emit(Events.BasketChanged, this.getItems());
  }

  // Количество товаров в корзине
  getCount(): number {
    return this.items.length;
  }

  // Общая сумма заказа (null-цены игнорируются)
  getTotal(): number {
    return this.items.reduce((sum, p) => (p.price == null ? sum : sum + p.price), 0);
  }

  // Список id товаров для отправки в заказ
  buildOrderItems(): string[] {
    return this.items.map(p => p.id);
  }
}
