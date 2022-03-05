import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link,Redirect } from "react-router-dom";
import Patient from './patient'
import Hadmin from './hadmin'
import Labadmin from './ladmin'
import Insurance from './insurance'
import './index.css'

import home from './home';
import login from './login';
import Header from './Components/header';
import Footer from './Components/footer'; 
//import HealthCare from './HealthCare'
const FullApp = () => (
  <Router>
    <div>

    
      <Route exact path="/" component={home} />
      <Route path="/login" component={login} />
      <Route path="/signin" component={App} />
      <Route path="/patient" component={Patient} />
      <Route path="/hadmin" component={Hadmin} />
      <Route path="/labadmin" component={Labadmin} />
      <Route path="/insurance" component={Insurance} />

    </div>
  </Router>
);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:'',
      password:'',
      login:false
    }
  }
  render() {
    return (
      
      <><Header />
      
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      
      <div className="container container-fluid login-container">

        {this.state.login ? this.state.user === "" ? this.state.password === "patient" ? <Redirect to="/patient" /> :
          this.state.password === "hadmin" ? <Redirect to="/hadmin" /> :
            this.state.password === "ladmin" ? <Redirect to="/labadmin" /> :
              this.state.password === "insurance" ? <Redirect to="/insurance" /> : null : null : null}
        <div style={{
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          <div className="login-form">
            <form method="post">
              <h2 className="text-center">Log in</h2>

              <div className="form-group">

                <input type="text" className="form-control" placeholder="Enter Metamask ID"></input>
              </div>
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
