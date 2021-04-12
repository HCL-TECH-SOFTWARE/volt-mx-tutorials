import React from 'react';
import { ComponentPerformancePage, columns } from '../../pages/componentperformance';
import { shallow } from '../../src/utils/enzyme';

describe('ComponentPerformancePage page test suite', () => {
  it('static methods', () => {
    const testDate = new Date('Fri Oct 03 2019');
    const expectedDate = '2019-10-03';
    expect(ComponentPerformancePage.getFormattedDate(testDate)).toBe(expectedDate);
    expect(ComponentPerformancePage.getTokenizedString({ output: 'keyword,bread,crumb' })).toBe('keyword , bread ');
    expect(ComponentPerformancePage.getTokenizedString({ output: 'bread/crumb:keyword, word' })).toBe('bread keyword ');
    expect(ComponentPerformancePage.getTokenizedString({ output: 'keyword,bread/crumb' })).toBe('keyword ');

    expect(columns[0].sorter({ component: 'ab' }, { component: 'bc' })).toBe(-1);
    expect(columns[0].sorter({ component: 'ab' }, { component: 'ab' })).toBe(0);
    columns.forEach((column) => {
      const { dataIndex } = column;
      if (dataIndex !== 'component' && dataIndex !== 'output') {
        const a = {};
        const b = {};
        a[dataIndex] = 40;
        b[dataIndex] = 10;
        expect(column.sorter(a, b)).toBe(30);
        a[dataIndex] = 10;
        b[dataIndex] = 40;
        expect(column.sorter(a, b)).toBe(-30);
      }
    });
  });
  it('render JSX', () => {
    const wrappedComponent = shallow(<ComponentPerformancePage marketplace={{}} url="/" />);

    expect(wrappedComponent).toMatchSnapshot();
  });
  it('render JSX with moderator menu', () => {
    const wrappedComponent = shallow(<ComponentPerformancePage
      marketplace={{
        moderatorMenu: {},
      }}
      url="/"
    />);

    expect(wrappedComponent).toMatchSnapshot();
  });
  it('render JSX with moderator sub menu', () => {
    const wrappedComponent = shallow(<ComponentPerformancePage
      marketplace={{
        config: {},
        moderatorMenu: {
          subMenu: [{}],
        },
      }}
      url="/"
    />);

    expect(wrappedComponent).toMatchSnapshot();
  });
  it('render JSX with moderator Sub Menu and call setDate and filterData', () => {
    const wrappedComponent = shallow(<ComponentPerformancePage
      marketplace={{
        config: {},
        moderatorMenu: {
          subMenu: [{}],
        },
      }}
      url="/"
    />);
    wrappedComponent.instance().setDate();
    wrappedComponent.instance().filterData('keyword');
    expect(wrappedComponent).toMatchSnapshot();
  });
});
