// Базовый класс для карточек товара. Содержит только общие части: заголовок и цену
// Другие представления (каталог, корзина, модалка) будут расширять этот класс

import { IProduct } from "../types";

export class ProductCardBase {
  // Основные элементы карточки
  private root: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;

  // Данные продукта (сохраняются после рендера)
  private product: IProduct | null = null;

  // Инициализация с готовым DOM-узлом
  constructor(root: HTMLElement) {
    this.root = root;
    this.titleElement = this.root.querySelector('.card__title') as HTMLElement;
    this.priceElement = this.root.querySelector('.card__price') as HTMLElement;
  }

  // Заполняет карточку данными и возвращает DOM-элемент
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

  // Возвращает id продукта
  getId(): string | null {
    return this.product ? this.product.id : null;
  }

  // Возвращает DOM-элемент карточки
  getElement(): HTMLElement {
    return this.root;
  }

  protected getProduct(): IProduct | null {
    return this.product;
  }
}
