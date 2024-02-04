"use client";

import { Howl } from "howler";
import { useAtom } from "jotai/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useWebSocket from "react-use-websocket";
import { match } from "ts-pattern";

import { localScoreAtom } from "@/atom/local-score";
import { pilihanCapresAtom } from "@/atom/pilihan-capres";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input, ResponseMessage } from "@/types/leaderboard";
import { Leaderboard } from "@/components/leaderboard";

export default function Home() {
	const form = useForm<Input>();
	const [paslon, setPaslon] = useAtom(pilihanCapresAtom);
	const [localScore, setLocalScore] = useAtom(localScoreAtom);
	const [isModalOpen, setModalOpen] = useState(false);

	const scoreEl = useRef<HTMLDivElement>(null);

	const aniesAudio = new Howl({ src: "/sfx/anies.mp3" });
	const prabowoAudio = new Howl({ src: "/sfx/prabowo.mp3" });
	const ganjarAudio = new Howl({ src: "/sfx/ganjar.mp3" });

	const playAudio = (paslon: string) => {
		switch (paslon) {
			case "1":
				aniesAudio.stop();
				aniesAudio.play();
				break;
			case "2":
				prabowoAudio.stop();
				prabowoAudio.play();
				break;
			case "3":
				ganjarAudio.stop();
				ganjarAudio.play();
				break;
		}
	};

	const { sendMessage } = useWebSocket(
		`${process.env.NEXT_PUBLIC_API_URL}/scores/submit`,
	);

	const { lastJsonMessage: leaderboard } = useWebSocket<ResponseMessage | null>(
		`${process.env.NEXT_PUBLIC_API_URL}/scores/leaderboard`,
	);

	const onSubmit: SubmitHandler<Input> = (data) => {
		if (typeof window !== "undefined") {
			setPaslon(data.paslon);
			setModalOpen(false);
		}
	};

	const incrementScore = () => {
		if (paslon) {
			scoreEl.current?.classList.add("popout");
			setLocalScore((score) => score + 1);
			playAudio(paslon);
			sendMessage(paslon);
		}
	};

	useEffect(() => {
		const handleClick = (event: {
			preventDefault: () => void;
			target: { classList: { contains: (str: string) => boolean } };
		}) => {
			event.preventDefault();
			if (!event.target.classList.contains("noaction")) {
				incrementScore();
			}
		};

		const handleTouch = (event: {
			preventDefault: () => void;
			touches: { length: number };
			target: { classList: { contains: (str: string) => boolean } };
		}) => {
			event.preventDefault();
			if (
				event.touches.length <= 1 &&
				!event.target.classList.contains("noaction")
			) {
				incrementScore();
			}
		};

		// @ts-expect-error
		document.addEventListener("touchstart", handleTouch);
		document.addEventListener("touchstart", () =>
			scoreEl.current?.classList.remove("popout"),
		);
		// @ts-expect-error
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("mouseup", () =>
			scoreEl.current?.classList.remove("popout"),
		);

		return () => {
			// @ts-expect-error
			document.removeEventListener("touchstart", handleTouch);
			// @ts-expect-error
			document.removeEventListener("mousedown", handleClick);
		};
	}, [incrementScore]);

	useEffect(() => {
		if (paslon) {
			setModalOpen(false);
		} else {
			setModalOpen(true);
		}
	}, [paslon]);

	return (
		<div
			className="flex min-h-screen bg-black flex-col items-center w-screen justify-center relative"
			style={{
				backgroundImage: match(paslon)
					.with("1", () => "url(/img/background/nasdem.webp)")
					.with("2", () => "url(/img/background/gerindra.webp)")
					.with("3", () => "url(/img/background/pdip.webp)")
					.otherwise(() => undefined),
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
			}}
		>
			<div className="absolute top-14 inset-x-0 mx-auto">
				<h1 className="text-7xl font-extrabold text-center text-white drop-shadow-[0px_2px_4px_rgba(0,0,0,1)] mb-4">
					GAN AN WO
				</h1>
				<div
					className="text-6xl font-extrabold text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,1)]"
					ref={scoreEl}
				>
					{localScore}
				</div>
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
							<div className="w-full flex flex-col">
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<FormField
										control={form.control}
										name="paslon"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className="flex mt-5"
													>
														<div className="w-full">
															<RadioGroupItem
																value="1"
																id="paslon-1"
																className="peer sr-only group"
																onClick={() => playAudio("1")}
															/>
															<Label
																htmlFor="paslon-1"
																className="flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-accent-foreground"
															>
																<div className="flex items-center justify-center mb-3">
																	<h1 className="text-2xl font-bold">1</h1>
																</div>
																<Separator />
																<div className="grid grid-cols-2 mt-5">
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image
																			alt="paslon-1"
																			src={"/img/anies.jpg"}
																			className="aspect-square object-cover"
																			width={100}
																			height={100}
																		/>
																		<div className="flex flex-col items-center justify-center">
																			<p className="font-bold text-base">
																				Calon Presiden
																			</p>
																			<p className="font-semibold">
																				Anies Baswedan
																			</p>
																		</div>
																	</div>
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image
																			alt="paslon-1"
																			src={"/img/imin.webp"}
																			className="aspect-square object-cover"
																			width={100}
																			height={100}
																		/>
																		<div className="flex flex-col items-center justify-center">
																			<p className="font-bold text-base">
																				Calon Wakil Presiden
																			</p>
																			<p className="font-semibold">
																				Muhaimin Iskandar
																			</p>
																		</div>
																	</div>
																</div>
															</Label>
														</div>
														<div className="w-full">
															<RadioGroupItem
																value="2"
																id="paslon-2"
																className="peer sr-only group"
																onClick={() => playAudio("2")}
															/>
															<Label
																htmlFor="paslon-2"
																className="flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-accent-foreground"
															>
																<div className="flex items-center justify-center mb-3">
																	<h1 className="text-2xl font-bold">2</h1>
																</div>
																<Separator />
																<div className="grid grid-cols-2 mt-5">
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image
																			alt="paslon-2"
																			src={"/img/prabowo.jpg"}
																			className="aspect-square object-cover object-top"
																			width={100}
																			height={100}
																		/>
																		<div className="flex flex-col items-center justify-center">
																			<p className="font-bold text-base">
																				Calon Presiden
																			</p>
																			<p className="font-semibold">
																				Prabowo Subianto
																			</p>
																		</div>
																	</div>
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image
																			alt="paslon-2"
																			src={"/img/gibran.jpg"}
																			className="aspect-square object-cover object-top"
																			width={100}
																			height={100}
																		/>
																		<div className="flex flex-col items-center justify-center">
																			<p className="font-bold text-base">
																				Calon Wakil Presiden
																			</p>
																			<p className="font-semibold">
																				Gibran Rakabuming
																			</p>
																		</div>
																	</div>
																</div>
															</Label>
														</div>
														<div className="w-full">
															<RadioGroupItem
																value="3"
																id="paslon-3"
																className="peer sr-only group"
																onClick={() => playAudio("3")}
															/>
															<Label
																htmlFor="paslon-3"
																className="flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:text-accent-foreground"
															>
																<div className="flex items-center justify-center mb-3">
																	<h1 className="text-2xl font-bold">3</h1>
																</div>
																<Separator />
																<div className="grid grid-cols-2 mt-5">
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image
																			alt="paslon-3"
																			src={"/img/ganjar.jpg"}
																			className="aspect-square object-cover object-top"
																			width={100}
																			height={100}
																		/>
																		<div className="flex flex-col items-center justify-center">
																			<p className="font-bold text-base">
																				Calon Presiden
																			</p>
																			<p className="font-semibold">
																				Ganjar Pranowo
																			</p>
																		</div>
																	</div>
																	<div className="flex flex-col items-center justify-center gap-3">
																		<Image
																			alt="paslon-1"
																			src={"/img/mahfud.jpg"}
																			className="aspect-square object-cover object-top"
																			width={100}
																			height={100}
																		/>
																		<div className="flex flex-col items-center justify-center">
																			<p className="font-bold text-base">
																				Calon Wakil Presiden
																			</p>
																			<p className="font-semibold">Mahfud MD</p>
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
									<div className="mt-5 flex items-center justify-end">
										<Button type="submit">Lanjutkan</Button>
									</div>
								</form>
							</div>
						</Form>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			<div className="absolute top-10 right-10 space-y-4 flex flex-col items-end">
				<Leaderboard leaderboard={leaderboard} />
				<Button
					className="bg-gray-100/95 hover:bg-gray-300/95 backdrop-blur text-black noaction"
					onClick={() => {
						setPaslon(null);
					}}
				>
					Ganti paslon
				</Button>
			</div>
			{paslon && (
				<div className="absolute bottom-10 left-10">
					<Image
						src={match(paslon)
							.with("1", () => "/img/logo/amin.svg")
							.with("2", () => "/img/logo/prabowo-gibran.png")
							.with("3", () => "/img/logo/ganjar-mahfud.png")
							.otherwise(() => "")}
						alt=""
						width={400}
						height={400}
					/>
				</div>
			)}
		</div>
	);
}
