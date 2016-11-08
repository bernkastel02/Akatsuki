var command = {}
var custom = require("../data/customcoms.json")
var fs = require("fs")

command.ping = {
    "name": "ping",
    "usage": "ping",
    "description": "Ping Pong command",
    "process": function(bot, msg, env) {
        var now = Date.now()
        bot.createMessage(msg.channel.id, "Pinging...").then((msg2) => {
            var end = Date.now()
            bot.editMessage(msg.channel.id, msg2.id, "Pong! `" + (end - now) + "ms`")
        })
    }
}

command.userinfo = {
    "name": "userinfo",
    "usage": "userinfo @user",
    "description": "A command to either get information about yourself or, about the mentioned member.",
    "process": (bot, msg, env) => {
        if (!msg.mentions[0]) {
            user = msg.author;
        } else {
            user = msg.mentions[0]
        }
        bot.createMessage(msg.channel.id, "__" + user.username + "'s Information__" +
            "\n" + "__Name__ : " + user.username +
            "\n" + "__User ID__ : " + user.id +
            "\n" + "__Discriminator__ : " + user.discriminator +
            "\n" + "__Is A Bot__ : " + user.bot +
            "\n" + "__Date Created__ : " + user.createdAt +
            "\n" + "__Status__ : " + user.presence.status +
            "\n" + "__Avatar__ : " + user.avatarURL);
    }
}

command.help = {
    "name": "help",
    "usage": "help",
    "description": "Sends you list of commands and help",
    "process": (bot, msg, env) => {
        var e = msg.content.split(" ").splice(1).join(" ")
        if (e === "") {
            var help = "```ruby\nBot Commands:\n"
            var commands = env.general
            for (var i = 0; i < Object.keys(commands).length; i++) {
                help += `${env.prefix}${commands[Object.keys(commands)[i]].usage} - ${commands[Object.keys(commands)[i]].description}\n`
            }
            if(msg.author.id === env.owner || env.admins.indexOf(msg.author.id) != -1){
            for (var i = 0; i < Object.keys(env.admin).length; i++) {
                help += `${env.prefix}${env.admin[Object.keys(env.admin)[i]].usage} - ${env.admin[Object.keys(env.admin)[i]].description}\n`
            }
          }
          for (var i = 0; i < Object.keys(env.fun).length; i++) {
              help += `${env.prefix}${env.fun[Object.keys(env.fun)[i]].usage} - ${env.fun[Object.keys(env.fun)[i]].description}\n`
          }
            help += "\n\nFor more info on a command type " + env.prefix + "help [command name]\n```"
            bot.createMessage(msg.channel.id, "Sending commands now...").then(function(message) {
            	bot.getDMChannel(msg.author.id).then((dm) => {
                	bot.createMessage(dm.id, help).then(function() {
                    	bot.editMessage(msg.channel.id, message.id, "My commands have arrived in your DM's :mailbox_with_mail:!")
                	})
            	});
            })
        } else {

            if (env.general[e]) {
                bot.getDMChannel(msg.author.id, (dm) => {
                	bot.createMessage(dm.id, `\`\`\`\n${env.prefix}${env.general[e].usage}\n\n${env.general[e].description}\`\`\``)
                })
            }
            if (env.admin[e]) {
            	bot.getDMChannel(msg.author.id, (dm) => {
                	bot.createMessage(dm.id, `\`\`\`\n${env.prefix}${env.admin[e].usage}\n\n${env.admin[e].description}\`\`\``)
            	})
            }
            if(env.fun[e]) {
            	bot.getDMChannel(msg.author.id, (dm) => {
              		bot.createMessage(dm.id, `\`\`\`\n${env.prefix}${env.fun[e].usage}\n\n${env.fun[e].description}\`\`\``)
            	})
            }
            if (!env.admin[e] && !env.general[e] && !env.fun[e]) {
                bot.createMessage(msg.author.id, "Sorry I could not find command `" + e + "`")
            }
        }
    }
}

command.git = {
    "name": "git",
    "usage": "git",
    "description": "Sends a link Voltrex GitHub repo",
    "process": (bot, msg, env) => {
        bot.createMessage(msg.channel.id, `<@${msg.author.id}>, ` + "check out my GitHub at https://github.com/Betaaaaa/v10-discord.js-discordbot !")
    }
}

command.info = {
    "name": "info",
    "usage": "info",
    "description": "Displays basic information about the bot.",
    "process": (bot, msg, env) => {
        bot.createMessage(msg.channel.id, `<@${msg.author.id}>, ` + "Repository created by **Beta ツ#2214**, (Heavily edited by Akatsuki) made for the people.\nDevelopers:\n   Beta ツ#2214\n   ASIANBOI#4122\n   Joseph#5210\nContributors:\n   Marisa Kirisame#7740")
    }
}

/*
command.addcom = {
    "name": "addcom",
    "usage": "addcom <name> <output>",
    "description": "Add a custom command to the current server!",
    "process": (bot, msg, env) => {
        if (msg.member.roles.find("name", "Bot Commander") || msg.author.id === env.owner || env.admins.indexOf(msg.author.id) != -1) {
            var args = msg.content.split(" ").splice(1).join(" ")
            var cmd = args.split(" ")[0]
            var output = args.replace(cmd + " ", "")
            if (!custom[msg.guild.id]) {
                custom[msg.guild.id] = {}
            }
            if (custom[msg.guild.id][cmd]) {
                msg.channel.sendMessage("That command already exists!")
                return;
            }

            custom[msg.guild.id][cmd] = output

            fs.writeFile("./data/customcoms.json", JSON.stringify(custom), function(err) {
                if (err) {
                    bot.createMessage(msg.channel.id, `<@${msg.author.id}>` + "Could not create custom command")
                    console.log("Could not create custom command:\n\n" + err)
                }
                msg.channel.sendMessage("Ok! Custom command created")
            })
        }
    }
}

command.delcom = {
    "name": "delcom",
    "usage": "delcom <command name>",
    "description": "Deletes custom commands from a server",
    "process": function(bot, msg, env) {
        if (msg.member.roles.find("name", "Bot Commander") || msg.author.id === env.owner || env.admins.indexOf(msg.author.id) != -1) {
            var cmd = msg.content.split(" ").splice(1).join(" ")
            if (!custom[msg.guild.id] || custom[msg.guild.id] === {}) {
                msg.reply("This server has no custom commands :sob:")
                return
            }
            if (custom[msg.guild.id][cmd]) {
                bot.createMessage(msg.channel.id, `<@${msg.author.id}>` + "Deleting command")
                delete custom[msg.guild.id][cmd]
                fs.writeFile("./data/customcoms.json", JSON.stringify(custom), function(err) {
                    if (err) console.log(err)
                })
            } else {
                msg.reply("That command does not exist!")
            }
        }
    }
}
*/
command.comlist = {
    "name": "comlist",
    "usage": "comlist",
    "description": "Lists all custom commands on a server",
    "process": (bot, msg, env) => {

        if (!custom[msg.guild.id] || custom[msg.guild.id] === {}) {
            bot.createMessage(msg.channel.id, "This server has no custom commands")
            return
        }

        var cmdtext = "```\nCustom Commands:\n"
        for (var i = 0; i < Object.keys(custom[msg.guild.id]).length; i++) {
            cmdtext += `${env.prefix}${Object.keys(custom[msg.guild.id])[i]}\n`
        }
        cmdtext += "```"
        bot.createMessage(msg.channel.id, cmdtext)
    }
}

command.comhelp = {
  "name": "comhelp",
  "usage":" comhelp",
  "description":"Shows all keys for custom commands",
  "process": (bot, msg, env) => {
    bot.createMessage(msg.channel.id, `\`\`\`
Possible Keys:
{user} - Mention
{username} - Username
{id} - User id
{discrim} - Discriminator
{server} - Server name
{serverid} - Server id
{channel} - Channel mention
{channelid} - Channel id
{nick} - Nickname (if there is one present)

These can be used to change things about the user:

{"role":"ROLENAME"} - Gives a user a role when they use that command
{"nick":"NICKNAME"} - Sets a users nickname when the use that command

Example:

[p]addcom team1 {"nick":"TEAM 1 - {username}"} {"role":"Team 1"} Ok you have joined team 1

This command would change the nickname to "TEAM 1 - username" and give them the team 1 role, then say that they have joined that team
\`\`\``)
  }
}

module.exports = command;
