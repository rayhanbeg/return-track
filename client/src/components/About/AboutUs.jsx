import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-teal-400 py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">About Us</h2>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Welcome to XYZ's Asset Management System – your ultimate solution for efficient asset and product management.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 lg:p-16">
          <p className="text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl">
            Our web application is designed to streamline the tracking and utilization of company assets, catering specifically to the needs of HR Managers.
          </p>
          <p className="mt-4 md:mt-6 text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl">
            With our user-friendly interface, businesses can easily manage their assets, ensuring that valuable resources are optimally utilized and tracked. Our system categorizes assets into two main types: Returnable (such as laptops, keyboards, mice, chairs, desks, and cell phones) and Non-returnable (like pens, pencils, paper, diaries, and tissue paper), making it simple to monitor their usage and availability.
          </p>
          <p className="mt-4 md:mt-6 text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl">
            XYZ's Asset Management System is subscription-based, providing companies with flexible and scalable solutions to meet their unique needs. By leveraging this software, businesses can enhance accountability, reduce losses, and improve overall efficiency.
          </p>
          <p className="mt-4 md:mt-6 text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl">
            We are currently on the lookout for a skilled MERN stack developer to join our team and help bring our vision to life. If you're passionate about creating cutting-edge web applications and want to be part of a dynamic and innovative company, we would love to hear from you.
          </p>
          <p className="mt-4 md:mt-6 text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl">
            Thank you for choosing XYZ. Together, let's take asset management to the next level.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
