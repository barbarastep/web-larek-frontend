import { ProductCardBase } from './ProductCardBase';
import type { BasketItemSummary, IProduct } from '../types';

// Отображает одну строку товара в корзине
// Наследует базовую карточку, добавляет номер и кнопку "удалить"
export class BasketItemView extends ProductCardBase {
  private container: HTMLLIElement;
  private indexElement: HTMLElement | null;
  private deleteButton: HTMLButtonElement | null;
  private removeHandlers: Array<(id: string) => void> = [];

  // Вызовется при клике на кнопку "удалить"
  private handleDelete = () => {
    const id = this.getId();
    if (id) this.removeHandlers.forEach(h => h(id));
  };

  constructor(root: HTMLElement) {
    super(root);
    const li = root as HTMLLIElement;
    if (li.tagName !== 'LI') throw new Error('BasketItemView: root must be <li>');
    this.container = li;

    // Берем элементы из шаблона <template id="card-basket">
    this.indexElement  = root.querySelector<HTMLElement>('.basket__item-index');
    this.deleteButton  = root.querySelector<HTMLButtonElement>('.basket__item-delete');
    if (!this.deleteButton) throw new Error('BasketItemView: .basket__item-delete not found');

    this.deleteButton.addEventListener('click', this.handleDelete);
  }

  // Подставляет данные товара и возвращает готовый <li>
  renderItem(data: BasketItemSummary & { index: number }): HTMLElement {
    if (this.indexElement) this.indexElement.textContent = String(data.index);

    const product: IProduct = {
      id: data.id,
      title: data.title,
      price: data.price,
      description: '',
      image: '',
      category: '',
    };
    super.render(product);
    return this.container;
  }

  // Подписка на событие удаления товара
  onRemove(handler: (id: string) => void): void {
    this.removeHandlers.push(handler);
  }
}
