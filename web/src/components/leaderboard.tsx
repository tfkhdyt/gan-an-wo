import { match } from 'ts-pattern';

import { cn, formatNumber, getEmoji } from '@/lib/utils';
import { ResponseMessage } from '@/types/leaderboard';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';

export function Leaderboard({
	leaderboard,
	paslon,
}: { leaderboard: ResponseMessage | null; paslon: number }) {
	return (
		<Card className='hidden lg:block lg:min-w-96 bg-gray-100/95 backdrop-blur'>
			<CardHeader>
				<CardTitle>Leaderboard</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col'>
					{leaderboard
						? leaderboard.data.map((data, idx) => {
								return (
									<div
										key={data.id}
										className='flex space-x-2 w-full justify-between'
									>
										<span className='space-x-2'>
											<span>
												{match(idx + 1)
													.with(1, () => '🥇')
													.with(2, () => '🥈')
													.with(3, () => '🥉')
													.otherwise(() => undefined)}
											</span>
											<span>{getEmoji(data.id)}</span>
											<span className={cn(data.id === paslon && 'font-bold')}>
												{data.name}
											</span>
										</span>
										<span className='ml-auto font-semibold'>
											{formatNumber(data.score)}
										</span>
									</div>
								);
						  })
						: 'Loading...'}
				</div>
			</CardContent>
			<CardFooter className='text-xs'>
				Leaderboard di-refresh setiap 1 detik
			</CardFooter>
		</Card>
	);
}
