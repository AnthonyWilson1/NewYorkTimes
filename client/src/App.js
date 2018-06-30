import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router-dom';
import {Switch} from 'react-router-dom';
import Header from './Header'
import Landing from './Landing'
import Saved from './Saved'
//import logo from './logo.svg';
//import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <BrowserRouter>
          <div>
            {/* <Route path='/' component={Header} /> */}
            <Route exact path='/saved' component={Saved} />
            <Route exact path='/' component={Landing} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
