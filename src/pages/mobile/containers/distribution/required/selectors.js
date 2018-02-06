import { createSelector } from 'reselect';
import { pluck, last, pipe, prop, defaultTo } from 'utils/fn';

export const requiredSelector = state => state.requiredDistribution;
const createRequiredSelectorCreator = key => createSelector(
  requiredSelector,
  requiredDistribution => requiredDistribution[key]
);

export const coursesSelector = createSelector(
  requiredSelector,
  ({ courses }) => courses
);
export const selectedCoursesSelector = createSelector(
  requiredSelector,
  ({ selectedCourses }) => selectedCourses
);

export const selectedCoursesLengthSelector = createSelector(
  selectedCoursesSelector,
  ({ length }) => length
);

export const departmentsSelector = createRequiredSelectorCreator('departments');
export const selectedDepartmentsSelector = createRequiredSelectorCreator('selectedDepartments');
export const departmentsNameSelector = createSelector(
  departmentsSelector,
  pluck(['name'])
);
export const selectedDepartmentIdSelector = createSelector(
  departmentsSelector,
  pipe([last, defaultTo({}), prop('id')])
);

export const childDepartmentsSelector = createRequiredSelectorCreator('childDepartments');

export const usersSelector = createRequiredSelectorCreator('users');
export const selectedUsersSelector = createRequiredSelectorCreator('selectedUsers');
export const totalUsersSelector = createRequiredSelectorCreator('totalUsers');
export const selectedUsersCountSelector = createSelector(
  selectedUsersSelector,
  ({ length }) => length
);
export const maxAvailableUserCountSelector = createSelector(
  selectedCoursesSelector,
  courses => courses.reduce((count, { available_num: available }) =>
    (available && available < count ? available : count), Infinity)
);
