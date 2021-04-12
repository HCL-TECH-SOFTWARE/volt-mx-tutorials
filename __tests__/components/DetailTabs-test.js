import React from 'react';
import DetailTabs from '../../src/components/DetailTabs';
import { shallow } from '../../src/utils/enzyme';

jest.dontMock('../../src/components/DetailTabs');

describe('DetailsTab component test suite', () => {
  it('contains Tabs and TabPane', () => {
    const docURL = 'https://docs.kony.com/marketplace/login/default.htm';
    const wrappedComponent = shallow(<DetailTabs DocumentationURL={docURL} />);
    expect(wrappedComponent.find('Tabs')).toBeDefined();
    expect(wrappedComponent.find('TabPane')).toBeDefined();
    expect(wrappedComponent.find('Tabs TabPane')).toHaveLength(3);
    expect(wrappedComponent).toMatchSnapshot();
  });

  it('contains asset download button', () => {
    const wrappedComponent = shallow(<DetailTabs />);
    expect(wrappedComponent.find('AssetDownloadButton')).toBeDefined();
    expect(wrappedComponent.find('KonyLike')).toBeDefined();
    expect(wrappedComponent).toMatchSnapshot();
  });
});
