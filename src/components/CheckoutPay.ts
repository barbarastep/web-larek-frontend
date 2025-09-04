import type { CheckoutPayModalData } from '../types';
import { FormView } from './FormView';

const map_button_to_payment = {
  card: 'online',
  cash: 'cash',
} as const;

export class CheckoutPay extends FormView {
  private buttonCard: HTMLButtonElement;
  private buttonCash: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private selectedPayment: 'online' | 'cash' | '' = '';

  constructor(formElement: HTMLFormElement) {
    super(formElement);

    const buttonCard = formElement.querySelector<HTMLButtonElement>('button[name="card"]');
    const buttonCash = formElement.querySelector<HTMLButtonElement>('button[name="cash"]');
    const address = formElement.querySelector<HTMLInputElement>('input[name="address"]');
    const submit = formElement.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (!buttonCard) throw new Error('CheckoutPay: button[name="card"] not found');
    if (!buttonCash) throw new Error('CheckoutPay: button[name="cash"] not found');
    if (!address) throw new Error('CheckoutPay: input[name="address"] not found');
    if (!submit) throw new Error('CheckoutPay: submit button not found');

    this.buttonCard = buttonCard;
    this.buttonCash = buttonCash;
    this.addressInput = address;

    this.buttonCard.addEventListener('click', () => this.setPayment(map_button_to_payment.card));
    this.buttonCash.addEventListener('click', () => this.setPayment(map_button_to_payment.cash));
    this.addressInput.addEventListener('input', () => this.validate());

    this.updateButtonsActive();
    this.validate();
  }

  setData(data: CheckoutPayModalData) {
    this.addressInput.value = data.address ?? '';
    this.selectedPayment = data.payment ?? '';
    this.updateButtonsActive();
    this.validate();
  }

  getData(): CheckoutPayModalData {
    return {
      payment: this.selectedPayment,
      address: this.addressInput.value.trim(),
    };
  }

  onSubmit(handler: (data: CheckoutPayModalData) => void): void {
    super.onSubmit(() => handler(this.getData()));
  }

  private setPayment(p: 'online' | 'cash') {
    this.selectedPayment = p;
    this.updateButtonsActive();
    this.validate();
  }

  private updateButtonsActive() {
    this.buttonCard.classList.toggle('button_alt-active', this.selectedPayment === 'online');
    this.buttonCash.classList.toggle('button_alt-active', this.selectedPayment === 'cash');
  }

  private validate() {
    const errors: Record<string, string> = {};
    if (!this.addressInput.value.trim()) errors.address = 'Необходимо указать адрес';
    this.setErrors(errors);
  }
}
