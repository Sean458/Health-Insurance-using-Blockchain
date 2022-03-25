import React from 'react';
//import './insurance.css';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css";  
import web3 from "./web3";
import Header from './Components/header';

import InsuranceRecord from "./InsuranceRecord";


//import Footer from './Components/footer'; 

 export default class Insurance extends React.Component{
  constructor(props) {
    super(props);
  
    this.getIClaims = this.getIClaims.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.requestDocs = this.requestDocs.bind(this);
    this.getClaims = this.getClaims.bind(this);
    this.showDocument = this.showDocument.bind(this);

    this.state = {
      patientAddr: "",
      pAlist: [],
      pNlist: [],
      ipfslist: [],
      SClist: [],
      amountlist: [],
      datelist: [],
      hNlist: [],
      policyname: [],
      result : [],
      data :[],
      message :'',

      patient_data: [],
      doc_data: [],
      ipfs: '',
      file_list: [],
      hash_list: [],
    //   columns:[
    //     {Header: 'Name', accessor: 'pname'},
    //     {Header: 'Hospital', accessor: 'hname'},
    //     {Header: 'Amount', accessor: 'amt'},
    //     {Header: 'Status', accessor: 'stat'}],
    };
    this.getIClaims();
  }

  async requestDocs(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await InsuranceRecord.methods.requestDoc(this.state.patientAddr, this.state.message)
      .send({ from: accounts[0], gas: 2100000 });


  }


  async getIClaims() {
    const accounts = await web3.eth.getAccounts();
    this.state.result = await InsuranceRecord.methods.getIClaimList().call();
    const {0: pAlist, 1:pNlist, 2:policyname,3:SClist,4:amountlist,5:datelist,6:hNlist} = this.state.result;
    this.state.pAlist=pAlist;
    this.state.pNlist=pNlist;
    this.state.policyname=policyname;
    this.state.SClist=SClist;
    this.state.amountlist=amountlist;
    this.state.datelist=datelist;
    this.state.hNlist=hNlist;

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
    this.state.data.push({pname : this.state.pNlist[i], hname : this.state.hNlist[i], policyname: this.state.policyname[i], amt : this.state.amountlist[i]*10000,dte : this.state.datelist[i], stat : this.state.SClist[i],paddr :this.state.pAlist[i]})}

    //pAlist,pNlist,ipfslist,SClist,amountList,datelist,hNlist

    // console.log(pAlist);
    // console.log(pNlist);
    // console.log(SClist);
    // console.log(amountlist);
    // console.log(datelist);
    // console.log(hNlist);
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

    //  const data = [ { 
    // pname: this.state.pNlist[0],  
    // hname: this.state.hNlist[0],
    // amt: this.state.amountlist[0],
    // dte: this.state.datelist[0],
    // stat: this.state.SClist[0], }]
//     },{  
//       id: 2,
//      name: 'Ahana',  
//      hname: 'Jupyter',  
//      amt:5000,
//      stat:"Hospital verified"
//      },{  
//       id: 3,
//      name: 'Peter',  
//      hname: 'Apollo'  , 
//      amt:4000  ,
//      stat:"Request more docs"
//      },{  
//       id: 4,
//      name: 'Virat',  
//      hname: 'Jupyter' ,
//      amt:1000,
//      stat:"Hospital verified"
//      },{  
//       id: 5,
//      name: 'Rohit',  
//      hname: 'Apollo' ,
//      amt:8000,
//      stat:"Reimburse"
//      },{  
//       id: 6,
//      name: 'Dhoni',  
//      hname: 'Lilavati' , 
//      amt:2000,
//      stat:"Reimburse"
//      }]  
 const columns = [{  
   Header: 'Name',  
   accessor: 'pname' 
   },{  
   Header: 'Hospital Name',  
   accessor: 'hname'  
   },{  
    Header: 'Policy Name',  
    accessor: 'policyname'  
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
      Header: 'Signature Count',  
      accessor: 'stat'  
      },
      {  
        Header: 'Patient Address',  
        accessor: 'paddr'  
        }]  
     return(

      <><Header />
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <div className="col-md-12">
      <h3  className="text-center">Insurance Page</h3>
      <div className="c-list">
      <h2 className="text-center">Claim Records</h2>
      <div>  
              <ReactTable  
                  data={this.state.data}  
                  columns={columns}  
                  defaultPageSize = {2}  
                  pageSizeOptions = {[2, 4, 6]}  
              />  
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
            <h4 className="text-center">Request for Additional Documents</h4>
            <div className="form-group">
            <select className="form-control" onChange={event =>this.setState({ patientAddr: event.target.value })}>
                      {patientlist}
                    </select>
             
            </div>

            <div className="form-group">
              <input
                type="string"
                
                onChange={event => this.setState({ message: event.target.value })}
                className="form-control"
                placeholder="Enter Documents required" />
             
            </div>

            <div className="form-group">

            <div class="text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={this.requestDocs}
              >
                Send
              </button>
              </div>
            </div>
            {/* {this.state.message && (
              <p className="alert alert-danger fade in">{this.state.message}</p>
            )} */}
          </div>
        </div> 

        <div className="col-md-15">
          <div className="login-form">
            <h4 className="text-center">Approve Medical Claim</h4>
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
            {/* {this.state.message && (
              <p className="alert alert-danger fade in">{this.state.message}</p>
            )} */}
          </div>
        </div> 


         </div>
         
       </div>
       </div>

       </>
     );
   }
 }
