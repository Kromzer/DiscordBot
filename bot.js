var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var User = require('./User');

var fs = require('fs');

var targetChannel = '';
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var users = new Object();

var playingLines = new Array();
var stopPlayingLines = new Array();
var dadJokes = new Array();
var roastLines = new Array();

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

function updateUserStatus(userID, game) {
    if(game != null) {
        users[userID].startGame(game.name);
        return playingLines[Math.floor((Math.random() * playingLines.length) + 1) - 1].replace('%game%', game.name).replace('%username%', users[userID].username);
    }
    else {
        console.log('END GAME');
        var timePlayed = users[userID].endGame();
        if(timePlayed != "") {
            return stopPlayingLines[Math.floor((Math.random() * stopPlayingLines.length) + 1) - 1].replace('%time%', timePlayed + 's').replace('%username%', users[userID].username);
        }
        else {
            return "Who knows how long " + users[userID].username + " has been playing this game...";
        }
    }
}

function processFile(inputFile, array, callback) {
    var fs = require('fs'),
    readline = require('readline'),
    instream = fs.createReadStream(inputFile),
    outstream = new (require('stream'))(),
    rl = readline.createInterface(instream, outstream);
    
    rl.on('line', function (line) {
        array.push(line);
    });
    
    rl.on('close', function(line) {
        if(callback != undefined) {
            callback();
        }
    });
}

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    
    var input = {
        status: "online",
        idle_since: null,
        afk: false,
        game: {
            name: "insulter les gens",
            type: 0,
            url: ""
        }
    };
    bot.setPresence(input);
    
    var newName = {
        avatar: bot.avatar,
        email: null,
        new_password: null,
        password: null,
        username: 'TheMightyBeepBoop'
    };
    
    bot.editUserInfo(newName);
    
    let rawdata = fs.readFileSync('users.json');
    let users = JSON.parse(rawdata);
    
    for(var user in bot.users) {
        var userPlaying = bot.users[user].game != null;
        var userGame = (bot.users[user].game != null) ? bot.users[user].game : null;
        //We check if the user was already loaded
        if(users[user] != undefined) {
            users[user].isPlaying = userPlaying;
            users[user].currentGame = (userGame == null) ? "" : userGame.name;
            users[user].startGameTimestamp = (userGame == null) ? 0 : userGame.timestamp;
        }
        //Else we set the game (if any) and we add it to the array
        else {
            console.log('New user');
            var newUser = new User(bot.users[user].username, userPlaying, userGame);
            
            users[user] = newUser;
        }
    }
    
    processFile('./playing.txt', playingLines, function() { logger.info('Playing lines loaded.') });
    processFile('./stopPlaying.txt', stopPlayingLines, function() { logger.info('Stop playing lines loaded.') });
    processFile('./dadjokes.txt', dadJokes, function() { logger.info('Dad jokes loaded.') });
    processFile('./roasts.txt', roastLines, function() { logger.info('Roasts loaded.') });
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'target':
            targetChannel = channelID;
            console.log('New target acquired');
            break;
            case 'dadjoke':
            targetChannel = channelID;
            bot.sendMessage({
                to: targetChannel,
                message: dadJokes[Math.floor((Math.random() * dadJokes.length) + 1) - 1]
            });
            break;
            case 'roast':
            var msg = (args[0] != undefined) ? args[0] + ': ' + roastLines[Math.floor((Math.random() * roastLines.length) + 1) - 1] : roastLines[Math.floor((Math.random() * roastLines.length) + 1) - 1];
            targetChannel = channelID;
            bot.sendMessage({
                to: targetChannel,
                message: msg
            });
            break;
            case 'help':
            targetChannel = channelID;
            bot.sendMessage({
                to: targetChannel,
                message: 'https://www.youtube.com/watch?v=ZNahS3OHPwA'
            });
            break;
            case 'test':
            
            let data = JSON.stringify(users);
            fs.writeFileSync('users.json', data);
            break;
        }
    }
});

bot.on("presence", function(user, userID, status, game, event) {
    if(users[userID] == null) {
        logger.debug('USER INCONNU');
        logger.debug(user);
        logger.debug(userID);
        logger.debug(status);
        logger.debug(game);
        logger.debug(event);
        return;
    }
    if((users[userID].isPlaying && game == null)
    || (!users[userID].isPlaying && game != null)) {
        var message = updateUserStatus(userID, game);
        if(targetChannel != '') {
            bot.sendMessage({
                to: targetChannel,
                message: message
            });
        }
    }
    
});
