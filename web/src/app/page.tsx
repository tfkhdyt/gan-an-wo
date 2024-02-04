"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useEffect, useState } from "react";

import { localScoreAtom } from "@/atom/local-score";
import { pilihanCapresAtom } from "@/atom/pilihan-capres";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai/react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import useWebSocket from "react-use-websocket";

type ResponseMessage = {
	success: boolean;
	data: Partner[];
};

type Input = {
	paslon: string;
};

type Partner = {
	id: number;
	name: string;
	score: number;
};

export default function Home() {
	const [isModalOpen, setModalOpen] = useState(false);
	const form = useForm<Input>();
	const [paslon, setPaslon] = useAtom(pilihanCapresAtom);
	const [localScore, setLocalScore] = useAtom(localScoreAtom);

	const { sendMessage } = useWebSocket("wss://api.gananwo.click/scores/submit");

	const { lastJsonMessage: leaderboard } = useWebSocket<ResponseMessage | null>(
		"wss://api.gananwo.click/scores/leaderboard",
	);

	const onSubmit: SubmitHandler<Input> = (data) => {
		if (typeof window !== "undefined") {
			setPaslon(data.paslon);
			setModalOpen(false);
		}
	};

	useEffect(() => {
		if (paslon) {
			let audioFile = "";
			switch (paslon) {
				case "1":
					audioFile = "/sfx/anies.mp3";
					break;
				case "2":
					audioFile = "/sfx/prabowo.mp3";
					break;
				case "3":
					audioFile = "/sfx/ganjar.mp3";
					break;
				default:
					console.log("Tidak valid");
					break;
			}
			const audio = new Audio(audioFile);

			const handleClick = (event: { preventDefault: () => void }) => {
				event.preventDefault();
				handleSkor();
				audio.pause();
				sendMessage(paslon.toString());

				audio.currentTime = 0;
				audio.play();
			};

			const handleSkor = () => {
				setLocalScore((score) => score + 1);
			};

			document.addEventListener("click", handleClick);
			document.addEventListener("contextmenu", handleClick);
			document.addEventListener("keypress", handleClick);

			return () => {
				document.removeEventListener("click", handleClick);
				document.removeEventListener("contextmenu", handleClick);
				document.removeEventListener("keypress", handleClick);
			};
		}
	});

	useEffect(() => {
		if (paslon) {
			setModalOpen(false);
		} else {
			setModalOpen(true);
		}
	}, [paslon]);

	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 w-screen justify-center relative">
			<div className="text-center">
				<h1 className="text-2xl">Gan-An-Wo</h1>
				<h1 className="text-2xl">Anda Memilih Paslon No {paslon}</h1>
				<h1 className="text-2xl">Skor {localScore}</h1>
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
			<div className="absolute bottom-0 w-64">
				<Accordion type="single" collapsible>
					<AccordionItem value="item-1">
						<AccordionTrigger>Total Skor</AccordionTrigger>
						<AccordionContent>
							<div className="flex flex-col">
								{leaderboard?.data.map((data) => {
									return (
										<p key={data.id}>
											{data.name}: {data.score}
										</p>
									);
								})}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
