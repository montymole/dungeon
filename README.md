# TODO

## DUNGEON

- add static light sources and fov to them

## DUNGEON GEN

- better generator

## PLAYER

- player facing direction
- torch vs lamp mode
- directional fov
- switch to better camera orbit controls
- arrows => relative direction keys
- awds => rotate, forward backward  shift+ad strafe

## ITEMS

- add some items and item seeding

## MONSTERS

- generic monster

## gameplay

- player statistics?
- player inventory? + collecting and dropping items
- monsters?
- traps?
- battle?

## GRAPHICS

- better basic level tiles
  -- texturemapped level tiles
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
