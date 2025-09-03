import { IProduct } from "../types";

export class ProductCardBase {
  private root: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private product: IProduct | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.titleElement = this.root.querySelector('.card__title') as HTMLElement;
    this.priceElement = this.root.querySelector('.card__price') as HTMLElement;
  }

  render(product: IProduct): HTMLElement {
    this.product = product;
    this.titleElement.textContent = product.title;
    if (product.price === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${product.price} синапсов`;
    }
    return this.root;
  }

  getId(): string | null {
    return this.product ? this.product.id : null;
  }

  getElement(): HTMLElement {
    return this.root;
  }

}
