require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');

const commands = require('./commands.json');

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

client.on("messageCreate", (message) => {
    const PREFIX = "!";

    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
    
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const data = commands[command];

    if (!Array.isArray(data)) return luanHandler(message, data)
    
    const index = Math.floor(Math.random() * data.length);
    const reply = data[index];
    
    message.channel.send(reply);

   });

client.on("ready", cli => {
    console.log(`${cli.user.displayName} is online!`);

    client.user.setPresence({ activities: [{ type: 3, name: `you, watching me `}]})
});

async function luanHandler(message, data) {
    const index = Math.floor(Math.random() * data.slurs.length);
    const slur = data.slurs[index];
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_TOKEN
    });

    const previousMessage = await message.channel.messages.fetch(message.reference.messageId);
    if (!previousMessage) return;

    const params = [{ role: 'user', content: `Responda apenas a forma correta desta mensagem no padrão "mensagem corrigida": ${previousMessage.content}` }];

    const chatCompletion = await openai.chat.completions.create({
        messages: params,
        model: 'gpt-3.5-turbo',
    });
    
    const politeReply = chatCompletion.choices[0].message.content.split('');
    politeReply.pop();


    message.channel.send(`O correto é: ${politeReply.join('')}, seu ${slur}`);
}

const token = process.env.BOT_TOKEN;
client.login(token);
