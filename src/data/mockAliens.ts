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
    energy: 60,
    agility: 75,
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
    energy: 85,
    agility: 90,
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
    energy: 40,
    agility: 85,
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
    energy: 70,
    agility: 95,
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
    energy: 65,
    agility: 85,
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
    energy: 75,
    agility: 60,
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
    energy: 90,
    agility: 80,
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
    energy: 55,
    agility: 88,
  },
];

export const getAlienById = (id: string): Alien | undefined => {
  return mockAliens.find((alien) => alien.id === id);
};
