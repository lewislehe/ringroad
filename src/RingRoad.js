import React, { useEffect, useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import colors from "material-colors";
import styled from "@emotion/styled";
import { ROAD_LENGTH } from "./constants";
import { transition } from "d3-transition";
import { select } from "d3-selection";
import * as ease from "d3-ease";
import { timeout } from "d3-timer";

const R = 300,
  M = 20,
  viewbox = [-R - M, -R - M, 2 * (R + M), 2 * (R + M)].join(" ");

const MySVG = styled.svg`
  width: ${2 * (R + M)}px;
  height: ${2 * (R + M)}px;
`;

const Road = styled.circle`
  stroke: ${colors.grey["700"]};
  stroke-width: 30px;
  fill: none;
`;

// stoke-width: 0px;
const Car = styled.rect`
  fill: ${colors.lightBlue["a200"]};
  stroke: ${colors.pink["a200"]};
`;

const MyCar = ({ car }) => {
  const ref = useRef();
  useEffect(() => {
    select(ref.current)
      .style("stroke-width", 2)
      .transition(ease.easeCubic)
      .duration(1000)
      .style("stroke-width", 0);
    return () => {
      select(ref.current)
        // .style("stroke-width", 0)
        .transition(ease.easeBounce)
        .duration(100)
        .style("stroke-width", 3)
        .style("stoke", colors.green["a400"])
        .remove();
    };
  }, [ref.current]);
  return (
    <Car
      ref={ref}
      key={car.key}
      width={14}
      x={-7}
      height={2}
      transform={`rotate(${(car.x / ROAD_LENGTH) * 360}) translate(${-R},0) `}
    />
  );
};

export default ({ cars }) => {
  return (
    <MySVG viewBox={viewbox}>
      <Road r={R} />
      {cars.map((car, i) => {
        return <MyCar car={car} key={car.key} />;
      })}
    </MySVG>
  );
};
