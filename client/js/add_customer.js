$(document).ready(function () {
    $('#customerForm').submit(function (event) {
        event.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();
        const street = $('#street').val();
        const streetNumber = $('#street_number').val();
        const city = $('#city').val();

        const customerData = {
            name,
            email,
            address: {
                street,
                number: streetNumber,
                city
            }
        };

        $.ajax({
            type: 'POST',
            url: '/customer',
            contentType: 'application/json',
            data: JSON.stringify(customerData),
            success: function (response) {
                alert('Customer added successfully!');
                window.location.href = '/list';
            },
            error: function (xhr, status, error) {
                console.error('Error adding customer:', error);
                alert('Failed to add customer.');
            }
        });
    });
});
