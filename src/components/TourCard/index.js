import React, { Component } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Col from "antd/lib/col";
import Link from "next/link";
import PropTypes from "prop-types";
import style from "./style.scss";
import { truncateAdvance } from "../../utils";
import { BASE_PATH_URL } from "../../config";
import nextI18NextConfig from '../../../next-i18next.config.js';

const isProdUrl =
  process.env.NODE_ENV === "production" ? `${BASE_PATH_URL}/` : "";

const TourCard = ({ tour, dbx, search }) => {
  const { t } = useTranslation(); 

  return (
    <Col sm={8} xs={24}>
      <div className={style.tour}>
        {search !== undefined && search !== null ? (
          <Link
            href={{
              pathname: `${isProdUrl}${tour.alias}`,
              query: {
                search: search,
              },
            }}
          >
            <div className={style.info}>
              <h2 className={`${style.title} ${dbx ? style.dbxColor : ""} `}>
                {truncateAdvance(t(tour.title), 34)}
              </h2>
              <p className={style.desc}>{t(tour.description)}</p>
              <p className={style.meta}>{`${t(`step`, {count: tour.cards})} / ${t(tour.time)}`}</p>
            </div>
          </Link>
        ) : (
          <Link href={`${isProdUrl}${tour.alias}`}>
            <div className={style.info}>
              <h2 className={`${style.title} ${dbx ? style.dbxColor : ""} `}>
                {truncateAdvance(t(tour.title), 34)}
              </h2>
              <p className={style.desc}>{t(tour.description)}</p>
              <p className={style.meta}>{`${t(`step`, {count: tour.cards})} / ${t(tour.time)}`}</p>
            </div>
          </Link>
        )}
      </div>
    </Col>
  )
};

TourCard.propTypes = {
  tour: PropTypes.object,
  dbx: PropTypes.bool,
};

TourCard.defaultProps = {
  tour: {},
  dbx: false,
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale || nextI18NextConfig.i18n.defaultLocale, ['common'], nextI18NextConfig),
  },
});

export default TourCard;
