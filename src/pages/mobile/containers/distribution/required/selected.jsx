import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import RefreshLoad from '../../../components/refreshload';
import messages from '../messages';
import { formatCourseSource } from './helpers';

class Selected extends Component {
  constructor() {
    super();
    this.refresh = ::this.refresh;
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    this.refresh();
  }

  refresh() {
    if (!this.props.isOpen) return;
    const totalHeight = this.selectedScroll.getBoundingClientRect().height;
    const count = this.props.items.length;
    const singleHeight = totalHeight / count;
    const layer = Math.floor(document.body.clientHeight / singleHeight) - 1;
    const max = layer >= 4 ? 4 : layer;
    if (count >= max) {
      this.selectedScrollWrap.style.height = `${singleHeight * max}px`;
    } else {
      this.selectedScrollWrap.style.height = `${totalHeight}px`;
    }
    this.iScrollWrapper.refresh();
  }

  render() {
    if (!this.props.isOpen) return null;

    const { onClose, items, onRemove } = this.props;
    return (
      <div className="bottom-list-wrap">
        <div className="bottom-list">
          <div className="bottom-list-header">
            <a className="close" onClick={onClose}>&nbsp;</a>
          </div>
          <div
            className="bottom-list-body list-box"
            ref={(ref) => { this.selectedScrollWrap = ref; }}
          >
            <RefreshLoad
              relative
              needPullDown={false}
              needPullUp={false}
              ref={(ref) => { this.iScrollWrapper = ref; }}
            >
              <ul className="dx-list" ref={(ref) => { this.selectedScroll = ref; }}>
                {
                  items.map((item, index) => (
                    <li key={index} className="one-slide">
                      <div className={`dx-flex-box${(index === item.length) ? ' no-border' : ''}`}>
                        <div className="dx-flex-img">
                          <div className={`icon ${item.type}`}>{item.type}</div>
                          <img src={item.cover_url} alt="" />
                        </div>
                        <div className="dx-flex-info">
                          <div className="dx-flex-info-title">{item.name}</div>
                          <div className="dx-flex-info-desc">
                            <FormattedMessage {...messages.source} />
                            ：{formatCourseSource(item.source)}
                          </div>
                        </div>
                      </div>
                      <div className="dx-flex-box-operation-helper" onClick={() => onRemove(item.id)}>
                        <a className="delete">&nbsp;</a>
                      </div>
                    </li>
                  ))
                }
              </ul>
            </RefreshLoad>
          </div>
        </div>
      </div>

    );
  }
}

const { bool, func, arrayOf, object } = PropTypes;

Selected.propTypes = {
  isOpen: bool,
  onClose: func,
  onRemove: func,
  items: arrayOf(object),
};

Selected.defaultProps = {
  isOpen: false,
  items: [],
};

export default Selected;
