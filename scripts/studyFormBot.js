import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  Routes,
  REST,
  Events,
} from "discord.js";
import { createClient } from "@supabase/supabase-js";

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ANNOUNCE_CHANNEL_ID = process.env.ANNOUNCE_CHANNEL_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
      "Missing one or more required environment variables. Please check your .env file."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const commands = [
  new SlashCommandBuilder()
      .setName("study")
      .setDescription("Register a new study session"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );
    console.log("Successfully registered application (/) commands.");
  } catch (error) {
    console.error("Error registering application (/) commands:", error);
    process.exit(1);
  }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  if (ANNOUNCE_CHANNEL_ID) {
    try {
      const channel = await client.channels.fetch(ANNOUNCE_CHANNEL_ID);
      if (channel && channel.send) {
        await channel.send("@everyone Time to fill in the form!");
        console.log("Announcement message sent to channel.");
      }
    } catch (err) {
      console.error("Failed to send announcement message:", err);
      process.exit(1);
    }
  }
});

function getStudySessionModal() {
  const modal = new ModalBuilder()
      .setCustomId("studySessionModal")
      .setTitle("New Study Session");

  const subjectInput = new TextInputBuilder()
      .setCustomId("subject")
      .setLabel("Subjects/Topics (separe por vírgula)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

  const durationInput = new TextInputBuilder()
      .setCustomId("duration")
      .setLabel("Duration (minutes)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

  const notesInput = new TextInputBuilder()
      .setCustomId("notes")
      .setLabel("Additional notes (optional)")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

  modal.addComponents(
      new ActionRowBuilder().addComponents(subjectInput),
      new ActionRowBuilder().addComponents(durationInput),
      new ActionRowBuilder().addComponents(notesInput)
  );

  return modal;
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand() && interaction.commandName === "study") {
    await interaction.showModal(getStudySessionModal());
    return;
  }

  if (interaction.isModalSubmit() && interaction.customId === "studySessionModal") {
    const subjectField = interaction.fields.getTextInputValue("subject");
    const duration = interaction.fields.getTextInputValue("duration");
    const notes = interaction.fields.getTextInputValue("notes");
    const durationInt = parseInt(duration, 10);
    if (isNaN(durationInt) || durationInt <= 0) {
      await interaction.reply({
        content: "Please enter a valid duration (in minutes).",
        flags: 1 << 6,
      });
      process.exit(0);
      return;
    }

    const subjects = subjectField
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (subjects.length === 0) {
      await interaction.reply({
        content: "Please enter at least one subject/topic.",
        flags: 1 << 6,
      });
      process.exit(0);
      return;
    }

    const timestamp = new Date().toISOString();

    const rows = subjects.map(subject => ({
      user_id: interaction.user.id,
      subject,
      duration: durationInt,
      notes,
      timestamp,
    }));

    const { error } = await supabase.from("study_sessions").insert(rows);

    if (error) {
      await interaction.reply({
        content: `Error saving session: ${error.message || JSON.stringify(error) || 'Unknown error'}`,
        flags: 1 << 6,
      });
      process.exit(0);
    } else {
      await interaction.reply({
        content: "Study session registered successfully!",
        flags: 1 << 6,
      });
      process.exit(0);
    }
  }
});

client.login(TOKEN);
