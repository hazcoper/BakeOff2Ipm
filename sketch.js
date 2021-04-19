/*
TO DO

MUDAR A FORMA DO CURSOR PARA APONTAR PARA O ALVO PARA IR

Implementar música:
        No dia de teste fazer 1. sem musica
                              2. musica middle bpm (130-150)
                              3. musica high bpm (180)

*/
// Bakeoff #2 - Seleção de Alvos e Fatores Humanos
// IPM 2020-21, Semestre 2
// Entrega: até dia 7 de Maio às 23h59 através do Fenix
// Bake-off: durante os laboratórios da semana de 3 de Maio

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 15;      // Add your group number here as an integer (e.g., 2, 3)
const BAKE_OFF_DAY = true;  // Set to 'true' before sharing during the simulation and bake-off days
const NUMBER_TARGETS = 16;
const NUMBER_ATTEMPTS = 48;

// Target and grid properties (DO NOT CHANGE!)
let PPI, PPCM;
let TARGET_SIZE;
let TARGET_PADDING, MARGIN, LEFT_PADDING, TOP_PADDING;
let continue_button;

// Metrics
let testStartTime, testEndTime;// time between the start and end of one attempt (48 trials)
let hits = 0;      // number of successful selections
let misses = 0;      // number of missed selections (used to calculate accuracy)
let database;                  // Firebase DB  

// Study control parameters
let draw_targets = false;  // used to control what to show in draw()
let trials = [];     // contains the order of targets that activate in the test
let current_trial = 0;      // the current trial number (indexes into trials array above)
let attempt = 0;      // users complete each test twice to account for practice (attemps 0 and 1)
let fitts_IDs = [];     // add the Fitts ID for each selection here (-1 when there is a miss)

//Inicializes the fitts id array
for (var i = 0; i < NUMBER_ATTEMPTS; i++) fitts_IDs[i] = 0;

//Fitts id lists
let rigthList, leftList;

//Counter to blink the target
let blink = 0, weight = 0;

//create variables to host sounds

var sound;
var hit_sound;
var miss_sound;

// Target class (position and width)
class Target {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }
}


function preload() {
  sound = loadSound("sounds/background.mp3");
  hit_sound = loadSound("sounds/hit2.wav");
  miss_sound = loadSound("sounds/miss.wav");
  sound.setVolume(0.03);
  sound.loop();
  hit_sound.setVolume(0.8);
  miss_sound.setVolume(0.8);
}


// Runs once at the start
function setup() {

  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  // sound.play(); 

  randomizeTrials();         // randomize the trial order at the start of execution

  textFont("Ubuntu, sans-serif One", 18);     // font size for the majority of the text
  drawUserIDScreen();        // draws the user input screen (student number and display size)
  
}

// Runs every frame and redraws the screen
function draw() {
  
  if (draw_targets) {
    // The user is interacting with the 4x4 target grid
    background(color(0, 0, 0));        // sets background to black

    // Print trial count at the top left-corner of the canvas
    push();
    fill(color(255, 255, 255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
    pop();
    // Draw all 16 targets
    blink += 1;
    for (var i = 0; i < NUMBER_TARGETS; i++) drawTarget(i);
  }
}

// Print and save results at the end of 48 trials
function printAndSavePerformance() {
  sound.stop();
  
  // DO NOT CHANGE THESE! 
  let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time = (testEndTime - testStartTime) / 1000;
  let time_per_target = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty = nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();

  background(color(0, 0, 0));   // clears screen
  fill(color(255, 255, 255));   // set text fill color to white
  text(timestamp, 10, 20);    // display time on screen (top-left corner)

  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
  text("Hits: " + hits, width / 2, 100);
  text("Misses: " + misses, width / 2, 120);
  text("Accuracy: " + accuracy + "%", width / 2, 140);
  text("Total time taken: " + test_time + "s", width / 2, 160);
  text("Average time per target: " + time_per_target + "s", width / 2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width / 2, 220);
  text("Fitts Index of Preformance", width / 2, 280);
  
  // Print Fitts IDS (one per target, -1 if failed selection)
  rigthList = createElement('ul'), leftList = createElement('ul');

  rigthList.position(width/2-300, 350);
  leftList.position(width/2, 350);

  let iter = 2;
  let element = createElement('li', "Target 1 : ...");
  element.parent(rigthList);
  while (iter < NUMBER_ATTEMPTS + 1) {
    element = createElement('li', "Target" + iter + ": " + fitts_IDs[iter - 1]);

    if (iter <= NUMBER_ATTEMPTS / 2) element.parent(rigthList);

    else element.parent(leftList);

    iter += 1;
  }

  // Saves results (DO NOT CHANGE!)
  fitts_IDs[0] = -2; 
  let attempt_data =
  {
    project_from: GROUP_NUMBER,
    assessed_by: student_ID,
    test_completed_by: timestamp,
    attempt: attempt,
    hits: hits,
    misses: misses,
    accuracy: accuracy,
    attempt_duration: test_time,
    time_per_target: time_per_target,
    target_w_penalty: target_w_penalty,
    fitts_IDs: fitts_IDs
  }
  
  // Send data to DB (DO NOT CHANGE!)
  if (BAKE_OFF_DAY) {
    // Access the Firebase DB
    if (attempt === 0) {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }

    // Add user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }

  //resets fitts_ID
  for (var i = 0; i < NUMBER_ATTEMPTS; i++) fitts_IDs[i] = 0;
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)

  if (draw_targets) {
    // Get the location and size of the target the user should be trying to select
    let target = getTargetBounds(trials[current_trial]);
    let previousTarget = getTargetBounds(trials[current_trial - 1]);

    // Check to see if the mouse cursor is inside the target bounds,
    // increasing either the 'hits' or 'misses' counters
    if (dist(target.x, target.y, mouseX, mouseY) < target.w / 2) {
      hit_sound.play();
      hits++;
      distance = dist(previousTarget.x, previousTarget.y, target.x, target.y);
      
      fitts_IDs[current_trial] = Math.log2(distance / target.w + 1);
    }
    else {
      miss_sound.play();
      misses++;
      fitts_IDs[current_trial] = -1;
    }

    current_trial++;                 // Move on to the next trial/target

    // Check if the user has completed all 48 trials
    if (current_trial === trials.length) {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;

      // If there's an attempt to go create a button to start this
      if (attempt < 2) {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width / 2 - continue_button.size().width / 2, height / 2 - continue_button.size().height / 2 + 300);
      }
    }
  }
}

// Draw target on-screen
function drawTarget(i) {
  if(!sound.isPlaying()){
    sound.play();
  }else{
    sound.setVolume(0.1);
  }
  // Get the location and size for target (i)
  let target = getTargetBounds(i), x, y, z;

  if(blink % 30 >= 15)
  {
    x = 90, y = 183, z = 91;
  } 
  else  {
    x = 68, y = 226, z = 10;
  }

  weigth = (blink % 60 <= 20) ? 4 : (blink % 60 >= 40) ? 7 : 10;
  push();
  // Check whether the target and the next one are the same
  if (trials[current_trial + 1] === i && trials[current_trial] === i) {
    fill(color(x, y, z));
    stroke(color(197, 36, 36));
    strokeWeight(10);
  }

  // Draws the actual target
  else if (trials[current_trial] === i) {
    fill(color(68, 226, 10));
    stroke(color(60, 127, 51));
    strokeWeight(weigth);
  }

  // Highlights the next target the user should be trying to select
  else if (trials[current_trial + 1] === i) {
    //fill(color(68, 226, 10)); //green
    fill(color(178, 50, 25)); //red
    noStroke();
  }

  // Does not draw a border if this is not the target the user
  // should be trying to select
  // Draws all the fake targets 
  else {
    noStroke();
    fill(color(120, 120, 120));
  }

  circle(target.x, target.y, target.w);
  pop();
}

// Returns the location and size of a given target
function getTargetBounds(i) {
  var x = parseInt(LEFT_PADDING) + parseInt((i % 4) * (TARGET_SIZE + TARGET_PADDING) + MARGIN);
  var y = parseInt(TOP_PADDING) + parseInt(Math.floor(i / 4) * (TARGET_SIZE + TARGET_PADDING) + MARGIN);

  return new Target(x, y, TARGET_SIZE);
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
  // Re-randomize the trial order
  shuffle(trials, true);
  current_trial = 0;
  print("trial order: " + trials);

  // Resets performance variables
  hits = 0;
  misses = 0;
  //fitts_IDs = [];

  rigthList.remove();
  leftList.remove();
  continue_button.remove();

  // Shows the targets again
  draw_targets = true;
  testStartTime = millis();
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  let display = new Display({ diagonal: display_size }, window.screen);

  // DO NOT CHANGE THESE!
  PPI = display.ppi;                        // calculates pixels per inch
  PPCM = PPI / 2.54;                         // calculates pixels per cm
  TARGET_SIZE = 1.5 * PPCM;                         // sets the target size in cm, i.e, 1.5cm
  TARGET_PADDING = 1.5 * PPCM;                         // sets the padding around the targets in cm
  MARGIN = 1.5 * PPCM;                         // sets the margin around the targets in cm

  // Sets the margin of the grid of targets to the left of the canvas (DO NOT CHANGE!)
  LEFT_PADDING = width / 2 - TARGET_SIZE - 1.5 * TARGET_PADDING - 1.5 * MARGIN;

  // Sets the margin of the grid of targets to the top of the canvas (DO NOT CHANGE!)
  TOP_PADDING = height / 2 - TARGET_SIZE - 1.5 * TARGET_PADDING - 1.5 * MARGIN;

  // Starts drawing targets immediately after we go fullscreen
  draw_targets = true;
}