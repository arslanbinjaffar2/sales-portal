export const GeneralAction = {
    alert, errors, redirect, update, auth
};

function errors(errors) {
    return dispatch => {
        dispatch({ type: "errors", errors: errors });
    };
}

function redirect(redirect) {
    return dispatch => {
        dispatch({ type: "redirect", redirect: redirect });
    };
}

function update(update) {
    return dispatch => {
        dispatch({ type: "update", update: update });
    };
}

function auth(user) {
    return dispatch => {
        dispatch({ type: "auth-info", user: user });
    };
}

function alert(type, user) {
    return dispatch => {
        dispatch({ type: type, user: user });
    };
}