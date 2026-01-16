import { QuestData, QuestRewardData, MainTargetData } from '../types/quest';
import { STAGE_ID } from './stages';

export const DEFAULT_MONSTER_DATA: MainTargetData = {
    _AdvancedSettings: { _IsDeepSleepCreate: false },
    _AreaNo: 255,
    _DifficultyAdjustRange: 0,
    _DifficultyRankId: { Name: "", Value: "00000000-0000-0000-0000-000000000000" },
    _EmID: 0,
    _EventTargetID: "INVALID",
    _FixedSize: 100,
    _GroupID: 0,
    _InitPos: "(-326,-28,176)",
    _IsUseRandomSize: false,
    _LayoutKeepID: -1,
    _LegendaryID: "NORMAL",
    _OptionTag: { Value: 0 },
    _RandomSizeTblId: { Name: "", Value: "f8f74ab0-0002-0000-00000002003e203e" },
    _RoleID: "NORMAL",
    _RouteID: { Name: "斗技场", _Value: "7ae19f9f-f315-4f16-cc4fc595f9f7c483" },
    _SetAreaNo: 255,
    _StoryTargetID: 0
};



export const STAGE_DEFAULTS: Record<number, { initPos: string, routeId: { Name: string, _Value: string } }> = {
    // Arena (st401)
    [STAGE_ID.ST401_ARENA]: {
        initPos: "(-326,-28,176)",
        routeId: { Name: "斗技场", _Value: "7ae19f9f-f315-4f16-cc4fc595f9f7c483" }
    },
    // Windward Plains (st001)
    [STAGE_ID.ST001_WINDWARD_PLAINS]: {
        initPos: "(0,0,0)",
        routeId: { Name: "None", _Value: "00000000-0000-0000-0000-000000000000" }
    },
    // Scarlet Forest (st101)
    [STAGE_ID.ST101_SCARLET_FOREST]: {
        initPos: "(0,0,0)",
        routeId: { Name: "None", _Value: "00000000-0000-0000-0000-000000000000" }
    },
    // Oilwell Basin (st201)
    [STAGE_ID.ST201_OILWELL_BASIN]: {
        initPos: "(0,0,0)",
        routeId: { Name: "None", _Value: "00000000-0000-0000-0000-000000000000" }
    },
    // Cliffside Caverns (st301)
    [STAGE_ID.ST301_CLIFFSIDE_CAVERNS]: {
        initPos: "(0,0,0)",
        routeId: { Name: "None", _Value: "00000000-0000-0000-0000-000000000000" }
    }
};

/**
 * Creates a new monster with default values and synchronized DifficultyRank.
 * @param questLevel Current Quest Level (e.g., 3 for ★3)
 * @returns New MainTargetData object
 */
export function createMonster(questLevel: number): MainTargetData {
    const newMonster = JSON.parse(JSON.stringify(DEFAULT_MONSTER_DATA));
    newMonster._DifficultyRankId.Name = '★' + questLevel;
    // Note: We use global defaults. Synchronization for map defaults (InitPos, RouteID) 
    // is handled by the QuestEditor's stage switching logic, or can be added here if needed.
    // Currently DEFAULT_MONSTER_DATA contains st401 values by default.
    return newMonster;
}

export const DEFAULT_QUEST_DATA: QuestData = {
    _ArenaDataList: {
        _IsUserCamp: false,
        _MissionID: null,
        _SelectDatas: null,
        _SelectNpcDatas: null,
        _TimeRankA: null,
        _TimeRankB: null,
        _TimeRankS: null
    },
    _BossZakoDataList: {
        _AnimalLayoutID: {
            _ID: "00000000-0000-0000-0000-000000000000",
            "_Resource": null
        },
        _FieldID: {
            _Name: "st401",
            _Value: 1181994624
        },
        _MainTargetDataList: [],
        _SubBossLayoutID: {
            _ID: "c8ed5a65-8c96-48cb-3a15eb556208668e",
            "_Resource": "assets:/GameDesign/Stage/st401/Layout/Loaded/Enemy/SubBoss/st401_SubBoss_Ms006025_00.pog.json"
        },
        _ZakoLayoutID: {
            _ID: "00000000-0000-0000-0000-000000000000",
            "_Resource": null
        },
        _ZakoLayoutTag: {
            _FieldID: {
                _Name: "st401",
                _Value: 1181994624
            },
            _IsIntentionallyBlank: false,
            _Value: 4
        }
    },
    _DataList: {
        _AddPoint: 198,
        _ArenaFenceCloseTime: 60,
        _ArenaFenceInitWaitTime: 60,
        _ArenaFenceReuseableTime: 120,
        _ArenaFenceStatus: "OPEN",
        _ArenaPillarStatus: "USE",
        _BattleBGM: 0,
        _BossRushParams: [],
        '_BossRushParams=': null,
        _ClearBGM: 0,
        _ClearCondition: {
            _TargetInfoArray: [],
            _TargetType: 1
        },
        _EnableGuestNpc: false,
        _ExOverrideID: 0,
        _HRPoint: 0,
        _IconType: {
            _Name: "app.QuestDef.QUEST_ICON_TYPE_Fixed",
            _Value: 1927315328
        },
        _Index: 0,
        _IsOverrideArenaFenceParam: false,
        _IsOverrideArenaPillarParam: false,
        _IsSettingSupply: false,
        _MissionId: {
            _Name: "New Quest",
            _Value: 0
        },
        _OrderCondition: {
            _MaxPlayerNum: 4,
            _OrderHR: 21,
            _OrderMR: 0,
            _PremiseMission: {
                _Name: "前置任务ID",
                _Value: -282127296
            }
        },
        _PartnerNpc: {
            _Name: "無効値",
            _Value: 4
        },
        _QuestAttribute: 0,
        _QuestLife: 2,
        _QuestLv: 1,
        _QuestMsg: {
            _ClearConditionMsg: {
                _IsAuto: true,
                _MsgID: "00000000-0000-0000-0000-000000000000"
            },
            _ClientNameMsg: "9707f537-aadd-4e0e-983a-8ec7c72fc1fb",
            _DetailMsg: "b15f3acb-b6ca-4e18-968b-2a5161f9679f",
            _FailConditionMsg: {
                _IsAuto: true,
                _MsgIDs: [
                    "00000000-0000-0000-0000-000000000000",
                    "00000000-0000-0000-0000-000000000000"
                ]
            },
            _FailConditionMsg_Other: "1e801eb7-04d4-4ebe-9423-62e633c1b3ee",
            _OrderConditionMsg: {
                _IsAuto: true,
                _MsgIDs: [
                    "00000000-0000-0000-0000-000000000000",
                    "00000000-0000-0000-0000-000000000000"
                ]
            },
            _OrderConditionMsg_Other: "acbf575d-58a2-46a4-bd33-af9eb4d105be",
            _OrderConditionMsg_StProgress: "7d277c75-8e3e-4073-9351-072604943ce6",
            _TitleMsg: "ad16cdce-1ad5-4ba9-8ac2-4cee6dd52021"
        },
        _QuestType: 0,
        _RemMoney: 0,
        _Stage: {
            _Name: "st401",
            _Value: 1181994624
        },
        _SubBossInfoArray: [],
        '_SubBossInfoArray=': null,
        _SupplyID: {
            _Name: "無効値",
            _Value: 1966686080
        },
        _TimeLimit: 50,
        _Version: 1
    },
    _IsRecommended: false,
    _MessageAssetList: [],
    _StreamQuestData: {
        _EmSetData: {
            _EmSet_AnimalTag: {
                _FieldID: {
                    _Name: "st401",
                    _Value: 1181994624
                },
                _Value: 1
            },
            _EmSet_BossZako: null,
            _Stage: {
                _Name: "st401",
                _Value: 1181994624
            }
        },
        _IsFixWorldTime: false,
        _IsFixWorldTimeQuest: false,
        _IsSetWorldTime: false,
        _IsSetWorldTimeQuest: true,
        _IsStopTimeTiming: false,
        _IsStopTimeTimingQuest: false,
        _MissionTypeSerial: {
            _Name: "活动任务类型",
            _Value: 1025928384
        },
        _SetEnvironmentDataList: [
            {
                _EnvTimeRate: 0,
                _EnvType: {
                    _Name: "荒廃期",
                    _Value: 1961958400
                },
                _ForcastDatas: [],
                _IsFixEnv: false,
                _IsTransitionEnv: false,
                _StageType: {
                    _Name: "st401",
                    _Value: 1181994624
                },
                _StopTiming_EnvType: {
                    _Name: "無効値",
                    _Value: 2110947200
                }
            }
        ],
        _SetLGuideMsgData: {
            IsSubOrder: false,
            SetMsgID: "00000000-0000-0000-0000-000000000000",
            gaugeSpritNum: 0,
            isCanSkip: false,
            isGauge: false
        },
        _SetMoonData: {
            _IsSetMoon: false,
            _MoonOptionsVariationIndex: 0,
            _MoonSetting: {
                _Name: "無効値",
                _Value: -770399616
            },
            _MoonTextureVariationIndex: 0
        },
        _StopTimeTimingHour: 0,
        _StopTimeTimingHourQuest: 0,
        _StopTimeTimingMinute: 0,
        _StopTimeTimingMinuteQuest: 0,
        _WorldTimeHour: 0,
        _WorldTimeHourQuest: 21,
        _WorldTimeMinute: 0,
        _WorldTimeMinuteQuest: 0
    }
};

export const DEFAULT_REWARD_DATA: QuestRewardData = {
    questId: 0,
    rewardId: 0,
    rewardItems: []
};
