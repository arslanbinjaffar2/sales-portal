"use client";
import '@/assets/css/app.scss'
import Image from 'next/image';
import Illustration from '@/assets/img/illustration.png';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import { useRouter } from 'next/navigation';
import { logOutUser } from '@/redux/store/slices/AuthSlice';
import { useEffect } from 'react';
import { userEvent } from '@/redux/store/slices/EventSlice';
import { usePathname } from 'next/navigation';
import Loader from '@/components/forms/Loader';
import Link from 'next/link';

export default function RootLayout({ children, params}: { children: React.ReactNode, params: { event_id: string } }) {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);

    useEffect(() => {
      const promise = dispatch(userEvent({event_id:params.event_id}));  
    
      return () => {
        promise.abort();
      }
    }, []);
    
  return (
    <>
    {(loading === false && event !== null) ?
        <>
            <div className="top-landing-page">
                    <div className="row d-flex">
                    <div className="col-8">
                        <div className="logo">
                        <a href="">
                            <Image
                            src={event?.brand_logo !== '' ? `${process.env.serverImageHost}/assets/event/branding/${event?.brand_logo}`: require("@/assets/img/logo.svg")}
                            alt=""
                            width="200"
                            height="29"
                            className="logos"
                            />
                        </a>
                        <div className="ebs-bottom-header-left">
                            <h3>
                            <a href="#!">{event?.event_name}</a>
                            </h3>
                            <ul>
                            <li>
                                <i className="material-symbols-outlined">calendar_month</i>{event?.event_date}
                            </li>
                            <li>
                                <i className="material-symbols-outlined">place</i>{event?.event_location}
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="right-top-header">
                        {(!pathname.includes('invoice') && !pathname.includes('edit') && !pathname.includes('create')) && (event?.payment_settings?.eventsite_billing === 1) ? 
                            <Link href={`/manage/events/${params.event_id}/orders/create`}>
                                <button className="btn btn-default">
                                    <i className="material-symbols-outlined">add</i> Create Order
                                </button> 
                            </Link>
                        : null}
                        {pathname.includes('invoice') ? 
                            <>
                            <button className="btn btn-default">
                                <i className="material-symbols-outlined">sim_card_download</i> PDF
                            </button>
                            <button className="btn btn-default btn-send-order">
                                <i className="material-symbols-outlined">send</i> Send Order
                            </button> 
                            </>
                        : null}
                        </div>
                    </div>
                    </div>
                </div>
            <div style={{ background: "#fff" }} className="main-data-table">
                    {children}
            </div>
        </> :null}
      {loading === true && event === null ? <Loader className=''fixed='' /> : null}
      {loading === false && event === null ? 
        <div className='d-flex justify-content-center align-items-center' style={{fontSize:"32px", textAlign:"center", fontStyle:"italic",  minHeight:"350px"}}>
            No event found
        </div> 
      : null }
    </>
  )
}
