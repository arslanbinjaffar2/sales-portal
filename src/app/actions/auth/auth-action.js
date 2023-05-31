import { AuthService } from '@/app/services/auth/auth-service';
import { store } from '@/redux/store/store';
import { GeneralAction } from '@/app/actions/general-action';

export const AuthAction = {
    login,
    logout,
    passwordRequest,
    passwordReset,
    autoLogin
};

function login(email, password, logged = false) {
    return dispatch => {
        AuthService.login(email, password, logged)
            .then(
                response => {
                    if (response.success) {
                        dispatch({ type: "success", redirect: "/manage/events", message: response.message, logged: response.data.logged ? response.data.logged : false });
                        if (response && response.data && response.data.agent) {
                            dispatch(GeneralAction.auth(response.data.agent));
                        }
                    } else {
                        dispatch(failure(response.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };
}

function autoLogin(token) {
    return dispatch => {
        dispatch(request({ token }));
        AuthService.autoLogin(token)
            .then(
                response => {
                    if (response.success) {
                        dispatch(success(response));
                        if (response && response.data && response.data.user) dispatch(GeneralAction.auth(response));
                    } else {
                        dispatch(failure(response.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };
}

function passwordRequest(email) {
    return dispatch => {
        dispatch(request({ email }));
        AuthService.passwordRequest(email)
            .then(
                response => {
                    if (response.success) {
                        dispatch({ type: "success", "redirect": "/reset-password", "message": response.message });
                    } else {
                        dispatch(failure(response.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };
}

function passwordReset(email, password, password_confirmation, token) {
    return dispatch => {
        dispatch(request({ email }));
        AuthService.passwordReset(email, password, password_confirmation, token)
            .then(
                response => {
                    if (response.success) {
                        dispatch({ type: "success", "redirect": "/login", "message": response.message });
                    } else {
                        dispatch(failure(response.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };
}

function logout() {
    AuthService.logout().then(
        response => {
            if (response.success) {
                store.dispatch(success(response));
            }
        },
        error => {
            store.dispatch(failure(error));
        }
    );
}

function request(response) { return { type: "request", response } }

function success(response) { return { type: "success", "redirect": response.redirect, "message": response.message, "logged": (response.logged ? response.logged : false) } }

function failure(message) { return { type: "error", message } }



