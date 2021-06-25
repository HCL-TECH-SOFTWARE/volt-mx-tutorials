import React from 'react';
import { KonyLike } from '../../src/components/KonyLike';
import { shallow } from '../../src/utils/enzyme';

jest.dontMock('../../src/components/KonyLike');

describe('DetailsTab component test suite', () => {
  it('contains asset download button', () => {
    const store = {
      isLogin: true,
    };
    const wrappedComponent = shallow(<KonyLike marketplace={store} isLiked />);
    expect(wrappedComponent.find('Button')).toBeDefined();
    expect(wrappedComponent.find('Button span').text()).toBe('Liked');
  });
});
