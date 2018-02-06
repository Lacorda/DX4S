import React, { PropTypes } from 'react';
import Ribbon from 'components/ribbon';
import { FormattedMessage } from 'react-intl';
import { RelativeLink } from 'react-router-relative-links';

import messages from './messages';

const propTypes = {
  items: PropTypes.array.isRequired,
};

const linkTo = (type, id) => {
  const urls = {
    course: `/products/course/${id}`,
    series: `/products/series/${id}`,
    live: `/products/live/${id}`,
  };
  return urls[type];
};

// 列表
class List extends React.Component {
  constructor(args) {
    super(...args);
    this.ribbonStyle = {
      course: { text: <span />, backgroundColor: 'transparent' },
      series: { text: <FormattedMessage {...messages.series} />, backgroundColor: '#82c650' },
      live: { text: <FormattedMessage {...messages.live} />, backgroundColor: '#fe124a' },
    };
  }

  render() {
    const { items } = this.props;
    // if (!items.length) {
    //   return <span>找不到您想要的结果</span>;
    // }
    return (
      <ul className="list">
        {
          items.map(item => (
            <li className="item" key={item.id}>
              <RelativeLink to={linkTo(item.type, item.id)} className="link">
                <div className="item-left" style={{ position: 'relative' }}>
                  <img src={item.cover_url} alt="" />
                  <Ribbon {...this.ribbonStyle[item.type]} />
                </div>
                <div className="item-right">
                  <div className="row-first" dangerouslySetInnerHTML={{ __html: item.name }} />
                  <div className="row-second">{item.lecturer}</div>
                  <div className="row-third">
                    <span className="price">{`¥${item.unit_price.toFixed(2)}`}</span>
                    <span><FormattedMessage {...messages.sales} />: {item.sales}</span>
                  </div>
                </div>
              </RelativeLink>
            </li>
          ))
        }
      </ul>
    );
  }
}

List.propTypes = propTypes;

export default List;
