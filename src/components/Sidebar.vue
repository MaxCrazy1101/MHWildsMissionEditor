<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import {
    AddIcon,
    FolderOpenIcon,
    SaveIcon,
    TranslateIcon,
    SearchIcon
} from 'tdesign-icons-vue-next';

const { t, locale } = useI18n();

const emit = defineEmits<{
    openFile: [];
    saveFile: [];
    newQuest: [];
    openDifficultyTool: [];
}>();

const recentFiles = ref<string[]>([]);

const languages = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
];

function changeLanguage(val: string) {
    locale.value = val;
}

const hintText = {
    en: 'Select both .raw.json & .ext.json',
    zh: '可同时选择 .raw.json 和 .ext.json',
    ja: '.raw.jsonと.ext.jsonを同時選択可能'
};
</script>

<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>🎮 MHWilds Editor</h2>
        </div>

        <div class="sidebar-actions">
            <t-button block variant="outline" @click="emit('newQuest')">
                <template #icon>
                    <AddIcon />
                </template>
                {{ t('sidebar.newQuest') }}
            </t-button>

            <t-button block variant="outline" @click="emit('openFile')">
                <template #icon>
                    <FolderOpenIcon />
                </template>
                {{ t('sidebar.open') }}
            </t-button>

            <t-tooltip :content="hintText[locale as keyof typeof hintText] || hintText.en">
                <p class="action-hint">💡 {{ hintText[locale as keyof typeof hintText] || hintText.en }}</p>
            </t-tooltip>

            <t-button block theme="primary" @click="emit('saveFile')">
                <template #icon>
                    <SaveIcon />
                </template>
                {{ t('sidebar.save') }}
            </t-button>
        </div>

        <t-divider />

        <div class="sidebar-tools">
            <t-button block variant="text" @click="emit('openDifficultyTool')">
                <template #icon>
                    <SearchIcon />
                </template>
                {{ t('sidebar.difficultyTool') }}
            </t-button>
        </div>

        <t-divider />

        <div class="sidebar-section">
            <h3>{{ t('sidebar.recent') }}</h3>
            <t-list v-if="recentFiles.length" :split="true">
                <t-list-item v-for="file in recentFiles" :key="file">
                    {{ file }}
                </t-list-item>
            </t-list>
            <t-tag v-else variant="light" theme="default">No recent files</t-tag>
        </div>

        <div class="sidebar-footer">
            <t-select :value="locale" @change="changeLanguage" :options="languages" size="small"
                :prefix-icon="() => h(TranslateIcon)" />
        </div>
    </aside>
</template>

<script lang="ts">
import { h } from 'vue';
export default {};
</script>

<style scoped>
.sidebar {
    width: 260px;
    background: var(--td-bg-color-container);
    border-right: 1px solid var(--td-component-stroke);
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--td-component-stroke);
}

.sidebar-header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--td-text-color-primary);
    font-weight: 600;
}

.sidebar-actions {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-hint {
    font-size: 0.75rem;
    color: var(--td-text-color-placeholder);
    text-align: center;
    margin: 4px 0;
}

.sidebar-section {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    min-height: 0;
    /* Important for flex child with overflow */
}

.sidebar-tools {
    padding: 16px;
    flex-shrink: 0;
}

.sidebar-section h3 {
    margin: 0 0 12px 0;
    font-size: 0.85rem;
    color: var(--td-text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--td-component-stroke);
}
</style>
