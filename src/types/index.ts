export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительное'
	| 'другое';

export type CategoryClasses = Record<ProductCategory, string>;

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	price: number | null;
	category: ProductCategory;
	index: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IWebLarekApi {
	getProductList: () => Promise<IProduct[]>;
	getProductInfo: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IModalView {
	content: HTMLElement;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ISuccess {
	total: number;
}
