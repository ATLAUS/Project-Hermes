# Project-Hermes

## This API serves as the business logic to help users connect based on the game they're playing and their current objective within that game.

### Features
- Match users playing the same game.
- Filter matches based on user-spectificed objective.
- Scalable and secure architecture.

### Table of Contents:
1. Setup
2. API References

## Setup
1. **Log in and Get Cookie (in browser):**
    - Navigate to https://project-hermes.onrender.com/ and log in or sign up.
    - Open the Inspector (or Developer tools).
    - In the Application tab, navigate to Storage > Cookie > https://project-hermes.onrender.com/.
    - Copy the Value field for the cookie with the Name appSession.
    - Make note of the values in Domain and Path fields for the appSession cookie.

2. **Add Cookie to Postman (in Postman):**
    - Click "Create New HTTP Request".
    - Click Cookies > Enter https://project-hermes.onrender.com/ As Domain > Add Domain.
    - Click Add Cookie > Change the Cookie name to AppSession > Replace “value” with the appSession value > Ensure Domain and Path fields match the appSession values.> Save.

- **Make a test request:**
    - To ensure that the cookie was saved correctly, make a GET request to https://project-hermes.onrender.com/.

If you received your user information in the response, setup is complete!

## API Reference
Postman docs: https://documenter.getpostman.com/view/33146123/2sA2rGvKYJ.

For a detailed reference of all available API endpoints and their parameters, please refer to the docs folder within the project directory.
