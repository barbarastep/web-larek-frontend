import './scss/styles.scss';

import { Catalog } from './components/Catalog';
import { Basket } from './components/Basket';
import { Customer } from './components/Customer';

import { EventEmitter, IEvents } from './components/base/events';

import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';

const events: IEvents = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// Получаем товары с сервера и кладём в каталог
appApi
  .getProducts()
  .then(items => {
    catalog.setProducts(items);
    console.log('Catalog loaded:', items.length, 'items');
  })
  .catch(err => {
    console.error('Failed to load products:', err);
  });


// Проверка открытия модального окна - удачно
// import { Modal } from './components/Modal';
// import { Events } from './types';

// const modal = new Modal(document.getElementById('modal-container')!, events);

// // Подпишись на события
// events.on(Events.ModalClose, () => console.log('[EVENT] ModalClose fired'));
// modal.onClose(() => console.log('[LOCAL] Modal closed'));

// // Тест: показать модалку с текстом
// const btn = document.createElement('button');
// btn.textContent = 'Open modal';
// btn.onclick = () => {
//   const test = document.createElement('div');
//   test.textContent = 'Hello from modal!';
//   modal.setContent(test);
// };
// document.body.appendChild(btn);

// Проверка открытия формы - удачно
// import { FormView } from './components/FormView';

// // взять содержимое шаблона
// const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
// const orderFormEl = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

// // вставим форму в DOM (например, прямо в body для проверки)
// document.body.appendChild(orderFormEl);

// // создать FormView
// const orderForm = new FormView(orderFormEl);

// // подписаться на submit
// orderForm.onSubmit((data) => {
//   console.log('Form submitted with data:', data);
// });

// // протестировать setData
// orderForm.setData({ address: 'СПб Восстания 1' });

// const addr = orderFormEl.querySelector<HTMLInputElement>('[name="address"]')!;
// addr.addEventListener('input', () => {
//   const ok = addr.value.trim().length > 0;
//   orderForm.setErrors(ok ? {} : { address: 'Необходимо указать адрес' });
// });

// Проверка ProductCardBase - удачно
// import { ProductCardBase } from './components/ProductCardBase';
// import { IProduct } from './types';

// // Найдём шаблон и клонируем
// const tpl = document.querySelector<HTMLTemplateElement>('#card-catalog');
// if (tpl) {
//   const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

//   // создаём карточку
//   const card = new ProductCardBase(node);

//   // подставляем тестовые данные
//   const product: IProduct = {
//     id: 'test-1',
//     title: 'Тестовый товар',
//     description: 'Описание не используется в базе',
//     image: '',
//     category: 'test',
//     price: 1234,
//   };

//   // рендерим и вставляем на страницу
//   const rendered = card.render(product);
//   document.querySelector('.gallery')?.appendChild(rendered);

//   console.log('ProductCardBase id:', card.getId());
//   console.log('Element:', card.getElement());
// }

// Проверка CatalogCardView - удачно
// import { CatalogCardView } from './components/CatalogCardView';
// import type { IProduct } from './types';

// const gallery = document.querySelector<HTMLElement>('.gallery')!;
// const tpl = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
// const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

// const product: IProduct = {
//   id: 'test-1',
//   title: 'Тестовый товар',
//   category: 'другое',
//   image: '/Subtract.svg', // или полный URL до картинки
//   description: 'не используется в каталоге',
//   price: 1234,
// };

// const card = new CatalogCardView(node);
// gallery.appendChild(card.render(product));

// // Проверка клика
// card.onCardClick((id) => console.log('[card click]', id));

// Проверка ProductModal - удачно
import { ProductModal } from './components/ProductModal';

// 1. Берём шаблон карточки для модалки
const tpl = document.querySelector<HTMLTemplateElement>('#card-preview')!;
const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

// 2. Тестовые данные продукта
const product = {
  id: 'test-42',
  title: 'Тестовый товар',
  description: 'Описание для модалки',
  category: 'тест',
  image: '/Subtract.svg',
  price: 500,
};

// 3. Создаём экземпляр ProductModal
const modalCard = new ProductModal(node);

// 4. Рендерим и добавляем в DOM (например, прямо в body)
document.body.appendChild(modalCard.render(product));

// 5. Проверяем реакцию на «В корзину»
modalCard.onAddItem(() => {
  console.log('[ProductModal] add to basket clicked', product.id);
});
