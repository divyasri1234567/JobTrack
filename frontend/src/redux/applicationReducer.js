import { APPLICATION_ACTIONS } from "./applicationActions";

const initialState = {
  applications: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: "",
  message: "",
};

const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPLICATION_ACTIONS.GET_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case APPLICATION_ACTIONS.GET_SUCCESS:
      return {
        ...state,
        applications: action.payload.response?.data || [],
        count: action.payload.response?.count || 0,
        next: action.payload.response?.next || null,
        previous: action.payload.response?.previous || null,
        loading: false,
        error: "",
      };

    case APPLICATION_ACTIONS.GET_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          action.payload?.message ||
          "Unable to load applications.",
      };

    case APPLICATION_ACTIONS.CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        message: "",
      };

    case APPLICATION_ACTIONS.CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };

    case APPLICATION_ACTIONS.CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          action.payload?.message ||
          "Unable to add application.",
      };

    case APPLICATION_ACTIONS.UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        message: "",
      };

    case APPLICATION_ACTIONS.UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };

    case APPLICATION_ACTIONS.UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          action.payload?.message ||
          "Unable to update application.",
      };

    case APPLICATION_ACTIONS.DELETE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        message: "",
      };

    case APPLICATION_ACTIONS.DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };

    case APPLICATION_ACTIONS.DELETE_FAILURE:
      return {
        ...state,
        loading: false,
        error:
          action.payload?.message ||
          "Unable to delete application.",
      };

    default:
      return state;
  }
};

export default applicationReducer;