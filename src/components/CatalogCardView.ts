import { IProduct } from "../types";
import { ProductCardBase } from "./ProductCardBase";
import { CDN_URL } from "../utils/constants";

// Карточка товара в каталоге. Наследует ProductCardBase (название + цена)
// Дополнительно показывает категорию, картинку и сообщает о клике по карточке
export class CatalogCardView extends ProductCardBase {
  private categoryElement: HTMLElement | null;
  private imgElement: HTMLImageElement | null;
  private onCardClickHandler?: (id: string) => void;
  private currentId: string | null = null;
  private handleClick = () => {
    if (this.currentId && this.onCardClickHandler) {
      this.onCardClickHandler(this.currentId);
    }
  };
  constructor(root: HTMLElement) {
    super(root);
    const button = root as HTMLButtonElement;
    if (button.tagName !== 'BUTTON') {
      throw new Error('CatalogCardView root must be <button>');
    }

    this.categoryElement = root.querySelector('.card__category');
    this.imgElement = root.querySelector<HTMLImageElement>('.card__image');

    this.getElement().addEventListener('click', this.handleClick);
  }

  // Рендер карточки товара
  render(product: Omit<IProduct, 'description'>): HTMLElement {
    this.currentId = product.id;
    super.render(product as IProduct);
    if (this.categoryElement) {
      this.categoryElement.textContent = product.category || '';
      this.categoryElement.className = 'card__category';
      const mod = category_mod[(product.category || '').toLowerCase()];
      if (mod) this.categoryElement.classList.add(`card__category_${mod}`);
    }
    if (this.imgElement) {
      const p = product.image || '';
      const imageUrl = p.startsWith('http') ? p : `${CDN_URL}${p.startsWith('/') ? p : '/' + p}`;
      this.imgElement.src = imageUrl;
      this.imgElement.alt = product.title || '';
    }

    return this.getElement();
  }

  // Подписка на клик по карточке
  onCardClick(handler: (id: string) => void): void {
    this.onCardClickHandler = handler;
  }
}

const category_mod: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button',
};
