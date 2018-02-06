import { createSelector } from 'reselect';
import { prop } from 'utils/fn';

export const cartSelector = prop('shoppingCart');
export const cartCountSelector = createSelector(
  cartSelector,
  prop('cartCount')
);

export const totalSelector = createSelector(
  cartCountSelector,
  ({ EnterpriseCount, PersonalCount }) => EnterpriseCount + PersonalCount
);
