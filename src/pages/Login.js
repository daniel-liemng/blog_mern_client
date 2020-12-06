import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";

const Login = (props) => {
  // context
  const { login } = useContext(AuthContext);
  // state
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
  };

  const { values, handleChange, handleSubmit } = useForm(
    loginUserCallback,
    initialState
  );

  // MUTATION
  // Array refactoring
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    variables: values,
    // options -> trigger if mutation success
    update(_, { data: { login: userData } }) {
      // Authcontext - login
      login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  // define at bottom - use at top
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className='form-container'>
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Login</h1>
        <Form.Input
          type='text'
          label='Username'
          placeholder='Username...'
          name='username'
          value={values.username}
          onChange={handleChange}
          error={errors.username ? true : false}
        />

        <Form.Input
          type='password'
          label='Password'
          placeholder='Password...'
          name='password'
          value={values.password}
          onChange={handleChange}
          error={errors.password ? true : false}
        />

        <Button type='submit' color='purple'>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Login;
