export type ResponseMessage = {
	success: boolean;
	data: Partner[];
};

export type Input = {
	paslon: string;
};

type Partner = {
	id: number;
	name: string;
	score: number;
};
