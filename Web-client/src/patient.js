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
    this.captureFile = this.captureFile.bind(this);
    this.getDetails= this.getDetails.bind(this);
    this.buyPolicy= this.buyPolicy.bind(this);
    this.HospitalList= this.HospitalList.bind(this);
    this.getClaims= this.getClaims.bind(this);
    this.addNewDoc=this.addNewDoc.bind(this);

    this.state = {
      pname: "",
      dDate: "",
      hname: "",
      haddr: "",
      price: "",
      message: "",
      recordCheck: false,
      record: [],
      buffer: null,
      ipfsHash: '',
      ipfsHashList: [],

      paddr :"",
      haddrlist :[],
      hnamelist: [],
      data : [],
      policyID: '',
      policyStat: 0,
      SignaCount: 0,
      policyname: '',
      filename: '',
      filenameList: [],
      newfilename: '',
      newfilenamelist: [],
      newipfshash: [],
      statement: 'Required Documents sent',
      statusline : '',
      
     // IPFS: " "
    };
    this.getDetails();
    this.getClaims();
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
      this.state.ipfsHashList.push(result[0].hash);
      this.state.filenameList.push(this.state.filename);
      InsuranceRecord.methods.claimPolicy(
        // this.state.recID,
        this.state.paddr,
        this.state.haddr,
        this.state.policyname,
        this.state.filenameList,
        this.state.ipfsHashList,
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
    const {0: pAddr,1:username, 2:pName, 3: password,4:policyname,5:pValue,6:policyID,7:policyStat} = details;

    this.state.paddr = pAddr;
    this.state.pname = pName;
    this.state.policyID = policyID;
    this.state.policyStat = policyStat;
    this.state.policyname = policyname;
    
    this.forceUpdate();
  }

  async buyPolicy(event) {
    event.preventDefault();

    const policyname = {0:'Star Health Comprehensive Plan',1: 'Star Family Health Optima', 2: 'ProHealth Plus', 3: 'Ergo Optima Restore',4:'ACtive Health Enhance Plus'};
    this.state.policyname = policyname[this.state.policyID];
    console.log(this.state.policyname);
    const accounts = await web3.eth.getAccounts();
    this.state.PolicyResult = await InsuranceRecord.methods.selectPolicy(this.state.policyID,this.state.policyname,accounts[0]).send({ from: accounts[0], gas: 2100000 });
 
    this.forceUpdate();
  }

  async getClaims() {
    const accounts = await web3.eth.getAccounts();
    const details = await InsuranceRecord.methods.getClaimDetails(accounts[0]).call();
    const {0: pAddr,1:haddr,2:policyname,3:filename,4:ipfsHashList,5:statusline, 6: SC,7:date,8:isVal} = details;
    
    
    this.state.SignaCount = SC;
    this.state.dDate =date;
    this.state.statusline = statusline;
    console.log(this.state.SignaCount);
    

    this.forceUpdate();
  }

  async getHospName() {
    
    const details = await InsuranceRecord.methods.getHospitals(this.state.haddr).call();
    const {0: hAddr,1:password, 2:hName,3:isVal, 4:pAddrList} = details;
    console.log(this.state.hname)
    
    this.state.hname = hName;

    
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


  async showDocument(event) {
    event.preventDefault();
    //const accounts = await web3.eth.getAccounts();
    const accounts = await web3.eth.getAccounts();
    const details = await InsuranceRecord.methods.getClaimDetails(accounts[0]).call();
    const {0: pAddr,1:haddr,2:policyname,3:filename,4:ipfsHashList,5:statusline, 6: SC,7:date,8:isVal} = details;
    //this.state.ipfsHash = ipfs;
    //const IPFS = this.state.ipfsHash;
    
    console.log(ipfsHashList);
    window.open("https://ipfs.io/ipfs/"+(ipfsHashList[0]))
  }

  async addNewDoc(event) {
    event.preventDefault();
   

    const accounts = await web3.eth.getAccounts();
    ipfs.files.add(this.state.buffer,(err,result) => {
      if(err) {
        console.log(err);
        return;
      }
      this.state.newipfshash.push(result[0].hash);
      this.state.newfilenamelist.push(this.state.newfilename);
      
        
     
    });
    console.log(this.state.newfilenamelist);
    console.log(this.state.newipfshash);

    await InsuranceRecord.methods.addNewDoc(accounts[0],this.state.statement,this.state.newfilenamelist,this.state.newipfshash).send({ from: accounts[0], gas: 2100000 });
    
    this.forceUpdate();
  }


  render() {
    sessionStorage.setItem("status", "Logout");

    
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
        return (<font color='green'>Claim Approved and Claim Amount Refunded</font>);
      }
      else if(this.state.SignaCount==1){
        return (<font color='blue'>Validated by Hospital</font>);
      }

      else
      {
        return (<font color='red'>Claim Pending</font>);
      }

    }


    const messageDisplay = () => {
      console.log(this.state.statusline)
      if(this.state.statusline.slice(0,1)=='1') {
        return (<font color='red'>Alert! {this.state.statusline.slice(2,)}</font>);
      }

      else
      {
        return (<font hidden></font>);
      }

    }





    const renderRecord = () => {
      
      
      if(this.state.policyStat==2) {
        
        console.log("Status");
        return(
          <div className="cont-status">
           
            <br></br>  
            
                <h1 className="text-center">Claim Status</h1>
                <div className="container container-fluid claim-container">
                <br></br> <br></br> 
                  <h3 className=""><b>Patient Name</b>: {this.state.pname}</h3>
                  <br></br>
                  <h3 className=""><b>Policy Name</b>: {this.state.policyname}</h3>
                  <br></br>
                  <h3 className=""><b>Hospital Provider Name</b>: Apollo</h3>
                  <br></br>
                  <h3 className=""><b>Amount Claimed</b>: Rs. 23134</h3>
                  <br></br>
                  <h3 className=""><b>Date of Claim</b>: {String(this.state.dDate).split('-').reverse().join(' / ')}</h3>
                  <br></br>
                  <h3 className=""><b>Uploaded Documents</b>: <button onClick={this.showDocument}>View Document</button></h3>
                  <br></br>
                  <h3 className=""><b>Claim Status</b>: {statusDisplay()}</h3>
                  <br></br>
                  <h4 className="">{messageDisplay()}</h4>
                  <br></br>
                  <hr></hr>
                  <h3 className=""><b>Add Documents</b>:  
                  <div className="form-group">
                    <input
                      type="text"
                      onChange={event =>
                        this.setState({ newfilename: event.target.value })
                      }
                      className="form-control"
                      placeholder="Enter Filename"
                    />
                  </div>
                  <input
                      type="file"            
                      onChange={this.captureFile}
                      className="form-control"
                    />
                    <div className="form-group">
                    <button
                      className="btn btn-primary"
                      onClick={this.addNewDoc}
                    >
                      Submit
                    </button>
                  </div>
                    
                    
                    
                    </h3>
                
                {/* <table className="table  table-striped">
                  <tbody>
                    <tr className="row">
                      <th className="">Patient Name: {this.state.pname}</th>
                      <th className="">{this.state.pname}</th>
                    </tr>
                    
                    <tr className="row">
                      <th className="">Policy Name:</th>
                      <th className="">{this.state.policyname}</th>
                    </tr>
                    <tr className="row">
                      <th className="">Amount Claimed:</th>
                      <th className="">Rs. 23124</th>
                    </tr>
                    <tr className="row">
                      
                      <th className="">Date of Claim:</th>
                      <th className="">{String(this.state.dDate).split('-').reverse().join(' / ')}</th>
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
                </table> */}
                </div>
              </div>
        
        );
      } 
      
      
      else if(this.state.policyStat==1) {
        console.log("Form");
        return(
          <div className="cont-claim">
            <br></br><br></br><br></br><br></br><br></br>
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
                      placeholder={this.state.pname}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      
                      className="form-control"
                      placeholder="Name of Treating Doctor"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      value={this.state.policyname}
                      className="form-control"
                      placeholder={this.state.policyname}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      
                      className="form-control"
                      placeholder="Nature of Illness"
                    />
                    </div>
                    <div className="form-group">
                    <input
                      type="text"
                      
                      className="form-control"
                      placeholder="Duration of Treatment"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
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
                      onChange={event =>
                        this.setState({ dDate: event.target.value })
                      }
                      className="form-control"
                      placeholder="Date"
                    />
                  </div>
                  <div className="form-group">


                    <select id="selection"  className="form-control" >
                      <option selected>Select Room Type</option>
                      <option>General Ward</option>
                      <option>Semi Private</option>
                      <option>Single Room AC</option>
                      
                    </select >

                        
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      onChange={event =>
                        this.setState({ filename: event.target.value })
                      }
                      className="form-control"
                      placeholder="Enter Filename"
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

            <h2 className="text-center">List of Network Hospitals</h2>
            <div>  
              <ReactTable  
                  data={this.state.data}  
                  columns={columns}  
                  defaultPageSize = {2}  
                  
              />  
          </div>



          </div>
          </body>
          </div>
        );
      }
      
      
      
      else if(this.state.policyStat==0) {
        console.log("Select Policy");
        return(
      <section id="featured" class="featured">
        
      <div class="container">

      <div class="section-title">
          <h2>Select a Policy</h2>
          
        </div>

        <div class="row">
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/policy1.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Star Health Comprehensive Plan</a></h5>
                
                  <li> Daycare Treatment Covered </li>
                  <li> Domiciliary Hospitalization </li>
                
                  <br></br>
                <a href="#" class="btn">View Details</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/policy2.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Star Family Health Optima</a></h5>
                
                  <li> 541 Daycare Treatment </li>
                  <li> ICU Expense Covered </li>
                  <br></br>
                <a href="#" class="btn">View Details</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/policy3.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">ProHealth Plus</a></h5>
               
                  <li> Domiciliary Hospitalization </li>
                  <li> Hospital Cashless Facility </li>
                  <br></br>
                <a href="#" class="btn">View Details</a>
              </div>
            </div>
          </div>
        </div>

          <br></br> <br></br> <br></br>
        <div class="row">
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/policy4.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Care Freedom</a></h5>
     
                  <li> Daycare Treatment Covered </li>
                  <li> Pre and Post Hospitalization Care </li>
                  <br></br>
                <a href="#" class="btn">View Details</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/policy5.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">ERGO Optima Restore</a></h5>
             
                  <li> Daycare Treatment Covered </li>
                  <li> AYUSH Cover </li>
               <br></br>
                <a href="#" class="btn">View Details</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/policy6.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Active Health Enhance Plus</a></h5>
           
                  <li> Road/Air Ambulance Expense Covered </li>
                  <li> Domiciliary Hospitalization </li>
                  <br></br>
                <a href="#" class="btn">View Details</a>
              </div>
            </div>
          </div>
        </div>



        <div className="container container-fluid register-container">
              <div className="col-md-6">
              <div className="login-form">
                <form method="post" autoComplete="off">
                  <h2 className="text-center">Select Policy</h2>
                  
                  <div className="form-group">


                    <select id="selection"   onChange={event =>this.setState({ policyID: event.target.value })} className="form-control" >
                      <option value="" selected disabled hidden>Select policy...</option>
                      
                      <option value="0">Star Health Comprehensive Plan</option>
                      <option value="1">Star Family Health Optima</option>
                      <option value="2">ProHealth Plus</option>
                      <option value="3">Ergo Optima Restore</option>
                      <option value="4">ACtive Health Enhance Plus</option>
                      
                    </select >
                    {console.log(this.state.policyID)}
                        
                  </div>
                  {/* <div className="form-group">
                    <input
                      type="number"
                      value={this.state.policyID}
                      onChange={event =>
                        this.setState({ policyID: event.target.value })
                      }
                      className="form-control"
                      placeholder="Enter PolicyID"
                    />
                  </div> */}

                  
                  <div className="form-group">
                    <button
                      className="btn btn-primary btn-block btn-policy"
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





      </div>
    </section>
          
          

        );
      }
    }
    return(
      <><Header />
      <br></br><br></br><br></br><br></br><br></br>
      <div>
        {renderRecord()}
      </div>
      
      </>
    );
  }
}
