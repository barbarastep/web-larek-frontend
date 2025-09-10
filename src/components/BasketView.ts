import { ensureElement } from '../utils/utils';

// Отображает корзину целиком (список товаров, сумма и кнопка "Оформить")
export class BasketView {
  private container: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;
  private onCheckoutHandler?: () => void;

  // Вызовется при клике на кнопку "Оформить"
  private handleCheckout = () => {
    if (this.onCheckoutHandler) this.onCheckoutHandler();
  };

  constructor(root: HTMLElement) {
    this.container = root;

    this.listElement = ensureElement<HTMLElement>('.basket__list', root);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', root);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', root);

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
    this.onCheckoutHandler = handler;
  }

  // Создаёт сообщение о пустой корзине
  private makeEmptyMessage(): HTMLElement {
    const li = document.createElement('li');
    li.className = 'basket__empty';
    li.textContent = 'Корзина пуста';
    return li;
  }

  // Возвращает корневой элемент корзины
  public getElement(): HTMLElement {
    return this.container;
  }
}
