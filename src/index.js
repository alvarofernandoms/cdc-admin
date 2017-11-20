import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Autor from './Autor';
import Home from './Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route path="/autor" component={ Autor } />
        <Route path="/livro" />
      </Switch>
    </App>
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
