import './scss/styles.scss';

import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/webLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { Page } from './components/page';
import { AppData, ProductItem } from './components/appState';
import { IProduct, IOrder, IOrderForm } from './types';
import { Card } from './components/card';
import { Modal } from './components/common/modal';
import { Basket } from './components/common/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/common/success';

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

const page = new Page(document.body, events);
const appData = new AppData(events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on<IProduct>('items:show', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
			id: item.id,
		});
	});
});

events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
});

events.on('preview:show', (item: ProductItem) => {
	const isInBasket:boolean = !!appData.basket.find(i => i.id === appData.preview);
	const showItem = (item: ProductItem) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (!isInBasket) {
					events.emit('product:order', item);
					modal.close();
				}
				else {
					events.emit('card:delete', item);
				}
			},
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
				id: item.id,
			}, isInBasket),
		});
	};

	if (item) {
		showItem(appData.catalog.find(i => i.id === appData.preview));
	} else {
		modal.close();
	}
});

events.on('product:order', (item: ProductItem) => {
	appData.addToBasket(item);
	page.counter = appData.basket.length;
});

events.on('basket:open', () => {
	let index: number = 0;
	basket.items = appData.basket.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:delete', item),
		});
		return card.render({
			index: ++index,
			title: item.title,
			price: item.price,
			id: item.id,
		}, false);
	});
	basket.total = appData.getTotal();
	modal.render({
		content: basket.render(),
	});
});

events.on('card:delete', (item: ProductItem) => {
	appData.deleteFromBasket(item);
	page.counter = appData.basket.length;
	events.emit('basket:open');
});

events.on(
	'formErrors:change',
	({ payment, address, email, phone }: Partial<IOrder>) => {
		order.valid = !payment && !address;
		contacts.valid = !email && !phone;
		order.errors = Object.values({ payment, address })
			.filter((i) => !!i)
			.join('; ');
		contacts.errors = Object.values({ email, phone })
			.filter((i) => !!i)
			.join('; ');
	}
);

events.on(
	'input:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:open', () => {
	appData.order.total = appData.getTotal();
	appData.order.items = appData.basket.map((item) => {
		return item.id;
	});
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appData.clearBasket();
					appData.clearOrder();
					page.counter = 0;
				},
			});

			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then((data) => {
		appData.setCatalog(data);
	})
	.catch((err) => {
		console.error(err);
	});
