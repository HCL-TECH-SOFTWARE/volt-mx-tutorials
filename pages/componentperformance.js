import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';
import Router from 'next/router';
import moment from 'moment';
import AnalyticsHeader from '../src/components/AnalyticsHeader';
import { marketplaceActions } from '../src/actions';
import initialize, { instance as axios } from '../src/utils/initialize';
import KonyLayout from '../src/components/KonyLayout';
import KonyBreadcrumb from '../src/components/KonyBreadcrumb';
import DateRangePicker from '../src/components/DateRangePicker';
import style from './style.scss';
import PageNotFound from '../src/components/PageNotFound';
import AnalyticsFilterTable from '../src/components/AnalyticsFilterTable';
import ExportTableToCSV from '../src/components/ExportTableToCSV';
import { baseURL } from '../src/config/settings';

export const columns = [
  {
    title: 'Comp. Name',
    dataIndex: 'component',
    sorter: (a, b) => a.component.localeCompare(b.component),
    sortDirections: ['descend', 'ascend'],
    width: 110,
  },
  {
    title: 'Mp Downloads',
    dataIndex: 'Downloads',
    sorter: (a, b) => a.Downloads - b.Downloads,
    width: 100,
  },
  {
    title: 'Imports into Forms',
    dataIndex: 'overallUsage',
    sorter: (a, b) => a.overallUsage - b.overallUsage,
    sortDirections: ['descend', 'ascend'],
    width: 100,
  },
  {
    title: 'Went Live',
    dataIndex: 'liveUsage',
    sorter: (a, b) => a.liveUsage - b.liveUsage,
    sortDirections: ['descend', 'ascend'],
    width: 100,
  },
  {
    title: 'No. of Debug',
    dataIndex: 'debug',
    sorter: (a, b) => a.debug - b.debug,
    sortDirections: ['descend', 'ascend'],
    width: 100,
  },
  {
    title: 'No. of releases',
    dataIndex: 'release',
    sorter: (a, b) => a.release - b.release,
    sortDirections: ['descend', 'ascend'],
    width: 100,
  },
  {
    title: 'Viz / Downloads',
    dataIndex: 'vizDownloads',
    sorter: (a, b) => a.vizDownloads - b.vizDownloads,
    sortDirections: ['descend', 'ascend'],
    width: 100,
  },
  {
    title: 'Live / Viz',
    dataIndex: 'liveViz',
    sorter: (a, b) => a.liveViz - b.liveViz,
    sortDirections: ['descend', 'ascend'],
    width: 80,
  },
  {
    title: 'Project vs Hits',
    dataIndex: 'output',
    width: 200,
  },
];

export class ComponentPerformancePage extends Component {
  constructor(props) {
    super(props);
    const today = ComponentPerformancePage.getFormattedDate(new Date());
    const lastWeek = ComponentPerformancePage
      .getFormattedDate(
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      );

    this.state = {
      data: [],
      originalData: [],
      loading: false,
      dates: [lastWeek, today],
      momentDates: [moment(lastWeek), moment(today)],
    };
  }

  static getFormattedDate(date) {
    const today = date;
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  static async getInitialProps(ctx) {
    await initialize(ctx);
    await ctx.store.dispatch(marketplaceActions.getConfig(true));
  }

  componentDidMount() {
    const { dates } = this.state;
    this.getData(dates);
  }

  getTokenizedString(item) {
    const { output } = item;
    const splitOutput = output.split(',');
    splitOutput.pop();
    let results = '';
    _forEach(splitOutput, (splitItem) => {
      const splits = splitItem.split('/');
      if (splits.length > 1) {
        const result = `${splits[0]} ${splits[1].split(':')[1]}`;
        results += `${result} , `;
      } else if (splits.length === 1) {
        const result = splits[0].replace(/:/g, ' ');
        results += `${result} , `;
      }
    });
    results = results.substring(0, results.length - 2);
    return results;
  }

  getData = async (dates) => {
    try {
      this.setState({ loading: true });
      const res = await axios.get('api/v1_1/marketplace/analytics', {
        params: {
          from_date: dates[0],
          to_date: dates[1],
        },
      });
      const { data } = res;
      const originalData = data.map(item => ({ ...item, output: this.getTokenizedString(item) }));
      this.setState({ loading: false, data: originalData, originalData });
    } catch (error) {
      this.setState({ loading: false, data: [], originalData: [] });
    }
  };

  setDate = (dates, momentDates) => {
    this.setState({ dates, momentDates });
    this.getData(dates);
  }

  filterData = (keyword) => {
    const { originalData } = this.state;
    this.setState(
      {
        data: _filter(originalData,
          obj => obj
            .component
            .toString()
            .toLowerCase()
            .includes(keyword
              .toString()
              .toLowerCase())),
      },
    );
  }

  onRowClickParent = (data) => {
    const { dates } = this.state;
    const query = {
      data: encodeURIComponent(JSON.stringify(data)),
      from_date: dates[0],
      to_date: dates[1],
    };
    Router.replace({
      pathname: '/analyticsdetails',
      query,
    });
  };

  onChange = (pagination, filters, sorter, extra) => {
    const data = extra.currentDataSource;
    this.setState({ loading: false, data, originalData: data });
  };

  renderContent = (isModerator) => {
    const {
      loading, dates, momentDates, data,
    } = this.state;

    if (isModerator) {
      return (
        <Fragment>
          <Row>
            <Col span={14}>
              <KonyBreadcrumb
                title="Component Performance"
                subRoutes={
                  [
                    {
                      name: 'Dashboard',
                      path: `${baseURL}marketplace/dashboard`,
                    },
                    {
                      name: 'Analytics',
                      path: '/analytics',
                    },

                  ]
                }
              />
            </Col>
            <Col span={10} className={style.datePanel}>
              <DateRangePicker
                setDate={this.setDate}
                defaultDateValuesInMoment={momentDates}
                defaultDateValues={dates}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ExportTableToCSV
                data={data}
                columns={columns}
                fileNameSuffix="components_performance_analytics"
              />
            </Col>
            <Col className={style.filterTablePanel}>
              <AnalyticsFilterTable
                onRowClick={this.onRowClickParent}
                showPagination
                data={data}
                onChange={this.onChange}
                loading={loading}
                columns={columns}
              />
            </Col>
          </Row>
        </Fragment>
      );
    }

    return <PageNotFound />;
  };

  render() {
    const { marketplace, url } = this.props;
    const { config, moderatorMenu } = marketplace;
    return (
      <KonyLayout config={config} url={url}>
        <AnalyticsHeader
          filterData={this.filterData}
          placeholder="Search for Marketplace Assets"
          search
        />
        <div>
          {
            this.renderContent(moderatorMenu
              && moderatorMenu.subMenu
              && moderatorMenu.subMenu.length > 0)
          }
        </div>
      </KonyLayout>
    );
  }
}

ComponentPerformancePage.propTypes = {
  marketplace: PropTypes.shape({}).isRequired,
  url: PropTypes.string.isRequired,
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

const mapDispatchToProps = dispatch => bindActionCreators({ ...marketplaceActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComponentPerformancePage);
