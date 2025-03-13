import { View } from '../base/view';
import { ensureElement } from '../../utils/utils';
import { ISuccess } from '../../types';
import { formatNumber } from '../../utils/utils';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends View<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this._total.textContent = `Списано ${formatNumber(value)} синапсов`;
	}
}
