import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from './messages';

function getNewMsg(newMessage, url) {
  return {
    'red-dot': newMessage.announcement_msg && url === 'announcement',
  };
}
function TodoList({ newMessage }) {
  const views = [
    {
      messages: messages.learn,
      url: 'plans',
    },
    {
      messages: messages.live,
      url: 'lives',
    },
    {
      messages: messages.test,
      url: 'exams',
    },
    {
      messages: messages.favorite,
      url: 'favorites',
    },
  ];

  const cviews = [
    {
      messages: messages.announcement,
      url: 'announcement',
    }, {
      messages: messages.attendance,
      url: 'sign-in-record',
    }, {
      messages: messages.setting,
      url: 'setting',
    },
  ];

  return (
    <div className="todo-list">
      <ul className="views">
        {views.map((view, index) => (
          <li key={index}>
            <Link to={view.url}><FormattedMessage id={view.messages.id} /></Link>
          </li>))
        }
      </ul>
      <ul className="views">
        {
          cviews.map((view, index) => {
            if (__platform__.dingtalk && view.url === 'announcement') {
              return null;
            }

            return (<li key={index}>
              <Link to={view.url} className={classNames(getNewMsg(newMessage, view.url))}>
                <FormattedMessage id={view.messages.id} />
              </Link>
            </li>);
          })
        }
      </ul>
    </div>
  );
}

export default TodoList;
