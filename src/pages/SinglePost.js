import React, { useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Grid,
  Image,
  Card,
  Button,
  Label,
  Icon,
  Form,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

const SinglePost = (props) => {
  const { postId } = useParams();

  const { user } = useContext(AuthContext);

  const commentInputRef = useRef();

  // state
  const [commentBody, setCommentBody] = useState("");

  // QUERY
  const { data: { getPost: post } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  // MUTATION
  const [addComment] = useMutation(ADD_COMMENT_MUTATION, {
    variables: {
      postId,
      body: commentBody,
    },
    update() {
      setCommentBody("");
      commentInputRef.current.blur();
    },
    onError() {},
  });

  const deletePostCallback = () => {
    props.history.push("/");
  };

  let postMarkup;
  if (!post) {
    postMarkup = <p>Loading...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = post;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              size='small'
              float='right'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => console.log("comment")}
                >
                  <Button basic color='teal'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='teal' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>

            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Comment...'
                        name='commentBody'
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button purple'
                        disabled={commentBody.trim() === ""}
                        onClick={addComment}
                      >
                        Add Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const ADD_COMMENT_MUTATION = gql`
  mutation addComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      username
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

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
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

export default SinglePost;
