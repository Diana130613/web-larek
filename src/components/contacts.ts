import { Form } from './common/form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';

export class Contacts extends Form<Pick<IOrderForm, 'email' | 'phone'>> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
