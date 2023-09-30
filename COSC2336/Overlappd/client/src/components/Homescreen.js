import React, {useState, useEffect} from 'react';
import CreateRoom from './createRoomModal';
import JoinRoom from './joinRoomModal'
import addSchedule from '../components/img/newSchedule.svg'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails } from '../features/authSlice'





const Homescreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isError, isSuccess, message } = useSelector(
		(state) => state.auth
	)

    //checks for token not working how I want it to but it is still functioning
    useEffect(() => {

        if(localStorage.getItem('overlappdToken')){
            //dispatch(getUserDetails(localStorage.getItem('overlappdToken')))
            if(!localStorage.getItem('overlappdUser')){
                navigate('/login')
            }
            
        }else{
            navigate('/login')
        }
    }, [user, isError, isSuccess, message, navigate, dispatch ])

  const [openModal, setOpenModal] = useState(false)
  const [openRoomModal, setOpenRoomModal] = useState(false)


  
  return (
    <div>
        <div className='header-text'>
            <h2>Hosting</h2>
        </div>
        <div>
            <img 
            className = "new-schedule-image" 
            src={addSchedule} 
            alt="Add a schedule" 
            onClick={() => setOpenModal(true)}
            />
            <CreateRoom onClose={()=> setOpenModal(false)} open={openModal}/>

        </div>
        <div className='page-divider'></div>
        <div className='header-text'>
            <h2>Participating</h2>
        </div>
        <div>
            <img 
            className = "new-schedule-image" 
            src={addSchedule} alt="Add a schedule" 
            onClick={() => setOpenRoomModal(true)}/>
            <JoinRoom onClose={()=> setOpenRoomModal(false)} open={openRoomModal}/>
        </div>
        

    </div>
  )
}

export default Homescreen