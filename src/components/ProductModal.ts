import { ProductCardBase } from "./ProductCardBase";
import { IProduct } from "../types";

export class ProductModal extends ProductCardBase {
  private categoryElement: HTMLElement | null;
  private imgElement: HTMLImageElement | null;
  private descriptionElement: HTMLElement | null;
  private addButton: HTMLButtonElement | null;
  private addHandlers: Array<() => void> = [];

  private handleAdd = () => this.addHandlers.forEach(h => h());

  constructor(root: HTMLElement) {
    super(root);

    this.addButton = root.querySelector<HTMLButtonElement>('.card__button');
    if (!this.addButton) throw new Error('ProductModal: .card__button not found');

    this.descriptionElement = root.querySelector<HTMLElement>('.card__text');
    this.imgElement = root.querySelector<HTMLImageElement>('.card__image');
    this.categoryElement = root.querySelector<HTMLElement>('.card__category');

    this.addButton.addEventListener('click', this.handleAdd);
  }

  render(product: IProduct): HTMLElement {
    super.render(product);
    if (this.descriptionElement) this.descriptionElement.textContent = product.description || '';
    if (this.categoryElement) this.categoryElement.textContent = product.category || '';
    if (this.imgElement) {
      this.imgElement.src = product.image || '';
      this.imgElement.alt = product.title || '';
    }
    return this.getElement();
  }

  onAddItem(handler: () => void) {
    this.addHandlers.push(handler);
  }
}
