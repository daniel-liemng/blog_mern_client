import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Container } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

const MenuBar = () => {
  // context
  const { user, logout } = useContext(AuthContext);

  // Handle activeItem by URL
  const { pathname } = useLocation();
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  // Handle activeItem by clicking MenuItem
  const handleItemClick = (e, { name }) => setActiveItem(name);

  // dynamic MenuBar based on UserLogin
  const menuBar = user ? (
    <Menu pointing secondary size='massive' color='purple'>
      <Container>
        <Menu.Item name={user.username} active as={Link} to='/' />

        <Menu.Menu position='right'>
          <Menu.Item name='logout' onClick={logout} />
        </Menu.Menu>
      </Container>
    </Menu>
  ) : (
    <Menu pointing secondary size='massive' color='purple'>
      <Container>
        <Menu.Item
          name='home'
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to='/'
        />

        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='register'
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );

  return menuBar;
};

export default MenuBar;
