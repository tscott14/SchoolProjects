import axios from 'axios'



// Register user request
const register = async (userData) => {
  const url = window.location.origin
      const response = await axios.post(`${url}/api/account/create`, userData)

      if (response.data) {
        localStorage.setItem('overlappdToken', response.session)
        localStorage.setItem('overlappdUser', response.session_usertag)
      }

    return response.data
}

// Login user request
const login = async (userData) => {
  const url = window.location.origin
    const response = await axios.post(`${url}/api/account/signin`, userData)
  
    if (response.data) {
      localStorage.setItem('overlappdToken', response.session)
      localStorage.setItem('overlappdUser', response.session_usertag)
    }
  
    return response.data
}
  
// Logout user
const logout = () => {
  localStorage.removeItem('overlappdToken')
}

//use JWT to authenticate may need to remove
const getUserDetails = async (user) =>{
  // get user data from store
  const config = {
    headers:{
      Authorization: `${user.userToken}`,
    },
  }
  const url = window.location.origin
  const response = await axios.get(`${url}/api/account/tokenAuth`, config)
  if (response.data) {
    localStorage.setItem('overlappdToken', response.session)
  }
  return response
}

  
const authService = {
  register,
  logout,
  login,
  getUserDetails
}



  
  export default authService