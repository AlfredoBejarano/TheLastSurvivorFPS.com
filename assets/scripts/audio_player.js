var audioPlayer = document.getElementById("audioPlayer")
var audioPlayerName = document.getElementById("audioPlayerName")

function play(songPath, songName) {
	audioPlayer.setAttribute("src", songPath)
	audioPlayer.play()

	audioPlayerName.innerHTML = "Now playing: " + songName
}