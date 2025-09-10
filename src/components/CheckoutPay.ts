import type { CheckoutPayModalData } from '../types';
import { FormView } from './FormView';
import { ensureElement } from '../utils/utils';

// Форма выбора способа оплаты и ввода адреса. Наследует FormView (общая логика форм)
// Отвечает за выбор online/cash, ввод адреса и активность кнопки «Далее»
export class CheckoutPay extends FormView {
  private buttonCard: HTMLButtonElement;
  private buttonCash: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private onPaymentHandler?: (payment: 'online' | 'cash') => void;
  private onAddressHandler?: (value: string) => void;

  constructor(formElement: HTMLFormElement) {
    super(formElement);

    this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', formElement);
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', formElement);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', formElement);

    this.buttonCard.addEventListener('click', () => {
      this.onPaymentHandler?.('online');
    });

    this.buttonCash.addEventListener('click', () => {
      this.onPaymentHandler?.('cash');
    });
    this.addressInput.addEventListener('input', () => {
      this.onAddressHandler?.(this.addressInput.value);
    });
  }

  // Рендер данных в форму
  render(data: CheckoutPayModalData, errors: Record<string, string> = {}): void {
    this.addressInput.value = data.address ?? '';

    const isOnline = data.payment === 'online';
    const isCash = data.payment === 'cash';
    this.buttonCard.classList.toggle('button_alt-active', isOnline);
    this.buttonCash.classList.toggle('button_alt-active', isCash);

    this.setErrors(errors);
  }

  // Навешивание обработчиков событий
  onPaymentSelect(handler: (payment: 'online' | 'cash') => void) {
    this.onPaymentHandler = handler;
  }
  onAddressChange(handler: (value: string) => void) {
    this.onAddressHandler = handler;
  }
}
