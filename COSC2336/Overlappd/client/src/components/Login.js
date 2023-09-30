import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, reset } from '../features/authSlice'
//future reference: Import modal, add modal on button +argument under button, make modal function to set state



const Login = () => {
	const [formData, setForm] = useState({
	email: "",
	password: "",
	})

	function updateForm(value) {
		return setForm((prev) => {
			return {...prev, ...value}
		})
	}

	const {email, password } = formData

	const navigate = useNavigate()
	const dispatch = useDispatch()


	//load in the user and message state
	const { user, isError, isSuccess, message } = useSelector(
		(state) => state.auth
	)


	useEffect(() => {
		
		if(isError){
			//alert user to the error 
			alert(message.error.msg)
			//redirect back to the Login with the form reset
			navigate(0);
		}
		if(isSuccess || user){
			//alert(user)
			const url = window.location.origin
			//document.cookie = `session=${user.sessionID}`
			// can most likely take your rout from response
			//window.location.href = `${url}${user.redirect}`
			navigate('/homescreen')
		}
		dispatch(reset())
	}, [user, isError, isSuccess, message, navigate, dispatch ])


	const handleSubmit = async (event) => {
		event.preventDefault()

		// I want to eventually make it so this whole block could look something like:
		// const json = Globals.postJSON('api/signin', json_body_string)
		// but for now, this will have to do!
		//              - Dominique

		// const url = window.location.origin

		const userData = {
			email,
			password,
		}
		dispatch(login(userData))
		// Process Signing-up
		



		// Set the temp non-htmlOnly cookie.
		// document.cookie = `session=${json.sessionID}`

		// globals.js has a function createRoute(route) that could make
		// this code look much cleaner. It would look something like:
		// window.location.href = createRoute(json.redirect)
		//          - Dominique
		// window.location.href = `${url}${json.redirect}`

		setForm({ email: "", password: ""});
	}

	return (
		<form className='login' onSubmit={handleSubmit}>
			<h3>Log In</h3>
			<div className='auth-inner'>
				<div className='input-labels'>
					<label>Email</label>
				</div>
				<div>
					<input
						className='form-control'
						type='email'
						placeholder='Enter Email'
						onChange={(e) => updateForm({email: e.target.value})}
						value={email}
						name='email'
					/>
				</div>
			</div>
			<div className='auth-inner'>
				<div className='input-labels'>
					<label>Password</label>
				</div>
				<div>
					<input
						className='form-control'
						type='password'
						placeholder='Enter Password'
						onChange={(e) => updateForm({password: e.target.value})}
						value={password}
						name='password'
					/>
				</div>
			</div>
			<button type='submit' className='button-control'>
				Log in
			</button>
		</form>
	)
}

export default Login
