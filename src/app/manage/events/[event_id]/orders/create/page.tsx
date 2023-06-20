'use client';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import Image from 'next/image'

export default function page({ params }: { params: { event_id: string } }) {
  const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);

  return (
    <div>
        {window !== undefined && <iframe width="100%" height={window.innerHeight - 280} src={`${process.env.regSiteHost}/${event.event_url}/sale`} />}
    </div>
  )
}
