import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { match } from 'ts-pattern';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getEmoji(paslon: number) {
	return match(paslon)
		.with(1, () => '\u0031\uFE0F\u20E3')
		.with(2, () => '\u0032\uFE0F\u20E3')
		.with(3, () => '\u0033\uFE0F\u20E3')
		.otherwise(() => '');
}

const numberFormat = new Intl.NumberFormat('id-ID');

export function formatNumber(num: number) {
	return numberFormat.format(num);
}
