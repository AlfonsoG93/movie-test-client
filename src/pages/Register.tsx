import React, {useContext, useState} from "react"
import {Button, Container, Form} from "semantic-ui-react";
import {useMutation} from "@apollo/client";
import {AuthContext} from "../Authorization";
import {useForm} from "../hooks/Form";
import {REGISTER_USER} from "../Services/authServices";

interface RegisterInputs {
	username: string
	email: string
	password: string
	confirmPassword: string
}

const initialState: RegisterInputs = {
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
}

interface errorState {
	username?: string
	email?: string
	password?: string
	confirmPassword?: string
}

const errorInitialState: errorState = {}
const Register: React.FC = (props: any) => {
	
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState(errorInitialState);
	
	const {onChange, onSubmit, values} = useForm(registerUser, initialState);
	
	const [addUser, {loading}] = useMutation(REGISTER_USER, {
		update(
			_,
			{
				data: {register: userData}
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
	
	function registerUser() {
		addUser();
	}
	
	return (
		<Container textAlign={"center"}>
			<div className="form-container center aligned grid">
				<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
					<h1>Register</h1>
					<Form.Input
						style={{maxWidth:"300px"}}
						label="Username"
						placeholder="Username.."
						name="username"
						type="text"
						value={values.username}
						error={!!errors.username}
						onChange={onChange}
					/>
					<Form.Input
						style={{maxWidth:"300px"}}
						label="Email"
						placeholder="Email.."
						name="email"
						type="email"
						value={values.email}
						error={!!errors.email}
						onChange={onChange}
					/>
					<Form.Input
						style={{maxWidth:"300px"}}
						label="Password"
						placeholder="Password.."
						name="password"
						type="password"
						value={values.password}
						error={!!errors.password}
						onChange={onChange}
					/>
					<Form.Input
						style={{maxWidth:"300px"}}
						label="Confirm Password"
						placeholder="Confirm Password.."
						name="confirmPassword"
						type="password"
						value={values.confirmPassword}
						error={!!errors.confirmPassword}
						onChange={onChange}
					/>
					<Button type="submit" primary>
						Register
					</Button>
				</Form>
				{Object.keys(errors).length > 0 && (
					<div className="ui error message" style={{width: "300px"}}>
						<ul className="list">
							{Object.values(errors).map((value) => (
								<li key={value}>{value}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</Container>
	);
}

export default Register;