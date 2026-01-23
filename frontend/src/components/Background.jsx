import React, { useEffect, useState } from 'react';
import './Background.css';

const Background = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);

  // تتبع الماوس
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // مؤثر الوقت للحركات الدورية
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // إحداثيات متحركة للسفينة
  const shipX = 50 + Math.sin(time) * 5;
  const shipY = 40 + Math.cos(time * 0.8) * 3;
  const shipRotation = Math.sin(time * 0.5) * 5;

  return (
    <div className="tech-background">
      {/* شبكة بسيطة */}
      <div className="grid-lines">
        <div className="grid-line"></div>
        <div className="grid-line"></div>
      </div>

      {/* السفينة الفضائية الرئيسية المتحركة */}
      <div 
        className="spaceship"
        style={{
          left: `${shipX}%`,
          top: `${shipY}%`,
          transform: `rotate(${shipRotation}deg)`
        }}
      >
        <div className="ship-body">
          <div className="ship-cockpit"></div>
          <div className="ship-wing left"></div>
          <div className="ship-wing right"></div>
          <div className="ship-engine">
            <div className="engine-flame"></div>
          </div>
        </div>
        <div className="ship-trail"></div>
      </div>

      {/* تأثير الماوس التفاعلي */}
      <div 
        className="mouse-trail"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

      {/* النجوم الخلفية */}
      <div className="stars">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={`star-${i}`} 
            className="star"
            style={{
              left: `${10 + (i * 6)}%`,
              top: `${20 + Math.sin(time + i) * 50}%`,
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>

      {/* نقاط طاقة متحركة */}
      <div className="energy-orbs">
        <div 
          className="energy-orb orb-1"
          style={{
            left: `${30 + Math.sin(time * 1.2) * 10}%`,
            top: `${60 + Math.cos(time * 0.9) * 15}%`
          }}
        ></div>
        <div 
          className="energy-orb orb-2"
          style={{
            left: `${70 + Math.cos(time * 1.1) * 8}%`,
            top: `${30 + Math.sin(time * 1.3) * 12}%`
          }}
        ></div>
      </div>

      {/* موجات الطاقة الخفيفة */}
      <div className="energy-waves">
        <div 
          className="energy-wave"
          style={{
            transform: `scale(${1 + Math.sin(time) * 0.2})`,
            opacity: 0.3 + Math.sin(time * 2) * 0.2
          }}
        ></div>
      </div>
    </div>
  );
};

export default Background;