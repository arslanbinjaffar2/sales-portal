"use client"; // this is a client component
import Dropdown from '@/app/components/DropDown';
import { useState, useEffect } from "react";
import Image from 'next/image';
import AlertMessage from '@/app/components/forms/alerts/AlertMessage';
import Loader from '@/app/components/forms/loader';
import { useRouter } from 'next/navigation';
// const localStorage = window.localStorage;


// const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];
const agentEventEndpoint = `${process.env.serverHost}/api/v1/sales/agent/events`;

// attempt sales-agent login using credentials
function fetchAgentEvents(requestData:any, token:any) {
    return fetch(agentEventEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
      .then(data => data.json())
}


export default function Dashboard() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertContent, setAlertContent] = useState({type: '', title: '', message: ''});
    const [eventsRequestData, setEventsRequestData] = useState({search_text: '', event_action: 'name', sort_by: '', order_by: ''});
    const [responseData, setEventResponseData] = useState({success: false, title: '', message: '', data: {}});
    const router = useRouter();
    const [events, setEvents] = useState([]);


    useEffect(() => {
        setAccessToken(localStorage.getItem('accessToken'));
        if (!accessToken || accessToken == 'undefined') {
            return router.push('auth/login');
        }
        // fetch and populate page data
        handleFetchEventData(eventsRequestData);
    }, []);


    // Function to show the alert message
    const showAlert = (type = '', title = '', message = '') => {
        setAlertContent({type: type, title: title, message: message});
        setIsAlertVisible(true);
        // Hide the alert after 3 seconds (adjust the delay as needed)
            setTimeout(() => {
                setAlertContent({type: '', title: '', message: ''});
                setIsAlertVisible(false);
      }, 3000);
    };


    const handleSearchTextFilter = (event:any) => {
        const {value} = event.target;
        const eventsRequestDataUpdate = eventsRequestData;
        eventsRequestDataUpdate.search_text = value;
        // Update the requestData state with the modified array
        setEventsRequestData(eventsRequestDataUpdate);
        handleFetchEventData(eventsRequestData);
    }


    const handleFilterByFilter = (event:any) => {
        const eventsRequestDataUpdate = eventsRequestData;
        eventsRequestDataUpdate['event_action'] = event.value;
        // Update the requestData state with the modified array
        setEventsRequestData(eventsRequestDataUpdate);
        handleFetchEventData(eventsRequestData);
    }


    const handleSortByFilter = (event:any) => {
        const eventsRequestDataUpdate = eventsRequestData;
        eventsRequestDataUpdate['sort_by'] = event.value;
        // Update the requestData state with the modified array
        setEventsRequestData(eventsRequestDataUpdate);
        handleFetchEventData(eventsRequestData);
    }


  const handleFetchEventData = (requestData:any) => {
        try {
            setIsLoading(true);
            fetchAgentEvents(requestData, accessToken)
            .then(response => {
                if (response.message === 'Unauthenticated') { // handle unauthenticated response
                    showAlert('error', 'Error', 'Unauthenticated');
                    return router.push('auth/login');
                }

                if (response.success && response.data) { // success response
                    setEventResponseData({
                          success: response.success,
                          title: 'Success',
                          message: response.message,
                          data: response.data
                    }); // update responseData constant
                    setIsLoading(false);
                    setEvents(response.data.agent_events.events);
                } else { // error response
                    setEventResponseData({
                        success: response.success,
                        title: 'Error',
                        message: response.message,
                        data: response.data
                    }); // update responseData constant
                    setIsLoading(false);
                    showAlert('error', response.title, response.message);
                }
            });
        } catch (error) {
            setIsLoading(false);
            showAlert('error', 'Error', 'Something went wrong, please try again')
        }
  }


  return (
      <>
        <header className="header">
          {/* loader */}
          {isLoading && (
              <Loader className='' fixed='' />
          )}
          {/* /. loader */}
          <div className="container">
            {/* Alert */}
            {isAlertVisible && (
                <AlertMessage className={ `alert ${alertContent.type === 'success' ? 'alert-success' : 'alert-danger'}` }
                              icon= {alertContent.type === 'success' ? "check" : "info"}
                              title= {alertContent.title}
                              content= {alertContent.message} />
            )}
            {/* /. Alert */}
            <div className="row bottom-header-elements">
              <div className="col-8">
              </div>
              <div className="col-4 d-flex justify-content-end">
                <ul className="main-navigation">
                  <li>Irfan Danish <i className="material-icons">expand_more</i>
                    <ul>
                      <li><a href="">My account</a></li>
                      <li><a href=""> Change password</a></li>
                      <li><a href="">Logout</a></li>
                    </ul>
                  </li>
                  <li>English <i className="material-icons">expand_more</i>
                    <ul>
                      <li><a href="">English</a></li>
                      <li><a href=""> Danish</a></li>
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
                          <Image src={require('@/app/assets/img/logo.svg')} alt="" width="200" height="29"
                                 className='logos'/>
                        </a>
                      </div>
                    </div>
                    <div className="col-8">
                        <div className="right-top-header">
                          <input className="search-field" name="search_text" type="text" placeholder="Search" value={eventsRequestData.search_text} onChange={handleSearchTextFilter} />
                          <label className="label-select-alt">
                            <Dropdown selected={eventsRequestData.event_action} onChange={handleFilterByFilter}
                                label="Filter by"
                                listitems={[
                                  {id: 'active_future', name: "Active and future events"},
                                  {id: 'active', name: "Active events"},
                                  {id: 'future', name: "Future events"},
                                  {id: 'expired', name: "Expired events"},
                                  {id: 'name', name: "All events"}
                                ]}
                            />
                          </label>
                          <label className="label-select-alt">
                            <Dropdown selected={eventsRequestData.sort_by} onChange={handleSortByFilter}
                                label="Sort by"
                                listitems={[
                                  {id: 'event_name', name: "Event name"},
                                  {id: 'organizer_name', name: "Organizer name"},
                                  {id: 'start_date', name: "Start date"},
                                  {id: 'end_date', name: "End date"}
                                ]}
                            />
                          </label>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="main-data-table">
                  <div className="ebs-data-table">
                    <div className="d-flex align-items-center ebs-table-header">
                      <div className="ebs-table-box ebs-box-1"><strong>Event Logo</strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>Event Name <i
                          className="material-icons">unfold_more</i></strong></div>
                      <div className="ebs-table-box ebs-box-3"><strong>Event Date</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Created by</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Organized by</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Tickets Left</strong></div>
                      <div className="ebs-table-box ebs-box-5"><strong>Sold Tickets</strong></div>
                      <div className="ebs-table-box ebs-box-5"><strong>Total Tickets</strong></div>
                      <div style={{paddingRight: 0}} className="ebs-table-box ebs-box-5"><strong>My Sold
                        Tickets</strong></div>
                      <div style={{textAlign: 'right'}} className="ebs-table-box ebs-box-4 text-right"><strong
                          style={{justifyContent: 'flex-end'}}>My Revenue</strong></div>
                    </div>
                      {
                          events.length > 0 ? (
                              events.map((item:any, key:any) =>
                                  <div key={key} className="d-flex align-items-center ebs-table-content">
                                      <div className="ebs-table-box ebs-box-1">
                                          <Image src={require('@/app/assets/img/logo-placeholder.png')} alt="" width={100}
                                                 height={34}/>
                                      </div>
                                      <div className="ebs-table-box ebs-box-2"><p>{ item.name }</p></div>
                                      <div className="ebs-table-box ebs-box-3"><p>{ item.start_date+' - '+item.end_date }</p></div>
                                      <div className="ebs-table-box ebs-box-4"><p>{ item.organizer_name }</p></div>
                                      <div className="ebs-table-box ebs-box-4"><p>{ item.organizer_name }</p></div>
                                      <div className="ebs-table-box ebs-box-4"><p>{ item.event_stats.tickets_left }</p></div>
                                      <div className="ebs-table-box ebs-box-5"><p>{ item.event_stats.total_tickets }</p></div>
                                      <div className="ebs-table-box ebs-box-5"><p>{ item.sale_agent_stats.tickets_sold }</p></div>
                                      <div style={{paddingRight: 0}} className="ebs-table-box ebs-box-5"><p>{ item.sale_agent_stats.revenue }</p></div>
                                      <div style={{textAlign: 'right'}} className="ebs-table-box ebs-box-4 text-right"><p>{ item.sale_agent_stats.revenue }DKK</p></div>
                                  </div>
                              )
                          ) : (
                              !isLoading && ( <p> No data available</p> )
                          )
                      }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
  );
}