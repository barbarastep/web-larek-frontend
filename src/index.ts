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


// // Проверка открытия модального окна - удачно
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
