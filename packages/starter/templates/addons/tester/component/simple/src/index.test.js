import React from 'react';
import { render } from '@testing-library/react';
import RockpackComponent from './index';

test('Render React Component', () => {
  const { getByText } = render(
    <RockpackComponent / >,
);
const element = getByText(/Rockpack/i);

expect(element)
.toBeInTheDocument();
});
