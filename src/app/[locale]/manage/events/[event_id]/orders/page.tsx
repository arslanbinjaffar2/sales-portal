'use client'
import React, {useEffect, useMemo, useState} from 'react';
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

const orderFilters = [
  { id: "all", name: "All orders" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
  { id: "pending", name: "Pending" },
  { id: "payment_received", name: "Payment received" },
  { id: "payment_pending", name: "Payment pending" },
];

let ordersRequestDataStored =
    typeof window !== "undefined" && localStorage.getItem("ordersRequestData");
const ordersRequestDataStore =
    ordersRequestDataStored && ordersRequestDataStored !== undefined ? JSON.parse(ordersRequestDataStored) : null;


export default function OrderListing({ params }: { params: { locale:string, event_id: string } }) {
  const t = useTranslations('manage-orders-page');

  const dispatch = useAppDispatch();
  const {loading, event, event_orders, fetching_orders, currentPage, totalPages, form_stats} = useAppSelector((state: RootState) => state.event);

  const [limit, setLimit] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.limit :10);
  const [type, setType] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.type :'all');
  const [sortCol, setSortCol] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.sortCol : 'order_number');
  const [sort, setSort] = useState(ordersRequestDataStore!== null ? ordersRequestDataStore.sort : 'desc');

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [toggoleLimited, settoggoleLimited] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [showPaymentRecievedPopup, setshowPaymentRecievedPopup] = useState(false)
  const [paymentRevcievedOrderId, setPaymentRevcievedOrderId] = useState<null| number>(null)
  const [paymentRevcievedStatusToSet, setPaymentRevcievedStatusToSet] = useState(false)
  const [processingPaymentchange, setProcessingPaymentChange] = useState(false);

  useEffect(()=>{
    let promise:any = '';
    let promise2:any = '';

    if(event !== null){
       promise = dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, sort:sort, sort_col:sortCol}));  
       promise2 = dispatch(userEventFormStats({event_id:params.event_id, searchText, limit, type, sort:sort, sort_col:sortCol}));  
    
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
    storeEventRequestData({searchText:value, limit, type, page:1, sort:sort, sort_col:sortCol});
    dispatch(userEventOrders({event_id:params.event_id, searchText:value, limit, type, page:1, sort:sort, sort_col:sortCol}));
    setPage(1);

  }

    const handleFilterByFilter = (e:any) => {
        setType(e.value);
        storeEventRequestData({ searchText, limit, type:e.value, page:1, sort:sort, sort_col:sortCol});
        dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type:e.value, page:1, sort:sort, sort_col:sortCol}));
        setPage(1);
    }

    const handleLimitChange = (e:any, value:any) => {
      setLimit(value); 
      handleToggle(e);
      storeEventRequestData({ searchText, limit:value, type, page:1, sort:sort, sort_col:sortCol});
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit:value, type, page:1, sort:sort, sort_col:sortCol}));
      setPage(1);
    }

    const handleRowControlsToggle = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.toggle('ebs-active');
    }

    const handlePageChange = (page: number) => {
      setPage(page);
      storeEventRequestData({ searchText, limit, type, page, sort:sort, sort_col:sortCol});
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort:sort, sort_col:sortCol}));
    };
    
    const handleSortChange = (sort:string, sortCol: string) => {
      setSort(sort);
      setSortCol(sortCol);
      storeEventRequestData({ searchText, limit, type, page, sort:sort, sort_col:sortCol});
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort:sort, sort_col:sortCol}));
    };
    
    const handleShowPaymentChangePopup = (order_id:number, payment_status:boolean) => {
      setshowPaymentRecievedPopup(true);
      setPaymentRevcievedOrderId(order_id);
      setPaymentRevcievedStatusToSet(payment_status);
    };
    
    const closeShowPaymentChangePopup = async (type:string) => {
      if(paymentRevcievedOrderId !== null && type === 'continue'){
        setProcessingPaymentChange(true);
        try {
          const res = await dispatch(userEventOrderChangePymentStatus({order_id:paymentRevcievedOrderId, payment_status:paymentRevcievedStatusToSet ? 1 : 0 })).unwrap();
          setshowPaymentRecievedPopup(false);
          setPaymentRevcievedOrderId(null);
          setPaymentRevcievedStatusToSet(paymentRevcievedStatusToSet);
          dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort, sort_col:sortCol}));
          
        } catch (error) {
          setshowPaymentRecievedPopup(false);
          setPaymentRevcievedOrderId(null);
          setPaymentRevcievedStatusToSet(paymentRevcievedStatusToSet);
          dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type, page, sort, sort_col:sortCol}));
        }
        setProcessingPaymentChange(false);

      }else{
        setshowPaymentRecievedPopup(false);
        setPaymentRevcievedOrderId(null);
        setPaymentRevcievedStatusToSet(paymentRevcievedStatusToSet);
      }
    };

    const downloadPdf = async (data:any) => {
      try {
          const response = await axios.get(`${AGENT_ENDPOINT}/billing/send-order-pdf/${data.id}`,  {
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
                  <div className="ebs-ticket-box">
                    <button onClick={() => setToggle(true)} className='btn'><em className="material-symbols-outlined">local_activity</em></button>
                  </div>
                  <div className="ebs-ticket-box">
                    <strong>{event?.event_stats?.tickets_sold}</strong>
                    <span>{t('stats_sold_tickets')}</span>
                  </div>
                  <div className="ebs-ticket-box">
                        <strong>{event?.sales_agent_stats?.tickets_sold}</strong>
                        <span>{t('stats_my_sold_tickets')}</span>
                    </div>
                  <div className="ebs-ticket-box">
                    <strong>{event?.sales_agent_stats?.revenue}</strong>
                    <span>
                    {t('stats_my_revenue')} <small>(DKK)</small>
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
                    <input type="text" className="ebs-search-area" placeholder="Search" onKeyUp={(e) => { e.key === 'Enter' ? handleSearchTextFilter(e): null}} value={searchText} onChange={(e)=>{setSearchText(e.target.value)}} />
                    <label style={{ width: "210px" }} className="label-select-alt">
                      <Dropdown
                        label="Select type"
                        selected={type} 
                        onChange={handleFilterByFilter}
                        selectedlabel={getSelectedLabel(orderFilters,type)}
                        listitems={orderFilters}
                      />
                    </label>
                  </div>
                </div>
              </div>
              {showPaymentRecievedPopup ? <ConfirmPopup handleClose={closeShowPaymentChangePopup} processing={processingPaymentchange} /> : null}
              <div className="ebs-data-table ebs-order-table">
                <div className="d-flex align-items-center ebs-table-header">
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
                {event_orders !== null && event_orders.data.length > 0 ? event_orders.data.map((order:any, key:number) =>
                <div key={order.id} className="d-flex align-items-center ebs-table-content">
                  <div className="ebs-table-box ebs-box-1"><p>{order.order_number}</p></div>
                  <div className="ebs-table-box ebs-box-1"><p>{moment(new Date(order.order_date)).format('DD-MM-YYYY')}</p></div>
                  <div className="ebs-table-box ebs-box-2"><p>{order.order_attendee.first_name} {order.order_attendee.last_name}</p></div>
                  <div className="ebs-table-box ebs-box-2"><p>{order.order_attendee.email}</p></div>
                  <div className="ebs-table-box ebs-box-4"><p>{order.detail.company_name}</p></div>
                  <div className="ebs-table-box ebs-box-4"><p>{order.tickets_sold}</p></div>
                  <div className="ebs-table-box ebs-box-4"><p>{order.grand_total} DKK</p></div>
                  <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}}><p>{order.status}</p></div>
                  <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}}><p onClick={()=>{handleShowPaymentChangePopup(order.id, !order.is_payment_received)}}>{order.is_payment_received ? 'Completed' : 'Pending'}</p></div>
                  <div className="ebs-table-box ebs-box-3 d-flex justify-content-end">
                    <ul className='d-flex ebs-panel-list m-0'>
                      <li>
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
                      </li>
                      <li>

                        <button className='ebs-btn-panel' onClick={(e)=>{ dispatch(userEventOrderDelete({event_id:params.event_id, searchText, limit, type, page, id:order.id}))}}>
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
                            <button className="dropdown-item" onClick={()=> { downloadPdf({id:order.id})}}>{t('download')} </button>
                            <button onClick={()=> { downloadPdf({id:order.id})}} style={{borderTop: '1px solid #F2F2F2'}} className="dropdown-item">{t('download_as_invoice')}</button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>) :
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
            {event_orders !== null && event_orders.data.length > 0  && <div className='d-flex justify-content-end align-items-center pt-3'>
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
                  <button className="dropdown-item" onClick={(e)=> { handleLimitChange(e, 2) }}>2</button>
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