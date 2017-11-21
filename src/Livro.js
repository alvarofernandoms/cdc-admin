import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SubmitCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

  constructor() {
    super();
    this.state = {
      titulo: '',
      preco: 0.0,
      autorId: 0
    };
    this.enviaForm = this.enviaForm.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
  }

  enviaForm(evento) {
    evento.preventDefault();
    $.ajax({
      url: 'http://localhost:8080/api/livros',
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({
        titulo: this.state.titulo,
        preco: this.state.preco,
        autorId: this.state.autorId
      }),
      success: function(novaListagem) {
        PubSub.publish('atualiza-lista-livros', novaListagem);
        this.setState({
          titulo: '',
          preco: 0.0,
          autorId: 0
        });
      }.bind(this),
      error: function(resposta) {
        if (resposta.status === 400)
          new TratadorErros().publicaErros(resposta.responseJSON);
      },
      beforeSend: function() {
        PubSub.publish('limpa-erros', {});
      }
    });
  }

  setTitulo(evento) {
    this.setState({
      titulo: evento.target.value
    });
  }

  setPreco(evento) {
    this.setState({
      preco: evento.target.value
    });
  };

  setAutorId(evento) {
    this.setState({
      autorId: evento.target.value
    });
  }


  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={ this.enviaForm } method="post">
          <InputCustomizado id="titulo" type="text" name="titulo" value={ this.state.titulo } onChange={ this.setTitulo } label="Título" />
          <InputCustomizado id="preco" type="number" name="preco" value={ this.state.preco } onChange={ this.setPreco } label="Preço" />
          <div className="pure-control-group" style={ { marginTop: 10 } }>
            <label htmlFor="autorId">
              Autor
            </label>
            <select value={ this.state.autorId } name="autorId" onChange={ this.setAutorId }>
              <option value="">Selecione</option>
              { this.props.lista.map(function(autor) {
                  return <option key={ autor.id } value={ autor.id }>
                           { autor.nome }
                         </option>;
                }) }
            </select>
          </div>
          <SubmitCustomizado id="submit" type="submit" />
        </form>
      </div>
      );
  }
}

class TabelaLivros extends Component {

  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Preço</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            { this.props.lista.map((livro, index) => {
                return (
                  <tr key={ index }>
                    <td>
                      { livro.titulo }
                    </td>
                    <td>
                      { livro.preco }
                    </td>
                    <td>
                      { livro.autor.nome }
                    </td>
                  </tr>
                )
              }) }
          </tbody>
        </table>
      </div>
      );
  }

}

export default class LivroBox extends Component {

  constructor() {
    super();
    this.state = {
      listaLivros: [],
      autores: []
    };
  }

  componentDidMount() {
    $.ajax({
      url: 'http://localhost:8080/api/livros',
      dataType: 'json',
      success: function(resposta) {
        this.setState({
          listaLivros: resposta
        });
      }.bind(this)
    });
    PubSub.subscribe('atualiza-lista-livros', function(topico, novaListaLivros) {
      this.setState({
        listaLivros: novaListaLivros
      });
    }.bind(this));
    $.ajax({
      url: 'http://localhost:8080/api/autores',
      dataType: 'json',
      success: function(resposta) {
        this.setState({
          autores: resposta
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Livros</h1>
        </div>
        <div className="content" id="content">
          <FormularioLivro lista={ this.state.autores } />
          <TabelaLivros lista={ this.state.listaLivros } />
        </div>
      </div>
      );
  }
}