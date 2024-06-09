import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#35A6DE]">About</h2>
          <p className="mt-4 text-lg md:text-xl text-gray-800">
            Welcome to ReturnTrack – your ultimate solution for tracking and managing returns and purchases of various products.
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-4 md:p-8 lg:p-12">
          <p className="text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl mb-4">
            Our web application is designed to streamline the process of buying and selling products, with a focus on tracking returns and purchases of items such as tablets, laptops, computers, pens, pencils, and paper.
          </p>
          <p className="text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl mb-4">
            With our user-friendly interface, businesses and individuals can easily manage their transactions, ensuring accurate tracking of products and efficient handling of returns.
          </p>
          <p className="text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl mb-4">
            ReturnTrack offers a comprehensive platform for both buyers and sellers, providing transparency and security throughout the buying and return process. Our system categorizes products into different types, making it simple to monitor their status and history.
          </p>
          <p className="text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl mb-4" style={{ backgroundColor: '#89C9EA', padding: '1rem', borderRadius: '0.5rem' }}>
            We are committed to continually enhancing ReturnTrack to meet the evolving needs of our users. Whether you're a buyer looking for a seamless purchasing experience or a seller seeking efficient return management, ReturnTrack has you covered.
          </p>
          <p className="text-gray-800 leading-relaxed text-base md:text-lg lg:text-xl">
            Thank you for choosing ReturnTrack. Let's simplify the process of buying and returning products together.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
