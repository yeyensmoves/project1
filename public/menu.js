console.log("JS loaded");

document.addEventListener("DOMContentLoaded", () => {

    let cart = [];
    let favorites = [];

    // ELEMENTS

    const optionButtons = document.querySelectorAll(".option-btn");
    const addButtons = document.querySelectorAll(".cart-btn");

    const cartIcon = document.getElementById("cart-icon");
    const closeCart = document.getElementById("close-cart");
    const cartWindow = document.getElementById("cart-window");
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const clearCart = document.getElementById("clear-cart");

    const favoriteBtn = document.getElementById("favorite-icon");
    const favoriteWindow = document.getElementById("favorite-window");
    const closeFavorite = document.getElementById("close-favorite");
    const favoriteItems = document.getElementById("favorite-items");
    const favoriteCount = document.getElementById("favorite-count");



    // OPTION BUTTONS

    optionButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            const group = btn.closest(".option-group");

            group.querySelectorAll(".option-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

        });

    });



    // OPEN CART

    cartIcon.addEventListener("click", () => {

        favoriteWindow.classList.remove("show");
        cartWindow.classList.toggle("show");

    });



    // CLOSE CART

    closeCart.addEventListener("click", () => {

        cartWindow.classList.remove("show");

    });



    // CLEAR CART

    if (clearCart) {

        clearCart.addEventListener("click", () => {

            cart = [];
            updateCart();

        });

    }



    // OPEN FAVORITES

    favoriteBtn.addEventListener("click", () => {

        cartWindow.classList.remove("show");
        favoriteWindow.classList.toggle("show");

    });



    // CLOSE FAVORITES

    closeFavorite.addEventListener("click", () => {

        favoriteWindow.classList.remove("show");

    });



    // ADD TO CART

    addButtons.forEach(button => {

        button.addEventListener("click", () => {

            const menuSection = button.closest(".menu-section");

            const flavor = menuSection.querySelector(".flavor-btn.active");
            const size = menuSection.querySelector(".size-btn.active");

            if (!flavor || !size) {

                alert("Please select flavor and size");
                return;

            }

            const sizeText = size.textContent;
            const price = parseInt(sizeText.match(/\d+/)[0]);

            const category = menuSection.querySelector("h3").textContent;

            const item = {

                name: flavor.textContent + " " + category,
                size: sizeText,
                price: price,
                quantity: 1

            };

            cart.push(item);

            updateCart();

            alert(item.name + " added to cart!");

        });

    });



    // UPDATE FAVORITES

    function updateFavorites() {

        favoriteItems.innerHTML = "";

        favorites.forEach(item => {

            const div = document.createElement("div");

            div.classList.add("cart-item");

            div.innerHTML = `

                <h4>${item.name}</h4>
                <p>${item.size}</p>
                <p>₱${item.price}</p>

                <button class="remove-fav">
                    Remove
                </button>

            `;

            div.querySelector(".remove-fav")
                .addEventListener("click", () => {

                    favorites = favorites.filter(fav => (

                        fav.name !== item.name ||
                        fav.size !== item.size

                    ));

                    updateFavorites();

                });

            favoriteItems.appendChild(div);

        });

        if (favorites.length === 0) {

            favoriteItems.innerHTML = "<p>No favorites yet</p>";

        }

        favoriteCount.textContent = favorites.length;

    }



    // UPDATE CART

    function updateCart() {

        cartItems.innerHTML = "";

        let total = 0;

        cart.forEach(item => {

            const div = document.createElement("div");

            div.classList.add("cart-item");

            div.innerHTML = `

                <h4>${item.name}</h4>

                <p>${item.size}</p>

                <p>₱${item.price}</p>

                <p>Quantity: ${item.quantity}</p>

                <div class="cart-controls">

                    <button class="minus-btn">-</button>

                    <button class="plus-btn">+</button>

                    <button class="favorite-btn">⭐</button>

                    <button class="remove-btn">Remove</button>

                </div>

            `;

            const plusBtn = div.querySelector(".plus-btn");
            const minusBtn = div.querySelector(".minus-btn");
            const removeBtn = div.querySelector(".remove-btn");
            const favoriteBtnItem = div.querySelector(".favorite-btn");



            // PLUS BUTTON

            plusBtn.addEventListener("click", () => {

                item.quantity++;
                updateCart();

            });



            // MINUS BUTTON

            minusBtn.addEventListener("click", () => {

                if (item.quantity > 1) {

                    item.quantity--;

                } else {

                    cart = cart.filter(i => i !== item);

                }

                updateCart();

            });



            // REMOVE BUTTON

            removeBtn.addEventListener("click", () => {

                cart = cart.filter(i => i !== item);

                updateCart();

            });



            // FAVORITE BUTTON

            favoriteBtnItem.addEventListener("click", () => {

                const exists = favorites.some(fav =>

                    fav.name === item.name &&
                    fav.size === item.size

                );

                if (!exists) {

                    favorites.push({ ...item });

                    updateFavorites();

                }

            });

            cartItems.appendChild(div);

            total += item.price * item.quantity;

        });

        if (cart.length === 0) {

            cartItems.innerHTML = "<p>Your cart is empty</p>";

        }

        cartCount.textContent = cart.length;
        cartTotal.textContent = total;

    }



    // CHECKOUT

    const checkoutBtn = document.getElementById("checkout-btn");

    if (checkoutBtn) {

        checkoutBtn.addEventListener("click", async () => {

            if (cart.length === 0) {

                alert("Cart is empty!");
                return;

            }

            const customer = sessionStorage.getItem("user");

            if (!customer) {

                alert("User not found. Please login again.");

                window.location.href = "/index.html";

                return;

            }

            try {

                const response = await fetch("/checkout", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        customer: customer,
                        items: cart

                    })

                });

                const result = await response.text();

                if (result === "OK") {

                    alert("Order placed successfully!");

                    cart = [];

                    updateCart();

                } else {

                    alert("Checkout failed");

                }

            } catch (err) {

                console.error(err);

                alert("Server error");

            }

        });

    }

});