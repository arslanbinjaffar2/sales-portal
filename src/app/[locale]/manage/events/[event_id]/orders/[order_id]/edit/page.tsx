'use client';
import { authHeader } from '@/helpers';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { BASE_URL} from '@/constants/endpoints'
export default function page({ params }: { params: { locale:string, event_id: string, order_id:string } }) {
  const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);
  const {user} = useAppSelector((state: RootState) => state.authUser);
  const router = useRouter();
  const [cloneOrderId, setCloneOrderId] = useState<any>(null);
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
    }
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener('message', listener);
    }
  }, []);


  return (
    <div>
        {(window !== undefined && cloneOrderId !== null) && <iframe width="100%" height={iframeHeight} src={`${process.env.regSiteHost}/${event.event_url}/sale/order-summary/${cloneOrderId}?sale_id=${user.id}`} 
        
        onLoad={(event:any) => {
          const { contentWindow } = event.target;
          const main = contentWindow.document.body.querySelector('main');

          // Because the login form has a dynamic height, observe any size changes and update the iframe height
          const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
              setIframeHeight(entry.contentRect.height);
            });
          });

          resizeObserver.observe(main);

          // When the iframe is hiden (i.e. modal is closed), remove any listeners
          const onVisibilityChange = () => {
            resizeObserver.disconnect();
            contentWindow.addEventListener(
              'visibilitychange',
              onVisibilityChange
            );
          };

          // Add listener for when iframe is hiden (i.e. modal is closed)
          contentWindow.addEventListener(
            'visibilitychange',
            onVisibilityChange
          );
        }}
        />}
    </div>
  )
}
