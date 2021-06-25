import React from 'react';
import style from './style.scss';
import KonyButton from '../KonyButton';

const CoreAssetLabel = ({isLogin}) => (
  <KonyButton
    title="Available in Fabric"
    className={`${style.assetButtons} ${style.transparentBg} ${style.coreAsset} ${isLogin ? style.pushLeft : null}`} 
  />
);

export default  CoreAssetLabel;
