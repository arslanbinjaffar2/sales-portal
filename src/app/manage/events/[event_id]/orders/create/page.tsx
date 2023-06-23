'use client';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import Image from 'next/image'
import { useEffect } from 'react';

export default function page({ params }: { params: { event_id: string } }) {
  const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);
  const {user} = useAppSelector((state: RootState) => state.authUser);
  useEffect(() => {
    const listener = (event:any) =>{
        if(event.data.order_id !== undefined) {
   
        } 
    }
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);
  
  return (
    <div>
        {window !== undefined && <iframe width="100%" height={window.innerHeight - 280} src={event.eventsite_settings.evensite_additional_attendee === 1 ? `${process.env.regSiteHost}/${event.event_url}/sale/?=sale_id=${user.id}` :  `${process.env.regSiteHost}/${event.event_url}/sale/manage-attendee?=sale_id=${user.id}`  } />}
    </div>
  )
}
