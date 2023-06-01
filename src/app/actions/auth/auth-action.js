import { AuthService } from '@/app/services/auth/auth-service';
import { store } from '@/redux/store/store';
import { GeneralAction } from '@/app/actions/general-action';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";

export const AuthAction = {
    login,
    logout,
    passwordRequest,
    passwordReset,
    autoLogin
};


function login(email, password, logged = false) {
    return (dispatch) => {
        AuthService.login(email, password, logged)
            .then(
                response => {
                    if (response.success) {
                        store.dispatch({ type: "success", redirect: "/manage/events", message: response.message, logged: response.data.logged ? response.data.logged : false });
                        if (response && response.data && response.data.agent) {
                            store.dispatch(GeneralAction.auth(response.data.agent));
                        }
                        store.dispatch(GeneralAction.redirect(true));
                    } else {
                        store.dispatch(failure(response.message));
                    }
                },
                error => {
                    store.dispatch(failure(error));
                }
            );
    };
}

// function login(email, password, logged = false) {
//     return (dispatch) => {
//         AuthService.login(email, password, logged)
//             .then(
//                 response => {
//                     if (response.success) {
//                         store.dispatch({ type: "success", redirect: "/manage/events", message: response.message, title: response.title, logged: response.data.logged ? response.data.logged : false });
//                         if (response && response.data && response.data.agent) {
//                             store.dispatch(GeneralAction.auth(response.data.agent));
//                         }
//                         store.dispatch(GeneralAction.redirect(true));
//                     } else {
//                         store.dispatch(failure(response.message));
//                     }
//                 },
//                 error => {
//                     store.dispatch(failure(error));
//                 }
//             );
//     };
// }

function autoLogin(token) {
    return dispatch => {
        store.dispatch(request({ token }));
        AuthService.autoLogin(token)
            .then(
                response => {
                    if (response.success) {
                        store.dispatch(success(response));
                        if (response && response.data && response.data.user) dispatch(GeneralAction.auth(response));
                    } else {
                        store.dispatch(failure(response.message));
                    }
                },
                error => {
                    store.dispatch(failure(error));
                }
            );
    };
}

function passwordRequest(email) {
    return dispatch => {
        store.dispatch(request({ email }));
        AuthService.passwordRequest(email)
            .then(
                response => {
                    if (response.success) {
                        store.dispatch({ type: "success", "redirect": "/reset-password", "message": response.message });
                    } else {
                        store.dispatch(failure(response.message));
                    }
                },
                error => {
                    store.dispatch(failure(error));
                }
            );
    };
}

function passwordReset(email, password, password_confirmation, token) {
    return dispatch => {
        store.dispatch(request({ email }));
        AuthService.passwordReset(email, password, password_confirmation, token)
            .then(
                response => {
                    if (response.success) {
                        store.dispatch({ type: "success", "redirect": "/login", "message": response.message });
                    } else {
                        store.dispatch(failure(response.message));
                    }
                },
                error => {
                    store.dispatch(failure(error));
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



