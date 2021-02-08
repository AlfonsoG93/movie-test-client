import React, {useContext, useEffect, useState} from "react";
import {DateInput} from "semantic-ui-calendar-react";
import {
	Button,
	Dropdown,
	DropdownOnSearchChangeData,
	DropdownProps,
	Grid,
	GridColumn,
	GridRow,
	Header,
	Icon,
	Input,
	Modal,
	ModalActions,
	ModalContent
} from "semantic-ui-react";
import {defaultMovie, Movie} from "../Interfaces/Movie";
import {AuthContext} from "../Authorization";
import moment from "moment";
import {InputOnChangeData} from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import {useMutation} from "@apollo/client";
import {ADD_MOVIE, DELETE_MOVIE, FETCH_MOVIES_QUERY} from "../Services/movieServices";
import {ApolloError} from "apollo-client";
import {MovieQuery} from "../pages/Dashboard";

interface MovieCompProps {
	open: boolean
	newMovie: boolean
	selectedMovie?: Movie
	queryParams: MovieQuery
	closeModal: () => void
}

interface TimeState {
	hours: number;
	minutes: number;
}

const initialTimeSelect: TimeState = {
	hours: 0,
	minutes: 0
};
const MovieModal: React.FC<any> = (props: MovieCompProps) => {
	const {open, selectedMovie, newMovie, closeModal, queryParams} = props;
	const [movieToShow, setMovieToShow] = useState<Movie>(defaultMovie);
	const {user} = useContext(AuthContext);
	
	const isEdit = () => {
		const {username}: any = user;
		return username === selectedMovie?.username;
	};
	const isNewOrEdit = () => {
		return isEdit() || newMovie;
	};
	
	
	const [castToShow, setCastToShow] = useState<string[]>([]);
	const [actorInputError, setActorInputError] = useState(false);
	const [time, setTime] = useState<TimeState>(initialTimeSelect);
	
	const [addMovie, {loading}] = useMutation(ADD_MOVIE, {
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
				data: {addMovie}
			}
		) {
		},
		onCompleted() {
			handleClose();
		},
		onError(err: ApolloError) {
			console.log(err.message);
			handleClose();
		}
	});
	const [deleteMovie] = useMutation(DELETE_MOVIE, {
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
				data: {deleteMovie}
			}
		) {
		},
		onCompleted() {
			handleClose();
		},
		onError(err: ApolloError) {
			console.log(err.message);
			handleClose();
		}
	});
	
	const handleClose = () => {
		closeModal();
	};
	
	const handleSubmit = () => {
		addMovie({
			variables: {
				id: (movieToShow.id) ? movieToShow.id : "",
				title: movieToShow.title,
				actors: movieToShow.actors,
				releaseDate: movieToShow.releaseDate,
				duration: movieToShow.duration
			}
		});
	};
	const handleDelete = () => {
		deleteMovie({
			variables: {id: movieToShow.id}
		});
	};
	
	const handleAddActors = (event: any, data: DropdownProps) => {
		const newActor = data.value as string;
		const trimmedData = newActor;
		
		if (movieToShow.actors.filter((actor: string) => actor === trimmedData).length === 0) {
			setMovieToShow({...movieToShow, actors: [...movieToShow.actors, trimmedData]});
			if (actorInputError) setActorInputError(false);
		} else setActorInputError(true);
		
	};
	
	const handleFilterActor = (e: any, data: DropdownOnSearchChangeData) => {
		const actorToFilter = e.target.value as string;
		const cast = movieToShow.actors;
		const filteredActors = cast.filter((actor: string) => (actor.toLowerCase().includes(actorToFilter.toLowerCase())));
		setCastToShow((actorToFilter) ? filteredActors : movieToShow.actors);
	};
	
	const handleOnChangeActors = (e: any, data: DropdownProps) => {
		if (isNewOrEdit()) setMovieToShow({...movieToShow, actors: data.value as string[]});
	};
	
	const handleChangeDate = (event: any, {value}: { value: string }) => {
		const newDate = moment(moment(value, "DD-MM-YYYY")).toISOString();
		setMovieToShow({...movieToShow, releaseDate: newDate});
	};
	
	const handleTimeChange = (value: InputOnChangeData, type: string) => {
		if (type === "hours") {
			setTime({...time, hours: (value.value) ? parseInt(value.value as any) : 0});
		}
		if (type === "minutes") {
			setTime({...time, minutes: (value.value) ? parseInt(value.value as any) : 0});
		}
	};
	
	useEffect(() => {
		if (selectedMovie) {
			setMovieToShow({...selectedMovie});
			setTime({
				hours: selectedMovie.duration ? Math.floor(selectedMovie.duration / 3600) : 0,
				minutes: selectedMovie.duration ? (selectedMovie.duration % 3600 / 60) : 0
			});
		};
	}, [selectedMovie]);
	
	useEffect(() => {
		setCastToShow(movieToShow.actors);
	}, [movieToShow]);
	
	
	useEffect(() => {
		if (time.hours || time.minutes) {
			setMovieToShow({
				...movieToShow,
				duration: Math.floor(time.hours * 3600) + Math.floor(time.minutes * 60)
			});
		}
	}, [time]);
	
	return (
		<Modal
			closeIcon
			closeOnEscape
			size={"large"}
			onClose={handleClose}
			open={open}
		>
			<Header icon='film' content={(selectedMovie) ? `${selectedMovie.title}` : "New Movie"}/>
			<ModalContent>
				<Grid stackable>
					<GridRow columns={2}>
						<GridColumn width={3}>
							<h3>Title:</h3>
						</GridColumn>
						<GridColumn width={12}>
							<Input
								disabled={!isNewOrEdit()}
								value={movieToShow.title}
								error={!movieToShow.title}
								onChange={(e) => setMovieToShow({...movieToShow, title: e.target.value})}
							/>
						</GridColumn>
					</GridRow>
				</Grid>
				
				<Grid stackable>
					<GridRow columns={2}>
						<GridColumn width={3}>
							<h3>Release Date:</h3>
						</GridColumn>
						<GridColumn>
							<DateInput
								name={"date"}
								disabled={!isNewOrEdit()}
								value={moment(movieToShow.releaseDate).format("DD-MM-YYYY")}
								clearIcon={<Icon name="remove" color="red"/>}
								onChange={handleChangeDate}
							/>
						</GridColumn>
					</GridRow>
				</Grid>
				
				<Grid stackable>
					<GridRow columns={2}>
						<GridColumn width={3}>
							<h3>Cast:</h3>
						</GridColumn>
						<GridColumn width={12}>
							<Dropdown
								value={castToShow}
								multiple
								labeled
								search
								selection
								fluid
								clearable
								error={actorInputError}
								onSearchChange={handleFilterActor}
								options={castToShow.map((actor: string) => ({key: actor, value: actor, text: actor}))}
								onChange={handleOnChangeActors}
								allowAdditions={isNewOrEdit()}
								onAddItem={handleAddActors}
							/>
						</GridColumn>
					</GridRow>
				</Grid>
				
				<Grid stackable>
					<GridRow columns={2}>
						<GridColumn width={3}>
							<h3>Duration:</h3>
						</GridColumn>
						<GridColumn width={12}>
							<Grid stackable>
								<GridRow columns={2}>
									<GridColumn>
										<Input
											disabled={!isNewOrEdit()}
											type={"number"}
											name={"hours"}
											label={"Hours"}
											value={time.hours}
											onChange={(e, data) => handleTimeChange(data, "hours")}
										/>
									</GridColumn>
									<GridColumn>
										<Input
											disabled={!isNewOrEdit()}
											type={"number"}
											name={"minutes"}
											label={"Minutes"}
											value={time.minutes}
											onChange={(e, data) => handleTimeChange(data, "minutes")}
										/>
									</GridColumn>
								</GridRow>
							</Grid></GridColumn>
					</GridRow>
				</Grid>
			
			</ModalContent>
			{(isNewOrEdit()) && (
				<ModalActions>
					
					<Button color='red' onClick={handleDelete}>
						<Icon name='remove'/> Delete
					</Button>
					<Button color='grey' onClick={handleClose}>
						Cancel
					</Button>
					<Button color='green' onClick={handleSubmit}>
						<Icon name='checkmark'/> Save
					</Button>
				</ModalActions>
			)}
		</Modal>
	);
};

export default MovieModal;