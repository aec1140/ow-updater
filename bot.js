const Discord = require('discord.io');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const users = {
  'MasterMcSwag': 'https://api.lootbox.eu/pc/us/MasterMcSwag-1123/profile',
  'MrZenon': 'https://api.lootbox.eu/pc/us/MrZenon-1922/profile',
  'OnADockSux': 'https://api.lootbox.eu/pc/us/OnADockSux-1582/profile',
  'Endpoint': 'https://api.lootbox.eu/pc/us/Endpoint-11831/profile',
  '%C7%B6OnADock': 'https://api.lootbox.eu/pc/us/%C7%B6OnADock-1614/profile',
  'Moe': 'https://api.lootbox.eu/pc/us/Moe-1806/profile',
  'Origin305': 'https://api.lootbox.eu/pc/us/origin305-1859/profile',
  'R%C5%8EFLLAUNCHER': 'https://api.lootbox.eu/pc/us/R%C5%8EFLLAUNCHER-1179/profile', 
};

const links = {
  'MasterMcSwag': 'http://masteroverwatch.com/profile/pc/us/MasterMcSwag-1123',
  'MrZenon': 'http://masteroverwatch.com/profile/pc/us/MrZenon-1922',
  'OnADockSux': 'http://masteroverwatch.com/profile/pc/us/OnADockSux-1582',
  'Endpoint': 'http://masteroverwatch.com/profile/pc/us/Endpoint-11831',
  'ǶOnADock': 'http://masteroverwatch.com/profile/pc/us/%C7%B6OnADock-1614',
  'Moe': 'http://masteroverwatch.com/profile/pc/us/Moe-1806',
  'origin305': 'http://masteroverwatch.com/profile/pc/us/origin305-1859',
  'RŎFLLAUNCHER': 'http://masteroverwatch.com/profile/pc/us/R%C5%8EFLLAUNCHER-1179',
};

let owData = [];

var bot = new Discord.Client({
    token: "YOUR TOKEN HERE",
    autorun: true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
  if (message === "update") {
    bot.sendMessage({
        to: channelID,
        message: "updating..."
    });
    
    owData = [];
    
    for (const user in users) {
      requestUpdate(users[user], channelID);
    }
  }
  
  if (message === 'ping') {
    bot.sendMessage({
        to: channelID,
        message: "pong"
    });
  }
});

// delete messages
const deleteMessages = (channelID) => {
  console.log(channelID);
  client.getMessages({
    channel: channelID,
    limit: 50 //If 'limit' isn't added, it defaults to 50, the Discord default, 100 is the max.
  }, function(error, messageArr) {
      if (error) return console.log(`error: ${error}`);
      // Delete messages
      console.log('here');
      console.dir(messageArr);
      for (let i = 0; i < messageArr.length; i++) {
        /*bot.deleteMessage({
          channel: channelID,
          messageID: mess
        });*/
      }
  });
};

//function to parse our response
const parseJSON = (xhr, channelID) => {

  const messages = JSON.parse(xhr.responseText);
  if (!messages.data.username) console.log(messages);
  owData.push({
    username : messages.data.username,
    sr : messages.data.competitive.rank,
  });
  
  if (owData.length === 8) {
    // sort the data
    owData.sort(function(a,b){
      return b.sr - a.sr;
    });
    
    // clear the chat
    // deleteMessages(channelID);
    
    // display the response
    const time = new Date();
    
    let messageToSend = `Here are the updated ranks as of ${time.toDateString()}\r`;
    
    for (let i = 0; i < owData.length; i++) {
      for (const user in links) {
        if(owData[i].username === user) {
          messageToSend += `${links[user]}\r`;
        }
      }
    }
    
    bot.sendMessage({
      to: channelID,
      message: messageToSend,
    });
  }
};

const handleResponse = (xhr, channelID) => {
  console.log('Got a response');
  
  // parse the response
  parseJSON(xhr, channelID);  
};

const requestUpdate = (url, channelID) => {
  console.log(`Grabbing data from: ${url}`);
  //create a new AJAX request (asynchronous)
  const xhr = new XMLHttpRequest();
  //setup connect using the selected method and url
  xhr.open('GET', url);

  xhr.setRequestHeader('Accept', 'application/json');

  //set onload to parse request and get json message
  xhr.onload = () => handleResponse(xhr, channelID);

  //send ajax request
  xhr.send();
};
