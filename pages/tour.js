import React, { Component } from 'react';
import { instance as axios } from '../src/utils/initialize';
import HikeHeader from '../src/components/HikeHeader';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import HikeBreadCrumb from '../src/components/HikeBreadCrumb';
import KonyButton from '../src/components/KonyButton';
import styles from './style.scss';
import categories from '../hikes/categories.json'


export default function Tour(props) {
  const paths = props.url.asPath.split('/')
  const url = paths[paths.length - 1]

  let data = categories
  .filter((element) => 
    element.categoryTours.some((subElement) => subElement.alias == `hikes/tour/${url}`))
  .map(element => {
    return Object.assign({}, element, {categoryTours : element.categoryTours.filter(subElement => subElement.alias == `hikes/tour/${url}`)});

  }); 

  const tourDetails  = data[0].categoryTours[0];
  const search = null;

  let tours = {};

  categories.forEach(category => {
    category.categoryTours.forEach(t => {
      tours[`/${t.alias}`] = { page: "/tour" }
    })
  })

  // console.log(tours)

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
  )
}
