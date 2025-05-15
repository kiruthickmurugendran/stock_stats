// Inventory Data
const inventory_data = [
    { item: "Umbrella", stock: 12, category: "Accessories", sales_last_week: 20, season: "Rainy" },
    { item: "Sunscreen", stock: 5, category: "Health", sales_last_week: 15, season: "Summer" },
    { item: "Sweater", stock: 30, category: "Apparel", sales_last_week: 5, season: "Winter" },
    { item: "Chocolate", stock: 2, category: "Food", sales_last_week: 25, season: "Festive" },
    { item: "Notebook", stock: 50, category: "Stationery", sales_last_week: 10, season: "All" },
];

// Populate Inventory Table
function loadInventoryData() {
    const tableBody = document.getElementById("inventory-body");
    inventory_data.forEach(item => {
        const row = `
            <tr>
                <td>${item.item}</td>
                <td>${item.stock}</td>
                <td>${item.category}</td>
                <td>${item.sales_last_week}</td>
                <td>${item.season}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Chat Box Logic
function sendMessage() {
    const chatInput = document.getElementById("chat-input");
    const chatOutput = document.getElementById("chat-output");
    const message = chatInput.value.trim().toLowerCase();
    
    if (message) {
        const userMessage = `<div class="message user">You: ${message}</div>`;
        
        // Parse user input and check if it's asking for quantity of an item
        let botMessage = `<div class="message bot">Bot: I will process your quantity request...</div>`;
        
        // Extract the item name and quantity from the message
        const [itemName, quantity] = extractItemAndQuantity(message);
        
        // Check if item is in inventory and if requested quantity is available
        if (itemName && quantity !== null) {
            const inventoryItem = inventory_data.find(item => item.item.toLowerCase() === itemName);
            if (inventoryItem) {
                if (inventoryItem.stock >= quantity) {
                    botMessage = `<div class="message bot">Bot: You can buy ${quantity} ${itemName}(s). We have enough stock.</div>`;
                } else {
                    botMessage = `<div class="message bot">Bot: Sorry, we only have ${inventoryItem.stock} ${itemName}(s) in stock.</div>`;
                }
            } else {
                botMessage = `<div class="message bot">Bot: Sorry, I couldn't find any item named "${itemName}" in our inventory.</div>`;
            }
        } else {
            botMessage = `<div class="message bot">Bot: Please specify an item and quantity. Example: "Umbrella 5".</div>`;
        }

        chatOutput.innerHTML += userMessage + botMessage;
        chatInput.value = "";
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
}

// Extract item name and quantity from the user's input
function extractItemAndQuantity(message) {
    // Simple regex pattern to extract item and quantity
    const regex = /(\w+)(\s+(\d+))?/;  // Match word and optional number
    const match = message.match(regex);
    if (match) {
        const itemName = match[1].toLowerCase();
        const quantity = match[3] ? parseInt(match[3]) : null;
        return [itemName, quantity];
    }
    return [null, null];
}

// Load Inventory Data on Page Load
window.onload = loadInventoryData;
