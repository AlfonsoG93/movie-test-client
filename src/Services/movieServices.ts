import gql from "graphql-tag";

export const FETCH_MOVIES_QUERY = gql`
    query getMovies (
        $pageNumber: Int
        $pageSize: Int
        $userMovies: Boolean!
        $field: String!
        $order: String!
    ){
        getMovies(paginationParams: {
            pageNumber: $pageNumber
            pageSize: $pageSize
            filterObject: {
                userMovies: $userMovies
                field: $field
                order: $order
            }
        }) {
            hasMore
            currentPage
            cursor
            movies {
                id
                title
                duration
                releaseDate
                actors
                createdAt
                ratings {
                    score
                }
                ratingCount
                grade
                username
            }
        }
    }
`;


export const ADD_MOVIE = gql`
    mutation addMovie (
        $title: String!
        $actors: [String]!
        $releaseDate: String!
        $duration: Int!
    ) {
        addMovie(addMovieInput: {
            title: $title
            actors: $actors
            releaseDate: $releaseDate
            duration: $Int
        }) {
            title
            grade
        }
    }
`;

export const ADD_RATING = gql`
    mutation addRating (
        $movieId: String!
        $score: Int!
    ) {
        addRating(addRatingInput: {
            movieId: $movieId
            score: $score
        }) {
            title
            grade
        }
    }
`;

export const GET_NEW_RATING = gql`
    subscription newestRating {
        newestRating {
            movie
            rating {
                username
                score
            }
        }
    }
`;