# CPython WASM specifics

These code snippets are useful when running your game in a browser with Emscripten.

## Check if game is running in the browser

```py
if sys.platform == "emscripten":
    pass
```

## Detect WebAssembly CPU

```py
if 'wasm' in __import__('platform').machine():
    pass
```

## Main loop example (must be asynchronous) 

```py
import asyncio
import pygame

pygame.init()


def menu(events):
    # draw
    # check events
    # change state
    pass


def play(events):
    # draw
    # check events
    # change state
    pass

game_state = menu

async def main():
    global game_state
    
    # You can initialise pygame here as well

    while game_state:
        game_state(pygame.event.get())
        pygame.display.update()
        await asyncio.sleep(0) # do not forget that one, it must be called on every frame
        
    # Closing the game (not strictly required)
    pygame.quit()
    sys.exit()
        
if __name__ == "__main__":
    asyncio.run(main())
```

Everything else is probably specific to Pygbag. You can find more information/code [here](https://pygame-web.github.io/wiki/pygbag-code/#pygbag-code-specificssamples).


[Contribute to this page](https://github.com/pygame-web/pygame-web.github.io/edit/main/wiki/python-wasm/README.md)
sonic_game/
│── main.py
│── player.py
│── settings.py
│── level.py
│── assets/
      ├── sonic.png
      ├── tails.png
      └── knuckles.png
SCREEN_WIDTH = 900
SCREEN_HEIGHT = 500
FPS = 60
GRAVITY = 0.6
import pygame
from settings import GRAVITY

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y, character):
        super().__init__()

        self.character = character

        # Character stats
        stats = {
            "sonic":     {"speed": 6, "jump": 12, "sprite": "assets/sonic.png"},
            "tails":     {"speed": 5, "jump": 10, "sprite": "assets/tails.png"},
            "knuckles":  {"speed": 4, "jump": 14, "sprite": "assets/knuckles.png"}
        }

        self.speed = stats[character]["speed"]
        self.jump_power = stats[character]["jump"]
        self.image = pygame.image.load(stats[character]["sprite"]).convert_alpha()

        self.rect = self.image.get_rect(topleft=(x, y))
        self.vel_y = 0
        self.on_ground = False

    def update(self, tiles):
        keys = pygame.key.get_pressed()

        # Horizontal movement
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed

        # Jump
        if keys[pygame.K_SPACE] and self.on_ground:
            self.vel_y = -self.jump_power
            self.on_ground = False

        # Gravity
        self.vel_y += GRAVITY
        self.rect.y += self.vel_y

        # Collision with ground/tiles
        self.on_ground = False
        for tile in tiles:
            if self.rect.colliderect(tile):
                if self.vel_y > 0:
                    self.rect.bottom = tile.top
                    self.vel_y = 0
                    self.on_ground = True
import pygame

def load_level():
    tiles = []
    ground_height = 450

    for x in range(0, 900, 60):
        tile = pygame.Rect(x, ground_height, 60, 50)
        tiles.append(tile)

    return tiles
import pygame
from settings import *
from player import Player
from level import load_level

pygame.init()
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
clock = pygame.time.Clock()

# Choose character (sonic, tails, knuckles)
current_character = "sonic"

player = Player(100, 100, current_character)
player_group = pygame.sprite.Group(player)

tiles = load_level()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        # Switch character
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1: player.character = "sonic"
            if event.key == pygame.K_2: player.character = "tails"
            if event.key == pygame.K_3: player.character = "knuckles"

    screen.fill((100, 180, 255))  # sky color

    # Draw tiles
    for tile in tiles:
        pygame.draw.rect(screen, (60, 200, 80), tile)

    # Update + draw player
    player.update(tiles)
    player_group.draw(screen)

    pygame.display.flip()
    clock.tick(FPS)

pygame.quit()
stats = {
    "sonic":     {"speed": 6, "jump": 12, "sprite": "assets/sonic.png"},
    "tails":     {"speed": 5, "jump": 10, "sprite": "assets/tails.png"},
    "knuckles":  {"speed": 4, "jump": 14, "sprite": "assets/knuckles.png"},

    # New characters
    "shadow":    {"speed": 7, "jump": 13, "sprite": "assets/shadow.png"},
    "amy":       {"speed": 5, "jump": 12, "sprite": "assets/amy.png"},
    "silver":    {"speed": 4, "jump": 15, "sprite": "assets/silver.png"},
    "blaze":     {"speed": 6, "jump": 13, "sprite": "assets/blaze.png"}
}
if event.key == pygame.K_4: player.character = "shadow"
if event.key == pygame.K_5: player.character = "amy"
if event.key == pygame.K_6: player.character = "silver"
if event.key == pygame.K_7: player.character = "blaze"
if self.character == "shadow" and keys[K_LSHIFT]:
    self.rect.x += 12   # Chaos Dash
abilities/
│── chaos_dash.py
│── fly.py
│── glide_climb.py
│── hammer_attack.py
│── hover.py
│── fire_doublejump.py
cutscenes/
│── cutscene_engine.py
│── cutscene_data.py
import pygame
import time

class CutsceneEngine:
    def __init__(self, screen, font):
        self.screen = screen
        self.font = font
        self.active = False
        self.actions = []
        self.index = 0
        self.timer = 0
        self.dialogue_active = False
        self.dialogue_text = ""
        self.portrait = None

    def start(self, actions):
        self.active = True
        self.actions = actions
        self.index = 0
        self.timer = 0

    def update(self, dt):
        if not self.active:
            return

        if self.index >= len(self.actions):
            self.active = False
            return

        action = self.actions[self.index]
        a_type = action["type"]

        # Dialogue
        if a_type == "dialogue":
            self.dialogue_active = True
            self.dialogue_text = action["text"]
            self.portrait = pygame.image.load(action["portrait"]).convert_alpha()

            if pygame.key.get_pressed()[pygame.K_SPACE]:
                self.dialogue_active = False
                self.index += 1

        # Wait
        elif a_type == "wait":
            self.timer += dt
            if self.timer >= action["time"]:
                self.timer = 0
                self.index += 1

        # Move camera or character
        elif a_type == "move_player":
            p = action["player"]
            p.rect.x += action["speed"]
            action["distance"] -= abs(action["speed"])

            if action["distance"] <= 0:
                self.index += 1

    def draw(self):
        if not self.active:
            return

        if self.dialogue_active:
            pygame.draw.rect(self.screen, (0, 0, 0), (50, 350, 800, 120))
            pygame.draw.rect(self.screen, (255, 255, 255), (50, 350, 800, 120), 3)

            # portrait
            self.screen.blit(self.portrait, (60, 360))

            # text
            txt = self.font.render(self.dialogue_text, True, (255, 255, 255))
            self.screen.blit(txt, (160, 380))
INTRO_CUTSCENE = [
    {
        "type": "dialogue",
        "portrait": "assets/sonic_face.png",
        "text": "Sonic: Something feels off... Eggman hasn't attacked in days."
    },
    {
        "type": "dialogue",
        "portrait": "assets/tails_face.png",
        "text": "Tails: My scanners picked up chaos energy nearby!"
    },
    {
        "type": "dialogue",
        "portrait": "assets/shadow_face.png",
        "text": "Shadow: You're too late. The battle has already begun."
    },
    {
        "type": "wait",
        "time": 1.5
    }
]from cutscenes.cutscene_engine import CutsceneEngine
from cutscenes.cutscene_data import INTRO_CUTSCENE
font = pygame.font.SysFont("Arial", 24)
cutscene = CutsceneEngine(screen, font)

# Start intro cutscene immediately
cutscene.start(INTRO_CUTSCENE)
# Update cutscene
dt = clock.get_time() / 1000
cutscene.update(dt)

# If cutscene is active, pause gameplay
if cutscene.active:
    screen.fill((0, 0, 0))
    cutscene.draw()
    pygame.display.flip()
    clock.tick(FPS)
    continue
# Update cutscene
dt = clock.get_time() / 1000
cutscene.update(dt)

# If cutscene is active, pause gameplay
if cutscene.active:
    screen.fill((0, 0, 0))
    cutscene.draw()
    pygame.display.flip()
    clock.tick(FPS)
    continue
