import { from, of } from "rxjs";
import { catchError, concatMap, mergeMap } from "rxjs/operators";
import { ofType } from "redux-observable";

import api from "../api/api";
import API_URLS from "../constants/apiUrls";

import {
  APPLICATION_ACTIONS,
  getApplicationsRequest,
  getApplicationsSuccess,
  getApplicationsFailure,
  createApplicationSuccess,
  createApplicationFailure,
  updateApplicationSuccess,
  updateApplicationFailure,
  deleteApplicationSuccess,
  deleteApplicationFailure,
} from "./applicationActions";


const getApplications = (action$) =>
  action$.pipe(
    ofType(APPLICATION_ACTIONS.GET_REQUEST),

    mergeMap(({ payload }) =>
      from(
        api.get(
          API_URLS.applications.list,
          {
            params: payload,
          }
        )
      ).pipe(
        concatMap((response) =>
          of(
            getApplicationsSuccess(response.data)
          )
        ),

        catchError((error) =>
          of(
            getApplicationsFailure(
              error.response?.data
            )
          )
        )
      )
    )
  );


const createApplication = (action$) =>
  action$.pipe(
    ofType(APPLICATION_ACTIONS.CREATE_REQUEST),

    mergeMap(({ payload }) =>
      from(
        api.post(
          API_URLS.applications.list,
          payload
        )
      ).pipe(
        concatMap((response) =>
          of(
            createApplicationSuccess(response.data),
            getApplicationsRequest()
          )
        ),

        catchError((error) =>
          of(
            createApplicationFailure(
              error.response?.data
            )
          )
        )
      )
    )
  );


const updateApplication = (action$) =>
  action$.pipe(
    ofType(APPLICATION_ACTIONS.UPDATE_REQUEST),

    mergeMap(({ payload: { id, data } }) =>
      from(
        api.put(
          API_URLS.applications.detail(id),
          data
        )
      ).pipe(
        concatMap((response) =>
          of(
            updateApplicationSuccess(response.data),
            getApplicationsRequest()
          )
        ),

        catchError((error) =>
          of(
            updateApplicationFailure(
              error.response?.data
            )
          )
        )
      )
    )
  );


const deleteApplication = (action$) =>
  action$.pipe(
    ofType(APPLICATION_ACTIONS.DELETE_REQUEST),

    mergeMap(({ payload: id }) =>
      from(
        api.delete(
          API_URLS.applications.detail(id)
        )
      ).pipe(
        concatMap((response) =>
          of(
            deleteApplicationSuccess(response.data),
            getApplicationsRequest()
          )
        ),

        catchError((error) =>
          of(
            deleteApplicationFailure(
              error.response?.data
            )
          )
        )
      )
    )
  );


export default [
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
];