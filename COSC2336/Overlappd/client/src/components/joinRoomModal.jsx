import React from 'react';
import { useState } from 'react';



const joinRoomModal = ({open, onClose}) => {
    if (!open) return null
    return (
        <div className = "overlay">
          <div className = "modalContainer">
            <div className="modalContent">
            <div className='input-labels'>
                    <label>Enter Room Code</label>
            </div>
            <div className='modal-input'>
                <input
                    className='modal-form-control'
                    type="number"
                    placeholder='Room Code'
                    //onChange={(e) => setEmail(e.target.value)} Insert hook here to grab

                />
            </div>
            <div className="modalBtnContainer">
              <button onClick={onClose} className="button-control">
                Create Meeting
              </button>
              <button onClick={onClose} className="button-control">  
                Close
              </button>
            </div>
            </div>


          </div>
        </div>
    )
}

export default joinRoomModal