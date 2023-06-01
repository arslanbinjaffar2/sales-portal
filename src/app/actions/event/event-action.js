export const EventAction = {
    eventInfo, eventsInfo, eventState
};

function eventInfo(event) {
    return dispatch => {
        dispatch({ type: "event-info", event: event });
    };
}

function eventsInfo(events) {
    return dispatch => {
        dispatch({ type: "events-info", events: events });
    };
}

function eventState(eventState = {}) {
    return dispatch => {
        dispatch({ type: "event-state", eventState: eventState });
    };
}
