<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import type { MainTargetData, Enemy, BossRushParams } from '../types/quest';

import { STAGE_DEFAULTS } from '../constants/defaultQuest';
import { BossRushPopType, BOSS_RUSH_POP_TYPE_VALUES } from '../types/quest';
import enemies from '../assets/enemies.json';
import { DeleteIcon } from 'tdesign-icons-vue-next';

const { t, locale } = useI18n();

const props = defineProps<{
    monster: MainTargetData;
    index: number;
    bossRushParam?: BossRushParams;
    isBossRush?: boolean;
    currentStage?: number;
}>();

const emit = defineEmits<{
    update: [index: number, monster: MainTargetData];
    updateBossRush: [index: number, param: BossRushParams];
    remove: [index: number];
}>();

const enemyList = enemies as Enemy[];
const stageDefaults = computed(() => props.currentStage ? STAGE_DEFAULTS[props.currentStage] : undefined);
const hasDefaults = computed(() => !!stageDefaults.value);

const selectedEnemy = computed(() => {
    return enemyList.find(e => e.fixedId === props.monster._EmID);
});

const monsterName = computed(() => {
    if (!selectedEnemy.value) return 'Unknown';
    const names = selectedEnemy.value.name;
    switch (locale.value) {
        case 'zh': return names.cn || names.en;
        case 'ja': return names.jp || names.en;
        default: return names.en;
    }
});

const enemyOptions = computed(() => {
    return enemyList
        .filter(e => e.name.en)
        .map(e => ({
            value: e.fixedId,
            label: locale.value === 'zh' ? (e.name.cn || e.name.en) :
                locale.value === 'ja' ? (e.name.jp || e.name.en) :
                    e.name.en
        }));
});

function updateField<K extends keyof MainTargetData>(field: K, value: MainTargetData[K]) {
    emit('update', props.index, { ...props.monster, [field]: value });
}

function updateBossRushField<K extends keyof BossRushParams>(field: K, value: BossRushParams[K]) {
    if (!props.bossRushParam) return;
    emit('updateBossRush', props.index, { ...props.bossRushParam, [field]: value });
}

function updateEmID(val: number) {
    emit('update', props.index, { ...props.monster, _EmID: val });
}



function updateDifficultyValue(val: string) {
    emit('update', props.index, {
        ...props.monster,
        _DifficultyRankId: { ...props.monster._DifficultyRankId, Value: val }
    });
}

const conditionValue1Label = computed(() => {
    switch (props.bossRushParam?._PopType) {
        case BossRushPopType.REMAIN_HP: return t('bossRush.labels.hpRemain');
        case BossRushPopType.HUNT_NUM_OR_TIME: return t('bossRush.labels.huntNum');
        default: return t('bossRush.condition1');
    }
});

const conditionValue2Label = computed(() => {
    switch (props.bossRushParam?._PopType) {
        case BossRushPopType.REMAIN_HP: return t('bossRush.labels.delay');
        case BossRushPopType.HUNT_NUM_OR_TIME: return t('bossRush.labels.timeLimit');
        default: return t('bossRush.condition2');
    }
});

const bossRushPopTypeOptions = computed(() => {
    return BOSS_RUSH_POP_TYPE_VALUES.map(value => ({
        label: t('bossRush.popTypes.' + BossRushPopType[value]),
        value: value
    }));
});
</script>

<template>
    <t-card :bordered="true" hover-shadow>
        <template #header>
            <div class="monster-header">
                <t-tag theme="primary" variant="light">#{{ index + 1 }}</t-tag>
                <span class="monster-name">{{ monsterName }}</span>
                <t-popconfirm :content="t('actions.confirm') + '?'" @confirm="emit('remove', index)">
                    <t-button theme="danger" variant="text" size="small">
                        <template #icon>
                            <DeleteIcon />
                        </template>
                        {{ t('monsters.removeMonster') }}
                    </t-button>
                </t-popconfirm>
            </div>
        </template>

        <t-form label-align="top">
            <t-row :gutter="[16, 12]">
                <t-col :span="6">
                    <t-form-item :label="t('monsters.monsterType')">
                        <t-select :value="monster._EmID" @change="updateEmID" :options="enemyOptions" filterable
                            :popup-props="{ overlayStyle: { width: '300px' } }" />
                    </t-form-item>
                </t-col>

                <t-col :span="6">
                    <t-form-item :label="t('monsters.difficulty')">
                        <div style="display: flex; width: 100%; gap: 8px; align-items: center;">
                            <!-- Difficulty Name hidden per user request, syncing automatically -->
                            <t-input :value="monster._DifficultyRankId.Value"
                                :placeholder="t('monsters.difficultyUUID')"
                                @change="(val: string | number) => updateDifficultyValue(val as string)"
                                style="flex: 1" />

                            <t-button variant="outline" theme="default"
                                @click="updateDifficultyValue('8749a106-3696-4bba-a267-ec0814c4ee46')">
                                {{ t('monsters.lowest') }}
                            </t-button>
                            <t-button variant="outline" theme="default"
                                @click="updateDifficultyValue('aa92e87f-9a58-4a8f-8613-c00ddb9e763a')">
                                {{ t('monsters.recommended') }}
                            </t-button>
                        </div>
                    </t-form-item>
                </t-col>

                <t-col :span="3">
                    <t-form-item :label="t('monsters.groupId')">
                        <t-input-number :value="monster._GroupID"
                            @change="(val: number) => updateField('_GroupID', val)" theme="normal" />
                    </t-form-item>
                </t-col>

                <t-col :span="3">
                    <t-form-item :label="t('monsters.fixedSize')">
                        <t-input-number :value="monster._FixedSize"
                            @change="(val: number) => updateField('_FixedSize', val)" theme="normal" />
                    </t-form-item>
                </t-col>

                <t-col :span="6">
                    <t-form-item :label="t('monsters.position')">
                        <t-input :value="monster._InitPos" @change="(val: string) => updateField('_InitPos', val)"
                            :disabled="!hasDefaults"
                            :placeholder="hasDefaults ? stageDefaults?.initPos : 'Disabled for this map'" />
                    </t-form-item>
                </t-col>

                <t-col :span="3">
                    <t-form-item>
                        <t-checkbox :checked="monster._IsUseRandomSize"
                            @change="(val: boolean) => updateField('_IsUseRandomSize', val)">
                            {{ t('monsters.randomSize') }}
                        </t-checkbox>
                    </t-form-item>
                </t-col>

                <template v-if="isBossRush && bossRushParam">
                    <t-col :span="12">
                        <t-divider align="left"
                            style="margin: 8px 0; font-size: 12px; color: var(--td-text-color-secondary)">
                            {{ t('bossRush.title') }}
                        </t-divider>
                    </t-col>

                    <t-col :span="6">
                        <t-form-item :label="t('bossRush.popType')">
                            <t-select :value="bossRushParam._PopType" :options="bossRushPopTypeOptions"
                                @change="(val: number) => updateBossRushField('_PopType', val)" />
                        </t-form-item>
                    </t-col>

                    <t-col :span="3">
                        <t-form-item :label="conditionValue1Label">
                            <t-input-number :value="bossRushParam._ConditionValue_1"
                                @change="(val: number) => updateBossRushField('_ConditionValue_1', val)"
                                theme="normal" />
                        </t-form-item>
                    </t-col>

                    <t-col :span="3">
                        <t-form-item :label="conditionValue2Label">
                            <t-input-number :value="bossRushParam._ConditionValue_2"
                                @change="(val: number) => updateBossRushField('_ConditionValue_2', val)"
                                theme="normal" />
                        </t-form-item>
                    </t-col>
                </template>
            </t-row>
        </t-form>
    </t-card>
</template>

<style scoped>
.monster-header {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.monster-name {
    flex: 1;
    font-weight: 600;
    font-size: 1rem;
}
</style>
