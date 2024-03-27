console.log("Lets write The JavaScript");
let currentSong = new Audio();
let songs;
let currfolder;

// time update dunction
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mpeg")) {
      songs.push(element.href.split(`/${folder}/`).pop());
    } else if (element.href.endsWith(".ogg")) {
      songs.push(element.href.split(`/${folder}/`).pop());
    } else if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`/${folder}/`).pop());
    }
  }

  // Show all the songs
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
    
   
   <i class="fa-solid fa-music"></i>
   <div class="info">
     <div>  
     ${song.replace(/%20/g, " ")}</div>
     <div class="ansari">Ansari</div>
   </div>
   
   <div class="playnow">
    <span>play Now</span> 
    <img class= "invert" src="/svg/play.svg" alt="">
     </div> </li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/svg/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


// Display All the albums on the page


  async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/Songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
            <img class= "invert" src="/svg/play.svg" alt="">  
            </div>

            <img src="/Songs/${folder}/card.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}


  

async function main() {
  // get the list of songs
  await getSongs("/");
  playMusic(songs[0], true);

  // Display all the albums on the page
  await displayAlbums()

  // Attach an event listener with play, next and previous
 play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/svg/play.svg";
    }
  });

  //  Listen for timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
}

// Add event listener on seekbar
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = (currentSong.duration * percent) / 100;
});

// add event listner on hamburger

document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

// add event listner on close

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});

// add event listner on previous buttons
previous.addEventListener("click", () => {
  currentSong.pause()
  console.log("Previous clicked")
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
  }
});

// add event listner on next buttons
next.addEventListener("click", () => {
  currentSong.pause();
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  }
});

// add event listner on volumes buttons

document
  .querySelector(".range")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

// Add A event listener to mute the volume

document.querySelector(".volume>img").addEventListener("click", e=>{ 
  if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

})

// document.querySelector(".SS").addEventListener("search", e=>{
//   document.querySelector(".songlist")
// })


main();
