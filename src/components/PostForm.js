import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useForm } from "../utils/hooks";

const PostForm = () => {
  const initialState = {
    body: "",
  };

  const { values, handleChange, handleSubmit } = useForm(
    createPostCallback,
    initialState
  );

  // MUTATION
  // Authorization Needed
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      console.log(result);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      // name of mutation - BE
      // data.getPosts = [result.data.createPost, ...data.getPosts]; -- ERROR
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = "";
    },
    onError(error) {},
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder='Add post content...'
            name='body'
            value={values.body}
            onChange={handleChange}
            error={error ? true : false}
          />
          <Button type='submit' color='purple'>
            Add Post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likeCount
      likes {
        id
        username
        createdAt
      }
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

// Same with HomePage
const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default PostForm;
