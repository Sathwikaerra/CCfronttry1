import React, { useState } from "react";

const FAQ = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="bg-gray-50 py-8 px-6 sm:px-10">
      <h1 className="text-2xl text-center text-gray-900 mb-8 font-medium">
        FAQ: How to Use Campus Connect
      </h1>

      {/* FAQ Blocks */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* General Questions Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-blue-600 font-semibold mb-4">General Questions</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("general1")}
            >
              Q1: What is Campus Connect?
            </button>
            {activeSection === "general1" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: Campus Connect is an online platform that connects university students with delivery services. As a student, you can become a delivery partner when you're out of campus and earn money, or you can use the platform to place orders for on-campus services like food delivery and other essentials.
              </p>
            )}
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("general2")}
            >
              Q2: How do I use the website?
            </button>
            {activeSection === "general2" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: On the homepage, you’ll see three main buttons: <br />
                - *1. On-Campus Services*: This allows you to place an order for either food delivery or other essential services. <br />
                - *2. Be a Delivery Partner*: If you want to become a delivery partner and earn money, select this option. <br />
                - *3. Refresh*: This simply refreshes the home screen.
              </p>
            )}
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("general3")}
            >
              Q3: What happens when I click "On-Campus Services"?
            </button>
            {activeSection === "general3" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: After clicking "On-Campus Services", you’ll have two options: <br />
                1. *Food Delivery*: Choose food items you want delivered from on-campus partners. <br />
                2. *Other Services/Essentials*: Select from a list of essentials or services available on campus. <br />
                After choosing one, you'll see a list of active delivery partners. You can choose one or more delivery partners and then confirm your order. If no delivery partners are available, you can select the *"Keep a Request"* option to be added to a waiting list and get notified when a delivery partner is available.
              </p>
            )}
          </div>
        </div>

        {/* Delivery Partner Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-green-600 font-semibold mb-4">Be a Delivery Partner</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("delivery1")}
            >
              Q4: How do I become a Delivery Partner?
            </button>
            {activeSection === "delivery1" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: To become a delivery partner, click on the *"Be a Delivery Partner"* button on the homepage. You will have two options to choose from: <br />
                - *Food Delivery*: If you want to deliver food to others on campus. <br />
                - *Other Essentials*: If you're interested in delivering other essential items. <br />
                Once you choose an option, your profile will be activated as a delivery partner. You will then be placed on a waiting list, and notifications will be sent to you and to customers when you're available for deliveries.
              </p>
            )}
          </div>
        </div>

        {/* Tracking Orders Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-purple-600 font-semibold mb-4">Tracking Orders</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("tracking1")}
            >
              Q5: How do I track my orders?
            </button>
            {activeSection === "tracking1" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: You can track both your *Receiver* and *Delivery Partner* orders from the *Cart* and *Profile* sections at the top right corner of the homepage. <br />
                - *Cart*: Displays the orders you've placed as a customer (Receiver) or the ones you’ve accepted as a Delivery Partner. <br />
                - *Profile*: Displays your delivery partner status, including the waiting list and notification updates.
              </p>
            )}
          </div>
        </div>

        {/* Availability and Notifications Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-yellow-600 font-semibold mb-4">Availability and Notifications</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("notifications1")}
            >
              Q6: What if there are no active delivery partners available?
            </button>
            {activeSection === "notifications1" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: If no delivery partners are currently available, you can use the *"Keep a Request"* option. This adds your request to the waiting list. You will receive a notification via email when a delivery partner becomes available to fulfill your order.
              </p>
            )}
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("notifications2")}
            >
              Q7: How can I notify other users of available deliveries?
            </button>
            {activeSection === "notifications2" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: As a delivery partner, when you become available, you can notify users on the waiting list by sending notifications via email. You will receive a notification when new orders are placed, and you can accept them if you're available.
              </p>
            )}
          </div>
        </div>

        {/* Earnings Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-red-600 font-semibold mb-4">Earnings</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("earnings1")}
            >
              Q8: How do I earn money as a delivery partner?
            </button>
            {activeSection === "earnings1" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: As a delivery partner, you earn money for each parcel you deliver. The amount may vary depending on the type of delivery (food or essentials) and the distance to be covered. You can track your earnings in the *Profile* section.
              </p>
            )}
          </div>
        </div>

        {/* Notifications Sent Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-teal-600 font-semibold mb-4">Notifications</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("notifications3")}
            >
              Q9: How are notifications sent?
            </button>
            {activeSection === "notifications3" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: Notifications are sent via *email* to both delivery partners and customers. When you're placed on the waiting list or when a delivery partner is available to take your order, you'll receive an email notifying you.
              </p>
            )}
          </div>
        </div>

        {/* Refreshing Page Block */}
        <div className="bg-pink-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg text-orange-600 font-semibold mb-4">Refreshing the Page</h2>
          <div>
            <button
              className="block w-full text-left text-gray-700 text-md font-medium mt-3 hover:text-gray-900 focus:outline-none"
              onClick={() => toggleSection("refresh1")}
            >
              Q10: How do I refresh the home screen?
            </button>
            {activeSection === "refresh1" && (
              <p className="ml-2 mt-2 text-gray-600 text-sm text-justify">
                A: Click on the *"Refresh"* button on the homepage to reload the page. This is useful to get the latest updates on available delivery partners and orders.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
