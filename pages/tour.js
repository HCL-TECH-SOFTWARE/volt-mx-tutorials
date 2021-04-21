import React, { Component } from 'react';
import { instance as axios } from '../src/utils/initialize';
import HikeHeader from '../src/components/HikeHeader';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import HikeBreadCrumb from '../src/components/HikeBreadCrumb';
import KonyButton from '../src/components/KonyButton';
import styles from './style.scss';
import categories from '../hikes/categories.json'

class TourDetailPage extends Component {
  static async getInitialProps({query}) {
    try {
      // const res = await axios.get(
      //   `/api/v1_1/hike/tour/${query.tour}/details`,
      // );

  let data = categories
  .filter((element) => 
    element.categoryTours.some((subElement) => subElement.alias == `hikes/tour/${query.tour}`))
  .map(element => {
    return Object.assign({}, element, {categoryTours : element.categoryTours.filter(subElement => subElement.alias == `hikes/tour/${query.tour}`)});

  }); 

      return { tour: {tourDetails: data[0].categoryTours[0]} };

    } catch (error) {
      return { error: true };
    }
  }

  getPostMessage = () => {
    const  tourDetails  = this.props?.tour?.tourDetails;
    const date = new Date();
    return {
      namespace: 'hike',
      msg_id: `id_${date.getTime()}`,
      msg_type: 'POST',
      request: {
        context: 'tour',
        category: tourDetails.category,
        title: tourDetails.title,
        checksum: tourDetails.checksum,
        download_url: `${tourDetails.fileURL}?agent=viz`,
        version: tourDetails.hikeVersion,
        filename: tourDetails.fileName,
        kuid: tourDetails.kuid,
        id: `${tourDetails.nid}${tourDetails.fid}${date.getTime()}`,
      },
    };
  }

  sendPostMessage(e) {
    e.preventDefault();
    e.message = this.getPostMessage();
    if (typeof e.message !== 'undefined') {
      parent.postMessage(e.message, '*');
      console.log(e.message)
    }
    return false;
  }

  render() {
    const tourDetails  = this.props?.tour?.tourDetails;
    const {query}= this.props.url;
    const search = query.search !== undefined && query.search !== null
      ? query.search
      : null;

 

    
    return (
      <div className={styles.hikeBody}>
        <HikeHeader search={false} />
        <div className={styles.tourContainer}>
          <HikeBreadCrumb
            title={tourDetails?.title}
            search={search}
          />
          <div className={styles.tourInfo}>
            <div className={styles.tourThumb}>
              <img src={tourDetails?.image} alt="Hike Thumbnail" />
            </div>
            <div className={styles.tourDesc}>
              <h2 className={styles.tourTitle}>{tourDetails?.title}</h2>
              <h3 className={styles.tourVersion}>Hike Version: {tourDetails?.hikeVersion}</h3>
              <div
                className={styles.tourBody}
                dangerouslySetInnerHTML={{ __html: tourDetails?.description }}
              />
              <Row className={styles.metaData}>
                <Col
                  span={6}
                   sm={24}
                   xs={24}
                   md={6}
                   lg={6}
                   className={styles.innerTabWrapper}
                >
                  <h3 className={styles.tourHeader}>
                    Platform Version
                  </h3>
                  <div className={styles.tourContent}>
                    {
                      tourDetails?.platformVersion
                    }
                  </div>
                </Col>
                <Col
                  span={6}
                  sm={24}
                  xs={24}
                  md={6}
                  lg={6}
                  className={styles.innerTabWrapper}
                >
                  <h3 className={styles.tourHeader}>
                    Categories
                  </h3>
                  <ul className={styles.tourContent}>
                    {
                      tourDetails?.category?.map(cat => (
                        <li>{cat}</li>
                      ))
                    }
                  </ul>
                </Col>
              </Row>
              <h3 className={styles.tourTime}>
                {
                  `${tourDetails?.cards} Steps - ${tourDetails?.time}`
                }
              </h3>
              <div
                className={styles.tourDetails}
                dangerouslySetInnerHTML={{ __html: tourDetails?.details }}
              />
            </div>
          </div>
          <div className={styles.startBtn}>
            <KonyButton title="START" type="blue" onClick={(e) => this.sendPostMessage(e)} />
          </div>
        </div>
      </div>
    );
  }
}

export default TourDetailPage;
