import { Form } from './common/form';
import { IOrderForm, IFormState } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class Order extends Form<Pick<IOrderForm, 'payment' | 'address'>> {
	protected _methodButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._methodButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._methodButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.selectPayment(btn);
				this.onInputChange('payment', btn.name);
			});
		});
	}

	resetPayment() {
		this._methodButtons.forEach((btn) => {
			btn.classList.remove('button_alt-active');
		});
	}

	selectPayment(button: HTMLButtonElement) {
		this.resetPayment();
		button.classList.add('button_alt-active');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	render(state: Pick<IOrderForm, 'payment' | 'address'> & IFormState) {
		this.resetPayment();
		return super.render(state);
	}
}
