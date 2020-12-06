import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import MyPopup from "../utils/MyPopup";

const LikeButton = ({ post: { id, likes, likeCount }, user }) => {
  // state: liked or not like
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  // MUTATION
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  // Dynamic LikeBtn -> like or not like
  const likeBtn = user ? (
    liked ? (
      <Button color='purple'>
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='purple' basic>
        <Icon name='heart' />
      </Button>
    )
  ) : (
    <Button as={Link} to='/login' color='purple' basic>
      <Icon name='heart' />
    </Button>
  );

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      <MyPopup content={liked ? "Unlike" : "Like"}>{likeBtn}</MyPopup>

      <Label basic color='purple' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likeCount
      likes {
        id
        username
      }
    }
  }
`;

export default LikeButton;
