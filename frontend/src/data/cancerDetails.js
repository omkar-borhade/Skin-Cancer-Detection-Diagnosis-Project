export const cancerDetails = {
    1: {
        name: "Melanoma",
        shortInfo: "A serious type of skin cancer.",
        description: "Melanoma is the most serious type of skin cancer. It develops in the cells (melanocytes) that produce melanin — the pigment that gives your skin its color. Melanoma can occur anywhere on your body, including areas not exposed to the sun. Early detection is critical, and it often starts as a change in an existing mole or a new abnormal growth.",
        causes: "Melanoma is primarily caused by exposure to ultraviolet (UV) radiation from the sun or tanning beds. Family history, fair skin, and frequent sunburns also increase risk.",
        symptoms: "A new, unusual growth or a change in an existing mole. The ABCDEs of melanoma include Asymmetry, Border irregularity, Color variations, Diameter larger than 6mm, and Evolving in size, shape, or color.",
        treatment: "Treatment options include surgery, immunotherapy, targeted therapy, radiation therapy, and chemotherapy.",
        image: "/image/Melanoma.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    2: {
        name: "Basal Cell Carcinoma",
        shortInfo: "The most common type of skin cancer.",
        description: "Basal Cell Carcinoma is the most common type of skin cancer and is typically caused by prolonged exposure to ultraviolet (UV) radiation from the sun. It rarely spreads to other parts of the body, but can cause significant damage to surrounding tissues if not treated.",
        causes: "Long-term exposure to UV radiation, fair skin, family history, and exposure to radiation or arsenic.",
        symptoms: "A pearly or waxy bump, a flat, flesh-colored or brown scar-like lesion, or a bleeding or scabbing sore that heals and returns.",
        treatment: "Treatment usually involves surgical removal, cryotherapy, or topical medications.",
        image: "/image/basal_cell_carcinoma.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    3: {
        name: "Squamous Cell Carcinoma",
        shortInfo: "A common form of skin cancer.",
        description: "Squamous Cell Carcinoma is a common form of skin cancer that develops in the squamous cells. These are found in the outer layer of the skin. It is usually not life-threatening but can be aggressive if untreated and can spread to other parts of the body.",
        causes: "Frequent sun exposure, fair skin, smoking, and a weakened immune system.",
        symptoms: "A firm, red nodule; a flat sore with a scaly crust; or a new sore or raised area on a pre-existing scar.",
        treatment: "Surgery is the most common treatment. In some cases, radiation or topical chemotherapy may be used.",
        image: "/image/Squamous-cell-carcinoma.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    4: {
        name: "Merkel Cell Carcinoma",
        shortInfo: "A rare and aggressive skin cancer.",
        description: "Merkel Cell Carcinoma (MCC) is a rare type of skin cancer that originates from Merkel cells, which are located in the skin. MCC is aggressive and can metastasize quickly, making early detection vital.",
        causes: "The primary cause is believed to be exposure to UV light. Other risk factors include a weakened immune system and infection with the Merkel cell polyomavirus.",
        symptoms: "A painless, firm, and dome-shaped nodule that may be skin-colored, red, or blue. It usually appears on sun-exposed areas of the body.",
        treatment: "Treatment often involves surgical removal, radiation therapy, and may include chemotherapy for advanced cases.",
        image: "/image/Merkel-Cell-Carcinoma.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    5: {
        name: "Kaposi Sarcoma",
        shortInfo: "A cancer that causes lesions in the skin.",
        description: "Kaposi Sarcoma is a cancer that causes lesions in the skin, as well as in other organs. It is often associated with immunocompromised states, such as HIV/AIDS.",
        causes: "The primary cause is the human herpesvirus 8 (HHV-8). It is more common in individuals with weakened immune systems.",
        symptoms: "Lesions that appear as purple, red, or brown spots on the skin. They can also occur in the mouth and other internal organs.",
        treatment: "Treatment options include antiretroviral therapy for HIV-positive patients, chemotherapy, and radiation therapy.",
        image: "/image/KaposiSarcoma.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    6: {
        name: "Atypical Melanocytic Neoplasm",
        shortInfo: "A neoplasm that may exhibit malignant features.",
        description: "Atypical Melanocytic Neoplasm includes lesions that may exhibit malignant features and can resemble melanoma. It is essential to monitor these closely for changes.",
        causes: "Exact causes are unknown, but factors include genetic predisposition and sun exposure.",
        symptoms: "Unusual moles that are asymmetrical, have irregular borders, varied colors, and larger than normal diameters.",
        treatment: "Treatment typically involves surgical excision and regular monitoring for changes.",
        image: "/image/atypical melanocytic neoplasm.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    7: {
        name: "Actinic Keratosis",
        shortInfo: "A precancerous condition that can lead to skin cancer.",
        description: "Actinic Keratosis (AK) is a rough, scaly patch on sun-exposed skin. It is considered a precancerous condition and can lead to squamous cell carcinoma if left untreated.",
        causes: "Prolonged exposure to ultraviolet (UV) light from the sun or tanning beds.",
        symptoms: "Rough, dry patches of skin that may be red, pink, or brown. They often feel like sandpaper.",
        treatment: "Treatment may involve topical chemotherapy, cryotherapy, or photodynamic therapy.",
        image: "/image/Actinic.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    },
    8: {
        name: "Paget's Disease of the Nipple",
        shortInfo: "A rare form of breast cancer that can occur on the nipple.",
        description: "Paget's Disease of the Nipple is a rare form of breast cancer that manifests as eczema-like changes on the nipple. It often indicates the presence of underlying breast cancer.",
        causes: "Exact causes are unknown, but it is associated with ductal carcinoma in situ (DCIS) and other breast cancers.",
        symptoms: "Itching, redness, and flaking or crusting of the nipple skin. There may be a discharge from the nipple.",
        treatment: "Treatment typically involves surgical removal of the affected tissue, and in some cases, additional treatments for breast cancer.",
        image: "/image/paget.jpg",
        doctors: [
            { name: "Dr. Mukul Gharote", location: "Sai Shree Super Speciality Hospital, Nashik", specialization: "Oncologist" },
            { name: "Dr. Bhushan Nemade", location: "Tata Memorial Hospital, Mumbai", specialization: "Radiation Oncologist" }
        ]
    }
};
