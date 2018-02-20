# DiscordBot

This is a useless Discord bot recording time played.

# Install

You need to run "npm install discord.io winston", and then to modify \node_modules\discord.io\lib\index.js on line 5:
GATEWAY_VERSION = 5 => GATEWAY_VERSION = 6

# Usage

!roast name => will randomly select a phrase from "roasts.txt"
!dadjoke => will randomly select a phrase from "dadjokes.txt"

When an user will start or stop playing, a phrase will be randomly selected from "playing.txt" or "stopPlaying.txt"
