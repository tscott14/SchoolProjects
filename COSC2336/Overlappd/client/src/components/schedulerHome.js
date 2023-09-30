import React from 'react'
import {useLocation} from "react-router-dom";
import Scheduler from './scheduler'

const SchedulerHome = () => {
    const { state } = useLocation();
    const {title, hours, percent} = state



  return (
    <div>
        <Scheduler title={title} hours={hours} percent={percent} />
        <div className="scheduler-info">
        </div>
        
    

        
    </div>
    

  )
}

export default SchedulerHome