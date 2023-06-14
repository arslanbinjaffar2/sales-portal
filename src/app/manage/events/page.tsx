"use client"; // this is a client component
import Dropdown from '@/components/DropDown';
import { useState, useEffect } from "react";
import Image from 'next/image';
import AlertMessage from '@/components/forms/alerts/AlertMessage';
import Loader from '@/components/forms/Loader';
import { useRouter } from 'next/navigation';
import Pagination from "@/components/pagination";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState, store } from "@/redux/store/store";
import { EventService } from "@/services/event/event-service"
import { EventAction } from "@/actions/event/event-action"
import { GeneralAction } from "@/actions/general-action"


// const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function Dashboard() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const reduxStore = useAppSelector((state: RootState) => state);
    const alert:any = reduxStore.alert;
    const authUser = reduxStore.authUser.user;
    const [isLoading, setIsLoading] = useState(false);
    const events: [] = reduxStore.events;
    // const pagination:any = reduxStore.paginate;
    // const currentPage: number = pagination.current_page;
    // const totalPages: number = pagination.total_pages;
    // const isLoading: boolean = reduxStore.loading;

    const [eventsRequestData, setEventsRequestData] = useState({search_text: '', event_action: 'name', sort_by: '', order_by: ''});


    useEffect(() => {
        dispatch(GeneralAction.loading(true));
        // check user un-authUserenticated and redirect to sign-in
        console.log(authUser);
        (authUser !== null) ? router.push('auth/login') : handleFetchEventData(eventsRequestData);

        dispatch(GeneralAction.loading(false));
    }, []);


    const handleSearchTextFilter = (e:any) => {
        const {value} = e.target;
        const eventsRequestDataUpdate = eventsRequestData;
        eventsRequestDataUpdate.search_text = value;
        // Update the requestData state with the modified array
        setEventsRequestData(eventsRequestDataUpdate);
        handleFetchEventData(eventsRequestData);
    }


    const handleFilterByFilter = (e:any) => {
        const eventsRequestDataUpdate = eventsRequestData;
        eventsRequestDataUpdate['event_action'] = e.value;
        // Update the requestData state with the modified array
        setEventsRequestData(eventsRequestDataUpdate);
        handleFetchEventData(eventsRequestData);
    }


    const handleSortByFilter = (e:any) => {
        const eventsRequestDataUpdate = eventsRequestData;
        eventsRequestDataUpdate['sort_by'] = e.value;
        // Update the requestData state with the modified array
        setEventsRequestData(eventsRequestDataUpdate);
        handleFetchEventData(eventsRequestData);
    }


    const handleFetchEventData = (requestData:any, currentPage:number = 1) => {
        try {
            setIsLoading(true);
            EventService.listing(requestData, currentPage)
                .then((response:any) => {
                    if (response.message === 'UnauthUserenticated.') { // handle unauthUserenticated response
                        store.dispatch({ type: "error", title: 'authUserentication error', message: 'UnauthUserenticated, please login again' });
                        return router.push('authUser/login');
                    }
                    if (response.success && response.data) { // success response
                        store.dispatch({ type: "events-info", events: response.data.events });
                        store.dispatch(GeneralAction.updatePaginate('pagination', response.data.paginate));
                        setIsLoading(false);
                    } else { // error response
                        store.dispatch({ type: "events-info", events: [] });
                        store.dispatch({ type: "error", title: response.title, message: response.message });
                        setIsLoading(false);
                    }
                });
        } catch (error:any) {
            setIsLoading(false);
            store.dispatch({ type: "error", title: 'Exception', message: 'Something went wrong, please try again' });
        }
    }


    const routeEventOrders  = (eventInfo:any) => {
        dispatch(GeneralAction.loading(false));
        dispatch({type: 'event-info', event: eventInfo});
        store.dispatch({ type: "error", title: 'Exception', message: 'Something went wrong, please try again' });
        router.push('/manage/event/orders');
    }


    const handlePageChange = (page: number) => {
        // Perform API call or update data based on the new page
        handleFetchEventData(eventsRequestData, page);
    };


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
                    {alert && (
                      <AlertMessage
                          className={ `alert ${alert.class}` }
                          icon= {alert.success ? "check" : "info"}
                          title= {alert.title}
                          content= {alert.message}
                      />
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
                                                <Image
                                                    src={require('@/assets/img/logo.svg')} alt="" width="200" height="29"
                                                    className='logos'
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="right-top-header">
                                            <input className="search-field" name="search_text" type="text" placeholder="Search" value={eventsRequestData.search_text} onChange={handleSearchTextFilter} />
                                            <label className="label-select-alt">
                                                <Dropdown
                                                    selected={eventsRequestData.event_action} onChange={handleFilterByFilter}
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
                                                <Dropdown
                                                    selected={eventsRequestData.sort_by} onChange={handleSortByFilter}
                                                    label="Sort by"
                                                    listitems={[
                                                        {id: 'name', name: "Event name"},
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
                                    <>
                                        {
                                            events.length > 0 ? (
                                                events.map((item: any, key: any) =>
                                                    <div key={key}
                                                         className="d-flex align-items-center ebs-table-content"
                                                         onClick={() => routeEventOrders(item)}>
                                                        <div className="ebs-table-box ebs-box-1">
                                                            <Image
                                                                src={item.header_logo ? (`${process.env.stageImageHost + '/' + item.header_logo}`) : require('@/assets/img/logo-placeholder.png')}
                                                                alt="" width={100} height={34}/>
                                                        </div>
                                                        <div className="ebs-table-box ebs-box-2"><p>{item.name}</p>
                                                        </div>
                                                        <div className="ebs-table-box ebs-box-3">
                                                            <p>{item.start_date + ' - ' + item.end_date}</p></div>
                                                        <div className="ebs-table-box ebs-box-4">
                                                            <p>{item.organizer_name}</p></div>
                                                        <div className="ebs-table-box ebs-box-4">
                                                            <p>{item.organizer_name}</p></div>
                                                        <div className="ebs-table-box ebs-box-4">
                                                            <p>{item.event_stats.tickets_left}</p></div>
                                                        <div className="ebs-table-box ebs-box-5">
                                                            <p>{item.event_stats.total_tickets}</p></div>
                                                        <div className="ebs-table-box ebs-box-5">
                                                            <p>{item.sale_agent_stats.tickets_sold}</p></div>
                                                        <div style={{paddingRight: 0}}
                                                             className="ebs-table-box ebs-box-5">
                                                            <p>{item.sale_agent_stats.revenue}</p></div>
                                                        <div style={{textAlign: 'right'}}
                                                             className="ebs-table-box ebs-box-4 text-right">
                                                            <p>{item.sale_agent_stats.revenue}{(item.currency) ? item.currency : 'DKK'}</p>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                !isLoading && (<div><p> No data available</p></div>)
                                            )
                                        }
                                    </>
                                </div>
                                {/* Render the pagination component */}
                                <div>
                                    {/* <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}