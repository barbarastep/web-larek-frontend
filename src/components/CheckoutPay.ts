import type { CheckoutPayModalData } from '../types';
import { FormView } from './FormView';

const map_button_to_payment = {
  card: 'online',
  cash: 'cash',
} as const;

// Форма выбора способа оплаты и ввода адреса. Наследует FormView (общая логика форм)
// Отвечает за выбор online/cash, ввод адреса и активность кнопки «Далее»
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

    if (!buttonCard) throw new Error('CheckoutPay: button[name="card"] not found');
    if (!buttonCash) throw new Error('CheckoutPay: button[name="cash"] not found');
    if (!address) throw new Error('CheckoutPay: input[name="address"] not found');

    this.buttonCard = buttonCard;
    this.buttonCash = buttonCash;
    this.addressInput = address;

    this.buttonCard.addEventListener('click', () => this.setPayment(map_button_to_payment.card));
    this.buttonCash.addEventListener('click', () => this.setPayment(map_button_to_payment.cash));
    this.addressInput.addEventListener('input', () => this.validate());

    this.updateButtonsActive();
    this.validate();
  }

  // Заполнить форму данными
  setData(data: CheckoutPayModalData) {
    this.addressInput.value = data.address ?? '';
    this.selectedPayment = data.payment ?? '';
    this.updateButtonsActive();
    this.validate();
  }

  // Получить данные формы
  getData(): CheckoutPayModalData {
    return {
      payment: this.selectedPayment,
      address: this.addressInput.value.trim(),
    };
  }

  // Подписка на отправку формы
  onSubmit(handler: (data: CheckoutPayModalData) => void): void {
    super.onSubmit(() => handler(this.getData()));
  }

  // Установить выбранный способ оплаты
  private setPayment(p: 'online' | 'cash') {
    this.selectedPayment = p;
    this.updateButtonsActive();
    this.validate();
  }

  // Подсветка активной кнопки способа оплаты
  private updateButtonsActive() {
    this.buttonCard.classList.toggle('button_alt-active', this.selectedPayment === 'online');
    this.buttonCash.classList.toggle('button_alt-active', this.selectedPayment === 'cash');
  }

  // Проверка: адрес обязателен, иначе кнопка заблокирована
  private validate() {
    const errors: Record<string, string> = {};
    if (!this.addressInput.value.trim()) errors.address = 'Необходимо указать адрес';
    this.setErrors(errors);
  }
}
