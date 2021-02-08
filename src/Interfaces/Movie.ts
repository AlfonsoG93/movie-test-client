import moment from "moment";

export interface Rating {
	movieId: string;
	score: number;
}

export interface Movie {
	id?: string;
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
	movieId: "",
	score: 0
}

export const generateRating = (movieId: string, score: number) => {
	return {
		movieId,
		score
	}
}

export const defaultMovie: Movie = {
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