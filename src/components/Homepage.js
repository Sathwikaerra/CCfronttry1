import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTruck, FaSignInAlt, FaSyncAlt } from "react-icons/fa"; 
import { useSelector } from "react-redux";
import "./style.css";
import { getActiveUsers, getRequestUsers,getOtherServiceUsers,getOtherRequestUsers } from "./ApI/Api";
import axios from "axios";
import Loader from "./Loader";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import an from './an.gif'
import { FaSchool } from "react-icons/fa";
import { RiHandHeartFill } from "react-icons/ri";
import { MdLocalShipping } from "react-icons/md";
import { GiDeliveryDrone } from "react-icons/gi";
import { BiPackage } from "react-icons/bi";






function HomePage() {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState([]);
  const [requestUsers, setRequestUsers] = useState([]);
  const [otherActiveUsers, setOtherActiveUsers] = useState([]);
  const [otherRequestUsers, setOtherRequestUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  
  const isUserLoggedIn = useSelector((state) => state.user.isloggedIn);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const activeRes = await getActiveUsers();
        setActiveUsers(activeRes?.users || []);
        const requestRes = await getRequestUsers();
        setOtherRequestUsers(requestRes?.users || []);
        const OtherServiceUsers = await getOtherServiceUsers();
        setOtherActiveUsers(OtherServiceUsers?.users || []);
        const OtherRequestUsers = await getOtherRequestUsers();
        setOtherRequestUsers(OtherRequestUsers?.users || []);

        const response = await axios.get("/user/allusers");
        setUsers(response.data.users);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const movies = [
    "/hm.jpg",
    "/bag3.jpg",
    "/bag2.jpg",
    "/bag.jpg",
  ];
  const settings = {
    // dots: true,
    Infinity:true,
 speed: 300, // Faster slide animation (300ms)
    duration:1 ,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
     // Enable left and right arrows for navigation

    
    
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section with Background Image */}
      <div>
      <Slider {...settings}>
       {  movies.map((item, index) => (

        <div  className=' ' key={index}>
          <img className='w-fit h-[270px] m-auto opacity-40'  src={item} alt={`Slide ${index + 1}`}  />
         
       
        </div>
        
        
      ))}
      
    </Slider>
    <div className=" mt-[-90px] shadow-xl text-center font-bold  text-white bg-opacity-30 p-3 rounded-md">
        <h1 className="text-xl sm:text-3.3xl font-bold opacity-90">"Integrating Ourselves"</h1>
        <p className="text-xs mt-1 sm:text-md opacity-80">From the Student, By the Student, For the Student</p>
      </div>
        {/* <section
          className="relative h-[340px] sm:h-[506px] w-full flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url('/hm.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative mt-[-77px] text-center text-white bg-opacity-30 p-3 rounded-md">
            <h1 className="text-xl sm:text-3.3xl font-bold opacity-90">"Integrating Ourselves"</h1>
            <p className="text-xs mt-1 sm:text-md opacity-80">From the Student, By the Student, For the Student</p>
          </div>
        </section> */}
      </div>

      {!isUserLoggedIn ? (
        <div className="flex justify-center items-center gap-10 flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-[305px] md:h-[385px]">
          <div className=" mt-[80px] flex-1">
            <img
              src={"https://cdni.iconscout.com/illustration/premium/thumb/boy-is-running-to-deliver-the-parcel-illustration-download-in-svg-png-gif-file-formats--delivery-man-with-box-shipping-service-courier-home-food-pack-services-illustrations-8401148.png?f=webp"}
              alt="GIF"
              className="rounded-lg shadow-lg w-[205px] mb-[40px] h-auto"
              onClick={() => navigate('/auth')}
            />
          </div>
         
          <div className=" mt-[20px] mb-[120px] flex justify-center items-center flex-col text-white rounded-lg p-4 max-w-md   h-[190px] text-center shadow-lg">
            <img
              src='/explain.png'
              alt=""
              className="rounded-lg mt-[100px] shadow-lg w-[320px] mb-[40pxw-[320px]] h-auto"
              onClick={() => navigate('/auth')}
            />
          </div>
          
        </div>
      ) : (
        <main className="flex-1 flex-col p-8">
          <h2 className="text-lg sm:text-xl flex justify-center items-center gap-2 font-semibold text-white text-center">Welcome to Campus Connect</h2>
          {loading ? (
            <div className="flex mt-3 justify-center flex-col gap-3 items-center">
              <Loader />
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center mt-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 items-center justify-center gap-4 mt-4">
                <div className="bg-blue-500 text-white rounded-lg px-4 py-2.5 shadow-md">
                <p className="font-semibold   text-sm">
  Outside Users: 
  <span className="font-extrabold ml-1 rounded">
  {activeUsers.length > 0
    ? activeUsers.length
    : otherActiveUsers.length > 0
    ? otherActiveUsers.length
    : "0"}
</span>
</p>                </div> 
                <div className="bg-orange-500 text-white rounded-lg px-4 py-2.5 shadow-md">
                <p className="font-semibold text-sm">
  Waiting Users: 
  <span className="font-extrabold ml-1 rounded">
  {requestUsers.length > 0
    ? requestUsers.length
    : otherRequestUsers.length > 0
    ? otherRequestUsers.length
    : "0"}
</span>
</p>
                </div>
              
             
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 p-5 flex items-center justify-center flex-col gap-4">
            <Link
              to="/Services"
              className="relative flex justify-center items-center p-4 w-[300px] bg-green-600 rounded-3xl flex justify-start items-center gap-4 text-white font-bold shadow-lg text-center transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-r hover:from-[#c58048] hover:to-[#d88a3c]"
            >
              {/* <FaShoppingCart className="text-xl" /> */}
              <FaSchool size={25}/>On Campus Services
            </Link>
            <Link
              to="/twoButtons"
              className="relative  ml-[1px] flex justify-center items-center p-4 w-[280px] bg-green-600 rounded-3xl flex justify-start items-center gap-4 text-white font-bold shadow-lg text-center transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-r hover:from-[#b56a2b] hover:to-[#d88a3c]"
            >
              {/* <FaTruck className="text-xl" /> */}
              <FaTruck size={25}/>Be a Delivery Partner
            </Link>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center mt-5">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              <FaSyncAlt className="mr-3" />
              Refresh Page
            </button>
          </div>
        </main>
      )}

      {/* Footer */} 
      <footer className="bg-gray-800 flex flex-col gap-3 text-white p-3 text-center mt-auto">
      { isUserLoggedIn &&
          <>
            <p className="text-sm flex gap-2 justify-center items-center">
  {/* <a href="#" class="text-blue-500 hover:text-blue-700 font-medium">Facebook</a>,  */}
  <Link  target="_blank" to="https://www.instagram.com/campusconnect322?igsh=YnBoanA3Mm02YzFm" class="text-pink-500 flex justify-center  items-center hover:text-pink-700 font-medium"><img className="w-[20px] rounded-full" src="https://cdn-icons-png.freepik.com/256/15707/15707869.png?semt=ais_hybrid"/></Link>
  {/* <a href="#" class="text-blue-400 hover:text-blue-600 font-medium">Twitter</a> */}
  <Link  target="_blank" to="https://www.instagram.com/campusconnect322?igsh=YnBoanA3Mm02YzFm" className=""><p class="text-gray-500 mt-[4px] text-center mt-6 text-sm">
  Follow us on social media: 

  
</p>
</Link>
  </p>
          </>
        }
        <p className="text-sm">&copy; 2024 GBH S-(322) Campus Connect. All rights reserved.</p>
       
       
      </footer>
    </div>
  );
}

export default HomePage;
