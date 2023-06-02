"use client"; // this is a client component
import { useState } from "react";
import Image from 'next/image';
import Illustration from '@/app/assets/img/illustration.png'
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/forms/Loader';
import AlertMessage from "@/app/components/forms/alerts/AlertMessage";


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];
const resetPasswordEndpoint = `${process.env.serverHost}/api/v1/sales/auth/password/reset`;


// attempt sales-agent login using credentials
function resetPasswordAction(resetPasswordRequestData:any) {
    return fetch(resetPasswordEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(resetPasswordRequestData)
    })
        .then(data => data.json())
}


export default function requestReset() {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const resetCode = localStorage.getItem('resetCode');
    const email = localStorage.getItem('email');
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertContent, setAlertContent] = useState({type: '', title: '', message: ''});
    const [responseData, setResponseData ] = useState({ status: false, title: '', message: '', data: {} });
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
            resetPasswordAction({reset_code: resetCode, email: email, password: password, password_confirmation: passwordConfirmation})
                .then( response => {
                    if (response.success) {
                        setIsLoading(false);
                        setResponseData({ status: response.success, title: 'Success', message: response.message, data: response.data }); // update responseData constant
                        localStorage.setItem('accessToken', response.data.access_token);
                        router.push('/auth/login');  // redirect to login page
                    } else {
                        setResponseData({ status: response.success, title: 'Error', message: response.message, data: response.data }); // update responseData constant
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
                                            <h2>Reset password</h2>
                                            <p>Enter new password and confirm new password to reset password.</p>
                                            <form role="" onSubmit={handleSubmit}>
                                                <div className="form-area-signup">
                                                    <div className='form-row-box'>
                                                        <input className='' value={password} type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}  />
                                                        <label className="title">Enter new password</label>
                                                    </div>
                                                    <div className='form-row-box'>
                                                        <input className='' value={passwordConfirmation} type="password" name="password_confirmation" id="password_confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)}  />
                                                        <label className="title">Confirm new password</label>
                                                    </div>
                                                    <div className="form-row-box button-panel">
                                                        <button className="btn btn-primary" type='submit'>RESET PASSWORD</button>
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
