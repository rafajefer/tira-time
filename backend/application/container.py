import os
from dotenv import load_dotenv

from infrastructure.repositories.player_repository_impl import InMemoryPlayerRepository
from infrastructure.modules.discord_module import DiscordClient
from application.services.player_service import PlayerService

load_dotenv()  # carrega variáveis do .env

class Container:
    """Container de dependências da aplicação."""

    def __init__(self):
        self.config = {
            "BOT_TOKEN": os.getenv("DISCORD_BOT_TOKEN"),
            "GUILD_ID": int(os.getenv("DISCORD_GUILD_ID", "0")),
        }

        # Repositório do jogador
        self.player_repository = InMemoryPlayerRepository()

        # Cliente Discord
        self.discord_client = DiscordClient(self.config)

        # Serviço principal da aplicação
        self.player_service = PlayerService(
            repository=self.player_repository,
            discord_client=self.discord_client
        )

# Cria instância global
container = Container()
