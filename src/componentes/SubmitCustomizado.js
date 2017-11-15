import React, { Component } from 'react';

export default class SubmitCustomizado extends Component {

  render() {
    return (
      <div className="pure-control-group">
        <label></label>
        <button id={ this.props.id } type={ this.props.type } className="pure-button pure-button-primary">Gravar</button>
      </div>
      );
  }
}