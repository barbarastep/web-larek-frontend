export class BasketView {
  private container: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private checkoutHandlers: Array<() => void> = [];
  private handleCheckout = () => this.checkoutHandlers.forEach(h => h());

  constructor(root: HTMLElement) {
    this.container = root;

    const list = root.querySelector<HTMLElement>('.basket__list');
    const total = root.querySelector<HTMLElement>('.basket__price');
    const btn   = root.querySelector<HTMLButtonElement>('.basket__button');
    if (!list)  throw new Error('BasketView: .basket__list not found');
    if (!total) throw new Error('BasketView: .basket__price not found');
    if (!btn)   throw new Error('BasketView: .basket__button not found');

    this.listElement = list;
    this.totalElement = total;
    this.checkoutButton = btn;

    this.checkoutButton.addEventListener('click', this.handleCheckout);
    this.checkoutButton.disabled = true;
  }

  setItems(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
    this.checkoutButton.disabled = items.length === 0;
  }

  setTotal(value: number) {
    const formatted = value > 0 ? `${value} синапсов` : '0 синапсов';
    this.totalElement.textContent = formatted;
  }

  onCheckout(handler: () => void) {
    this.checkoutHandlers.push(handler);
  }
}
