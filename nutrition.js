// 1. DATABASE
const masterDatabase = {
    breakfast: {
        "egg": { name: "Boiled Egg", c: 1.1, p: 13, fi: 0, f: 11, cal: 155 },
        "oats": { name: "Oats Bowl", c: 66, p: 17, fi: 10, f: 7, cal: 389 },
        "pancakes": { name: "Pancakes", c: 28, p: 6, fi: 1, f: 10, cal: 227 },
        "apple": { name: "Apple", c: 14, p: 0.3, fi: 2.4, f: 0.2, cal: 52 },
        "bread": { name: "Brown Bread", c: 43, p: 13, fi: 7, f: 3, cal: 247 },
        "poha": { name: "Poha", c: 25, p: 3, fi: 1, f: 8, cal: 180 },
        "smoothie": { name: "Fruit Smoothie", c: 12, p: 1, fi: 2, f: 0.5, cal: 60 }
    },
    lunch: {
        "rice": { name: "White Rice", c: 28, p: 2.7, fi: 0.4, f: 0.3, cal: 130 },
        "dal": { name: "Dal Tadka", c: 20, p: 9, fi: 8, f: 0.5, cal: 116 },
        "chicken": { name: "Grilled Chicken", c: 0, p: 27, fi: 0, f: 3.6, cal: 165 },
        "paneer": { name: "Paneer Curry", c: 4, p: 18, fi: 0, f: 20, cal: 265 },
        "salad": { name: "Mixed Salad", c: 5, p: 1, fi: 2, f: 0.1, cal: 25 },
        "fish": { name: "Baked Fish", c: 0, p: 20, fi: 0, f: 2, cal: 105 },
        "curd": { name: "Curd/Yogurt", c: 4.7, p: 3.5, fi: 0, f: 3.3, cal: 61 }
    },
    snacks: {
        "banana": { name: "Banana", c: 23, p: 1.1, fi: 2.6, f: 0.3, cal: 89 },
        "nuts": { name: "Almonds", c: 22, p: 21, fi: 12, f: 49, cal: 579 },
        "fries": { name: "Fries", c: 41, p: 3.4, fi: 3.8, f: 15, cal: 312 },
        "tea": { name: "Tea", c: 0.2, p: 0.1, fi: 0, f: 0, cal: 2 },
        "biscuit": { name: "Biscuits", c: 70, p: 6, fi: 3, f: 15, cal: 450 },
        "popcorn": { name: "Popcorn", c: 74, p: 13, fi: 14, f: 5, cal: 387 },
        "sandwich": { name: "Sandwich", c: 25, p: 8, fi: 3, f: 7, cal: 200 }
    },
    dinner: {
        "roti": { name: "Rotti/Chapati", c: 18, p: 3, fi: 2, f: 4, cal: 120 },
        "pizza": { name: "Pizza", c: 36, p: 11, fi: 2.3, f: 10, cal: 266 },
        "broccoli": { name: "Broccoli", c: 7, p: 2.8, fi: 2.6, f: 0.3, cal: 34 },
        "soup": { name: "Soup", c: 8, p: 1, fi: 1, f: 0.2, cal: 40 },
        "pasta": { name: "Pasta", c: 31, p: 6, fi: 2, f: 1, cal: 158 },
        "tofu": { name: "Tofu", c: 2, p: 8, fi: 1, f: 5, cal: 76 },
        "milk": { name: "Milk", c: 5, p: 3.4, fi: 0, f: 1, cal: 42 }
    }
};

let selectedCategory = ""; // Global variable to track choice

// 2. THIS RUNS WHEN BUTTONS ARE CLICKED
function selectMeal(type) {
    selectedCategory = type.toLowerCase();
    
    // Update the "Breakfast Selected" text
    const display = document.getElementById("selectedMealDisplay");
    if(display) {
        display.innerText = type.charAt(0).toUpperCase() + type.slice(1) + " Selected";
    }

    // Fill the dropdown
    const foodMenu = document.getElementById("foodMenu");
    foodMenu.innerHTML = '<option value="" disabled selected>Select from ' + type + ' list...</option>';
    
    const items = masterDatabase[selectedCategory];
    for (let key in items) {
        let option = document.createElement("option");
        option.value = key;
        option.innerText = items[key].name;
        foodMenu.appendChild(option);
    }
}

// 3. LOG MEAL
let totals = JSON.parse(localStorage.getItem('nutritionTotals')) || { 
    carbs: 0, protein: 0, fibre: 0, fat: 0, calories: 0, 
    breakfast: 0, lunch: 0, snacks: 0, dinner: 0 
};

function logMeal() {
    const foodKey = document.getElementById("foodMenu").value;
    const weightInput = document.getElementById("foodWeight"); // Check this ID in HTML
    const weight = parseFloat(weightInput.value);

    if (!selectedCategory || !foodKey || isNaN(weight) || weight <= 0) {
        alert("Please select a meal type, food item, and enter weight!");
        return;
    }

    const foodData = masterDatabase[selectedCategory][foodKey];
    const ratio = weight / 100;

    const entryCal = Math.round(foodData.cal * ratio);
    
    totals.carbs += Math.round(foodData.c * ratio);
    totals.protein += Math.round(foodData.p * ratio);
    totals.fibre += Math.round(foodData.fi * ratio);
    totals.fat += Math.round(foodData.f * ratio);
    totals.calories += entryCal;
    totals[selectedCategory] += entryCal;

    localStorage.setItem('nutritionTotals', JSON.stringify(totals));
    
    document.getElementById("logOutput").innerText = `Added ${foodData.name} to ${selectedCategory}`;
    weightInput.value = "";
    refreshUI();
}

function refreshUI() {
    // Sync UI with storage
    document.getElementById('sum-breakfast').innerText = (totals.breakfast || 0) + " kcal";
    document.getElementById('sum-lunch').innerText = (totals.lunch || 0) + " kcal";
    document.getElementById('sum-snacks').innerText = (totals.snacks || 0) + " kcal";
    document.getElementById('sum-dinner').innerText = (totals.dinner || 0) + " kcal";

    document.getElementById('carb-val').innerText = totals.carbs + "g";
    document.getElementById('protein-val').innerText = totals.protein + "g";
    document.getElementById('fibre-val').innerText = totals.fibre + "g";
    document.getElementById('fat-val').innerText = totals.fat + "g";
    document.getElementById('total-cal').innerText = totals.calories;
}

function resetStats() {
    if(confirm("Reset data?")) {
        totals = { carbs: 0, protein: 0, fibre: 0, fat: 0, calories: 0, breakfast: 0, lunch: 0, snacks: 0, dinner: 0 };
        localStorage.removeItem('nutritionTotals');
        refreshUI();
    }
}



window.onload = refreshUI;
window.onload = updateDisplay;
window.addEventListener("load", function () {
  let name = localStorage.getItem("un");
  let photo = localStorage.getItem("profilePic");

  if (name) {
    document.getElementById("cname").innerText = name;
  }

  if (photo) {
    document.getElementById("icon").src = photo;
  }
});