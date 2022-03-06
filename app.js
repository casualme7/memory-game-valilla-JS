// DECLARING VARIABLES (query, sounds, default ones etc.)
let content = document.querySelector(".content");
let setting = document.querySelector(".settings");
let setting2 = document.querySelector(".settings2");
let settingsMenu = document.querySelector(".settingsMenu");
let settingsMenu2 = document.querySelector(".settingsMenu2");
let exitButton = document.querySelector(".exitButton");
let pairSettings = document.querySelector("#pairSettings");
let fullScreenButton = document.querySelector(".fullScreenButton");
let stop1 = document.querySelector("#stop");
let next = document.querySelector("#next");
let secret = document.querySelector("#secret");
let set1exit = document.querySelector(".set1exit");
let set2exit = document.querySelector(".set2exit");
let picInfo = document.querySelector(".picInfo");
let scoreboard = document.querySelector(".scoreboard");
let yourUsername = document.querySelector(".yourUsername");
let updateUserInput = document.querySelector(".updateUserInput");
let updateUserButton = document.querySelector(".updateUserButton");
let userInfo = document.querySelector(".userInfo");
let scoreboardInfo = document.querySelector(".scoreboardInfo");
let set3exit = document.querySelector(".set3exit");
//
let guessContents = [
	"Images/loki.jpg",
	"Images/ironman.jpg",
	"Images/doctorStrange.jpg",
	"Images/nickFury.jpg",
	"Images/blackWidow.jpeg",
	"Images/thor.jpg",
	"Images/blackPanther.jpg",
	"Images/spiderman.jpg",
	"Images/hulk.jpg",
	"Images/warMachine.jpg",
	"Images/omniMan.jpg",
	"Images/superman.jpg",
	"Images/batman.jpg",
	"Images/wonderWoman.jpg",
	"Images/theFlash.jpg",
	"Images/aquaman.jpg",
	"Images/thanos.jpg",
	"Images/starlord.jpg",
	"Images/stepenwolf.png",
	"Images/brainiac.jpg",
	"Images/kratos.jpg",
];

// LENGTH CONTROL (MAX = 21) + LOCAL STORAGE
let localStorageArr = localStorage.arrayLength;
if (localStorageArr) {
	guessContents.length = localStorageArr;
} else {
	guessContents.length = 21;
}
//
let rngBackgroundPic = localStorage.rngBackground;
if (rngBackgroundPic) {
	document.body.background = `Wallpapers/${rngBackgroundPic}.jpg`;
	picInfo.innerHTML = localStorage.rngBackground;
}
let username = "";
if (localStorage.USERNAME) {
	username = localStorage.USERNAME;
	yourUsername.innerText = localStorage.USERNAME;
} else {
	username = `User_${Math.ceil(Math.random() * 10000)}`;
	yourUsername.innerText = `User_${Math.ceil(Math.random() * 10000)}`;
}
// MAKES 2 RANDOMIZED ARAYS AND COMBINES THEM INTO ONE
let randomArray = [...guessContents, ...guessContents];
let guessContentFinal = randomArray.sort(() => Math.random() - 0.5);
//
let conffetti = new Audio("./Sounds/conffetti.mp3");
conffetti.volume = 0.2;
let checkMark = new Audio("./Sounds/checkMark.mp3");
checkMark.volume = 0.2;
let denied = new Audio("./Sounds/denied1.mp3");
denied.volume = 0.2;
let cheer = new Audio("./Sounds/cheer2.mp3");
cheer.volume = 0.2;
let click = new Audio("./Sounds/click.mp3");
click.volume = 0.8;
let secretSound = new Audio("./Sounds/secret.mp3");
secretSound.volume = 1;
//
let alt1 = null;
let alt2 = null;
let pick1 = null;
let pick2 = null;
let turn = false;
let bugPerventionDelay = false;
let scoreStarted = false;
let score = "";
let intervalX;
let winningCounter = guessContents.length;

// MAIN GENERATOR
for (let i = 0; i < guessContentFinal.length; i++) {
	setTimeout(() => {
		let newDiv = document.createElement("div");
		newDiv.classList.add("shrinked");
		setTimeout(() => {
			newDiv.classList.remove("shrinked");
			newDiv.classList.add("expanding");
		}, 300);
		let newImg = document.createElement("img");
		newImg.alt = guessContentFinal[i];
		newImg.classList.add("baseImg");
		let newImg2 = document.createElement("img");
		newImg2.src = guessContentFinal[i];
		newImg2.classList.add("secondImg");
		newImg.src = "./Images/card.png";
		newDiv.appendChild(newImg);
		newDiv.appendChild(newImg2);
		content.appendChild(newDiv);
	}, 15 * i);
}

// ON CLICK MAIN FUNCTION / MAIN FUNCTIONALLITY
document.body.addEventListener("click", (e) => {
	if (!turn) {
		if (!bugPerventionDelay) {
			if (e.target.tagName === "IMG" && e.target.alt !== "") {
				if (!scoreStarted) {
					timeFrame();
					scoreStarted = true;
				}
				e.target.style.transform = "rotateY(-90deg)";
				setTimeout(() => {
					e.target.style.visibility = "hidden";
				}, 100);
				if (!alt1) {
					alt1 = e.target.alt;
					pick1 = e.target;
					bugPerventionDelay = true;
					setTimeout(() => {
						bugPerventionDelay = false;
					}, 710);
				} else if (!alt2) {
					if (!bugPerventionDelay) {
						alt2 = e.target.alt;
						pick2 = e.target;
						turn = !turn;
					}
				}
				if (alt1 && alt2 && alt1 !== alt2) {
					setTimeout(() => {
						denied.play();
						setTimeout(() => {
							alt1 = "";
							alt2 = "";
							pick1.style.transform = "rotateY(0deg)";
							pick1.style.visibility = "visible";
							pick2.style.transform = "rotateY(0deg)";
							pick2.style.visibility = "visible";
							turn = !turn;
						}, 500);
					}, 1000);
				} else if (alt1 && alt2 && alt1 === alt2) {
					alt1 = "";
					alt2 = "";
					setTimeout(() => {
						conffetti.play();
						checkMark.play();
						turn = !turn;
						winningCounter--;
						winningCounterFun();
					}, 500);
				}
			}
		}
	}
});

let obj = {
	username: username,
	score: score,
};

// WINNING SOUND AND RELOAD IF YOU GUESS EVERYTHING
let winningCounterFun = () => {
	if (winningCounter <= 0) {
		cheer.play();
		scoreStarted = false;
		clearInterval(intervalX);
		db.collection("timeAttack")
			.add(obj)
			.then(console.log("Database entry Successfull!"))
			.catch((err) => {
				console.log("ERROR:", err);
			});
		setTimeout(() => {
			location.reload();
		}, 10500);
	}
};

// SCOREBOARD
let timeFrame = () => {
	scoreboard.style.visibility = "visible";
	score = 0;
	intervalX = setInterval(() => {
		score += 1;
		obj.score = score;
		scoreboard.innerHTML = `Score: <span style="color: red">${score}<span>`;
	}, 100);
};

// CHANGE VALUE ACCODRING TO OPTION SELECTED
pairSettings.addEventListener("change", function () {
	let valueX = parseInt(this.value);
	localStorage.setItem("arrayLength", valueX);
	click.play();
});

// SETTINGS BUTTON IN TOP-RIGHT CORNER TO OPEN SETTINGS MENU
setting.addEventListener("click", () => {
	settingsMenu.classList.remove("settingsShrinked");
	settingsMenu.classList.add("settingsExpanded");
	settingsMenu2.classList.remove("settingsExpanded");
	settingsMenu2.classList.add("settingsShrinked");
	scoreboardInfo.classList.remove("settingsExpanded");
	scoreboardInfo.classList.add("settingsShrinked");
	click.play();
});

// EXIT BUTTON IN SETTINGS MENU TO CLOSE IT
exitButton.addEventListener("click", () => {
	settingsMenu.classList.remove("settingsExpanded");
	settingsMenu.classList.add("settingsShrinked");
	click.play();
	setTimeout(() => {
		location.reload();
	}, 500);
});

// SETTINGS 2 MENU
setting2.addEventListener("click", () => {
	settingsMenu2.classList.remove("settingsShrinked");
	settingsMenu2.classList.add("settingsExpanded");
	settingsMenu.classList.remove("settingsExpanded");
	settingsMenu.classList.add("settingsShrinked");
	scoreboardInfo.classList.remove("settingsExpanded");
	scoreboardInfo.classList.add("settingsShrinked");
	click.play();
});

// SETTING BCKGR DO DEFAULT
stop1.addEventListener("click", () => {
	click.play();
	settingsMenu2.classList.remove("settingsExpanded");
	settingsMenu2.classList.add("settingsShrinked");
	document.body.style.background = "none";
	document.body.style.backgroundColor = "#0a9396";
	localStorage.removeItem("rngBackground");
	location.reload();
});

// SECRET
secret.addEventListener("click", () => {
	secretSound.play();
	settingsMenu2.classList.remove("settingsExpanded");
	settingsMenu2.classList.add("settingsShrinked");
});

// NEXT BUTTON FOR RANDOMIZING THE BCKGR IMAGE
next.addEventListener("click", () => {
	click.play();
	settingsMenu2.classList.remove("settingsExpanded");
	settingsMenu2.classList.add("settingsShrinked");
	let rng = Math.ceil(Math.random() * 19);
	localStorage.setItem("rngBackground", rng);
	picInfo.innerHTML = localStorage.rngBackground;
	document.body.background = `Wallpapers/${rng}.jpg`;
});

// FULL SCREEN BUTTON
fullScreenButton.addEventListener("click", () => {
	openFullscreen();
	settingsMenu.classList.remove("settingsExpanded");
	settingsMenu.classList.add("settingsShrinked");
	click.play();
});

// SET1EXIT
set1exit.addEventListener("click", () => {
	settingsMenu2.classList.remove("settingsExpanded");
	settingsMenu2.classList.add("settingsShrinked");
	click.play();
});

set2exit.addEventListener("click", () => {
	settingsMenu.classList.remove("settingsExpanded");
	settingsMenu.classList.add("settingsShrinked");
	click.play();
});

updateUserButton.addEventListener("click", () => {
	click.play();
	if (
		updateUserInput.value.length < 10 &&
		updateUserInput.value.length > 2 &&
		username !== updateUserInput.value
	) {
		localStorage.setItem("USERNAME", updateUserInput.value);
		username = updateUserInput.value;
		yourUsername.innerText = updateUserInput.value;
		obj.username = updateUserInput.value;
		updateUserInput.value = "";
		updateUserInput.placeholder = "SUCCESSFULL!";
		scoreboardInfo.classList.remove("settingsExpanded");
		scoreboardInfo.classList.add("settingsShrinked");
	} else if (username === updateUserInput.value) {
		updateUserInput.value = "";
		updateUserInput.placeholder = "Exact same nickname...";
	} else {
		updateUserInput.value = "";
		updateUserInput.placeholder = "Between 3 and 9 chars plz";
	}
});

userInfo.addEventListener("click", () => {
	scoreboardInfo.classList.remove("settingsShrinked");
	scoreboardInfo.classList.add("settingsExpanded");
	settingsMenu2.classList.remove("settingsExpanded");
	settingsMenu2.classList.add("settingsShrinked");
	settingsMenu.classList.remove("settingsExpanded");
	settingsMenu.classList.add("settingsShrinked");
	click.play();
});

set3exit.addEventListener("click", () => {
	scoreboardInfo.classList.remove("settingsExpanded");
	scoreboardInfo.classList.add("settingsShrinked");
	click.play();
});

//FULLSCREEN FUNC (FOR ALL BROWSERS)
var elem = document.documentElement;
//
function openFullscreen() {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE11 */
		elem.msRequestFullscreen();
	}
}

// CONSOLE NOTES
console.log("Small project i had fun on, nothing special");
console.log("but could be interesting in right hands.");
