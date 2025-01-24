// src/pages/Home.jsx
import Carousel from '../components/Carousel';
import SkinCancerCard from '../components/SkinCancerCard';
import { cancerDetails } from '../data/cancerDetails'; // Import the cancer details
import NearbyDoctors from '../components/NearbyDoctors';

function Home() {
  const cancerTypes = Object.keys(cancerDetails).map((key) => ({ id: key, ...cancerDetails[key] }));

  return (
    <div>
      <Carousel />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-gray-800">
          Types of Skin Cancer
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {cancerTypes.map((cancerType) => (
            <SkinCancerCard key={cancerType.id} cancerType={cancerType} />
          ))}
        </div>
      </div>
      <div className="bg-gray-50 py-8">
        <NearbyDoctors />
      </div>
    </div>
  );
}

export default Home;
