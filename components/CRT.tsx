// src/components/CRTTerminal.jsx
import React from 'react';
import { useRef,useEffect } from 'react';
import './CRT.css';

const CRT = () => {
 

  
    const myRef = useRef(null);
  const vantaRef = useRef(null);

  

  useEffect(() => {
    if (!window.VANTA || !window.THREE) return;

    vantaRef.current = window.VANTA.CLOUDS({
      el: myRef.current,
      THREE: window.THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      
     
    });

    return () => {
      if (vantaRef.current) vantaRef.current.destroy();
    };
  }, []);

  return <div ref={myRef} style={{ width: "100%", height: "100vh" }} />;
}
export default CRT;
