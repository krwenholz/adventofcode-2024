export const CardinalDirections = [
  [-1, 0], // north
  [0, 1], // east
  [1, 0], // south
  [0, -1], // west
];

export function isOrthogonalDirection(dir1: number[], dir2: number[]): boolean {
  return dir1[0] === 0 ? dir2[1] === 0 : dir2[0] === 0;
}

export function orthogonalDirections(dir: number[]): number[][] {
  return CardinalDirections.filter(d => isOrthogonalDirection(dir, d));
}
