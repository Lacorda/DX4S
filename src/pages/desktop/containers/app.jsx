import React, { PropTypes } from 'react';

const propTypes = {
  children: PropTypes.element,
};

function App({ children }) {
  return (
    <div id="main">
      {children}
    </div>
  );
}

App.propTypes = propTypes;

export default App;
