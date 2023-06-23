"use client"; // this is a client component
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import Loader from '@/components/forms/Loader';
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
        <>
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
                        <input className='' value={token} type="text" name="token" id="token" onChange={(e) => setToken(e.target.value)} pattern="^[0-9]+$" maxLength={6} required />
                        <label className="title">Enter reset code</label>
                    </div>
                    <div className="form-row-box button-panel">
                        <button className="btn btn-primary" disabled={loading} type='submit'>{loading ? "VERIFYING" : "VERIFY"}</button>
                    </div>
                </div>
            </form>
        </>
    );
}
