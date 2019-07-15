import { combineReducers } from 'redux';
import {
  SELECT_COMPANY, INVALIDATE_DATA,
  REQUEST_DATA, RECEIVE_DATA, RECEIVE_DATA_DETAILS
} from '../actions';

const selectedCompany = (state = 'essence', action) => {
  switch (action.type) {
    case SELECT_COMPANY:
      return action.company;
    default:
      return state;
  }
};

const data = (state = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  details: {}
}, action) => {
  switch (action.type) {
    case INVALIDATE_DATA:
      return {
        ...state,
        didInvalidate: true,
      };
    case REQUEST_DATA:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    case RECEIVE_DATA:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.data,
        lastUpdated: action.receivedAt,
      };
    case RECEIVE_DATA_DETAILS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        details: action.details,
        lastUpdated: action.receivedAt,
      };
    default:
      return state;
  }
};

const dataByCompany = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_DATA:
    case RECEIVE_DATA:
    case RECEIVE_DATA_DETAILS:
    case REQUEST_DATA:
      return {
        ...state,
        [action.company]: data(state[action.company], action),
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  dataByCompany,
  selectedCompany,
});

export default rootReducer;
