import PubSub from 'pubsub-js';

export default class TratadorErros {
  publicaErros(erros) {
    erros.errors.forEach((erro, index) => {
      PubSub.publish('erro-validacao', erro);
    });
  }
}