const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

var score = { P1: 0, P2: 0 };
var players = { P1: null, P2: null };
var ball = { x: 0.5, y: 0.5, xSpeed: 0.001, ySpeed: 0.001 };

io.on("connection", socket => {
  var currentPLayer = null;
  if (players.P1 === null) {
    players.P1 = { user: "P1" };
    console.log("Player1 connected");
    currentPLayer = "P1";
  } else if (players.P2 === null) {
    players.P2 = { user: "P2" };
    console.log("Player2 connected");
    currentPLayer = "P2";
  }
  if (currentPLayer !== null) {
    socket.emit("userConnection", currentPLayer);
    socket.on("paddlePosition", y => {
      players[currentPLayer].y = y;
      var p1y = players.P1 == null ? 0 : players.P1.y;
      var p2y = players.P2 == null ? 0 : players.P2.y;
      io.emit("paddles", { P1: p1y, P2: p2y });
    });
    socket.emit("score", score);
    if (players.P1 !== null && players.P2 !== null) {
      io.emit("ballStartingPosition", { x: ball.x, y: ball.y });
      setInterval(() => {
        if (ball.x >= 1 || ball.x <= 0) {
          changeBallDirection();
        }
        if (ball.y >= 1 || ball.y <= 0) {
          ball.ySpeed = Number((-ball.ySpeed).toFixed(4));
        }
        ball.x = Number((ball.x + ball.xSpeed).toFixed(4));
        ball.y = Number((ball.y + ball.ySpeed).toFixed(4));
        if (ball.x <= 0) {
          const p1y = players.P1 === null ? 0 : players.P1.y * 0.92;
          const distance = Math.abs(ball.y * 0.97 + 0.015 - p1y - 0.04);
          if (distance >= 0 && distance <= 0.055) {
          } else {
            p2Goal();
          }
        }
        if (ball.x >= 1) {
          const p2y = players.P2 === null ? 0 : players.P2.y * 0.92;
          const distance = Math.abs(ball.y * 0.97 + 0.015 - p2y - 0.04);
          if (distance >= 0 && distance <= 0.055) {
          } else {
            p1Goal();
          }
        }
        io.emit("ballMovement", { x: ball.x, y: ball.y });
      }, 5);
    }
  }

  socket.on("disconnect", () => {
    players[currentPLayer] = null;
    console.log(`player ${currentPLayer} disconnected `);
    currentPLayer = null;
    resetBall();
  });
});

function resetBall() {
  ball.xSpeed = 0;
  ball.ySpeed = 0;
  ball.x = 0.5;
  ball.y = 0.5;
  if (players.P1 !== null && players.P2 !== null) {
    setTimeout(startBallMotion, 3000);
  }
}

function startBallMotion() {
  const xDirection = Math.random() > 0.5 ? 1 : -1;
  const yDirection = Math.random() > 0.5 ? 1 : -1;

  const random = Math.random();

  ball.xSpeed = xDirection * random * 0.0019 + 0.0001;
  ball.ySpeed = yDirection * (0.002 - Math.abs(ball.xSpeed));
}

function p1Goal() {
  resetBall();
  score.P1 += 1;
  io.emit("score", score);
}

function p2Goal() {
  resetBall();
  score.P2 += 1;
  io.emit("score", score);
}

function changeBallDirection() {
  if (ball.x <= 0) {
    const p1y = players.P1.y === null ? 0 : players.P1.y * 0.92;
    ball.x = 0.0001;
    const distancePercentage = Number(
      Number(
        Number(Math.abs(ball.y * 0.97 + 0.015 - p1y - 0.04).toFixed(4)) / 0.055
      ).toFixed(2)
    );
    ball.xSpeed = 0.001 - Number((distancePercentage * 0.001).toFixed(4));
    const yDirection = ball.ySpeed > 0 ? 1 : -1;
    ball.ySpeed = yDirection * (0.002 - ball.xSpeed);
  } else if (ball.x >= 1) {
    ball.x = 1;
    const p2y = players.P2.y === null ? 0 : players.P2.y * 0.92;
    const distancePercentage = Number(
      Number(
        Number(Math.abs(ball.y * 0.97 + 0.015 - p2y - 0.04).toFixed(4)) / 0.055
      ).toFixed(2)
    );
    ball.xSpeed = -(0.001 - Number((distancePercentage * 0.0005).toFixed(4)));
    const yDirection = ball.ySpeed > 0 ? 1 : -1;
    ball.ySpeed = yDirection * (0.002 + ball.xSpeed);
  }
}

server.on("error", err => {
  console.error("Server error:", err);
});

server.listen(8080, () => {
  console.log("Pong Client started on 8080");
});
