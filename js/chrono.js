let maxSeconds = 30
let seconds = maxSeconds
let play = false

let chronoTick


function init_chrono(n) {
    if (nChrono > 0) {
        maxSeconds = n
        seconds = maxSeconds
        play = false

        chronoPlay()
        updateChronoText()
    }
    else {
        // on cache le chrono
        document.getElementById('part_chrono').style.display = "none"
    }
}

function chronoPlay() {
    // STOP
    if(play) {
        play = false
        clearInterval(chronoTick)
        document.getElementById('chrono_text').innerHTML = seconds + " sec - PAUSE"
        // updateChronoText()
    }

    // PLAY
    else {
        play = true
        updateChronoText()
        updateChronoBar()
        chronoTick = setInterval(updateChrono, 1000);
    }

    console.log(play)
}

function updateChrono() {
    if (seconds > 0) {
        seconds--
        updateChronoText()
        updateChronoBar()
    }

    else {
        skipTurn()
        resetChrono()
    }
}

function resetChrono() {
    clearInterval(chronoTick)
    init_chrono(maxSeconds)
}

function updateChronoText() {
    document.getElementById('chrono_text').innerHTML = seconds + " sec"
}

function updateChronoBar() {
    let pourcent = (seconds / maxSeconds) * 100
    document.getElementById('chrono_bar').style.width = pourcent + "%"
}