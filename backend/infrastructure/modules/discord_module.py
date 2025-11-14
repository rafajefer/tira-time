import discord
import os


class DiscordClient(discord.Client):
    def __init__(self, configuration: dict) -> None:
        """Init method."""
        intents = discord.Intents.default()
        intents.members = True
        intents.guilds = True
        intents.voice_states = True  # necessário se for mover membros de canal
        intents.message_content = True  # opcional, mas útil
        super().__init__(intents=intents)
        self.configuration = configuration


    async def on_ready(self) -> None:
        print(f"🤖 Logado como {self.user}!")
        print("🌐 Servidores conectados:")
        for guild in self.guilds:
            print(f" - {guild.name} (ID: {guild.id})")

        guild_id = self.configuration["GUILD_ID"]
        guild = self.get_guild(guild_id)
        if not guild:
            print(f"❌ Servidor com ID {guild_id} não encontrado entre os conectados.")
            await self.close()
            return

        print(f"✅ Servidor encontrado: {guild.name}")

        # print("📋 Membros:")
        # for member in guild.members:
        #     print(f" - {member.name} (ID: {member.id})")



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

            member = discord.utils.get(guild.members, name=player_name)
            if not member:
                raise Exception(f"Membro '{player_name}' não encontrado no servidor.")

            await member.move_to(channel)
            print(f"✅ {player_name} movido para {channel.name}.")
        except Exception as e:
            print(f"❌ Erro ao mover {player_name}: {e}")

    async def get_members(self) -> list[discord.Member]:
        try:
            await self.wait_until_ready()
            guild = self.get_guild(self.configuration["GUILD_ID"])
            print(f"Guild encontrada: {guild.name}")
            return guild.members
        except Exception as e:
            print(f"❌ Erro ao obter membros: {e}")
            return []

if __name__ == "__main__":  # pragma: no cover
    import asyncio
    from dotenv import load_dotenv

    async def main():  # pragma: no cover
        """Run the module."""

        load_dotenv()

        config = {
            "BOT_TOKEN": os.environ.get("DISCORD_BOT_TOKEN"),
            "GUILD_ID": int(os.environ.get("DISCORD_GUILD_ID")),  # ID do servidor
        }

        print("Iniciando Discord Bot...") # 1354616763316437245

        bot = DiscordClient(config)
        await bot.start(config["BOT_TOKEN"])
        members = await bot.get_members()
        print("Total de membros do servidor:", len(members))
        # # await bot.on_ready()

        # # após logar, você pode chamar:
        # room_confirmed_id = 987654321  # ID do canal de voz para jogadores confirmados
        # player_name = "John Doe"
        # await bot.move_player_to_room(player_name, channel_id=room_confirmed_id)

    asyncio.run(main())


    #     member = discord.utils.find(lambda m: m.name.lower() == nome_jogador.lower(), guild.members)

#     if not member:
#         print(f"❌ Jogador {nome_jogador} não encontrado no servidor.")
#         return
