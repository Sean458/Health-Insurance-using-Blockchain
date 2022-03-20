import React from 'react';
//import './insurance.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link,Redirect } from "react-router-dom";
import InsuranceRecord from "./InsuranceRecord";
import web3 from "./web3";
import Header from './Components/header';
import Footer from './Components/footer'; 
import App from './index';
import Patient from './patient';

const FullApp = () => (
  <Router>
    <div>

    
      
      <Route path="/signin" component={App} />


    </div>
  </Router>
);

 export default class PRegister extends React.Component{
  constructor(props) {
    super(props);
  
    this.handleClick = this.handleClick.bind(this);
    this.getAcc = this.getAcc.bind(this);
    this.checkRegistered = this.checkRegistered.bind(this);
    
    this.state = {
        //registered : [],
        pname : "",
        paddr : "",
        username : "",
        password : "",
        pVal : "",
        isVal : false,
    };
    this.getAcc();
    this.checkRegistered();
  }

  async getAcc() {
    const accounts = await web3.eth.getAccounts();
    this.state.paddr = accounts[0];
    
    this.forceUpdate();
    
  }

  async checkRegistered () {
    const accounts = await web3.eth.getAccounts();
    this.state.result = await InsuranceRecord.methods.getPatients(accounts[0]).call();
    const {0: pAddr,1:username, 2:pName, 3: passwrd,4:isValue,5:policyID,6:policyStat} = this.state.result;
    this.state.isVal = isValue;
    this.forceUpdate();
  }

  async handleClick(event) {
    event.preventDefault();
    //console.log("1",this.state.ipfsHash);
    const accounts = await web3.eth.getAccounts();
      console.log(this.state.paddr);
      console.log(this.state.pname);
      console.log(this.state.username);
      console.log(this.state.password);
      InsuranceRecord.methods.registerPatient(
        


        this.state.paddr,
        this.state.pname,
        this.state.username,
        this.state.password,

      ).send({ from: accounts[0], gas: 2100000 });
      this.setState({ message: "Registration Complete!" });

      //this.state.registered.push(accounts[0]);
      }





   render() {
    const renderRecord = () => {
      console.log(this.state.isVal)
      //console.log(this.state.paddr)
      //console.log(this.state.registered.includes(this.state.paddr))
      if(this.state.isVal) {
      
        return(
          <Redirect to="/signin" />
        );
      } 
      
      else {
        
        return(
          <div className="container container-fluid login-conatiner">

            <div className="col-md-4">
              <div className="login-form">
                <form method="post" autoComplete="off">
                  <h2 className="text-center">Register as Patient</h2>
                  {/* <div className="form-group">
                    <input
                      type="text"
                      value={this.state.recID}
                      onChange={event =>
                        this.setState({ recID: event.target.value })
                      }
                      className="form-control"
                      placeholder="ID"
                    />
                  </div> */}
                  <div className="form-group">
                    <input disabled={true}
                      type="text"
                      value={this.state.paddr}
                      className="form-control"
                      placeholder={this.state.paddr}
                    />
                  </div>


                  <div className="form-group">
                    <input
                      type="text"
                      value={this.state.pname}
                      onChange={event =>
                        this.setState({ pname: event.target.value })
                      }
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  
                  
                  <div className="form-group">
                    <input
                      type="text"
                      value={this.state.username}
                      onChange={event =>
                        this.setState({ username: event.target.value })
                      }
                      className="form-control"
                      placeholder="Username"
                    />
                    </div>
                   <div className="form-group">
                    <input
                      type="text"
                      value={this.state.password}
                      onChange={event =>
                        this.setState({ password: event.target.value })
                      }
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.handleClick}
                    >
                      Register
                    </button>
                  </div>
                  {this.state.message && (
                    <p className="alert alert-danger fade in">
                      {this.state.message}
                    </p>
                  )}
                  <div className="clearfix" ></div>
                </form>
              </div>
            </div>
          </div>
        );
      }
    }
  
     return(
       

      <><Header />
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <div>
        {renderRecord()}
      </div>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br> <br></br> <br></br><br></br><br></br><br></br><br></br>
       <Footer /></>
     );
   }
 }
