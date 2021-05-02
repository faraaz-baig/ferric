const Discord = require("discord.js")
const fetch = require("node-fetch")
const client = new Discord.Client()
const config = require("./config.json")
const command = require("./command")

const sadWords = [
  "sad",
  "Sed",
  "Sad",
  "Depressed",
  "depressed",
  "unhappy",
  "angry",
  "sed",
]

const encouragments = [
  "Forget the bad situation that you are going through, you know that everything will be all right, keep a positive mind and remember that we love you and we are moved by your side to support you in everything. Be strong",
  "You know that without you, the world would not be as beautiful as it is today. You are spectacular person looking for happiness every day, do not let this moment to crush your life. Be strong.",
  "I'm so sorry that everything sucks so much right now. I love you.",
  "Get full of enthusiasm and joy your life, do not let the sadness and reluctance make you fall into a mistake. Someday you will know that it was unfortunate to be sad about something so silly.",
  "It's OK to cry and be upset. Don't feel any pressure to be #goodvibesonly.",
]

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data[0]["q"] + " -" + "Faraaz Baig"
    })
}

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`)
  client.user.setPresence({
    activity: {
      name: "with oxygen",
      type: 0,
    },
  })
})

client.on("message", (msg) => {
  if (msg.author.bot) return

  if (msg.content === "fe inspire") {
    getQuote().then((quote) => msg.reply(quote))
  }

  if (msg.content === "fe meme") {
    fetch("https://meme-api.herokuapp.com/gimme")
      .then((res) => {
        return res.json()
      })
      .then(async (data) => {
        const memeEmbed = new Discord.MessageEmbed()
          .setTitle(data.title)
          .setImage(data.url)
          .setFooter(`${data.subreddit}`)

        let message = await msg.channel.send("Fetching you a meme....")
        message.edit(memeEmbed)
      })
  }

  if (msg.content === "hello") {
    msg.reply("Hello there, Human!")
  }

  if (sadWords.some((word) => msg.content.includes(word))) {
    const encouragement =
      encouragments[Math.floor(Math.random() * encouragments.length)]
    msg.reply(encouragement)
  }
})

command(client, "serverinfo", (msg) => {
  const { guild } = msg

  const { name, region, memberCount } = guild
  const icon = guild.iconURL()
  const des =
    "This is an officialy server of Team Groceri. Heres where all the team members work together on the groceri app."

  const embed = new Discord.MessageEmbed()
    .setTitle(`Welcome to ${name}!`)
    .setThumbnail(icon)
    .setURL("https://groceri.app")
    .setColor("#4CBE42")
    .addFields(
      {
        name: "Description",
        value: des,
      },
      {
        name: "Region",
        value: region,
      },
      {
        name: "Team",
        value: memberCount,
      }
    )

  msg.channel.send(embed)
})

command(client, "help", (message) => {
  message.channel.send(`
    These are my supported commands:

    **fe help** - Displays the help menu.

    **fe inspire** - I send you some inspiration.
    **fe serverinfo** - Server Info.
    **fe meme** - I serve you a good meme.
    `)
})

client.login(config.token)
