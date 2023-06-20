"use client"; // this is a client component
import {useEffect, useState} from "react";
import Image from 'next/image';
import Illustration from '@/assets/img/illustration.png';
import AlertMessage from '@/components/forms/alerts/AlertMessage';
import Loader from '@/components/forms/Loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";
import { loginUser } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/forms/alerts/ErrorMessage";
import SuccessAlert from "@/components/forms/alerts/SuccessMessage";

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {user, loading, error, errors, successMessage} = useAppSelector((state: RootState) => state.authUser);


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordType, setPasswordType] = useState(true)
    const [remember, setRemember] = useState(false)

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        if (email && password) {
            // @ts-ignore
            dispatch(loginUser({email, password, remember}));
        }
    }

    useEffect(() => {
        if(user && user.access_token) {
            router.push('/manage/events');
        }
    }, [user]);


    const handleShowPass = (e:any) => {
        e.stopPropagation();
        setPasswordType(!passwordType)
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
                                            <h2>Sign in</h2>
                                            <p></p>
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
                                                {successMessage && <SuccessAlert 
                                                    icon= {"check"}
                                                    title= {"Success"}
                                                    message= {successMessage}
                                                />}
                                            <form name="form" role="" onSubmit={handleSubmit}>
                                                <div className="form-area-signup">
                                                    <div className='form-row-box'>
                                                        <input className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  />
                                                        <label className="title">Enter your email</label>
                                                    </div>
                                                    <div className='form-row-box'>
                                                <span className="icon-eye">
                                                    <Image onClick={handleShowPass} src={require(`@/assets/img/${passwordType ? 'close-eye':'icon-eye'}.svg`)} width="17" height="17" alt="" />
                                                </span>
                                                        <input className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" onChange={(e) => setPassword(e.target.value)}  />
                                                        <label className="title">Password</label>
                                                    </div>
                                                    <div className="login-others clearfix">
                                                        <label onClick={() => setRemember(!remember)}><i className="material-icons">{remember ? 'check_box' : 'check_box_outline_blank'}</i>Remember me</label>
                                                        <Link href="/auth/forgot-password/request">Forgot Password?</Link>
                                                    </div>
                                                    <div className="form-row-box button-panel">
                                                        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "Processing...": "Sign in"}</button>
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
