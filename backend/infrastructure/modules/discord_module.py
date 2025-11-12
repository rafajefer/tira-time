import backend.infrastructure.modules.discord_module as discord_module


class DiscordClient(discord_module.Client):
    def __init__(self, configuration: dict) -> None:
        """Init method."""
        intents = discord_module.Intents.default()
        intents.members = True
        super().__init__(intents=intents)
        self.configuration = configuration


    async def on_ready(self) -> None:
        print(f"🤖 Logado como {self.user}!")

        guild = self.get_guild(self.configuration["GUILD_ID"])
        if not guild:
            print("❌ Servidor não encontrado.")
            await self.close()
            return

        # Se o servidor foi encontrado, você pode continuar com a lógica do bot
        print(f"✅ Servidor encontrado: {guild.name}")



    async def move_player_to_room(self, player_name: str, channel_id: int) -> None:
        """Move o jogador com nome exato para o canal informado."""
        try:
            await self.wait_until_ready()

            guild = self.get_guild(self.configuration["GUILD_ID"])
            if not guild:
                raise Exception("Guild não encontrada.")

            channel = guild.get_channel(channel_id)
            if not channel:
                raise Exception(f"Canal ID {channel_id} não encontrado.")

            member = discord_module.utils.get(guild.members, name=player_name)
            if not member:
                raise Exception(f"Membro '{player_name}' não encontrado no servidor.")

            await member.move_to(channel)
            print(f"✅ {player_name} movido para {channel.name}.")
        except Exception as e:
            print(f"❌ Erro ao mover {player_name}: {e}")

    async def get_members(self) -> list[discord_module.Member]:
        try:
            await self.wait_until_ready()
            guild = self.get_guild(self.configuration["GUILD_ID"])
            return guild.members
        except Exception as e:
            print(f"❌ Erro ao obter membros: {e}")
            return []

if __name__ == "__main__":  # pragma: no cover
    import asyncio

    async def main():  # pragma: no cover
        """Run the module."""
        config = {
            "TOKEN": "SEU_TOKEN_DO_BOT",
            "GUILD_ID": 123456789012345678,  # ID do servidor
        }

        bot = DiscordClient(config)
        await bot.start(config["TOKEN"])
        # await bot.on_ready()

        # após logar, você pode chamar:
        room_confirmed_id = 987654321  # ID do canal de voz para jogadores confirmados
        player_name = "John Doe"
        await bot.move_player_to_room(player_name, channel_id=room_confirmed_id)

    asyncio.run(main())