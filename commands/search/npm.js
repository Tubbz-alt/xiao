const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class NPMCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'npm',
            group: 'search',
            memberName: 'npm',
            description: 'Searches NPM for info on an NPM package.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'query',
                    prompt: 'What package do you want to get information for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        try {
            const { query } = args;
            const { body } = await snekfetch
                .get(`https://registry.npmjs.com/${query}`);
            const embed = new MessageEmbed()
                .setColor(0xCB0000)
                .setAuthor('NPM', 'https://i.imgur.com/BCODHXd.png')
                .setTitle(body.name)
                .setURL(`https://www.npmjs.com/package/${query}`)
                .setDescription(body.description)
                .addField('❯ Version',
                    body['dist-tags'].latest, true)
                .addField('❯ License',
                    body.license || 'None', true)
                .addField('❯ Author',
                    body.author ? body.author.name : 'Unknown', true)
                .addField('❯ Keywords',
                    body.keywords ? body.keywords.join(', ') : 'None')
                .addField('❯ Maintainers',
                    body.maintainers.map((user) => user.name).join(', '));
            return msg.embed(embed);
        } catch (err) {
            if (err.status === 404) return msg.say('Not Found.');
            else throw err;
        }
    }
};
