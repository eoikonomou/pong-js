import React from 'react';
import PropTypes from 'prop-types';

class Paddle extends React.Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    user: PropTypes.string,
    pad: PropTypes.string.isRequired,
    socket: PropTypes.objectOf(PropTypes.any).isRequired,
    maxPaddingHeight: PropTypes.number.isRequired,
  };

  static defaultProps = {
    user: null,
  };

  componentDidMount() {
    document.addEventListener('mousemove', ({ clientY }) => {
      const {
        user,
        pad,
        socket,
        maxPaddingHeight,
      } = this.props;
      if (user === pad) {
        socket.emit('paddlePosition', Math.min(1, clientY / maxPaddingHeight));
      }
    });
  }

  render() {
    const { y, x } = this.props;
    return (
      <div className="Paddle" style={{ top: `${y}px`, left: `${x}px` }} />
    );
  }
}

export default Paddle;
