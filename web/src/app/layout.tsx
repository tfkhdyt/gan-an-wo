import '@fontsource/open-sauce-sans/300.css';
import '@fontsource/open-sauce-sans/400.css';
import '@fontsource/open-sauce-sans/500.css';
import '@fontsource/open-sauce-sans/600.css';
import '@fontsource/open-sauce-sans/700.css';
import '@fontsource/open-sauce-sans/800.css';
import '@fontsource/open-sauce-sans/900.css';
import './globals.css';

import type { Metadata } from 'next';
import { Provider } from 'jotai';

export const metadata: Metadata = {
	title: 'GAN AN WO',
	description: 'Game clicker bertemakan Pemilu 2024',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
