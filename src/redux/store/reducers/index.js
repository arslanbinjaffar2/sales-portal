import { combineReducers } from 'redux';
import { alert } from './alert.reducer';
import { event } from './event.reducer';
import { events } from './events-reducer';
import { redirect } from './redirect.reducer';
import { update } from './update.reducer';
import { auth } from './auth-reducer';
import { paginate } from './paginate.reducer';
import { loading } from './loading.reducer';

const rootReducer = combineReducers({
  alert, event, events, redirect, update, auth, paginate, loading
});

export default rootReducer;