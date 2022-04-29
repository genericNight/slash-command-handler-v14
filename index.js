const fs = require("fs");
const Path = require("path");
const Discord = require("discord.js");
var prompt = require('prompt');

const client = global.client = new Discord.Client({
    intents: 0, //please use eNums as of v14.
});
client.commands = global.commands = new Discord.Collection();
const synchronizeSlashCommands = require('discord-sync-commands-v14');
const { getSystemErrorMap } = require("util");

    /*
    the sync-commands-v14 library was updated.
    events must** be placed in the birds folder as I decided thats cuter.
    */

        //check if the .token file exists
            


    if (!fs.existsSync("./token")) {
        console.log('\x1b[31m%s\x1b[0m', 'I can\'t seem to find a .token file')
        var schema = {
            properties: {
              token: {
                pattern: /^[a-zA-Z\s\-]+$/,
                message: 'Token mustn\'t consist of unsupported chracters.\nPlease enter your code from the developer portal.',
                required: true,
                hidden: true
              }
            }
          };
          prompt.start();
          prompt.get(schema, function (err, result) {
            console.log('Command-line input received:');

            console.log('\x1b[34m%s\x1b[0m', '  token registered, please restart this file.');
            fs.writeFileSync("./token", result.token);
          });
    }

    if (fs.existsSync("./token")) {

        const eventsRegister = () => {
            let eventsDir = Path.resolve(__dirname, './birds');
            if (!fs.existsSync(eventsDir)) return console.log("I could not find an events directory. (looking to read a birds dir.)");
            /* the forEach loop is not advised yet I was lazy.*/
            fs.readdirSync(eventsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((event) => {
                let totalEventBirds = require(`./birds/${event}`);
                if (!totalEventBirds) return console.log("no event birds in the code");
                console.log(`${event} was saved.`);
                client.on(event.split('.')[0], totalEventBirds.bind(null, client));
                delete require.cache[require.resolve(`./birds/${event}`)];
            });
        };
        
        const commandsRegister = () => {
            let commandsDir = Path.resolve(__dirname, './commands');
            if (!fs.existsSync(commandsDir)) return console.log("Commands directory does not exist.");
            /*
            Not changing the commands directory as I can't find a cute name for it.
            Once more; forEach isn't much advised.
            */
            fs.readdirSync(commandsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((command) => {
                let cmdFile = require(`./commands/${command}`);
                if (!cmdFile) return console.log("No props.");
                console.log('\x1b[33m%s\x1b[0m', `Saved command: ${command}`);
                client.commands.set(cmdFile.options.name, cmdFile);
                delete require.cache[require.resolve(`./commands/${command}`)];
            });
        };
        
        
        
        const slashCommandsRegister = () => {
            const commands = client.commands.filter((c) => c.options);
            const fetchOptions = { debug: true };
            synchronizeSlashCommands(client, commands.map((c) => c.options), fetchOptions);
        };
        
        eventsRegister();
        commandsRegister();
        slashCommandsRegister();
        
        
        
        
        
        client.login(fs.readFileSync("./token", "utf-8"));
        
        process.on('unhandledRejection', error => {
            console.log(error);
        });
            }

