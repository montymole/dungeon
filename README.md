Timeline
=========

#TODO

## DUNGEON
-level generator based on   http://donjon.bin.sh/code/dungeon/
-create level page w*h generate with randomSEED
-when ITEMS done place random items
-maze room http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze#Maze_Generator_in_Visual_Basic_6

## PLAYER
-player position 
-- control  wsad 
-- camerafollow
-- light follow player 'torch'

-FOV http://www.roguebasin.com/index.php?title=Field_of_Vision
 -- optimize: dont draw and hide tiles that are not visible at all

## ITEMS
- TREASURE CHEST, GOLD, FOOD

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
-- DOOR subtypes  open, closed, doorway
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
-- walk on FLOOR types  link audioposition to object user distance vector


## DATABASE
- level db model
  -- describes instances
  -- describes sound banks
  -- preload asset list base on level
  -- createorupdate level



