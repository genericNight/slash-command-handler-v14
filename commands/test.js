const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription("Test if slash commands work.");
    module.exports.execute = async (client, interaction) => {

    return interaction.reply({ content: `interactions are working.`});


};
module.exports.options = {
    ...data.toJSON()
};


module.exports.config = {
    enabled: true,
};
