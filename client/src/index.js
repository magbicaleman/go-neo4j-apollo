import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';

import App from './App';
import './index.css';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:9000/graphql'
  }),
  dataIdFromObject: o => o.id,
});

// const store = createStore(
//   combineReducers({
//     apollo: client.reducer()
//   }),
//   {},
//   compose(
//     applyMiddleware(client.middleware()),
//       // If you are using the devToolsExtension, you can add it here also
//       (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined')
//         ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
//   )
// );

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
