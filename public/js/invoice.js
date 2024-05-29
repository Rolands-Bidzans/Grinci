let currentInvoiceId = null;

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

const manageButtons = document.querySelectorAll('.manage-invoice-btn');
const overlay = document.querySelector('.overlay');

manageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const invoiceId = button.getAttribute('data-invoice-id');
        currentInvoiceId = invoiceId;
        const fullInvoiceId = `full-invoice-${invoiceId}`;
        const fullInvoiceModal = document.getElementById(fullInvoiceId);

        updateProgressBar('Unpaid');
        if (fullInvoiceModal.style.display === 'none') {
            fullInvoiceModal.style.display = 'block';
            overlay.style.display = 'block';
        } else {
            fullInvoiceModal.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
});

const closeButtons = document.querySelectorAll('.invoice-modal .close');
closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        const modalContent = closeButton.parentElement;
        const modalContainer = modalContent.parentElement;
        modalContainer.style.display = 'none'
        overlay.style.display = 'none';
    });
});

const nextInvoiceButtons = document.querySelectorAll('.invoice-modal .next-invoice-btn');

nextInvoiceButtons.forEach(nextButton => {
    nextButton.addEventListener('click', () => {
        const modalContent = nextButton.parentElement;
        const modalContainer = modalContent.parentElement;
        modalContainer.style.display = 'none';
        const currentInvoiceId = modalContainer.id.replace('full-invoice-', '');
        const nextInvoiceId = parseInt(currentInvoiceId) + 1;
        const nextInvoiceModal = document.getElementById(`full-invoice-${nextInvoiceId}`);
        if (nextInvoiceModal) {
            nextInvoiceModal.style.display = 'block';
        } else {
            console.log('No more invoices to display.');
        }
    });
});


const disapproveButtons = document.querySelectorAll('#disapproveInvoice');

disapproveButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const invoiceId = button.getAttribute('data-invoice-id');
        currentInvoiceId = invoiceId;

        try {
            const response = await fetch(`/invoice/${invoiceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'Disapproved',
                    is_paid: false
                })
            });

            if (!response.ok) {
                throw new Error('Failed to disapprove invoice');
            }

            const updatedInvoice = await response.json();
            updateProgressBar('Disapproved');
            updateInvoiceInView(updatedInvoice);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

const approveButtons = document.querySelectorAll('#approveInvoice');

approveButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const invoiceId = button.getAttribute('data-invoice-id');
        currentInvoiceId = invoiceId;

        try {
            const response = await fetch(`/invoice/${invoiceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'Paid',
                    is_paid: true
                })
            });

            if (!response.ok) {
                throw new Error('Failed to approve invoice');
            }

            const updatedInvoice = await response.json();
            updateProgressBar('Paid');
            updateInvoiceInView(updatedInvoice);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});


function updateInvoiceInView(updatedInvoice) {
    const row = document.querySelector(`.invoice-checkbox[value="${updatedInvoice.id}"]`).closest('tr');
    
        document.querySelector('.invoice-status').textContent = updatedInvoice.status;
        document.querySelector('.invoice-is-paid').textContent = updatedInvoice.is_paid ? 'Paid' : 'Unpaid';

        row.querySelector('span').textContent = updatedInvoice.status;
        row.querySelector('span').className = updatedInvoice.is_paid ? 'paid' : 'unpaid';
}

let els = document.getElementsByClassName('step');
let steps = [];
Array.prototype.forEach.call(els, (e) => {
  steps.push(e);
  e.addEventListener('click', (x) => {
    progress(x.target.id);
  });
});
//PROGRESS BAR
function updateProgressBar(status) {
    let stepNum;
    switch (status) {
      case 'Disaproved':
        stepNum = 0;
        break;
      case 'Unpaid':
        stepNum = 1;
        break;
      case 'Paid':
        stepNum = 3;
        break;
      default:
        stepNum = 2;
        break;
    }
    progress(stepNum);
  }

function progress(stepNum) {
  let p = stepNum * 30;
  document.getElementsByClassName('percent')[0].style.width = `${p}%`;
  steps.forEach((e) => {
    if (e.id === stepNum) {
      e.classList.add('selected');
      e.classList.remove('completed');
    }
    if (e.id < stepNum) {
      e.classList.add('completed');
    }
    if (e.id > stepNum) {
      e.classList.remove('selected', 'completed');
    }
  });
}