export const APPLICATION_ACTIONS = {
  GET_REQUEST: "APPLICATION_GET_REQUEST",
  GET_SUCCESS: "APPLICATION_GET_SUCCESS",
  GET_FAILURE: "APPLICATION_GET_FAILURE",

  CREATE_REQUEST: "APPLICATION_CREATE_REQUEST",
  CREATE_SUCCESS: "APPLICATION_CREATE_SUCCESS",
  CREATE_FAILURE: "APPLICATION_CREATE_FAILURE",

  UPDATE_REQUEST: "APPLICATION_UPDATE_REQUEST",
  UPDATE_SUCCESS: "APPLICATION_UPDATE_SUCCESS",
  UPDATE_FAILURE: "APPLICATION_UPDATE_FAILURE",

  DELETE_REQUEST: "APPLICATION_DELETE_REQUEST",
  DELETE_SUCCESS: "APPLICATION_DELETE_SUCCESS",
  DELETE_FAILURE: "APPLICATION_DELETE_FAILURE",
};


export const getApplicationsRequest = (params = {}) => ({
  type: APPLICATION_ACTIONS.GET_REQUEST,
  payload: params,
});


export const getApplicationsSuccess = (data) => ({
  type: APPLICATION_ACTIONS.GET_SUCCESS,
  payload: data,
});


export const getApplicationsFailure = (error) => ({
  type: APPLICATION_ACTIONS.GET_FAILURE,
  payload: error,
});


export const createApplicationRequest = (data) => ({
  type: APPLICATION_ACTIONS.CREATE_REQUEST,
  payload: data,
});


export const createApplicationSuccess = (data) => ({
  type: APPLICATION_ACTIONS.CREATE_SUCCESS,
  payload: data,
});


export const createApplicationFailure = (error) => ({
  type: APPLICATION_ACTIONS.CREATE_FAILURE,
  payload: error,
});


export const updateApplicationRequest = (id, data) => ({
  type: APPLICATION_ACTIONS.UPDATE_REQUEST,
  payload: {
    id,
    data,
  },
});


export const updateApplicationSuccess = (data) => ({
  type: APPLICATION_ACTIONS.UPDATE_SUCCESS,
  payload: data,
});


export const updateApplicationFailure = (error) => ({
  type: APPLICATION_ACTIONS.UPDATE_FAILURE,
  payload: error,
});


export const deleteApplicationRequest = (id) => ({
  type: APPLICATION_ACTIONS.DELETE_REQUEST,
  payload: id,
});


export const deleteApplicationSuccess = (data) => ({
  type: APPLICATION_ACTIONS.DELETE_SUCCESS,
  payload: data,
});


export const deleteApplicationFailure = (error) => ({
  type: APPLICATION_ACTIONS.DELETE_FAILURE,
  payload: error,
});