import os
import asyncio
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_BOT_TOKEN")

# Cria a instância do bot
intents = discord.Intents.default()
intents.members = True
intents.voice_states = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Bot conectado como {bot.user} (ID: {bot.user.id})")
    print("🌐 Pronto para receber comandos no Discord!")

async def start_bot():
    """Função para iniciar o bot de forma assíncrona junto com FastAPI."""
    await bot.start(DISCORD_TOKEN)