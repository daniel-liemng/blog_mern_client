import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "./App.css";
import "semantic-ui-css/semantic.min.css";

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";

import { AuthProvider } from "./context/auth";

import AuthRoute from "./utils/AuthRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <Container>
          <Switch>
            <Route exact path='/' component={Home} />
            <AuthRoute exact path='/register' component={Register} />
            <AuthRoute exact path='/login' component={Login} />
            <Route exact path='/posts/:postId' component={SinglePost} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
