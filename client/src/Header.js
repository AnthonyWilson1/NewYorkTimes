import React, { Component } from 'react';
import axios from 'axios';

class Header extends Component {
    
    scrape() {
        axios.post('/scrape', {}).then((result) => {
            console.log(result)
        })
    }

    render() {
      return (
        <nav>
            <div className="nav-wrapper black">
                <a className="left brand-logo">
                    Mongo Scraper
                </a>
                <ul className="right hide-on-med-and-down">
                    <li>
                        <a href='/saved'>Home</a>
                    </li>
                    <li>
                        <a href='/saved'>Saved Articles</a>
                    </li>
                    <li>
                        <a onClick={this.scrape.bind(this)} className='waves-effect waves-light btn'>Scraper</a>
                    </li>
                </ul>    
            </div>
        </nav>
      )
    }
  }
  
  export default Header;