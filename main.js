document.addEventListener('DOMContentLoaded', () => {
    const servicesListDiv = document.getElementById('services-list');
    const enquiryForm = document.getElementById('enquiry-form');
    const formMessagesDiv = document.getElementById('form-messages');
    const enquiryServiceSelect = document.getElementById('enquiry-service');

    // Function to fetch and display services
    async function fetchAndDisplayServices() {
        try {
            const response = await fetch('/api/services');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const services = await response.json();

            if (servicesListDiv) {
                if (services.length === 0) {
                    servicesListDiv.innerHTML = '<p>No internet plans currently available. Please check back later.</p>';
                    return;
                }

                let html = '';
                services.forEach(service => {
                    html += `
                        <div class="service-card">
                            <h3>${service.name}</h3>
                            <p>${service.description || 'No description available.'}</p>
                            <p><strong>Speed:</strong> ${service.speed_mbps} Mbps</p>
                            <p><strong>Data:</strong> ${service.data_allowance_gb ? service.data_allowance_gb + ' GB' : 'Unlimited'}</p>
                            <p><strong>Price:</strong> $${parseFloat(service.price_monthly).toFixed(2)}/month</p>
                        </div>
                    `;
                    // Populate the select dropdown in the enquiry form
                    if (enquiryServiceSelect) {
                        const option = document.createElement('option');
                        option.value = service.id;
                        option.textContent = `${service.name} ($${parseFloat(service.price_monthly).toFixed(2)})`;
                        enquiryServiceSelect.appendChild(option);
                    }
                });
                servicesListDiv.innerHTML = html;
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            if (servicesListDiv) {
                servicesListDiv.innerHTML = '<p>Could not load internet plans at this time. Please try refreshing the page.</p>';
            }
        }
    }

    // Function to handle enquiry form submission
    async function handleEnquirySubmit(event) {
        event.preventDefault();
        if (!enquiryForm || !formMessagesDiv) return;

        const formData = new FormData(enquiryForm);
        const data = Object.fromEntries(formData.entries());
         // Ensure service_id is null if empty string (general enquiry)
        if (data.service_id === '') {
            data.service_id = null;
        }


        formMessagesDiv.innerHTML = '<p>Sending your enquiry...</p>';
        formMessagesDiv.style.color = 'black';

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                formMessagesDiv.innerHTML = `<p style="color: green;">${result.message || 'Enquiry submitted successfully!'}</p>`;
                enquiryForm.reset();
            } else {
                formMessagesDiv.innerHTML = `<p style="color: red;">Error: ${result.message || 'Could not submit enquiry.'}</p>`;
            }
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            formMessagesDiv.innerHTML = `<p style="color: red;">An unexpected error occurred. Please try again later.</p>`;
        }
    }

    // Initial setup
    if (servicesListDiv) { // Check if the services list div exists on the page
         fetchAndDisplayServices();
    }
    if (enquiryForm) { // Check if the enquiry form exists
         enquiryForm.addEventListener('submit', handleEnquirySubmit);
    }
});
