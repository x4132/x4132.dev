import React from 'react';
import ReactDOM from 'react-dom';
import Index from './tsx/Index';
import NotFound from "./tsx/NotFound";
import About from "./tsx/About";
import Writeups from "./tsx/Writeups";

import { HashRouter as Router, Switch, Route } from "react-router-dom"

import "./css/theme.scss"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/writeups" component={Writeups} />
        <Route path="/about" component={About} />
        <Route path="/" exact component={Index} />
        <Route path="/" component={NotFound} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

