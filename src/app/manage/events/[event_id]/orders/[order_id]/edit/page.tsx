'use client';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function page({ params }: { params: { event_id: string, order_id:string } }) {
  const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);
  const {user} = useAppSelector((state: RootState) => state.authUser);
  const router = useRouter();
  useEffect(() => {
    const listener = (event:any) =>{
        if(event.data.order_id !== undefined) {
            router.push(`/manage/events/${params.event_id}/orders`);
        } 
    }
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);
  return (
    <div>
        {window !== undefined && <iframe width="100%" height={window.innerHeight - 280} src={`${process.env.regSiteHost}/${event.event_url}/sale/order-summary/${params.order_id}?=sale_id=${user.id}`} />}
    </div>
  )
}
