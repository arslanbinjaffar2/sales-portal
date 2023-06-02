import { authHeader, handleResponse } from '../../helpers';
import { AGENT_EVENTS_ENDPOINT } from '../../constants/endpoints';

export const EventService = {
    listing
};

function listing(request_data, page) {
    const form = new FormData();
    form.append('search_text', request_data.search_text);
    form.append('sort_by', request_data.sort_by);
    form.append('event_action', request_data.event_action);
    const requestOptions = {
        method: "POST",
        headers: authHeader(),
        body: form
    };
    return fetch(`${AGENT_EVENTS_ENDPOINT}?page=${page}`, requestOptions).
    then(handleResponse)
        .then(data => data);
}