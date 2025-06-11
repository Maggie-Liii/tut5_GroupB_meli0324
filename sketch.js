let strokeColor; 
let baseCircleColor;   // color for the white background circle
let outerDotColor;     // color for the red dots outside
let angleDots = 0;     // controls how much the red dots rotate
let dotSizes = [];     // stores the size of each ring of dots


function setup() {
  // Create the canvas using the size of the window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); // use radians for angle measurements
  generateColors();

  // Set the size of the dots in each ring
  let maxRadius = 200 * 1.4; // same as used in drawOuterDots
    for (let r = 10; r < maxRadius; r += 12) {
      let size = random(3, 6); // fix a random size per ring
      dotSizes.push(size);
    }
}

function draw() {
  background(20); // dark background
  drawPatternCircle(width / 2, height / 2, 200);// draw at the center
  angleDots += 0.005;// controls how fast the red dots rotate
}


 // Generate new random colors
  function generateColors() {
    // pastel colors for background circles
    strokeColor = color(random(0, 255), random(0, 100), random(10, 150));
    baseCircleColor = color(random(200, 255), random(200, 255), random(200, 255));
    bgColor = color(random(150, 255), random(150, 255), random(150, 255));
    
    // bright yellow for radial lines, vibrant red-purple for dots
    lineColor = color(random(200, 255), random(200, 255), random(0, 100));
    outerDotColor = color(random(0, 255), random(0, 80), random(0, 255));
    
    // Re-generate dot sizes for each ring
    dotSizes = [];
    let maxRadius = 200 * 0.6;
    for (let r = 10; r < maxRadius; r += 12) {
      let size = random(3, 6); // fix a random size per ring
      dotSizes.push(size);
    }
  }


  // Draw everything in this circle
  function drawPatternCircle(x, y, r) {
    push();
    translate(x, y); 

    // Draw white background circle
    fill(baseCircleColor);
    noStroke();
    circle(0, 0, r * 1.3);

    // Draw rotating red dots
    push();
    rotate(angleDots); 
    drawOuterDots(0, 0, r);
    pop();

    // Draw the pink background circle
    fill(bgColor);
    stroke(strokeColor);
    strokeWeight(5);
    circle(0, 0, r * 0.63);

    // Draw lines from center like spikes
    stroke(lineColor);
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

    // // Layered small center circles
    noStroke();
    fill(255, 65, 70);
    circle(0, 0, r * 0.23);

    fill(100, 130, 100);
    circle(0, 0, r * 0.2);

    noFill();
    stroke(80, 255, 120, 60);
    strokeWeight(2.5);
    fill(180, 50, 80);
    circle(0, 0, r * 0.15);

    fill(30, 180, 60);
    circle(0, 0, r * 0.07);

    fill(255);
    circle(0, 0, r * 0.03);

    // Draw two black arcs for decoration
    stroke(30, 40, 50, 90);
    strokeWeight(2);
    noFill();
    arc(0, 0, 24, 23, PI * 1.05, PI * 1.85);
    arc(0, 0, 20, 25, PI * 0.45, PI * 0.75);

    // Draw two animated bezier curves.
    let rotateAngle = frameCount * 0.02;
    push();
    rotate(rotateAngle);

    stroke(255, 0, 100);
    strokeWeight(5);
    noFill();
    bezier(0, 0, r * 0.3, -r * 0.1, r * 0.5, r * 0.05, r * 0.65, r * 0.2);

    stroke(255, 60, 160);
    strokeWeight(3);
    bezier(0, 0, r * 0.3, -r * 0.1, r * 0.5, r * 0.05, r * 0.65, r * 0.2);

    pop(); // end bezier rotation
    pop(); // end main drawing
  }

  // Draw red dots in rings around the center
  function drawOuterDots(x, y, r) {
    let maxRadius = r * 0.6;
    let ringIndex = 0;
    for (let i = 10; i < maxRadius; i += 12) {
      let numDots = floor(TWO_PI * i / 10); // how many dots on this ring
      let dotSize = dotSizes[ringIndex];
      
      for (let j = 0; j < numDots; j++) {
        let angle = TWO_PI * j / numDots;
        let dx = x + cos(angle) * i;
        let dy = y + sin(angle) * i;
        fill(outerDotColor);
        noStroke();
        ellipse(dx, dy, dotSize); // draw each dot
      }
      ringIndex++;
    }
  }