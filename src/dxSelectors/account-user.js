import { createSelector } from 'reselect';

export const userAccountSelector = state => state.account.user;

export const hasMallModuleSelector = createSelector(
  userAccountSelector,
  ({ modules }) => (modules ? modules.mall : true)
);
