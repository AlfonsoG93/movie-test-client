import React from "react";
import App from "./App";
import {InMemoryCache} from "apollo-cache-inmemory";
import {createHttpLink} from "apollo-link-http";
import {ApolloClient, ApolloProvider} from "@apollo/react-hooks";
import {setContext} from "@apollo/client/link/context";
import {WebSocketLink} from "@apollo/client/link/ws";
import {RetryLink} from "@apollo/client/link/retry";
import {getMainDefinition} from "@apollo/client/utilities";


const uri = "http://localhost:5000";
const ws = "ws://localhost:5000/graphql";

let link: any = createHttpLink({uri});


const cache: any = new InMemoryCache();
const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : ""
		}
	};
});
link = authLink.concat(link);

let socketLink = new WebSocketLink({
	uri: ws,
	options: {
		reconnect: true
	},
	
});

const client = new ApolloClient({
	link: new RetryLink().split(
		(sys: any) => {
			let {operation} = getMainDefinition(sys.query) as any;
			return operation === "subscription";
		}, socketLink, link
	)
	,
	cache
});

export default (
	<ApolloProvider client={client}>
		<App/>
	</ApolloProvider>
);