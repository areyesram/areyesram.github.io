// Database key for localStorage
const DB_KEY = "crud_app_items";

// DOM elements
const ui = {
    form: document.getElementById("itemForm"),
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    itemId: document.getElementById("itemId"),
    cancel: document.getElementById("cancelBtn"),
    table: document.querySelector("#itemsTable tbody")
};
// Initialize the app
function init() {
    // Form submit handler
    ui.form.addEventListener("submit", e => {
        e.preventDefault();

        const item = {
            name: ui.name.value,
            email: ui.email.value,
            phone: ui.phone.value
        };

        if (ui.itemId.value) {
            // Update existing item
            dac.updateItem(ui.itemId.value, item);
        } else {
            // Create new item
            dac.createItem(item);
        }

        resetForm();
        renderItems();
    });

    // Cancel button handler
    cancelBtn.addEventListener("click", resetForm);
    renderItems();
}
const dac = {
    // Create a new item
    createItem: item => {
        const items = dac.getItems();
        item.id = Date.now().toString(); // Simple unique ID
        items.push(item);
        dac.saveItems(items);
    },

    // Read all items
    getItems: () => {
        const itemsJson = localStorage.getItem(DB_KEY);
        return itemsJson ? JSON.parse(itemsJson) : [];
    },

    // Update an item
    updateItem: (id, updatedItem) => {
        const items = dac.getItems();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            updatedItem.id = id;
            items[index] = updatedItem;
            dac.saveItems(items);
        }
    },

    // Delete an item
    deleteItem: id => {
        const items = dac.getItems().filter(item => item.id !== id);
        dac.saveItems(items);
    },

    // Save all items to localStorage
    saveItems: items => {
        localStorage.setItem(DB_KEY, JSON.stringify(items));
    }
};

// Render all items in the table
function renderItems() {
    const items = dac.getItems();
    ui.table.innerHTML = "";

    items.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td class="actions">
                <button onclick="editItem('${item.id}')">Edit</button>
                <button onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        `;

        ui.table.appendChild(row);
    });
}

// Edit an item (populate form)

// Reset the form
function resetForm() {
    ui.form.reset();
    ui.itemId.value = "";
}

// Make functions available globally for onclick attributes
window.deleteItem = id => {
    dac.deleteItem(id);
    renderItems();
};

window.editItem = function (id) {
    const items = dac.getItems();
    const item = items.find(o => o.id === id);
    if (item) {
        ui.itemId.value = item.id;
        ui.name.value = item.name;
        ui.email.value = item.email;
        ui.phone.value = item.phone;
    }
};

// Initialize the app when the page loads
window.onload = init;
