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
    function handleLoginForm(email:any, password:any, remember:any) {
        if (email && password) {
            // @ts-ignore
            useAppDispatch(AuthAction.login(email, password, remember));
        }
    }

    const router = useRouter();
    const agent = useAppSelector((state: RootState) => state.auth);
    const redirect = useAppSelector((state: RootState) => state.redirect);




    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordType, setPasswordType] = useState(true)
    const [remember, setRemember] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertContent, setAlertContent] = useState({type: '', title: '', message: ''});


    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        // try {
            setIsLoading(true);
            handleLoginForm(email, password, remember);
            setIsLoading(false);
        // } catch (error) {
        //     setIsLoading(false);
        //     showAlert('error', 'Exception', 'Something went wrong, please try again')
        // }
    }

    useEffect(() => {
        console.log({where: 'Inside/start use effect', redirect: redirect, agent: agent});
        if(agent && agent.access_token) {
            console.log({where: 'Token found'});
            // router.push('/manage/events');
        }
        console.log({where: 'After use effect execution'});
    }, []);


    const handleShowPass = (e:any) => {
        e.stopPropagation();
        setPasswordType(!passwordType)
    }




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


    // const handleSubmit = (e:any) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     try {
    //         setIsLoading(true);
    //         handleFormSubmit(email, password, remember);
    //         setIsLoading(false);
    //
    //         // if (email && password) {
    //         //     // @ts-ignore
    //         //     useAppDispatch(AuthAction.login(email, password, remember));
    //         //     return console.log({where: 'After login action', agent: agent, redirect: redirect});
    //         // }
    //         // setIsLoading(false);
    //     } catch (error) {
    //         setIsLoading(false);
    //         showAlert('error', 'Exception', 'Something went wrong, please try again')
    //     }
    // }


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
