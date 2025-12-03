import './App.css';
import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import AlbumPage from "./pages/AlbumPage";
import Home from './pages/Home';
import { ArtistPage } from './pages/ArtistPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
