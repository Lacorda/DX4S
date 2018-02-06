import { createIsolateStorage } from 'utils/storage';
import api from 'utils/api';

import { NODE_TYPE } from 'dxConstants/dict-type';
import {
  // preview
  FETCH_NODE_SUCCESS,
  TURN_TO_NODE,
  PASS_THE_NODE,
  FETCH_DONE_STATUS,
  FETCH_NODE_MEDIA_SUCCESS,
  ENTER_FULL_SCREEN_MODE,
  EXIT_FULL_SCREEN_MODE,
  FETCH_ORDER_STATUS_SUCCESS,
  BLOCK_THE_NODE,
  INIT_PREVIEW,
  FETCH_PROGRESS_RECORD,
  CONTINUE_TO_LEARN,
  // course
  UPDATE_NODE_URL,
} from '../dxConstants/action-types';

import { getNodeDetail } from '../pages/mobile/apis';

let userStorage;
function getUserStorage(getState) {
  if (!userStorage) {
    const state = getState();
    const id = state.account.user.id.user;
    userStorage = createIsolateStorage(id);
  }
  return userStorage;
}

export function initPreview() {
  return dispatch => dispatch({ type: INIT_PREVIEW });
}

export function fetchCourseOrderStatus({ plan_id, solution_id, course_id }) {
  return async function fetchAndDispatchCourseOrderStatus(dispatch) {
    // eslint-disable-next-line camelcase
    const res = await api(`training/plan/${plan_id}/solution/${solution_id}/course/${course_id}`);
    const { is_order: isOrdered } = res.data;
    dispatch({
      type: FETCH_ORDER_STATUS_SUCCESS,
      payload: isOrdered,
    });
    return res.data;
  };
}

async function updateNodeUrl(nodes, { planId, solutionId, courseId, nodeId }, dispatch) {
  const nextNode = nodes[nodeId];
  const nodeType = NODE_TYPE[nextNode.type];
  if (nodeType === 'doc' || nodeType === 'img') {
    const node = await getNodeDetail({ planId, solutionId, courseId, nodeId });
    let url = node.node_url;
    if (nodeType === 'doc') {
      const image = node.node_images;
      const baseUrl = image.url;
      url = image.imgs.map(img => baseUrl + img);
    }
    dispatch({ type: UPDATE_NODE_URL, payload: { nodeId, url } });
  }
}

export function turnToNode(planIdOrNodeId, seriesId, courseId, nodeId) {
  return async function fetchNodeUrlAndTurning(dispatch, getState) {
    const { course, preview } = getState();
    const nodes = course.nodes;
    const { plan_id, solution_id, course_id } = preview;
    /* eslint-disable camelcase */
    await updateNodeUrl(nodes, {
      planId: plan_id || planIdOrNodeId,
      solutionId: solution_id || seriesId,
      courseId: course_id || courseId,
      nodeId: nodeId || planIdOrNodeId,
    }, dispatch);
    /* eslint-enable */
    let payload;
    let type;
    if (!nodeId) {
      type = TURN_TO_NODE;
      payload = planIdOrNodeId;
    } else {
      type = FETCH_NODE_SUCCESS;
      payload = {
        plan_id: planIdOrNodeId,
        solution_id: seriesId,
        course_id: courseId,
        node_id: nodeId,
      };
    }
    dispatch({ type, payload });
  };
}

export function turnToNextNode() {
  return async function _turnToNextNode(dispatch, getState) {
    const { course, preview } = getState();
    const currentNodeId = preview.node_id;
    const nodes = course.nodes;
    const nodeIds = Object.keys(nodes);
    let nextNodeId;
    if (!currentNodeId) nextNodeId = nodeIds[0];
    else {
      const currentNodeIndex = nodeIds.findIndex(id => +id === +currentNodeId);
      nextNodeId = nodeIds[currentNodeIndex + 1];
    }
    const { plan_id: planId, solution_id: solutionId, course_id: courseId } = preview;
    await updateNodeUrl(nodes, { planId, solutionId, courseId, nodeId: nextNodeId }, dispatch);
    return dispatch({ type: TURN_TO_NODE, payload: nextNodeId });
  };
}

export function turnToPrevNode() {
  return async function _turnToPrevNode(dispatch, getState) {
    const { course, preview } = getState();
    const currentNodeId = preview.node_id;
    if (!currentNodeId) return null; // 初始化的节点

    const nodes = course.nodes;
    const nodeIds = Object.keys(nodes);
    const currentNodeIndex = nodeIds.findIndex(id => +id === +currentNodeId);
    if (currentNodeIndex <= 0) return null; // 处于第一个节点时无法转跳至上一个节点

    const prevNodeId = nodeIds[currentNodeIndex - 1];
    const { plan_id: planId, solution_id: solutionId, course_id: courseId } = preview;
    await updateNodeUrl(nodes, { planId, solutionId, courseId, nodeId: prevNodeId }, dispatch);
    return dispatch({ type: TURN_TO_NODE, payload: prevNodeId });
  };
}

/**
 * pass当前的节点
 */
export function passTheNode(id) {
  return async function hasReadAndDispatch(dispatch, getState) {
    /* eslint-disable camelcase */
    const state = getState();
    const { plan_id, solution_id, course_id, node_id } = state.preview;
    const url = `/training/plan/${plan_id}/solution/${solution_id}/course/${course_id}/chapter-node/${node_id}`;
    await api({ url, method: 'PUT' });
    dispatch({ type: PASS_THE_NODE, payload: id || node_id });
  };
}

export function blockTheNode(id) {
  return (dispatch, getState) => {
    const { node_id } = getState().preview;
    dispatch({ type: BLOCK_THE_NODE, payload: id || node_id });
  };
  /* eslint-enable */
}

export function fetchDoneStatus() {
  return (dispatch, getState) => {
    const { course } = getState();
    const toPassedNodes = (passedNodes, id) => {
      // 不是按照顺序的课程那么就当所有的节点都通过了
      const isNodePassed = !!course.nodes[id].done;
      return ({ ...passedNodes, [id]: isNodePassed });
    };
    dispatch({
      type: FETCH_DONE_STATUS,
      payload: Object.keys(course.nodes).reduce(toPassedNodes, {}),
    });
  };
}

export function setHasRead() {
  return (dispatch, getState) => {
    const { preview } = getState();
    return api({
      method: 'PUT',
      url: `/training/plan/${preview.plan_id}/solution/${preview.solution_id || 0}/course/${preview.course_id}/chapter-node/${preview.node_id}`,
      data: { has_read: true },
    }).then(() => {
      dispatch({ type: PASS_THE_NODE, payload: preview.node_id });
    }).catch((err) => {
      throw err;
    });
  };
}

export function enterFullScreenMode() {
  return dispatch => dispatch({ type: ENTER_FULL_SCREEN_MODE });
}

export function exitFullScreenMode() {
  return dispatch => dispatch({ type: EXIT_FULL_SCREEN_MODE });
}

export function fetchMediaResource(id) {
  return async function fetchAndDispatchMediaResource(dispatch, getState) {
    const { preview } = getState();
    const nodeId = preview.node_id;

    const { plan_id: planId, solution_id: solutionId, course_id: courseId } = preview;
    const data = await getNodeDetail({ planId, solutionId, courseId, nodeId: id || nodeId });
    const resourceUrl = data.node_url;
    const passLine = data.pass_time;
    const breakPoints = data.practice_pages.map(point => ({
      id: point.examination_paper.id,
      name: point.examination_paper.name,
      time: point.exercise_point,
    }), []);

    dispatch({
      type: FETCH_NODE_MEDIA_SUCCESS,
      payload: {
        resource_url: resourceUrl,
        break_points: breakPoints,
        pass_time: passLine,
      },
    });
  };
}

export function fetchHistory(courseId) {
  return function _fetchHistory(dispatch, getState) {
    const storage = getUserStorage(getState);
    const history = storage.get(courseId);
    if (history) {
      const { node_id: nodeId, elapse } = history;
      dispatch({ type: FETCH_PROGRESS_RECORD, payload: { nodeId, elapse } });
    }
  };
}

export function recordToHistory(elapse = 0) {
  return function _recordToHistory(dispatch, getState) {
    const state = getState();
    const { node_id, course_id } = state.preview;
    const storage = getUserStorage(getState);
    storage.set(course_id, { node_id, elapse });
  };
}

export function continueToLearn() {
  return function _continueToLearn(dispatch) {
    dispatch({ type: CONTINUE_TO_LEARN });
  };
}
