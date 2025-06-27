import React from 'react';
import {
    Oval,
    Bars,
    Circles,
    TailSpin,
    ThreeDots,
  } from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function SpinnerOverlay(){
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
      <ThreeDots
        height={60}
        width={60}
        color="#4fa94d"
        // secondaryColor="#cccccc"
        // strokeWidth={3}
        visible={true}
        ariaLabel="loading"
      />
    </div>
  )
}