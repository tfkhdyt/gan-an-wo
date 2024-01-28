"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useEffect } from "react";
import Bruh from "../audio/bruh.mp3";

export default function Home() {
	useEffect(() => {
		const audio = new Audio(Bruh);

		const handleClick = () => {
			console.log("Klik terdeteksi!");
			audio.play();
		};

		const handleRightClick = (event: { preventDefault: () => void }) => {
			event.preventDefault();
			console.log("Klik kanan terdeteksi!");
			audio.play();
		};
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleKeyPress = (event: { key: any }) => {
			audio.play();
			console.log("Key terdeteksi");
		};

		document.addEventListener("click", handleClick);
		document.addEventListener("contextmenu", handleRightClick);
		document.addEventListener("keypress", handleKeyPress);
		return () => {
			document.removeEventListener("click", handleClick);
			document.removeEventListener("contextmenu", handleRightClick);
			document.removeEventListener("keypress", handleKeyPress);
		};
	}, []);

	// useEffect(() => {
	// 	const item = localStorage.getItem("pilihan-capres");
	// 	if (!item) {
	// 	}
	// }, []);

	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-100 w-screen justify-center">
			<h1 className="text-2xl">Gan-An-Wo</h1>
			<AlertDialog>
				<AlertDialogTrigger>Open</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Silahkan pilih pasangan Capres dan Cawapres pilihan kalian!
						</AlertDialogTitle>
						<AlertDialogDescription>
							<RadioGroup defaultValue="1">
								<div className="w-full flex flex-row justify-center items-center gap-2 mt-3">
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
														<p className="font-semibold">Anies Baswedan</p>
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
														<p className="font-semibold">Muhaimin Iskandar</p>
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
														<p className="font-semibold">Prabowo Subianto</p>
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
														<p className="font-semibold">Gibran Rakabuming</p>
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
														<p className="font-semibold">Ganjar Pranowo</p>
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
								</div>
							</RadioGroup>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>Lanjutkan</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
