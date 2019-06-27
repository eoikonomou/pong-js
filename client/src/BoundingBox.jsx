import React from 'react';
import PropTypes from 'prop-types';

function BoundingBox({ children }) {
  return (
    <div className="BoundingBox">
      {children}
    </div>
  );
}

BoundingBox.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default BoundingBox;
