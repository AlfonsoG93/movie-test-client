import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom"
import "semantic-ui-css/semantic.min.css"
import "./App.css";
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"

const App: React.FC = () => {
	return (
		<Router>
			<Route exact path={"/"} component={Dashboard}/>
			<Route exact path={"/login"} component={Login}/>
			<Route exact path={"/register"} component={Register}/>
		</Router>
	);
}

export default App;
