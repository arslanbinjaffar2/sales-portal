"use client"; // this is a client component
import Dropdown from '@/app/components/DropDown';
import { useState } from "react";
import Image from 'next/image';
import Illustration from '@/app/assets/img/illustration.png'
import AlertMessage from '@/app/components/forms/alerts/AlertMessage';
import Loader from '@/app/components/forms/loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];
const agentEventEndpoint = `${process.env.serverHost}/api/v1/sales/agent/events`;


// attempt sales-agent login using credentials
function fetchAgentEvents(requestData:any) {
  return fetch(agentEventEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
      .then(data => data.json())
}


export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState(true)
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState({type: '', title: '', message: ''});
  const [responseData, setResponseData] = useState({success: false, title: '', message: '', data: {}});
  const router = useRouter();


  const handleShowPass = (e: any) => {
    e.stopPropagation();
    setPasswordType(!passwordType)
  }


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


  const handleSubmit = (e: any) => {
    // e.preventDefault();
    // e.stopPropagation();
    try {
      return console.log(e);
      setIsLoading(true);
      fetchAgentEvents({email, password, remember})
          .then(response => {
            if (response.success) {
              setResponseData({
                success: response.success,
                title: 'Success',
                message: response.message,
                data: response.data
              }); // update responseData constant
              localStorage.setItem('accessToken', response.data.access_token);
              setIsLoading(false);
              router.push('/manage/events');  // redirect to (agent events)
            } else {
              setResponseData({
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
      showAlert('error', responseData.title, responseData.message)
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
                      <form name="agentEventsForm" role="" onSubmit={handleSubmit}>
                        <div className="right-top-header">
                          <input className="search-field" name="query" type="text" placeholder="Search" value=""/>
                          <label className="label-select-alt">
                            <Dropdown
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
                            <Dropdown onChange={(e:any) => handleSubmit(e)}
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
                        </div>
                      </form>
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
                    {[...Array(10)].map(item =>
                        <div key={item} className="d-flex align-items-center ebs-table-content">
                          <div className="ebs-table-box ebs-box-1">
                            <Image src={require('@/app/assets/img/logo-placeholder.png')} alt="" width={100}
                                   height={34}/>
                          </div>
                          <div className="ebs-table-box ebs-box-2"><p>Parent event leadevent 2.</p></div>
                          <div className="ebs-table-box ebs-box-3"><p>30/09/23 - 02/10/23</p></div>
                          <div className="ebs-table-box ebs-box-4"><p>Eventorg</p></div>
                          <div className="ebs-table-box ebs-box-4"><p>Mr Creig</p></div>
                          <div className="ebs-table-box ebs-box-4"><p>3</p></div>
                          <div className="ebs-table-box ebs-box-5"><p>5</p></div>
                          <div className="ebs-table-box ebs-box-5"><p>20</p></div>
                          <div style={{paddingRight: 0}} className="ebs-table-box ebs-box-5"><p>25</p></div>
                          <div style={{textAlign: 'right'}} className="ebs-table-box ebs-box-4 text-right">
                            <p>43128DKK</p></div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
  );

}
