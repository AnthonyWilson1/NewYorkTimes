import React, { Component } from 'react';
import './Articles.css'
import axios from 'axios';

class Article extends Component {
    constructor(props) {
        super(props)
        this.state = {articles : ''}

        this.save = this.save.bind(this);
      }


    backwards(param) {
        var array = []
        console.log(param)
        // param.forEach(element => {
        //     array.unshift(element)
        // })
        for (let i = 0; i < param.length; i++) {
            array.unshift(param[i])
        }
        return array
    }

    componentDidMount() {
        axios.get('/api/articles').then(
            (result) => {
                console.log(result.data)
                let newResults = this.backwards(result.data)
                this.setState({articles : newResults})
            })
        // document.addEventListener('click', function (event) {
        //     console.log(event.target.className)
        //     if (event.target.tagName === 'A' && event.target.className.includes('save')) {
        //         console.log(event.target.getAttribute('value'))
        //     }
        // })
    }  

    save(e) {
        var id = e.target.getAttribute('value')
        console.log(id)
        axios.put('/api/save', {
            mongoId : id,
        }).then(function(response){
            console.log('saved successfully')
    });
    }

    render() {
      return (
        <div>
            {
                this.state.articles && 
                this.state.articles.map((element) => {
                    return  <div key={element._id} className="row">
                                <div className="col s12 .Articles-card">
                                <div className="card blue-grey darken-1">
                                    <div className="card-content white-text">
                                    <span className="card-title">{element.headline}</span>
                                    <p>{element.summary}</p>
                                    </div>
                                    <div className="card-action">
                                    <a href={element.link}>Link to Article</a>
                                    <a className='save waves-effect waves-light btn' value={element._id} onClick={this.save}>Save</a>
                                    </div>
                                </div>
                                </div>
                            </div>
                })
            }
        </div>
      )
    }
  }
  
  export default Article;