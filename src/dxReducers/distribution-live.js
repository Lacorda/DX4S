import * as ACTIONS from 'dxConstants/action-types/distribution';
import update from 'immutability-helper';
import { findPropEq, findIndexPropEq, findIndexEq, diffPropEq, pluck } from 'utils/fn';

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
  lives: [],
  selectedLive: null,
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
    case ACTIONS.INIT_LIVE_DISTRIBUTION:
      return initState;
    case ACTIONS.FETCH_DISTRIBUTION_LIVE_SUCCESS:
      return { ...state, lives: payload };
    case ACTIONS.PAGINATE_DISTRIBUTION_LIVE_SUCCESS:
      return { ...state, lives: state.lives.concat(payload) };
    case ACTIONS.SELECT_DISTRIBUTION_LIVE:
      return { ...state, selectedLive: findPropEq('id', payload, state.lives) };
    case ACTIONS.UNSELECT_DISTRIBUTION_LIVE:
      return { ...state, selectedLive: null };
    case ACTIONS.FETCH_LIVE_USER_SUCCESS:
      return { ...state, users: payload };
    case ACTIONS.PAGINATE_LIVE_USER_SUCCESS:
      return update(state, { users: { $push: payload } });
    case ACTIONS.SELECT_LIVE_USER: {
      const userId = payload;
      const user = findPropEq('id', userId, state.users);
      const selectedUsers = insertBySpell(user, state.selectedUsers);
      return { ...state, selectedUsers };
    }
    case ACTIONS.UNSELECT_LIVE_USER: {
      const userId = payload;
      const index = findIndexPropEq('id', userId, state.selectedUsers);
      if (index === -1) return state;
      return update(state, { selectedUsers: { $splice: [[index, 1]] } });
    }
    case ACTIONS.SELECT_LIVE_USERS: {
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
    case ACTIONS.UNSELECT_LIVE_USERS: {
      const { users, dept_id } = payload;
      const ids = pluck('id', users);
      const selectedUsers = state.selectedUsers.filter(user => ids.indexOf(user.id) === -1);
      const index = findIndexEq(dept_id, state.selectedDepartments);
      return update(state, {
        selectedUsers: { $set: selectedUsers },
        selectedDepartments: { $splice: [[index, 1]] },
      });
    }
    case ACTIONS.FETCH_DEPARTMENT_FOR_LIVE_DISTRIBUTION: {
      const { departments, users } = payload;
      return { ...state, users, departments };
    }
    case ACTIONS.SELECT_LIVE_DISTRIBUTION_DEPARTMENT: {
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
    case ACTIONS.SELECT_LIVE_DISTRIBUTION_CHILD_DEPARTMENT: {
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
