import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'
import { useNavigate } from 'react-router-dom'
// get userToken from localStorage
const overlappdToken = localStorage.getItem('overlappdToken')
    ? localStorage.getItem('overlappdToken')
    :null

const user = localStorage.getItem('overlappdToken')
    ? localStorage.getItem('overlappdUser')
    :null


const initialState = {
    user,
    overlappdToken,
    isError: false,
    isSuccess:false,
    isLoading:false,
    message: '',
}

// register user
export const register = createAsyncThunk('auth/register', 
    async(user, thunkAPI) => {
        try{
            //send request to server through authService
            return await authService.register(user)
        }catch(error) {
            
            // const message = (error.ressponse && error.response.data
            //    && error.response.data.message) || error.message || error.toString()

            // perform register.reject action with the error.response.data as the payload
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

//Login user
export const login = createAsyncThunk('auth/login', 
    async(user, thunkAPI) => {
        try{
            //send request to server through authService
            return await authService.login(user)
        }catch(error) {
            // const message = (error.ressponse && error.response.data
            //    && error.response.data.message) || error.message || error.toString()

            // perform login.reject action with the error.response.data as the payload
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

//truying to authenticate for access to homepage may need to remove
export const getUserDetails = createAsyncThunk('auth/getUserDetails', 
    async(arg, {getState, thunkAPI}) => {
        try{
            const{ user } = getState()
            //send request to server through authService
            return await authService.getUserDetails(user)
        }catch(error) {
            // const message = (error.ressponse && error.response.data
            //    && error.response.data.message) || error.message || error.toString()

            // perform login.reject action with the error.response.data as the payload
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)



//logout
export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null},
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    //builds the async action states
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.overlappdToken = action.payload.session
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.overlappdToken = action.payload.session
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(getUserDetails.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.overlappdToken = action.payload.session
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.overlappdToken = null
                localStorage.removeItem('overlappdToken')
                localStorage.removeItem('overlappdUser')
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer