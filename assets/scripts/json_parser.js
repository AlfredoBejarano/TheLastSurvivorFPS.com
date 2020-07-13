function GetSongsData() {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", "./assets/scripts/songs_data.json",false);
    Httpreq.send(null);
    return JSON.parse(Httpreq.responseText);      
}

function generateSection(section) {
	var titleTag = document.createElement("h3")
	var titleTextNode = document.createTextNode(section.name)

	titleTag.appendChild(titleTextNode)

	return titleTag
}

function generateSongList(section, containerId) {
	var paragraphTag = document.createElement("p")
	var listTag = document.createElement("ul")

	section.songs.forEach(function(song, index, array) {
		var itemTag = document.createElement("li")

		var linkTag = document.createElement("a")

		if(containerId == "tab_container") {
			linkTag.href = song.tab_url
		} else {
			linkTag.href = song.mp3_url
		}

		linkTag.appendChild(document.createTextNode(song.name))

		itemTag.appendChild(linkTag)
		listTag.appendChild(itemTag)
	})

	paragraphTag.appendChild(listTag)
	return paragraphTag
}

function generateHtmlDocument(containerId) {
	var songsData = GetSongsData()
	var container = document.getElementById(containerId)

	songsData.forEach(function(section) {
		container.appendChild(generateSection(section))
		container.appendChild(generateSongList(section, containerId))
	})
}