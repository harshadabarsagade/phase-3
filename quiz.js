let score = 0;
let currentIndex = 0;
let selectedCategory = "";
let timer;
let timeLeft = 30;


// ===== QUIZ DATA =====
const quizData = {
  javascript: [
    { q: "What is the correct way to declare a variable in JavaScript?", options: ["var x = 5;", "int x = 5;", "x := 5;", "let 5 = x;"], answer: "var x = 5;" },
    { q: "Which method converts a JSON string into a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"], answer: "JSON.parse()" },
    { q: "Which of the following is a JavaScript array method?", options: ["push()", "append()", "add()", "insert()"], answer: "push()" },
    { q: "How do you write a comment in JavaScript?", options: ["<!-- comment -->", "# comment", "// comment", "** comment **"], answer: "// comment" },
    { q: "What will typeof NaN return?", options: ["number", "NaN", "undefined", "object"], answer: "number" },
    { q: "Which operator is used for strict equality (value + type)?", options: ["==", "=", "===", "!="], answer: "===" },
    { q: "How do you create a function in JavaScript?", options: ["function myFunc() {}", "func myFunc() {}", "def myFunc() {}", "function: myFunc() {}"], answer: "function myFunc() {}" },
    { q: "Which of these is a falsy value in JavaScript?", options: ["0", "\"0\"", "\"false\"", "[]"], answer: "0" },
    { q: "What is the output of console.log(2 + '2')?", options: ["4", "\"22\"", "NaN", "Error"], answer: "\"22\"" },
    { q: "How can you add an element to the beginning of an array?", options: ["array.push(element)", "array.unshift(element)", "array.addFirst(element)", "array.prepend(element)"], answer: "array.unshift(element)" }
  ],
  science: [
    { q: "What is the chemical symbol for water?", options: ["H₂O","O₂","CO₂","HO"], answer: "H₂O" },
    { q: "What planet is known as the Red Planet?", options: ["Venus","Mars","Jupiter","Mercury"], answer: "Mars" },
    { q: "What gas do plants absorb from the atmosphere for photosynthesis?", options: ["Oxygen","Carbon Dioxide","Nitrogen","Hydrogen"], answer: "Carbon Dioxide" },
    { q: "What is the center of an atom called?", options: ["Electron","Proton","Nucleus","Neutron"], answer: "Nucleus" },
    { q: "What is the speed of light in vacuum?", options: ["300,000 m/s","300,000 km/s","150,000 km/s","1,000 km/s"], answer: "300,000 km/s" },
    { q: "Which organ in the human body pumps blood?", options: ["Brain","Lungs","Heart","Liver"], answer: "Heart" },
    { q: "What is the process by which plants make their own food?", options: ["Respiration","Photosynthesis","Transpiration","Digestion"], answer: "Photosynthesis" },
    { q: "What force keeps us on the ground?", options: ["Magnetism","Friction","Gravity","Tension"], answer: "Gravity" },
    { q: "Which vitamin is produced when our skin is exposed to sunlight?", options: ["Vitamin A","Vitamin B","Vitamin C","Vitamin D"], answer: "Vitamin D" },
    { q: "Which part of the plant carries water from roots to leaves?", options: ["Roots","Xylem","Phloem","Stem"], answer: "Xylem" }
  ],
  history: [
    { q: "Who was the first President of the United States?", options: ["George Washington","Abraham Lincoln","Thomas Jefferson","John Adams"], answer: "George Washington" },
    { q: "In which year did World War II end?", options: ["1940","1945","1939","1950"], answer: "1945" },
    { q: "Which empire was ruled by Alexander the Great?", options: ["Mongol Empire","Macedonian Empire","Roman Empire","Ottoman Empire"], answer: "Macedonian Empire" },
    { q: "Who discovered America in 1492?", options: ["Christopher Columbus","Vasco da Gama","Ferdinand Magellan","Marco Polo"], answer: "Christopher Columbus" },
    { q: "The Great Wall is located in which country?", options: ["India","China","Egypt","Mexico"], answer: "China" },
    { q: "Who was known as the 'Maid of Orléans'?", options: ["Cleopatra","Joan of Arc","Queen Elizabeth","Catherine the Great"], answer: "Joan of Arc" },
    { q: "The Renaissance began in which country?", options: ["France","Italy","Germany","England"], answer: "Italy" },
    { q: "Who was the first man to step on the moon?", options: ["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","Michael Collins"], answer: "Neil Armstrong" },
    { q: "The Berlin Wall fell in which year?", options: ["1985","1989","1991","1995"], answer: "1989" },
    { q: "Which civilization built the pyramids of Giza?", options: ["Maya","Egyptian","Greek","Roman"], answer: "Egyptian" }
  ]
};

// ===== LOGIN =====
function loginUser() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  if (email === "admin@gmail.com" && pass === "1234") {
    localStorage.setItem("user", email);
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("quizPage").style.display = "flex";
  } else {
    document.getElementById("loginError").innerText = "Invalid credentials";
  }
}

function logout() { location.reload(); }

// ===== THEME =====
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light-mode");
};

// ===== QUIZ =====
function startQuiz() {
  selectedCategory = document.getElementById("category").value;
  score = 0
    currentIndex = 0;
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 30;
  document.getElementById("timer").innerText = "Time Left: " + timeLeft;

  const timerBar = document.getElementById("timerBar");
  timerBar.style.width = "100%";
  timerBar.style.transition = "width 1s linear";

  timer = setInterval(() => {
    document.getElementById("timer").innerText = "Time Left: " + timeLeft;
    timerBar.style.width = (timeLeft / 30 * 100) + "%";
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);

  let data = quizData[selectedCategory][currentIndex];
  document.getElementById("question").innerText = data.q;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  data.options.forEach(option => {  // <-- fixed property name
    let btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option, btn);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("score").innerText = "Score: " + score;
}

function checkAnswer(selected, btn) {
  let correct = quizData[selectedCategory][currentIndex].answer; // <-- fixed property name
  let buttons = document.querySelectorAll("#options button");

  buttons.forEach(b => {
    b.disabled = true;
    if (b.innerText === correct) b.classList.add("correct");
  });

  if (selected === correct) {
    score++;
    correctSound.play();
  } else {
    btn.classList.add("wrong");
    wrongSound.play();
  }

  document.getElementById("score").innerText = "Score: " + score;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizData[selectedCategory].length) {
    showQuestion();
  } else {
    clearInterval(timer);
    document.getElementById("quizPage").style.display = "none";
    document.getElementById("resultPage").style.display = "flex";
    document.getElementById("finalScore").innerText = "Final Score: " + score;
    saveLeaderboard();
  }
}

// ===== BACK BUTTONS =====
function backToQuiz() {
  document.getElementById("resultPage").style.display = "none";
  document.getElementById("quizPage").style.display = "flex";
}

function backToResult() {
  document.getElementById("certificatePage").style.display = "none";
  document.getElementById("leaderboardPage").style.display = "none";
  document.getElementById("resultPage").style.display = "flex";
}

// ===== LEADERBOARD =====
function saveLeaderboard() {
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.push({ name: localStorage.getItem("user"), score: score });
  localStorage.setItem("leaderboard", JSON.stringify(board));
}

function showLeaderboard() {
  document.getElementById("resultPage").style.display = "none";
  document.getElementById("leaderboardPage").style.display = "flex";

  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.sort((a,b)=>b.score-a.score);

  let list = document.getElementById("leaderboardList");
  list.innerHTML = "";

  board.forEach((player,index)=>{
    let medal = "";
    if(index===0) medal="🥇 ";
    else if(index===1) medal="🥈 ";
    else if(index===2) medal="🥉 ";

    let username = player.name.split("@")[0];

    let li = document.createElement("li");

    let span = document.createElement("span");
    span.innerText = medal + username + " - " + player.score;

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = ()=>{
      let newName = prompt("Enter new username:", username);
      if(newName){
        board[index].name = newName + "@gmail.com";
        localStorage.setItem("leaderboard", JSON.stringify(board));
        showLeaderboard();
      }
    };

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = () => {
      if(confirm("Are you sure you want to delete this entry?")){
        board.splice(index,1);
        localStorage.setItem("leaderboard", JSON.stringify(board));
        showLeaderboard();
      }
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// ===== CERTIFICATE =====
function showCertificate(){
  document.getElementById("resultPage").style.display = "none";
  document.getElementById("certificatePage").style.display = "flex";

  document.getElementById("certName").innerText = localStorage.getItem("user").split("@")[0];
  document.getElementById("certScore").innerText = "Score: " + score;
}

function downloadPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(24);
  doc.text("Certificate of Achievement", 20, 30);
  doc.setFontSize(18);
  doc.text("Name: " + localStorage.getItem("user").split("@")[0], 20, 50);
  doc.text("Score: " + score, 20, 70);
  doc.save("certificate.pdf");
}

