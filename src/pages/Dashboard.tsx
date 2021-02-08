import React, {createRef, useContext, useEffect, useState} from "react";
import {useQuery, useSubscription} from "@apollo/client";
import {FETCH_MOVIES_QUERY, GET_NEW_RATING} from "../Services/movieServices";
import {Button, Container, Grid, GridColumn, GridRow} from "semantic-ui-react";
import MoviesTable from "../Components/MoviesTable";
import {ApolloError} from "apollo-client";
import {Movie} from "../Interfaces/Movie";
import MovieModal from "../Components/MovieModal";
import {store} from "react-notifications-component";
import {AuthContext} from "../Authorization";
import {useCookies} from "react-cookie";

export interface MovieQuery {
	pageNumber: number
	pageSize: number
	userMovies: boolean
	field: string
	order: string
	
}

interface RatingNotification {
	title: string
	createdAt: string
	score: number
	username: string
}

const initialNotification: RatingNotification = {
	title: "",
	createdAt: "",
	score: 0,
	username: ""
};

export const initialQuery: MovieQuery = {
	pageNumber: 1,
	pageSize: 10,
	userMovies: false,
	field: "grade",
	order: "desc"
};

const Dashboard: React.FC = (props: any) => {
	
	const [cookies, setCookie] = useCookies(['filterCookie'] );
	
	const context = useContext(AuthContext);
	const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>(undefined);
	const [filterMode, setMode] = useState("");
	const [addMovie, setAddMovie] = useState<boolean>(false);
	const [error, setError] = useState("");
	const [queryParams, setQueryParams] = useState<MovieQuery>(initialQuery);
	const topOfModule = createRef<HTMLElement>();
	const [rating, setRating] = useState<RatingNotification>(initialNotification);
	
	
	useSubscription(GET_NEW_RATING, {
		
		onSubscriptionData({subscriptionData}: { subscriptionData: any }) {
			const newestRating = subscriptionData.data.newestRating;
			const {user}: { user: any } = context;
			if (user) {
				if (newestRating.rating.createdAt !== rating?.createdAt && newestRating.rating.username !== user.username) {
					setRating({
						title: newestRating.movie,
						createdAt: newestRating.rating.createdAt,
						score: newestRating.rating.score,
						username: newestRating.rating.username
					});
				}
			}
		}
	});
	
	const {loading, fetchMore, data} = useQuery(FETCH_MOVIES_QUERY, {
		variables: {...queryParams, pageNumber: 0},
		onError(err: ApolloError) {
			setError(err.message);
		},
		onCompleted(data) {
		}
	});
	
	const getNext = async () => {
		if (data && data.getMovies.hasMore) {
			const nextQuery = {...queryParams, pageNumber: queryParams.pageNumber + 1};
			try {
				await fetchMore({
					variables: nextQuery,
					updateQuery: (prevResult: any, {fetchMoreResult}: any) => {
						fetchMoreResult.getMovies.movies = [
							...data.getMovies.movies,
							...fetchMoreResult.getMovies.movies
						];
						setQueryParams(nextQuery);
						return fetchMoreResult;
					}
				});
			} catch (e: any) {
				setError(e.message);
			}
		}
	};
	
	const closeModal = () => {
		if (selectedMovie) {
			setSelectedMovie(undefined);
		}
		if (addMovie) {
			setAddMovie(false);
		}
	};
	
	useEffect(() => {
		if (filterMode === "gen") {
			setQueryParams({...queryParams, userMovies: false});
		} else if (filterMode === "user") {
			setQueryParams({...queryParams, userMovies: true});
		}
	}, [filterMode]);
	
	useEffect(() => {
		if (rating.createdAt) {
			store.addNotification({
					title: "New Rating!",
					message: `${rating.title} was given ${rating.score} stars by ${rating.username}`,
					type: "info",
					insert: "top",
					container: "top-right",
					animationIn: ["animate__animated", "animate__fadeIn"],
					animationOut: ["animate__animated", "animate__fadeOut"],
					dismiss: {
						duration: 5000,
						onScreen: true
					}
					
				}
			);
		}
		if (error) {
			store.addNotification({
				title: "Error!",
				message: `${error}`,
				type: "info",
				insert: "top",
				container: "top-right",
				animationIn: ["animate__animated", "animate__fadeIn"],
				animationOut: ["animate__animated", "animate__fadeOut"],
				dismiss: {
					duration: 5000,
					onScreen: true
				}
			})
		}
	}, [rating, error]);
	
	useEffect(() => {
		const filterCookie = cookies.filterCookie;
		console.log(filterCookie)
		if (filterCookie) {
			if (queryParams.field !== filterCookie.field || queryParams.order !== filterCookie.order ){
				setQueryParams({...queryParams,
					order: filterCookie.order,
					field: filterCookie.field,
					pageNumber: 0
				})
			}
		}
	},[cookies])
	return (
		<Container fluid={(window.screen.width <= 780)}>
			<h1> Movies </h1>
			{(addMovie || !!selectedMovie) && (
				<MovieModal open={true}
				            newMovie={addMovie}
				            selectedMovie={selectedMovie}
				            closeModal={closeModal}
				            queryParams={queryParams}
				/>
			)}
			<Container textAlign={"center"}>
				<Grid stackable padded>
					<GridRow columns={3} style={{width: "50%"}}>
						<GridColumn>
							<Button
								color={"blue"}
								onClick={() => setMode("gen")}
								disabled={(filterMode === "gen")}
							>
								Available Movies
							</Button>
						</GridColumn>
						<GridColumn>
							<Button
								color={"blue"}
								onClick={() => setMode("user")}
								disabled={(filterMode === "user")}
							>
								My Movies
							</Button>
						</GridColumn>
						<GridColumn>
							<Button
								color={"teal"}
								onClick={() => setAddMovie(true)}
							>
								Add Movie
							</Button>
						</GridColumn>
					</GridRow>
				</Grid>
			</Container>
			<MoviesTable
				movies={(data) ? data.getMovies.movies : []}
				queryParams={queryParams}
				tableLoading={loading}
				getNext={getNext}
				setCookie={setCookie}
				selectMovie={setSelectedMovie}
				changeQuery={setQueryParams}
				topOfTable={topOfModule}
			/>
		</Container>
	);
};

export default Dashboard;