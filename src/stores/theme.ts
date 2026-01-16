import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

type ThemeMode = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
    // 1. Initialize state from localStorage or default to 'auto'
    const mode = ref<ThemeMode>((localStorage.getItem('theme-mode') as ThemeMode) || 'system');

    // 2. Function to apply the theme to the DOM
    const applyTheme = (currentMode: ThemeMode) => {
        let effectiveMode = currentMode;

        if (currentMode === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveMode = systemDark ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('theme-mode', effectiveMode);
    };

    // 3. Watch for changes in mode and apply/persist
    watch(mode, (newMode) => {
        applyTheme(newMode);
        localStorage.setItem('theme-mode', newMode);
    }, { immediate: true });

    // 4. Handle system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        if (mode.value === 'system') {
            applyTheme('system');
        }
    });

    // 5. Action to set theme
    const setTheme = (newMode: ThemeMode) => {
        mode.value = newMode;
    };

    const nextTheme = () => {
        const order: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = order.indexOf(mode.value);
        const nextIndex = (currentIndex + 1) % order.length;
        setTheme(order[nextIndex]);
    };

    return {
        mode,
        setTheme,
        nextTheme
    };
});
