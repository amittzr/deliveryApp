$(document).ready(function () {
    $('#companyForm').submit(function (event) {
        event.preventDefault();

        const name = $('#name').val();
        const site_url = $('#link').val();

        const companyData = {
            name: name,
            site_url: site_url
        };

        $.ajax({
            type: 'POST',
            url: '/company',
            contentType: 'application/json',
            data: JSON.stringify(companyData),
            success: function () {
                window.location.href = '/list';
                alert(`Company - ${name} added succesfully`);
            },
            error: function (xhr) {
                console.error('Error adding company:', xhr.responseText);
                alert('Failed to add company. Make sure the link is valid.');
            }
        });
    });
});
