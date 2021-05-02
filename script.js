// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const changeImg = document.getElementById('image-input');  // 



let submit = document.querySelector('button[type=submit]');
let clear = document.querySelector('button[type=reset]');
let read = document.querySelector('button[type=button]');


// Use this to populate list of voices (From Speech Synthesis)
var synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voice-selection");
var voices = []
function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');

    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.remove(0);
  voiceSelect.disabled = false;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}


///////




// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
 
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
 

  
  // Fill Black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Get dimensions
  let dimensions = getDimensions(canvas.width, canvas.height, img.width, img.height);


  // Draw the picture
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);

  // Toggle submit, clear, and read text buttons
  //const submit = document.querySelector('button[type=submit]');
  submit.disabled = false;
  //const clear = document.querySelector('button[type=reset]');
  clear.disabled = true;
  //const read = document.querySelector('button[type=button]');
  read.disabled = true;
  


  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});



// Fires when image is changed
changeImg.addEventListener('change', () => {

  // load in the selected image into the Image object (img) src attribute

  img.src = URL.createObjectURL(changeImg.files[0]);

  // Set img alt as object file name

  img.alt = changeImg.files[0].name;
});



let form = document.getElementById('generate-meme');
// Event listener for when Generate is clicked
form.addEventListener('submit', (event) => {

  event.preventDefault();


  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');

  // Get top and bottom texts 
  const top = document.getElementById('text-top').value;
  const bottom= document.getElementById('text-bottom').value;


  // Add texts to canvas
  ctx.font = "30px Arial";
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(top, canvas.width/2, 50);
  ctx.fillText(bottom, canvas.width/2, canvas.height-50);

  // Toggle buttons
  // disable generate (submit)
  submit.disabled = true;
  // enable clear, read, voice
  clear.disabled = false;
  read.disabled = false;
  document.getElementById("voice-selection").disabled = false;

 

});


// Event Listener for Clear
clear.addEventListener('click' , () => {

  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Toggle buttons 
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
});


// Event Listener for Read
read.addEventListener('click', () => {

  // Get top and bottom texts 
  const top = document.getElementById('text-top').value;
  const bottom= document.getElementById('text-bottom').value;


  let volume = volumeSlider.value;
  let utterance = new SpeechSynthesisUtterance(top + '  ' + bottom);

  utterance.volume = volumeSlider.value / 100.0 ;


var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

for(var i = 0; i < voices.length ; i++) {
  if(voices[i].name === selectedOption) {
    utterance.voice = voices[i];
  }
}

  speechSynthesis.speak(utterance);

});




const volumeSlider = document.querySelector('[type=range]');


// Event Listener for Volume Slider (vol range)
volumeSlider.addEventListener('input', () => {

  let volumeImg = document.querySelector('img');
  let volume = volumeSlider.value;

  if (volume >= 67) {
    volumeImg.src = 'icons/volume-level-3.svg';
    volumeImg.alt = 'Volume Level 3';
  } 
  else if (volume >= 34) {
    volumeImg.src = 'icons/volume-level-2.svg';
    volumeImg.alt = 'Volume Level 2';
  } 
  else if (volume >= 1) {
    volumeImg.src = 'icons/volume-level-1.svg';
    volumeImg.alt = 'Volume Level 1';
  } 
  else {
    volumeImg.src = 'icons/volume-level-0.svg';
    volumeImg.alt = 'Volume Level 0';
  }


});




/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
