document.addEventListener('DOMContentLoaded', async () => {
    const addBudgetForm = document.getElementById('addBudgetForm');
    const formErrorElement = document.querySelector('.form_error_message');
    const tabelBody = document.querySelector('tbody');
    const inputElements = document.querySelectorAll('input');
    const noDataLable = document.querySelector('.table_section .message');

    // ADD NEW EMAIL FORM ACTION
    addBudgetForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(addBudgetForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch(addBudgetForm.action, {
                method: addBudgetForm.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) { 
                const result = await response.json();
                formErrorElement.classList.add('displayNone');
                getAllBudgets()
    
            } else if(response.status === 409 || response.status === 400){
                const result = await response.json();
                formErrorElement.classList.remove('displayNone');
                formErrorElement.innerHTML = result.message;
            }   else {
                const error = await response.json();
                console.log(error)
            }
        } catch (error) {
            console.log('Catch block error:', error);
        }
    });


    async function getAllBudgets() {
        // Example using fetch API to send a POST request with JSON data
        fetch('/budget/getAllBudgets', {
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
            // Loop through each input element and reset its value
            inputElements.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            
            updateTable(data.data)
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        });
    }

    function updateTable(data){
        console.log(data)
        if(data[0]){
            noDataLable.style.display = 'none';
        }else{
            noDataLable.style.display = 'flex';
        }
        


        let tableElements = '';
        let count = 1;

        data.forEach(row => {
            if(row.status === 1){
                const enabledEmailHTML = `
                    <tr>
                        <td>${count}</td>
                        <td>${row.name}</td>
                        <td>${row.budget_active_from}</td>
                        <td>${row.budget_active_to}</td>
                        <td>${row.amount}</td>
                        <td>
                            <span class="enabled">enabled</span>
                        </td>
                        <td>
                            <button id="toggleStatusBtn${row.id}" class="disabled">Disable</button>
                            <button id="removeBtn${row.id}" class="remove">Remove</button>
                        </td>
                    </tr>
                    `

                    tableElements += enabledEmailHTML;
            }else {
                const disabledEmailHTML = `
                <tr>
                    <td>${count}</td>
                    <td>${row.name}</td>
                    <td>${row.budget_active_from}</td>
                    <td>${row.budget_active_to}</td>
                    <td>${row.amount}</td>
                    <td>
                        <span class="disabled">disabled</span>
                    </td>
                    <td>
                        <button id="toggleStatusBtn${row.id}" class="enabled">Enable</button>
                        <button id="removeBtn${row.id}" class="remove">Remove</button>
                    </td>
                </tr>
                `

                tableElements += disabledEmailHTML;
            }

            count++;
        });

        tabelBody.innerHTML = '';
        tabelBody.innerHTML = tableElements;

        // removeButtonAddEvent(data)
        // statusButtonAddEvent(data)

    }

    getAllBudgets()

});