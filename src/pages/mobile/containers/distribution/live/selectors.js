import { createSelector } from 'reselect';
import { prop, pluck, pipe, defaultTo, last } from 'utils/fn';

export const distributionLiveSelector = state => state.liveDistribution;
export const createLiveDistributionSelectorCreator = key => createSelector(
  distributionLiveSelector,
  live => live[key]
);

export const liveListSelectors = createLiveDistributionSelectorCreator('lives');
export const selectedLiveSelector = createLiveDistributionSelectorCreator('selectedLive');

export const selectedLiveIdSelector = createSelector(
  selectedLiveSelector,
  live => (live ? live.id : null)
);

export const selectedCoursesLengthSelector = createSelector(
  selectedLiveSelector,
  live => !!live
);

export const departmentsSelector = createLiveDistributionSelectorCreator('departments');
export const selectedDepartmentsSelector = createLiveDistributionSelectorCreator('selectedDepartments');
export const departmentsNameSelector = createSelector(
  departmentsSelector,
  pluck(['name'])
);
export const selectedDepartmentIdSelector = createSelector(
  departmentsSelector,
  pipe([last, defaultTo({}), prop('id')])
);

export const childDepartmentsSelector = createLiveDistributionSelectorCreator('childDepartments');

export const usersSelector = createLiveDistributionSelectorCreator('users');
export const selectedUsersSelector = createLiveDistributionSelectorCreator('selectedUsers');
export const totalUsersSelector = createLiveDistributionSelectorCreator('totalUsers');
export const selectedUsersCountSelector = createSelector(
  selectedUsersSelector,
  ({ length }) => length
);
export const maxAvailableUserCountSelector = createSelector(
  selectedLiveSelector,
  live => (live ? (live.available_num || Infinity) : 0)
);
