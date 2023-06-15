export function authHeader(method = 'POST') {
    // return authorization header with jwt token
    // let user = JSON.parse(localStorage.getItem('agent'));
    // if (user && user.access_token) {
    //     let event_id = JSON.parse(localStorage.getItem('event_id'));
    //     let language_id = JSON.parse(localStorage.getItem('language_id'));
    //     let interface_language_id = JSON.parse(localStorage.getItem('interface_language_id'));
    //     if (method === 'PUT' || method === 'DELETE')
    //         return { 'Authorization': 'Bearer ' + user.access_token, 'Accept': 'application/json', 'Content-Type': 'application/json', 'Event-Id': event_id, 'Language-Id': (language_id ? language_id : 1), 'Interface-Language-Id': interface_language_id };
    //     else
    //         return { 'Authorization': 'Bearer ' + user.access_token, 'Accept': 'application/json', 'Event-Id': event_id, 'Language-Id': (language_id ? language_id : 1), 'Interface-Language-Id': interface_language_id };
    //
    // } else {
    //     return {};
    // }

    let user =
        typeof window !== "undefined" && JSON.parse(localStorage.getItem('agent'));
    user = (user && true) ? user : {};

    if (user && user.access_token) {
        if (method === 'PUT' || method === 'DELETE')
            return { 'Authorization': 'Bearer ' + user.access_token, 'Accept': 'application/json', 'Content-Type': 'application/json' };
        else
            return { 'Authorization': 'Bearer ' + user.access_token, 'Accept': 'application/json', 'Content-Type': 'application/json' };
    } else {
        return {};
    }
}