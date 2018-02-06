import * as ACTIONS from 'dxConstants/action-types/live';

const initState = {
  id: 0,
  description: '',
  has_notification: false,
  has_record: 0,
  has_study: false,
  img: '',
  labels: [{
    classification: '',
    id: 0,
    name: '',
    parentId: 0,
    path: '',
    tenantId: 0,
    type: '',
  }],
  lecture: '',
  name: '',
  rest_count: 0,
  room_uuid: '',
  status: '',
  time: 0,
  type: '',
};

function reducer(state = initState, action) {
  const type = action.type;
  switch (type) {
    case ACTIONS.FETCH_LIVE_HISTORY_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export default reducer;
