'use client'
import React, {useEffect, useState} from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import {RootState} from "@/redux/store/store";
import { userEventOrders } from '@/redux/store/slices/EventSlice';
import Loader from '@/components/forms/Loader';


export default function OrderListing({ params }: { params: { event_id: string } }) {
  const dispatch = useAppDispatch();
  const {loading, event} = useAppSelector((state: RootState) => state.event);

  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const promise = dispatch(userEventOrders({event_id:params.event_id}));  
  
    return () => {
      promise.abort();
    }
  }, []);
  

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
    e.target.classList.toggle('ebs-active');
  }


  return (
    <>
     {(loading === false && event !== null) ?
     <>
     <header className="header">
        <div className="container">
          <div className="row bottom-header-elements">
            <div className="col-8">
              <div className="ebs-bottom-header-left">
                <p>
                  <a href="#!">
                    <i className="material-icons">arrow_back</i> Return to list
                  </a>
                </p>
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
            <div className="col-4 d-flex justify-content-end">
              <ul className="main-navigation">
                <li>
                  Irfan Danish <i className="material-icons">expand_more</i>
                  <ul>
                    <li>
                      <a href="">My account</a>
                    </li>
                    <li>
                      <a href=""> Change password</a>
                    </li>
                    <li>
                      <a href="">Logout</a>
                    </li>
                  </ul>
                </li>
                <li>
                  English <i className="material-icons">expand_more</i>
                  <ul>
                    <li>
                      <a href="">English</a>
                    </li>
                    <li>
                      <a href=""> Danish</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
       <main className="main-section" role="main">
        <div className="container">
          <div className="wrapper-box">
            <div className="container-box main-landing-page">
              <div className="top-landing-page">
                <div className="row d-flex">
                  <div className="col-4">
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
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="right-top-header">
                      {event?.payment_settings?.eventsite_billing === 1 ? <button className="btn btn-default">
                        <i className="material-symbols-outlined">add</i> Create Order
                      </button> : null}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: "#fff" }} className="main-data-table">
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
                        <strong>00:00:00:00</strong>
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
                        <input type="text" className="ebs-search-area" defaultValue="Search" />
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label="Select type"
                            listitems={[
                              { id: "active_future", name: "Active and future events" },
                              { id: "active", name: "Active events" },
                              { id: "future", name: "Future events" },
                              { id: "expired", name: "Expired events" },
                              { id: "name", name: "All events" },
                            ]}
                          />
                        </label>
                      </div>
                      <div className="col-7 d-flex justify-content-end align-items-center">
                        <button className="btn-full-screen">
                          <Image src={require("@/assets/img/ico-fullscreen.svg")} alt="" width="27" height="28" />
                        </button>
                        <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                          <button onClick={handleToggle} className="ebs-btn-dropdown btn-select">
                            {limit} <i className="material-symbols-outlined">expand_more</i>
                          </button>
                          <div className="ebs-dropdown-menu">
                            <button className="dropdown-item" onClick={(e)=> { setLimit(10); handleToggle(e); }}>10</button>
                            <button className="dropdown-item" onClick={()=> { setLimit(20); }}>20</button>
                            <button className="dropdown-item" onClick={()=> { setLimit(100); }}>100</button>
                            <button className="dropdown-item" onClick={()=> { setLimit(500); }}>500</button>
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
                    {[event].map((item, key) =>
                    <div key={key} className="d-flex align-items-center ebs-table-content">
                      <div className="ebs-table-box ebs-box-1"><p>{key}</p></div>
                      <div className="ebs-table-box ebs-box-1"><p>12/04/2022</p></div>
                      <div className="ebs-table-box ebs-box-2"><p>Mudassir Umer Reg</p></div>
                      <div className="ebs-table-box ebs-box-2"><p>sales_info@mail.com</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>Ab Tech</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>1</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>52315 DKK</p></div>
                      <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><p>Pending</p></div>
                      <div className="ebs-table-box ebs-box-2 d-flex justify-content-end">
                        <ul className='d-flex ebs-panel-list m-0'>
                          <li>
                            <button className='ebs-btn-panel'>
                              <Image
                                src={require("@/assets/img/ico-edit.svg")}
                                alt=""
                                width="12"
                                height="12"
                              />
                            </button>
                          </li>
                          <li>
                            <button className='ebs-btn-panel'>
                              <Image
                                src={require("@/assets/img/ico-folder.svg")}
                                alt=""
                                width="12"
                                height="12"
                              />
                            </button>
                          </li>
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
                              <button onClick={handleToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                                <i className="material-icons">more_horiz</i>
                              </button>
                              <div style={{minWidth: 130}} className="ebs-dropdown-menu">
                                <button className="dropdown-item">View</button>
                                <button className="dropdown-item">Print Badge</button>
                                <button className="dropdown-item">Download </button>
                                <button style={{borderTop: '1px solid #F2F2F2'}} className="dropdown-item">Download as Invoice</button>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </>
      : null}
      {loading && <Loader className=''fixed='' />}
      {loading === false && event === null ? 
      <div>
        No event found..
      </div> : null }
    </>
  );
}