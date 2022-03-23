import React, { Component } from 'react';

import Header from './Components/header';

import Footer from './Components/footer'; 

class login extends Component {

    render() {
      sessionStorage.setItem("status", "Login");

        return (

            <><Header />



<br></br><br></br><br></br>

<section id="featured" class="featured">
      <div class="container">

      <div class="section-title">
          <h2>Login</h2>
          
        </div>

        <div class="row">
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/featured-1.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Insurance Company</a></h5>
                <p class="card-text">Login as an Insurance Entity</p>
                <a href="./signin" class="btn">Login</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/featured-2.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Hospital</a></h5>
                <p class="card-text">Login as an Hospital admin</p>
                <a href="./hRegister" class="btn">Login</a>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch mb-5 mb-lg-0">
            <div class="card">
              <img src="assets/img/featured-3.jpg" class="card-img-top" alt="..." width="300" height="300"></img>
              <div class="card-body">
                <h5 class="card-title"><a href="">Patient</a></h5>
                <p class="card-text">Login to your patient account</p>
                <a href="./pRegister" class="btn">Login</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
    
    <Footer /></>

)

    }

}

export default login;