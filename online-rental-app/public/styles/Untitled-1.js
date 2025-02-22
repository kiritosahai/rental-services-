document.addEventListener("DOMContentLoaded", loadProducts);

function loadProducts() {
    const productList = document.querySelector(".product-list");
    const products = [
        { id: "101", name: "Laptop", status: "Available" },
        { id: "102", name: "Bike", status: "Rented" },
        { id: "103", name: "Camera", status: "Available" }
    ];

    products.forEach(prod => {
        let div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `<h3>${prod.name}</h3><p>Status: ${prod.status}</p>`;
        productList.appendChild(div);
    });
}

function trackProduct() {
    const id = document.getElementById("trackId").value;
    const trackingResult = document.getElementById("trackingResult");

    fetch(`/track/${id}`)
        .then(response => response.json())
        .then(data => {
            trackingResult.textContent = data.message;
        });
}

function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const messages = document.getElementById("messages");

    messages.innerHTML += `<p><b>You:</b> ${userInput}</p>`;
    
    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        messages.innerHTML += `<p><b>Bot:</b> ${data.reply}</p>`;
    });
}
