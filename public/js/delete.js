document.addEventListener('DOMContentLoaded', () => {

    const body = document.getElementById('body');
    const menuToggle = document.querySelector('.menuToggle');

    async function setSidebarStatus(status) {
        // Example using fetch API to send a POST request with JSON data
        fetch('/invoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
           console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
    menuToggle.onclick = function () {
        menuToggle.classList.toggle('active');
        body.classList.toggle('active');

        if (menuToggle.classList.contains('active')) {
            setSidebarStatus(true)
        } else {
            setSidebarStatus(false)
        }

    }
});