function init() {
  

  // ! Elements 
  //Target Grid//
  const start = document.querySelector('#start')
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('#score')
  const highScoreDisplay = document.querySelector('#highScore')
  const livesDisplay = document.querySelector('#lives')
  
  
  
  // ! Variables
  
  //Create array of cells to help with movement//
  let width = 15
  const cellCount = width * width
  //Array of cells ready to be filled//
  const cells = []
  let score = 0
  let lives = 3
  let movingRight = true
  //Array of destroyed enemies waiting to be filled//
  let enemiesDestroyed = []
  
  
  //Set cell motion direction for move enemies
  let direction = 1
  //Gives us ID to stop enemies moving interval easily//
  let enemiesId
  //Gives us ID to stop bomb moving interval easily
  
  

  const charClass = 'player'
  const startingPosition = 202
  let currentPosition = startingPosition

  


  
  //Enemies Array//Starting position of 3 rows of 6 enemies chequered//
  const enemies = [0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39]

  let randomNumber = enemies[Math.floor(Math.random() * enemies.length)]
  


  // ! Executions
  //Function to get high score from storage at start of game//
  function getHighScore(){
    return localStorage.getItem('space-invaders-high-score') ? parseFloat(localStorage.getItem('space-invaders-high-score')) : 0
  }
  //function to set high score if current high score is less than current score we update socre and highscore//
  function setHighScore(score){
    if(!getHighScore() || getHighScore() < score){
      localStorage.setItem('space-invaders-high-score', score)
      highScoreDisplay.innerHTML = getHighScore()
    }
  }

  // Create grid function

  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      
      cells.push(cell)
      grid.appendChild(cell)
    }
    addPlayer(startingPosition)
  }
  //Add enemy class to a cell//If cell already detroyed and in eDestroyed array then it wont show it//

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

  //Making Enemies move//
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

    //Loop through enemies to add a cell each time and move right//
    for (let i = 0; i < enemies.length; i++) {
      enemies[i] += direction
    }
    
    showEnemy()
    //If enemies collide with player Game Over//Need destroy animation//
    if (cells[currentPosition].classList.contains('enemy', charClass)) {
      console.log('Game Over')
      clearInterval(enemiesId)
      cells[currentPosition].classList.remove('enemy')
      cells[currentPosition].classList.remove('player')
      cells[currentPosition].classList.add('destroy')
      
      loseGame()
    }
    
    //If array reaches bottom row of grid game over
    for (let i = 0; i < enemies.length; i++) {
      if  (enemies[i] > (cells.length - (width - 1))) {
        console.log('Game Over')
        loseGame()
      }
    }
    //WIN SITUATION//If destroyed array === enemies array thenplayer has wiped out all enemies//
    if (enemiesDestroyed.length === enemies.length) {
      console.log('YOU WIN!!!')
      clearInterval(bombsId)
      clearInterval(enemiesId)
      winGame()
      
      removePlayer()
    }
  }

  
  
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

      
    },200)
  }
  
  //Enemy drops bombs//
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

  //Issues//
  

  //Tasks//

  
  
  // ! Events
  document.addEventListener('keyup',handleMovement)
  
  createGrid()
  start.addEventListener('click',startGame)
  
  
}

document.addEventListener('DOMContentLoaded', init)
