function submitForm() {
    // Get form data
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const batch = document.getElementById('batch').value;

    // Prepare data to be sent to the server
    const formData = {
        name,
        age,
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
            alert('Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
        alert('An error occurred. Please try again later.');
    });
}
