import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Button, Image, Popup } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);

  const {
    id,
    body,
    username,
    createdAt,
    likeCount,
    commentCount,
    likes,
  } = post;

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <Popup
          inverted
          content='Comment on post'
          trigger={
            <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
              <Button color='teal' basic>
                <Icon name='comments' />
              </Button>
              <Label basic color='teal' pointing='left'>
                {commentCount}
              </Label>
            </Button>
          }
        />

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
