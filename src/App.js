import React from 'react';
import './App.css';
import bigInt from 'big-integer'

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messageChar: '',
      encryptedMessage: '',
      decryptedMessage: '',
      decodedMessage: '',
      p: '',
      q: '',
      e: '',
      n: '',
      d: '',
      isEncrypted: false,
      totient: '',
    };
  }

  getMessageCharArray = (str) => {
    const codes = str
      .split('')
      .map(i => i.charCodeAt())
      .join('');

    this.setState({ messageChar: codes })
  }

  handleChangeMessage = async (e) => {
    await this.setState({ message: e.target.value })
    this.getMessageCharArray(this.state.message)
  }

  isPrime = (num) => {
    if (num <= 1) return false;
    if (num === 2) return true;

    var sqrt = Math.sqrt(num);

    for (var i = 2; i <= sqrt; i++)
      if (num % i === 0) return false;
    return true;
  }

  enableButton = () => {
    return this.state.message !== '';
  }

  randomPrime = () => {
    const min = 1
    const max = 99999999;
    
    while (true) {
      let p = bigInt.randBetween(min, max);
      if (this.isPrime(p)) {
        return p;
      } 
    }
  }

  generateKey = async () => {
    let e
    let totient;
    let p;
    let q;
    let n;
    let d;

    do {
      p = this.randomPrime();
      q = this.randomPrime();
      totient = bigInt.lcm(
        p-1,
        q-1
      );
      e = bigInt.randBetween(1, totient);
    } while (bigInt.gcd(e, totient).notEquals(1));

    await this.setState({ e })
    n = p * q
    d = e.modInv(totient);
    await this.setState({ n })
    await this.setState({ d })
    await this.setState({ p })
    await this.setState({ q })
    await this.setState({ totient })

    this.encrypt(this.state.messageChar, this.state.n, this.state.e)
  }

  encrypt = (encodedMsg, n, e) => {
    console.log(bigInt(encodedMsg));
    let encryptedMessage = bigInt(encodedMsg).modPow(e, n);
    this.setState({ encryptedMessage });
    this.setState({isEncrypted: 'true'})
  }

  decrypt = async (encryptedMsg, d, n) => {
    let decryptedMessage = bigInt(encryptedMsg).modPow(d, n); 
    await this.setState({decryptedMessage});
    this.decode(this.state.decryptedMessage);
  }

  decode = (code) => {
    const stringified = code.toString();
    let decodedMessage = '';

    for (let i = 0; i < stringified.length; i += 2) {
      let num = Number(stringified.substr(i, 2));
      
      if (num <= 30) {
        decodedMessage += String.fromCharCode(Number(stringified.substr(i, 3)));
        i++;
      } else {
        decodedMessage += String.fromCharCode(num);
      }
    }

    this.setState({decodedMessage});
  }


  render() {
    let {message, p, q, e, d, n, encryptedMessage, messageChar, isEncrypted, decryptedMessage, decodedMessage, totient} = this.state
    return (
      <div>
        <label>
          Mensagem:
          <input type="text" value={message} onChange={this.handleChangeMessage} />
        </label>
        <br />
        <h1>Message Char:{messageChar}</h1>
        <h1>p:{p.toString()}</h1>
        <h1>q:{q.toString()}</h1>
        <h1>e:{e.toString()}</h1>
        <h1>totient:{totient.toString()}</h1>
        <h1>n:{n}</h1>
        <h1>d:{d.toString()}</h1>
        <h1>Encrypted Message:{encryptedMessage.toString()}</h1>
        <input type="submit" value="Generate Key and Encrypt" disabled={!this.enableButton()} onClick={() => this.generateKey()} />
        <br/>
        <input type="submit" value="Decrypt" disabled={!isEncrypted} onClick={() => this.decrypt(encryptedMessage, d, n)} />
        <br/>
        <h1>Decrypted Message:{decryptedMessage.toString()}</h1>
        <h1>Decoded Message:{decodedMessage}</h1>
      </div>
    );
  }
}
