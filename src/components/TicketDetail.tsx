"use client"
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Countdown from './CountDownSmall';

const TicketDetail = ({handleClose, form_stats }: any) => {
  const _container = React.useRef<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFormStats, setFilteredFormStats] = useState(form_stats);

  useEffect(() => {
    if(searchQuery !== ''){
        setFilteredFormStats(form_stats.filter((item:any)=>(item.attendee_type.attendee_type.toLowerCase().includes(searchQuery.toLowerCase()))))
    }else{
      setFilteredFormStats(form_stats);
    }
  
    
  }, [searchQuery])
  
  return (
    <div ref={_container} style={{overflow: 'hidden'}} className="ebs-modal-wrapper">
      <div className="modal" role="dialog">
        <div className="modal-dialog ebs-modal-tickets" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <h3 className='d-flex align-items-center' style={{marginRight: 'auto'}}> <span className='material-symbols-outlined pr-2' onClick={() => handleClose('close')}>arrow_back</span> Tickets details</h3>
                <input style={{marginRight: 0}} type="text" className="ebs-search-area" placeholder="Search" value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)} />
              </div>
              <div className="ebs-grid-ticket-wrapper">
                <div className="d-flex ebs-grid-ticket-row ebs-grid-ticket-header">
                  <div className="ebs-box-1"><strong>Form </strong></div>
                  <div className="ebs-box-2"><strong>Tickets Sold </strong></div>
                  <div className="ebs-box-2"><strong>Tickets Left </strong></div>
                  <div className="ebs-box-2"><strong>Total tickets </strong></div>
                  <div className="ebs-box-2 text-center"><strong>Time left</strong></div>
                </div>
                <div style={{maxHeight: _container?.current?.offsetHeight - 300}} className="ebs-grid-ticket-scroll">
                  {filteredFormStats.length > 0 && filteredFormStats.map((item:any, i:any) => <div key={i} className="d-flex ebs-grid-ticket-row">
                    <div className="ebs-box-1"><p>{item.attendee_type.attendee_type}</p></div>
                    <div className="ebs-box-2"><p>{item.tickets_sold}</p></div>
                    <div className="ebs-box-2"><p>{item.tickets_left}</p></div>
                    <div className="ebs-box-2"><p>{item.total_tickets}</p></div>
                    <div className="ebs-box-2 text-center"><p>
                        {item.eventsite_settings.registration_end_date !== "0000-00-00 00:00:00" ? <Countdown date={moment(item.eventsite_settings.registration_end_date)} /> : '00:00:00:00'}
                      </p></div>
                  </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail;