import api from 'utils/api';
import { NODE_TYPE } from 'dxConstants/dict-type';

import {
  INIT_COURSE,
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_FAILURE,
  FETCH_COURSE_SUCCESS,

  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_FAILURE,
  FETCH_CHAPTER_SUCCESS,

  FETCH_ASSESSMENT_REQUEST,
  FETCH_ASSESSMENT_FAILURE,
  FETCH_ASSESSMENT_SUCCESS,

  FACOR_COURSE_REQUEST,
  FACOR_COURSE_FAILURE,
  FACOR_COURSE_SUCCESS,

  ARRANGE_COURSE_REQUEST,
  ARRANGE_COURSE_FAILURE,
  ARRANGE_COURSE_SUCCESS,
} from '../dxConstants/action-types';

// course

export function initCourse() {
  return dispatch => dispatch({ type: INIT_COURSE });
}

export function fetchCourseFailure(err) {
  return {
    type: FETCH_COURSE_FAILURE,
    err,
  };
}

export function fetchCourseSuccess(info) {
  return {
    type: FETCH_COURSE_SUCCESS,
    info,
  };
}

export function fetchCourse(q) {
  return (dispatch) => {
    dispatch({
      type: FETCH_COURSE_REQUEST,
    });
    return api({
      method: 'GET',
      url: `/training/plan/${q.plan_id}/solution/${q.solution_id}/course/${q.course_id}`,
    })
    .then((res) => {
      res.data.course_info = res.data.course_info.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp;');
      dispatch(fetchCourseSuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchCourseFailure(err.response.data));
      throw new Error(JSON.stringify(err.response.data));
    });
  };
}

// chapters
export function fetchChapterFailure() {
  return {
    type: FETCH_CHAPTER_FAILURE,
  };
}

export function fetchChapterSuccess(chapters, nodes) {
  return {
    type: FETCH_CHAPTER_SUCCESS,
    chapters,
    nodes,
  };
}

export function fetchChapter(q) {
  return (dispatch) => {
    dispatch({
      type: FETCH_CHAPTER_REQUEST,
    });
    return api({
      method: 'GET',
      url: `/training/plan/${q.plan_id}/solution/${q.solution_id}/course/${q.course_id}/chapter`,
    })
    .then((res) => {
      const chapters = [];
      const nodes = {};
      // loop chapters
      res.data.chapters.map((data) => {
        const chapter = {
          id: data.chapter_id,
          name: data.chapter_name,
          nodes: [],
        };
        // loop nodes in chapter
        data.chapter_nodes.map((node) => {
          const nodeId = node.chapter_node_id;
          const pass = NODE_TYPE[node.node_type] === 'doc'
            ? Math.round(node.node_images.imgs.length * 0.8)
            : node.pass_time;
          chapter.nodes.push(nodeId);
          nodes[nodeId] = {
            id: nodeId,
            chapter_id: chapter.id,
            res_id: node.node_id,
            name: node.node_name,
            type: node.node_type,
            done: node.has_read,
            url: node.node_url,
            pass,
          };
          if (node.node_images) {
            const url = [];
            node.node_images.imgs.map((img) => {
              url.push(node.node_images.url + img);
            });
            nodes[nodeId].url = url;
          }
        });
        chapters.push(chapter);
      });
      dispatch(fetchChapterSuccess(chapters, nodes));
    })
    .catch((err) => {
      dispatch(fetchChapterFailure(err));
    });
  };
}

// assement
export function fetchAssementFailure() {
  return {
    type: FETCH_ASSESSMENT_FAILURE,
  };
}

export function fetchAssementSuccess(assessment) {
  return {
    type: FETCH_ASSESSMENT_SUCCESS,
    assessment,
  };
}

export function fetchAssement(q) {
  return (dispatch) => {
    dispatch({
      type: FETCH_ASSESSMENT_REQUEST,
    });
    return api({
      method: 'GET',
      url: `/training/plan/${q.plan_id}/solution/${q.solution_id}/course/${q.course_id}/assessment`,
    })
    .then((res) => {
      dispatch(fetchAssementSuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchAssementFailure(err));
    });
  };
}

// favor
export function favorCourseFailure() {
  return {
    type: FACOR_COURSE_FAILURE,
  };
}

export function favorCourseSuccess(favor) {
  return {
    type: FACOR_COURSE_SUCCESS,
    favor,
  };
}

export function favorCourse(params) {
  return (dispatch) => {
    dispatch({
      type: FACOR_COURSE_REQUEST,
    });
    return api({
      method: 'PUT',
      url: `/training/plan/${params.plan_id}/solution/${params.solution_id}/course/${params.course_id}/favor`,
      data: {
        is_favor: params.is_favor,
      },
    })
    .then((res) => {
      dispatch(favorCourseSuccess(params.is_favor));
    })
    .catch((err) => {
      dispatch(favorCourseFailure(err));
    });
  };
}

// arrange
export function arrangeCourseFailure() {
  return {
    type: ARRANGE_COURSE_FAILURE,
  };
}

export function arrangeCourseSuccess(arrange) {
  return {
    type: ARRANGE_COURSE_SUCCESS,
    arrange,
  };
}

export function arrangeCourse(params) {
  return (dispatch) => {
    dispatch({
      type: ARRANGE_COURSE_REQUEST,
    });
    return api({
      method: 'PUT',
      url: `/training/plan/${params.plan_id}/course/${params.course_id}`,
      data: {
        is_arranged: params.is_arranged,
      },
    })
    .then((res) => {
      dispatch(arrangeCourseSuccess(params.is_arranged));
    })
    .catch((err) => {
      dispatch(arrangeCourseFailure(err));
    });
  };
}
