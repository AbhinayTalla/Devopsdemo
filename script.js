
// Food Menu Data
const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 299,
        rating: 4.8,
        description: "Classic pizza with fresh mozzarella and basil.",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600"
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Burger",
        price: 199,
        rating: 4.7,
        description: "Juicy burger with cheese and fresh vegetables.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 3,
        name: "Italian Pasta",
        category: "Pasta",
        price: 249,
        rating: 4.9,
        description: "Creamy pasta with delicious Italian sauce.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600"
    },
    {
        id: 4,
        name: "Chicken Biryani",
        category: "Indian",
        price: 299,
        rating: 4.9,
        description: "Authentic aromatic biryani with spices.",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600"
    },
    {
        id: 5,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        rating: 4.8,
        description: "Delicious pizza loaded with pepperoni.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600"
    },
    {
        id: 6,
        name: "Veg Burger",
        category: "Burger",
        price: 149,
        rating: 4.6,
        description: "Crispy vegetable patty with fresh lettuce.",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600"
    },
    {
        id: 7,
        name: "White Sauce Pasta",
        category: "Pasta",
        price: 229,
        rating: 4.7,
        description: "Rich and creamy white sauce pasta.",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600"
    },
    {
        id: 8,
        name: "Paneer Butter Masala",
        category: "Indian",
        price: 279,
        rating: 4.8,
        description: "Soft paneer in a rich buttery tomato gravy.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600"
    },
    {
        id: 9,
        name: "Masala Dosa",
        category: "Indian",
        price: 129,
        rating: 4.7,
        description: "Crispy dosa served with chutney and sambar.",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600"
    }
];

// Cart Data
let cart = [];

// DOM Elements
const foodGrid = document.getElementById("foodGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartOverlay = document.getElementById("cartOverlay");

// Display Food
function displayFoods(category = "All", search = "") {

    const filteredFoods = foods.filter(food => {
        const matchesCategory =
            category === "All" || food.category === category;

        const matchesSearch =
            food.name.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    foodGrid.innerHTML = "";

    if (filteredFoods.length === 0) {
        foodGrid.innerHTML = "<p>No food items found.</p>";
        return;
    }

    filteredFoods.forEach(food => {

        const card = document.createElement("div");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}">

            <div class="food-info">
                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-meta">
                    <span class="price">₹${food.price}</span>
                    <span class="rating">⭐ ${food.rating}</span>
                </div>

                <div class="food-meta">
                    <span>${food.category}</span>
                    <button class="add-btn" data-id="${food.id}">
                        + Add to Cart
                    </button>
                </div>
            </div>
        `;

        foodGrid.appendChild(card);
    });
}

// Add to Cart
foodGrid.addEventListener("click", (event) => {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const id = Number(button.dataset.id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const food = foods.find(item => item.id === id);

        cart.push({
            ...food,
            quantity: 1
        });
    }

    updateCart();

});

// Update Cart
function updateCart() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';
        return;
    }

    cart.forEach(item => {

        const div = document.createElement("div");
        div.className = "cart-item";

        const details = document.createElement("div");
        const heading = document.createElement("h4");
        const price = document.createElement("p");

        heading.textContent = item.name;
        price.textContent = `₹${item.price * item.quantity}`;

        details.append(heading, price);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.addEventListener("click", () => changeQuantity(item.id, -1));

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () => changeQuantity(item.id, 1));

        controls.append(minus, quantity, plus);
        div.append(details, controls);

        cartItems.appendChild(div);
    });
}

// Change Quantity
function changeQuantity(id, change) {

    const item = cart.find(food => food.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== id);
    }

    updateCart();
}

// Category Filters
document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelector(".category.active")
            ?.classList.remove("active");

        button.classList.add("active");

        const category = button.dataset.category;

        displayFoods(category, document.getElementById("searchInput").value);
    });

});

// Search Food
document.getElementById("searchInput")
    .addEventListener("input", event => {

        const activeCategory =
            document.querySelector(".category.active").dataset.category;

        displayFoods(activeCategory, event.target.value);

    });

// Open Cart
document.getElementById("cartButton")
    .addEventListener("click", () => {
        cartOverlay.classList.add("show");
    });

// Close Cart
document.getElementById("closeCart")
    .addEventListener("click", () => {
        cartOverlay.classList.remove("show");
    });

// Close Cart on Outside Click
cartOverlay.addEventListener("click", event => {

    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("show");
    }

});

// Mobile Navigation
document.getElementById("menuToggle")
    .addEventListener("click", () => {
        document.getElementById("navLinks")
            .classList.toggle("show");
    });

// Close Mobile Navigation After Clicking
document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {
        document.getElementById("navLinks")
            .classList.remove("show");
    });

});

// Checkout
document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        alert(`Thank you for ordering!\nYour total is ₹${total}`);

        cart = [];
        updateCart();
        cartOverlay.classList.remove("show");

    });

// Contact Form
document.getElementById("contactForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        alert("Thank you! Your message has been submitted.");

        event.target.reset();

    });

// Initial Display
displayFoods();
updateCart();
