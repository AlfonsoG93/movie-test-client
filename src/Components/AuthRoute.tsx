import React, {useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {AuthContext} from "../Authorization"


const AuthRoute = ({component: Component, ...rest}: any) => {
	const {user} = useContext(AuthContext);
	return (
		<Route
			{...rest}
			render={(props) =>
				user ? <Component {...props} /> : <Redirect to="/login"/>
			}
		/>
	);
}

export default AuthRoute;