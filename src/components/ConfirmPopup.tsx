"use client"
import { useTranslations } from 'next-intl';
import React from 'react'

const ConfirmPopup = ({handleClose, processing}: any) => {
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
              <button onClick={() => handleClose('continue')} type="button" className="btn btn-primary">{processing ? 
                <div className="small-loader-wrapper">
                    <div className="small-loader"></div>
                </div>
               : "Continue"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPopup;