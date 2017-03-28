import React, { PropTypes } from 'react';
import { gql, graphql } from 'react-apollo';
import AddAttendee from './Add';

const Attendees = ({ data }) => {
  const {loading, error, People} = data;
  if (loading) {
    return <div>🤖 Loading</div>
  } else if (error) {
    return <div>🤖 Error!</div>
  } else {
    //data.startPolling(1000);
    const listAttendees = People.map(person =>
      <div key={person.id}>
        {person.name}
      </div>
    )
    return (
      <div>
        <h1>Attendees</h1>
        {listAttendees}
      </div>
    )
  }
};

const data = gql`
  query {
    People {
      id
      name
    }
  }
`;

export default graphql(data)(Attendees);
