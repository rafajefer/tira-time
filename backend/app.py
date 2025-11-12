import os
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import discord
from bot import start_bot

# Carrega variáveis do .env
load_dotenv()

# DISCORD_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
GUILD_ID = int(os.getenv("DISCORD_GUILD_ID"))
CHANNEL_ID = int(os.getenv("DISCORD_CHANNEL_ID"))

app = FastAPI(title="TiraTime Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de presença
class Presenca(BaseModel):
    name: str
    skill: str
    present: bool

# Cria cliente do Discord (sem intents de mensagem)
intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)

@app.on_event("startup")
async def on_startup():
    """Inicializa o bot do Discord em paralelo com o servidor FastAPI."""
    # asyncio.create_task(client.start(DISCORD_TOKEN))
    asyncio.create_task(start_bot())
    print("🚀 Servidor FastAPI iniciado com integração Discord ativa!")

@app.get("/hello")
async def hello_world():
    return {"message": "Hello, World! Discord bot conectado?"}

@app.post("/presenca")
async def receber_presenca(body: Presenca):
    print(f"Presença recebida: {body.name} ({body.skill}) = {body.present}")

    if body.present:
        await __mover_para_sala(body.name)

    return {"status": "ok", "received": body}

async def __mover_para_sala(nome_jogador):
    await client.wait_until_ready()
    guild = client.get_guild(GUILD_ID)
    member = discord.utils.find(lambda m: m.name.lower() == nome_jogador.lower(), guild.members)

    if not member:
        print(f"❌ Jogador {nome_jogador} não encontrado no servidor.")
        return

    channel = guild.get_channel(CHANNEL_ID)
    if not channel:
        print("❌ Canal de voz não encontrado.")
        return

    try:
        await member.move_to(channel)
        print(f"✅ {nome_jogador} movido para {channel.name}")
    except Exception as e:
        print(f"Erro ao mover {nome_jogador}: {e}")
