import React from "react";

const Waveform = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="relative waveform-container">
        <svg viewBox="0 0 120 40" className="waveform">
          <path
            className="wave-path stroke-yellow-500 stroke-2 fill-transparent animate-wave"
            d="M0,20 L10,10 L20,30 L30,10 L40,30 L50,10 L60,30 L70,10 L80,30 L90,10 L100,30 L110,20 L120,20 Q115,15 110,20 Q105,30 100,20 Q95,10 90,20 Q85,30 80,20 Q75,10 70,20 Q65,30 60,20 Q55,10 50,20 Q45,30 40,20 Q35,10 30,20 Q25,30 20,20 Q15,10 10,20 Q5,30 0,20 Z"
          />
          <path
            className="heart fill-yellow-500"
            d="M60,30 C55,25 50,20 45,25 C40,20 35,25 30,30 C25,35 60,55 60,55 C60,55 95,35 90,30 C85,25 80,20 75,25 C70,20 65,25 60,30 Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Waveform;
