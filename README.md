# Space Invaders Game - GA Project 1

Space Invaders is a Japanese arcade game that was released in 1978 and was one of the first worldwide popular video games. A ship is spawned at the bottom of the screen and you need to move the ship left and right whilst shooting the aliens descending from the top of the screen.

[Find the game by clicking here](https://chrainey.github.io/Space-Invaders/)

---

## Brief:

I had one week to design a space invaders game using a JavaScript generated grid, JavaScript, HTML and CSS. This was not to be done using HTML canvas.

## Technologies Used:

* HTML:

  Header with Logo.
  Start Button.
  Divs for grouping

* CSS:

  Grid using flexbox.
  Background Images.
  Images for game icons.

* JavaScript:

  Keyup to move characters.
  Set Interval to move bullets fired and bombs dropped by enemies.
  Click Event to start the game.

## Planning:

Day 1:

I started by writing out a wireframe on Excalidraw. This showed where my positioning of elements was going to go so I could lay down my HTML tags. I would generate the grid using JavaScript but I still needed a header and some divs to sort the layout of the game display and style it to look professional.

![Excalidraw Image](/assets/Excalidraw.png)

First, I needed to decide what size the grid would be. I wanted to have a good amount of enemies so that the game would be challenging. If there were too many enemies and too small a screen they would reach a player quickly. The enemies move to one side of the screen then move down one row, closer to the player, and continue in the opposite direction until they hit the other side.

I decided on 3 rows of 10 enemies in a 15 x 15 grid. This would give them 5 squares of sideways movement before moving downwards.

## Build

```
  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      
      cells.push(cell)
      grid.appendChild(cell)
    }
    addPlayer(startingPosition)
  }
```
The above shows the code to generate the divs using a loop to create cells in the grid that can be styled using CSS. I set a flex box so it would wrap into a grid. I also temporarily added numbers visually to each cell so it would be easier to work out the maths and equations to get everything moving properly and fix any bugs.

Day 2:

I used https://www.classicgaming.cc/classics/space-invaders/ to download all of my icons and sounds to be used in the game. These images were added to the document and I used CSS to add a class on the cell to give it an icon. 
I would use the adding and removing of various classes to determine what is shown in each cell at each given time. (As shown below)

```
.enemy {
  background-image: url(../assets/ufo.png);
  border-radius: 30px;
}

.player {
  background-image: url(../assets/space-invaders\ \(2\).png)
}
.bullet {
  background-image: url(../assets/bullet\ \(1\).png );
  border-radius: 10px;
}

.destroy {
  background-image: url(../assets/explosion.png);
}

.bomb {
  background-image: url(../assets/nuclear-bomb.png);
}
```

I knew I would be moving everything using Intervals. I would also be using numerous for loops and functions. I went back over arrays, functions and also the grid workshop that we did. This helped me plan much more effectively.
I decided I would put the enemies in an array and use JavaScript to move that array around the grid.
I used a starting array and set a start position for the player.


![Grid Image](/assets/grid.png)

The enemies above are displayed using an array below:

```
const enemies = [0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39]

let randomNumber = enemies[Math.floor(Math.random() * enemies.length)]

```

Day 3 :

I used this Sunday to search for audio, the main logo and a decent background picture to have behind the game. There are lots of free websites you can use and I used flaticon.com. I decided with the neon blue background as it was very 80s ‘Tron-like’ and also didn’t dominate with too many colours that would take your attention away from the game.

Day 4: 

Added functions that I would need to generate icons:

* AddPlayer – Function to add player class to a cell.
* RemovePlayer – Function to remove player classics.
* ShowEnemy – Function to add classes to all cells in enemy array.
* RemoveEnemy – Function to remove enemy class to each cell (and then it will move to another cell next door to show movement)
* HandleMovement – Function assigning keycode strokes to player movement. If then added to this to assign left, right and also to assign execution of the shoot function when space-bar is pressed.

```
function showEnemy() {
    for (let i = 0; i < enemies.length; i++) {
      if(!enemiesDestroyed.includes(i)) {
        cells[enemies[i]].classList.add('enemy')
      }
    }
  }

  function removeEnemy() {
    for (let i = 0; i < enemies.length; i++) {
      cells[enemies[i]].classList.remove('enemy')
    }
  }
  // Add player class to cell //
  function addPlayer(position) {
    cells[position].classList.add(charClass)
  }
  // Remove Player class from cell//
  function removePlayer(position) {
    cells[position].classList.remove(charClass)
  }

  //move player//
  function handleMovement(event) {
    const keyCode = event.keyCode
    const left = 37
    const right = 39
    const fire = 32
    
    
    //Remove player from previous position//
    removePlayer(currentPosition)  

    if  (left === keyCode && currentPosition % width !== 0) {
      console.log('clicked left')
      currentPosition -= 1
      
    } else if (right === keyCode && currentPosition % width !== width - 1){
      console.log('clicked right')
      currentPosition += 1
    } else if (fire === keyCode) {
      console.log('clicked space')
      shoot()  
    } 

    addPlayer(currentPosition)
  }
```

This now meant I had my grid with populated enemies and a player at the bottom that could move.

Day 5 :

Wrote the moveEnemies function to start the enemies moving on screen. I found straight 
away that they would just move through the grid and not hit the sides and move down. By setting a “moving right variable” I could make sure that when enemies were at the end of a row they would move down. Then using a change in the direction I would move them back in the opposite direction.
```
  function moveEnemies() {
    
    const firstColumn = enemies[0] % width === 0
    const lastColumn = enemies[enemies.length - 1] % width === width - 1
    //Remove enemy just before it moves to new cell//
    removeEnemy()
    ///When enemies hit right side and are moving right they will drop a row and change direction// 
    if (lastColumn && movingRight) {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i] += width + 1
        direction = -1
        movingRight = false
      }
    }
    ///When enemies hit right side and are moving right they will drop a row and change direction//
    if (firstColumn && !movingRight) {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i] += width - 1
        direction = 1
        movingRight = true
      }
    }
```
Added Shoot function:

I added a function, that when the space-bar is pushed the player would shoot. I used an interval to move the bullet up screen to fire at the enemies.

```
  function enemyShoot () {
    // target enemy at end of array to drop a bomb //
    let currentBombPosition = enemies[randomNumber]
    
    // below sets inteval of bomb drop //
    let bombsId = setInterval(() => {
      cells[currentBombPosition].classList.remove('bomb')
      currentBombPosition += width
      cells[currentBombPosition].classList.add('bomb')
      // If bomb hits player//
      if (cells[currentBombPosition].classList.contains('player')) {
        cells[currentBombPosition].classList.remove('bomb')
        cells[currentBombPosition].classList.remove('player')
        cells[currentBombPosition].classList.add('destroy')
        clearInterval(bombsId)
        //Delay removing destroy class after half a second    
        setTimeout(() => cells[currentBombPosition].classList.remove('destroy'), 500)
        //Lose one life//
        lives = lives - 1
        livesDisplay.textContent = lives
        addPlayer(currentPosition)
        //Player loses all lives//
        if (lives === 0) {
          loseGame()
        }
        
      } else if (cells[currentBombPosition].classList.contains('bullet')) {
        cells[currentBombPosition].classList.remove('bomb')
        cells[currentBombPosition].classList.remove('bullet')
        clearInterval(bombsId)
        clearInterval(missile)
      } else if (currentBombPosition > cells.length - width) {
        cells[currentBombPosition].classList.remove('bomb')
        clearInterval(bombsId) 
      }  
    } ,500)
  }
```
Day 6:

I added a “Start game” function below
```
  function startGame() {
    event.target.blur()
    score = 0
    lives = 3
    livesDisplay.textContent = lives
    showEnemy()
    enemiesId = setInterval(moveEnemies, 500 )
    bombsId = setInterval(enemyShoot, 2000)
  }

  function loseGame() {
    clearInterval(enemiesId)
    clearInterval(bombsId)
    // After a short delay (due to alert behaviour) alert the score and also update high score if needed
    setTimeout(() => {
      // Alert score
      alert('Unlucky you DIED!!!!!! Your score is ' + score + '. Refresh the page and click start game to try again')
      // Update high score
      setHighScore(score)
    }, 50)
  }

  function winGame() {
    clearInterval(enemiesId)
    clearInterval(bombsId)
    setTimeout(() => {
      // Alert score
      alert('Congratulations you have Won!! Your score is ' + score + '. Refresh the page and click start game to try again')
      // Update high score
      setHighScore(score)
    }, 50)
    
  }
```
I also added the lose game and win game functions which show windows alerts when the game has ended.

The next task was dealing with the collisions. Whenever a players bullet hits an enemy, a player bullet hits an enemy bomb or the enemy bomb hits the player the projectiles need to disappear. 

Into the player shoot and enemy shoot functions I added a destroy class. Whenever the player bullet or the enemy bomb classes occupied the same cell then the cell would have a destroy class added which shows the picture of an explosion and removes all classes from the cell after a brief delay (line 202). On line 206 below we can see the enemy that has just been shot has been taken from the enemies array removing the enemy from the game.
```
  function shoot() {
    
    let currentBulletPosition = currentPosition 
    
    let missile = setInterval(() => {
      cells[currentBulletPosition].classList.remove('bullet')
      currentBulletPosition -= width
      cells[currentBulletPosition].classList.add('bullet')

      //This is when bullet hits enemy removing bullet class, enemy class and adding destroy class
      if (cells[currentBulletPosition].classList.contains('enemy')) {
        cells[currentBulletPosition].classList.remove('bullet')
        cells[currentBulletPosition].classList.remove('enemy')
        cells[currentBulletPosition].classList.add('destroy')
        clearInterval(missile)
        //Delay removing destroy class after half a second    
        setTimeout(() => cells[currentBulletPosition].classList.remove('destroy'), 500)
        //Based on below element when an enemy is on current bullet position it will be removed from array//   
        const enemyDestroyed = enemies.indexOf(currentBulletPosition)
        //Enemy destroyed is taken from enemies array//
        enemiesDestroyed.push(enemyDestroyed)
        score = score + 100
        setHighScore(score)
        scoreDisplay.textContent = score
        
      //Clears interval of bullet if it doest hit enemy//  
      } else if (currentBulletPosition <= width - 1) {
        cells[currentBulletPosition].classList.remove('bullet')
        clearInterval(missile)
        
      }
```
---
## Wins and Challenges:

One issue I had early on was that when pressing the spacebar each time my enemies would speed up. By console logging I found that it was starting the game multiple times because the start game button was in focus. By adding event.target.blur to the start game function this was resolved. This stops the start game button being ‘in focus’. When in focus using the spacebar would keep starting the game again adding more intervals to the movement of my game thus speeding up the enemies massively.
```
  function startGame() {
    event.target.blur()
    score = 0
    lives = 3
    livesDisplay.textContent = lives
    showEnemy()
    enemiesId = setInterval(moveEnemies, 500 )
    bombsId = setInterval(enemyShoot, 2000)
  }
```
Another issue that I had when starting to make the enemies move was getting them to touch the sides, move down a row and then go back in the opposite direction. At this point I wasn’t aware of how to fix this but by researching online using w3schools.com and stack overflow I found out about the direction property.
I could set a property of moving right to be true for the enemies. When hitting either the first column (left hand side of grid) or the last column (right hand side of grid), the enemies would have, moving right changed to false and the direction changed. This would move the enemies in the correct fashion.
```
  function moveEnemies() {
    
    const firstColumn = enemies[0] % width === 0
    const lastColumn = enemies[enemies.length - 1] % width === width - 1
    //Remove enemy just before it moves to new cell//
    removeEnemy()
    ///When enemies hit right side and are moving right they will drop a row and change direction// 
    if (lastColumn && movingRight) {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i] += width + 1
        direction = -1
        movingRight = false
      }
    }
    ///When enemies hit right side and are moving right they will drop a row and change direction//
    if (firstColumn && !movingRight) {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i] += width - 1
        direction = 1
        movingRight = true
      }
    }
```
---
## Future Improvements:

I will be adding more to this project soon to make it a bit more interesting.

Further waves of enemies getting faster and harder to kill.

Music and audio.

High-score save facility using local storage.

---

## Key Learnings:

This was a great learning exercise helping me understand JavaScript to a much better level. I learnt a lot about how to use arrays and their different methods.

It was also a big help in planning and managing my time. A lot during this project I was spending too much time stressing on one particular component that I was struggling on. Rather than spending 3 hours looking at one problem I have learnt to take a step back, have a break or work on something else. So that when I come back to the problem with a clearer mind I can fix it much quicker and to be more efficient with my time.
