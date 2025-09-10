import { ProductCardBase } from './ProductCardBase';
import type { BasketItemSummary } from '../types';

// Отображает одну строку товара в корзине
// Наследует базовую карточку, добавляет номер и кнопку "удалить"
export class BasketItemView extends ProductCardBase {
  private container: HTMLLIElement;
  private indexElement: HTMLElement | null;
  private deleteButton: HTMLButtonElement | null;
  private onRemoveHandler?: (id: string) => void;
  private currentId: string | null = null;

  constructor(root: HTMLElement, onRemoveHandler?: (id: string) => void) {
    super(root);

    const li = root as HTMLLIElement;
    if (li.tagName !== 'LI') throw new Error('BasketItemView: root must be <li>');
    this.container = li;

    this.indexElement = root.querySelector<HTMLElement>('.basket__item-index');
    this.deleteButton = root.querySelector<HTMLButtonElement>('.basket__item-delete');
    if (!this.deleteButton) throw new Error('BasketItemView: .basket__item-delete not found');

    this.onRemoveHandler = onRemoveHandler;
    this.deleteButton.addEventListener('click', this.handleDelete);
  }

  // Обработчик клика "удалить"
  private handleDelete = () => {
    if (this.onRemoveHandler && this.currentId) {
      this.onRemoveHandler(this.currentId);
    }
  };

  // Отрисовка данных строки корзины
  renderItem(data: BasketItemSummary & { index: number }): HTMLElement {
    this.currentId = data.id;

    if (this.indexElement) {
      this.indexElement.textContent = String(data.index);
    }

    this.setTitleAndPrice(data.title, data.price);

    return this.container;
  }
}
