const discord = require("discord.js");
const client = new discord.Client();
const db = require("quick.db");
const moment = require("moment");
const { bowner, prefix } = require("./config.json");

client.on("ready", async => {
  console.log(client.user.tag + " ready");
});

client.on("message", message => {
  // checks if the message author is afk
  if (db.has(message.author.id + ".afk")) {
    message.channel.send(`Welcome back ${message.author} I removed your AFK.`);
    db.delete(message.author.id + ".afk");
    db.delete(message.author.id + ".messageafk");
  }
  if (message.content.startsWith(prefix + "afk")) {
    message.channel.send(
      "Aight, I have set your AFK. I will send a message to the users who mention you.."
    );
    // then here you use the database :
    db.set(message.author.id + ".afk", "true");
    db.set(
      message.author.id + ".messageafk",
      message.content.split(" ").slice(2)
    );
  }
  if (message.content.includes("+afk off")) {
    db.delete(message.author.id + ".afk");
    db.delete(message.author.id + ".messageafk");
  }
});
//When user pinged:

client.on("message", message => {
  // If one of the mentions is the user
  message.mentions.users.forEach(user => {
    if (message.author.bot) return false;

    if (
      message.content.includes("@here") ||
      message.content.includes("@everyone")
    )
      return false;
    if (db.has(user.id + ".afk"))
      message.channel.send(`${message.author}, is afk `);
  });
});
client.login(process.env.TOKEN);
