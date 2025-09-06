// Окно подтверждения заказа. Показывает сообщение с суммой списанных синапсов
// Сообщает о клике по кнопке «За новыми покупками!»

export class Success {
  // Корневой контейнер, элементы сообщения и кнопки
  private root: HTMLElement;
  private messageElement: HTMLElement;
  private continueButton: HTMLButtonElement;

  // Список обработчиков клика по кнопке
  private continueHandlers: Array<() => void> = [];
  private handleContinue = () => this.continueHandlers.forEach(h => h());

  constructor(root: HTMLElement) {
    this.root = root;

    const messageElement = root.querySelector<HTMLElement>('.order-success__description');
    const continueButton = root.querySelector<HTMLButtonElement>('.order-success__close');

    if (!messageElement) throw new Error('Success: .order-success__description not found');
    if (!continueButton) throw new Error('Success: .order-success__close not found');

    this.messageElement = messageElement;
    this.continueButton = continueButton;

    this.continueButton.addEventListener('click', this.handleContinue);
  }

  // Устанавливает текст с итоговой суммой заказа
  setTotal(total: number) {
    const value = Math.max(0, Number(total) || 0);
    this.messageElement.textContent = `Списано ${value} синапсов`;
  }

  // Подписка на клик по кнопке «За новыми покупками!»
  onContinue(handler: () => void) {
    this.continueHandlers.push(handler);
  }

  public getElement(): HTMLElement {
    return this.root;
  }
}
