  import React, { useEffect, useState } from 'react';
  import { useLocation, Link } from 'react-router-dom';
  import Barcode from 'react-barcode';
  import { v4 as uuidv4 } from 'uuid';
  import { useNavigate } from "react-router-dom";
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';

  import { Bar } from 'react-chartjs-2';
  import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
  import QRCode from 'react-qr-code';

  const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
  const REPO_NAME = import.meta.env.VITE_GITHUB_REPO;
  const BRANCH = import.meta.env.VITE_GITHUB_BRANCH;
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
 
  const GeneratedReport = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { prediction, patient, skinImages, reportData } = location.state || {};

    if (!reportData) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
          <h2 className="text-2xl font-semibold">No report available.</h2>
        </div>
      );
    }

    const {
      patientName,
      patientAge,
      patientSex,
      skinImage,
      predicted_class,
      category,
      topPredictions,
      
    } = reportData;

    const { name, age, sex, bloodGroup, mobileNumber, email, address,_id, } = patient || {};



    

    
    // Generate a unique report ID (could also use UUID or other unique identifiers)
    // Generate a unique report ID based on the patient _id
    const [reportId, setReportId] = useState(null);

    useEffect(() => {
      if (_id) {
        let storedReportId = localStorage.getItem(`reportId-${_id}`);
        
        if (!storedReportId) {
          storedReportId = Math.floor(Math.random() * 10000).toString();
          localStorage.setItem(`reportId-${_id}`, storedReportId);
        }

        setReportId(storedReportId);
      }
    }, [_id]);
    
    useEffect(() => {
      // Save report data to localStorage
      if (reportId && reportData) {
        localStorage.setItem(`reportData-${reportId}`, JSON.stringify(reportData));
      }
    }, [reportId, reportData]);
    

    const [downloadUrl, setDownloadUrl] = useState(null);

    // State to hold the generated PDF-----------------------------------------------------------------
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        const printSection = document.getElementById("print-section");
        if (printSection) {
            const timer = setTimeout(() => {
                html2canvas(printSection, { scale: 2,
                  x: 10, // Left margin (10px)
                  y: 10, // Top margin (10px)
                  width: printSection.offsetWidth - 20, // Subtracting left and right margin
                  height: printSection.offsetHeight - 20,}).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

                    const imgWidth = 210;
                    const pageHeight = 297;
                    const scaleFactor = Math.min(imgWidth / canvas.width, pageHeight / canvas.height);
                    const scaledWidth = canvas.width * scaleFactor;
                    const scaledHeight = canvas.height * scaleFactor;
                    const xOffset = (imgWidth - scaledWidth) / 2;
                    const yOffset = (pageHeight - scaledHeight) / 2;

                    pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);

                    // Convert to Blob & Upload to GitHub
                    const pdfBlob = pdf.output("blob");
                    setPdfData(pdfBlob);

                    // Upload with patient ID as filename
                    uploadToGitHub(pdfBlob, "Report.pdf", setDownloadUrl);

                });
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            console.error("Print section not found.");
        }
    }, [_id]);

    const fileName = `Report_${_id}.pdf`;  // Ensure each PDF is unique
    
    const uploadToGitHub = async (pdfBlob, fileName, setDownloadUrl) => {
      if (!setDownloadUrl || typeof setDownloadUrl !== "function") {
          console.error("❌ setDownloadUrl is not a valid function.");
          return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
          const base64Data = reader.result.split(",")[1];

          const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${fileName}`;
          
          let sha = null;
          try {
              const getFileResponse = await fetch(url, {
                  headers: {
                      "Authorization": `token ${GITHUB_TOKEN}`,
                      "Accept": "application/vnd.github.v3+json",
                  },
              });

              if (getFileResponse.ok) {
                  const fileData = await getFileResponse.json();
                  sha = fileData.sha; // Required for updates
              }

              const response = await fetch(url, {
                  method: "PUT",
                  headers: {
                      "Authorization": `token ${GITHUB_TOKEN}`,
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      message: `Uploading ${fileName}`,
                      content: base64Data,
                      branch: "main", // Update if using a different branch
                      sha: sha || undefined, // Include SHA if updating
                  })
              });

              const result = await response.json();
              if (response.ok) {
                  const fileUrl = result.content.download_url || result.content.html_url;
                  setDownloadUrl(fileUrl);  // 🔥 Ensure this function exists
                  console.log("✅ Uploaded successfully:", fileUrl);
              } else {
                  console.error("❌ Upload failed:", result);
              }
          } catch (error) {
              console.error("❌ Error uploading file:", error);
          }
      };
  };


  const handleDownload = () => {
    if (!pdfData) {
        console.error("❌ PDF is not generated yet.");
        return;
    }

    const url = URL.createObjectURL(pdfData);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SkinCancerReport.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


    
const handleEmail = () => {
  // Compose the patient information and the personalized message
  const emailBody = `
  Dear ${patientSex === 'Male' ? 'Mr.' : 'Ms.'} ${patientName || name},

We have checked your skin lesion image using our AI-powered skin cancer detection model, and we would like to share the test results:  
**Skin cancer type detected:** ${predicted_class}.

🔎 **What does this mean?**  
Our AI model has analyzed your skin lesion based on advanced deep learning techniques. While this is not a final diagnosis, the result indicates that further medical consultation is recommended.

🏥 **Next Steps:**  
- We strongly advise you to consult a certified dermatologist or oncologist as soon as possible.  
- Early detection and treatment can significantly improve outcomes.  
- Maintain a record of your skin condition and track any changes.  

💡 **Tips for Skin Care & Prevention:**  
- Avoid prolonged exposure to direct sunlight and use sunscreen (SPF 30+).  
- Check your skin regularly for any new or changing moles or spots.  
- Maintain a healthy lifestyle with a balanced diet and hydration.  

📄 **Access Your Report Online**  
You can download your detailed report from our website: [View Report](https://raw.githubusercontent.com/omkar-borhade/Skin_report/main/Report.pdf)  

Your health is our priority. If you have any concerns, please consult a medical professional at the earliest convenience.  

Best regards,  
**Your AI Skin Cancer Detection Team**  
AI-Powered Skin Health Monitoring  
  `;

  // Assuming patientEmail is the email address to which you want to send the report
  const patientEmail = email; // Replace with actual email if needed

  // Compose the email link for Gmail
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${patientEmail}&su=Skin%20Cancer%20Detection%20Report&body=${encodeURIComponent(emailBody)}`;

  // Open Gmail compose window
  window.open(gmailUrl, '_blank');
};







    // Full Bar Chart Data (Using prediction[0].result.probabilities)
    const fullChartData = {
      labels: Object.keys(prediction[0].result.probabilities),
      datasets: [
        {
          label: 'Prediction Probability (%)',
          data: Object.values(prediction[0].result.probabilities).map((prob) => (prob * 100).toFixed(2)),
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Light teal
          borderColor: 'rgba(75, 192, 192, 1)', // Darker teal
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };
  console.log("id",_id)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-8 bg-gradient-to-r from-blue-50 to-blue-100">
        <div id="print-section"  className="bg-white p-9 rounded-2xl shadow-lg w-full max-w-4xl space-y-6 border border-gray-200">
      {/* Header */}
  <header className="mb-6 flex justify-between items-center">
    {/* Logo and Title */}
    <div className="flex items-center">
      <img
        src="/image/Logo.png"
        alt="Logo"
        className="h-12 mr-4" // Adjust logo size and margin
      />
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Skin Cancer Detection Report</h1>
        <p className="text-sm text-gray-600">Generated by our AI-powered system</p>
      </div>
    </div>

    {/* Report Header */}
    <div className="flex flex-col items-center space-x-4">
      {/* QR Code */}
      <div className="flex justify-end m-2">
      {downloadUrl && <QRCode value={downloadUrl} size={70} />}

      </div>

      {/* Date and Report ID */}
      <div className="text-right">
        <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Report ID: {reportId}</p>
      </div>
    </div>
    
  </header>
  {/* Blue border line after header */}
  <div className="border-b-4 border-blue-500 mb-6"></div> {/* Blue color border */}

          {/* Patient Information */}
          <div className="border-b-2 pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-700">Patient Information</h3>
              <div className="flex justify-end m-2 w-60">
        {/* Display the barcode based on the unique fingerprint _id */}
        <Barcode value={_id} width={1} height={30}   fontSize={7}/>
      </div>        
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <table className="w-full text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-2"><strong>Name:</strong> {patientName || name}</td>
                    <td className="py-2"><strong>Age:</strong> {patientAge || age}</td>
                  </tr>
                  <tr>
                    <td className="py-2"><strong>Sex:</strong> {patientSex || sex}</td>
                    <td className="py-2"><strong>Blood Group:</strong> {bloodGroup}</td>
                  </tr>
                  <tr>
                    <td className="py-2"><strong>Mobile Number:</strong> {mobileNumber}</td>
                    <td className="py-2"><strong>Email:</strong> {email}</td>
                  </tr>
                  <tr>
                    <td className="py-2" colSpan={2}><strong>Address:</strong> {address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Skin Image and Prediction Value */}
          <div className="flex flex-col sm:flex-row pb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-700">Skin Image</h3>
              <div className="flex justify-center mt-4">
                <img
                  src={skinImage || skinImages}
                  alt="Skin Image"
                  className="w-full sm:w-48 h-auto object-cover rounded-lg border-2 border-gray-300 shadow-md"
                />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-700">Prediction Results</h3>
              <p className="mt-4 text-sm">
                <strong> Diagnosis: </strong>
                <span className="bg-lime-100 p-1 ">{predicted_class}</span>
              </p>
              <p className="mt-2 text-sm"><strong>Diagnosis Probabilities:</strong></p>
              <table className="w-full mt-2 text-sm text-gray-600">
                <tbody>
                  {topPredictions.map(([className, prob], index) => (
                    <tr key={index}>
                      <td className="py-2">{className}</td>
                      <td className="py-2 text-right">{(prob * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-2 text-sm">
    <strong>Category: </strong>
    <span
      className={`p-1  ${
        category === 'Cancerous'
          ? 'bg-red-100 text-red-700'
          : category === 'Non-cancerous'
          ? 'bg-green-100 text-green-700'
          : category === 'Pre-cancerous'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-700' // Default background for other cases
      }`}
    >
      {category}
    </span>
  </div>


          {/* Bar Chart */}
          <div className="w-full pb-4">
            <h3 className="text-2xl font-semibold text-gray-700">Prediction Bar Chart</h3>
            <div className="h-64">
              <Bar data={fullChartData} options={chartOptions} />
            </div>
          </div>

          {/* Precautions to Take */}
          <div className="border-b-2 pb-4">
            <h3 className="text-lg font-semibold text-gray-700">Precautions to Take</h3>
            <p className="text-sm text-gray-600">
              {`1. Regularly monitor your skin for changes in moles and growths.`}
            </p>
            <p className="text-sm text-gray-600">
              {`2. Avoid excessive sun exposure and wear protective clothing.`}
            </p>
            <p className="text-sm text-gray-600">
              {`3. Seek medical attention for suspicious skin lesions.`}
            </p>
          </div>

          

          {/* Footer */}
          <footer className="text-center text-sm text-gray-600 mt-6">
            <p>&copy; 2025 Skin Cancer Detection System. All Rights Reserved.</p>
          </footer>
        </div>
        {/* Action Buttons */}
  <div className="flex justify-between items-center space-x-4 pt-4">
    <button
      className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
      onClick={handleDownload}
    >
      Download PDF
    </button>
    <button
      className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
      onClick={handleEmail}
    >
      Email Report
    </button>
    <button
      className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700"
      onClick={() => navigate("/nearby")}
    >
      Find Nearby Doctors
    </button>
  </div>

      </div>
    );
  };

  export default GeneratedReport;
