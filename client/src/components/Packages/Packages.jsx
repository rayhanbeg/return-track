
const Packages = () => {
  return (
    <div className="bg-white py-16">
      <div className="container px-6 py-8 mx-auto text-center">
        <h1 className="text-3xl font-semibold text-[#35A6DE] capitalize lg:text-4xl">Simple Pricing Plan</h1>
        <p className="max-w-2xl mx-auto mt-4 text-gray-500 xl:mt-6">
          Explore our straightforward pricing plans designed to fit your needs and budget. Choose the perfect plan and enjoy the features you need without any hidden costs.
        </p>
        <div className="grid grid-cols-1 gap-8 mt-12 lg:grid-cols-3">
          {['Basic', 'Standard', 'Pro'].map((plan) => (
            <div
              key={plan}
              className="flex flex-col items-center p-8 bg-white border rounded-xl shadow-md transform transition-transform hover:scale-105"
              style={{ borderColor: '#35A6DE' }}
            >
              <div className="flex flex-col items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-medium text-gray-700">{plan}</h2>
              </div>
              <h2 className="text-4xl font-semibold text-blue-600">
                {plan === 'Basic' ? '$5' : plan === 'Standard' ? '$8' : '$15'} <span className="text-lg font-medium">/Month</span>
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Packages;
