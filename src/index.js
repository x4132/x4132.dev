import React from 'react';
import ReactDOM from 'react-dom';
import Index from './tsx/Index';
import NotFound from "./tsx/NotFound";
import Work from "./tsx/Work";
import Writeups from "./tsx/Writeups";
import FixSlash from './tsx/FixSlash';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import "./css/theme.scss"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FixSlash />
      <Routes>
        <Route path="/writeups/*" element={<Writeups />} />
        <Route path="/about/*" element={<Work />} />
        <Route path="/work/*" element={<Work />} />
        <Route path="/" element={<Index />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

