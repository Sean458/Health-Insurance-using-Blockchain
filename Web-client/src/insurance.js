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
  
    this.getClaims = this.getClaims.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.requestDocs = this.requestDocs.bind(this);

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
    //   columns:[
    //     {Header: 'Name', accessor: 'pname'},
    //     {Header: 'Hospital', accessor: 'hname'},
    //     {Header: 'Amount', accessor: 'amt'},
    //     {Header: 'Status', accessor: 'stat'}],
    };
    this.getClaims();
  }

  async requestDocs(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await InsuranceRecord.methods.signClaim(this.state.patientAddr, this.state.message)
      .send({ from: accounts[0], gas: 2100000 });


  }


  async getClaims() {
    //const accounts = await web3.eth.getAccounts();
    this.state.result = await InsuranceRecord.methods.getIClaimList().call();
    const {0: pAlist, 1:pNlist, 2:policyname,3:SClist,4:amountlist,5:datelist,6:hNlist} = this.state.result;
    this.state.pAlist=pAlist;
    this.state.pNlist=pNlist;
    this.state.policyname=policyname;
    this.state.SClist=SClist;
    this.state.amountlist=amountlist;
    this.state.datelist=datelist;
    this.state.hNlist=hNlist;
    
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

   render() {
    sessionStorage.setItem("status", "Logout");

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
            <h4 className="text-center">Approve Medical Claim</h4>
            <div className="form-group">
              <input
                type="string"
                value={this.state.patientAddr}
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
            {/* {this.state.message && (
              <p className="alert alert-danger fade in">{this.state.message}</p>
            )} */}
          </div>
        </div> 

        <div className="col-md-15">
          <div className="login-form">
            <h4 className="text-center">Request for Additional Documents</h4>
            <div className="form-group">
              <input
                type="string"
                
                onChange={event => this.setState({ patientAddr: event.target.value })}
                className="form-control"
                placeholder="Enter Patient Address" />
             
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


         </div>
         
       </div>
       </div>

       </>
     );
   }
 }
