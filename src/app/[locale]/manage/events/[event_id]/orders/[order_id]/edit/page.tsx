'use client';
import { authHeader } from '@/helpers';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BASE_URL} from '@/constants/endpoints'
export default function page({ params }: { params: { locale:string, event_id: string, order_id:string } }) {
  const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);
  const {user} = useAppSelector((state: RootState) => state.authUser);
  const router = useRouter();
  const [cloneOrderId, setCloneOrderId] = useState<any>(null);
  const [expandIframe, setexpandIframe] = useState<any>(false);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 280);
  useEffect(() => {
    const source = axios.CancelToken.source();
    axios.post(`${BASE_URL}/registration/event/${event['event_url']}/registration/clone-order/${params.order_id}`,{}, {
      cancelToken:source.token,
      headers: authHeader('GET'),
    }).then((res)=>{
      if(res.data.success){
        setCloneOrderId(res.data.data.id);
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  
    return () => {
      source.cancel();
    }
  }, []);
  

  useEffect(() => {
    const listener = (event:any) =>{
        if(event.data.order_id !== undefined) {
            router.push(`/${params.locale}/manage/events/${params.event_id}/orders`);
        } 
        if(event.data.contentHeight !== undefined){
            setIframeHeight(event.data.contentHeight  + 135);
        }
    }
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);
  useEffect(() => {
    if (expandIframe) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  }, [expandIframe])
  
  const handleClickexpand = () => {
    setexpandIframe(!expandIframe);
  }
  return (
    <div className={expandIframe && 'ebs-expanded-iframe'} id="ebs-master-wrapper-iframe">
       <button onClick={handleClickexpand} className='btn p-1 btn-primary rounded-circle ebs-button-expand'><span className="material-icons">{!expandIframe ? 'fullscreen' : 'close_fullscreen'}</span></button> 
        {(window !== undefined && cloneOrderId !== null) && <iframe width="100%" style={{minHeight: '100vh'}} height={iframeHeight} src={`${process.env.regSiteHost}/${event.event_url}/sale/order-summary/${cloneOrderId}?sale_id=${user.id}`} />}
    </div>
  )
}
