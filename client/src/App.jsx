import React from 'react';
import socketIOClient from 'socket.io-client';
import ScoreBoard from './ScoreBoard';
import BoundingBox from './BoundingBox';
import Paddle from './Paddle';
import Ball from './Ball';
import Net from './Net';

const serverURL = 'localhost:8080';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ball: { y: 0, x: 0 },
      user: null,
      pad1y: 1,
      pad2y: 1,
      score: { P1: 0, P2: 0 },
    };
    this.socket = null;
  }

  componentDidMount() {
    this.socket = socketIOClient(serverURL);
    this.socket.on('userConnection', (userName) => {
      this.setState({ user: userName });
    });
    this.socket.on('paddles', (paddles) => {
      this.setState({ pad1y: paddles.P1, pad2y: paddles.P2 });
    });
    this.socket.on('score', (score) => {
      this.setState({ score });
    });
    this.socket.on('ballMovement', (ballPosition) => {
      this.setState({ ball: ballPosition });
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    const width = window.innerWidth - 180;
    const height = window.innerHeight - 60;
    const maxPaddingHeight = height * 0.92;
    const maxBallHeight = height * 0.97;
    const maxBallWidth = width - height * 0.03;
    const ballSize = (
      window.innerHeight > window.innerWidth
        ? window.innerWidth / 1920
        : window.innerHeight / 1080
    ) * 24;
    const {
      score,
      user,
      pad1y,
      pad2y,
      ball,
    } = this.state;
    return (
      <div className="App">
        <ScoreBoard score={score} />
        <BoundingBox>
          <Paddle
            pad="P1"
            maxPaddingHeight={maxPaddingHeight}
            socket={this.socket}
            user={user}
            x={0}
            y={pad1y * maxPaddingHeight}
          />
          <Ball
            size={ballSize}
            left={ball.x * maxBallWidth}
            top={ball.y * maxBallHeight}
            maxBallHeight={1}
            minBallHeight={0}
            maxBallWidth={1}
            minBallWidth={0}
          />
          <Paddle
            pad="P2"
            maxPaddingHeight={maxPaddingHeight}
            socket={this.socket}
            user={user}
            x={width * 0.994}
            y={pad2y * maxPaddingHeight}
          />
          <Net />
        </BoundingBox>
      </div>
    );
  }
}

export default App;
