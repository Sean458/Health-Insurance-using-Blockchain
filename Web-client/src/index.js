import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link,Redirect } from "react-router-dom";
import Patient from './patient'
import Hadmin from './hadmin'
import Labadmin from './ladmin'
import Insurance from './insurance'
import './index.css'
import web3 from "./web3";

import home from './home';
import login from './login';
import pRegister from './pRegister';
import hRegister from './hRegister';
import Header from './Components/header';
import Footer from './Components/footer'; 
import InsuranceRecord from "./InsuranceRecord";
const FullApp = () => (
  <Router>
    <div>

    
      <Route exact path="/" component={home} />
      <Route path="/pRegister" component={pRegister} />
      <Route path="/hRegister" component={hRegister} />
      <Route path="/login" component={login} />
      <Route path="/signin" component={App} />
      <Route path="/patient" component={Patient} />
      <Route path="/hadmin" component={Hadmin} />
      <Route path="/labadmin" component={Labadmin} />
      <Route path="/insurance" component={Insurance} />

    </div>
  </Router>
);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.getVals = this.getVals.bind(this);
    this.getAcc = this.getAcc.bind(this);
    
    // this.checkLogin = this.checkLogin.bind(this);

    this.state = {
      username:'',
      password:'',
      chk_username: '',
      chk_password: '',
      login:false,
      curr_addr : '',
      pth : '',
      pVal: false,
      hVal: false,
      
    };
    

    
  }

  // async checkLogin() {
  //   const accounts = await web3.eth.getAccounts();
  
  //   this.state.hVal = await InsuranceRecord.methods.loginHospital(this.state.username,this.state.password,accounts[0]).call();
  //   this.state.pVal = await InsuranceRecord.methods.loginPatient(this.state.username,this.state.password,accounts[0]).call();
  //   console.log(this.state.hVal);
  //   console.log(this.state.pVal);
  //   this.forceUpdate();
  // }

  async getVals() {
    const accounts = await web3.eth.getAccounts();
    const result1 = await InsuranceRecord.methods.getHospitals(accounts[0]).call();
    const {0: haddr,1:hpass, 2:hname, 3:hValue,} = result1; 
    this.state.hVal = hValue;

    const result2 = await InsuranceRecord.methods.getPatients(accounts[0]).call();
    const {0: pAddr,1:username, 2:pName, 3: password,4:pValue,5:policyID,6:policyStat} = result2;
    this.state.pVal = pValue;

    // console.log(this.state.hVal);
    // console.log(this.state.pVal);
    // this.setState({pVal: this.state.pVal});
    // this.setState({hVal: this.state.hVal});
    this.forceUpdate();
    
  }

  async getAcc() {
    const accounts = await web3.eth.getAccounts();
    this.state.curr_addr = accounts[0];

    // console.log(this.state.hVal);
    // console.log(this.state.pVal);
    
    if (accounts[0]=='0xC3580Cb3E0252B3B5D0a360863e6AA5c63f4AC4b'){
      this.state.chk_username = 'MedBloc';
      this.state.chk_password = 'insurance';
      this.state.pth = "/insurance";
    }

    if (this.state.hVal){
    this.state.result = await InsuranceRecord.methods.getHospitals(accounts[0]).call();
    const {0: haddr,1:password, 2:hname, 3:isValue,} = this.state.result; 
    
    this.state.chk_username = hname;
    this.state.chk_password = password;
    this.state.pth = "/hadmin";
    
    }
    
    else if (this.state.pVal){
      this.state.result = await InsuranceRecord.methods.getPatients(accounts[0]).call();
      const {0: pAddr,1:username, 2:pName, 3: password,4:isValue,5:policyID,6:policyStat} = this.state.result;
      
      this.state.chk_username = username;
      this.state.chk_password = password;
      this.state.pth = "/patient";
      
      }

    this.forceUpdate();
    }
  





  render() {
    //console.log(this.state.pth);
    this.getVals();
    this.getAcc();
    return (

      <><Header />
      
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      
      <div className="container container-fluid login-container">
        
        {this.state.login ? this.state.username == this.state.chk_username ? this.state.password == this.state.chk_password ? <Redirect to={this.state.pth} /> :
             null : null : null }
        <div style={{
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          <div className="login-form">
            <form method="post">
              <h1 className="text-center">Log in</h1>

              <div className="form-group">

                <input disabled ={true} type="text" className="form-control" placeholder={this.state.curr_addr}></input>
              </div>
              
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Username" onChange={e => this.setState({ username: e.target.value })}></input></div>
              
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Password" onChange={e => this.setState({ password: e.target.value })}></input></div>
              
              <div className="form-group">
                <button className="btn btn-primary btn-block" onClick={() => this.setState({ login: true })}>Submit</button></div>
              <div className="clearfix">
              </div>
            </form>
            
          </div>
        </div>
      </div>

      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      
      <Footer /></>

        
        
    );
  }


}

ReactDOM.render(<FullApp />, document.getElementById('root'));
