//on or off AI play

//on and off AI play
let aiPlay = true
//flip players turn
let p1Turn = true
//total moves
let totalMove = 0
//allow user's click
let nextMove = true

//player objects
let player1 = {
	class: 'p1',
	initialClass: 'fliplight p1',
	mark: '' //empty default. will be filled by TYPE_CONSTANTS.markClass
	//type property will be set once user picks x or o
}

let player2 = {
	class: 'p2',
	initialClass: 'p2',
	mark: '' //empty default will be filled by TYPE_CONSTANTS.markClass
	//type property will be set once user picks x or o
}

//constants
const TYPE_CONSTANTS = {
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
function calWinner(arr){//player's history
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
	let containsWin = false //returns true or false. if true stops the loop and return announce

	for(let i = 0; i<winningIds.length && !containsWin; i++){
		containsWin = calculate(array, winningIds[i]) 
	}
	return
}

function calculate(sup, sub){ //sub is a winning pair
	sup.sort()
	sub.sort()
	for(let i=0; i<sub.length; i++){
		if(sup.indexOf(sub[i]) == -1){
			return false
		}
	}
	console.log('sub: ', sub, 'sup: ', sup) 
	const WON = '#'+sub[0]+', #'+sub[1]+', #'+sub[2]
	$(WON).addClass('fliplight')
	return stopGame()
}

function stopGame(){
	nextMove = false
	$('#winner').css('display', 'grid')
	$('#moreround').css('display', 'grid')
  	$('#resetclick').css('display', 'none')
}

function tie(){
	$('#tie').css('display', 'grid')
	$('.p1, .p2').removeClass('fliplight')
	$('#resetclick').css('display', 'none')
	$('#moreround').css('display', 'grid')
}

function selectXO(){
	$('#load_option').hide()
	$('#preference').fadeIn()
}

function hideArr(arrs){
	for(let i=0; i<arrs.length; i++){
		$(arrs[i]).hide()
	}
}

//START JQUERY
$(document).ready(function(){
	const INITIAL_ELEM = ['#load_option', '#preference', '#winner', '#load-game']
  hideArr(INITIAL_ELEM)

//COVER
    $('#front').on('click', function(){
    	$('#front').hide()
    	$('#load_option').fadeIn()
    })

//HOW MANY PLAYERS?
//USER SELECTS HUMAN
	$('.human').on('click', function(){
		selectXO()
		aiPlay = false
	})
//USER SELECTS AI
	$('.ai').on('click', function(){
		selectXO()
		aiPlay = true
	})

//USER PICKS X or O. 
$('.xpick').on('click', function(){ //p1=x
	setSide(player1, TYPE_CONSTANTS.X)
	setSide(player2, TYPE_CONSTANTS.O)
	$('#preference').hide()
	$('#load-game').fadeIn()
})

$('.opick').on('click', function(){
	setSide(player1, TYPE_CONSTANTS.O)
	setSide(player2, TYPE_CONSTANTS.X)
	$('#preference').hide()
	$('#load-game').fadeIn()
})

//CREATING PLAYER OBJECTS
	function setSide(player, typeConstant){ //player 1 is player 
		player.type = typeConstant 
		player.history = [...new Array()]
		player.mark = player.type.markClass
		$(player.type.turnName).addClass(player.initialClass) 
		console.log('player1.type: ', player1.type) //prints {markClass: "<i class="fas fa-circle"></i>", turnName: ".oturn"}
		console.log('player1.type.turnName: ', player1.type.turnName) //prints '.oturn'
	}

	function flipLight(lightPlayer, darkPlayer){ //next and curr player
		if(nextMove){
			$('.'+lightPlayer.class).addClass('fliplight')
			$('.'+darkPlayer.class).removeClass('fliplight')
		}
	}

//USER CLICKS A BOX, ACTIVATE GAME
	$('.box').on('click', function(){
		const boxId = $(this).attr('id')//stores id of the selelcted box

		function moreMovesPossible(box){
			return (totalMove < 10 && nextMove && box.is(':empty'));
		}

		function makeMove(box, currPlayer, nextPlayer){
			totalMove++
			currPlayer.history.push(parseInt(boxId))
			box.html(currPlayer.mark)
			p1Turn = !p1Turn
			calWinner(currPlayer.history)
			flipLight(nextPlayer, currPlayer)
			if(!p1Turn && totalMove == 9 && nextMove){
				return tie()
			}
		}
	})//DEACTIVATE BOX

//START GAME
  $('.box').on('click', function(){
    const boxId = $(this).attr('id')

    //check if the box is empty
    function moreMovesPossible(box){
      return(totalMove<9 && nextMove && box.is(':empty'))
    }

    //mark user's move
    function makeMove(box, currPlayer, nextPlayer){ //next player is to flip light
      totalMove++
      currPlayer.history.push(parseInt(boxId))
      box.html(currPlayer.mark)
      p1Turn = !p1Turn
      calWinner(currPlayer.history)
      flipLight(nextPlayer, currPlayer)
      if(!p1Turn && totalMove == 9 && nextMove){
        return tie()
      }
    }

    function AIMarkSpot(ai, nextPlayer){
      console.log('ai playset running')
      totalMove++
      p1Turn = !p1Turn
      flipLight(player2, player1)
      //get empty boxes
      const MARKED_BOX = [...player1.history, ...player2.history].sort()
      const ID_ARRAY = [0,1,2,3,4,5,6,7,8] 
      const empty_box = ID_ARRAY.filter(x=>!MARKED_BOX.includes(x))
      const WHERE_TO = empty_box[Math.floor(Math.random()*empty_box.length)]
      $('#'+WHERE_TO).html(player2.mark)
            player2.history.push(WHERE_TO)
    }

    if(!aiPlay){
//HUMAN SET
		if(moreMovesPossible($(this))){
			if(p1Turn){
			  makeMove($(this), player1, player2)
			} else {
			  makeMove($(this), player2, player1)
			}
		}
	} else {
//AI SET
      if(moreMovesPossible($(this))){ //this responds p1's click. automate ai's click
        if(p1Turn){
			makeMove($(this), player1, player2)
			AIMarkSpot()
		} 
      }
    }
  })//END BOX FUNCTION


//RESET LOAD
	$('#another').on('click', function(){
    console.log('reset running')
		$('#load-game').hide()
		for(let i=0; i<9; i++){
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

	function resetBox(num){
		document.getElementById(num).innerHTML = ''
		$('#'+num).removeClass('fliplight').empty()
	}
})//END JQUERY





















