import React from 'react';
import ReactDOM from 'react-dom';
import Index from './tsx/Index';
import NotFound from "./tsx/NotFound";
import About from "./tsx/About";
import Writeups from "./tsx/Writeups";
import FixSlash from './tsx/FixSlash';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import "./css/theme.scss"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FixSlash />
      <Switch>
        <Route path="/writeups" component={Writeups} />
        <Route path="/about" component={About} />
        <Route path="/" exact component={Index} />
        <Route path="/" component={NotFound} />
      </Switch>
      <footer className="pb-2" >
        <div>
          <a href="https://twitter.com/bluninja1234" >Twitter</a>
        </div>
        <div className="ml-2" >
          <a href="https://tiktok.com/@x4132" onClick={e => { e.preventDefault(); window.location.assign("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); return false; }} >Tiktok</a>
        </div>
        <div className="ml-2" >
          <a href="/" onClick={e => { alert("0x41*32#9495"); return false; }} >Discord</a>
        </div>
      </footer>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

