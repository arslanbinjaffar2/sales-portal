"use client"
import React from 'react'

const TicketDetail = ({handleClose}: any) => {
  const _container = React.useRef<any>();
  return (
    <div ref={_container} style={{overflow: 'hidden'}} className="ebs-modal-wrapper">
      <div className="modal" role="dialog">
        <div className="modal-dialog ebs-modal-tickets" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <h3 className='d-flex align-items-center' style={{marginRight: 'auto'}}> <span className='material-symbols-outlined pr-2' onClick={() => handleClose('close')}>arrow_back</span> Tickets details</h3>
                <input style={{marginRight: 0}} type="text" className="ebs-search-area" placeholder="Search" />
              </div>
              <div className="ebs-grid-ticket-wrapper">
                <div className="d-flex ebs-grid-ticket-row ebs-grid-ticket-header">
                  <div className="ebs-box-1"><strong>Form <em className="material-symbols-outlined">unfold_more</em></strong></div>
                  <div className="ebs-box-2"><strong>Tickets Sold <em className="material-symbols-outlined">unfold_more</em></strong></div>
                  <div className="ebs-box-2"><strong>Tickets Left <em className="material-symbols-outlined">unfold_more</em></strong></div>
                  <div className="ebs-box-2"><strong>Total tickets <em className="material-symbols-outlined">unfold_more</em></strong></div>
                  <div className="ebs-box-2 text-center"><strong>Time left</strong></div>
                </div>
                <div style={{maxHeight: _container?.current?.offsetHeight - 300}} className="ebs-grid-ticket-scroll">
                  {[...Array(100)].map((item) => <div key={item} className="d-flex ebs-grid-ticket-row">
                    <div className="ebs-box-1"><p>Attendee form</p></div>
                    <div className="ebs-box-2"><p>16</p></div>
                    <div className="ebs-box-2"><p>25</p></div>
                    <div className="ebs-box-2"><p>19</p></div>
                    <div className="ebs-box-2 text-center"><p>00:00:00:00</p></div>
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