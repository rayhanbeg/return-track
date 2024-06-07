import { Helmet } from 'react-helmet-async';
import Rooms from '../../components/Home/Rooms';
import useAuth from '../../hooks/useAuth';
import Banner from '../../components/Banner/Banner';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import AboutUs from '../../components/About/AboutUs';
import Packages from '../../components/Packages/Packages';

const Home = () => {
  const { user, loading } = useAuth(); // Assume useAuth provides a loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <div>
      <Helmet>
        <title>ReturnTrack | Home</title>
      </Helmet>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner/>
        </div>
      ) : (
        <>
          {!user && (<>
            <Banner />
            <AboutUs/>
            <Packages/>
          </>)}
          {/* Rooms section */}
          {/* <Rooms /> */}
        </>
      )}
    </div>
  );
};

export default Home;
