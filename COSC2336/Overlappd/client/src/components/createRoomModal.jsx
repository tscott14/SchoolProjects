import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



//Notes: Keep the button in this component, and
//import this component to whatever page needs this
//After that, do all the on change and event changing voode for the input fields here
//as well as a slider(not MUI). Finally, have 2 buttons: "Close" and "Submit", where
//like the form dialog, the close closes the modal, while submit outputs the value{} of
//each one then closes the modal

const Modal = props => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('') 
  const [hours, setHours] = useState('') 
  const [percent, setPercent] = useState('') 
  const [errorMessageTitle, setErrorMessageTitle] = useState("");
  const [errorMessageHours, setErrorMessageHours] = useState("");
  const [errorMessagePercent, setErrorMessagePercent] = useState("");
  const [validTitleEntry, setValidTitleEntry] = useState();
  const [validHoursEntry, setValidHoursEntry] = useState();
  const [validPercentEntry, setValidPercentEntry] = useState();







    if (!props.open) return null


    //this function resets the modal and closes it, so when it is reopened, it is basically a fresh, empty form
    const closeModal = () => {
      setErrorMessageHours('')
      setErrorMessagePercent('')
      setErrorMessageTitle('')
      setTitle('')
      setHours('')
      setPercent('')
      props.onClose()
    }

    const legalInputs = () => {


      if (title == '') {
        setErrorMessageTitle('Cannot have an empty title');
        setValidTitleEntry(false)
      } else{ 
        setErrorMessageTitle('');
        setValidTitleEntry(true)
      }
      if (hours < 1 || hours > 24) {
        setErrorMessageHours('Meeting must be between 1 to 24 hours');
        setValidHoursEntry(false)
      } else {
        setErrorMessageHours('');
        setValidHoursEntry(true)
      }
      if (percent == '' || percent < 0 || percent > 100) {
        setErrorMessagePercent('Minimum percent must be between 0 and 100');
        setValidPercentEntry(false)
      } else {
        setErrorMessagePercent('');
        setValidPercentEntry(true)
      }



      
    }

    if (validTitleEntry && validHoursEntry && validPercentEntry) {
      console.log({title, hours, percent})
      navigate("/schedulerhome", {state: {title: title, hours: hours, percent: percent }})

    }



    return (
        <div className = "overlay">
          <div className = "modalContainer">
            <div className="modalContent">
            </div>
            <div className='input-labels'>
                    <label>What is this meeting for?</label>
            </div>
            <div className='modal-input'>
                <input
                    className='modal-form-control'
                    type="text"
                    placeholder='Enter Meeting Name'
                    onChange={(e) => setTitle(e.target.value)}

                />
            </div>
            <div className='input-labels'>
                    <label>How many hours will your meeting last?</label>
            </div>
            <div className='modal-input'>
                <input
                    className='modal-form-control'
                    type="number"
                    placeholder='Enter Up to 24 hours'
                    onChange={(e) => setHours(e.target.value)}

                />
            </div>
            <div className='input-labels'>
                    <label>What is the minimum attendance percent for your meeting?</label>
            </div>
            <div className='modal-input'>
                <input
                    className='modal-form-control'
                    type="number"
                    placeholder='Enter attendance percent'
                    onChange={(e) => setPercent(e.target.value)}

                />
            </div>
            <div className="modalBtnContainer">
              <button onClick={legalInputs} className="button-control">
                Create Meeting                                          {/*Next task: Store all three inputs to send to next page*/}  
              </button>
              <button onClick={closeModal} className="button-control">  
                Close
              </button>
              

            </div>
            {/*These are error messages that will dynamically appera/dissapear depending on wheter inputs are acceptable */}
            {errorMessageTitle && <div className="error"> {errorMessageTitle} </div>}
            {errorMessageHours && <div className="error"> {errorMessageHours} </div>}
            {errorMessagePercent && <div className="error"> {errorMessagePercent} </div>}


          </div>
        </div>
    )
}

export default Modal