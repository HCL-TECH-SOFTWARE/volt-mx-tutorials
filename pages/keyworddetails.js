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
import { secondsToTime } from '../src/utils';

class SearchKeywordDetails extends Component {
  columnsUsageDetail = [
    {
      title: 'Total Search Uniques',
      dataIndex: 'searchUniques',
      width: 100,
    },
    {
      title: 'Average Search Depth',
      dataIndex: 'avgSearchDepth',
      width: 100,
    },
    {
      title: '% Search Refinements',
      dataIndex: 'percentSearchRefinements',
      width: 100,
    },
    {
      title: 'Search Duration (HH:mm:ss)',
      dataIndex: 'searchDuration',
      width: 100,
      render: text => secondsToTime(text),
    },
    {
      title: '% Conversion',
      dataIndex: 'searchGoalConversionRateAll',
      width: 100,
    },
  ];

  columnsKeywordPerformance = [
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      sorter: (a, b) => {
        a = a.ip_address.split('.');
        b = b.ip_address.split('.');
        for (let i = 0; i < a.length; i++) {
          if ((a[i] = parseInt(a[i])) < (b[i] = parseInt(b[i]))) return -1;
          if (a[i] > b[i]) return 1;
        }
        return 0;
      },
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
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
  ];

  constructor(props) {
    super(props);
    const params = this.props.url.query;
    const today = params.to_date;
    const lastWeek = params.from_date;
    const keywordData = JSON.parse(decodeURIComponent(params.data));

    this.state = {
      searchkeyword: keywordData.searchTerm,
      keywordPerformanceData: [],
      originalData: [],
      loading: false,
      dates: [lastWeek, today],
      momentDates: [moment(lastWeek), moment(today)],
      usageDetail: keywordData,
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
      const res = await axios.get('api/v1_0/marketplace/get_search_keyword_details', {
        params: {
          from_date: dates[0],
          to_date: dates[1],
          search_keyword: this.state.searchkeyword,
        },
      });
      this.setState({ loading: false, keywordPerformanceData: res.data, originalData: res.data });
    } catch (error) {
      this.setState({ loading: false, keywordPerformanceData: [], originalData: [] });
    }
  };

  onChange = (pagination, filters, sorter, extra) => {
    const data = extra.currentDataSource;
    this.setState({ loading: false, keywordPerformanceData: data, originalData: data });
  };

  setDate(dates, momentDates) {
    this.setState({ dates, momentDates });
    this.getData(dates);
  }

  filterData(keyword) {
    const { originalData } = this.state;
    this.setState(
      {
        keywordPerformanceData: _filter(originalData,
          obj => obj
            .email
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
      loading, dates, momentDates, keywordPerformanceData, usageDetail,
    } = this.state;

    delete usageDetail.searchTerm;

    if (isModerator) {
      return (
        <Fragment>
          <Row>
            <Col span={12}>
              <KonyBreadcrumb
                title={this.state.searchkeyword}
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
                    {
                      name: 'Search Analytics',
                      path: '/analytics/search',
                    },
                  ]
                }
              />
            </Col>
            <Col span={12} className={style.datePanel}>
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
                  data={keywordPerformanceData}
                  columns={this.columnsKeywordPerformance}
                  fileNameSuffix="search_keyword_details"
                />
              </Col>
            </Col>
            <Col className={style.filterTablePanel}>
              <AnalyticsFilterTable
                data={[usageDetail]}
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
                data={keywordPerformanceData}
                columns={this.columnsKeywordPerformance}
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
          placeholder="Search for keyword"
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
)(SearchKeywordDetails);
