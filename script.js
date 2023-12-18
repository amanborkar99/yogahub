function submitForm() {
    // Get form data
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const month = document.getElementById('month').value;
    const batch = document.getElementById('batch').value;

    // Validate age
    if (age < 18 || age > 65) {
        alert('Only people within the age limit of 18-65 can enroll.');
        return;
    }

    // Validate batch
    const validBatches = ['6-7AM', '7-8AM', '8-9AM', '5-6PM'];
    if (!validBatches.includes(batch)) {
        alert('Invalid batch selection.');
        return;
    }

    // Prepare data to be sent to the server
    const formData = {
        name,
        age,
        month,
        batch,
    };

    // Make API call to register user and make payment
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Handle the response from the server
        if (data.success) {
            alert('Registration and payment successful!');
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
        alert('An error occurred. Please try again later.');
    });
}
