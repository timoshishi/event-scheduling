import { useEffect, useState, useCallback } from 'react';
import { Calendar } from './Calendar';

function App() {
  const [data, setData] = useState([]);

  const getEvents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/events');
      const data = await response.json();
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          flexDirection: 'column',
        }}
      >
        <h1>Event Scheduling</h1>
        {data?.length ? <Calendar events={data} /> : null}
      </div>
    </div>
  );
}

export default App;
