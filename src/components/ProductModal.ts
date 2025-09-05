import { ProductCardBase } from "./ProductCardBase";
import { IProduct } from "../types";
import { CDN_URL } from "../utils/constants";

// Карточка товара в модальном окне. Наследуется от ProductCardBase: отображает базовые данные (название, цена)
// Дополнительно показывает категорию, описание, изображение и кнопку «В корзину»
// Сообщает наружу о клике на кнопку добавления

export class ProductModal extends ProductCardBase {
  // DOM-элементы карточки в модалке
  private categoryElement: HTMLElement | null;
  private imgElement: HTMLImageElement | null;
  private descriptionElement: HTMLElement | null;
  private addButton: HTMLButtonElement | null;

  // Список обработчиков клика «В корзину»
  private addHandlers: Array<() => void> = [];

  // Вызов всех обработчиков при клике
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

  // Подставляет данные товара в карточку внутри модалки
  render(product: IProduct): HTMLElement {
    super.render(product);
    if (this.descriptionElement) this.descriptionElement.textContent = product.description || '';
    if (this.categoryElement) this.categoryElement.textContent = product.category || '';
    if (this.imgElement) {
      const p = product.image || '';
      const imageUrl = p.startsWith('http') ? p : `${CDN_URL}${p.startsWith('/') ? p : '/' + p}`;
      this.imgElement.src = imageUrl;
      this.imgElement.alt = product.title || '';
    }
    return this.getElement();
  }

  // Подписка на событие «добавить товар в корзину»
  onAddItem(handler: () => void) {
    this.addHandlers.push(handler);
  }
}
