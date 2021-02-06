import React, { useReducer, createContext } from "react";
import jwtDecode, {JwtPayload} from "jwt-decode";

interface AuthState {
	user?: any
}
const initialState: AuthState = {
	user: undefined
};

if (localStorage.getItem("jwtToken")) {
	const decodedToken: JwtPayload = jwtDecode(localStorage.getItem("jwtToken") || "");
	
	if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem("jwtToken");
	} else {
		initialState.user = decodedToken;
	}
}

const AuthContext = createContext({
	user: undefined,
	login: (userData: any) => ({
		...userData
	}),
	logout: () => {}
});

function authReducer(state: AuthState, action: any) {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				user: action.payload
			};
		case "LOGOUT":
			return {
				...state,
				user: undefined
			};
		default:
			return state;
	}
}

const AuthProvider: React.FC = (props: any )  => {
	const [state, dispatch] = useReducer(authReducer, initialState);
	
	function login(userData: any ) {
		localStorage.setItem("jwtToken", userData.token);
		dispatch({
			type: "LOGIN",
			payload: userData
		});
	}
	
	function logout() {
		localStorage.removeItem("jwtToken");
		dispatch({ type: "LOGOUT" });
	}
	
	return (
		<AuthContext.Provider
			value={{ user: state.user, login, logout }}
			{...props}
		/>
	);
}

export { AuthContext, AuthProvider };