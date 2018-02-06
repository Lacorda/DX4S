import React from 'react';
import './styles.styl';
import Item from './item';

class BreadCrumbs extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    this.scrollToRight();
  }

  componentDidUpdate() {
    this.scrollToRight();
  }

  scrollToRight() {
    this.crumbs.scrollLeft = this.crumbs.scrollWidth;
  }

  render() {
    const { items, active = items.length - 1, onSelect } = this.props;
    const split = <li> &gt; </li>;
    return (
      <div className="breadcrumbs-wrapper">
        <ul className="breadcrumbs" ref={(ref) => { this.crumbs = ref; }}>
          {
            items.map((label, i) =>
              [<Item active={active === i} label={label} onClick={() => onSelect(i)} />]
                .concat(i === items.length - 1 ? [] : [split])
            )
          }
        </ul>
      </div>
    );
  }
}

BreadCrumbs.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.string),
  active: React.PropTypes.number,
  onSelect: React.PropTypes.func,
};

BreadCrumbs.defaultProps = {
  items: [],
};

export default BreadCrumbs;
