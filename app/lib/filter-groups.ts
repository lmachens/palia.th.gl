interface Map {
    [key: string]: object;
}
export const filterGroups: Map = {
    insects: {
        common: [
            "BP_Bug_CrabC_C",
            "BP_Bug_DragonflyC_C",
            "BP_Bug_CicadaC_C",
            "BP_Bug_ButterflyC_C",
            "BP_Bug_CricketC_C",
            "BP_Bug_MothC_C",
            "BP_Bug_GlowbugC_C",
            "BP_Bug_BeetleC_C"
        ],
        uncommon: [
            "BP_Bug_CicadaU_C",
            "BP_Bug_ButterflyU_C",
            "BP_Bug_LadybugU_C",
            "BP_Bug_CricketU_C",
            "BP_Bug_MantisU_C",
            "BP_Bug_PedeU_C",
            "BP_Bug_SnailU_C",
            "BP_Bug_DragonflyU_C",
            "BP_Bug_MothU_C",
            "BP_Bug_CrabU_C",
            "BP_Bug_BeetleU_C",
            "BP_Bug_BeeU_C"
        ],
        rare: [
            "BP_Bug_CricketR_C",
            "BP_Bug_ButterflyR_C",
            "BP_Bug_DragonflyR_C",
            "BP_Bug_MothR_C",
            "BP_Bug_PedeR1_C",
            "BP_Bug_LadybugR_C",
            "BP_Bug_PedeR2_C",
            "BP_Bug_CicadaR_C",
            "BP_Bug_MantisR1_C",
            "BP_Bug_BeetleR_C",
            "BP_Bug_GlowbugR_C",
            "BP_Bug_BeeR_C",
            "BP_Bug_MantisR2_C",
            "BP_Bug_SnailR_C",
            "BP_Bug_CrabR_C"
        ],
        epic: [
            "BP_Bug_MantisE_C",
            "BP_Bug_DragonflyE_C",
            "BP_Bug_BeetleE_C",
            "BP_Bug_ButterflyE_C"
        ]
    },
    foraging: {
        common: [
            "BP_Gatherable_MushroomR_C",
            "BP_Seashell_C",
            "BP_SundropLillies_C",
            "BP_Oyster_C"
        ],
        uncommon: [
            "BP_PoisonFlower_C",
            "BP_Coral_C",
            "BP_WaterFlower_C",
            "BP_Moss_EmeraldCarpet_C",
            "BP_Spiced_Sprouts_C",
            "BP_SweetLeaves_C",
            "BP_WildGarlic_C"
        ],
        rare: [
            "BP_Gatherable_MushroomBlue_C",
            "BP_Moss_DragonsBeard_C",
            "BP_Spice_HeatRoot_C"
        ],
        epic: [
            "BP_Spice_DariCloves_C",
            "BP_HeartdropLilly_C"
        ]
    },
    mining: {},
    hunting: {},
    fishing: {}
}