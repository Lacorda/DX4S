import React from 'react';

class SlideNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleSure = :: this.handleSure;
    this.state = {
      filter: this.props.defaultSelected,
      style: { display: 'none' },
    };
  }

  /*  componentDidMount() {
   setTimeout(() => {
   this.wrap.className = 'slide-nav-wrap slide-in';
   }, 10);
   }*/

  componentWillReceiveProps(props) {
    if (props.isOpen === this.props.isOpen) return;
    if (props.isOpen) {
      this.setState({ style: { display: 'block' } });
      setTimeout(() => {
        this.wrap.className = 'slide-nav-wrap slide-in';
      }, 10);
    } else {
      this.setState({ style: { display: 'none' } });
    }
  }

  handleClick(index, parentIndex, name) {
    const pItems = document.getElementsByTagName('ul');
    const items = pItems[parentIndex].getElementsByTagName('li');

    for (let i = 0, len = items.length; i < len; i += 1) {
      items[i].className = '';
    }
    items[index].className = 'active';

    this.state.filter[parentIndex] = name;
    this.setState({ filter: this.state.filter });
  }

  handleSure(e) {
    e.stopPropagation();
    if (e.target.className === 'slide-nav-wrap slide-in' || e.target.className === 'nav-btn') {
      this.wrap.className = 'slide-nav-wrap';
      setTimeout(() => {
        this.props.onSure(this.state.filter);
      }, 100);
    }
  }

  render() {
    return (
      <div
        className="slide-nav-wrap"
        ref={(ref) => { this.wrap = ref; }}
        onClick={this.handleSure}
        style={this.state.style}
      >
        <div className="slide-nav">
          {
            this.props.query.map((q, parentIndex) => (
              <div className="nav" key={q.title}>
                <div className="slide-nav-title">{q.title}</div>
                <ul>
                  {
                    q.nav.map((item, index) => (
                      <li
                        key={item.id}
                        className={this.state.filter[parentIndex] === item.id ? 'active' : ''}
                        onClick={() => this.handleClick(index, parentIndex, item.id)}
                      >
                        {item.name}
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
          <div className="nav-footer">
            <button type="button" className="nav-btn" onClick={this.handleSure}>{this.props.buttonText}</button>
          </div>
        </div>
      </div>
    );
  }
}


SlideNav.propTypes = {
  query: React.PropTypes.arrayOf(React.PropTypes.object),
  defaultSelected: React.PropTypes.arrayOf(React.PropTypes.string),
  onSure: React.PropTypes.func,
  buttonText: React.PropTypes.string,
  isOpen: React.PropTypes.bool,
};

export default SlideNav;
