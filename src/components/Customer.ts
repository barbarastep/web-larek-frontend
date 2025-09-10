import type { ICustomer, ICustomerModel, CustomerErrors } from '../types';
import { Events } from '../types';
import { IEvents } from './base/events';

// Модель клиента. Хранит данные о пользователе (оплата, email, телефон, адрес)
// Позволяет обновлять, очищать и валидировать данные. Уведомляет систему через events при изменениях
export class Customer implements ICustomerModel {
  private payment: 'online' | 'cash' | '' = '';
  private email = '';
  private phone = '';
  private address = '';
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Обновить данные клиента и оповестить подписчиков
  updateData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events.emit(Events.CustomerUpdated, this.getData());
  }

  // Получить все данные клиента
  getData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  // Проверка данных клиента (валидность)
  validateData(
    stage: 'pay' | 'contact' | 'all' = 'all',
    draft: Partial<ICustomer> = {}
  ): CustomerErrors {
    const cur = this.getData();
    const data: ICustomer = {
      payment: draft.payment ?? cur.payment,
      address: draft.address ?? cur.address,
      email: draft.email ?? cur.email,
      phone: draft.phone ?? cur.phone,
    };

    const errors: CustomerErrors = {};
    if (stage === 'pay' || stage === 'all') {
      if (!data.payment) errors.payment = '';
      if (!data.address?.trim()) errors.address = 'Необходимо указать адрес';
    }
    if (stage === 'contact' || stage === 'all') {
      if (!data.email?.trim() || !data.phone?.trim()) {
        errors.contact = 'Необходимо заполнить поля';
      }
    }
    return errors;
  }

  validatePay(draft: Partial<ICustomer> = {}): CustomerErrors {
    return this.validateData('pay', draft);
  }

  validateContacts(draft: Partial<ICustomer> = {}): CustomerErrors {
    return this.validateData('contact', draft);
  }

  // Сброс данных клиента
  clearData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit(Events.CustomerUpdated, this.getData());
  }
}
