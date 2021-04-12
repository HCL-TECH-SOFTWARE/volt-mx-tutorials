import React from 'react';
import DidYouMean from '../../src/components/DidYouMean';
import { shallow } from '../../src/utils/enzyme';

describe('DidYouMean component test suite', () => {
  it('render with keyword and suggestion props', () => {
    const keyword = 'logn';
    const suggestion = 'login';
    const wrappedComponent = shallow(<DidYouMean keyword={keyword} suggestion={suggestion} />);
    expect(wrappedComponent.find('p a').prop('href')).toBe(`/search/${suggestion}`);
    expect(wrappedComponent).toMatchSnapshot();
  });
});
