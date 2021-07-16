import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import HikeHeader from '../src/components/HikeHeader';
import HikeBreadCrumb from '../src/components/HikeBreadCrumb';
import KonyButton from '../src/components/KonyButton';
import styles from './style.scss';
import { isDev, BASE_PATH_URL } from '../src/config';
import { getMapCategories } from '../src/utils/populate';
import { getZipDownloadUrl } from '../src/utils/request';
import i18next from '../i18n';


const propTypes = {
  url: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  previewData: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const TourDetailPage = ({ url, previewData }) => {
  const [tourDetails, setTourDetails] = useState(null);
  const [categoryAlias, setcategoryAlias] = useState(null);

  const isPreview = url.asPath === 'preview';

  const getToursData = async () => {
    // get specific tour url
    if (isPreview) {
      setTourDetails({
        ...previewData,
        category: [previewData.category],
      });
    } else {
      const urlTour = isDev
        ? url.asPath.substring(1).replace(/\?lang=.*/, '')
        : url.asPath.replace(`/${BASE_PATH_URL}`, '').substring(1).replace(/\?lang=.*/, '');

      const categories = await getMapCategories();

      const categoryTours = categories.filter(
        element => element.categoryTours.some(subElement => subElement.alias === urlTour),
      );

      setcategoryAlias(categoryTours[0].categoryAlias);

      const tours = categoryTours.map(element => Object.assign({}, element, {
        categoryTours: element.categoryTours,
      }))[0];

      const toursData = tours.categoryTours.filter(
        subElement => subElement.alias === urlTour,
      )[0];

      setTourDetails(toursData);
    }
  };

  useEffect(
    () => {
      getToursData();
      return () => {};
    },
    [previewData],
  );

  const getPostMessage = () => {
    const date = new Date();

    const fileURL = getZipDownloadUrl(tourDetails?.fileName, categoryAlias);

    return {
      namespace: 'hike',
      msg_id: `id_${date.getTime()}`,
      msg_type: 'POST',
      request: {
        context: 'tour',
        category: tourDetails?.category,
        title: tourDetails?.title,
        checksum: tourDetails?.checksum,
        download_url: fileURL,
        version: tourDetails?.hikeVersion,
        filename: tourDetails?.fileName,
        kuid: tourDetails?.kuid,
        id: `${date.getTime()}`,
        langid: i18next.language,
      },
    };
  };

  const sendPostMessage = (e) => {
    e.preventDefault();
    e.message = getPostMessage();

    if (typeof e.message !== 'undefined') {
      console.log(e.message);

      getVizSource().postMessage(e.message, '*');
    }

    return false;
  };

  const tourImage = isDev
    ? tourDetails?.image
    : `/${BASE_PATH_URL}${tourDetails?.image}`;

  return (
    <div className={isPreview ? styles.toursDetailPreview : styles.hikeBody}>
      {/* <h1>{JSON.stringify(url)}</h1> */}
      {isPreview || <HikeHeader search={null} />}

      <div className={styles.tourContainer}>
        {isPreview || (
          <HikeBreadCrumb title={tourDetails?.title} search={null} />
        )}
        <div className={styles.tourInfo}>
          <div className={styles.tourThumb}>
            <img
              src={isPreview ? '/default/hike-default.png' : tourImage}
              alt="Hike Thumbnail"
            />
          </div>
          <div className={styles.tourDesc}>
            <h2 className={styles.tourTitle}>{tourDetails?.title}</h2>
            <h3 className={styles.tourVersion}>{`${i18next.t('hike_version')} ${tourDetails?.hikeVersion}`}</h3>
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
                <h3 className={styles.tourHeader}>{i18next.t('platform_version')}</h3>
                <div className={styles.tourContent}>
                  {tourDetails?.platformVersion}
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
                <h3 className={styles.tourHeader}>{i18next.t('categories')}</h3>
                <ul className={styles.tourContent}>
                  {tourDetails?.category?.map(cat => <li>{cat}</li>)}
                </ul>
              </Col>
            </Row>
            <h3 className={styles.tourTime}>
              {`${i18next.t('step', { count: tourDetails?.cards })} / ${tourDetails?.time}`}
            </h3>
            <div
              className={styles.tourDetails}
              dangerouslySetInnerHTML={{ __html: tourDetails?.details }}
            />
          </div>
        </div>
        {isPreview || (
          <div className={styles.startBtn}>
            <KonyButton
              title={i18next.t('start')}
              type="blue"
              onClick={e => sendPostMessage(e)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

TourDetailPage.propTypes = propTypes;

export default TourDetailPage;
