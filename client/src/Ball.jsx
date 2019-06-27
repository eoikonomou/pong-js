import React from 'react';
import PropTypes from 'prop-types';

function Ball({ top, left }) {
  return <div className="Ball" style={{ top, left }} />;
}

Ball.propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
};

export default Ball;
