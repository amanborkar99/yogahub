# Yogahub2 Class Admission Form Web Application

##link to the app [https://yogahub2.netlify.app/](https://yogahub2.netlify.app/)

## Introduction

- Welcome to the Yoga Class Admission Form application! This project is a simple web-based solution for managing admissions to monthly yoga classes. The application allows users to fill out an admission form, choose a batch, and make monthly payments. The backend is implemented in Node.js with Express, and the data is stored in a MySQL database hosted on Amazon RDS. The frontend is built using HTML, CSS, and JavaScript.

### Frontend part

- The main HTML file is index.html, which includes the form elements for user registration. The form captures essential information such as name, age, selected month, and preferred batch. The user is required to fill out the form to enroll in the yoga classes.
- Form validation is implemented using JavaScript in script.js. The submitForm function is triggered when the user clicks the "Pay Rs. 500" button. It performs the following validations:
    - **Age Validation**: Ensures that the user's age is within the specified range of 18 to 65 years.

    - **Batch Validation**: Checks if the selected batch is valid. Valid batches include "6-7AM," "7-8AM," "8-9AM," and "5-6PM."

If any validation fails, an alert message is displayed to notify the user of the error.

## Making API Calls

- After successful validation, the form data is prepared and sent to the server using a fetch API call. The backend API endpoint `/api/register` is targeted with a POST request, and the form data is sent in JSON format. The response from the server is then processed, and appropriate alerts are displayed based on the success or failure of the registration and payment process.
- This **`/api/* http://13.232.69.5:3000/:splat 200`** is the actual redirect path so that actual url will be **`http://13.232.69.5:3000/register`**


## API Endpoints

1. **POST** `/register`

    - **Description**: This endpoint is used for user registration in the yoga classes. It handles form submissions from the frontend, validates the provided data, and inserts new user entries into the MySQL database.

    - **Request Type:** POST

    - **Request Body:**
    ```json
    {
        "name": "John Doe",
        "age": 30,
        "month": "January",
        "batch": "6-7AM"
    }
    ```
    - **Response:**
        - Success (HTTP Status Code: 200):
        ```json
        {
            "success": true,
            "message": "Registration successful"
        }
        ```
        - Failure (HTTP Status Code: 400 or 500):
        ```json
        {
            "success": false,
            "message": "Invalid data" || "Entry already exists" || "You can only change batch in the upcoming month" || "Internal Server Error"
        }
        ```
        Depending on logic such that one cannont change batch for that month respective logic is written in `index.js` file please go through it.


2. **GET** `/users`
- **Description**: This endpoint retrieves a list of all registered users from the MySQL database.

    - **Request Type:** GET
    - **Response:**
        - Success (HTTP Status Code: 200):
        ```json
        {
            "Name": "John Doe",
            "Age": 30,
            "Month": "January",
            "Batch": "6-7AM"
        }
        ```
        - Failure (HTTP Status Code: 400 or 500):
        ```json
        {
            "success": false,
            "message": "Internal Server Error"
        }
        ```
3. **Default Path** 

- **Description**: This endpoint retrieves a list of all registered users from the MySQL database.

    - **Request Type:** GET
    - **Response:**

    `Hello, this is your Node.js server on AWS EC2!`

4. **Deployment**

The backend is deployed on an AWS EC2 instance and listens on port 3000. The base URL for API calls is `http://13.232.69.5:3000/` Ensure that the server is running to handle frontend form submissions.
    