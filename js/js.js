const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let authorized_players = [2, 3, 4, 5, 6]
let differents_chrono = [
    [60, "01:00"],
    [90, "01:30"],
    [120, "02:00"]
]
let typing_score = ""
let nPlayers = authorized_players[0]
let nChrono = 0
let currentPlayer = 0
let scorePlayers = []
let bestScorePlayers = []
let rankPlayers = []
let score_min = 0
let score_max = 0

let mute = false
let mobile = false
let keyboardHidden = false

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobile = true
}

function construct_nPlayersChoice() {
    // DIV parent
    let div = document.getElementById('nPlayersChoice')

    // Parcours du tableau pour créer les div
    let i = 1
    authorized_players.forEach(n => {
        let active = (i == 1) ? " active" : ""
        div.innerHTML += `<div class="btn_round playersChoice ${active}" onclick="playersChoice(${n}, this)">${n}</div>`
        i++
    });
}

function construct_chronoChoice() {
    // DIV parent
    let div = document.getElementById('chronoChoice')

    // Parcours du tableau pour créer les div
    div.innerHTML += `<div class="btn_round rectangle chronoChoice active" onclick="chronoChoice(0, this)">Sans</div>`

    differents_chrono.forEach(n => {
        div.innerHTML += `<div class="btn_round rectangle chronoChoice" onclick="chronoChoice(${n[0]}, this)">${n[1]}</div>`
    });
}

function startGame() {
    window.location.replace("game.html?players=" + nPlayers + "&chrono=" + nChrono)
}

function showConfirmNewGame() {
    document.getElementById('confirmNewGame').style.display = "flex"
}

function hidConfirmNewGame() {
    document.getElementById('confirmNewGame').style.display = "none"
}

function newGame() {
    window.location.replace("index.html")
}

function playersChoice(n, div) {
    // On joue un son
    playSound("btn")

    // On cherche les boutons déjà actifs
    let div_playersChoice_already_active = document.getElementsByClassName("btn_round playersChoice active")

    // On les désactives s'il y en a
    if (div_playersChoice_already_active[0] != undefined) {
        div_playersChoice_already_active[0].classList.remove("active")
    }

    // On active le bouton sélectionné 
    div.classList.add("active")

    // On stock dans variable
    nPlayers = n
}

function chronoChoice(n, div) {
    // On joue un son
    playSound("btn")

    // On cherche les boutons déjà actifs
    let div_chronoChoice_already_active = document.getElementsByClassName("btn_round chronoChoice active")

    // On les désactives s'il y en a
    if (div_chronoChoice_already_active[0] != undefined) {
        div_chronoChoice_already_active[0].classList.remove("active")
    }

    // On active le bouton sélectionné 
    div.classList.add("active")

    // On stock dans variable
    nChrono = n
}

function number_key(click, btn, val) {
    // let val = btn.innerHTML

    // On joue un son
    playSound("btn")

    // animation
    if (click) {
        btn.classList.add("anim_btn_click")
        setTimeout(() => {
            btn.classList.remove("anim_btn_click")
        }, 200);
    }

    // Ajoute à typing_score
    if (typing_score.length < 20) {
        typing_score += val
        document.getElementById('typing_score').innerHTML = typing_score
    }
}

function resetTypingScore() {
    document.getElementById('typing_score').innerHTML = ""
    typing_score = ""
}

function skipTurn() {
    typing_score = 0
    valid_typing_score()
}

function valid_typing_score() {
    if (parseInt(typing_score, 10) >= -9999 && parseInt(typing_score, 10) <= 9999) {
        let s = parseInt(eval(typing_score), 10)

        // On met à jour le score
        updateScore(s)

        // on met à jours le meilleur score
        //         updateBestScore(s, bestScorePlayers[currentPlayer - 1])

        // on reset typing_score
        resetTypingScore()

        // On met à jour le dernier joueurs
        updateFirstPlayer()
        updateLastPlayer()

        //On passe au joueur suivant
        nextPlayer()
    }
}

// function updateBestScore(score, bestScore) {
//     // On met à jours le meilleur score
//     if (score > bestScore) {
//         bestScorePlayers[currentPlayer - 1] = score

//         // On l'affiche
//         document.getElementById('bestPoints_J' + currentPlayer).innerHTML = bestScorePlayers[currentPlayer - 1]
//     }

// }

function updateLastPlayer() {
    // On cherche le score le plus faible
    let lastScore = Math.min(...scorePlayers)

    // On ajouter la classe "lastPlayer" à ce joueur
    for (let i = 0; i < scorePlayers.length; i++) {
        let j = i + 1
        document.getElementById('lastPlayer_J' + j).style.opacity = '0'
        if (scorePlayers[i] == lastScore) {
            document.getElementById('lastPlayer_J' + j).style.opacity = '1'
        }
    }
}

function updateFirstPlayer() {
    // On cherche le score le plus faible
    let firstScore = Math.max(...scorePlayers)

    // On ajouter la classe "lastPlayer" à ce joueur
    for (let i = 0; i < scorePlayers.length; i++) {
        let j = i + 1
        document.getElementById('firstPlayer_J' + j).style.opacity = '0'
        if (scorePlayers[i] == firstScore) {
            document.getElementById('firstPlayer_J' + j).style.opacity = '1'
        }
    }
}

function updateScore(score) {
    // On stock le score
    scorePlayers[currentPlayer - 1] += score

    // On l'affiche
    document.getElementById('score_J' + currentPlayer).innerHTML = scorePlayers[currentPlayer - 1]

    // On update la différence de points
    if (nPlayers == 2) {
        let diff = scorePlayers[0] - scorePlayers[1]
        if (diff < 0) diff *= -1

        document.getElementById('diffPoints').innerHTML = "Différence : " + diff + " points"
    }

    // On anim le score
    if (!mobile) {
        animScore()
    }
}

function animScore() {
    score_max = Math.max(...scorePlayers)

    // Anim background
    let bg_pos = (100 - ((score_max / 250) * 100))
    if (bg_pos < 0) bg_pos = 0
    document.body.style.backgroundPosition = "center " + bg_pos + "%"

    for (let i = 0; i < scorePlayers.length; i++) {
        let position_pixel = (scorePlayers[i] / score_max) * (document.getElementById('column_J' + (i + 1)).clientHeight - 190) - 0
        document.getElementById('player_score_J' + (i + 1)).style.bottom = "calc(" + (position_pixel) + "px)"
    }
}

function surligneActiveColumn() {
    // On récupère la largeur d'une colonne
    let columnWidth = document.getElementById('column_J1').clientWidth

    // On la place sur la bonne colonne
    document.getElementById('grid_column_active').style.width = columnWidth + "px"
    document.getElementById('grid_column_active').style.left = (columnWidth * (currentPlayer - 1)) + "px"
}

function nextPlayer() {
    // SI dernier joueur, on retourne au 1
    if (currentPlayer == nPlayers) {
        currentPlayer = 1
    } else {
        currentPlayer++
    }

    // On surligne la nouvelle colonne
    surligneActiveColumn()
    resetChrono()
}

function construct_columnsPlayers() {
    let part_grid = document.getElementById('part_grid')
    let part_bestPoints = document.getElementById('part_bestPoints')

    // Pour chaque joueurs, on construit sa colonne
    for (let i = 0; i < scorePlayers.length; i++) {
        let j = i + 1

        part_grid.innerHTML += `
        <div class="grid_column" id="column_J${j}">
        <div class="_player_score" id="player_score_J${j}">
        <div class="_nom">
        <div class="nom">
        <input type="text" class="pseudo" placeholder="...">
        <div class="lastPlayer" id="lastPlayer_J${j}">Dernier</div>
        <div class="firstPlayer" id="firstPlayer_J${j}">Premier</div>
        </div>
        </div>
        <div class="_score">
        <div class="score" id="score_J${j}">${scorePlayers[i]}</div>
        </div>
        </div>
        </div>
        `

        // part_bestPoints.innerHTML += `
        // <div class="_best_points">
        //     max :&nbsp;<span class="score" id="bestPoints_J${j}">0</span>&nbsp;points
        // </div>
        // `

        // on met son best score à 0
        bestScorePlayers[i] = 0

    }

    // On ajoute la colonne transparente pour surligner le joueur actuel
    part_grid.innerHTML += `
    <div class="grid_column active" id="grid_column_active">
    </div>
    `
}

function playSound(name) {
    if (!mute) {
        document.getElementById("myAudio").play()
    }
}

function init_index() {
    construct_nPlayersChoice()
    construct_chronoChoice()
}

function init_game() {
    // On masque la confirmation pour nouvelle partie
    hidConfirmNewGame()

    // On récupère le noimbre de joueurs choisis
    nPlayers = urlParams.get('players')

    // On récupère le temps chrono choisi
    nChrono = urlParams.get('chrono')

    // SI 2 joueurs, on affiche "différence"
    if (nPlayers == 2) {
        document.getElementById('diffPoints').style.display = "flex"
    } else {
        document.getElementById('diffPoints').style.display = "none"
    }

    // On génère l'array de score
    for (let i = 0; i < nPlayers; i++) {
        scorePlayers[i] = 0
    }

    // On génère la grille
    construct_columnsPlayers()

    // Premier joueur est le 1
    currentPlayer = 1

    // On surligne la bonne colonne
    surligneActiveColumn()

    // Init chrono
    init_chrono(nChrono)
}

// Retire les accent du mot
function sansAccents(str) {
    var map = {
        '-': ' ',
        '-': '_',
        'a': 'á|à|ã|â|À|Á|Ã|Â',
        'e': 'é|è|ê|É|È|Ê',
        'i': 'í|ì|î|Í|Ì|Î',
        'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
        'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c': 'ç|Ç',
        'n': 'ñ|Ñ'
    };

    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    };

    return str;
};




$(document).ready(function() {

    testSearch()

    $("#search").keyup(function(e) {
        // on créé l'URL
        let mot = $("#search").val()
        mot = sansAccents(mot.toLowerCase())
        let url = 'https://1mot.net/' + mot

        // On reset l'état à chaque frappe
        reset()

        // Quand on appuie sur ENTER
        if (e.key == "Enter" && $("#search").val() != "") {
            $("#search").parent().addClass("bad")
            $.get(url, function(data, status, xhr) {

                // On vérifie si le mot éxiste (par rapport à l'HTML de la page cible)
                var inc = data.includes("n'est pas valide")
                if (!inc) {
                    reset()
                    $("#search").parent().addClass("good")
                } else {
                    reset()
                    $("#search").parent().addClass("bad")
                }
            });
        }

        // Reset de l'état
        function reset() {
            $("#search").parent().removeClass("good")
            $("#search").parent().removeClass("bad")
        }

    })


    // TEST SEARCH
    function testSearch() {
        let url = 'https://1mot.net/pomme'
        $.get(url, function(data, status, xhr) {}).fail(function() {
            $("#search").parent().css("display", "none")
        })
    }

    $("body").keyup(function(e) {
        if (e.key == "Enter") {
            valid_typing_score()
        }

        if (e.key == "Backspace") {
            resetTypingScore()
        }

        if (e.key >= 0 && e.key <= 9 || e.key == '-' || e.key == "+") {
            number_key(false, null, e.key)
        }

        console.log(e.key);
    })

    $('#toggleKeyboard').click(function() {
        toggleKeyboard()
    })

    function toggleKeyboard() {
        $('#numbers_keys').toggle()
            // Affichage clavier
        if (keyboardHidden) {

        }
        // Masquage
        else {
            keyboardHidden = true

        }
    }
});