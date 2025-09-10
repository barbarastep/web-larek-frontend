import { ProductCardBase } from "./ProductCardBase";
import { IProduct } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";

// Карточка товара в модальном окне. Наследуется от ProductCardBase: отображает базовые данные (название, цена)
// Дополнительно показывает категорию, описание, изображение и кнопку «В корзину»
// Сообщает наружу о клике на кнопку добавления

export class ProductModal extends ProductCardBase {
  // DOM-элементы карточки в модалке
  private categoryElement: HTMLElement;
  private imgElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private addButton: HTMLButtonElement;

  constructor(root: HTMLElement) {
    super(root);

    this.addButton = ensureElement<HTMLButtonElement>('.card__button', root);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', root);
    this.imgElement = ensureElement<HTMLImageElement>('.card__image', root);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', root);

    this.addButton.addEventListener('click', this.handleAdd);
  }

  // Обработчик клика «В корзину»
  private onAddHandler?: () => void;

  // Вызов обработчика при клике
  private handleAdd = () => { if (this.onAddHandler) this.onAddHandler(); };

  // Переопределяет формат цены: в модалке для null выводим «Бесценно»
  protected formatPrice(price: number | null): string {
    return price == null ? 'Бесценно' : `${price} синапсов`;
  }

  // Подставляет данные товара в карточку внутри модалки
  render(product: IProduct): HTMLElement {
    super.render(product);
    this.descriptionElement.textContent = product.description || '';
    this.categoryElement.textContent = product.category || '';
    this.categoryElement.className = 'card__category';
    const mod = category_mod[(product.category || '').toLowerCase()];
    if (mod) this.categoryElement.classList.add(`card__category_${mod}`);
    const p = product.image || '';
    const imageUrl = p.startsWith('http') ? p : `${CDN_URL}${p.startsWith('/') ? p : '/' + p}`;
    this.imgElement.src = imageUrl;
    this.imgElement.alt = product.title || '';

    return this.getElement();
  }

  // Подписка на событие «добавить товар в корзину»
  onAddItem(handler: () => void) {
    this.onAddHandler = handler;
  }

  // Обновляет состояние кнопки
  setPurchaseState(inBasket: boolean, isAvailable: boolean) {
    if (!isAvailable) {
      this.addButton.textContent = 'Недоступно';
      this.addButton.disabled = true;
      return;
    }
    this.addButton.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
    this.addButton.disabled = false;
  }

}

const category_mod: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button',
};
