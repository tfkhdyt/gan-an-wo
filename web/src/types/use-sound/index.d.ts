import { HookOptions, ReturnedValue } from './types';

export default function useSound<T>(
	src: string | string[],
	{
		id,
		volume,
		playbackRate,
		soundEnabled,
		interrupt,
		onload,
		...delegated
	}?: HookOptions<T>,
): ReturnedValue;
export { useSound };
