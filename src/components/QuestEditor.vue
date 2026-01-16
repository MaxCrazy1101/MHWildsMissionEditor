<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import type { QuestData, QuestRewardData, MainTargetData, BossRushParams, OrderCondition } from '../types/quest';
import { LANGUAGE_NAMES, QUEST_TYPE_VALUES, QuestType, LanguageCode, STAGE_OPTIONS, QUEST_LEVEL_OPTIONS } from '../types/quest';
import { STAGE_DEFAULTS, createMonster } from '../constants/defaultQuest';
import MonsterEditor from './MonsterEditor.vue';
import RewardEditor from './RewardEditor.vue';
import {
    BrowseIcon,
    UserIcon,
    GiftIcon,
    ChatIcon,
    AddIcon,
    DeleteIcon
} from 'tdesign-icons-vue-next';

function getLanguageName(code: number): string {
    return LANGUAGE_NAMES[code] || `Language ${code}`;
}

function getMessageLabel(name: string): string {
    if (name === 'Mission600016_100') return t('messages.questTitle');
    if (name === 'Mission600016_101') return t('messages.clientName');
    if (name === 'Mission600016_102') return t('messages.detail');
    return name;
}

const { t } = useI18n();

const props = defineProps<{
    questData: QuestData | null;
    rewardData: QuestRewardData | null;
}>();

const emit = defineEmits<{
    updateQuest: [quest: QuestData];
    updateReward: [reward: QuestRewardData];
}>();

const activeTab = ref<string>('basic');

const tabs = computed(() => [
    { value: 'basic', label: t('tabs.basic'), icon: BrowseIcon },
    { value: 'monsters', label: t('tabs.monsters'), icon: UserIcon },
    { value: 'rewards', label: t('tabs.rewards'), icon: GiftIcon },
    { value: 'messages', label: t('tabs.messages'), icon: ChatIcon }
]);

const questTypeOptions = computed(() => {
    return QUEST_TYPE_VALUES.map(value => ({
        label: `[${value}] ${t('questTypes.' + QuestType[value])}`,
        value: value
    }));
});

const isBossRush = computed(() => {
    return props.questData?._DataList._QuestType === QuestType.BOSSRUSH;
});

function syncMonsterIds(monsters: MainTargetData[]): MainTargetData[] {
    return monsters.map((m, i) => ({
        ...m,
        _StoryTargetID: 101 + i
    }));
}

function createTargetInfoArray(monsters: MainTargetData[]) {
    return monsters.map((monster, index) => ({
        _ConditionalMoveData: {
            _DestArray: [],
            _IsUse: false,
            _RevertOnCompleted: false,
            _StartAfterFirstCondition: false
        },
        _EmTargetID: 101 + index,
        _LegendaryID: "NORMAL",
        _RoleID: "NORMAL",
        _ShowTargetGuide: true,
        _TargetIDValue: monster._EmID,
        _TargetValue: 1
    }));
}

function updateQuestField<K extends keyof QuestData['_DataList']>(field: K, value: QuestData['_DataList'][K]) {
    if (!props.questData) return;

    let newDataList = { ...props.questData._DataList, [field]: value };
    let newBossZako = props.questData._BossZakoDataList;

    // Sync Monster Difficulty with Quest Level
    if (field === '_QuestLv' && typeof value === 'number') {
        const difficultyName = '★' + value;
        let mainList = props.questData._BossZakoDataList._MainTargetDataList.map(m => ({
            ...m,
            _DifficultyRankId: {
                ...m._DifficultyRankId,
                Name: difficultyName
            }
        }));

        // Ensure StoryTargetID is synced
        mainList = syncMonsterIds(mainList);

        newBossZako = {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: mainList
        };
    }

    // Sync BossRushParams based on QuestType
    if (field === '_QuestType') {
        if (value === QuestType.BOSSRUSH) {
            // Initialize BossRushParams if switching to BossRush
            const count = props.questData._BossZakoDataList._MainTargetDataList.length;
            newDataList._BossRushParams = Array(count).fill(null).map(() => ({
                _PopType: 0,
                _ConditionValue_1: -1,
                _ConditionValue_2: -1
            }));
        } else {
            // Clear BossRushParams if not BossRush
            newDataList._BossRushParams = [];
        }
    }

    emit('updateQuest', {
        ...props.questData,
        _DataList: newDataList,
        _BossZakoDataList: newBossZako
    });
}

function updateQuestId(val: number) {
    if (!props.questData) return;

    // Update Quest Data
    // We update _MissionId._Value. _Name is kept as is (or could be updated if we had a mapping)
    const newMissionId = { ...props.questData._DataList._MissionId, _Value: val };

    emit('updateQuest', {
        ...props.questData,
        _DataList: {
            ...props.questData._DataList,
            _MissionId: newMissionId
        }
    });

    // Update Reward Data if present
    if (props.rewardData) {
        emit('updateReward', {
            ...props.rewardData,
            questId: val,
            rewardId: 520
        });
    }
}

function updateMissionName(name: string) {
    if (!props.questData) return;
    const newMissionId = { ...props.questData._DataList._MissionId, _Name: name };

    emit('updateQuest', {
        ...props.questData,
        _DataList: {
            ...props.questData._DataList,
            _MissionId: newMissionId
        }
    });
}

function updateMessage(langCode: number, msgIndex: number, text: string) {
    if (!props.questData) return;
    const assets = props.questData._MessageAssetList.map(asset => {
        if (Number(asset.Language) !== langCode) return asset;

        const newMessages = [...asset.MessageData];
        newMessages[msgIndex] = { ...newMessages[msgIndex], Text: text };
        return { ...asset, MessageData: newMessages };
    });

    emit('updateQuest', { ...props.questData, _MessageAssetList: assets });
}

function updateOrderCondition<K extends keyof OrderCondition>(field: K, value: OrderCondition[K]) {
    if (!props.questData) return;
    const orderCondition = { ...props.questData._DataList._OrderCondition, [field]: value };

    emit('updateQuest', {
        ...props.questData,
        _DataList: {
            ...props.questData._DataList,
            _OrderCondition: orderCondition
        }
    });
}

function updateQuestStage(val: number) {
    if (!props.questData) return;
    const stage = STAGE_OPTIONS.find(s => s.value === val);
    if (!stage) return;

    // Generic Defaults (to reset if not found in defaults)
    const GENERIC_INIT_POS = "(0,0,0)";
    const GENERIC_ROUTE_ID = { Name: "None", _Value: "00000000-0000-0000-0000-000000000000" };

    let mainList = props.questData._BossZakoDataList._MainTargetDataList;

    // Check if new stage has defaults
    const stageDefaults = STAGE_DEFAULTS[val];

    if (stageDefaults) {
        mainList = mainList.map(m => ({
            ...m,
            _InitPos: stageDefaults.initPos,
            _RouteID: { ...stageDefaults.routeId }
        }));
    } else {
        // If switching away from a stage with defaults, reset to generic
        mainList = mainList.map(m => ({
            ...m,
            _InitPos: GENERIC_INIT_POS,
            _RouteID: { ...GENERIC_ROUTE_ID }
        }));
    }

    emit('updateQuest', {
        ...props.questData,
        _BossZakoDataList: {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: mainList
        },
        _DataList: {
            ...props.questData._DataList,
            _Stage: {
                _Name: stage.name, // Use the associated name (e.g., st401)
                _Value: stage.value
            }
        }
    });
}

function updateMonster(index: number, monster: MainTargetData) {
    if (!props.questData) return;
    const monsters = [...props.questData._BossZakoDataList._MainTargetDataList];
    monsters[index] = monster;

    // Sync ClearCondition
    // Create copy and sync IDs first to ensure consistency
    const monstersWithSyncedIds = syncMonsterIds(monsters);

    // We update the list with synced IDs
    const finalMonsters = monstersWithSyncedIds;

    const targetInfoArray = createTargetInfoArray(finalMonsters);

    emit('updateQuest', {
        ...props.questData,
        _BossZakoDataList: {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: finalMonsters
        },
        _DataList: {
            ...props.questData._DataList,
            _ClearCondition: {
                ...props.questData._DataList._ClearCondition,
                _TargetInfoArray: targetInfoArray
            }
        }
    });
}

function removeMonster(index: number) {
    if (!props.questData) return;
    const monsters = props.questData._BossZakoDataList._MainTargetDataList.filter((_, i) => i !== index);

    // Sync IDs after removal
    const monstersWithSyncedIds = syncMonsterIds(monsters);

    // Sync BossRushParams
    let bossRushParams = props.questData._DataList._BossRushParams;
    if (isBossRush.value && bossRushParams && bossRushParams.length > index) {
        bossRushParams = bossRushParams.filter((_, i) => i !== index);
    } else if (!isBossRush.value) {
        bossRushParams = [];
    }

    // Sync ClearCondition
    const targetInfoArray = createTargetInfoArray(monstersWithSyncedIds);

    emit('updateQuest', {
        ...props.questData,
        _BossZakoDataList: {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: monstersWithSyncedIds
        },
        _DataList: {
            ...props.questData._DataList,
            _BossRushParams: bossRushParams || [],
            _ClearCondition: {
                ...props.questData._DataList._ClearCondition,
                _TargetInfoArray: targetInfoArray
            }
        }
    });
}

function updateBossRushParam(index: number, param: BossRushParams) {
    if (!props.questData) return;
    const params = [...(props.questData._DataList._BossRushParams || [])];

    // Ensure array has enough elements if we are adding/editing
    while (params.length <= index) {
        params.push({
            _PopType: 0,
            _ConditionValue_1: -1,
            _ConditionValue_2: -1
        });
    }

    params[index] = param;

    emit('updateQuest', {
        ...props.questData,
        _DataList: {
            ...props.questData._DataList,
            _BossRushParams: params
        }
    });
}

function addMonster() {
    if (!props.questData) return;
    const monsters = [...props.questData._BossZakoDataList._MainTargetDataList];

    // Sync BossRushParams
    let bossRushParams = props.questData._DataList._BossRushParams;
    if (isBossRush.value) {
        bossRushParams = [...(bossRushParams || [])];
        bossRushParams.push({
            _PopType: 0,
            _ConditionValue_1: -1,
            _ConditionValue_2: -1
        });
    } else {
        bossRushParams = [];
    }

    // Create new monster with synchronized DifficultyRank
    const questLv = props.questData._DataList._QuestLv;
    const newMonster = createMonster(questLv);

    // Sync RouteID and InitPos based on current stage
    const currentStage = props.questData._DataList._Stage._Value;
    const stageDefaults = STAGE_DEFAULTS[currentStage];

    newMonster._InitPos = stageDefaults.initPos;
    newMonster._RouteID = { ...stageDefaults.routeId };

    monsters.push(newMonster);

    // Sync IDs for new list
    const monstersWithSyncedIds = syncMonsterIds(monsters);

    // Sync ClearCondition
    const targetInfoArray = createTargetInfoArray(monstersWithSyncedIds);

    emit('updateQuest', {
        ...props.questData,
        _BossZakoDataList: {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: monstersWithSyncedIds
        },
        _DataList: {
            ...props.questData._DataList,
            _BossRushParams: bossRushParams || [],
            _ClearCondition: {
                ...props.questData._DataList._ClearCondition,
                _TargetInfoArray: targetInfoArray
            }
        }
    });
}

const availableLanguages = computed(() => {
    if (!props.questData) return [];
    const usedLangs = new Set(props.questData._MessageAssetList.map(a => Number(a.Language)));
    return Object.entries(LANGUAGE_NAMES)
        .map(([code, name]) => ({ label: name, value: Number(code) }))
        .filter(opt => !usedLangs.has(opt.value));
});

function addMessageLanguage(langCode: number) {
    if (!props.questData) return;
    const assets = [...props.questData._MessageAssetList];

    // Copy messages from first existing language or default
    const defaultMessages = assets.length > 0
        ? assets[0].MessageData.map(m => ({ ...m, Text: '' }))
        : [
            { Name: "Mission600016_000", Text: "" },
            { Name: "Mission600016_001", Text: "" },
            { Name: "Mission600016_100", Text: "" },
            { Name: "Mission600016_101", Text: "" },
            { Name: "Mission600016_102", Text: "" },
            { Name: "Mission600016_122", Text: "" },
            { Name: "Mission600016_123", Text: "" },
            { Name: "Mission600016_132", Text: "" }
        ];

    assets.push({
        Language: langCode,
        MessageData: defaultMessages
    });

    assets.sort((a, b) => (Number(a.Language) - Number(b.Language)));

    emit('updateQuest', { ...props.questData, _MessageAssetList: assets });
}

function removeMessageLanguage(langCode: number | LanguageCode) {
    if (!props.questData) return;
    const assets = props.questData._MessageAssetList.filter(a => a.Language !== langCode);
    emit('updateQuest', { ...props.questData, _MessageAssetList: assets });
}

function updateRewardItems(items: QuestRewardData['rewardItems']) {
    if (!props.rewardData) return;
    emit('updateReward', { ...props.rewardData, rewardItems: items });
}
</script>

<template>
    <div class="quest-editor">
        <t-tabs v-model="activeTab" theme="card">
            <t-tab-panel v-for="tab in tabs" :key="tab.value" :value="tab.value">
                <template #label>
                    <component :is="tab.icon" style="margin-right: 8px" />
                    {{ tab.label }}
                </template>
            </t-tab-panel>
        </t-tabs>

        <div class="editor-content">
            <!-- Empty State -->
            <div v-if="!questData" class="empty-state">
                <t-empty description="Open a quest file to start editing">
                    <template #image>
                        <BrowseIcon size="80" style="color: var(--td-text-color-placeholder)" />
                    </template>
                </t-empty>
            </div>

            <!-- Basic Info Tab -->
            <div v-else-if="activeTab === 'basic'" class="tab-content">
                <t-card :bordered="true" header-bordered>
                    <template #header>
                        <t-space>
                            <BrowseIcon />
                            <span>{{ t('tabs.basic') }}</span>
                        </t-space>
                    </template>

                    <t-form label-align="top">
                        <t-row :gutter="[24, 16]">
                            <t-col :span="3">
                                <t-form-item label="Quest ID">
                                    <t-input-number :value="questData._DataList._MissionId._Value"
                                        @change="(val: number) => updateQuestId(val)" theme="normal" :min="0" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="6">
                                <t-form-item :label="t('basic.questName')">
                                    <t-input :value="questData._DataList._MissionId._Name || ''"
                                        @change="(val: string) => updateMissionName(val)" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.questLevel')">
                                    <t-select :value="questData._DataList._QuestLv"
                                        @change="(val: number) => updateQuestField('_QuestLv', val)"
                                        :options="QUEST_LEVEL_OPTIONS" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.timeLimit')">
                                    <t-input-number :value="questData._DataList._TimeLimit"
                                        @change="(val: number) => updateQuestField('_TimeLimit', val)" theme="normal"
                                        suffix="min" :min="5" :max="50" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.questLife')">
                                    <t-input-number :value="questData._DataList._QuestLife"
                                        @change="(val: number) => updateQuestField('_QuestLife', val)" theme="normal" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item label="Reward Money">
                                    <t-input-number :value="questData._DataList._RemMoney"
                                        @change="(val: number) => updateQuestField('_RemMoney', val)" theme="normal"
                                        :step="1000" :min="1000" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item label="HR Points">
                                    <t-input-number :value="questData._DataList._HRPoint"
                                        @change="(val: number) => updateQuestField('_HRPoint', val)" theme="normal"
                                        :step="10" :min="100" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.hrRequired')">
                                    <t-input-number :value="questData._DataList._OrderCondition._OrderHR"
                                        @change="(val: number) => updateOrderCondition('_OrderHR', val)"
                                        theme="normal" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.maxPlayers')">
                                    <t-input-number :value="questData._DataList._OrderCondition._MaxPlayerNum"
                                        @change="(val: number) => updateOrderCondition('_MaxPlayerNum', val)"
                                        theme="normal" :min="1" :max="4" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.questType')">
                                    <t-select :value="questData._DataList._QuestType"
                                        @change="(val: number) => updateQuestField('_QuestType', val)"
                                        :options="questTypeOptions" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="6">
                                <t-form-item :label="t('basic.stage')">
                                    <t-select :value="questData._DataList._Stage._Value"
                                        @change="(val: number) => updateQuestStage(val)" :options="STAGE_OPTIONS" />
                                </t-form-item>
                            </t-col>
                        </t-row>
                    </t-form>
                </t-card>
            </div>

            <!-- Monsters Tab -->
            <div v-else-if="activeTab === 'monsters'" class="tab-content">
                <t-space direction="vertical" size="large" style="width: 100%">

                    <MonsterEditor v-for="(monster, index) in questData._BossZakoDataList._MainTargetDataList"
                        :key="index" :monster="monster" :index="index"
                        :boss-rush-param="questData._DataList._BossRushParams?.[index]" :is-boss-rush="isBossRush"
                        :current-stage="questData._DataList._Stage._Value" @update="updateMonster"
                        @update-boss-rush="updateBossRushParam" @remove="removeMonster" />

                    <t-button block variant="dashed" @click="addMonster">
                        <template #icon>
                            <AddIcon />
                        </template>
                        {{ t('monsters.addMonster') }}
                    </t-button>
                </t-space>
            </div>

            <!-- Rewards Tab -->
            <div v-else-if="activeTab === 'rewards'" class="tab-content">
                <RewardEditor v-if="rewardData" :items="rewardData.rewardItems" @update="updateRewardItems" />
                <t-empty v-else description="Open an .ext.json file to edit rewards" />
            </div>

            <!-- Messages Tab -->
            <div v-else-if="activeTab === 'messages'" class="tab-content">
                <div style="margin-bottom: 16px;">
                    <t-select :placeholder="t('actions.add') + ' ' + t('messages.language')"
                        :options="availableLanguages" @change="(val: number) => addMessageLanguage(val)"
                        style="width: 200px" />
                </div>
                <t-collapse default-expand-all>
                    <t-collapse-panel v-for="asset in questData._MessageAssetList" :key="asset.Language"
                        :header="getLanguageName(asset.Language)">
                        <template #headerRightContent>
                            <t-popconfirm :content="t('actions.delete') + '?'"
                                @confirm="removeMessageLanguage(asset.Language)">
                                <t-button variant="text" shape="circle" @click.stop>
                                    <template #icon>
                                        <DeleteIcon />
                                    </template>
                                </t-button>
                            </t-popconfirm>
                        </template>
                        <t-form label-align="top">
                            <t-row :gutter="[16, 12]">
                                <t-col :span="12" v-for="(msg, idx) in asset.MessageData" :key="msg.Name">
                                    <t-form-item :label="getMessageLabel(msg.Name)">
                                        <t-textarea :value="msg.Text" :autosize="{ minRows: 1, maxRows: 4 }"
                                            @change="(val: string) => updateMessage(Number(asset.Language), idx, val)" />
                                    </t-form-item>
                                </t-col>
                            </t-row>
                        </t-form>
                    </t-collapse-panel>
                </t-collapse>
            </div>
        </div>
    </div>
</template>

<style scoped>
.quest-editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--td-bg-color-page);
    overflow: hidden;
}

.editor-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.tab-content {
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
}
</style>
