import React from 'react';
 import {BrowserRouter,Routes,Route} from 'react-router-dom'
 import Home from './pages./Home';
 import About from './pages./About';
 import UserProfile from './pages./UserProfile';
 import Navbar from './pages./Navbar';


function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/user/:username' element={<UserProfile />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
