import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./Components/Navbar";
import {Container} from "semantic-ui-react";
import {AuthProvider} from "./Authorization";
import AuthRoute from "./Components/AuthRoute";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const App: React.FC = () => {
	return (
		<AuthProvider>
			<ReactNotification/>
			<Router>
				<Container fluid>
					<Route path={"/"} component={Navbar}/>
					<AuthRoute exact path={"/"} component={Dashboard}/>
					<Route exact path={"/login"} component={Login}/>
					<Route exact path={"/register"} component={Register}/>
				</Container>
			</Router>
		</AuthProvider>
	);
};

export default App;
