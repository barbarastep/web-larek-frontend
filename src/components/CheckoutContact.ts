import type { CheckoutContactModalData } from '../types';
import { FormView } from './FormView';

// Форма ввода email и телефона. Наследует FormView (общая логика форм)
// Отслеживает заполнение полей и включает кнопку «Оплатить», когда данные введены
export class CheckoutContact extends FormView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(formElement: HTMLFormElement) {
    super(formElement);

    const emailInput = formElement.querySelector<HTMLInputElement>('input[name="email"]');
    const phoneInput = formElement.querySelector<HTMLInputElement>('input[name="phone"]');
    const submit = formElement.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (!emailInput) throw new Error('CheckoutContact: input[name="email"] not found');
    if (!phoneInput) throw new Error('CheckoutContact: input[name="phone"] not found');
    if (!submit) throw new Error('CheckoutContact: submit button not found');

    this.emailInput = emailInput;
    this.phoneInput = phoneInput;

    this.emailInput.addEventListener('input', () => this.validate());
    this.phoneInput.addEventListener('input', () => this.validate());

    this.validate();
  }

  // Заполнить форму данными
  setData(data: CheckoutContactModalData): void {
    this.emailInput.value = data.email ?? '';
    this.phoneInput.value = data.phone ?? '';
    this.validate();
  }

  // Получить данные формы
  getData(): CheckoutContactModalData {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }

  // Подписка на отправку формы
  onSubmit(handler: (data: CheckoutContactModalData) => void): void {
    super.onSubmit(() => handler(this.getData()));
  }

  // Проверка: кнопка активна только если оба поля заполнены
  private validate(): void {
    const errors: Record<string, string> = {};

    if (!this.emailInput.value.trim()) {
      errors.email = '';
    }
    if (!this.phoneInput.value.trim()) {
      errors.phone = '';
    }

    this.setErrors(errors);
  }
}
