var url = (window.location.hostname.includes("localhost"))
    ? "http://localhost:8080/api/auth/google"
    : "https://restserver-webserver-curso.herokuapp.com/api/auth/google";

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;

    const data = { id_token };

    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(data => console.log('Nuestro server', data))
        .catch(err => console.error(err));

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        location.reload();
        //console.log('User signed out.');
    });
}