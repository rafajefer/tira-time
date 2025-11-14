import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from application.dto.move_player_dto import Move_Player_Input
from application.container import container

# from services import player_service

# player_svc = player_service.PlayerService()

app = FastAPI(title="TiraTime Backend222")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
async def hello_world():
    print("Hello, World! endpoint chamado")
    return { "message": "Hello, World! Discord bot conectado?" }

@app.post("/discord/move_player")
async def move_player(data: Move_Player_Input):
    """Move jogador para uma sala específica."""

    print("Mover jogador recebido:", data)
    return ORJSONResponse(
        await container.player_service.move_player(
            name=data.name,
            room_type=data.room_type
        )
    )


    return {"status": "ok", "received": "fdasf"}
