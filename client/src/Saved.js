import React, { Component } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import ExampleApp from './Modal'

class Saved extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved : ''
    };

    this.Unsave = this.Unsave.bind(this);
  }
  componentDidMount() {
    axios.get('/api/saved').then(
        (result) => {
            console.log(result)
            this.setState({saved : result.data})
    })
  }

  Unsave(e) {
    var id = e.target.getAttribute('value')
    console.log(id)
    axios.put('/api/unsave', {
        mongoId : id,
    }).then(function(response){
        console.log('saved successfully')
  });
  }

    render() {
      return (
        <div>
        {
            this.state.saved && 
            this.state.saved.map((element) => {
                return  <div key={element._id} className="row">
                            <div className="col s12 .Articles-card">
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                <span className="card-title">{element.headline}</span>
                                <p>{element.summary}</p>
                                </div>
                                <div className="card-action">
                                <a value={element._id} onClick={this.Unsave}>Unsave</a>
                                {/* <a className='save waves-effect waves-light btn modal-trigger'>Add Note</a> */}
                                <ExampleApp value={element._id} />
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

export default Saved;