import { IEvents } from './base/events';
import { Events } from '../types';

// Отвечает за шапку сайта с кнопкой корзины
// Показывает количество товаров и сообщает о клике по корзине

export class Header {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;
  private events: IEvents;

  constructor(root: HTMLElement, events: IEvents) {
    this.basketButton = root.querySelector<HTMLButtonElement>('.header__basket')!;
    this.counterElement = root.querySelector<HTMLElement>('.header__basket-counter')!;
    this.events = events;

    if (!this.basketButton) throw new Error('Header: .header__basket not found');
    if (!this.counterElement) throw new Error('Header: .header__basket-counter not found');

    this.basketButton.addEventListener('click', () => {
      this.events.emit(Events.BasketOpen);
    });
  }

  // Установить количество товаров в корзине
  setCounter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
