export function getPosition(
  row: number,
  col: number,
  grid: string[] | string[][],
): string {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return '';
  }
  return grid[row][col];
}

export class Coordinate {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
  public toString(): string {
    return `${this.row},${this.col}`;
  }
}
