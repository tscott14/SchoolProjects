import { configureStore } from '@reduxjs/toolkit'

import scheduleReducer from '../features/schedule/scheduleSlice'
import userReducer from '../features/user/userSlice'
import authReducer from '../features/authSlice'

export default configureStore({
  reducer: {
    schedule: scheduleReducer,
    user: userReducer,
    auth: authReducer,
  }
})

