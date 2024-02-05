'use client';

import { Howl } from 'howler';
import { useAtom, useAtomValue } from 'jotai/react';
import {
	BugIcon,
	CheckIcon,
	CircleDollarSignIcon,
	ReplaceIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useWebSocket from 'react-use-websocket';
import { match } from 'ts-pattern';
import { AES, enc, format, mode } from 'crypto-js';

import { isLeaderboardOpenAtom } from '@/atom/leaderboard';
import { localScoreAtom } from '@/atom/local-score';
import { pilihanCapresAtom } from '@/atom/pilihan-capres';
import { Leaderboard } from '@/components/leaderboard';
import { MobileLeaderboard } from '@/components/mobile-leaderboard';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { formatNumber } from '@/lib/utils';
import { Input, ResponseMessage } from '@/types/leaderboard';

export default function Home() {
	const [paslon, setPaslon] = useAtom(pilihanCapresAtom);
	const form = useForm<Input>({
		defaultValues: {
			paslon: paslon ?? undefined,
		},
	});
	const [localScore, setLocalScore] = useAtom(localScoreAtom);
	const [isModalOpen, setModalOpen] = useState(false);
	const isLeaderboardOpen = useAtomValue(isLeaderboardOpenAtom);

	const scoreEl = useRef<HTMLDivElement>(null);
	const pageEl = useRef<HTMLDivElement>(null);
	const leaderboardEl = useRef<HTMLDivElement>(null);

	const aniesAudio = new Howl({ src: '/sfx/anies.wav' });
	const prabowoAudio = new Howl({ src: '/sfx/prabowo.wav' });
	const ganjarAudio = new Howl({ src: '/sfx/ganjar.wav' });

	const playAudio = (paslon: string) => {
		let id: number;
		switch (paslon) {
			case '1':
				aniesAudio.stop();
				id = aniesAudio.play();
				aniesAudio.fade(0, 1, 25, id);
				aniesAudio.fade(1, 0, 945, id);
				break;
			case '2':
				prabowoAudio.stop();
				id = prabowoAudio.play();
				prabowoAudio.fade(0, 1, 25, id);
				prabowoAudio.fade(1, 0, 945, id);
				break;
			case '3':
				ganjarAudio.stop();
				id = ganjarAudio.play();
				ganjarAudio.fade(0, 1, 25, id);
				ganjarAudio.fade(1, 0, 1765, id);
				break;
		}
	};

	const { sendMessage } = useWebSocket(
		`${process.env.NEXT_PUBLIC_API_URL}/scores/submit`,
		{
			shouldReconnect: () => true,
			reconnectAttempts: Infinity,
			reconnectInterval: 1000,
		},
	);

	const { lastJsonMessage: leaderboard } = useWebSocket<ResponseMessage | null>(
		`${process.env.NEXT_PUBLIC_API_URL}/scores/leaderboard`,
		{
			shouldReconnect: () => true,
			reconnectAttempts: Infinity,
			reconnectInterval: 1000,
		},
	);

	const onSubmit: SubmitHandler<Input> = (data) => {
		if (typeof window !== 'undefined') {
			setPaslon(data.paslon);
			setLocalScore(0);
			setModalOpen(false);
		}
	};

	const incrementScore = () => {
		if (paslon && !isLeaderboardOpen) {
			scoreEl.current?.classList.add('popout');
			setLocalScore((score) => score + 1);
			playAudio(paslon);
			const message = AES.encrypt(
				paslon,
				process.env.NEXT_PUBLIC_API_SECRET_KEY ?? '',
			).toString();

			sendMessage(message);
		}
	};

	const handleClick = (
		event: PointerEvent & {
			target: { classList: { contains: (str: string) => boolean } };
		},
	) => {
		event.preventDefault();
		if (
			leaderboardEl.current &&
			!event.composedPath().includes(leaderboardEl.current) &&
			event.isPrimary
		) {
			incrementScore();
		}
	};

	useEffect(() => {
		// @ts-expect-error
		window.addEventListener('pointerdown', handleClick);
		window.addEventListener('pointerup', () =>
			scoreEl.current?.classList.remove('popout'),
		);

		return () => {
			// @ts-expect-error
			window.removeEventListener('pointerdown', handleClick);
			window.removeEventListener('pointerup', () =>
				scoreEl.current?.classList.remove('popout'),
			);
		};
	}, [handleClick]);

	useEffect(() => {
		if (paslon && ['1', '2', '3'].includes(paslon)) {
			setModalOpen(false);
		} else {
			setModalOpen(true);
		}
	}, [paslon]);

	return (
		<div
			className='flex min-h-[100svh] bg-black flex-col items-center w-screen justify-center relative'
			style={{
				backgroundImage: match(paslon)
					.with('1', () => 'url(/img/background/nasdem.webp)')
					.with('2', () => 'url(/img/background/gerindra.webp)')
					.with('3', () => 'url(/img/background/pdip.webp)')
					.otherwise(() => undefined),
				backgroundPosition: 'center center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}}
			ref={pageEl}
		>
			<div className='absolute top-14 inset-x-0 mx-auto flex flex-col items-center select-none'>
				<h1 className='text-5xl lg:text-7xl font-extrabold text-center text-white drop-shadow-[0px_2px_4px_rgba(0,0,0,1)] mb-4'>
					GAN AN WO
				</h1>
				<p
					className='text-5xl lg:text-6xl font-extrabold text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,1)] w-fit'
					ref={scoreEl}
				>
					{formatNumber(localScore)}
				</p>
			</div>

			<AlertDialog open={isModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Silahkan pilih pasangan Capres dan Cawapres pilihan kalian!
						</AlertDialogTitle>
					</AlertDialogHeader>
					<div>
						<Form {...form}>
							<div className='w-full flex flex-col mt-2'>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<FormField
										control={form.control}
										name='paslon'
										render={({ field }) => (
											<FormItem className='overflow-y-auto max-h-[400px]'>
												<FormControl>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className='grid grid-cols-1 md:grid-cols-3 gap-2'
													>
														<div className='w-full'>
															<RadioGroupItem
																value='1'
																id='paslon-1'
																className='peer sr-only group'
																onClick={() => playAudio('1')}
															/>
															<Label
																htmlFor='paslon-1'
																className='flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-accent-foreground'
															>
																<div className='flex items-center justify-center mb-3'>
																	<h1 className='text-2xl font-bold'>1</h1>
																</div>
																<Separator />
																<div className='grid grid-cols-2 mt-5 items-start'>
																	<div className='flex flex-col items-center justify-center gap-3'>
																		<Image
																			alt='paslon-1'
																			src={'/img/anies.jpg'}
																			className='aspect-square object-cover'
																			width={100}
																			height={100}
																		/>
																		<div className='flex flex-col items-center justify-center space-y-1 text-center'>
																			<p className='font-bold text-base'>
																				Calon Presiden
																			</p>
																			<p className='font-semibold'>
																				Anies Baswedan
																			</p>
																		</div>
																	</div>
																	<div className='flex flex-col items-center justify-center gap-3'>
																		<Image
																			alt='paslon-1'
																			src={'/img/imin.webp'}
																			className='aspect-square object-cover'
																			width={100}
																			height={100}
																		/>
																		<div className='flex flex-col items-center justify-center space-y-1 text-center'>
																			<p className='font-bold text-base'>
																				Calon Wakil Presiden
																			</p>
																			<p className='font-semibold'>
																				Muhaimin Iskandar
																			</p>
																		</div>
																	</div>
																</div>
															</Label>
														</div>
														<div className='w-full'>
															<RadioGroupItem
																value='2'
																id='paslon-2'
																className='peer sr-only group'
																onClick={() => playAudio('2')}
															/>
															<Label
																htmlFor='paslon-2'
																className='flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-accent-foreground'
															>
																<div className='flex items-center justify-center mb-3'>
																	<h1 className='text-2xl font-bold'>2</h1>
																</div>
																<Separator />
																<div className='grid grid-cols-2 mt-5 items-start'>
																	<div className='flex flex-col items-center justify-center gap-3'>
																		<Image
																			alt='paslon-2'
																			src={'/img/prabowo.jpg'}
																			className='aspect-square object-cover object-top'
																			width={100}
																			height={100}
																		/>
																		<div className='flex flex-col items-center justify-center space-y-1 text-center'>
																			<p className='font-bold text-base'>
																				Calon Presiden
																			</p>
																			<p className='font-semibold'>
																				Prabowo Subianto
																			</p>
																		</div>
																	</div>
																	<div className='flex flex-col items-center justify-center gap-3'>
																		<Image
																			alt='paslon-2'
																			src={'/img/gibran.jpg'}
																			className='aspect-square object-cover object-top'
																			width={100}
																			height={100}
																		/>
																		<div className='flex flex-col items-center justify-center space-y-1 text-center'>
																			<p className='font-bold text-base'>
																				Calon Wakil Presiden
																			</p>
																			<p className='font-semibold'>
																				Gibran Rakabuming
																			</p>
																		</div>
																	</div>
																</div>
															</Label>
														</div>
														<div className='w-full'>
															<RadioGroupItem
																value='3'
																id='paslon-3'
																className='peer sr-only group'
																onClick={() => playAudio('3')}
															/>
															<Label
																htmlFor='paslon-3'
																className='flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-accent-foreground'
															>
																<div className='flex items-center justify-center mb-3'>
																	<h1 className='text-2xl font-bold'>3</h1>
																</div>
																<Separator />
																<div className='grid grid-cols-2 mt-5 items-start'>
																	<div className='flex flex-col items-center justify-center gap-3'>
																		<Image
																			alt='paslon-3'
																			src={'/img/ganjar.jpg'}
																			className='aspect-square object-cover object-top'
																			width={100}
																			height={100}
																		/>
																		<div className='flex flex-col items-center justify-center space-y-1 text-center'>
																			<p className='font-bold text-base'>
																				Calon Presiden
																			</p>
																			<p className='font-semibold'>
																				Ganjar Pranowo
																			</p>
																		</div>
																	</div>
																	<div className='flex flex-col items-center justify-center gap-3'>
																		<Image
																			alt='paslon-1'
																			src={'/img/mahfud.jpg'}
																			className='aspect-square object-cover object-top'
																			width={100}
																			height={100}
																		/>
																		<div className='flex flex-col items-center justify-center space-y-1 text-center'>
																			<p className='font-bold text-base'>
																				Calon Wakil Presiden
																			</p>
																			<p className='font-semibold'>Mahfud MD</p>
																		</div>
																	</div>
																</div>
															</Label>
														</div>
													</RadioGroup>
												</FormControl>
											</FormItem>
										)}
									/>
									<div className='mt-5 flex items-center justify-end'>
										<Button type='submit' disabled={!form.watch('paslon')}>
											<CheckIcon className='mr-1 h-4 w-4' />
											Lanjutkan
										</Button>
									</div>
								</form>
							</div>
						</Form>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			<div
				className='absolute bottom-5 lg:top-10 lg:right-10 space-y-4 flex flex-col-reverse lg:flex-col items-end w-full lg:w-auto px-4'
				ref={leaderboardEl}
			>
				<Leaderboard leaderboard={leaderboard} paslon={Number(paslon)} />
				<MobileLeaderboard leaderboard={leaderboard} paslon={Number(paslon)} />
				<Button
					className='noaction hidden lg:flex items-center'
					onClick={(e) => {
						e.stopPropagation();
						setPaslon(null);
					}}
				>
					<ReplaceIcon className='mr-1 h-4 w-4' />
					Ganti paslon
				</Button>
				<div className='flex justify-between lg:justify-normal lg:flex-col items-end w-full lg:w-auto gap-4'>
					<Link
						href='https://github.com/tfkhdyt/gan-an-wo/issues/new'
						target='_blank'
					>
						<Button variant='destructive'>
							<BugIcon className='mr-1 h-4 w-4' /> Bug Report
						</Button>
					</Link>
					<Link href='https://saweria.co/tfkhdyt' target='_blank'>
						<Button className='bg-green-600 hover:bg-green-700'>
							<CircleDollarSignIcon className='mr-1 h-4 w-4' /> Donate
						</Button>
					</Link>
				</div>
			</div>
			{paslon && (
				<div className='absolute bottom-10 left-10 hidden lg:block'>
					<Image
						src={match(paslon)
							.with('1', () => '/img/logo/amin.webp')
							.with('2', () => '/img/logo/prabowo-gibran.webp')
							.with('3', () => '/img/logo/ganjar-mahfud.webp')
							.otherwise(() => '')}
						alt=''
						width={400}
						height={400}
					/>
				</div>
			)}
		</div>
	);
}
