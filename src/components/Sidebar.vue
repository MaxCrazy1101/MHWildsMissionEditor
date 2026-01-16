<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import {
    AddIcon,
    FolderOpenIcon,
    SaveIcon,
    TranslateIcon,
    SearchIcon,
    LogoGithubIcon,
    LinkIcon,
    SunnyIcon,
    MoonIcon,
    DesktopIcon,
} from 'tdesign-icons-vue-next';
import { useThemeStore } from '../stores/theme';

const { t, locale } = useI18n();
const themeStore = useThemeStore();

const emit = defineEmits<{
    openFile: [];
    saveFile: [];
    newQuest: [];
    openDifficultyTool: [];
}>();

const languages = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
];

function changeLanguage(val: string) {
    locale.value = val;
}

</script>

<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>🎮 MHWilds Editor</h2>
        </div>

        <div class="sidebar-content">
            <div class="sidebar-group">
                <div class="group-title">{{ t('sidebar.project') }}</div>
                <div class="group-items">
                    <t-button block variant="text" @click="emit('newQuest')">
                        <template #icon>
                            <AddIcon />
                        </template>
                        {{ t('sidebar.newQuest') }}
                    </t-button>

                    <t-tooltip :content="t('sidebar.hint')" placement="right">
                        <t-button block variant="text" @click="emit('openFile')">
                            <template #icon>
                                <FolderOpenIcon />
                            </template>
                            {{ t('sidebar.open') }}
                        </t-button>
                    </t-tooltip>

                    <t-button block variant="text" @click="emit('saveFile')">
                        <template #icon>
                            <SaveIcon />
                        </template>
                        {{ t('sidebar.save') }}
                    </t-button>
                </div>
            </div>

            <t-divider class="group-divider" />

            <div class="sidebar-group">
                <div class="group-title">{{ t('sidebar.tools') }}</div>
                <div class="group-items">
                    <t-button block variant="text" @click="emit('openDifficultyTool')">
                        <template #icon>
                            <SearchIcon />
                        </template>
                        {{ t('sidebar.difficultyTool') }}
                    </t-button>
                </div>
            </div>
        </div>

        <div class="sidebar-footer">

            <div class="footer-actions">
                <div class="external-links">
                    <t-button variant="text" shape="square" href="https://github.com/MaxCrazy1101/MHWildsMissionEditor"
                        target="_blank">
                        <template #icon>
                            <LogoGithubIcon />
                        </template>
                    </t-button>
                    <t-button variant="text" shape="square"
                        href="https://www.nexusmods.com/monsterhunterwilds/mods/1096" target="_blank"
                        v-bind="{ title: 'Nexus Mods' }">
                        <template #icon>
                            <LinkIcon />
                        </template>
                    </t-button>
                </div>

                <div class="theme-switcher">
                    <t-tooltip :content="t(`theme.${themeStore.mode}`)" placement="top">
                        <t-button variant="text" shape="square" @click="themeStore.nextTheme()">
                            <template #icon>
                                <SunnyIcon v-if="themeStore.mode === 'light'" />
                                <MoonIcon v-else-if="themeStore.mode === 'dark'" />
                                <DesktopIcon v-else />
                            </template>
                        </t-button>
                    </t-tooltip>
                </div>

                <div class="lang-selector">
                    <t-select :value="locale" @change="changeLanguage" :options="languages" size="small" borderless>
                        <template #prefixIcon>
                            <TranslateIcon />
                        </template>
                    </t-select>
                </div>
            </div>
        </div>
    </aside>
</template>



<style scoped>
.sidebar {
    width: 260px;
    background: var(--td-bg-color-container);
    border-right: 1px solid var(--td-component-stroke);
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-x: hidden;
}

.sidebar-header {
    padding: 24px 20px;
}

.sidebar-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--td-text-color-primary);
    font-weight: 700;
    letter-spacing: -0.5px;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 0;
}

.sidebar-group {
    padding: 0 12px;
}

.group-title {
    font-size: 0.75rem;
    color: var(--td-text-color-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    margin-bottom: 4px;
}

.group-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* Override TDesign button alignment */
.group-items :deep(.t-button__text) {
    text-align: left;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.group-items :deep(.t-button) {
    justify-content: flex-start;
    padding-left: 12px;
}

.group-divider {
    margin: 16px 24px;
    opacity: 0.6;
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--td-component-stroke);
    background: var(--td-bg-color-secondarycontainer);
}



.footer-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.external-links {
    display: flex;
    gap: 4px;
}

.lang-selector {
    width: 90px;
}

.lang-selector :deep(.t-input) {
    background: transparent;
}
</style>
