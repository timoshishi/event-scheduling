import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
function App() {
  const [data, setData] = useState([]);

  const getEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/events');
      const data = await response.json();
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {data?.length ? (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <code>{JSON.stringify(data, null, 2)}</code>
          </div>
        ) : (
          <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
            Learn React
          </a>
        )}
      </header>
    </div>
  );
}

export default App;
