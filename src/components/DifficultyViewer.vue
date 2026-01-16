<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { CopyIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { FilterValue } from 'tdesign-vue-next';
import difficultyData from '../assets/EmCommonDifficulty2.user.3.json';

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    'update:visible': [visible: boolean];
}>();

const { t } = useI18n();

interface DifficultyRow {
    uuid: string;
    rank: string;
    grade: number;
    health: number;
    attack: number;
    partsVital: number;
    stun: number;
}

// Filter value state for TDesign table
const filterValue = ref<FilterValue>({});

// Generate unique rank options for filter dropdown
const rankOptions = computed(() => {
    const ranks = [...new Set(tableData.value.map(item => item.rank))].sort((a, b) => Number(a) - Number(b));
    return ranks.map(r => ({ label: r, value: r }));
});

// Generate unique grade options for filter dropdown
const gradeOptions = computed(() => {
    const grades = [...new Set(tableData.value.map(item => item.grade))].sort((a, b) => a - b);
    return grades.map(g => ({ label: String(g), value: g }));
});

const columns = computed(() => [
    {
        colKey: 'rank',
        title: t('difficultyViewer.rank'),
        filter: {
            type: 'single',
            list: rankOptions.value,
            showConfirmAndReset: true
        }
    },
    {
        colKey: 'grade',
        title: t('difficultyViewer.grade'),
        filter: {
            type: 'single',
            list: gradeOptions.value,
            showConfirmAndReset: true
        }
    },
    { colKey: 'health', title: t('difficultyViewer.health') },
    { colKey: 'attack', title: t('difficultyViewer.attack') },
    { colKey: 'stun', title: t('difficultyViewer.stun') },
    { colKey: 'uuid', title: t('difficultyViewer.uuid'), ellipsis: true },
    { colKey: 'actions', title: t('difficultyViewer.action'), width: 80, fixed: 'right' as const }
]);

const tableData = computed<DifficultyRow[]>(() => {
    try {
        const root = difficultyData as any[];
        if (!root || root.length === 0) return [];

        const difficultyParam = root[0]["app.user_data.EmParamDifficulty2"];
        if (!difficultyParam) return [];

        const arrayContainer = difficultyParam["_DifficultyRateArray"];
        const arrayKey = Object.keys(arrayContainer).find(k => arrayContainer[k]["_DataArray"]);
        if (!arrayKey) return [];

        const rawList = arrayContainer[arrayKey]["_DataArray"];

        return rawList.map((item: any) => {
            const data = item["app.user_data.EmParamDifficulty2.cDifficultyRate"];
            if (!data) return null;

            let rankStr = data["_RewardRank"]?.["app.QuestDef.EM_REWARD_RANK_Serializable"]?.["_Value"] || "";
            const rankMatch = rankStr.match(/REWARD_RANK_(\d+)/);
            if (rankMatch) {
                rankStr = String(parseInt(rankMatch[1], 10));
            } else {
                const match = rankStr.match(/\](.*)$/);
                if (match) rankStr = match[1];
            }

            return {
                uuid: data["_InstanceGuid"],
                rank: rankStr,
                grade: data["_RewardGrade"],
                health: data["_Health"],
                attack: data["_Attack"],
                partsVital: data["_PartsVital"],
                stun: data["_Stun"]?.["app.user_data.EmParamDifficulty2.cBadConditionRate"]?.["_DefaultLimit"] || 0
            };
        }).filter((i: any) => i !== null);

    } catch (e) {
        console.error("Failed to parse difficulty data", e);
        return [];
    }
});

// Filtered data based on TDesign filter
const filteredTableData = computed(() => {
    return tableData.value.filter(item => {
        const matchRank = !filterValue.value.rank || item.rank === filterValue.value.rank;
        const matchGrade = !filterValue.value.grade || item.grade === filterValue.value.grade;
        return matchRank && matchGrade;
    });
});

const onFilterChange = (filters: FilterValue) => {
    filterValue.value = filters;
};

const onCopy = (uuid: string) => {
    navigator.clipboard.writeText(uuid).then(() => {
        MessagePlugin.success(t('difficultyViewer.uuidCopied'));
    });
};

const onClose = () => {
    emit('update:visible', false);
};
</script>

<template>
    <t-dialog :visible="visible" :footer="false" :header="t('difficultyViewer.title')" width="1000px" placement="center"
        @close="onClose">
        <t-table :data="filteredTableData" :columns="columns" row-key="uuid" :max-height="500"
            :filter-value="filterValue" @filter-change="onFilterChange" stripe hover>
            <template #uuid="{ row }">
                <t-tooltip :content="row.uuid" placement="top-left">
                    <code class="uuid-cell">{{ row.uuid }}</code>
                </t-tooltip>
            </template>
            <template #actions="{ row }">
                <t-button variant="text" shape="circle" @click="onCopy(row.uuid)">
                    <template #icon>
                        <CopyIcon />
                    </template>
                </t-button>
            </template>
        </t-table>
    </t-dialog>
</template>

<style scoped>
.uuid-cell {
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12px;
    color: var(--td-text-color-secondary);
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
