import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';
import themeReducer from './reducers/theme';

const middleware = [thunk];

const allReducers = combineReducers({
  authReducer,
  themeReducer,
});

const store = createStore(allReducers, applyMiddleware(...middleware));

export default store;
