import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import WebsiteEditor from './pages/Editor';
import LiveSite from './pages/LiveSite';
import Pricing from './pages/Pricing';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './redux/userSlice'; 

export const serverUrl = import.meta.env.VITE_SERVER_URL;

const App = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user); 

  useEffect(() => {
    dispatch(setUserData(null));
  }, [dispatch]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/me`, { withCredentials: true });
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.error("Error fetching current user:", error);
        dispatch(setUserData(null));
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={userData ? <Dashboard /> : <Home />} />
        <Route path='/generate' element={userData ? <Generate /> : <Home />} />
        <Route path='/editor/:id' element={userData ? <WebsiteEditor /> : <Home />} />
        <Route path='/site/:id' element={<LiveSite />} />
        <Route path='/pricing' element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
