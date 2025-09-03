import { IProduct } from "../types";
import { ProductCardBase } from "./ProductCardBase";

export class CatalogCardView extends ProductCardBase {
  private container: HTMLButtonElement;
  private categoryElement: HTMLElement | null;
  private imgElement: HTMLImageElement | null;
  private clickHandlers: Array<(id: string) => void> = [];
  private handleClick = () => { const id = this.getId(); if (id) this.clickHandlers.forEach(h => h(id)); };

  constructor(root: HTMLElement) {
    super(root);
    const button = root as HTMLButtonElement;
    if (button.tagName !== 'BUTTON') {
      throw new Error('CatalogCardView root must be <button>');
    }
    this.container = button;

    this.categoryElement = root.querySelector('.card__category');
    this.imgElement = root.querySelector<HTMLImageElement>('.card__image');

    this.container.addEventListener('click', this.handleClick);
  }

  render(product: Omit<IProduct, 'description'>): HTMLElement {
    super.render(product as IProduct);
    if (this.categoryElement) this.categoryElement.textContent = product.category || '';
    if (this.imgElement) {
      this.imgElement.src = product.image || '';
      this.imgElement.alt = product.title || '';
    }

    return this.container;
  }

  onCardClick(handler: (id: string) => void): void {
    this.clickHandlers.push(handler);
  }

  public destroy() {
    this.container.removeEventListener('click', this.handleClick);
  }
}
