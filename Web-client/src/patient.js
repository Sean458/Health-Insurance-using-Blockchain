import React from "react";
import ReactDOM from "react-dom";
import HealthCare from "./HealthCare";
import web3 from "./web3";
import ipfs from "./ipfs.js";

import Header from './Components/header';

import Footer from './Components/footer'; 

export default class Patient extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.seeRecord = this.seeRecord.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.state = {
      // recID: "",
      pname: "",
      dDate: "",
      hname: "",
      price: "",
      message: "",
      recordCheck: false,
      record: [],
      buffer: null,
      ipfsHash: ""
     // IPFS: " "
    };
    this.seeRecord();
  }

  
  async handleClick(event) {
    event.preventDefault();
    //console.log("1",this.state.ipfsHash);
    const accounts = await web3.eth.getAccounts();
    ipfs.files.add(this.state.buffer,(err,result) => {
      if(err) {
        console.log(err);
        return;
      }
      HealthCare.methods.newRecord(
        // this.state.recID,
        this.state.pname,
        this.state.dDate,
        this.state.hname,
        this.state.price,
        result[0].hash
      ).send({ from: accounts[0], gas: 2100000 }).then((r) => {
        this.setState({ipfsHash: result[0].hash});
        console.log(this.state.ipfsHash);
      });
    });
    // await HealthCare.methods
    //   .newRecord(
    //     // this.state.recID,
    //     this.state.pname,
    //     this.state.dDate,
    //     this.state.hname,
    //     this.state.price,
    //     this.state.ipfsHash
    //   )
    //   .send({ from: accounts[0]});
      console.log("2",this.state.ipfsHash);
    this.setState({ message: "Claim Submitted" });
    this.forceUpdate();
  }

  async captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)});
      console.log("buffer",this.state.buffer);

    }
    console.log("buffer1",this.state.buffer);

    // ipfs.files.add(this.state.buffer,(err,result) => {
    //   if(err) {
    //     console.log(err);
    //     return;
    //   }
    //   this.setState({ipfsHash: result[0].hash});
    //   console.log(result[0].hash,this.state.ipfsHash);
    //   console.log(typeof result[0].hash);
    // });    
  }

  async seeRecord() {
    const accounts = await web3.eth.getAccounts();
    this.state.recordCheck = await HealthCare.methods.checkRecord(accounts[0]).call();
    if (this.state.recordCheck) {
      this.state.record = await HealthCare.methods.recordList(accounts[0]).call(); 
    }
    console.log(this.state.record);
    console.log(this.state.recordCheck);
    this.forceUpdate();
  }

  async showDocument(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const IPFS = await HealthCare.methods.getIPFS(accounts[0]).call();
    console.log(IPFS);
    window.open("https://ipfs.io/ipfs/"+(IPFS))
  }


  render() {

    
    const check = this.state.recordCheck;
    console.log("In render",check);
    const statusDisplay = () => {
      if(this.state.record["hSign"] && this.state.record["lSign"]) {
        return (<th>Claim Approved</th>);
      }
      else if(this.state.record["hSign"]){
        return (<th>Validated by Hospital</th>);
      }
      else if(this.state.record["lSign"]){
        return (<th>Validated by Medical Lab</th>);
      }
      else
      {
        return (<th>Claim Pending</th>);
      }

    }
    const renderRecord = () => {
      if(check) {
        console.log("Status");
        return(
          <div className="container container-fluid login-conatiner">
            <div className="">
              <div className="">
                <h2 className="text-center">Record Status</h2>
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr className="row">
                      <th className="">Patient Name:</th>
                      <th className="">{this.state.record["name"]}</th>
                    </tr>
                    <tr className="row">
                      <th className="">Date of Claim:</th>
                      <th className="">{String(this.state.record["date"]).split('-').reverse().join(' / ')}</th>
                    </tr>
                    <tr className="row">
                      <th className="">Hospital Name:</th>
                      <th className="">{this.state.record["hospitalName"]}</th>
                    </tr>
                    <tr className="row">
                      <th className="">Amount Claimed:</th>
                      <th className="">{this.state.record["price"]}</th>
                    </tr>
                    <tr className="row">
                      <th className="">Uploaded Document</th>
                      <th className=""><button onClick={this.showDocument}>View Document</button></th>
                    </tr>
                    <tr className="row">
                      <th className="">Claim Status</th>
                      {statusDisplay()}
                    </tr>
                  </tbody> 
                </table>
              </div>
            </div>
          </div>
        );
      } else {
        console.log("Form");
        return(
          <div className="container container-fluid login-conatiner">
            <div className="col-md-4">
              <div className="login-form">
                <form method="post" autoComplete="off">
                  <h2 className="text-center">New Claim</h2>
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
                      type="Date"
                      value={this.state.dDate}
                      onChange={event =>
                        this.setState({ dDate: event.target.value })
                      }
                      className="form-control"
                      placeholder="Date"
                    />
                  </div>
                  <div className="form-group">


                    <select id="selection"  value={this.state.hname} onChange={event =>this.setState({ hname: event.target.value })} className="form-control" >
                      <option selected>Select Hospital..</option>
                      <option>Apollo</option>
                      <option>Jupyter</option>
                      <option>Fortis</option>
                      <option>Jaslok</option>
                      <option>Lilavati</option>
                    </select >

                        
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={this.state.price}
                      onChange={event =>
                        this.setState({ price: event.target.value })
                      }
                      className="form-control"
                      placeholder="Price"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="file"            
                      onChange={this.captureFile}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.handleClick}
                    >
                      Submit
                    </button>
                  </div>
                  {this.state.message && (
                    <p className="alert alert-danger fade in">
                      {this.state.message}
                    </p>
                  )}
                  <div className="clearfix" />
                </form>
              </div>
            </div>
          </div>
        );
      }
    }
    return(
      <><Header />
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <div>
        {renderRecord()}
      </div>
      <br></br> <br></br> <br></br> <br></br> <br></br><br></br><br></br>
      <Footer /></>
    );
  }
}
