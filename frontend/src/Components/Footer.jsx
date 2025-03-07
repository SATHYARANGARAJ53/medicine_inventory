import React from 'react'
import './Footer.css'
import {BsFacebook} from 'react-icons/bs';
import {BsInstagram} from 'react-icons/bs';
import {BsYoutube} from 'react-icons/bs';
import {BsWhatsapp} from 'react-icons/bs';
import {BsTwitterX} from 'react-icons/bs';
function Footer() {
  return (
    <div className='footer'>
        <h5>Stay Connected with us!</h5>
        <div className='social-media'>
           <a className='Facebook' href="www.facebook.com"><BsFacebook/></a>
           <a className='Instagram' href="www.Instagram.com"><BsInstagram /></a>
           <a className='Youtube' href="www.youtube.com"><BsYoutube/></a>
           <a className='Whatsapp' href="www.whatsapp.com"><BsWhatsapp/></a>
           <a className='X' href="www.twitter.com"><BsTwitterX/></a>
        </div>
        <p>All rights are reserved &copy;2025</p>
    </div>
  )
}

export default Footer