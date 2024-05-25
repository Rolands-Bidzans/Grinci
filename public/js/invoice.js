document.addEventListener('DOMContentLoaded', () => {

    const body = document.getElementById('body');
    const menuToggle = document.querySelector('#pullInvoices');

    async function setSidebarStatus(status) {
        // Example using fetch API to send a POST request with JSON data
        fetch('/invoice', {
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

document.addEventListener('DOMContentLoaded', () => {
    const allInvoicesCheckbox = document.querySelector('.all-invoices');
    const invoiceCheckboxes = document.querySelectorAll('.invoice-checkbox');

    allInvoicesCheckbox.addEventListener('change', () => {
        const isChecked = allInvoicesCheckbox.checked;
        
        invoiceCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });
});

const deleteButton = document.querySelector('#deleteInvoices');

deleteButton.addEventListener('click', async () => {
    const checkedCheckboxes = document.querySelectorAll('.invoice-checkbox:checked');
    const invoiceIds = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

    if (invoiceIds.length > 0) {
        try {
            const response = await fetch('/invoice', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ invoiceIds }) // Send the invoice IDs as JSON
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            console.log('Invoices deleted:', data);
            checkedCheckboxes.forEach(checkbox => {
                checkbox.closest('.invoice').remove();
            });
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    } else {
        console.log('No invoices selected.');
    }
});