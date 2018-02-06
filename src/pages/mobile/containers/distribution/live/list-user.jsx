import React from 'react';

function statelessWrapper(props) {
  return props.children;
}

function UserList({ users, userElGetter }) {
  return (
    <statelessWrapper>
      {
        users.reduce((userEls, user, i) => {
          const pre = users[i - 1];
          const initial = user.spell[0];
          const notSameInital = (pre && pre.spell[0] !== initial) || i === 0;
          const spellTitleEl = notSameInital
            ? <li key={`${initial}`} className="section-title">{initial.toUpperCase()}</li>
            : [];
          const userEl = userElGetter(user);
          return userEls.concat(spellTitleEl, userEl);
        }, [])
      }
    </statelessWrapper>
  );
}

const { arrayOf, object, func } = React.PropTypes;
UserList.propTypes = {
  users: arrayOf(object),
  userElGetter: func,
};

export default UserList;
