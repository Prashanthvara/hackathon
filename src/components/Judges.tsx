import React, { useState } from 'react';

interface Judge {
  name: string;
  image: string;
  xHandle: string;
  bio?: string; // Optional short bio
}

const judges: Judge[] = [
  {
    name: 'Sarah Guo',
    image: 'https://pbs.twimg.com/profile_images/1689443134919327744/geqEJeF8_400x400.jpg',
    xHandle: 'https://x.com/saranormous',
    bio: 'Founder & CEO at Conviction. Early-stage investor in AI, security, and enterprise.'
  },
  {
    name: 'Theo',
    image: 'https://pbs.twimg.com/profile_images/1799982162831396865/Fnol01I1_400x400.jpg',
    xHandle: 'https://x.com/theo',
    bio: 'Founder of Ping.gg. Builder. Web enthusiast and open source advocate.'
  },
  {
    name: 'Evan You',
    image: 'https://pbs.twimg.com/profile_images/1856284397072478208/hSEXLkPN_400x400.jpg',
    xHandle: 'https://x.com/youyuxi',
    bio: 'Creator of Vue.js, Vite, and various open source tools. Independent open source developer.'
  },
  {
    name: 'Karthik Puvvada (KP)',
    image: 'https://pbs.twimg.com/profile_images/1288449070344937473/fKlvccnM_400x400.jpg',
    xHandle: 'https://x.com/thisiskp_',
    bio: 'Community builder and startup advisor. Helping builders connect and create impact.'
  },
  {
    name: 'Alex Albert',
    image: 'https://pbs.twimg.com/profile_images/1856486626072915968/JEQpB9CW_400x400.jpg',
    xHandle: 'https://x.com/alexalbert__',
    bio: 'Founder at Depict.ai. AI enthusiast and entrepreneur focused on the future of technology.'
  },
  {
    name: 'Ben Tossell',
    image: 'https://pbs.twimg.com/profile_images/1878086921726943233/vOx1kjeP_400x400.jpg',
    xHandle: 'https://x.com/bentossell',
    bio: 'Founder of Makerpad. Builder of no-code tools and platforms for creators.'
  }
];

const Judges: React.FC = () => {
  // Track only the currently flipped card (if any)
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardClick = (judgeName: string, event: React.MouseEvent) => {
    // Prevent flip if clicking on link
    if ((event.target as HTMLElement).tagName === 'A') {
      return;
    }
    
    // If clicking the same card, toggle it
    if (activeCard === judgeName) {
      setActiveCard(null);
    } else {
      // If clicking a different card, switch to it
      setActiveCard(judgeName);
    }
  };

  const handleBackClick = (judgeName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveCard(null);
  };

  return (
    <section className="judges" id="judges">
      <div className="container">
        <h2>Judges</h2>
        <div className="judges-grid">
          {judges.map((judge) => (
            <div 
              key={judge.name} 
              className={`judge-item ${activeCard === judge.name ? 'flipped' : ''}`}
              onClick={(e) => handleCardClick(judge.name, e)}
            >
              <div className="judge-card">
                <div className="judge-front">
                  <div className="judge-image-container">
                    <img 
                      src={judge.image} 
                      alt={`${judge.name}`} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="judge-content">
                    <h3 className="judge-name">{judge.name}</h3>
                    <a 
                      href={judge.xHandle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="judge-handle"
                    >
                      @{judge.xHandle.split('/').pop()}
                    </a>
                  </div>
                  <div className="judge-flip-hint">ⓘ</div>
                </div>
                <div className="judge-back">
                  <h3 className="judge-name">{judge.name}</h3>
                  <p className="judge-bio">{judge.bio || "Judge for the World's Largest Hackathon"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges; 