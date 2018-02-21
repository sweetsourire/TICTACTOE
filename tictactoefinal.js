//SAVED CODE. WORKING

//on or off AI play
let aiPlay = true
  //flip player's turn
let p1Turn = true
  //total moves
let totalMove = 0

let nextMove = true

// Player Variables
let player1 = {
  class: "p1",
  initialClass: "fliplight p1",
  history: [...new Array()],
  mark: ''
}

let player2 = {
  class: "p2",
  initialClass: "p2",
  history: [...new Array()],
  mark: ''
}

//CONSTANTS
const TYPECONSTANTS = {
  X: {
    markClass: '<i class="fas fa-times"></i>',
    turnName: '.xturn'
  },
  O: {
    markClass: '<i class="fas fa-circle"></i>',
    turnName: '.oturn'
  }
}

//calculate winner
function calWinner(arr) { //p1history

  const array = arr.slice()

  const winningIds = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  let containsWin = false //true or false if true stops the loop and return announce

  for (let i = 0; i < winningIds.length && !containsWin; i++) {
    containsWin = calculate(array, winningIds[i]) //can print array here
  }
  return
}

function calculate(sup, sub) {
  sup.sort()
  sub.sort()
  for (let i = 0; i < sub.length; i++) {
    if (sup.indexOf(sub[i]) == -1) {
      return false;
    }
  }
  console.log('sub: ', sub, 'sup: ', sup) //sub is a winning pair
  const won = '#' + sub[0] + ', #' + sub[1] + ', #' + sub[2];
  $(won).addClass('fliplight')
  return stopGame();
}

function stopGame() {
  nextMove = false
  $('#winner').css('display', 'grid')
  $('#moreround').css('display', 'grid')
  $('#resetclick').css('display', 'none')
}

function tie() {
  $('#tie').css('display', 'grid')
  $('.p1, .p2').removeClass('fliplight')
  $('#resetclick').css('display', 'none')
  $('#moreround').css('display', 'grid')
}

function selectPreference() {
  $('#load_option').hide()
  $('#preference').fadeIn()
}

function hideAll(hideArray) {
  for (let i = 0; i < hideArray.length; i++) {
    $(hideArray[i]).hide()
  }
}


//START jquery
$(document).ready(function() {
    initialElements = ['#load_option', '#preference', '#winner', '#load-game']
    hideAll(initialElements)

    $('#front').on("click submit", function() {
      $('#front').hide()
      $('#load_option').fadeIn()
    })

    //how many players
    //USER selects human
    $('.human').on("click", function() {
      selectPreference()
      aiPlay = false
    })

    //USER selects AI
    $('.ai').on("click", function() {
      selectPreference()
      aiPlay = true
    })

    function setSide(player, typeConstant) {
      player.type = typeConstant
      player.history = [...new Array()]
      player.mark = player.type.markClass
      $(player.type.turnName).addClass(player.initialClass)
    }

    //preference
    //USER picks x
    $('.xpick').on("click", function() { //p1=x, p2=o
      setSide(player1, TYPECONSTANTS.X); //set x or o icon value to player.type
      setSide(player2, TYPECONSTANTS.O);
      $('#preference').hide()
      $('#load-game').fadeIn()
     // console.log(playerAI) //ai player has p2's property
    })

    //USER picks o
    $('.opick').on("click", function() { //p1=o, p2=x
      setSide(player1, TYPECONSTANTS.O);
      setSide(player2, TYPECONSTANTS.X);
      $('#preference').hide()
      $('#load-game').fadeIn()
      //console.log(playerAI) //ai player has p2's property
    })



    function flipLight(lightPlayer, darkPlayer) {
      if (nextMove) {
        $("." + lightPlayer.class).addClass('fliplight')
        $("." + darkPlayer.class).removeClass('fliplight')
      }
    }

    function moreMovesPossible(box) {
      let outOfMoves = totalMove < 10
      let tied = nextMove
      let gameReset = box.is(':empty')
      return (outOfMoves && tied && gameReset);
    }

    //ACTIVATE game

    $('.box').on("click", function() {

    	const boxId = $(this).attr('id'); //stores id of the clicked box

		function makeMove(box, currentPlayer, opponent) {
			totalMove++
			currentPlayer.history.push(parseInt(boxId))
			console.log('p1 currentP: ', currentPlayer)
			console.log('p1 history: ', currentPlayer.history)
			box.html(currentPlayer.mark)
			console.log($(this).children() != 1)
			  //flip turn
			p1Turn = !p1Turn
			calWinner(currentPlayer.history)
			  //light opponent's icon at the top
			flipLight(opponent, currentPlayer)
			if (!p1Turn && totalMove == 9 && nextMove) {
			  return tie()
			}
		}

		function AImarkSpot(currentPlayer, opponent){ //player2, player1
			totalMove++
			function getRandom(max){
				//genarate random number btw 0 to 9
				let num = Math.floor(Math.random()*Math.floor(max))
				if($('#'+num).children()!=1){ //excluding ids that have children is not working
												//(moreMovesPossible($('#'+num))) causes infinite loop
					return num
				} else {
					getRandom(max)
				}
			}
			const whereTo = getRandom(9)
			currentPlayer.history.push(parseInt(whereTo))
			$('#'+whereTo).html(currentPlayer.mark)
			calWinner(currentPlayer.history)
			flipLight(opponent, currentPlayer)//TODO fliplight isn't working
			return; //exit function
		}

      if (aiPlay) {
      	if(moreMovesPossible($(this))){ //just respond p1's click and automate ai's click
	        //AI set 
	        makeMove($(this), player1, player2)
	        AImarkSpot(player2, player1)

			}//end AI set
      	} else {
        //HUMAN set
        if (moreMovesPossible($(this))) {
          if (p1Turn) {
            makeMove($(this), player1, player2)
          } else {
            makeMove($(this), player2, player1)
          }
        }
      }
    })


    //RESET load
    $('#another').on("click", function() {
      $('#load-game').hide()
      for (let i = 0; i < 9; i++) {
        resetBox(i)
      }
      totalMove = 0
      nextMove = true
      p1Turn = true
      $('#winner, #tie').css('display', 'none')

      $('.p1, .p2').removeClass('fliplight')
      player1.mark = ''
      player2.mark = ''
      $('.xturn, .oturn').removeClass('p1 p2')

      $('#resetclick').css('display', 'grid')
      $('#moreround').css('display', 'none')
      $('#load_option').fadeIn()
    })

    function resetBox(number) {
      document.getElementById(number).innerHTML = ""
      $("#" + number).removeClass('fliplight').empty()
      console.log($("#" + number))
    }

  }) //end jquery