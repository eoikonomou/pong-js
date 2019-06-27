import React from 'react';
import PropTypes from 'prop-types';

function Score({ style, score }) {
  return (
    <div className="Score" style={style}>
      {score.toString().padStart(2, '0')}
    </div>
  );
}

Score.propTypes = {
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  ),
  score: PropTypes.number,
};

Score.defaultProps = {
  style: {},
  score: 0,
};

export default Score;
