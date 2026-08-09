const register_button = document.getElementById('register_button');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

register_button.addEventListener('click', function() {
    signUpUser();
});

async function signUpUser() {
    const { data, error } = await supabaseClient.auth.signUp({
        email: emailField.value,
        password: passwordField.value
    });

    console.log(data);
    console.log(error);
    console.log("Signed");
}