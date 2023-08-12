import { useState, useEffect } from 'react';

import { ClockWrap } from './Clock.styled';
import { Tb24Hours } from 'react-icons/tb';

function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const intervalClickId = setInterval(setTime(new Date()), 1000);
    return clearInterval(intervalClickId);
  }, [time]);
  return (
    <ClockWrap>
      <Tb24Hours style={{ width: '1.5em', height: '1.5em' }} />
      <p>{time.toLocaleTimeString()}</p>
    </ClockWrap>
  );
}
export default Clock;
