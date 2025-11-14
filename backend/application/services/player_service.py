from domain.repositories.player_repository import PlayerRepository
from infrastructure.modules.discord_module import DiscordClient

class PlayerService:
    def __init__(self, repository: PlayerRepository, discord_client: DiscordClient):
        self.repository = repository
        self.discord = discord_client

    async def move_player(self, name: str, room_type: str):
        print(f"Movendo jogador: {name}, tipo de sala: {room_type}")
        
        player = self.repository.find_by_name(name)
        if not player:
            raise ValueError("Jogador não encontrado")
        
        # Lógica de qual sala mover
        if room_type == "confirmation_room":
            channel_id = self.repository.get_confirmation_room_id()
        elif room_type == "game_room":
            channel_id = self.repository.get_game_room_id()
        else:
            raise ValueError("Tipo de sala inválido")

        await self.discord.move_player_to_room(name, channel_id)
        return {"message": f"{name} movido com sucesso"}
