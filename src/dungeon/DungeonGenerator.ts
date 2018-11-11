import { TILE_TYPE, TILE_SUB_TYPE, DIRECTION, ROLL, SYMBOLS } from './constants';

export class Tile {
    key: string;
    type: number;
    subtype: number;
    symbol: string;
    x: number;
    y: number;
    constructor (x, y, type, subtype = 0) {
        this.key = `x${x}y${y}`;
        this.x = x;
        this.y = y;
        this.type = type;
        this.subtype = subtype;
        this.symbol = SYMBOLS[type][subtype];
    }
}

export class Dungeon {
    tilemap: any = {};

    rollChance(c:number) {
        return (Math.round(Math.random()*100) <= c);
    }

    scan(o) {
        const sx = o.x;
        const sy = o.y;
        const { w, h, onTile, onNextRow } = o;
        const ex = sx+w;
        const ey = sy+h;
        for(let y = sy; y < ey; y++) {
            for(let x = sx; x < ex; x++) {
                onTile(`x${x}y${y}`,x,y);
            }
            if (onNextRow) onNextRow(y);
        }
    }

    tileAt(x:number,y:number) {
        const { tilemap } = this;
        return tilemap[`x${x}y${y}`] || new Tile(x,y,TILE_TYPE.EMPTY);
    }

    addRoomStartingFromDoor(direction:number, doorX:number, doorY:number, roomW:number, roomH:number) {
        let room;
        switch (direction) {
            case DIRECTION.EAST:
                room = this.addRoom(doorX-roomW, doorY-Math.ceil(roomH/2), roomW, roomH);
             break;
            case DIRECTION.WEST:
                room = this.addRoom(doorX, doorY-Math.ceil(roomH/2), roomW, roomH);
                break;
            case DIRECTION.NORTH:
                room = this.addRoom(doorX-Math.ceil(roomW/2), doorY-roomH, roomW, roomH);
                break;
            case DIRECTION.SOUTH:
                room = this.addRoom(doorX-Math.ceil(roomW/2), doorY, roomW, roomH);
                break;
        }
        return room;
    }

    addRoom(roomX:number,roomY:number, roomW:number, roomH:number) {
        const { tilemap } = this;
        const rightWall = roomX + roomW - 1;
        const bottomWall = roomY + roomH - 1;
        const doors = [];
        // check overlap
        let overlaps = false;
        this.scan({
            x:roomX,
            y:roomY,
            w:roomW,
            h:roomH,
            onTile: (k,x,y) => {
                const at = this.tileAt(x,y);
                if (at.type !== TILE_TYPE.EMPTY) {
                    overlaps = true;
                }
            }
        })
        if (overlaps) return null;
        // carve room
        this.scan({
            x:roomX,
            y:roomY,
            w:roomW,
            h:roomH, 
            onTile: (k,x,y) => { 
                const at = this.tileAt(x,y);
                const above = this.tileAt(x,y-1);
                const left = this.tileAt(x-1,y);
                const right = this.tileAt(x+1,y);
                const below = this.tileAt(x,y+1);
                if (at.type === TILE_TYPE.EMPTY) {
                    let type = TILE_TYPE.FLOOR
                    let subtype = 0;
                    if (above.type === TILE_TYPE.EMPTY || left.type === TILE_TYPE.EMPTY || x === rightWall || y === bottomWall) {
                        type = TILE_TYPE.WALL;
                        if (x === roomX && y === roomY) {
                            subtype = TILE_SUB_TYPE.TOP_LEFT_CORNER;
                        }
                        if (left.type === TILE_TYPE.WALL) {
                            subtype = TILE_SUB_TYPE.HORIZONTAL;
                        }
                        if (x === rightWall && y === roomY) {
                            subtype = TILE_SUB_TYPE.TOP_RIGHT_CORNER;
                        }
                        if (x === roomX && above.type ===TILE_TYPE.WALL && left.type === TILE_TYPE.EMPTY) {
                            subtype = TILE_SUB_TYPE.VERTICAL;
                        }
                        if (x === roomX && y === bottomWall) {
                            subtype = TILE_SUB_TYPE.BOTTOM_LEFT_CORNER;
                        }
                        if (x === rightWall && left.type === TILE_TYPE.FLOOR) {
                            subtype = TILE_SUB_TYPE.VERTICAL;
                        }
                        if (x === rightWall && y === bottomWall) {
                            subtype = TILE_SUB_TYPE.BOTTOM_RIGHT_CORNER;
                        }
                        if ( right.type === TILE_TYPE.WALL || below.type === TILE_TYPE.WALL ) {
                            type = TILE_TYPE.FLOOR;
                            subtype = 0;
                        }
                    }
                    // random door
                    if (type === TILE_TYPE.WALL && this.rollChance(ROLL.DOOR_CHANCE)) {
                        if (subtype === TILE_SUB_TYPE.VERTICAL || subtype === TILE_SUB_TYPE.HORIZONTAL) {
                            type = TILE_TYPE.DOOR;
                        }
                    }
                    tilemap[k] = new Tile(x, y, type, subtype);
                    if (type === TILE_TYPE.DOOR) {
                        doors.push(tilemap[k]);
                    }
                }
            } 
        });
        // create corridors for doors
        return { doors };
    }

    corridor(doors) {
        const { tilemap } = this;
        const CORRIDOR_LEN = 10;
        doors.forEach(door => {
            if (door.subtype === TILE_SUB_TYPE.VERTICAL) {
                const left = this.tileAt(door.x-1,door.y);
                const right = this.tileAt(door.x+1, door.y);
                if (right.type === TILE_TYPE.EMPTY) {
                 this.scan({
                    x: door.x,
                    y: door.y-1,
                    w: CORRIDOR_LEN,
                    h: 3,
                    onTile: (k,x,y) => {
                        const at = this.tileAt(x,y);
                        let type = TILE_TYPE.CORRIDOR;
                        let subtype = 0;
                        if (at.type === TILE_TYPE.EMPTY) {
                            if (y !== door.y) {
                                type = TILE_TYPE.WALL;
                                subtype = TILE_SUB_TYPE.HORIZONTAL;
                            }
                            tilemap[k] = new Tile(x, y, type, subtype);
                        }
                    }
                });
                }
            }
        });
    }

    createArea(x:number,y:number, w:number, h:number, createNumRooms:number =  Math.round(Math.random()*3)) {
        let roomsCreated = 0;
        let door;
        const CORRIDOR_LEN = 2;

        while(roomsCreated < createNumRooms) {
            const rooms= [];
            let room;
            let roomX;
            let roomY;
            let roomW = 3 + Math.round(Math.random()*20);
            let roomH = 3 + Math.round(Math.random()*20);
            if (door) {
                if (door.subtype === TILE_SUB_TYPE.VERTICAL) {
                    const left = this.tileAt(door.x-1, door.y);
                    const right = this.tileAt(door.x+1, door.y);
                    if (left.type === TILE_TYPE.EMPTY) {
                        //facing east
                        room = this.addRoomStartingFromDoor(DIRECTION.WEST,door.x-CORRIDOR_LEN, door.y,roomW,roomH);
                    }
                    if (right.type === TILE_TYPE.EMPTY) {
                        //facing west
                        room = this.addRoomStartingFromDoor(DIRECTION.EAST,door.x+CORRIDOR_LEN, door.y,roomW,roomH);
                    }
                }
                if (door.subtype === TILE_SUB_TYPE.HORIZONTAL) {
                    const above = this.tileAt(door.x, door.y-1);
                    const below = this.tileAt(door.x, door.y+1);
                    if (above.type === TILE_TYPE.EMPTY) {
                        //facing north
                        room = this.addRoomStartingFromDoor(DIRECTION.NORTH,door.x-CORRIDOR_LEN, door.y,roomW,roomH);

                    }
                    if (below.type === TILE_TYPE.EMPTY) {
                        //facing south
                        room = this.addRoomStartingFromDoor(DIRECTION.SOUTH,door.x-CORRIDOR_LEN, door.y,roomW,roomH);
                    }
                }
            } 
            if (!door || !room) {
                // start at random position inside area
                roomX = x + Math.round(Math.random()*w);
                roomY = y + Math.round(Math.random()*h);
                room = this.addRoom(roomX,roomY,roomW,roomH);
            }

            if (room) {
                roomsCreated++;
                door =  room.doors && room.doors[0];
            }
        }
    }

    getArea(x:number,y:number, w:number, h:number) {
        const { tilemap } = this;
        const tiles = {};
        this.scan({x,y,w,h,
            onTile: (k) => {
                const tile = tilemap[k]
               tiles[k] = tile;
            }
        });
        return tiles;
    }

    toString(x:number,y:number, w:number, h:number) {
        const { tilemap } = this;
        let r = '';
        this.scan({x,y,w,h,
            onTile: (k) => {
                r += tilemap[k] ? tilemap[k].symbol : SYMBOLS[TILE_TYPE.EMPTY];
            }, 
            onNextRow: () => {
                console.log(r);
                r = '';
            }
        });
    }
}

