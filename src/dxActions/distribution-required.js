import {
  INIT_REQUIRED_DISTRIBUTION,
  FETCH_REQUIRED_COURSE_SUCCESS,
  SELECT_REQUIRED_COURSE,
  UNSELECT_REQUIRED_COURSE,
  PAGINATE_REQUIRED_COURSE_SUCCESS,

  FETCH_COURSE_USER_SUCCESS,
  SELECT_COURSE_USER,
  SELECT_COURSE_USERS,
  UNSELECT_COURSE_USER,
  UNSELECT_COURSE_USERS,
  PAGINATE_COURSE_USER_SUCCESS,

  SELECT_DISTRIBUTION_DEPARTMENT,
  SELECT_DISTRIBUTION_CHILD_DEPARTMENT,

} from '../dxConstants/action-types/distribution';

import * as apis from '../pages/mobile/apis';

async function fetchCourseAndDispatch(params, type, dispatch) {
  const payload = await apis.getCourse(params);
  dispatch({ type, payload });
  return payload;
}

export function fetchRequiredCourse(params) {
  return async function _fetchRequiredCourse(dispatch) {
    return await fetchCourseAndDispatch(params, FETCH_REQUIRED_COURSE_SUCCESS, dispatch);
  };
}

export function appendRequireCourse(params) {
  return async function _append(dispatch) {
    return await fetchCourseAndDispatch(params, PAGINATE_REQUIRED_COURSE_SUCCESS, dispatch);
  };
}

export function selectRequiredCourse(courseId) {
  return dispatch => dispatch({ type: SELECT_REQUIRED_COURSE, payload: courseId });
}

export function unselectRequiredCourse(courseId) {
  return dispatch => dispatch({ type: UNSELECT_REQUIRED_COURSE, payload: courseId });
}

async function fetchUsersThenDispatch(params, type, dispatch) {
  const { users: payload } = await apis.getUsers(params);
  dispatch({ type, payload });
  return payload;
}

export function fetchUsers(params) {
  return async function _fetch(dispatch) {
    return await fetchUsersThenDispatch(params, FETCH_COURSE_USER_SUCCESS, dispatch);
  };
}

export function paginateUser(params) {
  return async function _fetch(dispatch) {
    return await fetchUsersThenDispatch(params, PAGINATE_COURSE_USER_SUCCESS, dispatch);
  };
}

export function selectUser(userId) {
  return dispatch => dispatch({ type: SELECT_COURSE_USER, payload: userId });
}

export function unselectUser(userId) {
  return dispatch => dispatch({ type: UNSELECT_COURSE_USER, payload: userId });
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
    return await fetchDeptAndUserThenDispatch(deptId, SELECT_DISTRIBUTION_DEPARTMENT, dispatch);
  };
}

export function selectChildDepartment(deptId) {
  return async function _selectChildDepartment(dispatch) {
    return await fetchDeptAndUserThenDispatch(
      deptId,
      SELECT_DISTRIBUTION_CHILD_DEPARTMENT,
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
      { dept_id: deptId, recursion, size }, SELECT_COURSE_USERS, dispatch
    );
  };
}

export function unselectUsersByDepartment(deptId, recursion = true) {
  return async function _fetchUserAndUnselect(dispatch) {
    return await fetchUserByDeptAndDispatch(
      { dept_id: deptId, recursion }, UNSELECT_COURSE_USERS, dispatch
    );
  };
}

export function publishPlan(data) {
  return async function _publishPlan() {
    return await apis.publishPlan(data);
  };
}

export function initRequiredDistribution() {
  return dispatch => dispatch({ type: INIT_REQUIRED_DISTRIBUTION });
}
