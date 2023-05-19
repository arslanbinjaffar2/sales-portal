"use client"; // this is a client component
import { useState } from "react";
import Image from 'next/image';
import Illustration from '@/app/assets/img/illustration.png'
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/forms/loader';
import AlertMessage from "@/app/components/forms/alerts/AlertMessage";


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];
const requestVerifyEndpoint = `${process.env.serverHost}/api/v1/sales/auth/password/reset-code/verify`;


// attempt sales-agent login using credentials
function verifyResetCodeAction(resetRequest:any) {
    return fetch(requestVerifyEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetRequest)
    })
        .then(data => data.json())
}


export default function verifyResetCode() {
    const [token, setToken] = useState('');
    const email = localStorage.getItem('email');
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertContent, setAlertContent] = useState({type: '', title: '', message: ''});
    const  [responseData, setResponseData ] = useState({ success: false, title: '', message: '', data: {} });
    const router = useRouter();


    // Function to show the alert message
    const showAlert = (type= '', title= '', message= '') => {
        setAlertContent({ type: type, title: title, message: message });
        setIsAlertVisible(true);
        // Hide the alert after 3 seconds
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
            verifyResetCodeAction({token, email})
                .then( response => {
                    if (response.success) {
                        setIsLoading(false);
                        // return console.log(response);
                        setResponseData({ success: response.success, title: response.title, message: response.message, data: response.data }); // update responseData constant
                        localStorage.setItem('resetCode', response.data.resetCode);
                        localStorage.setItem('email', response.data.email);
                        router.push('/auth/password/reset');  // redirect to reset password page
                    } else {
                        setResponseData({ success: response.success, title: response.title, message: response.message, data: response.data }); // update responseData constant
                        setIsLoading(false);
                        showAlert('error', response.title, response.message)
                    }
                });
        } catch (error) {
            setIsLoading(false);
            showAlert('error', responseData.title, responseData.message)
        }
    }


    return (
        <div className="signup-wrapper">
            {/* loader */}
            {isLoading && (
                <Loader className='' fixed='' />
            )}
            {/* /. loader */}
            <main className="main-section" role="main">
                <div className="container">
                    {/* Alert */}
                    {isAlertVisible && (
                        <AlertMessage className={ `alert ${alertContent.type === 'success' ? 'alert-success' : 'alert-danger'}` }
                                      icon= {alertContent.type === 'success' ? "check" : "info"}
                                      title= {alertContent.title}
                                      content= {alertContent.message} />
                    )}
                    {/* /. Alert */}
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
                                            <h2>Verify reset password code</h2>
                                            <p>Please enter the reset password token that we have just sent to your registered email address.</p>
                                            <form role="" onSubmit={handleSubmit}>
                                                <div className="form-area-signup">
                                                    <div className='form-row-box'>
                                                        <input className='' value={token} type="text" name="token" id="token" onChange={(e) => setToken(e.target.value)}  />
                                                        <label className="title">Enter reset code</label>
                                                    </div>
                                                    <div className="form-row-box button-panel">
                                                        <button className="btn btn-primary" type='submit'>VERIFY</button>
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
