require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');

const commands = require('./commands.json');

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

client.on("messageCreate", (message) => {
    const prefix = "!";

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const messages = commands[command];
    const index = Math.floor(Math.random() * messages.length);
    const reply = messages[index];
    
    message.channel.send(reply);

   });

client.on("ready", cli => {
    console.log(`${cli.user.displayName} is online!`);

    client.user.setPresence({ activities: [{ type: 3, name: `you, watching me `}]})
});

const token = process.env.BOT_TOKEN;
client.login(token);
