export interface Alien {
  id: string;
  name: string;
  image: string;
  species?: string;
  strength: number;
  speed: number;
  intelligence: number;
  durability: number;
  power: number;
  combat: number;
}

export interface SimilarityResult {
  alien: Alien;
  similarity: number;
}

export interface ClusterResult {
  cluster: number;
  aliens: Alien[];
}

export interface ProjectionPoint {
  id: string;
  display_name: string;
  x: number;
  y: number;
  cluster?: number;
}
