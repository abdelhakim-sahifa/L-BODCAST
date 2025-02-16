
    const passwordInput = document.getElementById('passwordInput');
    const reWritePassword = document.getElementById('rpasswordInput')
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')

    passwordInput.addEventListener('input', function() {
        if (passwordInput.value.length < 8) {
            passwordInput.classList.add('invalid');
            passwordInput.classList.remove('valid');
        } else {
            passwordInput.classList.add('valid');
            passwordInput.classList.remove('invalid');
        }
    });

    reWritePassword.addEventListener('input'
        ,
        function( ){
            if(passwordInput.value == reWritePassword.value){
                reWritePassword.className = 'valid';
              
                
            }
            else{
                reWritePassword.className = 'invalid';
               


            }
        }
    )


    
    firstName.addEventListener('input'
        ,
        function( ){
            if(isValidName(firstName.value)){
                firstName.className = 'valid';
              
                
            }
            else{
                firstName.className = 'invalid';
               


            }
        }
    )

    lastName.addEventListener('input'
        ,
        function( ){
            if(isValidName(firstName.value)){
                lastName.className = 'valid';
              
                
            }
            else{
                lastName.className = 'invalid';
               


            }
        }
    )


    function isValidName(name) {
    const regex = /^[A-Za-z\s]+$/;  // This will only match letters and spaces
    return regex.test(name);  // Returns true if the name is valid (only letters and spaces)
}

var isShowed = false
document.getElementById('showPassword').addEventListener('click', (event) => {
    const eyeIcon =  event.target ;

 if(isShowed){
    passwordInput.type = 'password';
    reWritePassword.type = 'password';

    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
    isShowed = false;
  
}
  else{
    passwordInput.type = 'text';
    reWritePassword.type = 'text';
    eyeIcon.classList.add('fa-eye-slash');
    eyeIcon.classList.remove('fa-eye');
    
    isShowed = true;
  }
  
 
});

