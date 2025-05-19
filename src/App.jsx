import React from 'react';
import BasicMap from './components/BasicMap';
import CurrentMarker from './components/CurrentMarker';
import MultipleMarkers from './components/MultipleMarkers';
import MovingMarker from './components/MovingMarker';
import SmoothMovingMarker from './components/SmoothMovingMarker';
import StickyMapMovingMarker from './components/StickyMapMovingMarker';
import NearbyMovingMarker from './components/NearByMovingMarker';
import MovingCurrentMarker from './components/MovingCurrentMarker';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/app/Home';
import Map from './components/app/Map';

function App() {

  // const locations = [
  //   { lat: 28.6139, lng: 77.2090 }, // Delhi
  //   { lat: 19.0760, lng: 72.8777 }, // Mumbai
  //   { lat: 12.9716, lng: 77.5946 }, // Bangalore
  //   { lat: 13.0827, lng: 80.2707 }, // Chennai
  // ];


  return (
    // <div>
    //   {/* <BasicMap lat={28.6139} lng={77.2090} /> */}
    //   {/* <CurrentMarker/> */}
    //   {/* <MultipleMarkers locations={locations} /> */}
    //   {/* <MovingMarker/> */}
    //   {/* <SmoothMovingMarker/> */}
    //   {/* <StickyMapMovingMarker/> */}
    //   {/* <NearbyMovingMarker/> */}
    //   {/* <MovingCurrentMarker/> */}
    // </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />        
          <Route path="/map" element={<Map/>}/>   
          <Route path="/login" element={<Login />} />   
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;