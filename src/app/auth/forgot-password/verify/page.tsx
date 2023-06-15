"use client"; // this is a client component
import {useEffect, useState} from "react";
import Image from 'next/image';
import Illustration from '@/assets/img/illustration.png'
import { useRouter } from 'next/navigation';
import Loader from '@/components/forms/Loader';
import AlertMessage from "@/components/forms/alerts/AlertMessage";
import {GeneralAction} from "@/actions/general-action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";
import { forgotPasswordVerify, setForgetPasswordToken, setLoading, setRedirect } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/forms/alerts/ErrorMessage";


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

// attempt sales-agent login using credentials
// function verifyResetCodeAction(resetRequest:any) {
//     return fetch(requestVerifyEndpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify(resetRequest)
//     })
//         .then(data => data.json())
// }


export default function verifyResetCode() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, redirect, error, errors, forgetPasswordEmail } = useAppSelector((state: RootState) => state.authUser);
    const [token, setToken] = useState('');
    const [render, setRender] = useState(false)
    
    useEffect(() => {
        if(forgetPasswordEmail !== null){
            setRender(true);
        }else{
            router.push('/auth/forgot-password/request');
        }
    }, [])

    useEffect(() => {
        if(redirect !== null) {
            dispatch(setRedirect(null));
            dispatch(setLoading(null));
            router.push(redirect);
        }
    }, [redirect]);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(forgotPasswordVerify({token, email:forgetPasswordEmail}));
    }

    if(!render){
        return <Loader className='' fixed=''/>;
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
                                        <Image src={require('@/assets/img/logo.svg')} alt="" width="200" height="29" className='logos' />
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
                                                    <i className="icons"><Image src={require('@/assets/img/ico-globe.svg')} alt="" width="16" height="16" /></i>
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
                                        {errors && errors.length > 0 && <ErrorMessage 
                                            icon= {"info"}
                                            title= {"Invalid data"}
                                            errors= {errors}
                                        />}
                                        {error && <ErrorMessage 
                                            icon= {"info"}
                                            title= {"Sorry! Something went wrong"}
                                            error= {error}
                                        />}
                                            <h2>Verify reset password code</h2>
                                            <p>Please enter the reset password token that we have just sent to your registered email address.</p>
                                            <form role="" onSubmit={handleSubmit}>
                                                <div className="form-area-signup">
                                                    <div className='form-row-box'>
                                                        <input className='' value={token} type="text" name="token" id="token" onChange={(e) => setToken(e.target.value)}  />
                                                        <label className="title">Enter reset code</label>
                                                    </div>
                                                    <div className="form-row-box button-panel">
                                                        <button className="btn btn-primary" disabled={loading} type='submit'>{loading ? "VERIFYING" : "VERIFY"}</button>
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
