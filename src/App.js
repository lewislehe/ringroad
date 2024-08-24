import React, { useEffect, useLayoutEffect, useReducer, useRef } from "react";
import "./style.css";
import { css } from "@emotion/react";
import colors from "material-colors";
import styled from "@emotion/styled";
import RingRoad from "./RingRoad";
import { useInterval, useTimeout, useTimer } from "./useTimerHook";
import throttle from "lodash.throttle";
import { VS, ROAD_LENGTH, sj, TRIP_LENGTH } from "./constants";
import { randomExponential, randomUniform } from "d3-random";
import { timeout } from "d3-timer";
import uniqueId from "lodash.uniqueid";
const xGenerator = randomUniform(0, ROAD_LENGTH);
// const tripLengthGenerator = randomExponential(1 / TRIP_LENGTH);
// const tripLengthGenerator = () => TRIP_LENGTH;
const tripLengthGenerator = randomUniform(0, ROAD_LENGTH);
const zeroOneGenerator = randomUniform(0, 1);
function mod(n, m) {
  return ((n % m) + m) % m;
}

const hello = throttle((cars, exited) => {
  console.log("density", cars.length/ROAD_LENGTH*1000);
  let λ = Math.max(2.12 - 3 / VS(ROAD_LENGTH / cars.length), 0);
  // let prob = 1 - Math.exp(-dt * λ);
  let exitRate = exited.slice(exited.length - 30).reduce((a, b) => a + b, 0)/3;
  console.log("exit rate", exitRate);
  console.log("arrival rate", λ);
}, 1000);

const diff = (d) => {
  return d < 0 ? d + ROAD_LENGTH : d;
};

let exited = [];

const reduceCars = (cars, dt) => {
  let n = cars.length;

  let newExits = 0;

  hello(cars, exited);
  let newCars = cars
    .map((car, i, a) => {
      let next = i === a.length - 1 ? a[0] : a[i + 1];
      let s = mod(next.x - car.x, ROAD_LENGTH);
      // let s = diff(next.x - car.x);
      // let s = diff(car.x, next.x);
      // console.log(s);
      let vs = VS(s);
      let dx = Math.max(Math.min(vs * dt, s), 0);
      let x = (car.x + dx) % ROAD_LENGTH;
      return {
        ...car,
        x,
        traveled: car.traveled + dx,
      };
    })
    .filter((car) => {
      let staying = car.traveled < car.tripLength;
      if (!staying) newExits++;
      return staying;
    });

  exited.push(newExits);

  // let dur = TRIP_LENGTH / VS(ROAD_LENGTH / cars.length);
  let λ = Math.max(4 - 34 / VS(ROAD_LENGTH / cars.length), 0);
  // console.log(z);
  let prob = 1 - Math.exp(-dt * λ);
  // let prob = dt * z;
  if (prob > zeroOneGenerator()) newCars = addCar(cars);

  return [...newCars].sort((a, b) => a.x - b.x);
};
const addCar = (cars) => {
  let max = 0,
    l = cars.length,
    maxLoc = tripLengthGenerator();

  for (let i = 0; i < l; i++) {
    let a = cars[i].x;
    let b = cars[i == l - 1 ? 0 : i + 1].x;
    let s = diff(b - a);
    if (s > max) {
      max = s;
      maxLoc = mod(a + s / 2, ROAD_LENGTH);
    }
  }

  return [
    ...cars,
    {
      x: maxLoc,
      key: uniqueId("car"),
      tripLength: tripLengthGenerator(),
      traveled: 0,
    },
  ].sort((a, b) => a.x - b.x);
};

const reducer = (state, action) => {
  switch (action.type) {
    case "PLAY":
      return { ...state, play: action.payload };
    case "TICK":
      return {
        ...state,
        cars: reduceCars(state.cars, action.payload),
        time: state.time + action.payload,
      };
  }
};

const kstart = 2;
const initial = Array.from({ length: kstart }, xGenerator)
  .sort((a, b) => a - b)
  .map((d) => ({
    x: d,
    key: uniqueId("car"),
    tripLength: tripLengthGenerator(),
    traveled: 0,
  }));

export default () => {
  const [state, dispatch] = useReducer(reducer, {
    play: false,
    cars: initial,
    carsAdded: 0,
  });

  useTimer(function ticker(dt) {
    dispatch({ type: "TICK", payload: 0.1 });
  }, state.play);

  return (
    <div css={AppStyle}>
      <MyButton
        play={state.play}
        onClick={() => dispatch({ type: "PLAY", payload: !state.play })}
      >
        {state.play ? "Pause" : "Play"}
      </MyButton>
      <RingRoad cars={state.cars} />
    </div>
  );
};

const AppStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MyButton = styled.button`
  background-color: ${colors.green["a700"]};
  border-radius: 3px;
  display: block;
  color: white;
  padding: 10px;
  outline: none;
  border: none;
  cursor: pointer;
  margin: 30px auto;
  &:hover {
    background-color: ${colors.blue["a200"]};
  }
`;
