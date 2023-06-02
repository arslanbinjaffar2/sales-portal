const emptyInitialState = {
    path: "",
    first_page_url: "",
    last_page_url: "",
    current_page_url: "",
    previous_page_url: "",
    next_page_url: "",
    current_page: 1,
    total_records: 0,
    per_page: 100,
    current_page_records: 0,
    next_page: 0,
    total_pages: 0
}

let pagination =
    typeof window !== "undefined" && localStorage.getItem("pagination");
const initialState =
    pagination && true ? JSON.parse(pagination) : emptyInitialState;

export function paginate(state = initialState, action) {
    switch (action.type) {
        case "pagination":
            if (action.pagination) {
                localStorage.setItem('pagination', JSON.stringify(action.pagination));
                return action.pagination;
            } else {
                return {};
            }
        default:
            return state
    }
}