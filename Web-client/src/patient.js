import React from "react";
import ReactDOM from "react-dom";
import InsuranceRecord from "./InsuranceRecord";
import web3 from "./web3";
import ipfs from "./ipfs.js";
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css";  

import Header from './Components/header';
import Footer from './Components/footer'; 

export default class Patient extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    //this.seeRecord = this.seeRecord.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.getDetails= this.getDetails.bind(this);
    this.buyPolicy= this.buyPolicy.bind(this);
    this.HospitalList= this.HospitalList.bind(this);

    this.state = {
      // recID: "",
      pname: "",
      dDate: "",
      hname: "",
      haddr: "",
      price: "",
      message: "",
      recordCheck: false,
      record: [],
      buffer: null,
      ipfsHash: "",

      paddr :"",
      haddrlist :[],
      hnamelist: [],
      data : [],
      policyID: '',
      policyStat: 0,
      SignaCount: 0,
      
      
     // IPFS: " "
    };
    this.getDetails();
    this.HospitalList();
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
      InsuranceRecord.methods.claimPolicy(
        // this.state.recID,
        this.state.paddr,
        this.state.haddr,
        result[0].hash,
        this.state.dDate,
        
        
      ).send({ from: accounts[0], gas: 2100000 }).then((r) => {
        this.setState({ipfsHash: result[0].hash});
        console.log(this.state.ipfsHash);
      });
    });

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
  }

  async getDetails() {
    const accounts = await web3.eth.getAccounts();
    const details = await InsuranceRecord.methods.getPatients(accounts[0]).call();
    const {0: pAddr,1:username, 2:pName, 3: password,4:pValue,5:policyID,6:policyStat} = details;

    this.state.paddr = pAddr;
    this.state.pname = pName;
    this.state.policyID = policyID;
    this.state.policyStat = policyStat;
    
    this.forceUpdate();
  }

  async buyPolicy() {
    const accounts = await web3.eth.getAccounts();
    this.state.PolicyResult = await InsuranceRecord.methods.selectPolicy(this.state.policyID,accounts[0]).send({ from: accounts[0], gas: 2100000 });
 
    this.forceUpdate();
  }

  async getClaims() {
    const accounts = await web3.eth.getAccounts();
    const details = await InsuranceRecord.methods.getClaimDetails(accounts[0]).call();
    const {0: pAddr,1:haddr, 2:ipfs, 3: SC,4:pValue,5:date,6:isVal} = details;
    
    this.state.SignaCount = SC;
    this.state.dDate =date;
    
    

    this.forceUpdate();
  }

  async HospitalList () {
    //const accounts = await web3.eth.getAccounts();
    const details = await InsuranceRecord.methods.getHospitalList().call();
    const {0: hAddr,1:hname} = details;
    this.state.haddrlist =hAddr;
    this.state.hnamelist =hname;

    for (var i=0; i< hname.length; i++){
      if (this.state.hnamelist[i]==''){
        continue;
      }
    this.state.data.push({hname : this.state.hnamelist[i], haddr : this.state.haddrlist[i]})}
    //console.log(this.state.data);

    this.forceUpdate();

  }


  // async seeRecord() {
  //   const accounts = await web3.eth.getAccounts();
  //   this.state.recordCheck = await HealthCare.methods.checkRecord(accounts[0]).call();
  //   if (this.state.recordCheck) {
  //     this.state.record = await HealthCare.methods.recordList(accounts[0]).call(); 
  //   }
  //   console.log(this.state.record);
  //   console.log(this.state.recordCheck);
  //   this.forceUpdate();
  // }

  async showDocument(event) {
    event.preventDefault();
    //const accounts = await web3.eth.getAccounts();
    const accounts = await web3.eth.getAccounts();
    const details = await InsuranceRecord.methods.getClaimDetails(accounts[0]).call();
    const {0: pAddr,1:haddr, 2:ipfs, 3: SC,4:pValue,5:date,6:isVal} = details;
    //this.state.ipfsHash = ipfs;
    //const IPFS = this.state.ipfsHash;
    console.log(ipfs);
    window.open("https://ipfs.io/ipfs/"+(ipfs))
  }


  render() {
    const columns = [{  
      Header: 'Hospital Name',  
      accessor: 'hname' 
      },{  
      Header: 'Hospital Address',  
      accessor: 'haddr'  
      }
       ] 

    
    
    const statusDisplay = () => {
      if(this.state.SignaCount==2) {
        return (<th>Claim Approved</th>);
      }
      else if(this.state.SignaCount==1){
        return (<th>Validated by Hospital</th>);
      }

      else
      {
        return (<th>Claim Pending</th>);
      }

    }
    const renderRecord = () => {
      if(this.state.policyStat==2) {
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
                      <th className="">{this.state.pname}</th>
                    </tr>
                    <tr className="row">
                      <th className="">Date of Claim:</th>
                      {/* <th className="">{String(this.state.dDate).split('-').reverse().join(' / ')}</th> */}
                      <th className="">{this.state.dDate}</th>
                    </tr>
                    {/* <tr className="row">
                      <th className="">Hospital Address:</th>
                      <th className="">{this.state.haddr}</th>
                    </tr> */}
                    {/* <tr className="row">
                      <th className="">Amount Claimed:</th>
                      <th className="">{this.state.record["price"]}</th>
                    </tr> */}
                    {console.log(this.state.ipfsHash)}
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
      } else if(this.state.policyStat==1) {
        console.log("Form");
        return(
          <body class="d-flex flex-column min-vh-100">
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
                      className="form-control"
                      placeholder={this.state.paddr}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={this.state.haddr}
                      onChange={event =>
                        this.setState({ haddr: event.target.value })
                      }
                      className="form-control"
                      placeholder="HospAddr"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="Date"
                      value={String(this.state.dDate)}
                      onChange={event =>
                        this.setState({ dDate: event.target.value })
                      }
                      className="form-control"
                      placeholder="Date"
                    />
                  </div>
                  {/* <div className="form-group">


                    <select id="selection"  value={this.state.hname} onChange={event =>this.setState({ hname: event.target.value })} className="form-control" >
                      <option selected>Select Hospital..</option>
                      <option>Apollo</option>
                      <option>Jupyter</option>
                      <option>Fortis</option>
                      <option>Jaslok</option>
                      <option>Lilavati</option>
                    </select >

                        
                  </div> */}
                  {/* <div className="form-group">
                    <input
                      type="text"
                      value={this.state.price}
                      onChange={event =>
                        this.setState({ price: event.target.value })
                      }
                      className="form-control"
                      placeholder="Price"
                    />
                  </div> */}
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

            <div>  
              <ReactTable  
                  data={this.state.data}  
                  columns={columns}  
                  defaultPageSize = {2}  
                  pageSizeOptions = {[2, 4, 6]}  
              />  
          </div>



          </div>
          </body>
        );
      }
      else if(this.state.policyStat==0) {
        console.log("Select Policy");
        return(





          
          <div className="container container-fluid login-conatiner">
              <div className="col-md-4">
              <div className="login-form">
                <form method="post" autoComplete="off">
                  <h2 className="text-center">Select Policy</h2>
                  
                  {/* <div className="form-group">


                    <select id="selection"  value={this.state.policyID} onChange={event =>this.setState({ hname: event.target.value })} className="form-control" >
                      <option selected>Select Policy</option>
                      <option >1</option>
                      <option >2</option>
                      <option >3</option>
                      <option >4</option>
                      <option >5</option>
                      
                    </select >
                    {console.log(this.state.policyID)}
                        
                  </div> */}
                  <div className="form-group">
                    <input
                      type="number"
                      value={this.state.policyID}
                      onChange={event =>
                        this.setState({ policyID: event.target.value })
                      }
                      className="form-control"
                      placeholder="Enter PolicyID"
                    />
                  </div>

                  
                  <div className="form-group">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={this.buyPolicy}
                    >
                      Select policy
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
      </>
    );
  }
}
