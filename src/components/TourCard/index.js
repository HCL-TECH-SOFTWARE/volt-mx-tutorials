import React, { Component } from "react";
import i18next from 'i18next';
import Col from "antd/lib/col";
import Link from "next/link";
import PropTypes from "prop-types";
import style from "./style.scss";
import { truncateAdvance } from "../../utils";
import { BASE_PATH_URL } from "../../config";

const isProdUrl =
  process.env.NODE_ENV === "production" ? `${BASE_PATH_URL}/` : "";

const TourCard = ({ tour, dbx, search }) => {

  return (
    <Col sm={8} xs={24}>
      <div className={style.tour}>
        {search !== undefined && search !== null ? (
          <Link
            href={{
              pathname: `${isProdUrl}${tour.alias}`,
              query: {
                search: search,
                lang: i18next.language,
              },
            }}
          >
            <div className={style.info}>
              <h2 className={`${style.title} ${dbx ? style.dbxColor : ""} `}>
                {truncateAdvance(i18next.t(tour.title), 34)}
              </h2>
              <p className={style.desc}>{i18next.t(tour.description)}</p>
              <p className={style.meta}>{`${i18next.t(`step`, {count: tour.cards})} / ${i18next.t(tour.time)}`}</p>
            </div>
          </Link>
        ) : (
          <Link 
              href={{
              pathname: `${isProdUrl}${tour.alias}`,
              query:{
                lang: i18next.language,
              }
            }}
          >
            <div className={style.info}>
              <h2 className={`${style.title} ${dbx ? style.dbxColor : ""} `}>
                {truncateAdvance(i18next.t(tour.title), 34)}
              </h2>
              <p className={style.desc}>{i18next.t(tour.description)}</p>
              <p className={style.meta}>{`${i18next.t(`step`, {count: tour.cards})} / ${i18next.t(tour.time)}`}</p>
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

export default TourCard;
