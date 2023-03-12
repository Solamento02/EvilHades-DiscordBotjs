const Discord = require('discord.js');
const {Player} = require('discord-player');
const fs = require('fs');
const config = require ("./config.json")  // your token here
const prefix = "!" // I use this prefix, but you can change if you want

const { Client, GatewayIntentBits } = require ('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // On discord.com/developers/applications you have to check if the permission it's on
    ],
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

console.log(client.commands);

client.on('ready', () => {
    console.log(`Bot online! ${client.users.cache.size} users!, in  ${client.guilds.cache.size} servers!`);
    client.user.setActivity(`Rawwr!! Translate ${client.guilds.cache.size} SERVERS THAT I AM`);
});

client.on('ready', () => {
    console.log(`HADES!Logado como ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
    if(msg.content === prefix + 'teste'){
        await msg.channel.send('teste')
    }
});

client.on('messageCreate', async (msg) => {
    if(msg.content === prefix + 'ping'){
        await msg.channel.send(`Pong! 🏓 ${Math.round(client.ws.ping)} ms`)
    }
});

const player = new Player(client);

player.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Error on queue😳 ${error.message}`);
  });
  
player.on('connectionError', (queue, error) => {
    console.log(`[${queue.guild.name}] Error on queue😳 ${error.message}`);
  });
  
player.on('trackStart', (queue, track) => {
    queue.metadata.send(`▶ | Started to play **${track.title}** 🎶 **${queue.connection.channel.name}**!`);
  });
  
player.on('botDisconnect', queue => {
    queue.metadata.send(' RAWWr! Fui desconectado do chat de voz..');
  });

client.on('messageCreate', async (msg) => {
    if (msg.content === '!deploy'){  // command deploy to use slash commands
        await msg.guild.commands
        .set(client.commands)
        .then(() => {
            msg.reply('Deployed!');
        })
        .catch(err => {
            msg.reply('Not deploy! :/ ');
            console.error(err)
        });
    }
});

client.login(config.token);
