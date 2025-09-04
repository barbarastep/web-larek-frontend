import type { ICustomer, ICustomerModel, CustomerErrors } from '../types';
import { Events } from '../types';
import { IEvents } from './base/events';

// Клиент (модель данных)
export class Customer implements ICustomerModel {
  private payment: 'online' | 'cash' | '' = '';
  private email = '';
  private phone = '';
  private address = '';
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  updateData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    this.events.emit(Events.CustomerUpdated, this.getData());
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  validateData(): CustomerErrors {
    const errors: CustomerErrors = {};
    if (!this.address) errors.address = 'Необходимо указать адрес';
    return errors;
  }

  clearData(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit(Events.CustomerUpdated, this.getData());
  }
}
