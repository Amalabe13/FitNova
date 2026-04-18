// 1. Expanded Food Dictionary
const foodDatabase = {
    // Healthy (Original)
    "rice": { carbs: 45, protein: 4, fibre: 1, fat: 0 },
    "dal": { carbs: 20, protein: 9, fibre: 8, fat: 2 },
    "roti": { carbs: 15, protein: 3, fibre: 2, fat: 0 },
    
    // Fruits & Vegetables (New)
    "apple": { carbs: 14, protein: 0, fibre: 2, fat: 0 },
    "banana": { carbs: 23, protein: 1, fibre: 3, fat: 0 },
    "spinach": { carbs: 1, protein: 1, fibre: 2, fat: 0 },
    "carrot": { carbs: 10, protein: 1, fibre: 3, fat: 0 },
    "broccoli": { carbs: 6, protein: 3, fibre: 2, fat: 0 },

    // Known Junk
    "burger": { carbs: 40, protein: 25, fibre: 2, fat: 15 },
    "pizza": { carbs: 35, protein: 12, fibre: 1, fat: 10 },
    "fries": { carbs: 48, protein: 3, fibre: 5, fat: 15 }
};

// 2. Storage & State
let totals = JSON.parse(localStorage.getItem('nutritionTotals')) || { carbs: 0, protein: 0, fibre: 0, fat: 0 };
let selectedMeal = "None";

// 3. Display Meal Selection
function selectMeal(mealName) {
    selectedMeal = mealName;
    const mealDisplay = document.getElementById('selectedMealDisplay');
    if (mealDisplay) {
        mealDisplay.innerText = "Current Meal: " + mealName;
        mealDisplay.style.color = "#E66A00"; // Makes it glow orange
    }
}

function updateDisplay() {
    document.getElementById('carb-val').innerText = totals.carbs + "g";
    document.getElementById('protein-val').innerText = totals.protein + "g";
    document.getElementById('fibre-val').innerText = totals.fibre + "g";
    document.getElementById('fat-val').innerText = totals.fat + "g";
}

// 4. Main Calculation with Junk Fallback
function calculateMacros() {
    const input = document.getElementById('weight'); 
    const output = document.getElementById('logOutput');
    const foodName = input.value.toLowerCase().trim();

    if (!foodName) return;

    let item;

    if (foodDatabase[foodName]) {
        // Known food
        item = foodDatabase[foodName];
        output.innerText = `Added ${foodName} to ${selectedMeal}!`;
    } else {
        // Unknown food -> JUNK FALLBACK
        // Prefixed values for unknown items
        item = { carbs: 50, protein: 5, fibre: 0, fat: 20 };
        output.innerText = `Unknown food detected. Logged as 'General Junk' for ${selectedMeal}.`;
    }

    // Update totals
    totals.carbs += item.carbs;
    totals.protein += item.protein;
    totals.fibre += item.fibre;
    totals.fat += item.fat;

    localStorage.setItem('nutritionTotals', JSON.stringify(totals));
    updateDisplay();
    input.value = ""; 
}

function resetStats() {
    if(confirm("Reset all daily totals?")) {
        totals = { carbs: 0, protein: 0, fibre: 0, fat: 0 };
        localStorage.removeItem('nutritionTotals');
        updateDisplay();
        document.getElementById('logOutput').innerText = "Stats cleared.";
    }
}

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