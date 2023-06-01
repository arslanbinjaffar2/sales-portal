"use client"; // this is a client component
import {useEffect, useState} from "react";
import Image from 'next/image';
import Illustration from '@/app/assets/img/illustration.png';
import AlertMessage from '@/app/components/forms/alerts/AlertMessage';
import Loader from '@/app/components/forms/Loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthAction } from '@/app/actions/auth/auth-action';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const reduxStore = useAppSelector((state: RootState) => state);
    const alert:any = reduxStore.alert;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordType, setPasswordType] = useState(true)
    const [remember, setRemember] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    function handleFormSummation (email: any, password: any, remember: boolean) {
        if (email && password) {
            // @ts-ignore
            dispatch(AuthAction.login(email, password, remember));
        }
    }

    function handleAuthSetRedirect() {
        // check user authenticated and redirect to redirect path
        if(reduxStore.auth && reduxStore.auth.access_token) {
            (alert && alert.redirect) ? router.push(alert.redirect) : router.push('/manage/events');
        }
    }

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsLoading(true);
            handleFormSummation(email, password, remember);
            setIsLoading(false);
        } catch (error:any) {
            setIsLoading(false);
            dispatch({ type: "error", message: error.message, title: 'Exception' });
        }
    }

    useEffect(() => {
        setIsLoading(true);
        // check user authenticated and redirect to redirect path
        handleAuthSetRedirect();
        setIsLoading(false);
    }, []);


    const handleShowPass = (e:any) => {
        e.stopPropagation();
        setPasswordType(!passwordType)
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
                                            <h2>Sign in</h2>
                                            <p></p>
                                            <form name="form" role="" onSubmit={handleSubmit}>
                                                <div className="form-area-signup">
                                                    <div className='form-row-box'>
                                                        <input className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  />
                                                        <label className="title">Enter your email</label>
                                                    </div>
                                                    <div className='form-row-box'>
                                                <span className="icon-eye">
                                                    <Image onClick={handleShowPass} src={require(`@/app/assets/img/${passwordType ? 'close-eye':'icon-eye'}.svg`)} width="17" height="17" alt="" />
                                                </span>
                                                        <input className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" onChange={(e) => setPassword(e.target.value)}  />
                                                        <label className="title">Password</label>
                                                    </div>
                                                    <div className="login-others clearfix">
                                                        <label onClick={() => setRemember(!remember)}><i className="material-icons">{remember ? 'check_box' : 'check_box_outline_blank'}</i>Remember me</label>
                                                        <Link href="/auth/password/request">Forgot Password?</Link>
                                                    </div>
                                                    <div className="form-row-box button-panel">
                                                        <button type="submit" className="btn btn-primary">Sign in</button>
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
