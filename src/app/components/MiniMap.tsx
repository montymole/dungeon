import * as React from 'react';
import { subtypeKey, tileTypeKey } from '../../dungeon/constants';
const SIZE = 32;

export class MiniMap extends React.Component<any, any> {
  render() {
    const { playerPosition, visibleTiles } = this.props;
    return (
      <div className='miniMap'>
        <div
          style={{
            left: 250 - playerPosition.x * SIZE + 'px',
            top: 250 - playerPosition.z * SIZE + 'px'
          }}
        >
          {visibleTiles &&
            visibleTiles.map((tile) => (
              <div
                className={`tile ${tileTypeKey(tile.type)} ${subtypeKey(tile.subtype)}`}
                key={tile.key}
                style={{
                  left: tile.x * SIZE + 'px',
                  top: tile.y * SIZE + 'px'
                }}
              />
            ))}
          <div
            className={'tile player'}
            key='player'
            style={{
              color: 'red',
              left: playerPosition.x * SIZE + 'px',
              top: playerPosition.z * SIZE + 'px'
            }}
          >
            @
          </div>
        </div>
      </div>
    );
  }
}
