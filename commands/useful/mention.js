module.exports = {
  name: "mention",
  aliases: ["mt"],
  desciption: "say command",
  category: "embed",
  usage: "mt userid",

  async run(client, message, args) {
    let msg;
    //  let msg2;
    if (!args[0]) return message.reply("Give me user id first..!");
    msg = args.slice(1).join(" ");
    msg = args.join(" ");
    //   msg2 = args.slice(2);
    //   msg2 = args.join(" ");
    message.channel.send("<@!" + msg + ">");
  }
};
