import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    scheduleName: '',
    user: 0,
    schedule: [
      [
        [false, false, false, false, false, false, false], //8-9am, Mon-Sun
        [false, false, false, false, false, false, false], //9-10am, Mon-Sun
        [false, false, false, false, false, false, false], //10-11am, Mon-Sun
        [false, false, false, false, false, false, false], //11-12pm, Mon-Sun
        [false, false, false, false, false, false, false], //12-1pm, Mon-Sun
        [false, false, false, false, false, false, false], //1-2pm, Mon-Sun
        [false, false, false, false, false, false, false], //2-3pm, Mon-Sun
        [false, false, false, false, false, false, false], //3-4pm, Mon-Sun
        [false, false, false, false, false, false, false], //4-5pm, Mon-Sun
        [false, false, false, false, false, false, false], //5-6pm, Mon-Sun
        [false, false, false, false, false, false, false], //6-7pm, Mon-Sun
        [false, false, false, false, false, false, false], //7-8pm, Mon-Sun
      ],
      [
        [false, false, false, false, false, false, false], //8-9am, Mon-Sun
        [false, false, false, false, false, false, false], //9-10am, Mon-Sun
        [false, false, false, false, false, false, false], //10-11am, Mon-Sun
        [false, false, false, false, false, false, false], //11-12pm, Mon-Sun
        [false, false, false, false, false, false, false], //12-1pm, Mon-Sun
        [false, false, false, false, false, false, false], //1-2pm, Mon-Sun
        [false, false, false, false, false, false, false], //2-3pm, Mon-Sun
        [false, false, false, false, false, false, false], //3-4pm, Mon-Sun
        [false, false, false, false, false, false, false], //4-5pm, Mon-Sun
        [false, false, false, false, false, false, false], //5-6pm, Mon-Sun
        [false, false, false, false, false, false, false], //6-7pm, Mon-Sun
        [false, false, false, false, false, false, false], //7-8pm, Mon-Sun
      ],
      [
        [false, false, false, false, false, false, false], //8-9am, Mon-Sun
        [false, false, false, false, false, false, false], //9-10am, Mon-Sun
        [false, false, false, false, false, false, false], //10-11am, Mon-Sun
        [false, false, false, false, false, false, false], //11-12pm, Mon-Sun
        [false, false, false, false, false, false, false], //12-1pm, Mon-Sun
        [false, false, false, false, false, false, false], //1-2pm, Mon-Sun
        [false, false, false, false, false, false, false], //2-3pm, Mon-Sun
        [false, false, false, false, false, false, false], //3-4pm, Mon-Sun
        [false, false, false, false, false, false, false], //4-5pm, Mon-Sun
        [false, false, false, false, false, false, false], //5-6pm, Mon-Sun
        [false, false, false, false, false, false, false], //6-7pm, Mon-Sun
        [false, false, false, false, false, false, false], //7-8pm, Mon-Sun
      ],
      [
        [false, false, false, false, false, false, false], //8-9am, Mon-Sun
        [false, false, false, false, false, false, false], //9-10am, Mon-Sun
        [false, false, false, false, false, false, false], //10-11am, Mon-Sun
        [false, false, false, false, false, false, false], //11-12pm, Mon-Sun
        [false, false, false, false, false, false, false], //12-1pm, Mon-Sun
        [false, false, false, false, false, false, false], //1-2pm, Mon-Sun
        [false, false, false, false, false, false, false], //2-3pm, Mon-Sun
        [false, false, false, false, false, false, false], //3-4pm, Mon-Sun
        [false, false, false, false, false, false, false], //4-5pm, Mon-Sun
        [false, false, false, false, false, false, false], //5-6pm, Mon-Sun
        [false, false, false, false, false, false, false], //6-7pm, Mon-Sun
        [false, false, false, false, false, false, false], //7-8pm, Mon-Sun
      ]
    ]
  },
  reducers: {
    flipAvailability: (state, action) => {
      let user = action.payload.user
      let x = action.payload.x
      let y = action.payload.y 
      state.schedule[user][x][y] = !state.schedule[user][x][y]
    },
    setUser: (state, action) => {
      let user = action.payload.user
      state.user = user
    }
  }
})

// Action creators are generated for each case reducer function
export const { flipAvailability, setUser } = userSlice.actions

export default userSlice.reducer