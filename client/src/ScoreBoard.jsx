import React from 'react';
import PropTypes from 'prop-types';
import Score from './Score';

function ScoreBoard({ score }) {
  return (
    <div className="ScoreBoard">
      <div className="Side">
        <div className="Player">P1</div>
        <Score score={score.P1}> </Score>
      </div>
      <div className="Side">
        <div className="Player">P2</div>
        <Score score={score.P2}> </Score>
      </div>
    </div>
  );
}

ScoreBoard.propTypes = {
  score: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default ScoreBoard;
