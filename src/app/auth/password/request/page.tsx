"use client"; // this is a client component
import { useState } from "react";
import Image from 'next/image';
import Illustration from '@/app/assets/img/illustration.png'
import { useRouter } from 'next/navigation';


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];
const requestResetEndpoint = `${process.env.serverHost}/api/v1/sales/auth/password/reset-request`;


// attempt sales-agent login using credentials
function requestPasswordReset(resetRequest:any) {
    return fetch(requestResetEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetRequest)
    })
        .then(data => data.json())
}


export default function requestReset() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertContent, setAlertContent] = useState({type: '', title: '', message: ''});
    const  [responseData, setResponseData ] = useState({ status: false, title: '', message: '', data: {} });
    const router = useRouter();


    // Function to show the alert message
    const showAlert = (type= '', title= '', message= '') => {
        setAlertContent({ type: type, title: title, message: message });
        setIsAlertVisible(true);
        // Hide the alert after 3 seconds (adjust the delay as needed)
        setTimeout(() => {
            setAlertContent({type: '', title: '', message: ''});
            setIsAlertVisible(false);
        }, 3000);
    };


    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsLoading(true);
            requestPasswordReset({email})
                .then( response => {
                    if (response.success) {
                        setIsLoading(false);
                        setResponseData({ status: response.success, title: 'Success', message: response.message, data: response.data }); // update responseData constant
                        localStorage.setItem('accessToken', response.data.access_token);
                        router.push('/manage/events');  // redirect to (agent events)
                    } else {
                        setResponseData({ status: response.success, title: 'Error', message: response.message, data: response.data }); // update responseData constant
                        setIsLoading(false);
                        showAlert('error', responseData.title, responseData.message)
                    }
                });
        } catch (error) {
            setIsLoading(false);
            showAlert('error', responseData.title, responseData.message)
        }
    }


    return (
    <div className="signup-wrapper">
      <main className="main-section" role="main">
        <div className="container">
          <div className="wrapper-box">
            <div className="container-box">
              <div className="row">
                <div className="col-6">
                  <div className="left-signup">
                    <Image src={require('@/app/assets/img/logo.svg')} alt="" width="200" height="29" className='logos' />
                    <div className="text-block">
                        <h4>WELCOME TO SALES PORTAL</h4>
                        <p>Maximize your sales potential with our customizable portal solutions</p>
                        <ul>
                            <li>Customization following easy steps</li>
                            <li>Sales forecasting and analytics</li>
                            <li>Sort out event registration in no time</li>
                            <li>Feel safe with our step by step navigation</li>
                        </ul>
                    </div>
                    <Image src={Illustration} alt="" width="300" height="220" className='illustration' />
                  </div>
                </div>
                <div className="col-6">
                  <div className="right-section-blank">
                    <ul className="main-navigation">
                      <li>
                          <a href="#!">
                            <i className="icons"><Image src={require('@/app/assets/img/ico-globe.svg')} alt="" width="16" height="16" /></i>
                            <span id="language-switch">English</span><i className="material-icons">keyboard_arrow_down</i>
                          </a>
                          <ul>
                              {languages.map((value, key) => {
                                  return (
                                      <li key={key}>
                                          <a>{value.name}</a>
                                      </li>
                                  );
                              })}
                          </ul>
                      </li>
                    </ul>
                    <div className="right-formarea">
                      <h2>Did you forget your password ?</h2>
                      <p>Enter your email address you’re using for your account below and we will send you a password reset link.</p>
                      <form role="">
                      <div className="form-area-signup">
                          <div className='form-row-box'>
                              <input className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  />
                              <label className="title">Enter your email</label>
                          </div>
                          <div className="form-row-box button-panel">
                              <button className="btn btn-primary">SEND</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
