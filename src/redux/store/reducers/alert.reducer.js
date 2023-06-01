const initialState = {
  class: '',
  message: '',
  title: '',
  redirect: '',
  logged: false,
  success: false
}

export function alert(state = initialState, action) {
  switch (action.type) {
    case "request":
      return {
        type: 'request',
      };
    case "success":
      return {
        class: 'alert-success',
        message: action.message,
        title: action.title,
        redirect: action.redirect,
        logged: action.logged,
        success: true,
      };
    case "error":
      return {
        class: 'alert-danger',
        message: action.message,
        title: action.title
      };
    case "alert-clear":
      return {
        redirect: action.redirect,
      };
    default:
      return state
  }
}