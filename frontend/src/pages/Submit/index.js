import React, { Component } from 'react';

import axios from 'axios';
import api from '../../services/api';
import Dropzone from 'react-dropzone';
//import answer from '../../../backend/answer.json';

import './style.css';

export default class Submit extends Component {
  state = {
    token: '',
    jsonStatus: '',
    score: '0%',
  }

  handleJson = async(e) =>{

    e.preventDefault();

    const response = await api.get('decrypt');

    console.log(response.data);

    this.setState({
      jsonStatus: response.data.jsonStatus,
      token: response.data.token,
    });
  }

  handleSubmit = async(files) =>{

    for(var i=0; i < Object.keys(files).length; i++){
      const data = new FormData();

      data.append('answer', files[i], files[i].name);
  
      const url = `https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${this.state.token}`;
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
  
      const response = await axios.post(url, data, config);

      if(response.data){
        this.setState({
          score: response.data.score + '%'
        });
      }  
    }
  }
  
  render() {
    return (
      <div className='main-container'>
        
        <header>Codenation Challenge<h1>Selecione seu arquivo JSON</h1></header>
        <Dropzone onDropAccepted={this.handleSubmit}>
          {({getRootProps, getInputProps})=>(
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>
        <button className='btn-json' onClick={this.handleJson}>GERAR JSON</button>
        <small className="json-status">{this.state.jsonStatus}</small>
        <small className="score">Seu score: {this.state.score}</small>
      </div>
    );
  }
}
