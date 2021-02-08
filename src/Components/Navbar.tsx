import React, {useContext, useState} from "react"
import {Button, Icon, Menu} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {AuthContext} from "../Authorization";

const Navbar: React.FC = (props: any) => {
	const rawPath = window.location.pathname;
	const defaultPath = "/";
	const path = (rawPath === defaultPath) ? "Movies" : rawPath.substring(1);
	const [activeItem, setActiveItem] = useState(path)
	const handleItemClick: any = (e: any, {name}: { name: string }) => {
		if (name === "logout-button") {
			props.history.push("/login");
			logout();
		}
		else setActiveItem(name);
	}
	const {user, logout} = useContext(AuthContext);
	
	return (
		<Menu pointing secondary size={"massive"} color={"blue"}>
			<Menu.Item
				name="Movies"
				active={activeItem === "Movies"}
				onClick={handleItemClick}
				as={Link}
				to={"/"}
				disabled={!user}
			/>
			<Menu.Menu position='right'>
				{user ? (
					<Menu.Item>
						<Button icon color={"blue"} name={"logout-button"} onClick={handleItemClick}>
							<Icon name="sign-out alternate" />
						</Button>
					</Menu.Item>
				) : (
					 <React.Fragment>
						
						 <Menu.Item
							 name="login"
							 active={activeItem === "login"}
							 onClick={handleItemClick}
							 as={Link}
							 to={"/login"}
						 />
						
						 <Menu.Item
							 name="register"
							 active={activeItem === "register"}
							 onClick={handleItemClick}
							 as={Link}
							 to={"/register"}
						 />
					 </React.Fragment>
				 )}
			</Menu.Menu>
		</Menu>
	)
	
}

export default Navbar
