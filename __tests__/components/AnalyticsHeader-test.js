import React from 'react';
import { AnalyticsHeader } from '../../src/components/AnalyticsHeader';
import { shallow } from '../../src/utils/enzyme';

describe('AnalyticsHeader component test suite', () => {
  it('render JSX without search', () => {
    const wrappedComponent = shallow(<AnalyticsHeader title="Analytics Header" subTitle="Analytics Sub Title" filterData={() => {}} placeholder="placeholder" />);
    expect(wrappedComponent).toMatchSnapshot();
  });
  it('render JSX with search', () => {
    const wrappedComponent = shallow(<AnalyticsHeader title="Analytics Header" subTitle="Analytics Sub Title" filterData={() => {}} placeholder="placeholder" search />);
    expect(wrappedComponent).toMatchSnapshot();
  });
});
