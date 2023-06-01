// let authInfo = localStorage.getItem('agent');
// const initialState = (authInfo && authInfo !== undefined ? JSON.parse(authInfo) : {});

let authInfo =
    typeof window !== "undefined" && localStorage.getItem("agent");
const initialState =
    authInfo && authInfo !== undefined ? JSON.parse(authInfo) : {};

export function auth(state = initialState, action) {
    switch (action.type) {
        case "auth-info":
            if (action.user) {
                localStorage.setItem('agent', JSON.stringify(action.user));
                return action.user;
            } else {
                return {};
            }
        default:
            return state;
    }
}