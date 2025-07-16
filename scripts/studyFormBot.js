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

// Load environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Sanity check for required env variables
if (!TOKEN || !CLIENT_ID || !GUILD_ID || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Missing one or more required environment variables. Please check your .env file."
  );
  process.exit(1);
}

// Setup Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Define the /study command
const commands = [
  new SlashCommandBuilder()
    .setName("study")
    .setDescription("Registrar uma nova sessão de estudo"),
].map((command) => command.toJSON());

// Register the slash command
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Setup Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Modal for study session
function getStudySessionModal() {
  const modal = new ModalBuilder()
    .setCustomId("studySessionModal")
    .setTitle("Nova Sessão de Estudo");

  const subjectInput = new TextInputBuilder()
    .setCustomId("subject")
    .setLabel("Matéria/Assunto")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const durationInput = new TextInputBuilder()
    .setCustomId("duration")
    .setLabel("Duração (minutos)")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const notesInput = new TextInputBuilder()
    .setCustomId("notes")
    .setLabel("Notas adicionais (opcional)")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

  // Add components to modal
  modal.addComponents(
    new ActionRowBuilder().addComponents(subjectInput),
    new ActionRowBuilder().addComponents(durationInput),
    new ActionRowBuilder().addComponents(notesInput)
  );

  return modal;
}

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  // Handle /study command
  if (interaction.isChatInputCommand() && interaction.commandName === "study") {
    await interaction.showModal(getStudySessionModal());
    return;
  }

  // Handle modal submission
  if (interaction.isModalSubmit() && interaction.customId === "studySessionModal") {
    const subject = interaction.fields.getTextInputValue("subject");
    const duration = interaction.fields.getTextInputValue("duration");
    const notes = interaction.fields.getTextInputValue("notes");

    // Validate duration
    const durationInt = parseInt(duration, 10);
    if (isNaN(durationInt) || durationInt <= 0) {
      await interaction.reply({
        content: "Por favor, insira uma duração válida (em minutos).",
        flags: 1 << 6, // Equivalent to { ephemeral: true }
      });
      return;
    }

    // Save in Supabase
    const { data, error } = await supabase.from("study_sessions").insert([
      {
        user_id: interaction.user.id,
        subject,
        duration: durationInt,
        notes,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Debug log
    console.log("Supabase insert result:", { data, error });

    if (error) {
      await interaction.reply({
        content: `Erro ao salvar sessão: ${error.message || JSON.stringify(error) || 'Erro desconhecido'}`,
        flags: 1 << 6, // Equivalent to { ephemeral: true }
      });
    } else {
      await interaction.reply({
        content: "Sessão de estudo registrada com sucesso!",
        flags: 1 << 6, // Equivalent to { ephemeral: true }
      });
    }
  }
});

client.login(TOKEN);