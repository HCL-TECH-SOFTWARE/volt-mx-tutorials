import React, { Component, useEffect, useState } from 'react';
import { instance as axios } from '../src/utils/initialize';
import HikeHeader from '../src/components/HikeHeader';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import HikeBreadCrumb from '../src/components/HikeBreadCrumb';
import KonyButton from '../src/components/KonyButton';
import styles from './style.scss';
import getConfig from 'next/config';
const { publicRuntimeConfig: { hikesData } } = getConfig();
import { getHikesCategories } from '../src/utils/populate'
import { dev } from '../src/config'

const TourDetailPage = ({ url }) => {

  const [tourDetails, setToursDetails] = useState(null);

  const getToursData = async () => {

  const urlTour = dev ? url.asPath.substring(1) : url.asPath.replace('/volt-mx-tutorials', '');

  const categories = await getHikesCategories(hikesData);
  const data = categories.filter((element) =>  element.categoryTours.some((subElement) => subElement.alias == urlTour))

  const d =  data.map(element => {
    return Object.assign({}, element, {categoryTours : element.categoryTours }) })

  const dx = d[0].categoryTours.filter(subElement => subElement.alias == urlTour);

  setToursDetails(dx[0]);

  }

  useEffect(() => {
    getToursData();
    return () => {
    }
  }, []);
  
  const getPostMessage = () => {
    const date = new Date();
    return {
      namespace: 'hike',
      msg_id: `id_${date.getTime()}`,
      msg_type: 'POST',
      request: {
        context: 'tour',
        category: tourDetails?.category,
        title: tourDetails?.title,
        checksum: tourDetails?.checksum,
        download_url: `${tourDetails?.fileURL}`,
        version: tourDetails?.hikeVersion,
        filename: tourDetails?.fileName,
        kuid: tourDetails?.kuid,
        id: `${tourDetails?.nid}${tourDetails?.fid}${date.getTime()}`,
      },
    };
  }

  const sendPostMessage = (e) => {
    e.preventDefault();
    e.message = getPostMessage();

    if (typeof e.message !== 'undefined') {
      
      getVizSource().postMessage(e.message, '*');
    }

    return false;
  }

    return (
      <div className={styles.hikeBody}>
        <HikeHeader search={null} />
        <div className={styles.tourContainer}>
          <HikeBreadCrumb
            title={tourDetails?.title}
            search={null}
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
            <KonyButton title="START" type="blue" onClick={(e) => sendPostMessage(e)} />
          </div>
        </div>
      </div>
    );
}

export default TourDetailPage;
