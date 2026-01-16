<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { CopyIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
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

const columns = computed(() => [
    { colKey: 'rank', title: t('difficultyViewer.rank'), width: 120 },
    { colKey: 'grade', title: t('difficultyViewer.grade'), width: 80 },
    { colKey: 'health', title: t('difficultyViewer.health'), width: 90 },
    { colKey: 'attack', title: t('difficultyViewer.attack'), width: 90 },
    { colKey: 'stun', title: t('difficultyViewer.stun'), width: 90 },
    { colKey: 'uuid', title: t('difficultyViewer.uuid'), width: 320 },
    { colKey: 'actions', title: t('difficultyViewer.action'), width: 80, fixed: 'right' }
]);

const tableData = computed<DifficultyRow[]>(() => {
    try {
        const root = difficultyData as any[];
        if (!root || root.length === 0) return [];

        const difficultyParam = root[0]["app.user_data.EmParamDifficulty2"];
        if (!difficultyParam) return [];

        const arrayContainer = difficultyParam["_DifficultyRateArray"];
        // The key is likely "ace.cInstanceGuidArray`1<app.user_data.EmParamDifficulty2.cDifficultyRate>"
        // But keys might vary or be specific. We can find the key that contains "_DataArray".
        const arrayKey = Object.keys(arrayContainer).find(k => arrayContainer[k]["_DataArray"]);
        if (!arrayKey) return [];

        const rawList = arrayContainer[arrayKey]["_DataArray"];

        return rawList.map((item: any) => {
            const data = item["app.user_data.EmParamDifficulty2.cDifficultyRate"];
            if (!data) return null;

            // Parse Reward Rank "[-1196666624]REWARD_RANK_01" -> "1"
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

const onCopy = (uuid: string) => {
    navigator.clipboard.writeText(uuid).then(() => {
        MessagePlugin.success(t('difficultyViewer.uuidCopied'));
    });
};

const onClose = () => {
    emit('update:visible', false);
};

const filterRank = ref('');
const filterGrade = ref('');

const filteredTableData = computed(() => {
    return tableData.value.filter(item => {
        const matchRank = !filterRank.value || item.rank.includes(filterRank.value);
        const matchGrade = !filterGrade.value || String(item.grade).includes(filterGrade.value);
        return matchRank && matchGrade;
    });
});
</script>

<template>
    <t-dialog :visible="visible" :footer="false" :header="t('difficultyViewer.title')" width="900px" placement="center"
        @close="onClose">
        <div class="difficulty-viewer">
            <t-row :gutter="16" style="margin-bottom: 12px">
                <t-col :span="4">
                    <t-input v-model="filterRank" :placeholder="t('difficultyViewer.filterRank')" clearable />
                </t-col>
                <t-col :span="4">
                    <t-input v-model="filterGrade" :placeholder="t('difficultyViewer.filterGrade')" clearable />
                </t-col>
            </t-row>

            <t-table :data="filteredTableData" :columns="columns" row-key="uuid" :pagination="{ defaultPageSize: 10 }"
                stripe hover>
                <template #uuid="{ row }">
                    <span style="font-family: monospace; font-size: 12px;">{{ row.uuid }}</span>
                </template>
                <template #actions="{ row }">
                    <t-button variant="text" shape="circle" @click="onCopy(row.uuid)">
                        <template #icon>
                            <CopyIcon />
                        </template>
                    </t-button>
                </template>
            </t-table>
        </div>
    </t-dialog>
</template>

<style scoped>
.difficulty-viewer {
    max-height: 600px;
    overflow-y: auto;
}
</style>
