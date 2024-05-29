document.addEventListener('DOMContentLoaded', () => {

    const body = document.getElementById('body');
    const menuToggle = document.querySelector('.menuToggle');

    async function setSidebarStatus(status) {
        // Example using fetch API to send a POST request with JSON data
        fetch('/cookies/sidebarStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sidebarStatus: status // Assuming this is the data you want to send
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
           //console.log(data); // Handle the response
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

    document.querySelector('.dropbtn').addEventListener('click', function () {
        const dropdownContent = document.querySelector('.dropdown-content');
        const symbol = document.querySelector('.symbol');
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            symbol.textContent = '+';
        } else {
            dropdownContent.style.display = 'block';
            symbol.textContent = '-';
        }
    });


    // Get groups
    async function getGroups() {
        // Example using fetch API to send a POST request with JSON data
        fetch('/dashboard/groups', {
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
            getCurrentUserGroup(data.groups)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    // Get user's active group
    async function getCurrentUserGroup(groups) {
        // Example using fetch API to send a POST request with JSON data
        fetch('/cookies/getCurrentGroupID', {
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
            changeDropdownContent(groups, data.currentGroupID)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    const dropDownButton = document.querySelector('#groupDropdown > button')
    const dropDownContent = document.querySelector('#groupDropdown > div')

    async function changeDropdownContent(groups, userGroup) {

        //Clear dropdown
        dropDownContent.innerHTML = '';

        let newOptions = '';
    
        groups.forEach(group => {
            if(group.id == userGroup){
                dropDownButton.innerHTML = `${group.name} <span class="symbol">+</span>`;
                dropDownButton.value = group.id;
            }
            else{
                newOptions += `<div value="${group.id}">${group.name}</div>`
            }
        });
        dropDownContent.innerHTML = newOptions;
    }

    // getGroups()

});
