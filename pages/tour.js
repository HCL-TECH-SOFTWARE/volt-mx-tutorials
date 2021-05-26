import React, { Component, useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HikeHeader from "../src/components/HikeHeader";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import HikeBreadCrumb from "../src/components/HikeBreadCrumb";
import KonyButton from "../src/components/KonyButton";
import styles from "./style.scss";
import getConfig from "next/config";
import nextI18NextConfig from '../next-i18next.config.js';
const {
  publicRuntimeConfig: { hikesData },
} = getConfig();
import { getHikesCategories } from "../src/utils/populate";
import { isDev, BASE_PATH_URL } from "../src/config";
import { getZipDownloadUrl } from "../src/utils/request";

const TourDetailPage = ({ url }) => {
  const [tourDetails, setTourDetails] = useState(null);
  const [categoryAlias, setcategoryAlias] = useState(null);
  const { t } = useTranslation();

  const getToursData = async () => {
    // get specific tour url
    const urlTour = isDev
      ? url.asPath.substring(1)
      : url.asPath.replace(`/${BASE_PATH_URL}`, "").substring(1);

    const categories = await getHikesCategories(hikesData);

    const categoryTours = categories.filter((element) =>
      element.categoryTours.some((subElement) => subElement.alias == urlTour)
    );

    setcategoryAlias(categoryTours[0].categoryAlias);

    const tours = categoryTours.map((element) => {
      return Object.assign({}, element, {
        categoryTours: element.categoryTours,
      });
    })[0];

    const toursData = tours.categoryTours.filter(
      (subElement) => subElement.alias == urlTour
    )[0];

    setTourDetails(toursData);
  };

  useEffect(() => {
    getToursData();
    return () => {};
  }, []);

  const getPostMessage = () => {
    const date = new Date();

    const fileURL = getZipDownloadUrl(tourDetails?.fileName, categoryAlias);

    return {
      namespace: "hike",
      msg_id: `id_${date.getTime()}`,
      msg_type: "POST",
      request: {
        context: "tour",
        category: tourDetails?.category,
        title: tourDetails?.title,
        checksum: tourDetails?.checksum,
        download_url: fileURL,
        version: tourDetails?.hikeVersion,
        filename: tourDetails?.fileName,
        kuid: tourDetails?.kuid,
        id: `${tourDetails?.nid}${tourDetails?.fid}${date.getTime()}`,
      },
    };
  };

  const sendPostMessage = (e) => {
    e.preventDefault();
    e.message = getPostMessage();

    if (typeof e.message !== "undefined") {
      console.log(e.message);

      getVizSource().postMessage(e.message, "*");
    }

    return false;
  };

  const tourImage = isDev
    ? tourDetails?.image
    : `/${BASE_PATH_URL}${tourDetails?.image}`;

  return (
    <div className={styles.hikeBody}>
      <HikeHeader search={null} />
      <div className={styles.tourContainer}>
        <HikeBreadCrumb title={t(tourDetails?.title)} search={null} />
        <div className={styles.tourInfo}>
          <div className={styles.tourThumb}>
            <img src={tourImage} alt="Hike Thumbnail" />
          </div>
          <div className={styles.tourDesc}>
            <h2 className={styles.tourTitle}>{t(tourDetails?.title)}</h2>
            <h3 className={styles.tourVersion}>{`${t('hike_version')} ${tourDetails?.hikeVersion}`}</h3>
            <div
              className={styles.tourBody}
              dangerouslySetInnerHTML={{ __html: t(tourDetails?.description) }}
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
                <h3 className={styles.tourHeader}>{t('platform_version')}</h3>
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
                <h3 className={styles.tourHeader}>{t('categories')}</h3>
                <ul className={styles.tourContent}>
                  {tourDetails?.category?.map((cat) => <li>{cat}</li>)}
                </ul>
              </Col>
            </Row>
            <h3 className={styles.tourTime}>
            {`${t(`step`, {count: tourDetails?.cards})} / ${t(tourDetails?.time)}`}
            </h3>
            <div
              className={styles.tourDetails}
              dangerouslySetInnerHTML={{ __html: t(tourDetails?.details) }}
            />
          </div>
        </div>
        <div className={styles.startBtn}>
          <KonyButton
            title={t('start')}
            type="blue"
            onClick={(e) => sendPostMessage(e)}
          />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale || nextI18NextConfig.i18n.defaultLocale, ['common'], nextI18NextConfig),
  },
});

export default TourDetailPage;
