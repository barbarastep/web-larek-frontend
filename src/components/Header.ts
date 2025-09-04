// Отвечает за шапку сайта с кнопкой корзины
// Показывает количество товаров и сообщает о клике по корзине

export class Header {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;
  private basketClickHandlers: Array<() => void> = [];

  constructor(root: HTMLElement) {
    this.basketButton = root.querySelector<HTMLButtonElement>('.header__basket')!;
    this.counterElement = root.querySelector<HTMLElement>('.header__basket-counter')!;

    if (!this.basketButton) throw new Error('Header: .header__basket not found');
    if (!this.counterElement) throw new Error('Header: .header__basket-counter not found');
  }

  // Установить количество товаров в корзине
  setCounter(value: number) {
    this.counterElement.textContent = String(value);
  }

  // Подписка на клик по кнопке корзины
  onBasketClick(handler: () => void) {
    this.basketClickHandlers.push(handler);
    this.basketButton.addEventListener('click', handler);
  }
}
