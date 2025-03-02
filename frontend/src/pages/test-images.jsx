import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate to redirect to the report page
  const { prediction, skinImages, patient } = location.state || {}; // Destructure the state
  console.log("patient", patient);

  // Check if prediction data exists
  if (!prediction || prediction.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
        <h2 className="text-2xl font-semibold">No predictions available.</h2>
      </div>
    );
  }

  // Extract relevant prediction data (first prediction object)
  const { predicted_class, probabilities } = prediction[0].result || {};

  // Sort the probabilities and get the Top 3 predictions
  const sortedProbabilities = Object.entries(probabilities)
    .sort(([, probA], [, probB]) => probB - probA)
    .slice(0, 3);

  // Prepare chart data for probabilities
  const chartData = {
    labels: Object.keys(probabilities),
    datasets: [
      {
        label: 'Class Probabilities',
        data: Object.values(probabilities),
        backgroundColor: [
          '#6EE7B7',
          '#60A5FA',
          '#FCA5A5',
          '#FCD34D',
          '#A78BFA',
          '#F472B6',
        ],
        borderWidth: 2,
        hoverBorderColor: '#111827',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      title: {
        display: true,
        text: 'Prediction Probabilities',
        font: { size: 16 },
        color: '#374151',
      },
      tooltip: {
        enabled: true,
        mode: 'nearest', // Ensures tooltips appear even on zero values
        intersect: false, // Ensures tooltips show even when hovering nearby
        callbacks: {
          label: function (tooltipItem) {
            const percentage = (tooltipItem.raw * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest', // Ensures hover effect is triggered properly
      axis: 'x', // Allows hovering anywhere on the x-axis to trigger tooltip
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.2,
          callback: function (value) {
            return `${(value * 100).toFixed(0)}%`;
          },
        },
      },
    },
  };
  


  // Determine whether the result is cancerous, pre-cancerous, or non-cancerous
  const categorizePrediction = (className) => {
    if (className === 'Melanoma' || className === 'Basal Cell Carcinoma') {
      return 'Cancerous';
    } else if (className === 'Actinic Keratoses' || className === 'Vascular Lesions') {
      return 'Pre-cancerous';
    } else if(className ==='Normal Skin' ){
      return'Healthy  (no cancer detected in image)'

    }else{
      return 'Non-cancerous';
    }
  };

  const handleGenerateReport = () => {
    const reportData = {
      predicted_class: predicted_class || 'No prediction available',
      topPredictions: sortedProbabilities,
      category: categorizePrediction(predicted_class), // Add category to the report
      additionalInfo: 'More details can be added here', // Add more details if required
    };

    // Navigate to the report page and pass the data
    navigate('/generated-report', { state: { reportData, skinImages, prediction, patient } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl space-y-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">
          Test Results
        </h2>

        <div className="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-6 md:space-y-0">
          {/* Left Side: Uploaded Image and Top-3 Predictions */}
          <div className="w-full md:w-1/3 bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-lg font-medium text-center text-gray-700 mb-4">
              Uploaded Image
            </h3>
            {skinImages && skinImages.length > 0 && (
              <img
                src={skinImages[0]}
                alt="Uploaded Skin Image"
                className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-md"
              />
            )}
            <h3 className="text-lg font-medium mt-4 text-gray-700">
              Top-3 Predictions:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {sortedProbabilities.map(([className, prob], index) => (
                <li key={index}>
                  <strong>{className}</strong>: {`${(prob * 100).toFixed(2)}%`}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Prediction Details and Chart */}
          <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Prediction Details
            </h3>
            <p className="text-gray-600 mb-4">
              <strong>Prediction:</strong> {predicted_class || 'No prediction available.'}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Category:</strong> {categorizePrediction(predicted_class)}
            </p>
            <div className=" md:p-6 mb-6 w-full h-[50vh] min-h-[300px] max-h-[600px]">
  <Bar data={chartData} options={chartOptions} />
</div>

            <div className="text-center">
              <button
                onClick={handleGenerateReport}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg shadow hover:shadow-xl transition-shadow duration-200 hover:opacity-90"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
