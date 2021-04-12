import React from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Icon from 'antd/lib/icon';
import KonyButton from '../KonyButton/index';
import style from './style.scss';

const SuccessModal = ({ handleClick, message, error }) => (
  <Row className={style.successModalContent}>
    <Col span={24}>
      {error ? <Icon type="warning" theme="filled" style={{ color: 'red' }} />
        : <Icon type="check-circle" theme="filled" />
      }
    </Col>
    <Col span={24}>
      <h3>
        { message }
      </h3>
    </Col>
    { !error ? (
      <Col span={24}>
        <h5>We will contact you soon..</h5>
      </Col>
    ) : null }

    <Col span={24}>
      <KonyButton
        type="action"
        color="blue"
        onClick={e => handleClick(e)}
        title="Done"
      />
    </Col>
  </Row>
);

SuccessModal.propTypes = {
  handleClick: PropTypes.func,
  message: PropTypes.string,
  error: PropTypes.bool,
};

SuccessModal.defaultProps = {
  handleClick: null,
  message: 'Thanks for reaching out!',
  error: false,
};

export default SuccessModal;
