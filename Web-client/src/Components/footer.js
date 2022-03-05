import React, { Component } from 'react'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class Footer extends Component {

    render() {

        return (




<footer id="footer" >



<div class="footer-top py-0">


  <div class="container">

    <div class="row  justify-content-center">
      <div class="col-lg-6">
        
        <p>Connect with us!</p>
      </div>
    </div>



    <div class="social-links">
      <a href="#" class="twitter"><i class="bx bxl-twitter"></i></a>
      <a href="#" class="facebook"><i class="bx bxl-facebook"></i></a>
      <a href="#" class="linkedin"><i class="bx bxl-linkedin"></i></a>
    </div>
    <br></br> <br></br> <br></br>        
  </div>
</div>
</footer>

)

    }

}

export default Footer;