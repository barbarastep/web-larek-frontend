import { ProductCardBase } from './ProductCardBase';
import type { BasketItemSummary, IProduct } from '../types';

export class BasketItemView extends ProductCardBase {
  private container: HTMLLIElement;
  private indexElement: HTMLElement | null;
  private deleteButton: HTMLButtonElement | null;
  private removeHandlers: Array<(id: string) => void> = [];

  private handleDelete = () => {
    const id = this.getId();
    if (id) this.removeHandlers.forEach(h => h(id));
  };

  constructor(root: HTMLElement) {
    super(root);
    const li = root as HTMLLIElement;
    if (li.tagName !== 'LI') throw new Error('BasketItemView: root must be <li>');
    this.container = li; // <-- важно!

    // классы как в шаблоне <template id="card-basket">
    this.indexElement  = root.querySelector<HTMLElement>('.basket__item-index');
    this.deleteButton  = root.querySelector<HTMLButtonElement>('.basket__item-delete');
    if (!this.deleteButton) throw new Error('BasketItemView: .basket__item-delete not found');

    this.deleteButton.addEventListener('click', this.handleDelete);
  }

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

  onRemove(handler: (id: string) => void): void {
    this.removeHandlers.push(handler);
  }
}
