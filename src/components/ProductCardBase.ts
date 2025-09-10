import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";

// Базовый класс для карточек товара. Содержит только общие части: заголовок и цену
// Другие представления (каталог, корзина, модалка) будут расширять этот класс
export class ProductCardBase {
  private root: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.root);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.root);
  }

  // Отрисовывает текущие данные товара и возвращает DOM-узел
  render(product: IProduct): HTMLElement {
    this.setTitleAndPrice(product.title, product.price);
    return this.root;
  }

  // Возвращает DOM-элемент карточки
  getElement(): HTMLElement {
    return this.root;
  }

  // Форматирование цены: «Бесценно» или «N синапсов»
  protected formatPrice(price: number | null): string {
    return price == null ? 'Бесценно' : `${price} синапсов`;
  }

  // Утилита для наследников: единообразно проставляет заголовок и цену
  protected setTitleAndPrice(title: string, price: number | null): void {
    this.titleElement.textContent = title;
    this.priceElement.textContent = this.formatPrice(price);
  }
}
