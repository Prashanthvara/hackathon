import React from 'react';

interface Prize {
  title: string;
  value: string;
  description: string;
  icon: string;
}

const prizes: Prize[] = [
  {
    title: 'Grand Prize',
    value: '$300,000',
    description: 'For the most innovative and impactful project',
    icon: '🏆'
  },
  {
    title: 'Runner Up',
    value: '$150,000',
    description: 'Second place for outstanding technical achievement',
    icon: '🥈'
  },
  {
    title: 'Community Choice',
    value: '$100,000',
    description: 'Voted by the community for the most loved project',
    icon: '👥'
  },
  {
    title: 'Best AI Integration',
    value: '$75,000',
    description: 'For exceptional use of artificial intelligence',
    icon: '🤖'
  },
  {
    title: 'Best Design',
    value: '$50,000',
    description: 'For outstanding user experience and visual design',
    icon: '🎨'
  },
  {
    title: 'Best Mobile App',
    value: '$50,000',
    description: 'For the most innovative mobile application',
    icon: '📱'
  },
  
  {
    title: 'Best Gaming Project',
    value: '$50,000',
    description: 'For the most engaging gaming experience',
    icon: '🎮'
  },
  
];

const Prizes: React.FC = () => {
  return (
    <section className="prizes" id="prizes">
      <div className="container">
        <h2>Prizes</h2>
        <p className="prizes-total">Over $1 million in total prizes</p>
        <div className="prizes-grid">
          {prizes.map((prize) => (
            <div key={prize.title} className="prize-item">
              <div className="prize-icon">{prize.icon}</div>
              <h3 className="prize-title">{prize.title}</h3>
              <div className="prize-value">{prize.value}</div>
              <p className="prize-description">{prize.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Prizes; 