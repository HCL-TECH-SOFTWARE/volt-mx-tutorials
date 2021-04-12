import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _filter from 'lodash/filter';
import moment from 'moment';
import AnalyticsHeader from '../src/components/AnalyticsHeader';
import { marketplaceActions } from '../src/actions';
import initialize, { instance as axios } from '../src/utils/initialize';
import KonyLayout from '../src/components/KonyLayout';
import KonyBreadcrumb from '../src/components/KonyBreadcrumb';
import DateRangePicker from '../src/components/DateRangePicker';
import KonyLoader from '../src/components/KonyLoader';
import style from './style.scss';
import PageNotFound from '../src/components/PageNotFound';
import AnalyticsFilterTable from '../src/components/AnalyticsFilterTable';
import ExportTableToCSV from '../src/components/ExportTableToCSV';
import { baseURL } from '../src/config/settings';

class AnalyticsDetailsPage extends Component {
  columnsUsageDetail = [
    {
      title: 'Mp Downloads',
      dataIndex: 'Downloads',
      width: 100,
    },
    {
      title: 'Imports into Forms',
      dataIndex: 'overallUsage',
      width: 100,
    },
    {
      title: 'Went Live',
      dataIndex: 'liveUsage',
      width: 100,
    },
    {
      title: 'No. of Debug',
      dataIndex: 'debug',
      width: 100,
    },
    {
      title: 'No. of releases',
      dataIndex: 'release',
      width: 100,
    },
    {
      title: 'Viz Downloads',
      dataIndex: 'vizDownloads',
      width: 100,
    },
    {
      title: 'Live Viz',
      dataIndex: 'liveViz',
      width: 80,
    },
    {
      title: 'Project vs Hits',
      dataIndex: 'output',
      width: 200,
    },
  ];

  columnsMetricPerformance = [
    {
      title: 'Time',
      dataIndex: 'time',
      sorter: (a, b) => new Date(b.time) - new Date(a.time),
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: 'Downloader ID',
      dataIndex: 'downloaderId',
      sorter: (a, b) => a.downloaderId.localeCompare(b.downloaderId),
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: 'Downloader Company',
      dataIndex: 'downloaderCompany',
      sorter: (a, b) => a.downloaderId.localeCompare(b.downloaderId),
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
  ];

  constructor(props) {
    super(props);
    const params = this.props.url.query;
    const today = params.to_date;
    const lastWeek = params.from_date;
    const componentAnalyticsData = JSON.parse(decodeURIComponent(params.data));

    this.state = {
      componentName: componentAnalyticsData.component,
      metricPerformanceData: [],
      originalData: [],
      loading: false,
      dates: [lastWeek, today],
      momentDates: [moment(lastWeek), moment(today)],
      usageDetail: [componentAnalyticsData],
    };
    this.setDate = this.setDate.bind(this);
    this.getData = this.getData.bind(this);
    this.filterData = this.filterData.bind(this);
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

  getData = async (dates) => {
    try {
      this.setState({ loading: true });
      const res = await axios.get('api/v1_0/marketplace/get_analytics_details', {
        params: {
          from_date: dates[0],
          to_date: dates[1],
          title: this.state.componentName,
        },
      });
      this.setState({ loading: false, metricPerformanceData: res.data, originalData: res.data });
    } catch (error) {
      this.setState({ loading: false, metricPerformanceData: [], originalData: [] });
    }
  };

  onChange = (pagination, filters, sorter, extra) => {
    const data = extra.currentDataSource;
    this.setState({ loading: false, metricPerformanceData: data, originalData: data });
  };

  setDate(dates, momentDates) {
    this.setState({ dates, momentDates });
    this.getData(dates);
  }

  filterData(keyword) {
    const { originalData } = this.state;
    this.setState(
      {
        metricPerformanceData: _filter(originalData,
          obj => obj
            .date
            .toString()
            .toLowerCase()
            .includes(keyword
              .toString()
              .toLowerCase())),
      },
    );
  }

  static async getInitialProps(ctx) {
    await initialize(ctx);
    await ctx.store.dispatch(marketplaceActions.getConfig(true));
  }

  renderContent = (isModerator) => {
    const {
      loading, dates, momentDates, metricPerformanceData, usageDetail,
    } = this.state;

    delete usageDetail.component;

    if (isModerator) {
      return (
        <Fragment>
          <Row>
            <Col span={16}>
              <KonyBreadcrumb
                title={this.state.componentName}
                subRoutes={
                  [
                    {
                      name: 'Dashboard',
                      path: `${baseURL}marketplace/dashboard`,
                    },
                    {
                      name: 'Component Performance',
                      path: '/analytics/component',
                    },
                  ]
                }
              />
            </Col>
            <Col span={8} className={style.datePanel}>
              <DateRangePicker
                setDate={this.setDate}
                defaultDateValuesInMoment={momentDates}
                defaultDateValues={dates}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Col span={12}>
                <h2 className={style.tableHeading}>Usage Detail</h2>
              </Col>
              <Col span={12}>
                <ExportTableToCSV
                  data={metricPerformanceData}
                  columns={this.columnsMetricPerformance}
                  fileNameSuffix="analytics_details"
                />
              </Col>
            </Col>
            <Col className={style.filterTablePanel}>
              <AnalyticsFilterTable
                data={usageDetail}
                columns={this.columnsUsageDetail}
                onChange={this.onChange}
                loading={loading}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2 className={style.tableHeading}>Keyword Performance</h2>
            </Col>
            <Col>
              <AnalyticsFilterTable
                showPagination
                data={metricPerformanceData}
                columns={this.columnsMetricPerformance}
                onChange={this.onChange}
                loading={loading}
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
          placeholder="Search for Marketplace Component"
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

const mapStateToProps = ({ marketplace }) => ({ marketplace });

const mapDispatchToProps = dispatch => bindActionCreators({ ...marketplaceActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalyticsDetailsPage);
