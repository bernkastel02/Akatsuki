var command = {}
const child_process = require('child_process');

command.update = {
    "name": "update",
    "usage": "update",
    "description": "For Admins Only - Updates Bot",
    "process": (bot, msg, env) => {
        msg.channel.sendMessage("Preparing to update").then(function(e) {
            var evaled = eval("child_process.execSync('git pull origin').toString()");
			e.delete();
            msg.channel.sendMessage(evaled).then(function(message) {
                if (evaled.indexOf("Already up-to-date.") > -1) {
                    message.edit("There was nothing to update!");
					return;
                } else {
					bot.createMessage(msg.channel.id, "I have updated myself, but you will need to restart for it to take effect.\nShutting Down...").then(function(t) {
						process.exit(0)
					})
                }
            })
        })
    }
}

command.shutdown = {
    "name": "shutdown",
    "usage": "shutdown",
    "description": "Restarts bot",
    "process": (bot, msg, env) => {
		var reason = msg.content.split(" ").splice(1).join(" ");
        bot.createMessage(msg.channel.id, `Shutdown initiated! Bot shutting down...\nReason: ${reason}`).then(function(t) {
			process.exit(0)
        })
    }
}

command.eval = {
    "name": "eval",
    "usage": "eval <code>",
    "description": "Runs code",
    "process": (bot, msg, env) => {
		var evalcode = msg.content.split(" ").splice(1).join(" ");
		try {
			var evaled = eval(evalcode);
			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
			bot.createMessage(msg.channel.id, "Output:\n```x1\n" + clean(evaled) + "```");
		}
		catch (err) {
			bot.createMessage(msg.channel.id, "Error: " + clean(err));
		}

		function clean(text) {
			if (typeof(text) === "string") {
				return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			}
			else {
				return text;
			}
		}
    }
}

module.exports = command;
