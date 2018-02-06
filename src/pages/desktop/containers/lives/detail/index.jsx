import React from 'react';
import { FormattedMessage } from 'react-intl';

import Info from './info';
import Desc from './desc';
import DxHeader from '../../../components/header';
import DxFooter from '../../../components/footer';

import './styles.styl';
import messages from '../messages';

const Detail = props => (
  <div>
    <DxHeader />
    <div className="dx-container course">
      <Info {...props} />
      <ul className="tabs">
        <li className="tab active">
          <FormattedMessage {...messages.courseDesc} />
        </li>
      </ul>
      <Desc {...props} />
    </div>
    <DxFooter />
  </div>
);

export default Detail;
