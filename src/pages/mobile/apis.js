import api from 'utils/api';

const PAGINATE_PARAMS = {
  index: 1,
  size: 10,
};

function preHandle(evolve, fn) {
  const ownProp = Object.prototype.hasOwnProperty;
  return function transform(config) {
    const params = config.params || {};
    const evolvedParams = Object
      .keys(evolve)
      .filter(key => ownProp.call(params, key))
      .reduce((param, key) => Object.assign(param, { [key]: evolve[key](params[key]) }), {});
    const transformedParams = Object.assign({}, params, evolvedParams);
    return fn(Object.assign({}, config, { params: transformedParams }));
  };
}

const trimName = { name(str) { return (str && str.trim()) || ''; } };

export const get = preHandle(trimName, async function get(config) {
  const res = await api(config);
  return res.data;
});

/**
 * 获取节点详情
 * @return {*}
 */
export async function getNodeDetail({ planId, solutionId, courseId, nodeId }) {
  const res = await api.get(`/training/plan/${planId}/solution/${solutionId}/course/${courseId}/node/${nodeId}`);
  return res.data;
}

export async function getPlans(param) {
  const params = { ...PAGINATE_PARAMS, ...param };
  return (await get({
    url: '/training/training-plan/list',
    params,
  })).items;
}

/**
 * 获取课程
 * @return {[*]}
 */
export async function getCourse(param = {}) {
  const params = { ...PAGINATE_PARAMS, ...param };
  const data = await get({
    url: '/training/course/reference/list',
    params,
  });
  return data.courses;
}

export async function getUsers(param = {}) {
  const params = { ...PAGINATE_PARAMS, size: 100, recursion: false, ...param };
  const data = await get({
    url: '/training/user/reference/list',
    params,
  });
  return data;
}

/**
 * 获取部门
 * @param params
 * @return {*}
 */
export async function getDepartments(params = {}) {
  const data = await get({
    url: '/training/dept/reference/list',
    params,
  });
  return data;
}

export async function publishPlan(data) {
  return await api({
    method: 'POST',
    url: '/training/training-plan/publish',
    data,
  });
}

export async function publishLive(data) {
  return await api({
    method: 'POST',
    url: '/training/training-plan/live/publish',
    data,
  });
}

export function getLive(liveId) {
  return get({
    url: `/mall/products/${liveId}`,
  });
}

export function getTrainingLive(liveId) {
  return get({ url: `/training/live/${liveId}` });
}

export function getMyLiveListByType(type, params = {}) {
  return get({
    url: `/training/lives?type=${type}`,
    params: { ...PAGINATE_PARAMS, ...params },
  });
}

export async function getLives(params = {}) {
  const { courses } = await get({
    url: '/training/course/reference/live/list',
    params: { ...PAGINATE_PARAMS, ...params },
  });
  return courses;
}

export function getLiveSubscriptionSMSCode(phone) {
  return get({
    url: '/training/live/notification/code',
    params: { phone },
  });
}

export function verifySMSCodeLiveSubscribed({ code, liveId: courseId, phone }) {
  return api({
    method: 'POST',
    url: '/training/live/notification',
    data: { courseId, code, phone },
  });
}

export function getMallLiveListByStatus(status, params = {}) {
  return get({
    url: `mall/products?type=live&live_status=${status}`,
    params: { ...PAGINATE_PARAMS, ...params },
  });
}
