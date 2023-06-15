"use client"; // this is a client component
import { useEffect, useState } from "react";
import Image from 'next/image';
import Illustration from '@/assets/img/illustration.png'
import AlertMessage from "@/components/forms/alerts/AlertMessage";
import Loader from '@/components/forms/Loader';
import { useRouter } from 'next/navigation';
import {useAppDispatch, useAppSelector} from "@/redux/hooks/hooks";
import { RootState, store } from "@/redux/store/store";
import { GeneralAction } from "@/actions/general-action";
import { AuthAction } from "@/actions/auth/auth-action";
import { AuthService } from "@/services/auth/auth-service";
import { forgotPasswordRequest, setForgetPasswordEmail, setLoading, setRedirect } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/forms/alerts/ErrorMessage";

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];


export default function requestReset() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, redirect, error, errors} = useAppSelector((state: RootState) => state.authUser);
    const [email, setEmail] = useState('');

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        if(email !== ''){
          dispatch(setForgetPasswordEmail(email));
          dispatch(forgotPasswordRequest({email}));
        }
    }

    useEffect(() => {
      if(redirect !== null) {
        dispatch(setRedirect(null));
        dispatch(setLoading(null));
        router.push(redirect);
      }
  }, [redirect]);


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
                      <h2>Did you forget your password ?</h2>
                      <p>Enter your email address you’re using for your account below and we will send you a password reset link.</p>
                      <form role="" onSubmit={handleSubmit}>
                      <div className="form-area-signup">
                          <div className='form-row-box'>
                              <input className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  />
                              <label className="title">Enter your email</label>
                          </div>
                          <div className="form-row-box button-panel">
                              <button className="btn btn-primary" disabled={loading} type='submit'>{loading?"SENDING...":"SEND"}</button>
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
