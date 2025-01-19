const socket = io("http://localhost:3000"); // Connects to backend
let lobbyId = null;
let playerName = prompt("Enter your name:");

function createLobby() {
    fetch("http://localhost:3000/create-lobby", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            lobbyId = data.lobbyId;
            // document.getElementById("lobby-code").textContent = lobbyId;
            document.getElementById("create-join").style.display = "none";
            document.getElementById("lobby").style.display = "block";
            socket.emit("join-lobby", { lobbyId, playerName });
        });
}

function joinLobby() {
    lobbyId = document.getElementById("lobbyId").value.trim();
    if (lobbyId) {
        socket.emit("join-lobby", { lobbyId, playerName });
        // document.getElementById("lobby-code").textContent = lobbyId;
        document.getElementById("create-join").style.display = "none";
        document.getElementById("lobby").style.display = "block";
    }
}

socket.on("update-lobby", (lobbyData) => {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = "";
    lobbyData.players.forEach(player => {
        let li = document.createElement("li");
        li.textContent = player.name;
        playerList.appendChild(li);
    });

    if (lobbyData.host === socket.id) {
        document.getElementById("start-game-btn").style.display = "block";
    } else {
        document.getElementById("start-game-btn").style.display = "none";
    }
});

function startGame() {
    socket.emit("start-game", lobbyId);
}

socket.on("game-started", (data) => {
    alert(data.message);
    // Here you can transition to the actual game screen
});

socket.on("error", (data) => {
    alert(data.message);
});
