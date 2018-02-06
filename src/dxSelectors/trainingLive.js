import { createSelector } from 'reselect';
import { prop } from 'utils/fn';

export const trainingLiveSelector = prop('trainingLive');
export const createTrainingLivePropSelector = propOfLiveHistory => createSelector(
  trainingLiveSelector,
  prop(propOfLiveHistory)
);

// 直播名称
export const liveNameSelector = createTrainingLivePropSelector('name');
// 直播状态
export const liveStatusSelector = createTrainingLivePropSelector('status');
// 直播类型 公开课或企业会议
export const liveTypeSelector = createTrainingLivePropSelector('type');
// 讲师
export const liveLecturerSelector = createTrainingLivePropSelector('lecturer');
// 开始时间
export const liveBeginTimeSelector = createTrainingLivePropSelector('time');


// 是否已被提醒过
export const hasAlertedSelector = createTrainingLivePropSelector('has_notification');

// 直播室是否满座（true: 满座）
export const isLiveRoomFullSelector = createSelector(
  trainingLiveSelector,
  ({ rest_count: restCount }) => restCount === 0
);

// 是否有回放
export const hasPlaybackSelector = createTrainingLivePropSelector('has_record');
