import { combineReducers } from 'redux';
// import { alert } from './alert.reducer';
// import { event } from './event.reducer';
// import { events } from './events-reducer';
// import { redirect } from './redirect.reducer';
// import { update } from './update.reducer';
// import { auth } from './auth-reducer';
// import { paginate } from './paginate.reducer';
// import { loading } from './loading.reducer';
import authUser from '../slices/AuthSlice';
import alert from '../slices/AlertSlice';
import events from '../slices/EventsSlice';
import event from '../slices/EventSlice';

const rootReducer = combineReducers({
  alert,  authUser,  event, events
});

export default rootReducer;