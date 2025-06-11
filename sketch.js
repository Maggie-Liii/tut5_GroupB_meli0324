let strokeColor; 
let baseCircleColor;   // color for the big background circle (usually light color)
let outerDotColor;     // color for the dots in the outer rings (usually reddish)
let angleDots = 0;     // controls how much the red dots rotate
let dotSizes = [];     // stores the size of each ring of dots
let song, fft, button; // Music and control button variables
let expandingCircles = []; // Used to store the expanding large circles

function preload(){
  song = loadSound('audio/girlfriend.MP3');
}

function setup() {
  // Create the canvas using  the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // use radians for angle measurements
  generateColors();

  // Start music loop and connect FFT analyzer
  song.loop();
  fft = new p5.FFT();
  fft.setInput(song);

  // Create a button to control music playback
  button = createButton('Play/Pause');
  // Position the button at the bottom center of the canvas
  button.position((width - button.width) / 2, height - button.height - 10);
  button.mousePressed(playPause);

  // Set the size of the dots in each ring
  let maxRadius = 200 * 1.4; // same as used in drawOuterDots
  for (let r = 10; r < maxRadius; r += 12) {
    let size = random(3, 6); // fix a random size per ring
    dotSizes.push(size);
  }
}

// Move the button when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  button.position((width - button.width) / 2, height - button.height - 10);
}

// Use play/pause to control the play and pause of music
function playPause() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function draw() {
  background(20); // dark background

  // Get average energy level from FFT spectrum and map it to rotation speed
  let spectrum = fft.analyze();
  let level = fft.getEnergy("mid"); // Using "mid" frequency energy for visual sync
  let scale = map(level, 0, 255, 1.0, 3,0); 
  let dotNumber = map(level, 0, 255, 1.0, 2.5);
  let speed = map(level, 0, 255, 0.001, 0.05); // change sound level into rotation speed
  
  //Whenever the beat gets stronger, new large circles are spawned at the center. 
  // Each circle grows in size and fades out, creating a ripple-like effect—one ring per beat.
  // Spawn a new expanding circle when the beat is strong.
  // At most one circle is added every 5 frames to avoid overcrowding.
  if (level > 100 && frameCount % 5 === 0) { 
    expandingCircles.push({
      radius: 120,
      alpha: 255
    });
  }

  // Update and display each expanding circle.
  for (let i = expandingCircles.length - 1; i >= 0; i--) {
    let c = expandingCircles[i];
    c.radius += 5; // Grow larger each frame
    c.alpha -= 2;  // Fade out each frame
  
    fill(145, 150, 255, c.alpha);
    noStroke();  
    ellipse(width / 2, height / 2, c.radius); 
  
    // Remove the circle when it is fully transparent
    if (c.alpha <= 0) {
      expandingCircles.splice(i, 1);
    }
  }

  drawPatternCircle(width / 2, height / 2, 200, scale, dotNumber);// draw at the center
  angleDots += speed;// controls how fast the red dots rotate
}


 // Generate new random colors and dot sizes
  function generateColors() {    
    // Re-generate dot sizes for each ring
    dotSizes = [];
    let maxRadius = 200 * 0.6;
    for (let r = 10; r < maxRadius; r += 12) {
      let size = random(3, 6); // fix a random size per ring
      dotSizes.push(size);
    }
  }


  // Draw everything in this circle
  function drawPatternCircle(x, y, r, scale, dotNumber) {
    push();
    translate(x, y); 

    // Draw white background circle
    fill(145, 150, 255);
    noStroke();
    circle(0, 0, r * 1.3);

    // Draw rotating red dots
    push();
    rotate(angleDots); 
    drawOuterDots(0, 0, r, dotNumber);
    pop();

    // Draw the pink background circle
    fill(145, 150, 255);
    noStroke();
    circle(0, 0, r * 0.63);

    // Draw lines from center like spikes
    stroke(98, 240, 224);
    let spikes = 30;
    let innerR = 20;
    let outerR = 59;

    for (let i = 0; i < spikes; i++) {
      strokeWeight(i % 2 === 0 ? 3 : 1.5); // thick and thin lines
      let angle1 = TWO_PI * i / spikes;
      let angle2 = TWO_PI * (i + 1) / spikes;
      let x1 = cos(angle1) * innerR;
      let y1 = sin(angle1) * innerR;
      let x2 = cos(angle2) * outerR;
      let y2 = sin(angle2) * outerR;
      line(x1, y1, x2, y2);
    }

    // Small circles stacked in the center
    noStroke();
    fill(98, 240, 224);
    circle(0, 0, r * 0.23);

    fill(214, 178, 255);
    circle(0, 0, r * 0.2);

    noFill();
    stroke(80, 255, 120, 60);
    strokeWeight(2.5);
    fill(189, 153, 255);
    circle(0, 0, r * 0.15);

    fill(168, 106, 255);
    circle(0, 0, r * 0.07);

    fill(126, 55, 255);
    circle(0, 0, r * 0.03);

    // Draw two black arcs for decoration
    stroke(98, 240, 224);
    strokeWeight(2);
    noFill();
    arc(0, 0, 24, 23, PI * 1.05, PI * 1.85);
    arc(0, 0, 20, 25, PI * 0.45, PI * 0.75);

    pop(); // end main drawing
  }

  // Draw spinning rings of dots around the center
  function drawOuterDots(x, y, r, dotNumber) {
    let maxRadius = r * 0.6 * dotNumber;
    let ringIndex = 0;

    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10); // how many dots on this ring
      let dotSize = dotSizes[ringIndex];
      
      for (let j = 0; j < numDots; j++) {
        let angle = TWO_PI * j / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;
        fill(255);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot
      }
      ringIndex++;
    }
  }