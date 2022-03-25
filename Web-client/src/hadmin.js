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
    this.getClaims = this.getClaims.bind(this);
    this.state = {
      patientAddr: "",
      senderAddr: "",
      message: "",
      pAlist: [],
      pNlist: [],
      ipfslist: [],
      amountlist: [],
      datelist: [],
      data :[],
      patient_data: [],
      doc_data: [],
      ipfs: '',
      file_list: [],
      hash_list: [],
    };
    this.HospgetClaims();

    
    
  }

  async HospgetClaims() {
    const accounts = await web3.eth.getAccounts();
    const result = await InsuranceRecord.methods.getHClaimList(accounts[0]).call();   //pAlist,pNlist,ipfslist,amountList,datelist
    const {0: pAlist, 1:pNlist, 2:amountlist,3:datelist} = result;
    this.state.pAlist=pAlist;
    this.state.pNlist=pNlist;
    this.state.amountlist=amountlist;
    this.state.datelist=datelist;
    
    
    

    this.state.patient_data.push({pname : "Select a patient...", hashname : accounts[0]});
    for (var i=0; i< pNlist.length; i++){
      if (this.state.pNlist[i]==''){
        continue;
      }
      this.state.patient_data.push({pname : this.state.pNlist[i],paddr :this.state.pAlist[i]});
    }
    
    for (var i=0; i< pNlist.length; i++){
      if (this.state.pNlist[i]==''){
        continue;
      }
    this.state.data.push({pname : this.state.pNlist[i], amt : this.state.amountlist[i]*10000,dte : this.state.datelist[i],  paddr : this.state.pAlist[i]})
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

 

  async getClaims(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if (this.state.patientAddr.length < 1)
      {this.state.patientAddr = accounts[0]}
    console.log(this.state.patientAddr);
    const details = await InsuranceRecord.methods.getClaimDetails(this.state.patientAddr).call();
    const {0: pAddr,1:haddr,2:policyname,3:filename,4:ipfsHashList,5:statusline, 6: SC,7:date,8:isVal} = details;
    
    this.state.file_name = filename;
    this.state.hash_list = ipfsHashList;

    // this.state.SignaCount = SC;
    // this.state.dDate =date;
    // this.state.statusline = statusline;
    // console.log(this.state.SignaCount);

    
    for (var i=0; i< filename.length; i++){

    this.state.doc_data.push({filename : this.state.file_name[i], hashname : this.state.hash_list[i]})
  }
 this.forceUpdate();
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
    
    const { patient_data } = this.state;

    let patientlist = patient_data.length > 0
      && patient_data.map((item, i) => {
      return (
        <option key={i} value={item.paddr}>{item.pname}</option>
      )
    }, this);

    
    const { doc_data } = this.state;

    let doclist = doc_data.length > 0
      && doc_data.map((item, i) => {
      return (
        <option key={i} value={item.hashname}>{item.filename}</option>
      )
    }, this);


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
            <select className="form-control" onChange={event =>this.setState({ patientAddr: event.target.value })}>
                      {patientlist}
                    </select>
            
              
             
            </div>
      
            
            <div className="form-group">
            <select className="form-control" onChange={event =>this.setState({ ipfs: event.target.value })}>
                      {doclist}
                    </select>
             
            </div>
       
            <div className="form-group">
            

            <div class="text-center">
            
            <button
                className="btn btn-primary btn-lg btn-docview "
                onClick={this.getClaims}
              >
                Select
              </button>
                
              
              
              <button
                className="btn btn-primary btn-lg btn-docview"
                onClick={this.showDocument}
              >
                View
              </button>
             
              </div>
            </div>
          </div>
        </div>
       


      
        <div className="col-md-15">
          <div className="login-form">
            <h4 className="text-center">Approve Medical Record</h4>
            <div className="form-group">
            <select className="form-control" onChange={event =>this.setState({ patientAddr: event.target.value })}>
                      {patientlist}
                    </select>
             
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
