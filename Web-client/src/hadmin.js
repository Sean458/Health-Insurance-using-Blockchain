import React from "react";
import ReactDOM from "react-dom";
import HealthCare from "./HealthCare";
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css";  
import web3 from "./web3";
import InsuranceRecord from "./InsuranceRecord";
import Header from './Components/header';

import Footer from './Components/footer'; 


export default class Hadmin extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.HospgetClaims = this.HospgetClaims.bind(this);
    this.showDocument = this.showDocument.bind(this);
    this.state = {
      patientAddr: "",
      senderAddr: "",
      message: "",
      pAlist: [],
      pNlist: [],
      ipfslist: [],
      amountlist: [],
      datelist: [],
      result : [],
      data :[],
      ipfs: '',
    };
    this.HospgetClaims();
  }

  async HospgetClaims() {
    const accounts = await web3.eth.getAccounts();
    this.state.result = await InsuranceRecord.methods.getHClaimList(accounts[0]).call();   //pAlist,pNlist,ipfslist,amountList,datelist
    const {0: pAlist, 1:pNlist, 2:amountlist,3:datelist} = this.state.result;
    this.state.pAlist=pAlist;
    this.state.pNlist=pNlist;
    this.state.amountlist=amountlist;
    this.state.datelist=datelist;
    
    for (var i=0; i< pNlist.length; i++){
      if (this.state.pNlist[i]==''){
        continue;
      }
    this.state.data.push({pname : this.state.pNlist[i], amt : this.state.amountlist[i]*10,dte : this.state.datelist[i],  paddr : this.state.pAlist[i]})
  }


    // console.log(pAlist);
    // console.log(pNlist);
    // console.log(ipfslist);
    // console.log(amountlist);
    // console.log(datelist);
    // console.log(this.state.data);

    this.forceUpdate();
  }

  async handleClick(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log(this.state.patientAddr);
    await InsuranceRecord.methods.signClaim(this.state.patientAddr, accounts[0])
      .send({ from: accounts[0], gas: 2100000 });
    this.setState({ message: "Record approved!" });
  }

  async showDocument(event) {
    event.preventDefault();
    //const accounts = await web3.eth.getAccounts();
    // const accounts = await web3.eth.getAccounts();
    // const details = await InsuranceRecord.methods.getClaimDetails(text).call();
    // const {0: pAddr,1:haddr, 2:ipfs, 3: SC,4:pValue,5:date,6:isVal} = details;
    //this.state.ipfsHash = ipfs;
    //const IPFS = this.state.ipfsHash;
    console.log(this.state.ipfs);
    window.open("https://ipfs.io/ipfs/"+(this.state.ipfs))
  }
  



  render() {
    sessionStorage.setItem("status", "Logout");
    const columns = [{  
      Header: 'Name',  
      accessor: 'pname' 
      },
      {  
       Header: 'Amount',  
       accessor: 'amt'  
       },
       {  
         Header: 'Claim Date',  
         accessor: 'dte'  
         },
       
         {  
          Header: 'PAddr',  
          accessor: 'paddr'  
          }]  
    return (
      <><Header />
      <body class="d-flex flex-column min-vh-100">
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <div className="col-md-12">
      <h1  className="text-center">Hospital Admin</h1>
      <div className="c-list">
      <h3 className="text-center">Current Claim Records</h3>
      <div>  
              <ReactTable  
                  data={this.state.data}  
                  columns={columns}  
                  defaultPageSize = {2}  
                  pageSizeOptions = {[2, 4, 6]}  
              />  
          </div>  
         </div>
       </div>
       <br></br> <br></br> <br></br>
      <div className="container container-fluid ">
      
      <div className="col-md-15">
          <div className="login-form">
            <h4 className="text-center">Verify Documents</h4>
            <div className="form-group">
              <input
                type="string"
                
                onChange={event => this.setState({ ipfs: event.target.value })}
                className="form-control"
                placeholder="Enter IPFS Hash" />
             
            </div>
            
            <div className="form-group">

            <div class="text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={this.showDocument}
              >
                Verify
              </button>
              </div>
            </div>
            </div>
            </div>
       


      
        <div className="col-md-15">
          <div className="login-form">
            <h4 className="text-center">Approve Medical Record</h4>
            <div className="form-group">
              <input
                type="string"
                
                onChange={event => this.setState({ patientAddr: event.target.value })}
                className="form-control"
                placeholder="Enter Patient Address" />
             
            </div>
            
            <div className="form-group">

            <div class="text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={this.handleClick}
              >
                Approve
              </button>
              </div>
            </div>
            {this.state.message && (
              <p className="alert alert-danger fade in">{this.state.message}</p>
            )}
          </div>
        </div>
        {/* <div className="col-md-6 col-md-offset-2">
          <div className="c-list">
            <h2 className="text-center">Records</h2>
            <div>  
              <ReactTable  
                  data={this.state.data}  
                  columns={columns}  
                  defaultPageSize = {2}  
                  pageSizeOptions = {[2, 4, 6]}  
              />  
          </div> 
          </div>
        </div> */}
      </div>
      </body>
      <Footer /></>
    );
  }
}
