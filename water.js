let total = 0;
let goal = 0;

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function saveTodayWater() {
  localStorage.setItem('water_' + getTodayKey(), total);
}

function getWeeklyWaterData() {
  let arr = [];
  for (let i = 6; i >= 0; i--) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    let key = d.toISOString().split('T')[0];
    let val = localStorage.getItem('water_' + key);
    arr.push(val ? parseFloat(val) : 0);
  }
  return arr;
}

window.onload = function () {
  let savedGoal = localStorage.getItem('goal');
  let savedTotal = localStorage.getItem('total');
  let savedWeight = localStorage.getItem('weight');

  if (savedWeight) document.getElementById('weight').value = savedWeight;
  if (savedGoal) {
    goal = parseFloat(savedGoal);
    document.getElementById('goalText').innerText = 'Goal: ' + goal + ' L';
    document.getElementById('target').innerText = 'Target: ' + goal + 'L';
  }
  if (savedTotal) {
    total = parseFloat(savedTotal);
    updateUI();
  }
};

function updateUI() {
  document.getElementById('intake').innerText = 'Intake: ' + total.toFixed(2) + 'L';
  document.getElementById('comp').innerText = total.toFixed(2) + 'L / ' + goal + 'L';
  let percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;
  document.getElementById('status').innerText = total >= goal && goal > 0 ? 'Goal achieved!!!' : percent.toFixed(0) + '% completed';
  document.getElementById('progress').style.height = percent + '%';
}

function setGoal() {
  let weight = document.getElementById('weight').value;
  if (weight === '' || weight <= 0) return alert('Enter valid weight');
  localStorage.setItem('weight', weight);
  goal = parseFloat((weight * 0.033).toFixed(2));
  localStorage.setItem('goal', goal);
  total = 0;
  localStorage.setItem('total', total);
  saveTodayWater();
  document.getElementById('goalText').innerText = 'Goal: ' + goal + ' L';
  document.getElementById('target').innerText = 'Target: ' + goal + 'L';
  updateUI();
}

function addWater(amount) {
  if (goal === 0) return alert('Set goal first!');
  if (total >= goal) return;
  total += amount / 1000;
  if (total > goal) total = goal;
  localStorage.setItem('total', total);
  saveTodayWater();
  updateUI();
}

function reset() {
  total = 0;
  goal = 0;
  localStorage.clear();
  document.getElementById('weight').value = '';
  document.getElementById('goalText').innerText = 'Goal: -- L';
  document.getElementById('target').innerText = 'Target: 0L';
  document.getElementById('intake').innerText = 'Intake: 0L';
  document.getElementById('comp').innerText = '0L / 0L';
  document.getElementById('status').innerText = 'Start drinking 💧';
  document.getElementById('progress').style.height = '0%';
}

window.addEventListener('load', function () {
  let name = localStorage.getItem('un');
  let photo = localStorage.getItem('profilePic');
  if (name) document.getElementById('cname').innerText = name;
  if (photo) document.getElementById('icon').src = photo;
});