import { handleResponse, guestHeader, authHeader } from '@/helpers';
import {LOGIN_ENDPOINT, PASSWORD_REQUEST_ENDPOINT} from '@/constants/endpoints';

export const AuthService = {
    login,
    passwordRequest,
    passwordReset,
    logout,
    autoLogin
};

function login(email, password, logged) {
    const requestBody = {email: email, password: password, remember: logged};
    const requestOptions = {
        method: 'POST',
        headers: guestHeader(),
        body: JSON.stringify(requestBody)
    };

    return fetch(LOGIN_ENDPOINT, requestOptions)
        .then(handleResponse)
        .then(response => {
            if (response.success && !response.data.logged) {
                // store new user details and access-token in local storage to keep user logged in between page refreshes
                localStorage.setItem('agent', JSON.stringify(response.data.agent));
                localStorage.setItem('interface_language_id', response.data.inferface_language_id ? response.data.inferface_language_id : 1 );
            }
            return response;
        });
}

function autoLogin(token) {

    const requestOptions = {
        method: 'GET',
        headers: guestHeader()
    };

    return fetch(`${process.env.REACT_APP_URL}/auth/auto-login/${token}`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.success && !user.logged) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('agent', JSON.stringify(user));
                localStorage.setItem('interface_language_id', user.data.inferface_language_id);
            }
            return user;
        });
}


function passwordRequest(email) {
    const requestOptions = {
        method: 'POST',
        headers: guestHeader(),
        body: JSON.stringify({ email: email })
    };
    return fetch(`${PASSWORD_REQUEST_ENDPOINT}`, requestOptions)
        .then(handleResponse);
}

function passwordReset(email, password, password_confirmation, token) {

    const requestOptions = {
        method: 'POST',
        headers: guestHeader(),
        body: JSON.stringify({ email, password, password_confirmation, token })
    };

    return fetch(`${process.env.REACT_APP_URL}/auth/password/reset`, requestOptions)
        .then(handleResponse);
}

function logout() {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
    };

    return fetch(`${process.env.REACT_APP_URL}/auth/logout`, requestOptions)
        .then(handleResponse)
        .then(response => {
            localStorage.removeItem('agent');
            return response;
        });
}

