/* eslint-disable arrow-parens */
import * as ACTIONS from 'dxConstants/action-types/distribution';
import * as apis from '../pages/mobile/apis';

export function initLiveDistribution() {
  return dispatch => dispatch({ type: ACTIONS.INIT_LIVE_DISTRIBUTION });
}

export function fetchDistributionLivesAndDispatch(params, type) {
  return async(dispatch) => {
    const lives = await apis.getLives(params);
    dispatch({ type, payload: lives });
    return lives;
  };
}

export function fetchDistributionLives(params) {
  return fetchDistributionLivesAndDispatch(params, ACTIONS.FETCH_DISTRIBUTION_LIVE_SUCCESS);
}

export function appendDistributionLive(params) {
  return fetchDistributionLivesAndDispatch(params, ACTIONS.PAGINATE_DISTRIBUTION_LIVE_SUCCESS);
}

export function selectDistributionLive(id) {
  return dispatch => dispatch({ type: ACTIONS.SELECT_DISTRIBUTION_LIVE, payload: id });
}

export function unselectDistributionLive() {
  return dispatch => dispatch({ type: ACTIONS.UNSELECT_DISTRIBUTION_LIVE });
}

async function fetchUsersThenDispatch(params, type, dispatch) {
  const { users: payload } = await apis.getUsers(params);
  dispatch({ type, payload });
  return payload;
}

export function fetchUsers(params) {
  return async function _fetch(dispatch) {
    return await fetchUsersThenDispatch(params, ACTIONS.FETCH_LIVE_USER_SUCCESS, dispatch);
  };
}

export function paginateUser(params) {
  return async function _fetch(dispatch) {
    return await fetchUsersThenDispatch(params, ACTIONS.PAGINATE_LIVE_USER_SUCCESS, dispatch);
  };
}

export function selectUser(userId) {
  return dispatch => dispatch({ type: ACTIONS.SELECT_LIVE_USER, payload: userId });
}

export function unselectUser(userId) {
  return dispatch => dispatch({ type: ACTIONS.UNSELECT_LIVE_USER, payload: userId });
}

async function fetchDeptAndUserThenDispatch(departmentId, type, dispatch) {
  const [deptData, userData] = await Promise.all([
    apis.getDepartments({ dept_id: departmentId }),
    apis.getUsers({ dept_id: departmentId, recursion: false }),
  ]);
  const { users, total_num: totalUsers } = userData;
  const { child_depts: childDepartments } = deptData;
  dispatch({
    type,
    payload: { department: deptData, users, childDepartments, totalUsers },
  });
  return { department: deptData, users };
}

export function selectDepartment(deptId) {
  return async function _fetchDepartmentAndUsers(dispatch) {
    return await fetchDeptAndUserThenDispatch(
      deptId,
      ACTIONS.SELECT_LIVE_DISTRIBUTION_DEPARTMENT,
      dispatch
    );
  };
}

export function selectChildDepartment(deptId) {
  return async function _selectChildDepartment(dispatch) {
    return await fetchDeptAndUserThenDispatch(
      deptId,
      ACTIONS.SELECT_LIVE_DISTRIBUTION_CHILD_DEPARTMENT,
      dispatch
    );
  };
}

async function fetchUserAndDispatch(param, type, dispatch) {
  const params = Object.assign({ recursion: true }, param);
  if (!params.recursion) Object.assign(params, { size: 9999 });
  const { users } = await apis.getUsers(params);
  dispatch({
    type,
    payload: { users, dept_id: params.dept_id },
  });
  return users;
}

// eslint-disable-next-line camelcase
async function fetchUserByDeptAndDispatch(params, type, dispatch) {
  return await fetchUserAndDispatch(params, type, dispatch);
}

export function selectUsersByDepartment(deptId, recursion = true) {
  return async function _fetchUserAndSelect(dispatch) {
    // TODO BUG 9999 is not releay recursion
    // TODO rename SELECT_COURSE_USERS
    const size = recursion ? 9999 : 100;
    return await fetchUserByDeptAndDispatch(
      { dept_id: deptId, recursion, size }, ACTIONS.SELECT_LIVE_USERS, dispatch
    );
  };
}

export function unselectUsersByDepartment(deptId, recursion = true) {
  return async function _fetchUserAndUnselect(dispatch) {
    return await fetchUserByDeptAndDispatch(
      { dept_id: deptId, recursion }, ACTIONS.UNSELECT_LIVE_USERS, dispatch
    );
  };
}

export function publishPlan(data) {
  return function _publishPlan() {
    return apis.publishLive(data);
  };
}
