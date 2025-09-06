// Отображает корзину целиком (список товаров, сумма и кнопка "Оформить")
export class BasketView {
  private container: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private checkoutHandlers: Array<() => void> = [];

  // Вызовется при клике на кнопку "Оформить"
  private handleCheckout = () => this.checkoutHandlers.forEach(h => h());

  constructor(root: HTMLElement) {
    this.container = root;

    // Берем элементы из шаблона <template id="basket">
    const list = root.querySelector<HTMLElement>('.basket__list');
    const total = root.querySelector<HTMLElement>('.basket__price');
    const btn = root.querySelector<HTMLButtonElement>('.basket__button');
    if (!list) throw new Error('BasketView: .basket__list not found');
    if (!total) throw new Error('BasketView: .basket__price not found');
    if (!btn) throw new Error('BasketView: .basket__button not found');

    this.listElement = list;
    this.totalElement = total;
    this.checkoutButton = btn;

    this.checkoutButton.addEventListener('click', this.handleCheckout);
    this.checkoutButton.disabled = true; // по умолчанию кнопка неактивна
  }

  // Подставляет список товаров (каждый товар — готовый <li>)
  setItems(items: HTMLElement[]) {
    if (items.length) {
    this.listElement.replaceChildren(...items);
    this.checkoutButton.disabled = false;
  } else {
    this.listElement.replaceChildren(this.makeEmptyMessage());
    this.checkoutButton.disabled = true;
  }
  }

  // Обновляет сумму заказа
  setTotal(value: number) {
    const formatted = value > 0 ? `${value} синапсов` : '0 синапсов';
    this.totalElement.textContent = formatted;
  }

  // Подписка на событие "Оформить"
  onCheckout(handler: () => void) {
    this.checkoutHandlers.push(handler);
  }

  private makeEmptyMessage(): HTMLElement {
    const li = document.createElement('li');
    li.className = 'basket__empty';
    li.textContent = 'Корзина пуста';
    return li;
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
