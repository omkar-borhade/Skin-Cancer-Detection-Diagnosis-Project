// src/pages/Home.jsx

import Carousel from '../components/Carousel';
import SkinCancerCard from '../components/SkinCancerCard';
import { cancerDetails } from '../data/cancerDetails'; // Import the cancer details

function Home() {
  
  const cancerTypes = Object.keys(cancerDetails).map((key) => ({ id: key, ...cancerDetails[key] }));

  return (
    <div>
     
      <Carousel />
      <div className="container mx-auto p-4">
        <h2 className="text-center text-2xl mt-8 mb-4">Types of Skin Cancer</h2>
        <div className="flex flex-wrap justify-center">
          {cancerTypes.map((cancerType) => (
            <SkinCancerCard key={cancerType.id} cancerType={cancerType} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
