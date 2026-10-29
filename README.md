GramArogya 🏥

Smart Healthcare Access for Rural and Underserved Communities

GramArogya is a healthcare accessibility platform designed to connect patients in rural and underserved areas with government healthcare facilities, doctors, and essential healthcare services. It aims to simplify access to medical guidance through symptom triage, telemedicine, digital health records, emergency assistance, and government healthcare scheme awareness.

The platform focuses on bridging the gap between rural patients and quality healthcare through a connected, accessible, and technology-driven healthcare workflow.

Live Demo - https://gram-arogya-mu.vercel.app/

🚨 Problem Statement

People living in rural and underserved communities often face challenges such as:

Limited access to doctors and medical specialists.

Delays in identifying the urgency of medical symptoms.

Difficulty finding nearby government healthcare facilities.

Lack of accessible and transferable digital health records.

Limited awareness of government healthcare schemes.

Challenges in obtaining timely emergency assistance and follow-up care.

GramArogya aims to address these challenges through a unified digital healthcare platform.

💡 Key Features

1. AI-Assisted Symptom Triage

Helps users understand the urgency of their reported symptoms.

Provides guidance on whether to seek emergency help, visit a PHC, consult a doctor, or undergo human review.

Designed to support multiple languages.

AI-assisted symptom understanding is being developed further.

Note: GramArogya is intended to provide urgency guidance, not medical diagnoses or prescriptions.

2. Nearby Government Healthcare Facilities

Helps patients locate nearby government Primary Health Centres (PHCs) and hospitals.

Supports access to appropriate healthcare facilities based on patient needs.

3. Telemedicine

Connects patients with doctors for remote consultations.

Helps reduce unnecessary travel for patients in remote areas.

Supports access to medical expertise when in-person consultation is difficult.

4. Emergency Assistance

Supports an emergency assistance workflow for patients and their families.

Designed to prioritize urgent safety guidance and emergency services when serious symptoms are detected or the emergency button is activated.

Aims to help users locate nearby healthcare facilities and request ambulance assistance where integration is available.

5. Digital Health Records

Maintains patient-related healthcare information digitally.

Aims to improve continuity of care and information sharing during consultations and referrals.

6. Government Healthcare Scheme Assistance

Helps users discover relevant government healthcare schemes.

Aims to improve awareness of available healthcare benefits and eligibility requirements.

7. Follow-Up Reminders

Designed to help patients remember follow-up consultations and recommended appointments.

Supports continuity of healthcare beyond the initial consultation.

🔄 How GramArogya Works

Patient Registration: The patient creates an account and accesses the platform.

Symptom Reporting: The patient reports symptoms using the available input methods.

Urgency Assessment: The triage system evaluates the reported symptoms and provides appropriate urgency guidance.

Healthcare Access: The patient is guided toward a nearby PHC, telemedicine consultation, or emergency assistance, depending on urgency.

Consultation and Referral: Doctors can assess the patient and recommend further medical evaluation or referral.

Digital Records: Relevant patient information supports continuity of care.

Scheme Assistance: Patients can explore applicable government healthcare schemes.

Follow-Up: Patients can receive reminders for future appointments and follow-up care.

Emergency priority: Suspected emergencies must bypass the routine telemedicine workflow and direct users toward urgent professional assistance.

🛠️ Technology Stack

Component

Technology

Frontend

React.js, Vite

Backend

Node.js

Backend Framework

Express.js

Database

MongoDB Atlas

ODM

Mongoose

Authentication

JSON Web Tokens (JWT)

API Testing

Postman

Configuration

dotenv

Development Tools

Git, GitHub, npm

Additional integrations and technologies may be added as development progresses.

🏗️ System Architecture

GramArogya follows a client-server architecture.

Frontend: Provides the user interface for patients and healthcare professionals.

Backend API: Handles application logic, authentication, authorization, and healthcare workflows.

Database: Stores application data using MongoDB.

Authentication Layer: Uses JWT-based authentication and role-based access controls.

Healthcare Services: Designed to integrate triage, facility discovery, telemedicine, emergency workflows, and follow-up services.

              Patient / Doctor
                     |
                     v
             React.js Frontend
                     |
                     v
              Express.js API
                     |
          +----------+----------+
          |          |          |
          v          v          v
     Authentication  Triage   Healthcare
        (JWT)        Logic     Workflows
          |          |          |
          +----------+----------+
                     |
                     v
                MongoDB Atlas

🔐 Security and Privacy

GramArogya is being developed with healthcare data protection in mind.

Planned and applicable safeguards include:

Secure password handling.

JWT-based authentication.

Role-based authorization for protected resources.

Environment variables for sensitive configuration.

Input validation and error handling.

Restricted access to patient health information.

Secure communication and appropriate data protection practices.

Production deployment requires additional security testing, privacy controls, and validation of all healthcare integrations.
