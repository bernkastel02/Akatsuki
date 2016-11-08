var command = {}

command.coinflip = {
    "name": "coinflip",
    "usage": "coinflip",
    "description": "Coinflip command",
    "process": (bot, msg, env) => {
        let coin = Math.random() > 0.5 ? 'Heads' : 'Tails'
        bot.createMessage(msg.channel.id, "The coin landed on " + `${coin}!`);
    }
}

module.exports = command;
