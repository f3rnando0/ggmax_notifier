import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  MessageActionRowComponentBuilder,
  Partials,
  TextChannel,
} from 'discord.js';
import { config } from 'dotenv';
import { compare } from './utils/compare';
import { readFileSync, writeFileSync } from 'fs';
config();

try {
  const client: Client<boolean> = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Channel],
  });

  client.on('ready', async () => {
    const mainGuild = client.guilds.cache.find(
      (c) => c.id === process.env.CLIENT_GUILD
    );

    if (!mainGuild) {
      throw new Error(`[-] Cant find main guild - try again`);
    }

    const mainChannel = mainGuild.channels.cache.find(
      (c) => c.name === 'ggmax'
    );
    if (!mainChannel) {
      throw new Error(`[-] Cant find main guild channel - try again`);
    }

    setInterval(async () => {
      const fetches = await fetch(
        'https://ggmax.com.br/api/categories/v2/contas-fortnite/announcements?offset=0&limit=1000000'
      );

      if (!fetches)
        await (mainChannel as TextChannel).send(
          `__**[FAIL]**__ Couldn't retrieve announcements from GGMAX.`
        );

      const json = await fetches.json();

      const actual = JSON.parse(readFileSync('./default.json', 'utf-8'));

      const compared = compare(actual, json);

      console.log(`[${new Date().toISOString()}] refreshed ${compared.length} accounts`);

      if (compared.length > 0) {
        compared.map((c) => {
          const embed = new EmbedBuilder()
            .setColor('#606bbf')
            .setTitle('🪧 New fortnite account announcement!')
            .setFields({
              name: '💰 Preço',
              value: `R$ ${c.unit_price}`,
              inline: true,
            })
            .setAuthor({ name: c.user.username })
            .setDescription(`${c.title}`)
            .setURL(`https://ggmax.com.br/anuncio/${c.slug}`)
            .setTimestamp()
            .setImage(
              `https://cdn.ggmax.com.br/images/${c.images[0].name.replace(
                '.jpg',
                ''
              )}.lg.webp`
            );

          const openLink = new ButtonBuilder()
            .setLabel('Abrir link')
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://ggmax.com.br/anuncio/${c.slug}`);

          const row =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              openLink
            );

          (mainChannel as TextChannel).send({
            content: '@everyone',
            embeds: [embed],
            components: [row],
          });
        });

        writeFileSync('./default.json', JSON.stringify(json, null , 2), 'utf-8');
      }
    }, 1000 * 30);
  });

  client.login(process.env.CLIENT_TOKEN);
} catch (error: any) {
  throw new Error(error);
}
