new p5(); //activates instance mode instead of normal global mode (to avoid the random function error that was coming that said random not defined)

//global variables
let startmenu_display_picture;
let instruction_display_picture;
let start_game_background;
let simple_game_over;
let back_button;
let health_changed = false;
let number_of_eggs = 15;
let normalEggPicture;
let smallEggPicture;
let bigEggPicture;
let eggYolkPicture;
let fontBungee;
let chickPicture;
let highscore = 0;
let score_count = 0;
let globalGameSpeed = 2;
let globalRandomness = 10;
let background_music;
//let table; //commented out for future improvements

//preload all the functions to ensure smooth gaming experience
function preload()
{
  startmenu_display_picture = loadImage("start_menu.png"); //the background that is shown at the start with 600x300 size
  instruction_display_picture = loadImage("instructions.png"); //instruction screen with all the instructions
  start_screen_background = loadImage("background_blue.png"); //blue background of the game play once the game starts
  simple_game_over = loadImage("restart_screen1.png"); //after game is over, score is displayed and restart options given
  back_button = loadImage("blue_back_button.png"); //back button for when we are in instruction screen
  //pictures of eggs, yolk, and chicken
  normalEggPicture = loadImage("normal_egg.png");
  smallEggPicture = loadImage("small_egg.png");
  bigEggPicture = loadImage("big_egg.png");
  eggYolkPicture = loadImage("egg_yolk.png");
  chickPicture = loadImage("chick.png");
  fontBungee = loadFont("bungee_font.ttf"); //font
  background_music = loadSound("game_music.mp3"); //background music
}

//lines to make gaming experience better
function gameLines()
{
  fill(0,0,0);
  rect(0, 0, width, 25); //top horizontal bar to display score and lives
  rect(100, 0, 4, height); //vertical line separating 1st and 2nd belt from the left
  rect(200, 0, 4, height); //vertical line separating 2nd and 3rd belt from the left
}


function setup() {
  createCanvas(300, 600); //create canvas
  randomSeed(Date.now()); //smoother random function
  textFont(fontBungee); //setup the font that we preloaded
}

//function for future improvements
// function writeHighScore(highscore) 
// {
//   // Create a file writer and open the file in "truncate" mode
//   let writer = createWriter("highscore_file.csv", "csv", "truncate");
//   console.log(highscore);

//   // Write the new high score to the file
//   writer.print(highscore);

//   // Close the file writer to save the changes
//   writer.close();
// }


function draw() {
  if (!background_music.isPlaying()) //ensure the music keeps looping forever
    {
      background_music.play(); //but also ensures that it doesnt start from the start every time
    }
  image(start_screen_background,0,15); //the colored background image
  game_object.screenDisplay(); //the game class object displays the different types of screens, functions and allows for interactivity
  if (game_object.start_screen == true) //if we are playing the game then
  {
     gameLines(); //draw the lines for aesthetics and score displaying
     fill(255, 255, 255);
     textSize(15);
     text("SCORE:", 4, 18); //display score
     text(game_object.score,65, 18);
     text("LIVES:", width - 70, 18); //display lives
     text(game_object.player_lives, width - 15, 18);
    
     if (score_count >= 50) //for every 50 score
     {
       if (globalRandomness > 3) //ensure that randomness doesnt go below 3 as 3 is the first value for normal eggs
       {
          globalRandomness = globalRandomness - 1;//keep decreasing the randomness of types of egg which gives rise to a higher probability of non-normal eggs 
       }
       globalGameSpeed = globalGameSpeed + 0.75; //increase the game speed
       score_count = 0; //reset counter for the next 50 score
     }
  }
}

//game class contains everything the game needs
class Game
{
  constructor()
  {
    //reinitialize these variables here just in case a user decides to restart game without pressing play
    globalGameSpeed = 2;
    globalRandomness = 10;
    
    //canvas dimensions 
    this.canvas_width = 300;
    this.canvas_height = 600;
    
    //start button on menu - coordinates
    this.start_button_x = this.canvas_width/6;
    this.start_button_y = 4.5 * (this.canvas_height/6);
    
    //instruction button on menu - coordinates
    this.instruction_button_x = this.canvas_width/6;
    this.instruction_button_y = 5* (this.canvas_height/6);
    
    //dimensions for the start and instruction buttons to be used for mouseClicked interactivity
    this.button_width = 2*300/3;
    this.button_height = 30;
    this.button_arc = 20;
    
    
    this.score = 0; //will keep the score of all the good eggs that have successfully passed, and bad eggs that have been successfully cracked
    this.player_lives = 6; //will keep track of the lives for the player and will be displayed as well
    
    //dimensions of the eggs
    this.egg_width = 75;
    this.egg_height = 100;
    this.side_difference = 12.5; //difference of eggs from each other on the side
    this.up_difference = 25; //difference of eggs from each other from the top
    
    this.num_eggs = 15; //total number of eggs in each array kept 15 to allow for quicker loops
    //the three arrays will contain objects of egg class and will each represent a different conveyer belt
    this.egg_array3 = [];
    this.egg_array2 = [];
    this.egg_array = [];
    
    //this loop creates objects of Egg() class and assigns them their position and values
    for (let i = 0; i < this.num_eggs; i++)
    {
      this.egg_array[i] = new Egg(this.canvas_width - this.side_difference - this.egg_width, this.canvas_height + i*(this.egg_height + this.up_difference), this.egg_width, this.egg_height, i, this.up_difference);
      
      
      this.egg_array2[i] = new Egg(this.canvas_width - (3 * this.side_difference) - (2 * this.egg_width), this.canvas_height + i*(this.egg_height + this.up_difference), this.egg_width, this.egg_height, i, this.up_difference);
      
      this.egg_array3[i] = new Egg(this.canvas_width - (5 * this.side_difference) - (3 * this.egg_width), this.canvas_height + i*(this.egg_height + this.up_difference), this.egg_width, this.egg_height, i, this.up_difference);
      
    }
    
    //controls what is shown to the user at a given time
    this.menu_screen = true;
    this.start_screen = false;
    this.instruction_screen = false;
    this.restart_screen = false;
    
    //dimensions and details for the back button that will be present in the instruction screen
    this.back_button_x = 20;
    this.back_button_y = 20;
    this.back_button_width = 75;
    this.back_button_height = 35; 
  }
  
  //this will control the movement of three belts/arrays simultaneously
  belt_movement()
  {
    
    for (let i = 0; i < this.num_eggs; i++)
    {
      //each indidivual movement of an egg
      this.egg_array[i].movement();
      this.egg_array2[i].movement();
      this.egg_array3[i].movement();
      
      if (this.egg_array[i].egg_y + this.egg_array[i].egg_height <= 0) //if the egg goes above the canvas
      {
        
        if (this.egg_array[i].error_detection() == true) //we see if the egg has been rightfully treated or not
        {
          this.player_lives = this.player_lives - 1; //if there is an error detection, this will decrease the life of the player
        }
        else //if it has been rightfully treated
        {
          this.score = this.score + 1; //it will increase the score of the player
          score_count = score_count + 1; //score_count will also be increased to check if the game needs to be made harder. this is reinitialized in the draw function
        }
        this.egg_array[i].egg_y = this.egg_array[this.num_eggs - 1].egg_y + ((i+1) * (this.egg_height + this.up_difference)); //the egg that has gone above the canvas comes and attaches itself under the last element in the array using the index but its own index will remain the same
        

        this.egg_array[i].egg_health = int(random(1,globalRandomness)); //change the health and the quality of the egg once again to another random value
        
      if (this.egg_array[i].egg_health < 3) //also change the normal or not normal status for the egg. any random number above 3 is for eggs that are normal
        {
          this.egg_array[i].normal = false;
        }
        else
        {
          this.egg_array[i].normal = true;
        }
        
      }
      
      //do the same for egg_array2 and egg_array3
      if (this.egg_array2[i].egg_y + this.egg_array2[i].egg_height <= 0)
      {
        if (this.egg_array2[i].error_detection() == true)
        {
          this.player_lives = this.player_lives - 1;
        }
        else
        {
          this.score = this.score + 1;
          score_count = score_count + 1;
        }
        
        this.egg_array2[i].egg_y = this.egg_array2[this.num_eggs - 1].egg_y + ((i+1) * (this.egg_height + this.up_difference));
        this.egg_array2[i].egg_health = int(random(1,globalRandomness));
        
        if (this.egg_array2[i].egg_health < 3)
        {
          this.egg_array2[i].normal = false;
        }
        else
        {
          this.egg_array2[i].normal = true;
        }
      }
      
      if (this.egg_array3[i].egg_y + this.egg_array3[i].egg_height <= 0)
      {
        if (this.egg_array3[i].error_detection() == true)
        {
          this.player_lives = this.player_lives - 1;
        }
        else
        {
          this.score = this.score + 1;
          score_count = score_count + 1;
        }
        
        this.egg_array3[i].egg_y = this.egg_array3[this.num_eggs - 1].egg_y + ((i+1) * (this.egg_height + this.up_difference));
        this.egg_array3[i].egg_health = int(random(1,globalRandomness));
        if (this.egg_array3[i].egg_health < 3)
        {
          this.egg_array3[i].normal = false;
        }
        else
        {
          this.egg_array3[i].normal = true;
        }
      }
      
      //displays all the eggs with appropraite images
      this.egg_array[i].display();
      this.egg_array2[i].display();
      this.egg_array3[i].display();
    }
  }
  
  //displays different types of screens to the user
  screenDisplay()
  {
    if (this.menu_screen == true) //if the starting menu is displayed
    {
      image(startmenu_display_picture, 0,0); //display the picture with the logo
      fill("#541675"); //box color
      noStroke();
      //boxes for the start and instruction buttons
      rect(this.start_button_x, this.start_button_y, this.button_width, this.button_height, this.button_arc); //boxes to act as buttons
      rect(this.instruction_button_x, this.instruction_button_y, this.button_width, this.button_height, this.button_arc);
      //if the mouse hovers over the start button
      if (mouseX >= this.start_button_x && mouseX <= this.start_button_x + this.button_width && mouseY >= this.start_button_y && mouseY <= this.start_button_y + this.button_height) //if the mouse hovers over the button
      {
        fill("green"); //turn the text green
      }
      else
      {
        fill("gold"); //otherwise the text will be gold
      }
      //write START in the button
      textSize(20);
      text("START", this.start_button_x + ((this.button_width)/3.2), this.start_button_y + (this.button_height/1.3));
      //mouse hovering feature for the instruction button
    if (mouseX >= this.instruction_button_x && mouseX <= this.instruction_button_x + this.button_width && mouseY >= this.instruction_button_y && mouseY <= this.instruction_button_y + this.button_height)
    {
      fill("green");
    }
    else
    {
      fill("gold");
    }
      text("INSTRUCTIONS", this.instruction_button_x + ((this.button_width)/11), this.instruction_button_y + (this.button_height/1.3));
   }
    //if the start button is clicked
    else if (this.start_screen == true)
    {
      if (this.player_lives > 0) //the game hasnt ended
      {
        this.belt_movement();
      }
      else //the game has ended
      {
        this.restart_screen = true; //restart screen would be displayed in the next iteration
        this.start_screen = false; //current game state would be changed
      }
    }
    //if the instruction button is clicked then this if statement would run to show the instruction screen
    else if (this.instruction_screen == true)
    { 
      image(instruction_display_picture, 0 ,0); //image will all the instructions
      
      //Image for backbutton is resized to fit the desired dimensions and then added at the appropriate location in the instruction screen
      back_button.resize(this.back_button_width, this.back_button_height);
      image(back_button, this.back_button_x, this.back_button_y);
    }
    else if (this.restart_screen == true) //the game has ended
      {
        if (this.score > highscore)
        {
          highscore = this.score; //update highscore if needed
        }
        image(simple_game_over, 0, 0); //display the already edited restart screen
        fill(0, 0, 0);
        textSize(17);
        text("YOUR SCORE: ", 72, 347); //display score
        text(this.score, 192, 347);
        text("HIGH SCORE: ", 72, 425); //display high score
        text(highscore, 192, 424);
      }
  }
}

//Egg class includes all the functions for each individual egg
class Egg
{
  constructor(x, y, e_width, e_height, e_index, e_up)
  {
    //coordinates for the egg
    this.egg_x = x;
    this.egg_y = y;
    //quality of egg and a number greater than 3 would mean a normal egg
    this.egg_health = int(random(1, globalRandomness)); //1 because 0 is yolk or chicken
    //dimensions for the egg
    this.egg_height = e_height;
    this.egg_width = e_width;
    
    //index in array to see place the eggs behind the last element beneath the canvas
    this.index_in_array = e_index;
    
    this.up_distance = e_up; //vertical distance between two adjacent eggs
    
    this.normal = true; //contains boolean value to see if the egg is normal or not
    if (this.egg_health < 3) //any egg with less than 3 health means that it is not normal
    {
      this.normal = false;
    }
  }
  
  movement()
  {
    
      this.egg_y = this.egg_y - globalGameSpeed; //uses the globalGameSpeed to move the eggs. we use global because it keeps changing over time
  }
  
  error_detection() //detects if the egg has been treated right. this is called when the egg is above the canvas
  {
    if (this.egg_health < 3 && this.egg_health > 0 && this.normal == false) //if the egg that is not normal has not been fully cracked (i.e health < 0), then an error has been made
    {
      return true;
    }
    else if (this.egg_health == 0 && this.normal == true) //if the normal egg has been cracked accidentally
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  
  display()
  {
    //normal eggs (blue coloured)
    if (this.egg_health >= 3)
    {
      normalEggPicture.resize(this.egg_width, this.egg_height);
      image(normalEggPicture, this.egg_x, this.egg_y);
    }
    //eggs that need to be tapped twice (firey egg)
    else if (this.egg_health == 2)
    {
      smallEggPicture.resize(this.egg_width, this.egg_height);
      image(smallEggPicture, this.egg_x, this.egg_y);
    }
    //eggs that need to be clicked once and has chicken legs out
    else if (this.egg_health == 1)
    {
      bigEggPicture.resize(this.egg_width, this.egg_height);
      image(bigEggPicture, this.egg_x, this.egg_y);
      
    }
    //if the egg is cracked and wasnt supposed to be cracked then the yolk
    else if (this.egg_health <= 0 && this.normal == true)
    {
      eggYolkPicture.resize(this.egg_width, this.egg_height);
      image(eggYolkPicture, this.egg_x, this.egg_y);
    } 
    else if (this.egg_health <= 0 && this.normal == false) //if the non normal eggs are fully cracked then the chicken
    {
      chickPicture.resize(this.egg_width, this.egg_height);
      image(chickPicture, this.egg_x, this.egg_y);
    }
    
    fill(0,0,0);
    rect(0, this.egg_y - this.up_distance/2, width, 4); //horizontal lines between eggs to create like a grid
  }
  
  egg_clicked() //if the egg is clicked
  {
    if (this.egg_health >= 3) //the egg is normal
    {
      this.egg_health = 0; //then the egg becomes yolk
    }
    else
    {
      this.egg_health = this.egg_health - 1; //otherwise for non-normal egg decrease health by 1
    }
  }
}

//creates an object of the game class
let game_object;
game_object = new Game();

function mouseClicked()
{
  //if the start button is clicked. Ensure that the button is only clickable when menu screen is displayed to the user
  if (mouseX >= game_object.start_button_x && mouseX <= game_object.start_button_x + game_object.button_width && mouseY >= game_object.start_button_y && mouseY <= game_object.start_button_y + game_object.button_height && game_object.menu_screen == true)
  {
    game_object.menu_screen = false;
    game_object.start_screen = true; //turns this true and others false so that only start screen is shown
    game_object.instruction_screen = false;
    
  }
  //if the instruction button is clicked. Ensure that the button is only clickable when menu screen is displayed to the user
  else if (mouseX >= game_object.instruction_button_x && mouseX <= game_object.instruction_button_x + game_object.button_width && mouseY >= game_object.instruction_button_y && mouseY <= game_object.instruction_button_y + game_object.button_height && game_object.menu_screen == true)
  {
    game_object.menu_screen = false;
    game_object.start_screen = false;
    game_object.instruction_screen = true; //game state goes to instruction screen
  }
  //back button is clicked but can only be clicked when it is displayed in instructions screen
  else if (mouseX >= game_object.back_button_x && mouseX <= game_object.back_button_x + game_object.back_button_width && mouseY >= game_object.back_button_y && mouseY <= game_object.back_button_y + game_object.back_button_height && (game_object.instruction_screen == true))
  {
    game_object.menu_screen = true; //and the game state goes back to menu screen
    game_object.start_screen = false;
    game_object.instruction_screen = false;
  }
  
  if (game_object.start_screen == true) //we are in game state where the game is being played
  {
    for (let i = 0; i < game_object.num_eggs; i++) //for all the elements in the array
    {
      if (mouseX >= game_object.egg_array[i].egg_x && mouseX <= game_object.egg_array[i].egg_x + game_object.egg_width && mouseY >= game_object.egg_array[i].egg_y && mouseY <= game_object.egg_array[i].egg_y + game_object.egg_height) //check to see if an egg is clicked
        {
          game_object.egg_array[i].egg_clicked(); //call function for appropriate action
          mouseX = -5; //ensures that the egg is not self double clicked
          mouseY = -5; //so the user has to click the egg again
        }
      
      //same goes for egg_array2
      if (mouseX >= game_object.egg_array2[i].egg_x && mouseX <= game_object.egg_array2[i].egg_x + game_object.egg_width && mouseY >= game_object.egg_array2[i].egg_y && mouseY <= game_object.egg_array2[i].egg_y + game_object.egg_height)
        {
          game_object.egg_array2[i].egg_clicked();
          mouseX = -5;
          mouseY = -5;
        }
      //same goes for egg_array3
      if (mouseX >= game_object.egg_array3[i].egg_x && mouseX <= game_object.egg_array3[i].egg_x + game_object.egg_width && mouseY >= game_object.egg_array3[i].egg_y && mouseY <= game_object.egg_array3[i].egg_y + game_object.egg_height)
        {
          game_object.egg_array3[i].egg_clicked();
          mouseX = -5;
          mouseY = -5;
        }
    }
      
  }
}

function keyPressed()
{
  if (keyCode === ENTER && game_object.restart_screen == true) //if enter is pressed in restart screen
  {
    game_object = new Game(); //all the game class objects are reinitialized and game restarts
  }
}

remove();


