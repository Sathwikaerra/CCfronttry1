import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const services = [
  {
    title: 'Food Delivery',
    description:
      "Our Campus Food Delivery Service is run by students, for students. We help each other by delivering meals from out-of-campus restaurants directly. Fast, reliable, and student-powered—order and support your peers today!",
    icon: '🍔',
    image: 'https://png.pngtree.com/png-clipart/20241117/original/pngtree-cartoon-boy-delivering-food-png-image_17150282.png',
  },
];

const ServicesPage = () => {
  const isUserLoggedIn = useSelector((state) => state.user.isloggedIn);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mt-[20px]  bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-900">
      {/* Note at the top */}
      <div className="container rounded-full mx-auto px-3 py-2.5 bg-yellow-100 text-black text-center shadow-md mb-8">
        <p className="text-[12px] font-bold">
          ⚠️<span className='text-red-800 font-extrabold'> Note:</span> We provide free service, delivery fees <span className='text-red-700 font-bold'>(10 Rs/-)</span> are paid directly to the delivery person.
        </p> 
      </div>

      {/* Middle Section */}
      <div className="container mx-auto px-3 py-6 flex flex-col flex-wrap justify-between items-center gap-8">
        {/* First Sub-Container: Food Delivery Service */}
        <div className="flex-1 bg-slate-300 p-5 rounded-3xl shadow-lg flex flex-col justify-center items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h3 className="text-xl text-black font-medium mb-3">{services[0].title}</h3>
          <img
            src={services[0].image}
            alt={services[0].title}
            className="w-[150px] h-[150px] rounded-full shadow-md mb-3"
          />
          <button
            className="bg-emerald-500 text-black text-sm font-semibold p-2 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-emerald-400"
            onClick={() => navigate('/orders')}
          >
            Order Now
          </button>
        </div>

        {/* Second Sub-Container: Other Services Button */}
        <div className="flex-1 bg-slate-300  text-black p-5 rounded-3xl shadow-lg flex flex-col justify-center items-center text-center hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-medium mb-4">Explore More Services</h3>
          <button
            className="bg-emerald-600 text-white  text-sm font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-500 hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-yellow-300"
            onClick={() => navigate('/other-services')}
          >
            Other Services
          </button>
        </div>
      </div>

      {/* Bottom Section: Request Button */}
      <div className="mt-8 p-4 text-center">
        <p className="text-yellow-500 flex justify-center items-center gap-3">
          <div className="w-[15px] h-[9px] rounded-full bg-red-700"></div>
          <span className="text-[10px]">
            If you want to be notified by outside users, make a Pre-request
          </span>
        </p>
        {isUserLoggedIn && (
          <button
            className="bg-emerald-500 mt-[20px] text-black text-sm font-semibold p-2 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-emerald-400"
            onClick={() => navigate('/two-request')}
          >
            Keep a Request
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
