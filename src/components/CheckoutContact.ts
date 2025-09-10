import type { CheckoutContactModalData } from '../types';
import { FormView } from './FormView';
import { ensureElement } from '../utils/utils';

// Форма ввода email и телефона. Наследует FormView (общая логика форм)
// Отслеживает заполнение полей и включает кнопку «Оплатить», когда данные введены
export class CheckoutContact extends FormView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private changeHandler?: (data: CheckoutContactModalData) => void;

  constructor(formElement: HTMLFormElement) {
    super(formElement);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', formElement);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', formElement);

    const notify = () => this.changeHandler?.(this.getData());
    this.emailInput.addEventListener('input', notify);
    this.phoneInput.addEventListener('input', notify);
  }

  // Рендер: данные и ошибки приходят извне от презентера/модели
  render(data: CheckoutContactModalData, errors: Record<string, string>) {
    this.emailInput.value = data.email ?? '';
    this.phoneInput.value = data.phone ?? '';
    this.setErrors(errors); // FormView сам заблокирует submit при наличии ошибок
  }

  // Текущие данные формы
  getData(): CheckoutContactModalData {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }

  // Коллбек на изменение полей
  onChange(handler: (data: CheckoutContactModalData) => void) {
    this.changeHandler = handler;
  }

  // Сабмит: просто отдаём наружу текущие данные
  onSubmit(handler: (data: CheckoutContactModalData) => void): void {
    super.onSubmit(() => handler(this.getData()));
  }
}
