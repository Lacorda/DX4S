import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from '../components/button';

storiesOf('Button', module)
  .add('basic', () => (
    <Button onClick={action('clicked')}>Click</Button>
  ));
