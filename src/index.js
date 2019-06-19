import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";

import "./styles.css";

function Board({ width = 600, height = 600, ...props }) {
  const Layout = styled.div`
    width: ${width}px;
    height: ${height}px;
  `;
  return <Layout>{props.children}</Layout>;
}

function Hex({
  boardHeight = 600,
  boardWidth = 600,
  coordinates = { x: 0, y: 0, z: 0 },
}) {
  const isOnAxis = {
    x: coordinates.y === 0 && coordinates.z === 0,
    y: coordinates.x === 0 && coordinates.z === 0,
    z: coordinates.x === 0 && coordinates.y === 0,
  };
  const hexWidth = boardWidth / 7;
  const hexHeight = (hexWidth * Math.sqrt(3)) / 2;
  const centerOffset = {
    horizontal: 0,
    vertical: (hexHeight - 2) * -coordinates.x,
  };
  const hexCenter = {
    horizontal: boardWidth / 2 + centerOffset.horizontal,
    vertical: boardHeight / 2 + centerOffset.vertical,
  };
  const hexOffset = {
    vertical: -hexHeight / 2,
    horizontal: -hexWidth / 2,
  };
  // 1/2 hex height + 3/4 hex width
  const HexSvg = styled.svg`
    height: ${hexHeight}px;
    width: ${hexWidth}px;
    position: absolute;
    top: ${hexCenter.vertical + hexOffset.vertical}px;
    left: ${hexCenter.horizontal + hexOffset.horizontal}px;
  `;
  const HexPolygon = styled.polygon`
    fill: transparent;
    fill: ${isOnAxis.x && "rgba(231,29,54,0.2)"};
    fill: ${isOnAxis.y && "rgba(140,215,144,0.2)"};
    fill: ${isOnAxis.z && "rgba(48,162,222,0.2)"};
    fill: ${isOnAxis.x && isOnAxis.y && isOnAxis.z && "rgba(255,201,82,0.4)"};
    stroke: #000000;
    stroke-width: "4px";
  `;
  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
  };

  return (
    <HexSvg {...svgProps} viewBox="0 0 300 260">
      <HexPolygon points="296,130 225,256 75,256 4,130 75,4 225,4" />
      <text x="50%" y="25%" fill="red" textAnchor="middle" fontSize="48px">
        {coordinates.x}
      </text>
      <text x="72%" y="72%" fill="green" textAnchor="middle" fontSize="48px">
        {coordinates.y}
      </text>
      <text x="28%" y="72%" fill="blue" textAnchor="middle" fontSize="48px">
        {coordinates.z}
      </text>
    </HexSvg>
  );
}

function App() {
  return (
    <Board>
      <Hex coordinates={{ x: -3, y: 0, z: 0 }} />
      <Hex coordinates={{ x: -2, y: 0, z: 0 }} />
      <Hex coordinates={{ x: -1, y: 0, z: 0 }} />
      <Hex coordinates={{ x: 0, y: 0, z: 0 }} />
      <Hex coordinates={{ x: 1, y: 0, z: 0 }} />
      <Hex coordinates={{ x: 2, y: 0, z: 0 }} />
      <Hex coordinates={{ x: 3, y: 0, z: 0 }} />
      {/* <Hex coordinates={{ x: 0, y: 0, z: 1 }} /> */}
    </Board>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
