const masterDatabase = {
    breakfast:{
        egg:{name:"Boiled Egg",c:1.1,p:13,fi:0,f:11,cal:155},
        oats:{name:"Oats Bowl",c:66,p:17,fi:10,f:7,cal:389},
        pancakes:{name:"Pancakes",c:28,p:6,fi:1,f:10,cal:227},
        apple:{name:"Apple",c:14,p:0.3,fi:2.4,f:0.2,cal:52},
        bread:{name:"Brown Bread",c:43,p:13,fi:7,f:3,cal:247},
        poha:{name:"Poha",c:25,p:3,fi:1,f:8,cal:180},
        smoothie:{name:"Fruit Smoothie",c:12,p:1,fi:2,f:0.5,cal:60}
    },
    lunch:{
        rice:{name:"White Rice",c:28,p:2.7,fi:0.4,f:0.3,cal:130},
        dal:{name:"Dal Tadka",c:20,p:9,fi:8,f:0.5,cal:116},
        chicken:{name:"Grilled Chicken",c:0,p:27,fi:0,f:3.6,cal:165},
        paneer:{name:"Paneer Curry",c:4,p:18,fi:0,f:20,cal:265},
        salad:{name:"Mixed Salad",c:5,p:1,fi:2,f:0.1,cal:25},
        fish:{name:"Baked Fish",c:0,p:20,fi:0,f:2,cal:105},
        curd:{name:"Curd/Yogurt",c:4.7,p:3.5,fi:0,f:3.3,cal:61}
    },
    snacks:{
        banana:{name:"Banana",c:23,p:1.1,fi:2.6,f:0.3,cal:89},
        nuts:{name:"Almonds",c:22,p:21,fi:12,f:49,cal:579},
        fries:{name:"Fries",c:41,p:3.4,fi:3.8,f:15,cal:312},
        tea:{name:"Tea",c:0.2,p:0.1,fi:0,f:0,cal:2},
        biscuit:{name:"Biscuits",c:70,p:6,fi:3,f:15,cal:450},
        popcorn:{name:"Popcorn",c:74,p:13,fi:14,f:5,cal:387},
        sandwich:{name:"Sandwich",c:25,p:8,fi:3,f:7,cal:200}
    },
    dinner:{
        roti:{name:"Rotti/Chapati",c:18,p:3,fi:2,f:4,cal:120},
        pizza:{name:"Pizza",c:36,p:11,fi:2.3,f:10,cal:266},
        broccoli:{name:"Broccoli",c:7,p:2.8,fi:2.6,f:0.3,cal:34},
        soup:{name:"Soup",c:8,p:1,fi:1,f:0.2,cal:40},
        pasta:{name:"Pasta",c:31,p:6,fi:2,f:1,cal:158},
        tofu:{name:"Tofu",c:2,p:8,fi:1,f:5,cal:76},
        milk:{name:"Milk",c:5,p:3.4,fi:0,f:1,cal:42}
    }
};

let selectedCategory = "";
let totals = loadData();

function today(){
    return new Date().toLocaleDateString("en-CA");
}

function emptyTotals(){
    return {
        date:today(),
        carbs:0, protein:0, fibre:0, fat:0, calories:0,
        mealMacros:{
            breakfast:{carbs:0,protein:0,fibre:0,fat:0},
            lunch:{carbs:0,protein:0,fibre:0,fat:0},
            dinner:{carbs:0,protein:0,fibre:0,fat:0},
            snacks:{carbs:0,protein:0,fibre:0,fat:0}
        },
        weekly:[]
    };
}

function loadData(){
    let saved = JSON.parse(localStorage.getItem("nutritionTotals")) || emptyTotals();

    if(saved.date !== today()){
        saved.weekly.push({
            date:saved.date,
            carbs:saved.carbs,
            protein:saved.protein,
            fibre:saved.fibre,
            fat:saved.fat,
            calories:saved.calories
        });

        if(saved.weekly.length > 7) saved.weekly.shift();

        saved = {
            ...emptyTotals(),
            weekly:saved.weekly
        };
    }

    localStorage.setItem("nutritionTotals",JSON.stringify(saved));
    return saved;
}

function saveData(){
    localStorage.setItem("nutritionTotals",JSON.stringify(totals));
}

function selectMeal(type){
    selectedCategory = type.toLowerCase();

    document.getElementById("selectedMealDisplay").innerText =
        type.charAt(0).toUpperCase() + type.slice(1) + " Selected";

    const foodMenu = document.getElementById("foodMenu");
    foodMenu.innerHTML = `<option value="">Select from ${type} list...</option>`;

    const items = masterDatabase[selectedCategory];

    for(let key in items){
        let op = document.createElement("option");
        op.value = key;
        op.innerText = items[key].name;
        foodMenu.appendChild(op);
    }
}

function logMeal(){
    const foodKey = document.getElementById("foodMenu").value;
    const weight = parseFloat(document.getElementById("foodWeight").value);

    if(!selectedCategory || !foodKey || isNaN(weight) || weight <= 0){
        alert("Select meal type, food item and quantity");
        return;
    }

    const item = masterDatabase[selectedCategory][foodKey];
    const ratio = weight / 100;

    const c  = +(item.c  * ratio).toFixed(1);
    const p  = +(item.p  * ratio).toFixed(1);
    const fi = +(item.fi * ratio).toFixed(1);
    const f  = +(item.f  * ratio).toFixed(1);
    const cal = Math.round(item.cal * ratio);

    totals.mealMacros[selectedCategory].carbs   += c;
    totals.mealMacros[selectedCategory].protein += p;
    totals.mealMacros[selectedCategory].fibre   += fi;
    totals.mealMacros[selectedCategory].fat     += f;

    totals.carbs   += c;
    totals.protein += p;
    totals.fibre   += fi;
    totals.fat     += f;
    totals.calories += cal;

    saveData();
    refreshUI();

    document.getElementById("foodWeight").value = "";
    document.getElementById("logOutput").innerText =
        `${item.name} (${weight}g) added to ${selectedCategory}`;
}

function putMany(id,val){
    document.querySelectorAll("#"+id).forEach(el => el.innerText = val);
}

function refreshUI(){
    const meals = ["breakfast","lunch","dinner","snacks"];

    let totalCarb = 0, totalProtein = 0, totalFibre = 0, totalFat = 0;

    meals.forEach((meal,i)=>{
        let c = totals.mealMacros[meal].carbs;
        let p = totals.mealMacros[meal].protein;
        let fi = totals.mealMacros[meal].fibre;
        let fa = totals.mealMacros[meal].fat;

        document.querySelectorAll(".carb-val")[i].innerText = c.toFixed(1)+"g";
        document.querySelectorAll(".protein-val")[i].innerText = p.toFixed(1)+"g";
        document.querySelectorAll(".fibre-val")[i].innerText = fi.toFixed(1)+"g";
        document.querySelectorAll(".fat-val")[i].innerText = fa.toFixed(1)+"g";

        totalCarb += c;
        totalProtein += p;
        totalFibre += fi;
        totalFat += fa;
    });

    document.querySelector(".grand-carb").innerText = totalCarb.toFixed(1)+"g";
    document.querySelector(".grand-protein").innerText = totalProtein.toFixed(1)+"g";
    document.querySelector(".grand-fibre").innerText = totalFibre.toFixed(1)+"g";
    document.querySelector(".grand-fat").innerText = totalFat.toFixed(1)+"g";
}

function resetStats(){
    if(confirm("Reset today's data?")){
        const week = totals.weekly;
        totals = emptyTotals();
        totals.weekly = week;
        saveData();
        refreshUI();
        document.getElementById("logOutput").innerText = "No food added yet";
    }
}

function loadProfile(){
    const name = localStorage.getItem("un");
    const photo = localStorage.getItem("profilePic");

    if(name) document.getElementById("cname").innerText = name;
    if(photo) document.getElementById("icon").src = photo;
}

window.onload = function(){
    loadProfile();
    refreshUI();
};

function logout() {
    localStorage.clear();   // remove saved login/session data
    window.location.href = "login.html";   // go to login page
}





// theme

function toggleTheme() {
    let current = localStorage.getItem("theme") || "dark";
    let next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme();
}

function applyTheme() {
    let page = window.location.pathname.split("/").pop().replace(".html","");
    let theme = localStorage.getItem("theme") || "dark";
    let css = document.getElementById("theme-css");

    if(theme === "light"){
        css.href = page + "l.css";
    } else {
        css.href = page + ".css";
    }
}

applyTheme();







