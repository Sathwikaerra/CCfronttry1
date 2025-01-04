// import React, { useState } from 'react';
// import AuthForm from './AuthForm';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { userActions } from '../../store/reducers';
// // import ThreeDLoader from '../ThreeDLoader';

// const Auth = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [email, setEmail] = useState('');
//   const [userData, setUserData] = useState({});
//   const [notification, setNotification] = useState(null);
//   const [load,setLoad]=useState(false); // State for notification

//   // Utility function to show notifications
//   const showNotification = (message, type) => {
//     setNotification({ message, type });
//     setTimeout(() => {
//       setNotification(null);
//     }, 3000);
//   };

//   const handleUserCreation = async () => {
//     try {
//       const res = await axios.post('/user/signup', userData);
//       if (res.status === 200) {
//         setUserData(res.data.newUser);
//         dispatch(userActions.login());
//         dispatch(userActions.loginSuccess(res.data.newUser));
  
//         // Save user details to localStorage
//         localStorage.setItem('UserName', res.data.newUser.name);
//         localStorage.setItem('UserId', res.data.newUser._id);
//         localStorage.setItem('UserEmail', res.data.newUser.email);
//         showNotification('User account created successfully!', 'success');

//         setTimeout(() => {

//           navigate('/');
          
//         }, 1000);
  
        
//       } else {
//         showNotification('Error creating user. Please try again.', 'error');
//       }
//     } catch (error) {
//       showNotification('Servers are busy. Please try again later.', 'error');
//     }
//   };
  

//   const handleOTPSubmit = async () => {
//     try {
//       setLoad(true);
//       const response = await axios.post('/verify-otp', { email, otp });
//       if (response.status === 200) {
//         await handleUserCreation(userData);
//         setLoad(false); // Reuse the user creation logic
//       } else {
//         showNotification('Invalid OTP. Please try again.', 'error');
//       }
//     } catch (err) {
//       showNotification('Failed to verify OTP. Please try again.', 'error');
//     }
//   };

//   // Handle OTP Sending and User Signup
//   const handleSendOtp = async (inputs) => {
//     try {
//       if (inputs.password.length < 6) {
//         showNotification('Password should have 6 characters', 'error');
//         return;
//       }
//       const saveResponse = await axios.post('/user/verifysignup', inputs);

//       if (saveResponse.status === 200) {

//         setEmail(inputs.email);

//         const otpResponse = await axios.post('/send-otp', { email: inputs.email });
//         if (otpResponse.status === 200) {
//           setOtpSent(true);
//           showNotification('OTP sent successfully!', 'success');
         
         
//         } else {
//           showNotification('Failed to send OTP. Please try again.', 'error');
//         }
//       }
//     } catch (err) {
//       if (err.response) {
//         const { status, data } = err.response;
//         if (status === 400) {
//           showNotification(data.message || 'Email already exists.', 'error');
//         } else if (status === 401) {
//           showNotification(data.message || 'ID already exists.', 'error');
//         } else if (status === 404) {
//           showNotification(data.message || 'Phone Number already exists.', 'error');
//         } else {
//           showNotification(data.message || 'An unexpected error occurred.', 'error');
//         }
//       } else {
//         showNotification('Network error. Please check your connection.', 'error');
//       }
//     }
//   };

//   // Handle Login
//   const handleLogin = async (inputs) => {
//     try {
//       setLoading(true);
      
//       const response = await axios.post('/user/login', {
//         password: inputs.password,
//         email: inputs.email,
//       });

//       if (response.status === 200) {
//         dispatch(userActions.login());
//         dispatch(userActions.loginSuccess(response.data.newUser));

//         localStorage.setItem('UserName', response.data.newUser.name);
//         localStorage.setItem('UserId', response.data.newUser._id);
//         localStorage.setItem('UserEmail', response.data.newUser.email);
//         setLoading(false); 

//         setTimeout(() => {
//           navigate('/');
          
//         }, 1000);

       
//         showNotification('User logged in successfully!', 'success');
//       } else {
//         showNotification('Invalid Credentials', 'error');
//       }
//     } catch (err) {
//       showNotification('Invalid Credentials', 'error');
//     }
//   };

//   // Handle Form Submission
//   const handleAuthSubmit = (data) => {
//     setUserData(data.inputs)
//     if (data.signup) {
      
//       handleSendOtp(data.inputs);
//     } else {
//       handleLogin(data.inputs);
//     }
//   };

//   return (
//     <div className="w-full flex justify-center items-center flex-col">
//       {notification && (
//         <div
//           className={`fixed top-3 right-3 px-4 py-2 text-sm rounded shadow-md ${
//             notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//           } text-white`}
//         >
//           {notification.message}
//         </div>
//       )}

//       <div className="flex justify-center items-center flex-col mt-16">
//         {otpSent ? (
//           <div className="bg-white p-3 w-[300px] rounded shadow-md ">
//             <h2 className="text-lg font-bold mb-4">Verify OTP</h2>
//             <div className="mb-4">
//               <label className="block text-black text-xs font-medium mb-2">
//                 Enter OTP
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 placeholder='Enter the OTP'
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="border text-center border-black rounded w-full py-2 px-3 text-gray-700"
//               />
//             </div>
//             <button
//               onClick={handleOTPSubmit}
//               className="bg-violet-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
//             >
//               {!load ? "Verify OTP":"Verifying..."}
//             </button>
//           </div>
//         ) : (
//           <div>
           
//             <AuthForm onsubmit={handleAuthSubmit} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Auth;


import React, { useState } from 'react';
import AuthForm from './AuthForm';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../store/reducers';
import Loader from '../Loader'; // Import a custom loader component

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false); // Manage loading state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleUserCreation = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/user/signup', userData);
      setLoading(false);

      if (res.status === 200) {
        setUserData(res.data.newUser);
        dispatch(userActions.login());
        dispatch(userActions.loginSuccess(res.data.newUser));

        localStorage.setItem('UserName', res.data.newUser.name);
        localStorage.setItem('UserId', res.data.newUser._id);
        localStorage.setItem('UserEmail', res.data.newUser.email);
        showNotification('User account created successfully!', 'success');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        showNotification('Error creating user. Please try again.', 'error');
      }
    } catch (error) {
      setLoading(false);
      showNotification('Servers are busy. Please try again later.', 'error');
    }
  };

  const handleOTPSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/verify-otp', { email, otp });
      if (response.status === 200) {
        await handleUserCreation();
      } else {
        setLoading(false);
        showNotification('Invalid OTP. Please try again.', 'error');
      }
    } catch (err) {
      setLoading(false);
      showNotification('Failed to verify OTP. Please try again.', 'error');
    }
  };
  const handleSendOtp = async (inputs) => {
    try {
      setLoading(true);
  
      // Validate password length
      if (inputs.password.length < 6) {
        showNotification('Password should have at least 6 characters', 'error');
        return;
      }
  
      // Verify signup
      const saveResponse = await axios.post('/user/verifysignup', inputs);
  
      // If the signup verification succeeds
      setEmail(inputs.email);
  
      // Attempt to send OTP
      const otpResponse = await axios.post('/send-otp', { email: inputs.email });
  
      if (otpResponse.status === 200) {
        setOtpSent(true);
        showNotification('OTP sent successfully!', 'success');
      }
    } catch (err) {
      // Extract error information
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
  
      // Handle specific status codes
      if (status === 401) {
        showNotification('ID already Exists!', 'error');
      } else if (status === 400) {
        showNotification('Email already Exists!', 'error');
      } else if (status === 404) {
        showNotification('Mobile Number already Exists!', 'error');
      } else {
        showNotification(errorMessage, 'error');
      }
    } finally {
      // Ensure loading is turned off at the end of any process
      setLoading(false);
    }
  };
  
      
  const handleLogin = async (inputs) => {
    try {
      setLoading(true);
      const response = await axios.post('/user/login', inputs);

      if (response.status === 200) {
        dispatch(userActions.login());
        dispatch(userActions.loginSuccess(response.data.newUser));

        localStorage.setItem('UserName', response.data.newUser.name);
        localStorage.setItem('UserId', response.data.newUser._id);
        localStorage.setItem('UserEmail', response.data.newUser.email);

        showNotification('User logged in successfully!', 'success');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        showNotification('Invalid credentials', 'error');
      }
    } catch (err) {
      showNotification('Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = (data) => {
    setUserData(data.inputs);
    if (data.signup) {
      handleSendOtp(data.inputs);
    } else {
      handleLogin(data.inputs);
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col relative">
    {notification && (
      <div
        className={`fixed top-3 right-3 px-4 py-2 text-sm rounded shadow-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        {notification.message}
      </div>
    )}
  
    <div className={`relative mt-16 w-full flex justify-center`}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex flex-col justify-center items-center z-10">
          <Loader />
          <p className="text-gray-700 font-serif">Loading...</p>
        </div>
      )}
  
      <div
        className={`flex flex-col items-center w-[300px] bg-white p-3 rounded shadow-md ${
          loading ? 'opacity-20 pointer-events-none' : ''
        }`}
      >
        {otpSent ? (
          <>
            <h2 className="text-lg font-bold mb-4">Verify OTP</h2>
            <div className="mb-4">
              <label className="block text-black text-xs font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                placeholder="Enter the OTP"
                onChange={(e) => setOtp(e.target.value)}
                className="border text-center border-black rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
            <button
              onClick={handleOTPSubmit}
              className="bg-violet-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Verify OTP
            </button>
          </>
        ) : (
          <AuthForm onsubmit={handleAuthSubmit} />
        )}
      </div>
    </div>
  </div>
  
  );
};

export default Auth;

