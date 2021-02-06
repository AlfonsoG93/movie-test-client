import moment from "moment";

export interface Rating {
	username: string;
	score: number;
	createdAt: string;
}

export interface Movie {
	id: string;
	title: string;
	duration: number;
	releaseDate: string;
	actors: string[];
	createdAt: string;
	ratings: Rating[];
	ratingCount: number;
	grade: number;
	username: string;
	user: string;
}

export const defaultRating: Rating = {
	username: "",
	score: 0,
	createdAt: moment().toISOString()
}

export const defaultMovie: Movie = {
	id: "",
	title: "",
	duration: 0,
	releaseDate: moment().toISOString(),
	actors: [],
	createdAt: moment().toISOString(),
	ratings: [],
	ratingCount: 0,
	grade: 0,
	username: "",
	user: ""
	
}