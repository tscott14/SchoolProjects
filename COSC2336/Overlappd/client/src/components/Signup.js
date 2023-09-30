import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register, reset } from '../features/authSlice'

const Signup = () => {
	const [formData, setForm] = useState({
		username: "",
		usertag: "",
		email: "",
		password: "",
	})

	function updateForm(value) {
		return setForm((prev) => {
			return {...prev, ...value}
		})
	}

	const {username, usertag, email, password } = formData



	const navigate = useNavigate()
	const dispatch = useDispatch()

	//load in the state user and message state
	const { user, isError, isSuccess, message } = useSelector(
		(state) => state.auth
	)

	useEffect(() => {
		if(isError){
			//alert user to the error
			alert(message.error.msg)
			//redirect back to the signup screen with the form reset
			navigate(0);
		}
		if(isSuccess || user){
			//const url = window.location.origin
			// can most likely take your rout from response
			//window.location.href = `${url}${user.redirect}`
			navigate('/homescreen')
		}
		dispatch(reset())
	}, [user, isError, isSuccess, message, navigate, dispatch ])


	const handleSubmit = async (event) => {
		event.preventDefault()

		//console.log(username, usertag, email, password)

		const userData = {
			usertag,
			username,
			email,
			password,
		}

		// I want to eventually make it so this whole block could look something like:
		// const json = Globals.postJSON('api/signup', json_body_string)
		// but for now, this will have to do!
		//              - Dominique

        // const url = window.location.origin

		// const signup ={...form};
		dispatch(register(userData))
		// Process Signing-up
		


		// globals.js has a function createRoute(route) that could make
		// this code look much cleaner. It would look something like:
		// window.location.href = createRoute(json.redirect)
		//          - Dominique
		// window.location.href = `${url}${json.redirect}`
	}

	return (
		<form className='signup' onSubmit={handleSubmit}>
			<h3>Sign up</h3>
			<div className='auth-inner'>
				<div className='input-labels'>
					<label>Username</label>
				</div>
				<div>
					<input
						className='form-control'
						type='text'
						placeholder='Enter Username'
						onChange={(e) => updateForm({username: e.target.value})}
						value={username}
						name='username'
					/>
				</div>
				<div className='input-labels'>
					<label>Usertag</label>
				</div>
				<div>
					<input
						className='form-control'
						type='text'
						placeholder='Enter Usertag'
						onChange={(e) => updateForm({usertag: e.target.value})}
						value={usertag}
						name='usertag'
					/>
				</div>
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
				Sign up
			</button>
		</form>
	)
}

export default Signup
