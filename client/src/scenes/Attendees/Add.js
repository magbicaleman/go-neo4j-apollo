import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom'

class AddAttendee extends Component {
  onSubmit(e) {
    e.preventDefault();
    const self = e.target;
    const { mutate, history } = this.props;
    const { attendeeName: { value } } = self

    if (value !== undefined && value !== '') {
      mutate({ variables: { name: value } })
        .then(({ data }) => {
          self.attendeeName.value = '';
          history.replace('/')
        })
        .catch(error => console.log(error))
    }
  }
  render() {
    return <div>
      <h1>Add Attendee</h1>
      <form method="post" onSubmit={this.onSubmit.bind(this)}>
        <div>
          <input type="text" name="attendeeName"/>
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  }
}

const mutation = gql`
  mutation ($name: String!) {
    createPerson(name: $name) {
      id
      name
      from
    }
  }
`;

export default graphql(mutation)(withRouter(AddAttendee));
