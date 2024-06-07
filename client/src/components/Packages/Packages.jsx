import  { useState } from 'react';

const Packages = () => {
  const [activePlan, setActivePlan] = useState('Standard');

  const handlePlanClick = (plan) => {
    setActivePlan(plan);
  };

  const features = {
    Basic: ["Maximum 5 mployers", "Feature 2 for Basic", "Feature 3 for Basic"],
    Standard: ["Maximum 10 mployers", "Feature 2 for Standard", "Feature 3 for Standard"],
    Pro: ["Maximum 20 mployers", "Feature 2 for Pro", "Feature 3 for Pro"],
  };

  return (
    <div className="bg-white">
      <div className="container px-6 py-8 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">Simple pricing plan</h1>
        <p className="max-w-2xl mx-auto mt-4 text-center text-gray-500 xl:mt-6">
          Explore our straightforward pricing plans designed to fit your needs and budget. Choose the perfect plan and enjoy the features you need without any hidden costs.
        </p>
        <div className="grid grid-cols-1 gap-8 mt-6 lg:grid-cols-3 xl:mt-12">
          {['Basic', 'Standard', 'Pro'].map((plan) => (
            <div
              key={plan}
              onClick={() => handlePlanClick(plan)}
              className={`flex items-center justify-between px-8 py-4 border cursor-pointer rounded-xl ${activePlan === plan ? 'border-blue-500' : 'border-gray-200'}`}
            >
              <div className="flex flex-col items-center space-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${activePlan === plan ? 'text-blue-600' : 'text-gray-400'} sm:h-7 sm:w-7`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h2 className={`text-lg font-medium ${activePlan === plan ? 'text-blue-600' : 'text-gray-700'} sm:text-xl`}>{plan}</h2>
              </div>
              <h2 className={`text-2xl font-semibold ${activePlan === plan ? 'text-blue-600' : 'text-gray-500'} sm:text-3xl`}>
                {plan === 'Basic' ? '$5' : plan === 'Standard' ? '$8' : '$15'} <span className="text-base font-medium">/Month</span>
              </h2>
            </div>
          ))}
        </div>
        <div className="p-8 mt-8 space-y-8 bg-gray-100 rounded-xl">
          {features[activePlan].map((feature, index) => (
            <div key={index} className="flex items-center justify-between text-gray-800">
              <p className="text-lg sm:text-xl">{feature}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500 sm:h-7 sm:w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button className="px-8 py-2 tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            Choose Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Packages;
