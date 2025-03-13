import { View } from './base/view';
import { ensureElement, formatNumber } from '../utils/utils';
import { ProductCategory } from '../types';
import { cardCategories } from '../utils/constants';
import { IProduct, ICardActions } from '../types';

export class Card extends View<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: ProductCategory) {
		this.setText(this._category, value);
		this._category?.classList.add(cardCategories[value]);
	}

	set price(value: number) {
		this.setText(
			this._price,
			value ? `${formatNumber(value)} синапсов` : 'Бесценно'
		);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	setDeleteButton() {
		this.setText(this._button, 'Удалить из корзины');
	}	

	render(data?: Partial<IProduct>, isInBasket?: boolean): HTMLElement {
		Object.assign(this as object, data ?? {});
		if (!data.price) {
			this.setDisabled(this._button, true);
		}
		if (isInBasket) {
			this.setDeleteButton();
		}
		return this.container;
	}
}
