"use client"
import React from 'react'

const ConfirmPopup = ({handleClose}) => {
  return (
    <div className="ebs-modal-wrapper">
      <div className="modal" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h3>Confirmation</h3>
              <p>Are you sure? you want to change status to received.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleClose('close')} type="button" className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleClose('continue')} type="button" className="btn btn-primary">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPopup;