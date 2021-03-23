const { defprefix } = require("./config.json");
const { config } = require("dotenv");
const db = require("quick.db");
const PrefixModel = require("./models/prefix-model");
const mongoose = require("mongoose");
const mongopath = process.env.mong;
mongoose.connect(mongopath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const { CanvasSenpai } = require("canvas-senpai");
const canva = new CanvasSenpai();
const discord = require("discord.js");
const client = new discord.Client({
  disableEveryone: false
});

//require("./security.js");
require("./uptime.js");
//require("./op.js");
//require("./brv.js")

client.commands = new discord.Collection();
client.aliases = new discord.Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
client.on("ready", async () => {
  const channel = client.channels.cache.get("805785436399861790");
  channel.join().then(connection => {
    connection.voice.setSelfDeaf(true);
  });

  try {
    console.log(`Successfully logged in as ${client.user.tag}!`);
    //   function pickStatus() {
    //    let status = ["BLACKOUT OFFICIAL", "bhelp | bsupport"];
    //    let Status = Math.floor(Math.random() * status.length);
    client.user.setActivity("MARVEL BETA", {
      type: "STREAMING",
      url: "https://twitch.tv/4matxshadow"
    });

    //  }

    client.on("message", async message => {
           const data = await PrefixModel.findOne({
        GuildID: message.guild.id
    });
    if (data) { prefix = data.Prefix; }
    else { prefix = defprefix; } 
      const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
      if (message.content.match(prefixMention)) {
        let mention = new discord.MessageEmbed()
          .setTitle(client.user.username)
          .addField("PREFIX", `\`${defprefix}\``)
          .addField("USAGE", `\`${defprefix}help\``)
          .setColor("RANDOM")
          .setFooter(`Bot Mentioned By ${message.author.username}`);
        message.channel.send(mention);
        return;
      }

      if (message.author.bot) return;
      if (!message.guild) return;
      if (!message.content.startsWith(defprefix)) return;

      if (!message.member)
        message.member = await message.guild.fetchMember(message);

      const args = message.content
        .slice(defprefix.length)
        .trim()
        .split(/ +/g);
      const cmd = args.shift().toLowerCase();

      if (cmd.length === 0) return;

      let command = client.commands.get(cmd);

      if (!command) command = client.commands.get(client.aliases.get(cmd));

      if (command) command.run(client, message, args);
    });

    //  setInterval(pickStatus, 5000);
  } catch (err) {
    console.log(err);
  }
});

client.on("message", async message => {
  const emojis = require("./JSON/emojis.json");
  let emoji = emojis.emoji[Math.floor(Math.random() * emojis.emoji.length)];
  if (message.content.match(`^<@!?672027578181353473>( |)$`)) {
    return message.channel.send(emoji);
  }
});

client.on("guildMemberAdd", async member => {
  let chx = db.get(`welchannel_${member.guild.id}`);

  if (chx === null) {
    return;
  }

  let default_url = `https://cdn.discordapp.com/attachments/800690453484929095/801910235001651280/2020-pubg-game-4k-91-3840x2160.jpg`;

  let default_msg = `**Welcome {member} To ${member.guild}** <a:vshield:764199958257336321> 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<a:rainbowleft:764200797629186049> **Make Sure To Take Self Roles.**
<a:rainbowleft:764200797629186049> **Make Sure You Read Rules.**
<a:rainbowleft:764200797629186049> **Have Fun In Chatting.**`;

  let m1 = db.get(`msg_${member.guild.id}`);
  if (!m1) m1 = default_msg;
  const msg = m1
    .replace("{member}", member.user)
    .replace("{member.guild}", member.guild);

  let url = db.get(`url_${member.guild.id}`);
  if (url === null) url = default_url;

  // let data = await canva.welcome(member, {
  //   link: "https://wallpapercave.com/wp/wp5128415.jpg"
  // });
  // const attachment = new discord.MessageAttachment(data, "welcome-image.png");

  let wembed = new discord.MessageEmbed()
    .setAuthor(
      member.guild
      //     member.user.username,
      //   member.user.avatarURL({ dynamic: true, size: 2048 })
    )

    .setColor("RANDOM")
    .setImage(url)
    .setDescription(msg);

  client.channels.cache.get(chx).send(msg);
  //  client.channels.cache.get(chx).send(attachment);
});

client.login(process.env.TOKEN);

//auto pinging

let count = 0;
setInterval(
  () =>
    require("node-fetch")(process.env.URL).then(() =>
      console.log(`[${++count}] here i pinged ${process.env.URL}`)
    ),
  300000
);
