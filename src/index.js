import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { range } from "ramda";

function Board({ radius, ...props }) {
  const Layout = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
  `;
  // Create a coordinate set for each hex cell
  const drip = (from, fromSign, into, intoSign, prev) => {
    if (!typeof from === "string" || from.length > 2 || from.length <= 0)
      throw new Error(
        `From must be one of the following strings: "x", "y", "z", "-x", "-y", "-z"`,
      );
    const incr = val => val + 1;
    const decr = val => val - 1;
    const fromOperator = fromSign === "+" ? decr : incr;
    const intoOperator = intoSign === "+" ? incr : decr;
    const newCoord = {
      ...prev,
      [from]: fromOperator(prev[from]),
      [into]: intoOperator(prev[into]),
    };
    return newCoord;
  };

  const drain = (from, into, currentRadius, initialCoord) => {
    const fromSign = from.length === 1 ? "+" : from.charAt(0);
    const intoSign = into.length === 1 ? "+" : into.charAt(0);
    from = from.charAt(from.length - 1);
    into = into.charAt(into.length - 1);
    const initial = initialCoord || {
      x: 0,
      y: 0,
      z: 0,
      [from]: currentRadius * (fromSign === "+" ? 1 : -1),
    };
    const coords = [initial];
    let shouldContinue = true;
    while (shouldContinue) {
      if (coords.length === 0) coords.push(initial);
      const prevCoord = coords[coords.length - 1];
      const coord = drip(from, fromSign, into, intoSign, prevCoord);
      coords.push(coord);
      const distanceFromZero = Math.abs(coord[from]);
      if (distanceFromZero <= 1) {
        shouldContinue = false;
      }
    }
    return currentRadius !== 1 ? coords : coords.slice(1);
  };
  function createHexRing(radius) {
    let hexCoords = [];
    hexCoords = hexCoords.concat(drain("+y", "+x", radius));
    hexCoords = hexCoords.concat(drain("+x", "+z", radius));
    hexCoords = hexCoords.concat(drain("+z", "-y", radius));
    hexCoords = hexCoords.concat(drain("-y", "-x", radius));
    hexCoords = hexCoords.concat(drain("-x", "-z", radius));
    hexCoords = hexCoords.concat(drain("-z", "+y", radius));
    console.log(`coords for ring(${radius})`, hexCoords);
    return hexCoords;
  }
  function createHexes() {
    const center = { x: 0, y: 0, z: 0 };
    let coords = [center];
    for (const currentRing of range(1, radius + 1)) {
      coords = coords.concat(createHexRing(currentRing));
    }
    return coords;
  }
  const allHexCoords = createHexes();

  return (
    <Layout>
      {allHexCoords.map(coords => (
        <Hex key={`${coords.x}.${coords.y}.${coords.z}`} coordinates={coords} />
      ))}
    </Layout>
  );
}

function useHover() {
  // onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp
  // const hoverRef = React.useRef();
  const [hoverState, setHoverState] = React.useState({
    isHovered: false,
  });
  const hoverProps = {
    // onMouseDown: e => {},
    onMouseEnter: e => {
      setHoverState(state => ({
        ...state,
        isHovered: true,
      }));
    },
    onMouseLeave: e => {
      setHoverState(state => ({
        ...state,
        isHovered: false,
      }));
    },
    onMouseMove: e => {
      // console.log("onMouseMove", e.target);
    },
    onMouseOut: e => {
      // console.log("onMouseOut", e.target);
    },
    onMouseOver: e => {
      // console.log("onMouseOver", e.target);
    },
    onMouseUp: e => {
      // console.log("onMouseUp", e.target);
    },
  };
  return [hoverState, hoverProps];
}

function Hex({
  boardHeight = 600,
  boardWidth = 600,
  coordinates = { x: 0, y: 0, z: 0 },
}) {
  const [hoverState, hoverProps] = useHover();
  const { isHovered } = hoverState;
  const isOnAxis = {
    x: coordinates.y === 0 && coordinates.z === 0,
    y: coordinates.x === 0 && coordinates.z === 0,
    z: coordinates.x === 0 && coordinates.y === 0,
  };
  const hexWidth = boardWidth / 9;
  const hexHeight = (hexWidth * Math.sqrt(3)) / 2;
  const centerOffset = {
    horizontal:
      0 * coordinates.x +
      -1 * 0.75 * (hexWidth - 2) * coordinates.y +
      0.75 * (hexWidth - 2) * coordinates.z,
    vertical:
      -1 * (hexHeight - 2) * coordinates.x +
      ((-1 * hexHeight + 2) / 2) * coordinates.y +
      ((-1 * hexHeight + 2) / 2) * coordinates.z,
  };
  const hexCenter = {
    horizontal: boardWidth / 2 + centerOffset.horizontal,
    vertical: boardHeight / 2 + centerOffset.vertical,
  };
  const hexOffset = {
    vertical: -hexHeight / 2,
    horizontal: -hexWidth / 2,
  };
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
    /* fill: ${isHovered && "rgba(241,92,92,0.4)"} */
    stroke: #000000;
    stroke-width: "1px";
  `;
  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    version: "1.1",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
  };

  return (
    <HexSvg {...svgProps} {...hoverProps} viewBox="0 0 300 260">
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
  return <Board radius={5} />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
