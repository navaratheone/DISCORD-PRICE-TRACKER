from __future__ import annotations

import discord
from discord import app_commands
from discord.ext import commands

from app.utils import embed_builder

_LINES = [
    "**Setup (admin)**",
    "`/config role @role` — pick who can use the bot",
    "`/config channel #channel` — where alerts appear",
    "`/config show` — see the current setup",
    "",
    "**Tracking**",
    "`/track <url>` — add a watch",
    "`/list` — show watches in this server",
    "`/info <id>` — see one watch in detail",
    "`/untrack <id>` — stop tracking",
    "",
    "**Per-watch**",
    "`/watch threshold <id> <amount|off>` — alert when ≤ threshold",
    "`/watch alert <id> <drop|restock> <on|off>` — toggle a rule",
    "`/watch refresh <id>` — scrape now",
]


class HelpCog(commands.Cog):
    @app_commands.command(name="help", description="Show the most common commands")
    async def help(self, interaction: discord.Interaction) -> None:
        embed = discord.Embed.from_dict(embed_builder.help_embed(_LINES))
        await interaction.response.send_message(embed=embed, ephemeral=True)


async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(HelpCog())
