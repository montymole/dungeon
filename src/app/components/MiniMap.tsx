import * as React from "react";

export class MiniMap extends React.Component<any, any> {
  render() {
    const { playerPosition, visibleTiles } = this.props;
    return (
      <div className="miniMap">
        <div
          style={{
            left: 250 - playerPosition.x * 8 + "px",
            top: 250 - playerPosition.z * 8 + "px"
          }}
        >
          {visibleTiles &&
            visibleTiles.map(tile => (
              <div
                className="tile"
                key={tile.key}
                style={{
                  left: tile.x * 8 + "px",
                  top: tile.y * 8 + "px"
                }}
              >
                {tile.symbol}
              </div>
            ))}
          <div
            className="tile"
            key="player"
            style={{
              color: "red",
              left: playerPosition.x * 8 + "px",
              top: playerPosition.z * 8 + "px"
            }}
          >
            @
          </div>
        </div>
      </div>
    );
  }
}
