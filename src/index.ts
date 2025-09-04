// Импорты стилей, моделей, API и view-классов
import './scss/styles.scss';
import { Catalog } from './components/Catalog';
import { Basket } from './components/Basket';
import { Customer } from './components/Customer';
import { EventEmitter, IEvents } from './components/base/events';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';
import { Modal } from './components/Modal';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { BasketView } from './components/BasketView';
import { CatalogCardView } from './components/CatalogCardView';
import { ProductModal } from './components/ProductModal';
import { BasketItemView } from './components/BasketItemView';
import { CheckoutPay } from './components/CheckoutPay';
import { CheckoutContact } from './components/CheckoutContact';
import { Success } from './components/Success';
import { Events, IProduct } from './types';

// Инициализация моделей и API
const events: IEvents = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// DOM-контейнеры
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const headerElement = document.querySelector('.header') as HTMLElement;
const galleryElement = document.querySelector('.gallery') as HTMLElement;

// Шаблоны
const templateCatalogCard = document.getElementById('card-catalog') as HTMLTemplateElement;
const templateProductModal = document.getElementById('card-preview') as HTMLTemplateElement;
const templateBasket = document.getElementById('basket') as HTMLTemplateElement;
const templateBasketItem = document.getElementById('card-basket') as HTMLTemplateElement;
const templateOrder = document.getElementById('order') as HTMLTemplateElement;
const templateContacts = document.getElementById('contacts') as HTMLTemplateElement;
const templateSuccess = document.getElementById('success') as HTMLTemplateElement;

// Проверка на месте ли узлы
console.assert(!!modalContainer, 'modalContainer not found');
console.assert(!!headerElement, 'headerElement not found');
console.assert(!!galleryElement, 'galleryElement not found');
console.assert(!!templateCatalogCard && !!templateProductModal && !!templateBasket && !!templateBasketItem && !!templateOrder && !!templateContacts && !!templateSuccess, 'Some templates not found');

// Клонирование шаблонов
function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  const node = template.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) throw new Error('Template is empty or invalid');
  return node;
};

// Представления
const modal = new Modal(modalContainer, events);
const header = new Header(headerElement);

const makeCatalogCard = () => new CatalogCardView(cloneTemplate(templateCatalogCard));
const makeProductModal = () => new ProductModal(cloneTemplate(templateProductModal));
const makeBasketItem = () => new BasketItemView(cloneTemplate(templateBasketItem));
const makeBasketView = () => new BasketView(cloneTemplate(templateBasket));
const makeCheckoutPay = () => new CheckoutPay(cloneTemplate(templateOrder) as HTMLFormElement);
const makeCheckoutContact = () => new CheckoutContact(cloneTemplate(templateContacts) as HTMLFormElement);
const makeSuccess = () => new Success(cloneTemplate(templateSuccess));

// Подготовка контейнера списка и галереи
const galleryRoot = document.querySelector<HTMLElement>('main.gallery');
if (!galleryRoot) throw new Error('Gallery root <main class="gallery"> not found');
const gallery = new Gallery(galleryRoot);

// Рендер каталога при обновлении данных
events.on(Events.CatalogUpdated, (payload?: unknown) => {
  const products = (payload as IProduct[]) ?? catalog.getProducts();

  const template = document.getElementById('card-catalog') as HTMLTemplateElement | null;
  if (!template) throw new Error('Template #card-catalog not found');

  const items = products.map(product => {
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('#card-catalog content is empty');
    const card = new CatalogCardView(element);
    return card.render(product);
  });

  gallery.setCatalog(items);
})

// Загрузка каталога
// appApi
//   .getProducts()
//   .then(items => {
//     catalog.setProducts(items);
//     console.log('Catalog loaded:', items.length, 'items');
//   })
//   .catch(err => {
//     console.error('Failed to load products:', err);
//   });
