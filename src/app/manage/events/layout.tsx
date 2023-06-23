"use client";
import '@/assets/css/app.scss'
import Image from 'next/image';
import Illustration from '@/assets/img/illustration.png';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { logOutUser } from '@/redux/store/slices/AuthSlice';
import { useEffect } from 'react';

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function RootLayout({ children, params}: { children: React.ReactNode, params: { event_id: string } }) {
    const router = useRouter();
    const {user} = useAppSelector((state: RootState) => state.authUser);
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    useEffect(() => {
         (user === null) ? router.push('auth/login') : null;
    }, [user]);
    
  return (
    <>
    <header className="header">
        <div className="container">
            <div className="row bottom-header-elements">
                <div className="col-8">
                    {pathname !== "/manage/events" ?<p>
                        <a href="#!" onClick={(e)=>{e.preventDefault(); 
                            console.log('pathname', pathname);
                            if(pathname.includes('invoice') || pathname.includes('create') || pathname.includes('edit')){
                                router.push(`/manage/events/${pathname.split('/')[3]}/orders`);
                            }
                            else if(pathname.includes('orders')){
                                router.push(`/manage/events`);
                            }
                            else{
                                router.push(`/manage/events`);
                            }
                        }}>
                            <i className="material-icons">arrow_back</i> Return to list
                        </a>
                    </p>: null}
                </div>
                <div className="col-4 d-flex justify-content-end">
                    <ul className="main-navigation">
                        {<li>{user?.first_name} {user?.last_name} <i className="material-icons">expand_more</i>
                            <ul>
                                <li><a href="" onClick={(e)=>{e.preventDefault(); dispatch(logOutUser({}));}}>Logout</a></li>
                            </ul>
                        </li>}
                        <li>English <i className="material-icons">expand_more</i>
                            <ul>
                                <li><a href="">English</a></li>
                                <li><a href=""> Danish</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <main className="main-section" role="main">
        <div className="container">
            <div className="wrapper-box">
                <div className="container-box main-landing-page" style={{position:'relative'}}>
                    {children}
                </div>
            </div>
        </div>
    </main>
    </>
  )
}