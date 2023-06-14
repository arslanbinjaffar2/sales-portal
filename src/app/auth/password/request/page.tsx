"use client"; // this is a client component
import { useState } from "react";
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

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];


export default function requestReset() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const reduxStore = useAppSelector((state: RootState) => state);
    const alert:any = reduxStore.alert;
    const isLoading: boolean = reduxStore.loading;

    const [email, setEmail] = useState('');


    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            dispatch(GeneralAction.loading(true));
            AuthService.passwordRequest(email).then(
                response => {
                    if (response.success) {
                        localStorage.setItem('email', email);
                        store.dispatch({ type: "success", message: response.message });
                        store.dispatch(GeneralAction.loading(false));
                        store.dispatch(GeneralAction.redirect(true));
                        return router.push('/auth/password/verify');
                    } else {
                        store.dispatch(AuthAction.failure(response.message));
                        store.dispatch(GeneralAction.loading(false));
                    }
                },
                error => {
                    store.dispatch(AuthAction.failure(error));
                    store.dispatch(GeneralAction.loading(false));
                }
            );
        } catch (error: any) {
            dispatch(GeneralAction.loading(false));
            dispatch({ type: "error", message: error.message, title: 'Exception' });
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
            {alert && (
                <AlertMessage className={ `alert ${alert.class}` }
                              icon= {alert.success ? "check" : "info"}
                              title= {alert.title}
                              content= {alert.message}
                />
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
                      <h2>Did you forget your password ?</h2>
                      <p>Enter your email address you’re using for your account below and we will send you a password reset link.</p>
                      <form role="" onSubmit={handleSubmit}>
                      <div className="form-area-signup">
                          <div className='form-row-box'>
                              <input className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  />
                              <label className="title">Enter your email</label>
                          </div>
                          <div className="form-row-box button-panel">
                              <button className="btn btn-primary" type='submit'>SEND</button>
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
