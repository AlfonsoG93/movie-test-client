import React from "react"
import App from "./App"
import {InMemoryCache} from "apollo-cache-inmemory"
import {createHttpLink} from "apollo-link-http"
import {ApolloClient, ApolloProvider} from "@apollo/react-hooks"


const link: any = createHttpLink({ uri: `http://localhost:5000` })
const cache: any = new InMemoryCache()
const client = new ApolloClient({ link, cache })

export default (
	<ApolloProvider client={client}>
		<App/>
	</ApolloProvider>
)