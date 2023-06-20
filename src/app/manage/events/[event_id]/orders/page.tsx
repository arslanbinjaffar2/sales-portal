'use client'
import React, {useEffect, useMemo, useState} from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {RootState} from "@/redux/store/store";
import { userEvent, userEventOrders } from '@/redux/store/slices/EventSlice';
import Loader from '@/components/forms/Loader';
import Countdown from '@/components/Countdown';
import {getSelectedLabel} from '@/helpers'; 
import Link from 'next/link';
import moment from 'moment';

const orderFilters = [
  { id: "all", name: "All orders" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
  { id: "pending", name: "Pending" },
  { id: "payment_received", name: "Payment received" },
  { id: "payment_pending", name: "Payment pending" },
];

export default function OrderListing({ params }: { params: { event_id: string } }) {
  const dispatch = useAppDispatch();
  const {loading, event, event_orders, fetching_orders} = useAppSelector((state: RootState) => state.event);

  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [toggoleLimited, settoggoleLimited] = useState(false)

  const registerDateEnd = useMemo(()=>{
    let currentDate = moment();
    let endDate = moment(event.eventsite_settings.registration_end_date);
    let diff = event.eventsite_settings.registration_end_date !== "0000-00-00 00:00:00" ? currentDate.diff(endDate) < 0 : true;
    return diff;
  },[event]);
  useEffect(()=>{
    let promise:any = '';
    if(event !== null){
       promise = dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type}));  
    
    }
    return () => {
      if(typeof promise === 'object' && typeof promise.then === 'function'){
        promise.abort();
      }
    }
  }, [event])
  

  useEffect(() => {
    // todo, do further logic and API integration
    return console.log({event});
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



  const handleSearchTextFilter = (e:any) => {
    const {value} = e.target;
    setSearchText(value);
    // Update the requestData state with the modified array
    dispatch(userEventOrders({event_id:params.event_id, searchText:value, limit, type}));
  }

    const handleFilterByFilter = (e:any) => {
        setType(e.value);
        dispatch(userEventOrders({event_id:params.event_id, searchText, limit, type:e.value}));
    }

    const handleLimitChange = (e:any, value:any) => {
      setLimit(value); 
      handleToggle(e);
      dispatch(userEventOrders({event_id:params.event_id, searchText, limit:value, type}));
    }

    const handleRowControlsToggle = (e:any) => {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.toggle('ebs-active');
    }


  return (
    <>
     {(loading === false && event !== null) ?
     <>
            <div className="ebs-ticket-section">
              <h4>Tickets</h4>
              <div className="row d-flex">
                <div className="col-10">
                  <div className="row">
                    <div className="col">
                      <div className="ebs-ticket-information">
                        <strong>{event?.event_stats?.tickets_left}</strong>
                        <span>LEFT</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="ebs-ticket-information">
                        <strong>{event?.event_stats?.tickets_sold}</strong>
                        <span>sold</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="ebs-ticket-information">
                        <strong>{event?.event_stats?.total_tickets}</strong>
                        <span>total</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="ebs-ticket-information">
                        <strong>{event?.sales_agent_stats?.tickets_sold}</strong>
                        <span>My Sold Tickets</span>
                      </div>
                    </div>
                    <div className="col">
                      <div className="ebs-ticket-information">
                        <strong>{event?.sales_agent_stats?.revenue}</strong>
                        <span>
                          My Revenue <br />
                          <small>(DKK)</small>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-2">
                  <div className="ebs-time-counter">
                    <strong>
                       {registerDateEnd && (event.eventsite_settings.registration_end_date !== "0000-00-00 00:00:00") ?  <Countdown date={moment(event.eventsite_settings.registration_end_date)} /> : "00:00:00:00"}
                    </strong>
                    <span>Time left</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ebs-order-list-section">
              <div className="ebs-order-header">
                <h4>Orders List</h4>
                <div className="row">
                  <div className="col-5 d-flex">
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
                  <div className="col-7 d-flex justify-content-end align-items-center">
                    <button className="btn-full-screen">
                      <Image src={require("@/assets/img/ico-fullscreen.svg")} alt="" width="27" height="28" />
                    </button>
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
                  </div>
                </div>
              </div>
              <div className="ebs-data-table ebs-order-table">
                <div className="d-flex align-items-center ebs-table-header">
                  <div className="ebs-table-box ebs-box-1"><strong>Order #</strong></div>
                  <div className="ebs-table-box ebs-box-1"><strong>Date</strong></div>
                  <div className="ebs-table-box ebs-box-2"><strong>Name</strong></div>
                  <div className="ebs-table-box ebs-box-2"><strong>Email</strong></div>
                  <div className="ebs-table-box ebs-box-4"><strong>Company</strong></div>
                  <div className="ebs-table-box ebs-box-4"><strong>Sold Ticket</strong></div>
                  <div className="ebs-table-box ebs-box-4"><strong>Revenue</strong></div>
                  <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><strong>Payment STATUS</strong></div>
                  <div className="ebs-table-box ebs-box-2"  />
                </div>
                {event_orders !== null ? event_orders.data.map((order:any, key:number) =>
                <div key={order.id} className="d-flex align-items-center ebs-table-content">
                  <div className="ebs-table-box ebs-box-1"><p>{order.order_number}</p></div>
                  <div className="ebs-table-box ebs-box-1"><p>{order.order_date}</p></div>
                  <div className="ebs-table-box ebs-box-2"><p>{order.order_attendee.first_name} {order.order_attendee.last_name}</p></div>
                  <div className="ebs-table-box ebs-box-2"><p>{order.order_attendee.email}</p></div>
                  <div className="ebs-table-box ebs-box-4"><p>{order.detail.company_name}</p></div>
                  <div className="ebs-table-box ebs-box-4"><p>{order.tickets_sold}</p></div>
                  <div className="ebs-table-box ebs-box-4"><p>{order.grand_total} DKK</p></div>
                  <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><p>{order.is_payment_received ? 'Completed' : 'Pending'}</p></div>
                  <div className="ebs-table-box ebs-box-2 d-flex justify-content-end">
                    <ul className='d-flex ebs-panel-list m-0'>
                      <li>
                      <Link href={`/manage/events/${params.event_id}/orders/${order.id}/edit`} style={{textDecoration:'none'}}>
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
                      {/* <li>
                        <button className='ebs-btn-panel'>
                          <Image
                            src={require("@/assets/img/ico-folder.svg")}
                            alt=""
                            width="12"
                            height="12"
                          />
                        </button>
                      </li> */}
                      <li>

                        <button className='ebs-btn-panel'>
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
                          <Link href={`/manage/events/${params.event_id}/orders/${order.id}/invoice`} style={{textDecoration:'none'}}>
                            <button className="dropdown-item">View</button>
                          </Link>
                            {/* <button className="dropdown-item">Print Badge</button> */}
                            <button className="dropdown-item">Download </button>
                            <button style={{borderTop: '1px solid #F2F2F2'}} className="dropdown-item">Download as Invoice</button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>) :
                (fetching_orders ? <div style={{position:"relative", minHeight:"350px"}}>
                  <Loader className=''fixed='' />
                </div> : 
                <div className='d-flex justify-content-center align-items-center' style={{fontSize:"32px", textAlign:"center", fontStyle:"italic",  minHeight:"350px"}} >
                    No orders found...
                </div>)
              }
              
              </div>
            </div>

      </>
      : null}
      
    </>
  );
}
