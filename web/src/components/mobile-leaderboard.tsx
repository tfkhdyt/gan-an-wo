import { useAtom } from 'jotai/react';
import { ReplaceIcon, XCircleIcon } from 'lucide-react';
import { match } from 'ts-pattern';
import { MouseEventHandler } from 'react';

import { isLeaderboardOpenAtom } from '@/atom/leaderboard';
import { cn, formatNumber, formatNumberShort, getEmoji } from '@/lib/utils';
import { ResponseMessage } from '@/types/leaderboard';

import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/drawer';

export function MobileLeaderboard({
	leaderboard,
	paslon,
	resetPaslon,
}: {
	leaderboard: ResponseMessage | null;
	paslon: number;
	resetPaslon: MouseEventHandler<HTMLButtonElement>;
}) {
	const topScore = leaderboard?.data[0];
	const myPaslonScore = leaderboard?.data.find((dt) => dt.id === paslon);

	const [isLeaderboardOpen, setIsLeaderboardOpen] = useAtom(
		isLeaderboardOpenAtom,
	);

	return (
		<div className='lg:hidden w-full'>
			<Drawer open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
				<DrawerTrigger className='w-full focus-visible:outline-none'>
					<Card className='w-full bg-gray-100/95 backdrop-blur focus-visible:outline-none'>
						<CardHeader className='p-3 '>
							{topScore && myPaslonScore ? (
								<div className='flex justify-between items-center'>
									<div className='flex items-center space-x-4 shrink'>
										<div className='border-r-2 border-gray-300 pr-2 '>
											<div>🏆</div>
										</div>
										<div className='flex space-x-2 items-center text-sm '>
											<div>{getEmoji(topScore.id)}</div>
											<div>{formatNumberShort(topScore.score)}</div>
										</div>
									</div>
									<div className='shrink'>…</div>
									<div className='flex items-center space-x-4'>
										<div className='flex space-x-2 items-center grow'>
											<div>{getEmoji(myPaslonScore.id)}</div>
											<div className='font-semibold '>
												{formatNumber(myPaslonScore.score)}
											</div>
										</div>
										<div className='border-l-2 border-gray-300 pl-2 '>
											<div>
												{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													strokeWidth='1.5'
													stroke='currentColor'
													className='w-6 h-6 text-gray-400 '
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														d='m4.5 15.75 7.5-7.5 7.5 7.5'
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>
							) : (
								'Loading...'
							)}
						</CardHeader>
					</Card>
				</DrawerTrigger>
				<DrawerContent className='focus-visible:outline-none'>
					<DrawerHeader>
						<DrawerTitle>Leaderboard</DrawerTitle>
						<DrawerDescription>
							Leaderboard di-refresh setiap 1 detik
						</DrawerDescription>
					</DrawerHeader>
					<div className='flex flex-col px-4 py-2 space-y-1'>
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
					<DrawerFooter>
						<Button onClick={resetPaslon}>
							<ReplaceIcon className='mr-1 h-4 w-4' />
							Ganti paslon
						</Button>
						<DrawerClose>
							<Button variant='outline' className='w-full'>
								<XCircleIcon className='mr-1 h-4 w-4' />
								Close
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
