// Импорты стилей, моделей и API
import './scss/styles.scss';
import { Catalog } from './components/Catalog';
import { Basket } from './components/Basket';
import { Customer } from './components/Customer';
import { EventEmitter, IEvents } from './components/base/events';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';

// Инициализация моделей и API
const events: IEvents = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// Загрузка каталога
appApi
  .getProducts()
  .then(items => {
    catalog.setProducts(items);
    console.log('Catalog loaded:', items.length, 'items');
  })
  .catch(err => {
    console.error('Failed to load products:', err);
  });
