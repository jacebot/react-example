import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers';
import App from './containers/App';

// Using redux/thunk, but maybe should refactor to use Sagas
const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true,
  }));
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
