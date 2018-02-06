import update from 'immutability-helper';
import { findPropEq, findIndexPropEq, findIndexEq, diffPropEq, pluck } from 'utils/fn';

import {
  INIT_REQUIRED_DISTRIBUTION,
  FETCH_REQUIRED_COURSE_SUCCESS,
  PAGINATE_REQUIRED_COURSE_SUCCESS,
  SELECT_REQUIRED_COURSE,
  UNSELECT_REQUIRED_COURSE,
  FETCH_COURSE_USER_SUCCESS,
  PAGINATE_COURSE_USER_SUCCESS,
  SELECT_COURSE_USERS,
  SELECT_COURSE_USER,
  UNSELECT_COURSE_USER,
  UNSELECT_COURSE_USERS,
  FETCH_DISTRIBUTION_DEPARTMENT,
  SELECT_DISTRIBUTION_DEPARTMENT,
  SELECT_DISTRIBUTION_CHILD_DEPARTMENT,
} from '../dxConstants/action-types/distribution';

function insertBySpell(user, users) {
  const index = users.findIndex(selectedUser => selectedUser.spell > user.spell);
  return index === -1
    ? [...users, user]
    : [...users.slice(0, index),
    user,
    ...users.slice(index),
  ];
}

const initState = {
  courses: [],
  users: [],
  totalUsers: 0,
  departments: [],
  childDepartments: [],
  selectedCourses: [],
  selectedUsers: [],
  selectedDepartments: [],
};

function reducer(state = initState, action) {
  const { type: actionType, payload } = action;
  switch (actionType) {
    case INIT_REQUIRED_DISTRIBUTION:
      return initState;
    case FETCH_REQUIRED_COURSE_SUCCESS:
      return { ...state, courses: payload };
    case PAGINATE_REQUIRED_COURSE_SUCCESS:
      return { ...state, courses: state.courses.concat(payload) };
    case SELECT_REQUIRED_COURSE: {
      const courseId = payload;
      const index = findIndexPropEq('id', courseId, state.selectedCourses);
      const course = findPropEq('id', courseId, state.courses);
      const isExists = index !== -1;
      // reassign if already exists
      if (isExists) return update(state, { selectedCourses: { [index]: { $set: course } } });
      return update(state, { selectedCourses: { $push: [course] } });
    }
    case UNSELECT_REQUIRED_COURSE: {
      const index = findIndexPropEq('id', payload, state.selectedCourses);
      if (index === -1) return state;
      return update(state, { selectedCourses: { $splice: [[index, 1]] } });
    }
    case FETCH_COURSE_USER_SUCCESS:
      return { ...state, users: payload };
    case PAGINATE_COURSE_USER_SUCCESS:
      return update(state, { users: { $push: payload } });
    case SELECT_COURSE_USER: {
      const userId = payload;
      const user = findPropEq('id', userId, state.users);
      const selectedUsers = insertBySpell(user, state.selectedUsers);
      return { ...state, selectedUsers };
    }
    case UNSELECT_COURSE_USER: {
      const userId = payload;
      const index = findIndexPropEq('id', userId, state.selectedUsers);
      if (index === -1) return state;
      return update(state, { selectedUsers: { $splice: [[index, 1]] } });
    }
    case SELECT_COURSE_USERS: {
      const { users, dept_id: deptId } = payload;
      const userLength = state.selectedUsers.length;
      if (userLength > 100) return state;
      const diffUsers = diffPropEq('id', users, state.selectedUsers);
      if (diffUsers.length + userLength > 100) return state;
      const sortedUsers = diffUsers.reduce((selectedUsers, user) =>
        insertBySpell(user, selectedUsers), state.selectedUsers);
      return update(state, {
        selectedUsers: { $set: sortedUsers },
        selectedDepartments: { $push: [deptId] },
      });
    }
    case UNSELECT_COURSE_USERS: {
      const { users, dept_id } = payload;
      const ids = pluck('id', users);
      const selectedUsers = state.selectedUsers.filter(user => ids.indexOf(user.id) === -1);
      const index = findIndexEq(dept_id, state.selectedDepartments);
      return update(state, {
        selectedUsers: { $set: selectedUsers },
        selectedDepartments: { $splice: [[index, 1]] },
      });
    }
    case FETCH_DISTRIBUTION_DEPARTMENT: {
      const { departments, users } = payload;
      return { ...state, users, departments };
    }
    case SELECT_DISTRIBUTION_DEPARTMENT: {
      const { department, users, childDepartments, totalUsers } = payload;
      let departments;
      if (state.departments.length === 0) departments = [department]; // 第一次从面包屑选择部门
      else {
        const index = findIndexPropEq('id', department.id, state.departments);
        departments = state.departments.slice(0, index + 1);
      }

      return {
        ...state,
        users,
        childDepartments,
        totalUsers,
        departments,
      };
    }
    case SELECT_DISTRIBUTION_CHILD_DEPARTMENT: {
      const { department, users, childDepartments, totalUsers } = payload;
      return {
        ...state,
        users,
        childDepartments,
        totalUsers,
        departments: state.departments.concat(department),
      };
    }
    default:
      return state;
  }
}

export default reducer;
