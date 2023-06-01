import { combineReducers } from 'redux';
import { alert } from './alert.reducer';
import { event } from './event.reducer';
import { events } from './events-reducer';
import { redirect } from './redirect.reducer';
import { update } from './update.reducer';
import { auth } from './auth-reducer';

const rootReducer = combineReducers({
  alert, event, events, redirect, update, auth
});

export default rootReducer;