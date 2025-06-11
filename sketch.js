let song, fft, button; // Music and control button variables
let expandingCircles = []; // Used to store the expanding large circles
let patternCircle; // Global variable: angle for rotating the spike lines, starts at 0

function preload(){
  song = loadSound('audio/girlfriend.MP3');
}

function setup() {
  // Create the canvas using  the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // use radians for angle measurements

  // Start music loop and connect FFT analyzer
  song.loop();
  fft = new p5.FFT();
  fft.setInput(song);

  // Create a button to control music playback
  button = createButton('Play/Pause');
  // Position the button at the bottom center of the canvas
  button.position((width - button.width) / 2, height - button.height - 10);
  button.mousePressed(playPause);

  // Initialize the main pattern circle at the center with radius 200
  patternCircle = new PatternCircle(width / 2, height / 2, 200);
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
  let outerR = map(level, 0, 255, 0, 100)// The outer radius changes with the music level: louder is longer spikes
  
  //Whenever the beat gets stronger, new large circles are spawned at the center. 
  // Each circle grows in size and fades out, creating a ripple-like effect—one ring per beat.
  // Spawn a new expanding circle when the beat is strong.
  // At most one circle is added every 5 frames to avoid overcrowding.
  if (level > 100 && frameCount % 5 === 0) { 
    expandingCircles.push(
      new ExpandingCircle(120, 255)
    );
  }

  // Update and draw all expanding circles; remove them once fully transparent
  for (let i = expandingCircles.length - 1; i >= 0; i--) {
    let ec = expandingCircles[i];
    ec.update();
    ec.draw(width /2, height / 2);
    if (ec.isInvisible()) {
      expandingCircles.splice(i, 1);
    }
  }
  
  // Update rotation angles and draw the central pattern circle
  patternCircle.update(speed);
  patternCircle.draw(scale, dotNumber, outerR);
}

// Class representing a large circle that expands and fades out to create ripple effect
class ExpandingCircle {
  constructor(radius, alpha) {
    this.radius = radius; // Initial radius of the circle
    this.alpha = alpha;   // Initial transparency (255 = fully opaque)
  }

  update() {
    this.radius += 5; // Increase radius to simulate expansion
    this.alpha -= 2;  // Decrease alpha to fade out gradually
  }
  isInvisible() {
    return this.alpha <= 0; // Circle is invisible when fully transparent
  }
  draw(x, y){
    fill(145, 150, 255, this.alpha);
    noStroke();  
    ellipse(x, y, this.radius); 
    }
  }

class PatternCircle{
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.angleDots = 0;     // Controls rotation angle for red dots
    this.lineRotation = 0;  // Controls rotation for spike lines
  }

  update(speed){
  this.angleDots += speed;// controls how fast the red dots rotate
  this.lineRotation -= speed;// Rotate the spike lines counterclockwise by decreasing the angle each frame
  }

  draw(scale, dotNumber, outerR){
    push();
    translate(this.x, this.y);

    // Draw white background circle
    fill(145, 150, 255);
    noStroke();
    circle(0, 0, this.r * 1.3);

    // Draw rotating red dots
    push();
    rotate(this.angleDots); 
    this.drawOuterDots(0, 0, this.r, dotNumber);
    pop();

    // Draw the pink background circle
    fill(145, 150, 255);
    noStroke();
    circle(0, 0, this.r * 0.63);

    // spike lines
    this.drawLine(20, outerR, 30); 

    // Small circles stacked in the center
    noStroke();
    fill(98, 240, 224);
    circle(0, 0, this.r * 0.23);

    fill(214, 178, 255);
    circle(0, 0, this.r * 0.2);

    noFill();
    stroke(80, 255, 120, 60);
    strokeWeight(2.5);
    fill(189, 153, 255);
    circle(0, 0, this.r * 0.15);

    fill(168, 106, 255);
    circle(0, 0,  this.r * 0.07);

    fill(126, 55, 255);
    circle(0, 0,  this.r * 0.03);

    // Draw two black arcs for decoration
    stroke(98, 240, 224);
    strokeWeight(2);
    noFill();
    arc(0, 0, 24, 23, PI * 1.05, PI * 1.85);
    arc(0, 0, 20, 25, PI * 0.45, PI * 0.75);

    pop(); // end main drawing
  }
  
  // Function to draw radial spike lines from the center
  drawLine(innerR, outerR, spikes){
    push();
    rotate(this.lineRotation);
    
    stroke(98, 240, 224);
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
    pop();
  }

  // Draw spinning rings of dots around the center
  drawOuterDots(x, y, r, dotNumber) {
    let maxRadius = r * 0.6 * dotNumber;

    //Creates a visual effect that gradually expands and fades from the center outward.
    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 15); // how many dots on this ring
      // Dot size adjustment: the farther from the center, the larger the dots
      let dotSize = map(i, 10, maxRadius, 3, 10);
      // Dot transparency: the farther from the center, the more transparent the dots
      let dotAlpha = map(i, 10, maxRadius, 255, 25);
      
      for (let j = 0; j < numDots; j++) {
        let angle = TWO_PI * j / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;
        fill(255, dotAlpha);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot
      }
    }
  }
}