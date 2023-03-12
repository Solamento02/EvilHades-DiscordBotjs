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
    console.log(`Bot iniciado com sucesso! Presente em ${client.users.cache.size} usuários!, em ${client.guilds.cache.size} servidores!`);
    client.user.setActivity(`Rawwr!! Tradução: ${client.guilds.cache.size} SERVIDORES QUE ESTOY`);
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
    console.log(`[${queue.guild.name}] Erro na fila😳 ${error.message}`);
  });
  
player.on('connectionError', (queue, error) => {
    console.log(`[${queue.guild.name}] Erro na conexão😳 ${error.message}`);
  });
  
player.on('trackStart', (queue, track) => {
    queue.metadata.send(`▶ | Começou a tocar RaAWR **${track.title}** 🎶 **${queue.connection.channel.name}**!`);
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
            msg.reply('Não deu deploy :/ !');
            console.error(err)
        });
    }
});

client.login(config.token);