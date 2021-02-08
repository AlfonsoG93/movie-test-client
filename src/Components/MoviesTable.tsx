import React from "react";
import {
	Grid,
	GridColumn,
	GridRow,
	Header,
	Icon,
	Label,
	List,
	Loader,
	Popup,
	Rating,
	RatingProps,
	Statistic
} from "semantic-ui-react";
import {generateRating, Movie} from "../Interfaces/Movie";
import {useMutation} from "@apollo/client";
import {ADD_RATING, FETCH_MOVIES_QUERY} from "../Services/movieServices";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Waypoint} from "react-waypoint";
import {MovieQuery} from "../pages/Dashboard";
import {ApolloError} from "apollo-client";
import moment from "moment";
import {store} from "react-notifications-component";

interface MoviesTableProps {
	tableLoading: boolean;
	movies?: Movie[]
	getNext: () => void
	queryParams: MovieQuery
	refetch: (newQueryParams?: MovieQuery) => void
	topOfTable: any
	changeQuery: (movieQ: MovieQuery) => void
	selectMovie: (movie: Movie) => void
	setCookie: (cookieName: string, value: any) => void
}

const tableHeaders: string[] = ["Grade", "Title", "Release Date", "Cast", "Duration", "Ratings"];
const MoviesTable: React.FC<any> = (props: MoviesTableProps) => {
	const {tableLoading, movies, getNext, queryParams, topOfTable, changeQuery, selectMovie, setCookie} = props;
	const [addRating, {loading}] = useMutation(ADD_RATING, {
		refetchQueries: [
			{
				query: FETCH_MOVIES_QUERY,
				variables: {
					...queryParams,
					pageNumber: 0
				}
			}
		],
		update(
			_,
			{
				data: {addRating}
			}
		) {
		},
		onError(err: ApolloError) {
			store.addNotification({
				title: "New Error!",
				message: `${err.message}`,
				type: "info",
				insert: "top",
				container: "top-right",
				animationIn: ["animate__animated", "animate__fadeIn"],
				animationOut: ["animate__animated", "animate__fadeOut"],
				dismiss: {
					duration: 5000,
					onScreen: true
				}
				
			});
		}
	});
	
	const getFilterArrow = (header: string) => {
		const arrowUp = "arrow up";
		let arrow = "arrow down";
		const {field, order} = queryParams;
		if (header === "Grade") {
			if (field === "grade" && order === "asc") {
				arrow = arrowUp;
			}
		}
		if (header === "Title") {
			if (field === "title" && order === "asc") {
				arrow = arrowUp;
			}
		}
		if (header === "Release Date") {
			if (field === "releaseDate" && order === "asc") {
				arrow = arrowUp;
			}
		}
		if (header === "Cast") {
			if (field === "actors" && order === "asc") {
				arrow = arrowUp;
			}
		}
		if (header === "Duration") {
			if (field === "duration" && order === "asc") {
				arrow = arrowUp;
			}
		}
		if (header === "Ratings") {
			if (field === "ratingCount" && order === "asc") {
				arrow = arrowUp;
			}
		}
		return arrow;
	};
	
	const handleFilter = (header: string, currentArrow: string) => {
		let newQueryParams = {...queryParams};
		if (header === "Grade") {
			if (currentArrow === "arrow down") {
				newQueryParams = {...queryParams, order: "asc", field: "grade", pageNumber: 0};
				setCookie("filterCookie", {order: "asc", field: "grade"});
				changeQuery(newQueryParams);
			} else if (currentArrow === "arrow up") {
				newQueryParams = {...queryParams, order: "desc", field: "grade", pageNumber: 0};
				setCookie("filterCookie", {order: "desc", field: "grade"});
				changeQuery(newQueryParams);
			}
		}
		if (header === "Title") {
			if (currentArrow === "arrow down") {
				newQueryParams = {...queryParams, order: "asc", field: "title", pageNumber: 0};
				setCookie("filterCookie", {order: "asc", field: "title"});
				changeQuery(newQueryParams);
			} else if (currentArrow === "arrow up") {
				newQueryParams = {...queryParams, order: "desc", field: "title", pageNumber: 0};
				setCookie("filterCookie", {order: "desc", field: "title"});
				
				changeQuery(newQueryParams);
			}
		}
		if (header === "Release Date") {
			if (currentArrow === "arrow down") {
				newQueryParams = {...queryParams, order: "asc", field: "releaseDate", pageNumber: 0};
				setCookie("filterCookie", {order: "asc", field: "releaseDate"});
				
				changeQuery(newQueryParams);
			} else if (currentArrow === "arrow up") {
				newQueryParams = {...queryParams, order: "desc", field: "releaseDate", pageNumber: 0};
				setCookie("filterCookie", {order: "desc", field: "releaseDate"});
				changeQuery(newQueryParams);
			}
		}
		if (header === "Cast") {
			if (currentArrow === "arrow down") {
				newQueryParams = {...queryParams, order: "asc", field: "actors", pageNumber: 0};
				setCookie("filterCookie", {order: "asc", field: "actors"});
				
				changeQuery(newQueryParams);
			} else if (currentArrow === "arrow up") {
				newQueryParams = {...queryParams, order: "desc", field: "actors", pageNumber: 0};
				setCookie("filterCookie", {order: "desc", field: "actors"});
				changeQuery(newQueryParams);
			}
		}
		if (header === "Duration") {
			if (currentArrow === "arrow down") {
				newQueryParams = {...queryParams, order: "asc", field: "duration", pageNumber: 0};
				setCookie("filterCookie", {order: "asc", field: "duration"});
				
				changeQuery(newQueryParams);
			} else if (currentArrow === "arrow up") {
				newQueryParams = {...queryParams, order: "desc", field: "duration", pageNumber: 0};
				setCookie("filterCookie", {order: "desc", field: "duration"});
				changeQuery(newQueryParams);
			}
		}
		if (header === "Ratings") {
			if (currentArrow === "arrow down") {
				newQueryParams = {...queryParams, order: "asc", field: "ratingCount", pageNumber: 0};
				setCookie("filterCookie", {order: "asc", field: "duration"});
				
				changeQuery(newQueryParams);
			} else if (currentArrow === "arrow up") {
				newQueryParams = {...queryParams, order: "desc", field: "ratingCount", pageNumber: 0};
				setCookie("filterCookie", {order: "desc", field: "duration"});
				changeQuery(newQueryParams);
			}
		}
	};
	
	const selectRowHandler = (movie: Movie) => {
		selectMovie(movie);
	};
	
	const addRatingHandler = (e: any, movie: Movie, ratingObj: RatingProps) => {
		const {rating} = ratingObj;
		e.stopPropagation();
		const newMovieRating = generateRating(movie.id || "", rating as number);
		addRating({
			variables: {...newMovieRating}
		});
	};
	
	const calcStarNum = (grade: number) => {
		return (grade * 5 / 100);
	};
	
	
	const getField = (column: string, movie: Movie) => {
		if (column === "Grade") {
			const grade = movie.grade;
			let color: any = "red";
			if (grade >= 90) color = "green";
			else if (grade >= 70) color = "olive";
			else if (grade >= 40) color = "yellow";
			else if (grade >= 20) color = "orange";
			if (movie) return (
				<Statistic size={"large"} horizontal color={color}>
					<Statistic.Value>{grade}</Statistic.Value>
					<Statistic.Label>
						<Header size='medium'>%</Header>
					</Statistic.Label>
				</Statistic>
			);
		}
		if (column === "Title") {
			return (<Header size='small'>{movie.title}</Header>);
		}
		if (column === "Cast") {
			const label = (movie.actors.length > 1) ? `${movie.actors[0]}...` : movie.actors[0];
			return (
				<Popup
					content={<List items={movie.actors}/>}
					trigger={<div>{label}</div>}
				/>
			);
		}
		if (column === "Release Date") {
			return (moment.parseZone(movie.releaseDate).format("MMMM DD YYYY"));
		}
		if (column === "Duration") {
			return moment.utc(movie.duration * 1000).format("HH:mm:ss");
		}
		if (column === "Ratings") {
			const label = (movie.ratingCount === 1) ? "Rating" : "Ratings";
			return (
				<Label>
					<Grid doubling columns={(window.screen.width >= 720) ? 2 : 1}>
						<GridRow centered verticalAlign={"middle"} textAlign={"center"}>
							<GridColumn verticalAlign={"middle"}>
								<Rating
									icon={"star"}
									onRate={(e, rating) => addRatingHandler(e, movie, rating)}
									rating={calcStarNum(movie.grade)}
									maxRating={5}
								/>
							</GridColumn>
							<GridColumn verticalAlign={"middle"}>
								<div>{movie.ratingCount} {label}</div>
							</GridColumn>
						</GridRow>
					</Grid>
				</Label>
			);
		}
	};
	
	return (
		<div style={{height: "60vh", overflow: "auto"}}>
			<span ref={topOfTable}/>
			<Paper>
				{(tableLoading || loading)
				 ? (<Loader>Loading</Loader>)
				 : <Table
					 stickyHeader
					 className="scroll-table"
				 >
					 <TableHead>
						 <TableRow>
							 {tableHeaders.map((header: string) => (
								 <TableCell key={header}>
									 <Grid>
										 <GridRow>
											 <GridColumn width={1} verticalAlign={"middle"}>
												 <Icon
													 onClick={() => handleFilter(header, getFilterArrow(header))}
													 style={{cursor: "pointer"}}
													 name={getFilterArrow(header) as any}
													 color={"blue"}
												 />
											 </GridColumn>
											 <GridColumn width={6}>
												 <Header size='small'>{header}</Header>
											 </GridColumn>
										 </GridRow>
									 </Grid>
								 </TableCell>
							 ))}
						 </TableRow>
					 </TableHead>
					 <TableBody>
						 {movies && movies.map((movie: Movie, index: number) => (
							 <TableRow
								 style={{cursor: "pointer"}}
								 key={`job-row-${movie.id}-${index}`}
								 hover={true}
								 onClick={() => selectRowHandler(movie)}
							 >
								 {tableHeaders.map((column: string, columnIndex: number) => (
									 <TableCell
										 key={`movie-cell-${movie.id}-${column}`}
										 component="th"
										 scope="row"
									 >
										 {index === movies.length - 1 && columnIndex === 1 && (
											 <Waypoint
												 key={`job-waypoint-${movie.id}-${index}-${columnIndex}`}
												 onEnter={getNext}
											 />
										 )}
										 {getField(column, movie)}
									 </TableCell>
								 ))}
							 </TableRow>
						 ))}
					 </TableBody>
				 </Table>
				}
			</Paper>
		</div>
	);
};

export default MoviesTable;