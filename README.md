# HORDER

synopsis carry treasures to exit area


# RECENT additions

Bring in mixamo animations an characters
 https://github.com/Kupoman/blendergltf 
static see mixamo.blender, user kupoman exporter (can export action stash)


# TODO

game modes:

- grid movement 'strategy' mode
- realtime physics mode

## DUNGEON

- add static light sources and fov to them
- active room player near or sees room -> create physics
- room physicis

### DUNGEON GEN

- more Corridor and Room types
- api save dungeon seeds
- dungeon seeding tool to pick best seeds

### PLAYER

- click pathfinder, (only visible area)
- player enters room with objects grid movement mode -> physics mode
- physics mode grid mode -> find nearest grid
- torch vs lamp mode
- directional fov
- switch to better camera orbit controls
- arrows => relative direction keys
- awds => rotate, forward backward shift+ad strafe

## ITEMS

- item visibilty FOV + ROOM
- stack and collect items -> player/monster/item inventory
- api save item states (have items removed from room inventory)
- staircase functionality

## MONSTERS

- generic monster class

## gameplay

- player statistics?
- player inventory? + collecting and dropping items
- monsters?
- traps?
- battle?

## GRAPHICS

- better basic level tiles
  -- DOOR subtypes open, closed, doorway
  --- animated door / close open
  -- CORNER, WALL, FLOOR random variations
  -- FLOOR types
  -- WALL TORCH subtype
  -- TREASURE CHEST, GOLD, FOOD
- player avatar
  -- walk, idle, run, animation

## AUDIO

- FMOD background music
  -- tension
  -- events
  -- walk on FLOOR types link audioposition to object user distance vector

## DATABASE

- level db model
  -- describes instances
  -- describes sound banks
  -- preload asset list base on level
  -- createorupdate level
