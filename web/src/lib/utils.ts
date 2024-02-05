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

export function formatNumberShort(num: number, precision = 2) {
	const map = [
		{ suffix: 'T', threshold: 1e12 },
		{ suffix: 'B', threshold: 1e9 },
		{ suffix: 'M', threshold: 1e6 },
		{ suffix: 'K', threshold: 1e3 },
		{ suffix: '', threshold: 1 },
	];

	const found = map.find((x) => Math.abs(num) >= x.threshold);
	if (found) {
		const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
		return formatted;
	}

	return num;
}
