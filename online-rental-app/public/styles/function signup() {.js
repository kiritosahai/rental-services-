function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("authMessage").textContent = data.message;
    });
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            document.getElementById("authMessage").textContent = "Login successful!";
        } else {
            document.getElementById("authMessage").textContent = "Login failed.";
        }
    });
}

function makePayment() {
    const amount = document.getElementById("amount").value;

    fetch("/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.clientSecret) {
            document.getElementById("paymentMessage").textContent = "Payment Successful!";
        } else {
            document.getElementById("paymentMessage").textContent = "Payment Failed.";
        }
    });
}
