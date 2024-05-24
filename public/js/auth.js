document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('container');

    // register form
    const regForm = document.getElementById('registerForm');
    const passwordInputRegisterForm = document.querySelector('#registerForm [type="password"]');
    const emailInputRegisterForm = document.querySelector('#registerForm [type="email"]');
    const usernameInputRegisterForm = document.querySelector('#registerForm [name="username"]');
    const registerBtn = document.getElementById('register');
    const registerNotification = document.querySelector('#registerForm span.notification');

    //auth form
    const authForm = document.getElementById('authForm');
    const passwordInputAuthForm = document.querySelector('#authForm input[name="pwd"]');
    const emailInputAuthForm = document.querySelector('#authForm input[name="email"]');
    const loginBtn = document.getElementById('login');
    const authNotification = document.querySelector('#authForm span.notification');

    registerBtn.addEventListener('click', () => {
  
        container.classList.add("active");
        emailInputRegisterForm.value = '';
        passwordInputRegisterForm.value = '';
        usernameInputRegisterForm.value = '';
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
        emailInputAuthForm.value = '';
        passwordInputAuthForm.value = '';
        registerNotification.style.display = 'none';
    });

    const dispRegNotification = function (message) {
        passwordInputRegisterForm.value = '';
        registerNotification.textContent = message;
        registerNotification.style.display = 'block';
        authNotification.style.display = 'none';
    };

    const dispAuthNotification = function (message) {
        passwordInputAuthForm.value = '';
        authNotification.textContent = message;
        authNotification.style.display = 'block';

        registerNotification.style.display = 'none';
    };

    const dispSucRegNotification = function (message) {
        console.log(message)
        authNotification.textContent = message;
        authNotification.style.display = 'block';

        container.classList.remove("active");

        emailInputAuthForm.value = emailInputRegisterForm.value;
        passwordInputAuthForm.value = '';
        emailInputRegisterForm.value = '';
        passwordInputRegisterForm.value = '';
        usernameInputRegisterForm.value = '';
        registerNotification.style.display = 'none';
    };


    // Registation POST method conntroller
    regForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(regForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch(regForm.action, {
                method: regForm.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status === 201) { // new user created
                const result = await response.json();
                dispSucRegNotification(result.success);

            } else if (response.status === 409) { // User already exists
                const result = await response.json();
                dispRegNotification(result.message)
            } else {
                const error = await response.json();
                dispRegNotification(error.message)
            }
        } catch (error) {
            console.log('Catch block error:', error);
        }
    });


    // Sign in POST method conntroller
    authForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(authForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch(authForm.action, {
                method: authForm.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();

                if (result.redirect) {
                    window.location.href = result.redirectUrl;
                }
            } else if (response.status === 400) { // bad request
                const result = await response.json();
                dispAuthNotification(result.message);

            } else if (response.status === 401) { //Unauthorized
                const result = await response.json();
                dispAuthNotification(result.message)
            } else {
                const error = await response.json();
                dispAuthNotification(error.message)
            }
        } catch (error) {
            console.log('Catch block error:', error);
        }
    });
});