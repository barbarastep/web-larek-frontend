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

  setCounter(value: number) {
    this.counterElement.textContent = String(value);
  }

  onBasketClick(handler: () => void) {
    this.basketClickHandlers.push(handler);
    this.basketButton.addEventListener('click', handler);
  }
}
