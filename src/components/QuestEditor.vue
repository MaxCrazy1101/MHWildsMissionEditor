<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import type { QuestData, QuestRewardData, MainTargetData, BossRushParams } from '../types/quest';
import { LANGUAGE_NAMES, QUEST_TYPE_VALUES, QuestType } from '../types/quest';
import MonsterEditor from './MonsterEditor.vue';
import RewardEditor from './RewardEditor.vue';
import {
    BrowseIcon,
    UserIcon,
    GiftIcon,
    ChatIcon
} from 'tdesign-icons-vue-next';

function getLanguageName(code: number): string {
    return LANGUAGE_NAMES[code] || `Language ${code}`;
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

function updateQuestField<K extends keyof QuestData['_DataList']>(field: K, value: QuestData['_DataList'][K]) {
    if (!props.questData) return;
    emit('updateQuest', {
        ...props.questData,
        _DataList: { ...props.questData._DataList, [field]: value }
    });
}

function updateMonster(index: number, monster: MainTargetData) {
    if (!props.questData) return;
    const monsters = [...props.questData._BossZakoDataList._MainTargetDataList];
    monsters[index] = monster;
    emit('updateQuest', {
        ...props.questData,
        _BossZakoDataList: {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: monsters
        }
    });
}

function removeMonster(index: number) {
    if (!props.questData) return;
    const monsters = props.questData._BossZakoDataList._MainTargetDataList.filter((_, i) => i !== index);

    // Sync BossRushParams
    let bossRushParams = props.questData._DataList._BossRushParams;
    if (bossRushParams && bossRushParams.length > index) {
        bossRushParams = bossRushParams.filter((_, i) => i !== index);
    }

    emit('updateQuest', {
        ...props.questData,
        _BossZakoDataList: {
            ...props.questData._BossZakoDataList,
            _MainTargetDataList: monsters
        },
        _DataList: {
            ...props.questData._DataList,
            _BossRushParams: bossRushParams || []
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
                            <t-col :span="6">
                                <t-form-item :label="t('basic.questName')">
                                    <t-input :value="questData._DataList._MissionId._Name || ''" readonly />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.questLevel')">
                                    <t-input-number :value="questData._DataList._QuestLv"
                                        @change="(val: number) => updateQuestField('_QuestLv', val)" theme="normal" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.timeLimit')">
                                    <t-input-number :value="questData._DataList._TimeLimit"
                                        @change="(val: number) => updateQuestField('_TimeLimit', val)" theme="normal"
                                        suffix="min" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.questLife')">
                                    <t-input-number :value="questData._DataList._QuestLife"
                                        @change="(val: number) => updateQuestField('_QuestLife', val)" theme="normal" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.hrRequired')">
                                    <t-input-number :value="questData._DataList._OrderCondition._OrderHR" readonly
                                        theme="normal" />
                                </t-form-item>
                            </t-col>

                            <t-col :span="3">
                                <t-form-item :label="t('basic.maxPlayers')">
                                    <t-input-number :value="questData._DataList._OrderCondition._MaxPlayerNum" readonly
                                        theme="normal" />
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
                                    <t-input :value="questData._DataList._Stage._Name || ''" readonly />
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
                        @update="updateMonster" @update-boss-rush="updateBossRushParam" @remove="removeMonster" />
                </t-space>
            </div>

            <!-- Rewards Tab -->
            <div v-else-if="activeTab === 'rewards'" class="tab-content">
                <RewardEditor v-if="rewardData" :items="rewardData.rewardItems" @update="updateRewardItems" />
                <t-empty v-else description="Open an .ext.json file to edit rewards" />
            </div>

            <!-- Messages Tab -->
            <div v-else-if="activeTab === 'messages'" class="tab-content">
                <t-collapse default-expand-all>
                    <t-collapse-panel v-for="asset in questData._MessageAssetList" :key="asset.Language"
                        :header="getLanguageName(asset.Language)">
                        <t-form label-align="top">
                            <t-row :gutter="[16, 12]">
                                <t-col :span="12" v-for="msg in asset.MessageData" :key="msg.Name">
                                    <t-form-item :label="msg.Name">
                                        <t-textarea :value="msg.Text" readonly :autosize="{ minRows: 1, maxRows: 4 }" />
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
