<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { RewardItem } from '../types/quest';
import { AddIcon, DeleteIcon } from 'tdesign-icons-vue-next';

const { t } = useI18n();

const props = defineProps<{
    items: RewardItem[];
}>();

const emit = defineEmits<{
    update: [items: RewardItem[]];
}>();

const columns = [
    { colKey: 'itemId', title: () => t('rewards.itemId'), width: 100 },
    { colKey: 'itemName', title: () => t('rewards.itemName'), width: 200 },
    { colKey: 'minCount', title: () => t('rewards.minCount'), width: 100 },
    { colKey: 'maxCount', title: () => t('rewards.maxCount'), width: 100 },
    { colKey: 'probability', title: () => t('rewards.probability'), width: 120 },
    { colKey: 'operation', title: '', width: 80, fixed: 'right' as const }
];

function addItem() {
    const newItem: RewardItem = {
        itemId: 0,
        itemName: 'New Item',
        minCount: 1,
        maxCount: 1,
        probability: 100
    };
    emit('update', [...props.items, newItem]);
}

function updateItem(index: number, field: keyof RewardItem, value: string | number) {
    const updated = [...props.items];
    updated[index] = { ...updated[index], [field]: value };
    emit('update', updated);
}

function removeItem(index: number) {
    emit('update', props.items.filter((_, i) => i !== index));
}
</script>

<template>
    <t-card :bordered="true">
        <template #header>
            <div class="reward-header">
                <t-space>
                    <span>🎁</span>
                    <span>{{ t('rewards.title') }}</span>
                    <t-tag theme="primary">{{ items.length }} items</t-tag>
                </t-space>
                <t-button theme="primary" @click="addItem">
                    <template #icon>
                        <AddIcon />
                    </template>
                    {{ t('rewards.addItem') }}
                </t-button>
            </div>
        </template>

        <t-table :data="items" :columns="columns" row-key="index" :bordered="true" :stripe="true" size="medium">
            <template #itemId="{ row, rowIndex }">
                <t-input-number :value="row.itemId" @change="(val: number) => updateItem(rowIndex, 'itemId', val)"
                    theme="normal" size="small" />
            </template>

            <template #itemName="{ row, rowIndex }">
                <t-input :value="row.itemName" @change="(val: string) => updateItem(rowIndex, 'itemName', val)"
                    size="small" />
            </template>

            <template #minCount="{ row, rowIndex }">
                <t-input-number :value="row.minCount" @change="(val: number) => updateItem(rowIndex, 'minCount', val)"
                    theme="normal" size="small" :min="1" />
            </template>

            <template #maxCount="{ row, rowIndex }">
                <t-input-number :value="row.maxCount" @change="(val: number) => updateItem(rowIndex, 'maxCount', val)"
                    theme="normal" size="small" :min="1" />
            </template>

            <template #probability="{ row, rowIndex }">
                <t-input-number :value="row.probability"
                    @change="(val: number) => updateItem(rowIndex, 'probability', val)" theme="normal" size="small"
                    :min="0" :max="100" suffix="%" />
            </template>

            <template #operation="{ rowIndex }">
                <t-popconfirm content="Delete this item?" @confirm="removeItem(rowIndex)">
                    <t-button theme="danger" variant="text" size="small">
                        <template #icon>
                            <DeleteIcon />
                        </template>
                    </t-button>
                </t-popconfirm>
            </template>
        </t-table>

        <t-empty v-if="items.length === 0" description="No reward items" />
    </t-card>
</template>

<style scoped>
.reward-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
</style>
