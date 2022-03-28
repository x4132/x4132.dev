import React from 'react';
import ReactDOM from 'react-dom';
import Index from './tsx/Index';
import NotFound from "./tsx/NotFound";
import Work from "./tsx/Work";
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
        <Route path="/about" component={Work} />
        <Route path="/" exact component={Index} />
        <Route path="/" component={NotFound} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

