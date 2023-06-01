const eventsInfo =
    typeof window !== "undefined" && localStorage.getItem("events");
const initialState =
    (eventsInfo && eventsInfo.length > 0) ? JSON.parse(eventsInfo) : [];

export function events(state = initialState, action) {
    switch (action.type) {
        case "events-info":
            if (action.events.length > 0) {
                localStorage.setItem('events', JSON.stringify(action.events));
                return action.events;
            } else {
                return [];
            }
        default:
            return state;
    }
}