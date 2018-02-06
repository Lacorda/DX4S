/**
 * Created by Administrator on 2016/9/30.
 */
import api from 'utils/api';
import * as types from '../dxConstants/action-types';

export function fetchSeriesDetailFailure() {
  return {
    type: types.FETCH_SERIES_DETAIL_FAILURE,
  };
}

export function fetchSeriesDetailSuccess(info) {
  return {
    type: types.FETCH_SERIES_DETAIL_SUCCESS,
    payload: info,
  };
}

export function fetchSeriesDetail(q) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_SERIES_DETAIL_REQUEST,
    });
    return api({
      method: 'GET',
      url: `/training/plan/${q.plan_id}/solution/${q.solution_id}`,
    })
      .then((res) => {
        dispatch(fetchSeriesDetailSuccess(res.data));
      })
      .catch((err) => {
        dispatch(fetchSeriesDetailFailure(err));
        throw new Error(JSON.stringify(err.response.data));
      });
  };
}

