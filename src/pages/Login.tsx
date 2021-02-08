import React, {useContext, useState} from "react";
import {Button, Container, Form} from "semantic-ui-react";
import {useMutation} from "@apollo/react-hooks";
import {AuthContext} from "../Authorization"
import {useForm} from "../hooks/Form"
import {LOGIN_USER} from "../Services/authServices";

interface LoginInputs {
	username: ""
	password: ""
}

const initialState: LoginInputs = {
	username: "",
	password: ""
}

interface errorState {
	username?: string
	password?: string
}

const errorInitialState: errorState = {}
const Login: React.FC = (props: any) => {
	const context = useContext(AuthContext);
	const [errors, setErrors]: any[] = useState(errorInitialState);
	
	const {onChange, onSubmit, values} = useForm(loginUserCallback, initialState);
	
	const [loginUser, {loading}] = useMutation(LOGIN_USER, {
		update(
			_,
			{
				data: {login: userData}
			}
		) {
			context.login(userData);
			props.history.push("/");
		},
		onError(err) {
			setErrors(err?.graphQLErrors[0]?.extensions?.exception.errors);
		},
		variables: values
	});
	
	function loginUserCallback() {
		loginUser();
	}
	
	return (
		<Container textAlign={"center"}>
			<div className="form-container center aligned grid">
				<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
					<h1>Login</h1>
					<Form.Input
						style={{maxWidth:"300px"}}
						label="Username"
						placeholder="Username.."
						name="username"
						type="text"
						value={(values) ? values.username : ""}
						error={(errors) ? !!errors.username : false}
						onChange={onChange}
					/>
					<Form.Input
						style={{maxWidth:"300px"}}
						label="Password"
						placeholder="Password.."
						name="password"
						type="password"
						value={(values) ? values.password : ""}
						error={(errors) ? !!errors.password : false}
						onChange={onChange}
					/>
					<Button type="submit" primary>
						Login
					</Button>
				</Form>
				{Object.keys(errors).length > 0 && (
					<div className="ui error message">
						<ul className="list">
							{Object.values(errors).map((value: any) => (
								<li key={value}>{value}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</Container>
	);
}
export default Login
