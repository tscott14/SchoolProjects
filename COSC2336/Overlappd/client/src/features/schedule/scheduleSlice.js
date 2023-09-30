import { createSlice } from '@reduxjs/toolkit'

export const scheduleSlice = createSlice({
  name: 'schedule', //this is important for redux toolkit, don't change
  initialState: {
    scheduleName: '', //this is the name of the schedule given by user when they first create one. for example, "DnD" or "Work" would go here
    users: 4,
    schedule: [
        [0, 0, 0, 0, 0, 0, 0], //8-9am, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //9-10am, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //10-11am, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //11-12pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //12-1pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //1-2pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //2-3pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //3-4pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //4-5pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //5-6pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //6-7pm, Mon-Sun
        [0, 0, 0, 0, 0, 0, 0], //7-8pm, Mon-Sun
    ]
  },  
  reducers: {
    incrementUsers: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.users += 1
    },
    decrementUsers: state => {
      state.users -= 1
    },
    incrementSchedule: (state, action) => {
      let x = action.payload.x
      let y = action.payload.y 
      state.schedule[x][y] += 1
    },
    decrementSchedule: (state, action) => {
        let x = action.payload.x
        let y = action.payload.y 
        state.schedule[x][y] -= 1
    }
  }
})

// Action creators are generated for each case reducer function
export const { incrementUsers, decrementUsers, incrementSchedule, decrementSchedule } = scheduleSlice.actions

export default scheduleSlice.reducer