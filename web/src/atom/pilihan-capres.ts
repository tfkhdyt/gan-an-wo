import { atomWithStorage } from 'jotai/utils';

export const pilihanCapresAtom = atomWithStorage<string | null | undefined>(
	'pilihan-capres',
	null,
);
