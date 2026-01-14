import tigerImg from "@/assets/aliens/tiger.png";
import eagleImg from "@/assets/aliens/eagle.png";
import octopusImg from "@/assets/aliens/octopus.png";
import pantherImg from "@/assets/aliens/panther.png";
import wolfImg from "@/assets/aliens/wolf.png";
import scorpionImg from "@/assets/aliens/scorpion.png";
import cobraImg from "@/assets/aliens/cobra.png";
import sharkImg from "@/assets/aliens/shark.png";

import type { Alien } from "@/types/alien";

export const mockAliens: Alien[] = [
  {
    id: "1",
    name: "Rath",
    image: tigerImg,
    species: "Appoplexian",
    strength: 95,
    speed: 70,
    intelligence: 40,
    durability: 85,
    power: 75,
    combat: 98,
  },
  {
    id: "2",
    name: "Astrodactyl",
    image: eagleImg,
    species: "Pturbosaurian",
    strength: 55,
    speed: 95,
    intelligence: 65,
    durability: 50,
    power: 85,
    combat: 60,
  },
  {
    id: "3",
    name: "Squidstrictor",
    image: octopusImg,
    species: "Cephalod-ae",
    strength: 80,
    speed: 45,
    intelligence: 90,
    durability: 70,
    power: 65,
    combat: 75,
  },
  {
    id: "4",
    name: "Fasttrack",
    image: pantherImg,
    species: "Citrakayah",
    strength: 65,
    speed: 98,
    intelligence: 60,
    durability: 55,
    power: 50,
    combat: 70,
  },
  {
    id: "5",
    name: "Blitzwolfer",
    image: wolfImg,
    species: "Loboan",
    strength: 75,
    speed: 80,
    intelligence: 70,
    durability: 75,
    power: 80,
    combat: 85,
  },
  {
    id: "6",
    name: "Terroranchula",
    image: scorpionImg,
    species: "Terroranchula",
    strength: 70,
    speed: 65,
    intelligence: 55,
    durability: 90,
    power: 75,
    combat: 80,
  },
  {
    id: "7",
    name: "Ssserpent",
    image: cobraImg,
    species: "Unknown",
    strength: 50,
    speed: 75,
    intelligence: 85,
    durability: 45,
    power: 90,
    combat: 65,
  },
  {
    id: "8",
    name: "Ripjaws",
    image: sharkImg,
    species: "Piscciss Volann",
    strength: 85,
    speed: 90,
    intelligence: 50,
    durability: 80,
    power: 70,
    combat: 88,
  },
];

export const getAlienById = (id: string): Alien | undefined => {
  return mockAliens.find((alien) => alien.id === id);
};
