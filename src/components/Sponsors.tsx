import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

// Improved color extraction using color quantization
const extractColors = (imgElement: HTMLImageElement): { primary: string, secondary: string } => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return { primary: '#6d28d9', secondary: '#db2777' };
    
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;
    
    // Draw image to canvas
    ctx.drawImage(imgElement, 0, 0);
    
    // Sample from multiple regions of the logo
    const regions = [
      // Center
      ctx.getImageData(
        Math.floor(canvas.width * 0.4),
        Math.floor(canvas.height * 0.4),
        Math.floor(canvas.width * 0.2),
        Math.floor(canvas.height * 0.2)
      ).data,
      // Top region
      ctx.getImageData(
        Math.floor(canvas.width * 0.3),
        0,
        Math.floor(canvas.width * 0.4),
        Math.floor(canvas.height * 0.3)
      ).data,
      // Left region
      ctx.getImageData(
        0,
        Math.floor(canvas.height * 0.3),
        Math.floor(canvas.width * 0.3),
        Math.floor(canvas.height * 0.4)
      ).data
    ];
    
    // Collect all valid colors from all regions
    const colorMap: Map<string, { count: number, rgb: number[] }> = new Map();
    
    regions.forEach((imageData, regionIndex) => {
      // Weight colors from center region more heavily
      const weight = regionIndex === 0 ? 2 : 1;
      
      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        
        // Skip transparent or extreme colors
        if (a < 128 || (r + g + b < 100) || (r + g + b > 700)) continue;
        
        // Group similar colors (reduced precision)
        const key = `${Math.floor(r/10)},${Math.floor(g/10)},${Math.floor(b/10)}`;
        
        if (colorMap.has(key)) {
          const existing = colorMap.get(key)!;
          existing.count += weight;
          // Average the colors in this bucket for more precision
          existing.rgb[0] = (existing.rgb[0] * existing.count + r) / (existing.count + 1);
          existing.rgb[1] = (existing.rgb[1] * existing.count + g) / (existing.count + 1);
          existing.rgb[2] = (existing.rgb[2] * existing.count + b) / (existing.count + 1);
        } else {
          colorMap.set(key, { count: weight, rgb: [r, g, b] });
        }
      }
    });
    
    // Sort colors by frequency
    const sortedColors = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Keep top 5 colors
    
    // Find colors that are perceptually different enough
    const primaryColor = sortedColors[0]?.rgb || [109, 40, 217]; // Default purple
    
    // Find a secondary color that has enough contrast with the primary
    let secondaryColor = sortedColors.find(color => {
      if (color === sortedColors[0]) return false;
      
      // Simple perceptual distance
      const dr = Math.abs(color.rgb[0] - primaryColor[0]);
      const dg = Math.abs(color.rgb[1] - primaryColor[1]);
      const db = Math.abs(color.rgb[2] - primaryColor[2]);
      
      return Math.sqrt(dr*dr + dg*dg + db*db) > 100; // Threshold for "different enough"
    })?.rgb || [219, 39, 119]; // Default pink
    
    return {
      primary: `rgb(${Math.round(primaryColor[0])}, ${Math.round(primaryColor[1])}, ${Math.round(primaryColor[2])})`,
      secondary: `rgb(${Math.round(secondaryColor[0])}, ${Math.round(secondaryColor[1])}, ${Math.round(secondaryColor[2])})`
    };
  } catch (error) {
    console.error('Error extracting colors:', error);
    return { primary: '#6d28d9', secondary: '#db2777' };
  }
};

// Generate theme from extracted colors with improved contrast handling
const generateColorTheme = (colors: { primary: string, secondary: string }) => {
  const { primary, secondary } = colors;
  
  // Create rgba versions for transparency effects
  const getRgba = (color: string, alpha: number) => {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return `rgba(52, 152, 219, ${alpha})`;
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
  };
  
  // Check if color is too dark for text
  const getBrightness = (color: string) => {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return 200; // Default brightness
    
    // Calculate perceived brightness (human eye is more sensitive to green)
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return (r * 0.299 + g * 0.587 + b * 0.114);
  };
  
  // Lighten dark colors for text usage
  const primaryForText = getBrightness(primary) < 128 
    ? lightenColor(primary, 40) 
    : primary;
  
  return {
    primary,
    secondary,
    primaryLight: getRgba(primary, 0.7),
    secondaryLight: getRgba(secondary, 0.5),
    primaryGlow: getRgba(primary, 0.25),
    secondaryGlow: getRgba(secondary, 0.15),
    textColor: primaryForText,
    patternColor: getRgba(primary, 0.1)
  };
};

// Helper function to lighten dark colors
const lightenColor = (color: string, amount: number): string => {
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!rgbMatch) return color;
  
  const r = Math.min(255, parseInt(rgbMatch[1]) + amount);
  const g = Math.min(255, parseInt(rgbMatch[2]) + amount);
  const b = Math.min(255, parseInt(rgbMatch[3]) + amount);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const sponsors: Sponsor[] = [
  {
    name: 'Supabase',
    logo: 'https://pbs.twimg.com/profile_images/1822981431586439168/7xkKXRGQ_400x400.jpg',
    url: 'https://t.co/kHsst88pKt'
  },
  {
    name: 'Netlify',
    logo: 'https://pbs.twimg.com/profile_images/1633183038140981248/Mz4bv8Ja_400x400.png',
    url: 'https://t.co/GBfcsfjTFU'
  },
  {
    name: 'CloudflareDev',
    logo: 'https://pbs.twimg.com/profile_images/991779658147377152/ESp67BNN_400x400.jpg',
    url: 'https://cloudflare.com'
  },
  {
    name: 'GetSentry',
    logo: 'https://pbs.twimg.com/profile_images/1778495572238086150/qDkInWXX_400x400.png',
    url: 'https://sentry.io'
  },
  {
    name: 'Loops',
    logo: 'https://pbs.twimg.com/profile_images/1729539310058147840/iE5EGXW3_400x400.jpg',
    url: 'https://loops.so'
  },
  {
    name: 'AlgoFoundation',
    logo: 'https://pbs.twimg.com/profile_images/1805829136381861889/0fI5Zrbv_400x400.jpg',
    url: 'https://algorand.co'
  },
  {
    name: 'EXA Labs',
    logo: 'https://pbs.twimg.com/profile_images/1813012869296103428/CTCb6uHz_400x400.jpg',
    url: 'https://exa.ai'
  },
  {
    name: 'HSRHackerhouse',
    logo: 'https://pbs.twimg.com/profile_images/1877398632447750144/lIrSfPaj_400x400.jpg ',
    url: 'https://lu.ma/hsrhackerhouse'
  }
];

const Sponsors: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [sponsorThemes, setSponsorThemes] = useState<Record<string, ReturnType<typeof generateColorTheme>>>({});
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});
  const sponsorsContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const colorExtractionQueue = useRef<string[]>([]);
  const processingColor = useRef(false);
  
  // Process color extraction queue one at a time to avoid performance issues
  const processNextColorExtraction = useCallback(async () => {
    if (processingColor.current || colorExtractionQueue.current.length === 0) return;
    
    processingColor.current = true;
    const sponsorName = colorExtractionQueue.current.shift()!;
    
    const imgElement = document.querySelector(`[data-sponsor="${sponsorName}"]`) as HTMLImageElement;
    if (imgElement && imgElement.complete) {
      // Small delay to ensure image is rendered
      await new Promise(resolve => setTimeout(resolve, 50));
      
      try {
        const colors = extractColors(imgElement);
        const theme = generateColorTheme(colors);
        setSponsorThemes(prev => ({...prev, [sponsorName]: theme}));
      } catch (error) {
        console.error('Error processing color for', sponsorName, error);
      }
    }
    
    processingColor.current = false;
    // Continue processing queue
    setTimeout(processNextColorExtraction, 50);
  }, []);
  
  // Add to extraction queue when image loads
  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, sponsorName: string) => {
    setIsLoaded(prev => ({...prev, [sponsorName]: true}));
    
    // Add to extraction queue if not already processed
    if (!sponsorThemes[sponsorName]) {
      colorExtractionQueue.current.push(sponsorName);
      processNextColorExtraction();
    }
  }, [sponsorThemes, processNextColorExtraction]);
  
  // Handle auto-scrolling effect
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const autoScroll = () => {
      setActiveIndex(prev => {
        const newIndex = prev >= sponsors.length - 1 ? 0 : prev + 1;
        scrollToCard(newIndex);
        return newIndex;
      });
    };
    
    // Initial active card
    if (activeIndex === -1) {
      setActiveIndex(0);
    }
    
    // Set up auto-scrolling timer
    autoScrollTimerRef.current = setInterval(autoScroll, 3000);
    
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling, activeIndex]);
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => {
          const newIndex = prev <= 0 ? sponsors.length - 1 : prev - 1;
          scrollToCard(newIndex);
          return newIndex;
        });
        handleUserInteraction();
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => {
          const newIndex = prev >= sponsors.length - 1 ? 0 : prev + 1;
          scrollToCard(newIndex);
          return newIndex;
        });
        handleUserInteraction();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Pause auto-scrolling on user interaction
  const handleUserInteraction = useCallback(() => {
    setIsAutoScrolling(false);
    
    // Resume auto-scrolling after 10 seconds of inactivity
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
    
    const resumeTimer = setTimeout(() => setIsAutoScrolling(true), 10000);
    return () => clearTimeout(resumeTimer);
  }, []);
  
  // Scroll to specific card
  const scrollToCard = useCallback((index: number) => {
    if (!sponsorsContainerRef.current) return;
    
    const container = sponsorsContainerRef.current;
    const cards = container.querySelectorAll('.sponsor-card');
    if (cards[index]) {
      const cardWidth = cards[0].clientWidth;
      const scrollPosition = index * (cardWidth + 20); // 20px is the gap between cards
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, []);
  
  // Handle card click
  const handleCardClick = useCallback((index: number) => {
    setActiveIndex(index);
    scrollToCard(index);
    handleUserInteraction();
  }, [scrollToCard, handleUserInteraction]);
  
  // Handle touch/swipe events
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    handleUserInteraction();
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(difference) > threshold) {
      if (difference > 0) {
        // Swipe left
        setActiveIndex(prev => {
          const newIndex = prev >= sponsors.length - 1 ? 0 : prev + 1;
          scrollToCard(newIndex);
          return newIndex;
        });
      } else {
        // Swipe right
        setActiveIndex(prev => {
          const newIndex = prev <= 0 ? sponsors.length - 1 : prev - 1;
          scrollToCard(newIndex);
          return newIndex;
        });
      }
    }
  };
  
  return (
    <section className="sponsors" id="sponsors">
      <div className="container">
        <h2>Sponsors</h2>
        
        <div className="sponsor-showcase">
          <div 
            className="sponsor-container"
            ref={sponsorsContainerRef}
            onMouseEnter={handleUserInteraction}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sponsors.map((sponsor, index) => {
              const isActive = index === activeIndex;
              const defaultTheme = {
                primary: '#6d28d9',
                secondary: '#db2777',
                primaryLight: 'rgba(109, 40, 217, 0.7)',
                secondaryLight: 'rgba(219, 39, 119, 0.5)',
                primaryGlow: 'rgba(109, 40, 217, 0.25)',
                secondaryGlow: 'rgba(219, 39, 119, 0.15)',
                textColor: '#6d28d9',
                patternColor: 'rgba(109, 40, 217, 0.1)'
              };
              
              const theme = sponsorThemes[sponsor.name] || defaultTheme;
              const hasLoaded = isLoaded[sponsor.name];
              
              return (
                <div 
                  key={sponsor.name}
                  className={`sponsor-card ${isActive ? 'active' : ''} ${hasLoaded ? 'loaded' : ''}`}
                  onClick={() => handleCardClick(index)}
                  style={{
                    borderTop: `4px solid ${theme.primary}`,
                    boxShadow: isActive 
                      ? `0 15px 30px rgba(0,0,0,0.2), 0 0 10px ${theme.primaryGlow}` 
                      : undefined,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transform: isActive 
                      ? 'translateY(-10px) scale(1.02) perspective(500px) rotateY(0deg)'
                      : `translateY(0) scale(1) perspective(500px) rotateY(${index < activeIndex ? '-3deg' : index > activeIndex ? '3deg' : '0deg'})`,
                  }}
                >
                  <div 
                    className="card-pattern" 
                    style={{
                      opacity: hasLoaded ? 0.1 : 0,
                      backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.patternColor} 0%, transparent 8%),
                                       radial-gradient(circle at 80% 30%, ${theme.patternColor} 0%, transparent 6%)`
                    }}
                  />
                  
                  <div className="card-front">
                    <div 
                      className="logo-container"
                      style={{
                        borderBottom: `1px solid ${theme.primaryLight}`,
                        background: `linear-gradient(135deg, rgba(24, 26, 32, 0.6), rgba(30, 34, 42, 0.4))`
                      }}
                    >
                      <div 
                        className="logo-glow" 
                        style={{ 
                          background: `radial-gradient(circle at center, ${theme.primaryGlow}, transparent 70%)`,
                          opacity: isActive ? 0.8 : 0.3
                        }}
                      />
                      <img 
                        src={sponsor.logo} 
                        alt={`${sponsor.name} logo`}
                        className={`sponsor-logo ${hasLoaded ? 'loaded' : ''}`}
                        data-sponsor={sponsor.name}
                        onLoad={(e) => handleImageLoad(e, sponsor.name)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'flex';
                          target.style.justifyContent = 'center';
                          target.style.alignItems = 'center';
                          target.alt = sponsor.name;
                          setIsLoaded(prev => ({...prev, [sponsor.name]: true}));
                        }}
                      />
                    </div>
                    <div className="sponsor-details">
                      <a 
                        href={sponsor.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="sponsor-name-link"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          color: hasLoaded && isActive ? theme.textColor : undefined
                        }}
                      >
                        <h3>{sponsor.name}</h3>
                        <div 
                          className="name-underline" 
                          style={{ 
                            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  
                  <div 
                    className="card-glow" 
                    style={{ 
                      background: `radial-gradient(circle at center, ${theme.primaryGlow}, transparent 70%)`,
                      opacity: isActive ? 1 : 0.3
                    }}
                  />
                  
                  <div 
                    className="card-shine"
                    style={{
                      opacity: isActive ? 0.3 : 0,
                      background: `linear-gradient(135deg, 
                                   transparent 20%, 
                                   ${theme.secondaryLight} 50%, 
                                   transparent 80%)`
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="sponsor-navigation">
          {sponsors.map((sponsor, index) => {
            const theme = sponsorThemes[sponsor.name] || { 
              primary: '#6d28d9', 
              secondary: '#db2777',
              primaryGlow: 'rgba(109, 40, 217, 0.25)'
            };
            return (
              <button
                key={index}
                className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleCardClick(index)}
                aria-label={`Go to sponsor ${index + 1}`}
                style={{
                  background: index === activeIndex ? theme.primary : undefined,
                  borderColor: index === activeIndex ? theme.primary : undefined,
                  boxShadow: index === activeIndex ? `0 0 5px ${theme.primaryGlow}` : undefined
                }}
              />
            );
          })}
        </div>
        
        <div className="keyboard-hint">
          <span>Use ← → arrow keys to navigate</span>
        </div>
      </div>
    </section>
  );
};

export default Sponsors; 