let tokenInfo = localStorage.getItem('accessToken');
const initialState = (tokenInfo && tokenInfo !== undefined ? JSON.parse(tokenInfo) : {});

export function auth(state = initialState, action) {
    switch (action.type) {
        case "bearer-token":
            if (action.accessToken) {
                localStorage.setItem('accessToken', JSON.stringify(action.accessToken));
                return action.accessToken;
            } else {
                return '';
            }
        default:
            return state;
    }
}