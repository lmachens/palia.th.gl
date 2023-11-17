import type { DICT } from "@/app/lib/i18n";
import Image from "next/image";

type VillagerGiftHistory = {
  villagerCoreId: number;
  itemPersistId: number;
  lastGiftedMs: number;
  associatedPreferenceVersion: number;
};

type SkillLevels = {
  type: string;
  level: number;
  xpGainedThisLevel: number;
};

type Players = {
  [guid: string]: {
    name: string;
    giftHistory: VillagerGiftHistory[];
    skillLevels: SkillLevels[];
    mapName: string;
    position: [number, number, number];
    timestamp: number;
  };
};

const SKILL_ICONS = {
  BugCatching: "Icon_Skill_Bug_01.webp",
  // Combat: "Icon_Skill_Bug_01.webp",
  Fishing: "Icon_Skill_Fishing_01.webp",
  Foraging: "Icon_Skill_Forage_01.webp",
  Hunting: "Icon_Skill_Hunt_01.webp",
  Mining: "Icon_Skill_Mining_01.webp",
  // Alchemy:"Icon_Skill_Bug_01.webp",
  Cooking: "Icon_Skill_Cooking_01.webp",
  FurnitureMaking: "Icon_Skill_Furniture_01.webp",
  Gardening: "Icon_Skill_Gardening_01.webp",
  // AnimalHusbandry:"Icon_Skill_Bug_01.webp",
  // Blacksmithing:"Icon_Skill_Bug_01.webp",
  // Master:"Icon_Skill_Bug_01.webp",
};
export default async function Leaderboard({ dict }: { dict: DICT }) {
  const respone = await fetch("https://palia-api.th.gl/nodes?type=players");
  const data = (await respone.json()) as Players;

  const players = Object.entries(data)
    .map(([guid, player]) => {
      const level = player.skillLevels.reduce(
        (acc, cur) => acc + (cur.level - 1),
        1
      );
      return {
        id: guid,
        name: player.name,
        level: level,
        skillLevels: player.skillLevels.filter(
          (skillLevel) => skillLevel.type in SKILL_ICONS
        ),
      };
    })
    .sort((a, b) => b.level - a.level)
    .slice(0, 20);

  return (
    <div className="overflow-auto h-[calc(100%-50px)]">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{dict.leaderboard.title}</h1>
        <p>{dict.leaderboard.description}</p>
        <table className="table-auto mx-auto border-separate border-spacing-6">
          <thead>
            <tr>
              <th>{dict.leaderboard.level}</th>
              <th>{dict.leaderboard.name}</th>
              <th className="hidden sm:block">{dict.leaderboard.skills}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.level}</td>
                <td className="truncate ">{player.name}</td>
                <td className="gap-1 flex-wrap hidden sm:flex">
                  {player.skillLevels.map((skillLevel) => (
                    <div key={skillLevel.type} className="relative w-12 h-12">
                      <Image
                        src={`/icons/skills/${
                          SKILL_ICONS[
                            skillLevel.type as keyof typeof SKILL_ICONS
                          ]
                        }`}
                        width={20}
                        height={20}
                        alt={skillLevel.type}
                        className="inline-block object-contain"
                      />
                      <span className="absolute bottom-0 left-0 right-0 w-8 mx-auto bg-gray-800 border border-gray-600 rounded px-0.5 text-xs">
                        {skillLevel.level}
                      </span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
