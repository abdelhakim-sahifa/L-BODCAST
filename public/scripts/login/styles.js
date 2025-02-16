const passwordInput = document.getElementById('passwordInput');

    passwordInput.addEventListener('input', function() {
        if (passwordInput.value.length < 8) {
            passwordInput.classList.add('invalid');
            passwordInput.classList.remove('valid');
        } else {
            passwordInput.classList.add('valid');
            passwordInput.classList.remove('invalid');
        }
    });