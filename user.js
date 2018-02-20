module.exports = class User {
	
	constructor(username, isPlaying, currentGame) {
		this.playedGames = new Object();
		
		if(currentGame != null) {
			this._currentGame = currentGame.name;
			this._startGameTimestamp = currentGame.timestamp;
		}
		else {
			this._currentGame = "";
		}
		
		this.totalTimePlayed = 0;
		this.username = username;
		this._isPlaying = isPlaying;
	}
	
	startGame(game) {
		this._startGameTimestamp = Math.floor(Date.now() / 1000);
		this._currentGame = game;
		this.isPlaying = true;
	}
	
	endGame() {
		this.isPlaying = false;
		if(this._currentGame != "") {
			if(this.playedGames[this._currentGame] == undefined) {
				this.playedGames[this._currentGame] = Math.floor(Date.now() / 1000) - this._startGameTimestamp;
			}
			this._currentGame = "";
			this.totalTimePlayed += Math.floor(Date.now() / 1000) - this._startGameTimestamp;
			return Math.floor(Date.now() / 1000) - this._startGameTimestamp;
		}
		else {
			return "";
		}
	}
	
	get totalTimePlayed() {
		return this._totalTimePlayed;
	}
	
	set totalTimePlayed(totalTimePlayed) {
		this._totalTimePlayed = totalTimePlayed;
	}
	
	get isPlaying() {
		return this._isPlaying;
	}
	
	set isPlaying(isPlaying) {
		this._isPlaying = isPlaying;
	}
	
	get currentGame() {
		return this._currentGame;
	}
	
	set currentGame(currentGame) {
		this._currentGame = currentGame;
	}
	
	get startGameTimestamp() {
		return this._startGameTimestamp;
	}
	
	set startGameTimestamp(startGameTimestamp) {
		this._startGameTimestamp = startGameTimestamp;
	}
};
