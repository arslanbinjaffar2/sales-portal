'use client'
import React, { useEffect } from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import { useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';

export default function Invoice() {

  const {loading, event, event_orders} = useAppSelector((state: RootState) => state.event);
  
  return (
<>
<p>Invoice</p>
</>
  );
}
