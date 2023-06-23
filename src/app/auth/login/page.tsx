"use client"; // this is a client component
import {use, useEffect, useRef, useState} from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";
import { loginUser } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/forms/alerts/ErrorMessage";
import SuccessAlert from "@/components/forms/alerts/SuccessMessage";
import Loading from "../loading";
import ConfirmPopup from "@/components/ConfirmPopup";

export default function Login() {
		const _email = useRef<HTMLInputElement>(null);
		const _password = useRef<HTMLInputElement>(null);
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
			setEmail(_email?.current.value || '')
			setPassword(_password?.current.value || '')
        if(user && user.access_token) {
            router.push('/manage/events');
        }
    }, [user]);


    const handleShowPass = (e:any) => {
        e.stopPropagation();
        setPasswordType(!passwordType)
    }

		const handlePopup = (e) => {
			alert(e)
		}
    return (
        <>
					<ConfirmPopup handleClose={handlePopup} />
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
                        <input ref={_email} className={email ? 'ieHack': ''} value={email} type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  required/>
                        <label className="title">Enter your email</label>
                    </div>
                    <div className='form-row-box'>
                <span className="icon-eye">
                    <Image onClick={handleShowPass} src={require(`@/assets/img/${passwordType ? 'close-eye':'icon-eye'}.svg`)} width="17" height="17" alt="" />
                </span>
                        <input ref={_password} className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" required onChange={(e) => setPassword(e.target.value)}  />
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
        </>
    );
}
