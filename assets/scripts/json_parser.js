var albums = {}
var songs = []
var currentSong = undefined
var mode = "repeat-all"

function getSongsData() {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", "./assets/scripts/songs_data.json",false);
    Httpreq.send(null);
    albums = JSON.parse(Httpreq.responseText);
    albums.sort((a,b) => a.order - b.order)
    albums.forEach(function(album, albumIndex) {
    	album.songs.sort((a,b) => a.order - b.order)
    	album.songs.forEach(function(song) {
    		song.cover = album.cover
    		song.album = album.name
    	})
    	songs = songs.concat(album.songs)
    })
}

function generateSection(section) {
	var titleTag = document.createElement("h3")
	var titleTextNode = document.createTextNode(section.name)

	titleTag.appendChild(titleTextNode)

	return titleTag
}

function generateSongList(section, containerId) {
	var paragraphTag = document.createElement("p")
	var listTag = document.createElement("ol")

	section.songs.sort((a,b) => a.order - b.order)

	section.songs.forEach(function(song, index, array) {
		var itemTag = document.createElement("li")		
		var linkTag = document.createElement("a")
	
		if(containerId == "tab_container") {
			linkTag.href = song.tab_url
		} else {
			linkTag.addEventListener("click", function() {
				play(song)
			})
		}

		linkTag.appendChild(document.createTextNode(song.name))
		itemTag.appendChild(linkTag)

		listTag.appendChild(itemTag)
	})

	paragraphTag.appendChild(listTag)
	return paragraphTag
}

function generateHtmlDocument(containerId) {	
	var container = document.getElementById(containerId)

	albums.forEach(function(section) {
		container.appendChild(generateSection(section))
		container.appendChild(generateSongList(section, containerId))
	})
}

/* Audio Player */

var audioPlayer = document.getElementById("audioPlayer")
var audioPlayerName = document.getElementById("audioPlayerName")

function initPlayer() {
	audioPlayer.ontimeupdate = function() {
		var progress = (audioPlayer.currentTime * 100) / audioPlayer.duration
		document.getElementById("progress").style.width = progress + "%"
	}

	audioPlayer.addEventListener("ended", function(){
		if(mode == "repeat-all") {
			skipSong("next")
		} else {
			audioPlayer.currentTime = 0
			audioPlayer.play()
		}		     	
	});

	document.getElementById("play").addEventListener("click", function() {
		playButton()
	})

	document.getElementById("repeat").addEventListener("click", function() {
		if(mode == "repeat-all") {
			setPlayMode("repeat-one")
		} else {
			setPlayMode("repeat-all")
		}
	})

	setPlayMode("repeat-all")
	setupSkipButton("prev")
	setupSkipButton("next")
}

function play(song) {
	currentSong = song
	setMobilePlayerMetadata()

	document.getElementById("play").className = "fa fa-pause"

	var download = document.getElementById("download")
	download.href = currentSong.mp3_url
	download.setAttribute("download","")

	audioPlayer.setAttribute("src", currentSong.mp3_url)
	audioPlayer.play()

	audioPlayerName.innerHTML = currentSong.name
}

function setMobilePlayerMetadata() {
	if('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
    		title: currentSong.name,
    		artist: 'TheLastSurvivorFPS',
    		album: currentSong.album,
    		artwork: [
		      { src: currentSong.cover,   sizes: '96x96',   type: 'image/png' },
		      { src: currentSong.cover, sizes: '128x128', type: 'image/png' },
		      { src: currentSong.cover, sizes: '192x192', type: 'image/png' },
		      { src: currentSong.cover, sizes: '256x256', type: 'image/png' },
		      { src: currentSong.cover, sizes: '384x384', type: 'image/png' },
		      { src: currentSong.cover, sizes: '512x512', type: 'image/png' },
    		]
  		});	

  		navigator.mediaSession.setActionHandler('previoustrack', function() {
  			skipSong("prev")
  		});
  		navigator.mediaSession.setActionHandler('nexttrack', function() {
  			skipSong("next")
  		});
  		navigator.mediaSession.setActionHandler('play', function() {
  			playButton()
  		});
  		navigator.mediaSession.setActionHandler('pause', function() {
  			playButton()
  		});
	}
}

function setupSkipButton(type) {
	document.getElementById(type).addEventListener("click", function() {
		skipSong(type)
	})
}

function playButton() {
	if(currentSong == undefined) {
		play(songs[0])
	} else {
		var playButton = document.getElementById("play")
		if(audioPlayer.paused) {
			playButton.className = "fa fa-play"
			audioPlayer.play()
		} else {
			playButton.className = "fa fa-pause"
			audioPlayer.pause()
		}
	}
}

function setPlayMode(playMode) {
	mode = playMode
	if(mode == "repeat-all") {
		document.getElementById("repeat").style.opacity = 0.26
	} else {
		document.getElementById("repeat").style.opacity = 1
	}
}

function skipSong(type) {
	var index = songs.indexOf(currentSong)
	var isLast = index == (songs.length - 1)
	var isFirst = index == 0

	if(type == "prev") {
		if(currentSong == undefined || isFirst) {
			currentSong = songs[songs.length - 1]
		} else {
			currentSong = songs[index - 1]
		}
	} else {
		if(currentSong == undefined || isLast) {
			currentSong = songs[0]
		} else {
			currentSong = songs[index + 1]
		}
	}

	if(currentSong == undefined) {

	}

	play(currentSong)
}