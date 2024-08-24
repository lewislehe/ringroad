import React, { useLayoutEffect, useRef, useEffect } from "react";
import { timer, interval, timeout } from "d3-timer";

export const useTimer = (callback, play) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    if (play) {
      let last = 0;
      const t = timer((elapsed) => {
        let dt = (elapsed - last);
        last = elapsed;
        if (savedCallback.current) savedCallback.current(dt);
      });
      return () => t.stop();
    }
  }, [play]);
};

export const useInterval = (callback, delay, play) => {
  const savedInterval = useRef();
  useLayoutEffect(() => {
    savedInterval.current = callback;
  }, [callback]);
  useLayoutEffect(() => {
    if (play) {
      let t = interval(() => {
        if (savedInterval.current) savedInterval.current();
      }, delay);
      return () => t.stop();
    }
  }, [delay, play]);
};

export const useTimeout = (callback, delay, play) => {
  const savedTimeout = useRef();
  useLayoutEffect(() => {
    savedTimeout.current = callback;
  }, [callback]);
  useLayoutEffect(() => {
    if (play) {
      let t = timeout(() => {
        if (savedTimeout.current) saveTimeout.current();
      }, delay);
      return () => t.stop();
    }
  }, [play]);
};

// export const useInterval = (callback, delay, play) => {
//   // const savedInterval = (useRef < 0) | (cb > 0);
//   const savedInterval = useRef();
//   useLayoutEffect(() => {
//     savedInterval.current = callback;
//   }, [callback]);
//   useLayoutEffect(() => {
//     if (play) {
//       let t = interval(() => {
//         if (savedInterval.current) savedInterval.current();
//       }, delay * 1000);
//       return () => t.stop();
//       // return () => clearInterval(id);
//     }
//   }, [delay, play]);
// };
