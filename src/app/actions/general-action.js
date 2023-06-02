export const GeneralAction = {
    alert, errors, redirect, update, auth, updatePaginate, loading
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

function alert(type, alertData) {
    return dispatch => {
        dispatch({ type: type, alert: alertData });
    };
}

function updatePaginate(type, pagination) {
    return {
        type: type, pagination: pagination
    };
}

function loading(loading) {
    return dispatch => {
        dispatch({ type: 'loading', loading: loading });
    };
}