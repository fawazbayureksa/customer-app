import {useEffect, useState} from 'react';
import moment from 'moment';

export const useCountdown = targetDate => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime(),
  );

  const getReturnValues = countDown => {
    let m = moment(targetDate); // or whatever start date you have
    let today = moment();

    let days = m.diff(today, 'days')

    const hours =
      Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        .toString()
        .padStart(2, 0) >= 0
        ? Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            .toString()
            .padStart(2, 0)
        : 0;
    const minutes =
      Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, 0) >= 0
        ? Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
            .toString()
            .padStart(2, 0)
        : 0;
    const seconds =
      Math.floor((countDown % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, 0) >= 0
        ? Math.floor((countDown % (1000 * 60)) / 1000)
            .toString()
            .padStart(2, 0)
        : 0;
    return {days, hours, minutes, seconds};
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDownDate > new Date().getTime()) {
        setCountDown(countDownDate - new Date().getTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  if (countDown) {
    return getReturnValues(countDown);
  } else {
    return '00:00:00';
  }
};
