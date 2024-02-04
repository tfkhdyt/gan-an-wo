import { ResponseMessage } from "@/types/leaderboard";
import { match } from "ts-pattern";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
	Drawer,
} from "./ui/drawer";
import { get } from "http";
import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai/react";
import { pilihanCapresAtom } from "@/atom/pilihan-capres";

function getEmoji(paslon: number) {
	return match(paslon)
		.with(1, () => "1️⃣")
		.with(2, () => "2️⃣")
		.with(3, () => "3️⃣")
		.otherwise(() => "");
}

export function MobileLeaderboard({
	leaderboard,
	paslon,
}: { leaderboard: ResponseMessage | null; paslon: number }) {
	const topScore = leaderboard?.data[0];
	const myPaslonScore = leaderboard?.data.find((dt) => dt.id === paslon);

	const setPaslon = useSetAtom(pilihanCapresAtom);

	return (
		<div className="lg:hidden w-full">
			<Drawer>
				<DrawerTrigger className="w-full ">
					<Card className="w-full bg-gray-100/95 backdrop-blur ">
						<CardHeader className="p-3 ">
							{topScore && myPaslonScore ? (
								<div className="flex justify-between items-center ">
									<div className="flex items-center space-x-4">
										<div className="border-r-2 border-gray-300 pr-2">
											<div>🏆</div>
										</div>
										<div className="flex space-x-2 items-center text-sm">
											<div>{getEmoji(topScore.id)}</div>
											<div>{topScore.score}</div>
										</div>
									</div>
									<div>…</div>
									<div className="flex items-center space-x-4">
										<div className="flex space-x-2 items-center">
											<div>{getEmoji(myPaslonScore.id)}</div>
											<div className="font-semibold">{myPaslonScore.score}</div>
										</div>
										<div className="border-l-2 border-gray-300 pl-2">
											<div>
												{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													className="w-6 h-6 text-gray-400"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="m4.5 15.75 7.5-7.5 7.5 7.5"
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>
							) : (
								"Loading..."
							)}
						</CardHeader>
					</Card>
				</DrawerTrigger>
				<DrawerContent className="pointer-events-none">
					<DrawerHeader>
						<DrawerTitle>Leaderboard</DrawerTitle>
						<DrawerDescription>
							Leaderboard di-refresh setiap 1 detik
						</DrawerDescription>
					</DrawerHeader>
					<div className="flex flex-col px-4 py-2 space-y-1">
						{leaderboard
							? leaderboard.data.map((data, idx) => {
									return (
										<div
											key={data.id}
											className="flex space-x-2 w-full justify-between"
										>
											<span className="space-x-2">
												<span>
													{match(idx + 1)
														.with(1, () => "🥇")
														.with(2, () => "🥈")
														.with(3, () => "🥉")
														.otherwise(() => undefined)}
												</span>
												<span className={cn(data.id === paslon && "font-bold")}>
													{data.name}
												</span>
											</span>
											<span className="ml-auto font-semibold">
												{data.score}
											</span>
										</div>
									);
							  })
							: "Loading..."}
					</div>
					<DrawerFooter>
						<Button onClick={() => setPaslon(null)}>Ganti paslon</Button>
						<DrawerClose>
							<Button variant="outline" className="w-full">
								Close
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
