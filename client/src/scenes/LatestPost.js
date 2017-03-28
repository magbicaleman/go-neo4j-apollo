import React, { PropTypes } from 'react';
import { gql, graphql } from 'react-apollo';

const LatestPost = ({ data: { loading, error, latestPost }}) => {
  if (loading) {
    return <div>Loading</div>
  } else if (error) {
    return <div>Oh... shit</div>
  } else {
    return (
      <div>
        <h1>Latest Post</h1>
        {latestPost}
      </div>
    )
  }
};

const data = gql`
  query { latestPost }
`;

export default graphql(data)(LatestPost);
