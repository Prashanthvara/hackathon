import React, { useState, useEffect, useRef } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        buttonRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div 
          className="logo" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer' }}
        >
          <h2>hackathon.dev</h2>
        </div>
        <button 
          ref={buttonRef} 
          className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav ref={navRef} className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#prizes" onClick={(e) => {
              e.preventDefault();
              const prizesSection = document.getElementById('prizes');
              if (prizesSection) {
                prizesSection.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }
            }}>Prizes</a></li>
            
            <li><a href="#judges" onClick={(e) => {
              e.preventDefault();
              const judgesSection = document.getElementById('judges');
              if (judgesSection) {
                judgesSection.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }
            }}>Judges</a></li>
            <li><a href="#sponsors" onClick={(e) => {
              e.preventDefault();
              const sponsorsSection = document.getElementById('sponsors');
              if (sponsorsSection) {
                sponsorsSection.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }
            }}>Sponsors</a></li>
            <li><a href="#faq" onClick={(e) => {
              e.preventDefault();
              const faqSection = document.getElementById('faq');
              if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }
            }}>FAQs</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 