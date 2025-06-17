import unittest
from app import app
import json

class SubmitPatientDataTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_submit_patient_data_with_sample_image(self):
        # Example public image URL (replace with your actual test image URL)
        sample_image_url = "https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/11/15/17/38/ds00190_-ds00439_im01723_r7_skincthu_jpg.jpg"
        sample_filename = "test_image.png"

        data = {
            "skinImages": [
                {
                    "url": sample_image_url,
                    "originalname": sample_filename
                }
            ]
        }

        response = self.client.post(
            '/submit_patient_data',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Print JSON response to show output during test run
        print("\nResponse JSON from /submit_patient_data:")
        print(response.get_json())
        
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIn('predictions', json_data)
        self.assertEqual(len(json_data['predictions']), 1)
        self.assertEqual(json_data['predictions'][0]['file'], sample_filename)

if __name__ == '__main__':
    unittest.main()
