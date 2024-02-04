import { ResponseMessage } from '@/types/leaderboard';
import { match } from 'ts-pattern';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';

export function Leaderboard({
	leaderboard,
}: { leaderboard: ResponseMessage | null }) {
	return (
		<Card className='hidden lg:block lg:w-72 bg-gray-100/95 backdrop-blur'>
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
											<span>{data.name}</span>
										</span>
										<span className='ml-auto font-semibold'>{data.score}</span>
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
