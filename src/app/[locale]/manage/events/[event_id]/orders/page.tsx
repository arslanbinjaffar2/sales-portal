'use client'
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {RootState} from "@/redux/store/store";
import { setLoading, userEvent, userEventFormStats, userEventOrderDelete, userEventOrders } from '@/redux/store/slices/EventSlice';
import Loader from '@/components/forms/Loader';
import Countdown from '@/components/Countdown';
import {authHeader, getSelectedLabel} from '@/helpers'; 
import Link from 'next/link';
import Pagination from '@/components/pagination';
import { AGENT_ENDPOINT } from '@/constants/endpoints';
import axios from 'axios';
import moment from 'moment'
import TicketDetail from '@/components/TicketDetail';
import ConfirmPopup from "@/components/ConfirmPopup";
import { userEventOrderChangePymentStatus } from '@/redux/store/slices/OrderSlice';
import { useTranslations } from 'next-intl';


// const MoreAttendees = ({data}: any) => {
//   const [toggle, setToggle] = useState(false)
//   return (
//     <div style={{background: '#EEF2F4',}} className='rounded-4'>
//       <div style={{background: '#EEF2F4', cursor:'default'}} className="d-flex align-items-center ebs-table-content" >
//           <div className="ebs-table-box ebs-box-1" />
//           <div className="ebs-table-box ebs-box-1" />
//         <div className="ebs-table-box ebs-box-2"><p><strong onClick={() => setToggle(!toggle)}> <i  style={{fontSize: 18}} className="material-icons">{toggle ? 'expand_more' : 'chevron_right' }</i>  <span style={{marginRight:'5px'}}>{data?.length - 1}</span> {"more attendees"}  </strong></p></div>
//         <div className="ebs-table-box ebs-box-2" />
//         <div className="ebs-table-box  ebs-box-4" />
//        <div className="ebs-table-box ebs-box-4" />
//        <div className="ebs-table-box ebs-box-4" />
//        <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
//        <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
//        <div className="ebs-table-box ebs-box-3 d-flex justify-content-end" />
//       </div>
//       {toggle && <React.Fragment>
//         {data.map((attendee:any,k:any) =>
//          k === 0 ? null : (<div style={{background: '#EEF2F4', cursor:'default'}} key={attendee.id} className="d-flex align-items-center ebs-table-content">
//           <div className="ebs-table-box ebs-box-1" />
//           <div className="ebs-table-box ebs-box-1" />
//           <div className="ebs-table-box ebs-box-2" style={{paddingLeft:'32px'}}>
//             <p><strong>{attendee?.attendee_detail?.first_name} {attendee?.attendee_detail?.last_name}</strong></p>
//             <p>{attendee?.attendee_detail?.email} </p>
//             </div>
//           <div className="ebs-table-box ebs-box-2"></div>
//           <div className="ebs-table-box  ebs-box-4" />
//         <div className="ebs-table-box ebs-box-4" />
//         <div className="ebs-table-box ebs-box-4" />
//         <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
//         <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
//         <div className="ebs-table-box ebs-box-3 d-flex justify-content-end" />
//         </div>)
//       )}
//       </React.Fragment>}
//     </div>
//   )
// }

const MoreAttendees = ({data,toggle,classes}: any) => {
  return (
    <>
    {toggle && 
    <div style={{background: 'white',maxWidth:"150px",width:"100%",height: "221px",overflowX:"hidden",overflowY:"auto",
    zIndex:"9999",left:"20%",top:"70%"}} 
    className={ `text-start rounded_4  box-shadow-white mt-1 ${classes}` }>

      {/* <div style={{background: '#EEF2F4', cursor:'default'}} className="d-flex align-items-center ebs-table-content" >
          <div className="ebs-table-box ebs-box-1" />
          <div className="ebs-table-box ebs-box-1" />
        <div className="ebs-table-box ebs-box-2"><p><strong onClick={() => setToggle(!toggle)}> <i  style={{fontSize: 18}} className="material-icons">{toggle ? 'expand_more' : 'chevron_right' }</i>  <span style={{marginRight:'5px'}}>{data?.length - 1}</span> {"more attendees"}  </strong></p></div>
        <div className="ebs-table-box ebs-box-2" />
        <div className="ebs-table-box  ebs-box-4" />
       <div className="ebs-table-box ebs-box-4" />
       <div className="ebs-table-box ebs-box-4" />
       <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
       <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
       <div className="ebs-table-box ebs-box-3 d-flex justify-content-end" />
      </div> */}
      <div className='mt-2 p-2 border-down-grey fw-bold '>
          <strong className='text-charcoal-grey fs-12 fw-600'>ATTENDEES ({data.slice(1,data.length).length})</strong>
      </div>
     <div className='flex flex-column align-items-start'>
        {data.length>0 && data.slice(1,data.length).map((attendee:any,k:any) =>   

          <div style={{background: 'white', cursor:'default'}} key={attendee.id} className="d-flex align-items-center ebs-table-content w-100"> 
          <div className="border-down-grey p-2 d-flex flex-column w-100" >
            <strong className='text-charcoal-grey fs-12 fw-600' title={`${attendee?.attendee_detail?.first_name} ${attendee?.attendee_detail?.last_name}`}><strong>{attendee?.attendee_detail?.first_name} {attendee?.attendee_detail?.last_name}</strong></strong>
            <span className='text-dove-grey fs-10' title={attendee?.attendee_detail?.email}>{attendee?.attendee_detail?.email} </span>
            </div>  
        </div>
      
     )} 
      </div>
      {/* <div style={{background: 'white', cursor:'default'}}  className="d-flex align-items-center ebs-table-content w-100"> 
          <div className="border-down-grey p-2 " >
            <strong className='text-charcoal-grey fs-12 fw-600' >asasasaasa</strong>
            <span className='text-dove-grey fs-10' >dfdfhdfgh asasasasaaaaaaaaaaaaaaaa</span>
            </div>  
        </div> */}
    </div>
    
    }

    </>

  )
}


function SingleAttendeeName({setToggleMoreAttendees,toggleMoreAttendees,sort,sortCol}:any){
  const attendeeNameRef = useRef<any>();

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (attendeeNameRef.current && !attendeeNameRef.current?.contains(event.target)) {
        setToggleMoreAttendees(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [toggleMoreAttendees]);
  return(
    <span ref={attendeeNameRef} className='bg-dark-grey d-flex justify-content-center align-items-center rounded_2 cursor-pointer ' style={{ width:"14px",height:"14px" }}>
    <em className={`fw-bolder text-innertext fs-12 line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} 
     onClick={()=>setToggleMoreAttendees(!toggleMoreAttendees)}>
     keyboard_arrow_down</em>
   </span>
  )
}


function AttendeeName({sort,sortCol,order}:any){
  const [toggleMoreAttendees, setToggleMoreAttendees] = useState(false)

  return(
    <>
    <SingleAttendeeName setToggleMoreAttendees={setToggleMoreAttendees}
    toggleMoreAttendees={toggleMoreAttendees}
    sort={sort}
    sortCol={sortCol}
    />
  <MoreAttendees classes={"position-absolute"} data={order?.order_attendees} 
  toggle={toggleMoreAttendees}
  />
</>
  )
}

export default function OrderListing({ params }: { params: { locale:string, event_id: string } }) {
  const t = useTranslations('manage-orders-page');

  const dispatch = useAppDispatch();
  const {loading, event, event_orders, fetching_orders, currentPage, totalPages, form_stats} = useAppSelector((state: RootState) => state.event);

  let ordersRequestDataStored = typeof window !== "undefined" && localStorage.getItem("ordersRequestData");
  const ordersRequestDataStore = ordersRequestDataStored && ordersRequestDataStored !== undefined ? JSON.parse(ordersRequestDataStored) : null;

  const [limit, setLimit] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.limit :10);
  const [type, setType] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.type :'all');
  const [sortCol, setSortCol] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.sort_col : 'order_number');
  const [sort, setSort] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.sort : 'desc');

  const [regFormId, setRegFromId] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [toggoleLimited, settoggoleLimited] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [showPaymentRecievedPopup, setshowPaymentRecievedPopup] = useState(false)
  const [paymentRevcievedOrderId, setPaymentRevcievedOrderId] = useState<null| number>(null)
  const [paymentRevcievedStatus, setPaymentRevcievedStatus] = useState(false)
  const [processingPaymentchange, setProcessingPaymentChange] = useState(false);

  useEffect(()=>{
    let promise:any = '';
    let promise2:any = '';

    if(event !== null){
       promise = dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, sort:sort, sort_col:sortCol,regFormId}));  
       promise2 = dispatch(userEventFormStats({event_id:params.event_id, searchText, limit, type, sort:sort, sort_col:sortCol, regFormId}));  
    
    }
    return () => {
      if(typeof promise === 'object' && typeof promise.then === 'function'){
        promise.abort();
      }
      if(typeof promise2 === 'object' && typeof promise2.then === 'function'){
        promise2.abort();
      }
    }
  }, [event])

  const orderFilters = useMemo(() => [
    { id: "all", name: t('order_filters.all') },
    {
      name:t('order_filters.order_status'),
      options:[
        { id: "completed", name: t('order_filters.completed') },
        { id: "cancelled", name: t('order_filters.cancelled') },
        { id: "pending", name: t('order_filters.pending') },
      ]
    },
    {
      name:t('order_filters.payment_status'),
      options:[
        { id: "payment_received", name: t('order_filters.payment_received') },
        { id: "payment_pending", name: t('order_filters.payment_pending') },
      ]
    },
    
], [params.locale])
  

  useEffect(() => {
    // todo, do further logic and API integration
    document.body.addEventListener('click', handleBody,false)
    return () => {
      document.body.removeEventListener('click', handleBody,false)
    }
  }, [])


  const handleBody = (e:any) => {
    let _items = document.querySelectorAll('.ebs-btn-dropdown');
    _items.forEach(element => {
      element.classList.remove('ebs-active')
    });
  }


  const handleToggle = (e:any) => {
    e.stopPropagation();
    e.preventDefault();
    settoggoleLimited(!toggoleLimited);
  }

  const storeEventRequestData = (ordersRequestDataStored:any) => {
    if(window !== undefined){
        localStorage.setItem('ordersRequestData', JSON.stringify(ordersRequestDataStored));
    }
}

  const handleSearchTextFilter = (e:any) => {
    const {value} = e.target;
    setSearchText(value);
    // Update the requestData state with the modified array
    storeEventRequestData({searchText:value, limit, type, page:1, sort:sort, sort_col:sortCol, regFormId});
    dispatch(userEventOrders({event_id:params.event_id, searchText:value, limit, type, page:1, sort:sort, sort_col:sortCol, regFormId}));
    setPage(1);

  }

    const handleFilterByFilter = (e:any) => {
        setType(e.value);
        storeEventRequestData({ searchText, limit, type:e.value, page:1, sort:sort, sort_col:sortCol, regFormId});
        dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type:e.value, page:1, sort:sort, sort_col:sortCol, regFormId}));
        setPage(1);
    }

    const handleRegFormByFilter = (e:any) => {
        setRegFromId(e.value);
        storeEventRequestData({ searchText, limit, type:e.value, page:1, sort:sort, sort_col:sortCol, regFormId:e.value});
        dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type:e.value, page:1, sort:sort, sort_col:sortCol, regFormId:e.value}));
        setPage(1);
    }

    const handleLimitChange = (e:any, value:any) => {
      setLimit(value); 
      handleToggle(e);
      storeEventRequestData({ searchText, limit:value, type, page:1, sort:sort, sort_col:sortCol, regFormId});
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit:value, type, page:1, sort:sort, sort_col:sortCol, regFormId}));
      setPage(1);
    }

    const handleRowControlsToggle = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.toggle('ebs-active');
    }

    const handlePageChange = (page: number) => {
      setPage(page);
      storeEventRequestData({ searchText, limit, type, page, sort:sort, sort_col:sortCol, regFormId});
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort:sort, sort_col:sortCol, regFormId}));
    };
    
    const handleSortChange = (sort:string, sortCol: string) => {
      setSort(sort);
      setSortCol(sortCol);
      storeEventRequestData({ searchText, limit, type, page, sort:sort, sort_col:sortCol, regFormId});
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort:sort, sort_col:sortCol, regFormId}));
    };
    
    const handleShowPaymentChangePopup = (order_id:number, payment_status:boolean) => {
      setshowPaymentRecievedPopup(true);
      setPaymentRevcievedOrderId(order_id);
      setPaymentRevcievedStatus(payment_status);
    };
    
    const closeShowPaymentChangePopup = async (type:string, option:{date:string,paymentStatus:boolean}) => {
      if(paymentRevcievedOrderId !== null && type === 'continue'){
        setProcessingPaymentChange(true);
        try {
          const res = await dispatch(userEventOrderChangePymentStatus({order_id:paymentRevcievedOrderId, payment_status:option.paymentStatus, date:option.date })).unwrap();
          setshowPaymentRecievedPopup(false);
          setPaymentRevcievedOrderId(null);
          setPaymentRevcievedStatus(false);
          dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort, sort_col:sortCol, regFormId}));
          
        } catch (error) {
          setshowPaymentRecievedPopup(false);
          setPaymentRevcievedOrderId(null);
          setPaymentRevcievedStatus(false);
          dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort, sort_col:sortCol, regFormId}));
        }
        setProcessingPaymentChange(false);

      }else{
        setshowPaymentRecievedPopup(false);
        setPaymentRevcievedOrderId(null);
        setPaymentRevcievedStatus(false);
      }
    };

    const downloadPdf = async (data:any) => {
      try {
          const response = await axios.get(`${AGENT_ENDPOINT}/billing/send-order-pdf/${data.id}/${data.type}`,  {
            headers: authHeader('GET'),
            responseType: 'blob'
          });
          console.log(response);
          let url = window.URL.createObjectURL(response.data);
          console.log(url);
          let a = document.createElement("a");
          a.href = url;
          a.download = data.id+".pdf";
          a.click();
        } catch (err:any) {
          
        }
  }
  const handlePopup = (e:any) => {
    setToggle(false);
  }
  return (
    <>
     {(loading === false && event !== null) ?
     <>     
            <div className="ebs-ticket-section">
              <div className="ebs-ticket-section-inner">
                  {form_stats && <div className="ebs-ticket-box">
                    <button onClick={() => setToggle(true)} className='btn'><em className="material-symbols-outlined">local_activity</em></button>
                  </div>}
                  {event?.event_stats?.waiting_tickets > 0 && <div className="ebs-ticket-box">
                    <strong>{event?.event_stats?.waiting_tickets}</strong>
                    <span>{t('stats_waiting_tickets')}</span>
                  </div>}
                  <div className="ebs-ticket-box">
                    <strong>{event?.event_stats?.tickets_sold}</strong>
                    <span>{t('stats_sold_tickets')}</span>
                  </div>
                  <div className="ebs-ticket-box">
                        <strong>{event?.sales_agent_stats?.tickets_sold}</strong>
                        <span>{t('stats_my_sold_tickets')}</span>
                    </div>
                  <div className="ebs-ticket-box">
                    <strong>{event?.sales_agent_stats?.revenue_text}</strong>
                    <span>
                    {t('stats_my_revenue')} 
                    </span>
                  </div>
              </div>
            </div>
            {toggle && <TicketDetail handleClose={handlePopup} event_id={params.event_id} form_stats={form_stats} />}
            <div className="ebs-order-list-section">
              <div className="ebs-order-header">
                <h4>{t('order_list')}</h4>
                <div className="row">
                  <div className="col-12 d-flex">
                    <input type="text" className="ebs-search-area" placeholder={t('search')} onKeyUp={(e) => { e.key === 'Enter' ? handleSearchTextFilter(e): null}} value={searchText} onChange={(e)=>{setSearchText(e.target.value)}} />
                    <label style={{ width: "210px" }} className="label-select-alt">
                      <Dropdown
                        label="Select type"
                        selected={type} 
                        onChange={handleFilterByFilter}
                        isGroup
                        selectedlabel={getSelectedLabel(orderFilters,type)}
                        listitems={orderFilters}
                      />
                    </label>
                    {form_stats && form_stats?.length > 0 && <label style={{ width: "210px" }} className="label-select-alt">
                      <Dropdown
                        label="Registration forms"
                        selected={regFormId} 
                        onChange={handleRegFormByFilter}
                        selectedlabel={getSelectedLabel([{id:0,name:"Registration forms"},...form_stats.map((item:any)=>({id:item.id, name:item.attendee_type.attendee_type}))],regFormId)}
                        listitems={[{id:0,name:"Registration forms"},...form_stats.map((item:any)=>({id:item.id, name:item.attendee_type.attendee_type}))]}
                      />
                    </label>}
                  </div>
                </div>
              </div>
              {showPaymentRecievedPopup ? <ConfirmPopup handleClose={closeShowPaymentChangePopup} processing={processingPaymentchange} currentPaymentStatus={paymentRevcievedStatus}  /> : null}
              <div className="ebs-data-table ebs-order-table border rounded">
                {/* old design  */}
                <div className="d-flex align-items-center ebs-table-header d-none">
                  <div className="ebs-table-box ebs-box-1"><strong>{t('order_table.number')}
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_number' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'order_number')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_number' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'order_number')}}>keyboard_arrow_down</em>
                    </span>
                  </strong></div>
                  <div className="ebs-table-box ebs-box-1"><strong>{t('order_table.date')} 
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_date' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'order_date')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_date' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'order_date')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-2"><strong>{t('order_table.attendee_name')} 
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'name' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'name')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'name' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'name')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-2"><strong>{t('order_table.attendee_email')} 
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'email' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'email')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'email' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'email')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-4"><strong>{t('order_table.company')} 
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'company' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'company')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'company' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'company')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-4"><strong>{t('order_table.sold_tickets')}
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'sold_tickets' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'sold_tickets')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'sold_tickets' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'sold_tickets')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-4"><strong>{t('order_table.revenue')} 
                    </strong></div>
                  <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}}><strong>{t('order_table.status')}
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_status' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'order_status')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_status' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'order_status')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}}><strong>{t('order_table.payment_status')} 
                    <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'payment_status' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('asc', 'payment_status')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'payment_status' ? 'fw-bolder' : ''}`} onClick={()=>{handleSortChange('desc', 'payment_status')}}>keyboard_arrow_down</em>
                    </span>
                    </strong></div>
                  <div className="ebs-table-box ebs-box-3"  />
                </div>
                  {/* new design */}
                  <div className="d-flex align-items-center ebs-table-header bg-dark-grey " style={{ height:"50px" }}>
                      <div className="ebs-table-box ebs-box-1 " style={{ width:"80px" }}>
                        <strong className='fs-12 fw-600'>
                        {t('order_table.number')}
                          {/* <span className='d-flex flex-column line-height-0 ms-6'>
                            <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined  ${sort === 'asc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_number')}}>keyboard_arrow_up</em> 
                            <em className={`text-innertext fs-12 line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_number')}}>keyboard_arrow_down</em>
                          </span> */}
                        </strong>
                      </div>
                      <div className="ebs-table-box ebs-box-1 d-flex align-items-center" style={{ width:"100px" }}>
                        <strong className='fs-12 fw-600'>                          
                        {t('order_table.date')} 
                      </strong>
                      <span className='d-flex flex-column line-height-0 ms-6 fs-12'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'order_date' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_date')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'order_date' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_date')}}>keyboard_arrow_down</em>
                    </span>
                      </div>
                      <div className="ebs-table-box ebs-box-2 d-flex align-items-center">
                        <strong className='fs-12 fw-600'>
                      {t('order_table.attendee_name')}
                      </strong>
                      <span className='d-flex flex-column line-height-0 ms-6'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'name' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'name')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'name' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'name')}}>keyboard_arrow_down</em>
                    </span>
                      </div>
                      <div className="ebs-table-box ebs-box-2 d-flex align-items-center">
                        <strong className='fs-12 fw-600'>
                      {t('order_table.attendee_email')}
                      </strong>
                      <span className='d-flex flex-column line-height-0 ms-6'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'email' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'email')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'email' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'email')}}>keyboard_arrow_down</em>
                    </span>
                      </div>
                
                      <div className="ebs-table-box ebs-box-2 d-flex align-items-center">
                        <strong className='fs-12 fw-600'>
                      {t('order_table.company')}
                      </strong>
                      <span className='d-flex flex-column line-height-0 ms-6'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'company' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'company')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'company' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'company')}}>keyboard_arrow_down</em>
                    </span>
                      </div>
                      <div className="ebs-table-box ebs-box-4 d-flex align-items-center" style={{ width:"100px" }}>
                        <strong className='fs-12 fw-600'> 
                        {t('order_table.sold_tickets')}
                       
                    </strong>
                      <span className='d-flex flex-column line-height-0  mr-16'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'amount' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'amount')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'amount' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'amount')}}>keyboard_arrow_down</em>
                    </span>
                    </div>
                      <div className="ebs-table-box ebs-box-4 d-flex align-items-center pe-4" style={{ width:"100px" }}>
                        <strong className='fs-12 fw-600'>
                        {t('order_table.revenue')} 
                      </strong>
                      <span className='d-flex flex-column  line-height-0 ms-6'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'sales_agent')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'sales_agent')}}>keyboard_arrow_down</em>
                    </span>
                      </div>
                      <div className="ebs-table-box ebs-box-4 d-flex align-items-center pe-4" style={{ width:"100px" }}>
                        <strong className='fs-12 fw-600'>
                        {t('order_table.status')}
                      </strong>
                      <span className='d-flex flex-column  line-height-0  mr-16'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'sales_agent')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'sales_agent')}}>keyboard_arrow_down</em>
                    </span>
                      </div>
                      <div className="ebs-table-box ebs-box-4 d-flex align-items-center pe-4 " style={{ width:"100px" }}>
                        <strong className='fs-12 fw-600'>
                        {t('order_table.payment_status')} 
                        </strong>
                      <span className='d-flex flex-column line-height-0  mr-16'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'order_status' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_status')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'order_status' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_status')}}>keyboard_arrow_down</em>
                    </span>
                        </div>
                        <div className="ebs-table-box ebs-box-4" >
                        <strong className='fs-12 fw-600'>
                        {/* {t('order_table.payment_status')}  */}
                        {/* Actions */}
                      {/* <span className='d-flex flex-column line-height-0 ms-6'>
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'asc' && sortCol === 'order_status' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_status')}}>keyboard_arrow_up</em> 
                      <em className={`text-innertext fs-12  line-height-1 material-symbols-outlined ${sort === 'desc' && sortCol === 'order_status' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_status')}}>keyboard_arrow_down</em>
                    </span> */}
                        </strong></div>
                    </div>
                {event_orders !== null && event_orders?.data?.length > 0 ? event_orders.data.map((order:any, key:number) =>
                <>
                {/* old design */}
                <div key={order.id} className='d-none'>
                  <div className="d-flex align-items-center ebs-table-content flex-wrap" style={{cursor:'text'}}>
                    <div className="ebs-table-box ebs-box-1" ><p>{order.order_number}</p></div>
                    <div className="ebs-table-box ebs-box-1"><p>{moment(new Date(order.order_date)).format('DD-MMM-YYYY')}</p></div>
                    <div className="ebs-table-box ebs-box-2 "><p >{order.order_attendee.first_name} {order.order_attendee.last_name}</p></div>
                    <div className="ebs-table-box ebs-box-2"><p>{order.order_attendee.email}</p></div>
                    <div className="ebs-table-box ebs-box-4"><p>{order.detail.company_name}</p></div>
                    <div className="ebs-table-box ebs-box-4"><p>{order.tickets_sold}</p></div>
                    <div className="ebs-table-box ebs-box-4"><p>{order.reporting_panel_total_text} </p></div>
                    <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0, color:order.status === 'completed' ? '#41a54f' : '#ff002e', cursor:'text'}}><p>{order.status}</p></div>
                    <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0, color:order.is_payment_received ? '#41a54f' : '#019aeb', cursor: order.status !== 'cancelled' ? 'pointer' : 'text'}}>
                      <p onClick={()=>{ if(order.status !== 'cancelled') {handleShowPaymentChangePopup(order.id, order.is_payment_received) } }} >{order.is_payment_received ? 'Received': 'Pending'}</p>
                      {order.is_payment_received === 1 && <p>{moment(new Date(order.payment_received_date)).format('DD-MMM-YYYY')}</p>}
                      </div>
                    <div className="ebs-table-box ebs-box-3 d-flex justify-content-end">
                      <ul className='d-flex ebs-panel-list m-0'>
                        {order.status !== 'cancelled' && <li>
                        <Link href={`/${params.locale}/manage/events/${params.event_id}/orders/${order.id}/edit`} style={{textDecoration:'none'}}>
                            <button className='ebs-btn-panel'>
                              <Image
                                src={require("@/assets/img/ico-edit.svg")}
                                alt=""
                                width="12"
                                height="12"
                              />
                            </button>
                            </Link>
                        </li>}
                        <li>

                          <button className='ebs-btn-panel' onClick={(e)=>{ if(confirm(t('delete_order_alert_label'))){ dispatch(userEventOrderDelete({event_id:params.event_id, searchText, limit, type, page, id:order.id})) }}}>
                            <Image
                              src={require("@/assets/img/ico-trash.svg")}
                              alt=""
                              width="12"
                              height="14"
                            />
                          </button>
                        </li>
                        <li>
                          <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                            <button onClick={handleRowControlsToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                              <i className="material-icons">more_horiz</i>
                            </button>
                            <div style={{minWidth: 130}} className="ebs-dropdown-menu">
                            <Link href={`/${params.locale}/manage/events/${params.event_id}/orders/${order.id}/invoice`} style={{textDecoration:'none'}}>
                              <button className="dropdown-item">{t('view')}</button>
                            </Link>
                              {/* <button className="dropdown-item">Print Badge</button> */}
                              <button className="dropdown-item" onClick={()=> { downloadPdf({id:order.id, type:'order'})}}>{t('download')} </button>
                              <button onClick={()=> { downloadPdf({id:order.id, type:'invoice' })}} style={{borderTop: '1px solid #F2F2F2'}} className="dropdown-item">{t('download_as_invoice')}</button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {order?.order_attendees?.length > 1 && <MoreAttendees data={order.order_attendees} />}
                </div>
                {/* // new design */}
                <div key={order.id} className={`${
                        key !== event_orders.data.length - 1 ? "border-down-grey" : ""
                    }`}>
                        <div key={key} className="d-flex align-items-center ebs-table-content flex-wrap" style={{cursor:'text'}}>
                          <div className="ebs-table-box ebs-box-1" style={{ width:"80px" }}><Link
                          href={`/manage/events/${order?.event_id}/orders/${order?.id}/invoice`}
                          title={order.order_number} className='text-dove-grey fs-12'>{order.order_number}</Link></div>
                          <div className="ebs-table-box ebs-box-1" style={{ width:"100px" }}><p className='text-dove-grey fs-12 '>{moment(new Date(order.order_date)).format('DD-MMM-YYYY')}</p></div>
                          <div className="ebs-table-box ebs-box-2 ebs-attendee-name-list d-flex align-items-center gap-2 word-break position-relative" >
                            <strong  title={`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}
                            className='fs-12 text-dove-grey fw-600 word-break'
                            >
                              {`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}               
                            </strong>
                            {order?.order_attendees?.length > 1 && 
                             <AttendeeName
                            sort={sort}
                            sortCol={sortCol}
                            classes={"position-absolute "} 
                            order={order}
                             />
                        }
                            {/* {order.order_attendees.length <= 1 ? <p>{`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}</p> : (
                              <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                              <div className="d-flex align-items-center">
                                  <p>{`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}</p>  
                                  <button onClick={handleToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                                  <i className="material-icons">expand_more</i>
                                  </button>
                                  <div style={{minWidth: 180}} className="ebs-dropdown-menu">
                                    <h5>attendees ({order.order_attendees.length})</h5>
                                    {order?.order_attendees?.map((attendee:any, k:number)=>(
                                      <div className="ebs-dropdown-list" key={k}>
                                      <p className="name">{`${attendee.attendee_detail?.first_name} ${attendee.attendee_detail?.last_name}`}</p>
                                      <p className="email">{attendee.attendee_detail?.email}</p>
                                      </div>
                                    ))}
                                    
                                    </div>
                                </div>
                                </div>
                              )} */}
                          </div>
                          <div className="ebs-table-box ebs-box-2"><strong   className='fs-12 fw-600 text-dove-grey word-break' title={order?.order_attendee?.email}>
                        
                            
                            {order?.order_attendee?.email}
                            </strong></div>
                          {/* <div style={{width: 150}} className="ebs-table-box ebs-box-2"><p className='text-dove-grey' title={order?.order_attendee?.detail?.title}>{order?.order_attendee?.detail?.title}</p></div> */}
                          <div className="ebs-table-box ebs-box-2"><p className='text-dove-grey fs-12 word-break white-space-wrap' title={order.detail.company_name}>{order.detail.company_name}
                 
                          </p></div>

                    <div className="ebs-table-box ebs-box-4"  style={{ width:"100px" }}><p>
                 
                      {order.tickets_sold}
                      </p></div>
                          <div className="ebs-table-box ebs-box-4" style={{ width:"100px" }}><p className='text-dove-grey fs-12 ' title={order?.reporting_panel_total_text}>
                 
                            {order?.reporting_panel_total_text}
                            </p></div>
                    <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0, color:order.status === 'completed' ? '#41a54f' : '#ff002e', cursor:'text',width:"100px"}}><p>{order.status}
                    
                    </p></div>
                          {/* <div className="ebs-table-box ebs-box-4"><p className='text-dove-grey fs-12 ' title={order?.sales_agent_name}>{order?.sales_agent_name}</p></div> */}
                          {/* <div className="ebs-table-box ebs-box-4" style={{width: 150}}><p className='text-dove-grey' style={{fontWeight: 500, color: order.billing_order_status == 'completed' ? '#60A259' : '#AB8D2E'}}>{order.billing_order_status}</p></div> */}
                          {/*  */}
                          <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0, color:order.is_payment_received ? '#41a54f':"#4A99E5", cursor:'text',width:"100px"}}>
                          <p onClick={()=>{ if(order.status !== 'cancelled') {handleShowPaymentChangePopup(order.id, order.is_payment_received) } }} >{order.is_payment_received ? 'Received': 'Pending'}</p>
                            {/* {order.is_payment_received === 1 && <p>{moment(new Date(order.payment_received_date)).format('DD-MMM-YYYY')}
                            </p>} */}
                            </div>

                          <div className="ebs-table-box ebs-box-4 d-flex justify-content-end ms-auto" style={{ width:"100px" }}>
                      <ul className='d-flex ebs-panel-list m-0'>
                        {order.status !== 'cancelled' && <li>
                        <Link href={`/${params.locale}/manage/events/${params.event_id}/orders/${order.id}/edit`} style={{textDecoration:'none'}}>
                            <button className='ebs-btn-panel'>
                              <Image
                                src={require("@/assets/img/ico-edit.svg")}
                                alt=""
                                width="12"
                                height="12"
                              />
                            </button>
                            </Link>
                        </li>}
                        <li>

                          <button className='ebs-btn-panel' onClick={(e)=>{ if(confirm(t('delete_order_alert_label'))){ dispatch(userEventOrderDelete({event_id:params.event_id, searchText, limit, type, page, id:order.id})) }}}>
                            <Image
                              src={require("@/assets/img/ico-trash.svg")}
                              alt=""
                              width="12"
                              height="14"
                            />
                          </button>
                        </li>
                        <li>
                          <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                            <button onClick={handleRowControlsToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                              <i className="material-icons">more_horiz</i>
                            </button>
                            <div style={{minWidth: 130}} className="ebs-dropdown-menu">
                            <Link href={`/${params.locale}/manage/events/${params.event_id}/orders/${order.id}/invoice`} style={{textDecoration:'none'}}>
                              <button className="dropdown-item">{t('view')}</button>
                            </Link>
                              {/* <button className="dropdown-item">Print Badge</button> */}
                              <button className="dropdown-item" onClick={()=> { downloadPdf({id:order.id, type:'order'})}}>{t('download')} </button>
                              <button onClick={()=> { downloadPdf({id:order.id, type:'invoice' })}} style={{borderTop: '1px solid #F2F2F2'}} className="dropdown-item">{t('download_as_invoice')}</button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                        </div>
                           
                      </div>
                </>

                ) :
                (fetching_orders ? <div style={{position:"relative", minHeight:"350px"}}>
                  <Loader className=''fixed='' />
                </div> : 
                  <div style={{minHeight: '335px', backgroundColor: '#fff', borderRadius: '8px'}} className='d-flex align-items-center justify-content-center h-100 w-100'>
                      <div className="text-center">
                            <Image
                                src={require('@/assets/img/no_record_found.svg')} alt="" width="100" height="100"
                            />
                            <p className='pt-3 m-0'>{t('no_data_available')}</p>
                      </div>
                   </div>)
              }
              
              </div>
            </div>
            {event_orders !== null && event_orders?.data?.length > 0  && <div className='d-flex justify-content-end align-items-center pt-3'>
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
            <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                <button onClick={handleToggle} className={`ebs-btn-dropdown btn-select ${toggoleLimited ? "ebs-active" : ''}`}>
                  {limit} <i className="material-symbols-outlined">expand_more</i>
                </button>
                <div className={`ebs-dropdown-menu`}>
                  <button className="dropdown-item" onClick={(e)=> { handleLimitChange(e, 10);  }}>10</button>
                  <button className="dropdown-item" onClick={(e)=> { handleLimitChange(e, 20);  }}>20</button>
                  <button className="dropdown-item" onClick={(e)=> { handleLimitChange(e, 100); }}>100</button>
                  <button className="dropdown-item" onClick={(e)=> { handleLimitChange(e, 500);  }}>500</button>
                </div>
              </div>
            </div>}

      </>
      : null}
      
    </>
  );
}
