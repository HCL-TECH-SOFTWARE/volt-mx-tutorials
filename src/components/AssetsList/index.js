import React, { Component } from 'react';
import Row from 'antd/lib/row';
import Link from 'next/link';
import PropTypes from 'prop-types';
import style from './style.scss';
import AssetCard from '../AssetCard';
import { getUrl } from '../../utils/initialize';

export default class AssetsList extends Component {
  handleSelect = (e) => {
    e.preventDefault();
  };

  render() {
    const {
      assets, title, slug, type,
    } = this.props;
    let localSlug = slug;
    if (type === 'channels') {
      localSlug = title;
    }
    return (
      <div className="domainListWrapper">
        <Row gutter={16} className={style.domainTitleWrapper}>
          <h1 className={style.title}>{title}</h1>
          <Link href={getUrl(`/${type}/${localSlug}`)}>
            <a className={style.seeAll}>
              See All
            </a>
          </Link>
        </Row>
        <div className={style.assetCardListWrapper}>
          {assets.map(asset => (
            <div key={asset.ID} className={style.assetCardContainer}>
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

AssetsList.propTypes = {
  assets: PropTypes.array,
  title: PropTypes.string,
};

AssetsList.defaultProps = {
  title: '',
  assets: [],
};
