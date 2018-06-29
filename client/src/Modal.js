import React, { Component } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import './Modal.css'

class ExampleApp extends React.Component {
    constructor () {
      super();
      this.state = {
        showModal: false,
        input: '',
        note: ''
      };
      
      this.handleOpenModal = this.handleOpenModal.bind(this);
      this.handleCloseModal = this.handleCloseModal.bind(this);
      this.submitNote = this.submitNote.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
      this.onDeleteNote = this.onDeleteNote.bind(this);
    }
    
    handleOpenModal (e) {
      this.setState({ showModal: true });
      var id = e.target.getAttribute('value')
      axios.get('/api/articlepop' ,{
          params: {
            id: id
          }
      }).then((result) => {
          this.setState({note: result.data.note}, (element) => {
              console.log(this.state.note)
          })
      })
    }
    
    handleCloseModal () {
      this.setState({ showModal: false });
    }

    submitNote(e) {
        var id = e.target.getAttribute('value')
        var note = this.state.input
        console.log(id)
        console.log(note)
        axios.post(`/api/notes`, {
            id: id,
            note: note
        }).then(function (response) {
            console.log(response.data)
        }).catch(function (error) {
            console.log(error);
        }); 
        this.setState({input: ''})   
    }

    onInputChange(term) {
        this.setState({input: term.target.value})
        console.log(this.state.input)
    }

    onDeleteNote(e) {
        var id = e.target.getAttribute('value')
        console.log(id)
        axios.delete('/api/note/delete', {
            data: {id: id}
        }).then((result) => {
            console.log(result)
        })
    }

    
    render () {
      return (
        <div>
          <a onClick={this.handleOpenModal} value={this.props.value} className='save waves-effect waves-light btn'>Add Note</a>
          <ReactModal 
             isOpen={this.state.showModal}
             contentLabel="Minimal Modal Example"
          >
            <a onClick={this.handleCloseModal} className='save waves-effect waves-light btn'>Close Notes</a>
            <div className='row'>
                <form className='col s12'>
                    <div className='row'>
                        <div className='input-field cols12'>
                        <input defaultValue={this.state.input} onChange={this.onInputChange} id="last_name" type="text" className="validate"></input>
                        <a className="btn-floating btn-large waves-effect waves-light red"><i onClick={this.submitNote} value= {this.props.value} className="material-icons">+</i></a>
                        {/* <label for="last_name">Enter Note</label> */}
                        <p>Notes</p>
                        {
                            this.state.note && 
                            this.state.note.map((element) => {
                                return <div>
                                    <div className='collection'>
                                        <a key={element._id}className="collection-item">{element.body}</a>
                                    </div>
                                        <a className='save waves-effect waves-light btn' value={element._id} onClick={this.onDeleteNote}>Delete Note</a>
                                       </div>
                            })
                        }
                        </div>
                    </div>
                </form>
            </div>
          </ReactModal>
        </div>
      );
    }
  }

  export default ExampleApp