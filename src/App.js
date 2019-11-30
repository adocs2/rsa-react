import React from 'react';
import './App.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      p: {
        value: '',
        isPrime: '',
      },
      q: {
        value: '',
        isPrime: '',
      },
    };
  }

  handleChangeMessage = (e) => {
    this.setState({ message: e.target.value })
  }

  handleChangeP = (e) => {
    let p = { ...this.state.p }
    p.value = e.target.value;
    this.setState({ p })
  }

  handleChangeQ = (e) => {
    let q = { ...this.state.q }
    q.value = e.target.value;
    this.setState({ q })
  }

  isPrime = (num) => {
    if (num <= 1) return false;
    if (num === 2) return true;

    // storing the calculated value would be much 
    // better than calculating in each iteration
    var sqrt = Math.sqrt(num);

    for (var i = 2; i <= sqrt; i++)
      if (num % i === 0) return false;
    return true;
  }

  enableButton = () => {
    return this.isPrime(this.state.p.value) && this.isPrime(this.state.q.value);
  }


  render() {
    return (
      <div>
        <label>
          Mensagem:
          <input type="text" value={this.state.message} onChange={this.handleChangeMessage} />
        </label>
        <br />
        <label>
          Primo P:
          <input type="number" value={this.state.p.value} onChange={this.handleChangeP} />
        </label>
        <br />
        <label>
          Primo Q:
          <input type="number" value={this.state.q.value} onChange={this.handleChangeQ} />
        </label>
        <br />
        <h1>{this.state.message}</h1>
        <h1>{this.state.p.value}</h1>
        <h1>{this.state.q.value}</h1>
        <input type="submit" value="Enviar" disabled={!this.enableButton()} />
      </div>
    );
  }
}
