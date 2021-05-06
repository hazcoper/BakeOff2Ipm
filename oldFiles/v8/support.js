// Support variables & functions (DO NOT CHANGE!)

let student_ID_form, display_size_form, start_button;                  // Initial input variables
let student_ID, display_size, info;                                          // User input parameters

// Prints the initial UI that prompts that ask for student ID and screen size
function drawUserIDScreen()
{ 
  background(color(0,0,0));                                          // sets background to black
  
  // Text prompt
  main_text = createDiv("Insert your student number and display size ");
  main_text.id('main_text');
  main_text.position(10, 10);
  
  // Input forms:
  // 1. Student ID
  let student_ID_pos_y_offset = main_text.size().height + 40;         // y offset from previous item
  
  student_ID_form = createInput();                                 // create input field
  student_ID_form.position(200, student_ID_pos_y_offset);
  
  student_ID_label = createDiv("Student number (int)");              // create label
  student_ID_label.id('input');
  student_ID_label.position(10, student_ID_pos_y_offset);
  
  // 2. Display size
  let display_size_pos_y_offset = student_ID_pos_y_offset + student_ID_form.size().height + 20;
  
  display_size_form = createInput();                              // create input field
  display_size_form.position(200, display_size_pos_y_offset);
  
  display_size_label = createDiv("Display size in inches");   // create label
  display_size_label.id('input');
  display_size_label.position(10, display_size_pos_y_offset);
  
  // 3. Start button
  start_button = createButton('START');
  start_button.mouseReleased(startTest);
  start_button.position(width/2 - start_button.size().width/2, height/2 - start_button.size().height/2);

  // 4. Information
  info = createP("<b> Please Read Instructions </b><br>The circle that you need to press is presented in tones of green with a blinking border and will turn a shade of teal when you are on over it</br><br> If the next and previous targets coincide it will be written 2x on the circle and it will be green with a red border</br><br>The next target is painted red </br><br> The test starts when you press the start button");
  info.id('info');
  info.position(10, 300);
}

// Verifies if the student ID is a number, and within an acceptable range
function validID()
{
  if(parseInt(student_ID_form.value()) < 200000 && parseInt(student_ID_form.value()) > 1000) return true
  else 
  {
    alert("Please insert a valid student number (integer between 1000 and 200000)");
	return false;
  }
}

// Verifies if the display size is a number, and within an acceptable range
function validSize()
{


  if (parseInt(display_size_form.value()) < 50 && parseInt(display_size_form.value()) > 10) return true
  else
  {
    alert("Please insert a valid display size (between 10 and 50)");
    return false;
  }
}

// Starts the test (i.e., target selection task)
function startTest()
{

  if (validID() && validSize())
  {
    // Saves student and display information
    student_ID = parseInt(student_ID_form.value());
    display_size = parseInt(display_size_form.value());

    // Deletes UI elements
    main_text.remove();
    info.remove();
    student_ID_form.remove();
    student_ID_label.remove();
    display_size_form.remove();
    display_size_label.remove();
    start_button.remove();  

    // Goes fullscreen and starts test
    fullscreen(!fullscreen());
    testStartTime = millis();
  }
}

// Randomize the order in the targets to be selected
function randomizeTrials()
{
  for (var i = 0; i < 16; i++)        // 4 rows times 4 columns = 16 targets
    for (var k = 0; k < 3; k++)       // each target will repeat 3 times (16 times 3 = 48 trials)
      trials.push(i);
  shuffle(trials, true);             // randomize the trial order

  print("trial order: " + trials);   // prints trial order - for debug purposes
}