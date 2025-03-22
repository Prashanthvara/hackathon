import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sponsors from './Sponsors';
import Judges from './Judges';
import Prizes from './Prizes';
import FAQ from './FAQ';

const App: React.FC = () => {
  const [locationVisible, setLocationVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);

  useEffect(() => {
    // Animate in the location and date with a delay
    const locationTimer = setTimeout(() => setLocationVisible(true), 500);
    const dateTimer = setTimeout(() => setDateVisible(true), 1200);
    
    return () => {
      clearTimeout(locationTimer);
      clearTimeout(dateTimer);
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <div className="container">
          <h1>World's Largest Hackaton</h1>
          <h2>Show what you got on the World Arena</h2>
          <a 
            href="https://form.typeform.com/to/wf94YwH4"
            target="_blank"
            rel="noopener noreferrer"
            className="challenge-button"
          >
            Join Challenge
          </a>
          
          <div className="event-details">
            <div className={`event-location ${locationVisible ? 'visible' : ''}`}>
              <span className="event-icon">🌐</span>
              <span className="event-text">Virtual</span>
            </div>
            <div className={`event-date ${dateVisible ? 'visible' : ''}`}>
              <span className="event-icon">📅</span>
              <span className="event-text">TBD</span>
            </div>
          </div>
        <div className="hosted-by">
          <span>Hosted by</span>
          <span>
            <a 
              href="https://x.com/gregisenberg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="host-link"
            >
              Greg Isenberg
            </a>
          </span>
        </div>
        </div>
      </main>
      <Prizes />
      <Judges />
      <Sponsors />
      <FAQ />
      <Footer />
    </div>
  );
};

export default App; 