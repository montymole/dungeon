This is work in progress.

# build
```
npm install
npm run build
docker-compose build
docker-compose up
```
## HAS FEATURES
- css3d + gl view layers
- animation + tweening
- cannon physics
- mobx based client state
- threejs react classes
- fmod music + audio
- generic dungeon seeding
- rogue like field of view
- database api backend

## TODO
- generic path finder, for player and ai movement (in progress)
- sockets

### DUNGEON

- add static light sources and fov to them
- bug: clean exit old dungeon -> generate new


### DUNGEON GEN

- more Corridor and Room types
- api save dungeon seeds
- dungeon seeding tool to pick best seeds

### PLAYER

- lighting torch vs lamp mode
- directional fov
- better camera orbit controls
- direction relative direction keys
- awds => rotate, forward backward  shift+ad strafe
- click movement (required client and server side path finder)

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
