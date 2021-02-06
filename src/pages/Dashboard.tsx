import React, {useState} from "react";
import {useQuery} from "@apollo/client";
import {FETCH_MOVIES_QUERY} from "../Services/movieServices";
import {Container} from "semantic-ui-react";
import MoviesTable from "../Components/MoviesTable";
import {ApolloError} from "apollo-client";

export interface MovieQuery {
	pageNumber: number
	pageSize: number
	userMovies: boolean
	field: string
	order: string
	
}

export const initialQuery: MovieQuery = {
	pageNumber: 1,
	pageSize: 10,
	userMovies: false,
	field: "grade",
	order: "desc"
};

const Dashboard: React.FC = () => {
	const [error, setError] = useState("");
	const [queryParams, setQueryParams] = useState<MovieQuery>(initialQuery);
	const topOfModule = React.createRef<HTMLElement>();
	
	const {loading, fetchMore, data, refetch} = useQuery(FETCH_MOVIES_QUERY, {
		variables: {...queryParams},
		onError(err: ApolloError) {
			setError(err.message);
		}
	});
	
	const reFetch = async (newQueryParams?: MovieQuery) => {
		try {
			if (newQueryParams) {
				await refetch({
					...newQueryParams,
					pageNumber: 0
				});
				setQueryParams(newQueryParams);
			} else {
				await refetch({
					...queryParams,
					pageNumber: 0
				});
			}
		} catch (e) {
			setError(e.message);
		}
	};
	const getNext = async () => {
		if (data && data.getMovies.hasMore) {
			const nextQuery = (queryParams) ? {...queryParams, pageNumber: queryParams.pageNumber + 1} : initialQuery;
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
	return (
		<Container fluid={(window.screen.width <= 780)}>
			<h1>Dashboard Screen</h1>
			<MoviesTable
				movies={(data) ? data.getMovies.movies : []}
				queryParams={queryParams}
				tableLoading={loading}
				getNext={getNext}
				refetch={reFetch}
				topOfTable={topOfModule}
			/>
		</Container>
	);
};

export default Dashboard;