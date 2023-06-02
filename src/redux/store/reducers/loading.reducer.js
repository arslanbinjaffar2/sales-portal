export function loading(state = false, action) {
    switch (action.type) {
        case "loading":
            return action.loading;
        default:
            return state;
    }
}