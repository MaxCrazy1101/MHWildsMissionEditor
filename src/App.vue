<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { MessagePlugin } from 'tdesign-vue-next';
import Sidebar from './components/Sidebar.vue';
import QuestEditor from './components/QuestEditor.vue';
import DifficultyViewer from './components/DifficultyViewer.vue';

import type { QuestData, QuestRewardData } from './types/quest';
import { DEFAULT_QUEST_DATA, DEFAULT_REWARD_DATA } from './constants/defaultQuest';

const { t } = useI18n();

// Dynamic page title based on locale
watchEffect(() => {
  document.title = t('app.title');
});

const questData = ref<QuestData | null>(null);
const rewardData = ref<QuestRewardData | null>(null);
const currentFileName = ref<string>('');
const isLoading = ref(false);
const showDifficultyViewer = ref(false);

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function openFile() {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.raw.json,.ext.json';
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      isLoading.value = true;

      const fileArray = Array.from(files);
      const fileMap = new Map<string, { raw?: File; ext?: File }>();

      for (const file of fileArray) {
        let baseName: string;
        let type: 'raw' | 'ext' | 'unknown';

        if (file.name.endsWith('.raw.json')) {
          baseName = file.name.replace('.raw.json', '');
          type = 'raw';
        } else if (file.name.endsWith('.ext.json')) {
          baseName = file.name.replace('.ext.json', '');
          type = 'ext';
        } else {
          baseName = file.name.replace('.json', '');
          type = 'unknown';
        }

        if (!fileMap.has(baseName)) {
          fileMap.set(baseName, {});
        }

        const entry = fileMap.get(baseName)!;
        if (type === 'raw') {
          entry.raw = file;
        } else if (type === 'ext') {
          entry.ext = file;
        } else {
          const content = await readFileAsText(file);
          const data = JSON.parse(content);
          if (data._DataList) {
            entry.raw = file;
          } else if (data.rewardItems) {
            entry.ext = file;
          }
        }
      }

      let loadedCount = 0;
      for (const [baseName, pair] of fileMap) {
        if (pair.raw) {
          const content = await readFileAsText(pair.raw);
          questData.value = JSON.parse(content) as QuestData;
          currentFileName.value = baseName;
          loadedCount++;
        }

        if (pair.ext) {
          const content = await readFileAsText(pair.ext);
          rewardData.value = JSON.parse(content) as QuestRewardData;
          loadedCount++;
        }
      }

      isLoading.value = false;

      if (loadedCount > 0) {
        MessagePlugin.success(`Loaded ${loadedCount} file(s) successfully`);
      }
    };

    input.click();
  } catch (error) {
    console.error('Error opening file:', error);
    MessagePlugin.error('Failed to open file');
    isLoading.value = false;
  }
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function saveFile() {
  try {
    let savedCount = 0;

    if (questData.value) {
      const json = JSON.stringify(questData.value, null, 4);
      const filename = currentFileName.value ? `${currentFileName.value}.raw.json` : 'quest.raw.json';
      downloadFile(json, filename);
      savedCount++;
    }

    if (rewardData.value) {
      const json = JSON.stringify(rewardData.value, null, 4);
      const filename = currentFileName.value ? `${currentFileName.value}.ext.json` : 'quest.ext.json';
      downloadFile(json, filename);
      savedCount++;
    }

    if (savedCount > 0) {
      MessagePlugin.success(`Saved ${savedCount} file(s)`);
    } else {
      MessagePlugin.warning('No data to save');
    }
  } catch (error) {
    console.error('Error saving file:', error);
    MessagePlugin.error('Failed to save file');
  }
}

function newQuest() {
  questData.value = JSON.parse(JSON.stringify(DEFAULT_QUEST_DATA));
  rewardData.value = JSON.parse(JSON.stringify(DEFAULT_REWARD_DATA));
  currentFileName.value = '';
}

function updateQuest(quest: QuestData) {
  questData.value = quest;
}

function updateReward(reward: QuestRewardData) {
  rewardData.value = reward;
}
</script>

<template>
  <div class="app-container">
    <Sidebar @open-file="openFile" @save-file="saveFile" @new-quest="newQuest"
      @open-difficulty-tool="showDifficultyViewer = true" />

    <DifficultyViewer v-model:visible="showDifficultyViewer" />

    <main class="main-content">
      <t-loading :loading="isLoading" :text="t('app.loading')" size="large" show-overlay class="loading-container">
        <QuestEditor :quest-data="questData" :reward-data="rewardData" @update-quest="updateQuest"
          @update-reward="updateReward" />
      </t-loading>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--td-bg-color-page);
}

.loading-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ensure t-loading's internal wrapper is also full height */
.loading-container :deep(.t-loading__parent) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>