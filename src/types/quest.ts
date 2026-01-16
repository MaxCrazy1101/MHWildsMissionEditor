// TypeScript interfaces matching Rust data structures
import { STAGE_ID } from '../constants/stages';


// Common types
export interface NameValue<T> {
    _Name?: string;
    _Value: T;
}

export interface NameValueAlt {
    Name: string;
    Value: string;
}

export interface ResourceId {
    _ID: string;
    _Resource: string | null;
}

export interface FieldId {
    _Name: string;
    _Value: number;
}

export interface RouteId {
    Name: string;
    _Value: string;
}

export interface OptionTag {
    Value: number;
}

// Monster types
export interface AdvancedSettings {
    _IsDeepSleepCreate: boolean;
}

export interface MainTargetData {
    _AdvancedSettings: AdvancedSettings;
    _AreaNo: number;
    _DifficultyAdjustRange: number;
    _DifficultyRankId: NameValueAlt;
    _EmID: number;
    _EventTargetID: string;
    _FixedSize: number;
    _GroupID: number;
    _InitPos: string;
    _IsUseRandomSize: boolean;
    _LayoutKeepID: number;
    _LegendaryID: string;
    _OptionTag: OptionTag;
    _RandomSizeTblId: NameValueAlt;
    _RoleID: string;
    _RouteID: RouteId;
    _SetAreaNo: number;
    _StoryTargetID: number;
}

export interface TargetInfo {
    _ConditionalMoveData: {
        _DestArray: unknown[];
        _IsUse: boolean;
        _RevertOnCompleted: boolean;
        _StartAfterFirstCondition: boolean;
    };
    _EmTargetID: number;
    _LegendaryID: string;
    _RoleID: string;
    _ShowTargetGuide: boolean;
    _TargetIDValue: number;
    _TargetValue: number;
}

export interface ClearCondition {
    _TargetInfoArray: TargetInfo[];
    _TargetType: number;
}

// Sub boss info for additional monsters in quest
export interface SubBossInfo {
    _ConditionalMoveData: {
        _DestArray: unknown[];
        _IsUse: boolean;
        _RevertOnCompleted: boolean;
        _StartAfterFirstCondition: boolean;
    };
    _EmID: number;
    _EmTargetID: number;
    _LegendaryID: string;
    _RoleID: string;
}

// Quest Types
export enum QuestType {
    HUNTING = 0,
    KILL = 1,
    CAPTURE = 2,
    ARENA = 5,
    BOSSRUSH = 6,
    SPECIAL = 7
}

export const QUEST_TYPE_VALUES = Object.keys(QuestType)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key));

// Quest types
export interface ArenaData {
    _IsUserCamp: boolean;
    _MissionID: unknown | null;
    _SelectDatas: unknown | null;
    _SelectNpcDatas: unknown | null;
    _TimeRankA: unknown | null;
    _TimeRankB: unknown | null;
    _TimeRankS: unknown | null;
}

export interface BossRushParams {
    _PopType: number;
    _ConditionValue_1: number;
    _ConditionValue_2: number;
}

export interface OrderCondition {
    _MaxPlayerNum: number;
    _OrderHR: number;
    _OrderMR: number;
    _PremiseMission: NameValue<number>;
}

export interface QuestMsgAuto {
    _IsAuto: boolean;
    _MsgID?: string;
    _MsgIDs?: string[];
}

export enum BossRushPopType {
    BEGINNING = 0,
    REMAIN_HP = 2,
    HUNT_NUM_OR_TIME = 4
}

export const BOSS_RUSH_POP_TYPE_VALUES = [
    BossRushPopType.BEGINNING,
    BossRushPopType.REMAIN_HP,
    BossRushPopType.HUNT_NUM_OR_TIME
];

export interface QuestMsg {
    _ClearConditionMsg: QuestMsgAuto;
    _ClientNameMsg: string;
    _DetailMsg: string;
    _FailConditionMsg: QuestMsgAuto;
    _FailConditionMsg_Other: string;
    _OrderConditionMsg: QuestMsgAuto;
    _OrderConditionMsg_Other: string;
    _OrderConditionMsg_StProgress: string;
    _TitleMsg: string;
}

export interface DataList {
    _AddPoint: number;
    _ArenaFenceCloseTime: number;
    _ArenaFenceInitWaitTime: number;
    _ArenaFenceReuseableTime: number;
    _ArenaFenceStatus: string;
    _ArenaPillarStatus: string;
    _BattleBGM: number;
    _BossRushParams: BossRushParams[];
    '_BossRushParams='?: unknown;
    _ClearBGM: number;
    _ClearCondition: ClearCondition;
    _EnableGuestNpc: boolean;
    _ExOverrideID: number;
    _HRPoint: number;
    _IconType: NameValue<number>;
    _Index: number;
    _IsOverrideArenaFenceParam: boolean;
    _IsOverrideArenaPillarParam: boolean;
    _IsSettingSupply: boolean;
    _MissionId: NameValue<number>;
    _OrderCondition: OrderCondition;
    _PartnerNpc: NameValue<number>;
    _QuestAttribute: number;
    _QuestLife: number;
    _QuestLv: number;
    _QuestMsg: QuestMsg;
    _QuestType: number;
    _RemMoney: number;
    _Stage: NameValue<number>;
    _SubBossInfoArray: SubBossInfo[];
    '_SubBossInfoArray='?: unknown;
    _SupplyID: NameValue<number>;
    _TimeLimit: number;
    _Version: number;
}

export interface MessageData {
    Name: string;
    Text: string;
}

// Game language codes
export enum LanguageCode {
    Japanese = 0,
    English = 1,
    French = 2,
    Italian = 3,
    German = 4,
    Spanish = 5,
    Russian = 6,
    Polish = 7,
    PortugueseBR = 10,
    Korean = 11,
    TraditionalChinese = 12,
    SimplifiedChinese = 13,
    Arabic = 21,
    LatinAmericanSpanish = 32
}

// Language code to display name mapping
export const LANGUAGE_NAMES: Record<number, string> = {
    [LanguageCode.Japanese]: '日本語',
    [LanguageCode.English]: 'English',
    [LanguageCode.French]: 'Français',
    [LanguageCode.Italian]: 'Italiano',
    [LanguageCode.German]: 'Deutsch',
    [LanguageCode.Spanish]: 'Español',
    [LanguageCode.Russian]: 'Русский',
    [LanguageCode.Polish]: 'Polski',
    [LanguageCode.PortugueseBR]: 'Português (BR)',
    [LanguageCode.Korean]: '한국어',
    [LanguageCode.TraditionalChinese]: '繁體中文',
    [LanguageCode.SimplifiedChinese]: '简体中文',
    [LanguageCode.Arabic]: 'العربية',
    [LanguageCode.LatinAmericanSpanish]: 'Español (LA)'
};

export interface MessageAsset {
    Language: LanguageCode | number;
    MessageData: MessageData[];
}

export interface ZakoLayoutTag {
    _FieldID: FieldId;
    _IsIntentionallyBlank?: boolean;
    _Value: number;
}

export interface BossZakoData {
    _AnimalLayoutID: ResourceId;
    _FieldID: FieldId;
    _MainTargetDataList: MainTargetData[];
    _SubBossLayoutID: ResourceId;
    _ZakoLayoutID: ResourceId;
    _ZakoLayoutTag: ZakoLayoutTag;
}

// Environment data for quest
export interface EnvironmentData {
    _EnvTimeRate: number;
    _EnvType: NameValue<number>;
    _ForcastDatas: unknown[];
    _IsFixEnv: boolean;
    _IsTransitionEnv: boolean;
    _StageType: NameValue<number>;
    _StopTiming_EnvType: NameValue<number>;
}

// Guide message data
export interface LGuideMsgData {
    IsSubOrder: boolean;
    SetMsgID: string;
    gaugeSpritNum: number;
    isCanSkip: boolean;
    isGauge: boolean;
}

// Moon settings
export interface MoonData {
    _IsSetMoon: boolean;
    _MoonOptionsVariationIndex: number;
    _MoonSetting: NameValue<number>;
    _MoonTextureVariationIndex: number;
}

// Simpler animal tag without _IsIntentionallyBlank
export interface EmSetAnimalTag {
    _FieldID: FieldId;
    _Value: number;
}

export interface StreamQuestData {
    _EmSetData: {
        _EmSet_AnimalTag: EmSetAnimalTag;
        _EmSet_BossZako: unknown | null;
        _Stage: NameValue<number>;
    };
    _IsFixWorldTime: boolean;
    _IsFixWorldTimeQuest: boolean;
    _IsSetWorldTime: boolean;
    _IsSetWorldTimeQuest: boolean;
    _IsStopTimeTiming: boolean;
    _IsStopTimeTimingQuest: boolean;
    _MissionTypeSerial: NameValue<number>;
    _SetEnvironmentDataList: EnvironmentData[];
    _SetLGuideMsgData: LGuideMsgData;
    _SetMoonData: MoonData;
    _StopTimeTimingHour: number;
    _StopTimeTimingHourQuest: number;
    _StopTimeTimingMinute: number;
    _StopTimeTimingMinuteQuest: number;
    _WorldTimeHour: number;
    _WorldTimeHourQuest: number;
    _WorldTimeMinute: number;
    _WorldTimeMinuteQuest: number;
}

// Root quest data structure
export interface QuestData {
    _ArenaDataList: ArenaData;
    _BossZakoDataList: BossZakoData;
    _DataList: DataList;
    _IsRecommended: boolean;
    _MessageAssetList: MessageAsset[];
    _StreamQuestData: StreamQuestData;
}

// Reward types
export interface RewardItem {
    itemId: number;
    itemName: string;
    minCount: number;
    maxCount: number;
    probability: number;
}

export interface QuestRewardData {
    questId: number;
    rewardId: number;
    rewardItems: RewardItem[];
}

// Enemy data from enemies.json
export interface EnemyName {
    cn: string;
    en: string;
    jp: string;
}

export interface Enemy {
    id: number;
    fixedId: number;
    label: string;
    name: EnemyName;
}

export const QUEST_LEVEL_OPTIONS = [
    { label: '★1', value: 1 },
    { label: '★2', value: 2 },
    { label: '★3', value: 3 },
    { label: '★4', value: 4 },
    { label: '★5', value: 5 },
    { label: '★6', value: 6 },
    { label: '★7', value: 7 },
    { label: '★8', value: 8 },
    { label: '★9', value: 9 }
];

export const MONSTER_DIFFICULTY_OPTIONS = [
    { label: 'None', value: 'None' },
    { label: '★1', value: '★1' },
    { label: '★2', value: '★2' },
    { label: '★3', value: '★3' },
    { label: '★4', value: '★4' },
    { label: '★5', value: '★5' },
    { label: '★6', value: '★6' },
    { label: '★7', value: '★7' },
    { label: '★8', value: '★8' }
];

export const STAGE_OPTIONS = [
    { label: 'Arena (st401)', value: STAGE_ID.ST401_ARENA, name: 'st401' },
    { label: 'Windward Plains (st001)', value: STAGE_ID.ST001_WINDWARD_PLAINS, name: 'st001' },
    { label: 'Scarlet Forest (st101)', value: STAGE_ID.ST101_SCARLET_FOREST, name: 'st101' },
    { label: 'Oilwell Basin (st201)', value: STAGE_ID.ST201_OILWELL_BASIN, name: 'st201' },
    { label: 'Cliffside Caverns (st301)', value: STAGE_ID.ST301_CLIFFSIDE_CAVERNS, name: 'st301' }
];
