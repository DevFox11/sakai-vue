import { computed, reactive, watch } from 'vue';

const STORAGE_KEY = 'layout_config';

// Intentar cargar configuración guardada
const savedConfig = localStorage.getItem(STORAGE_KEY);
const initialConfig = savedConfig ? JSON.parse(savedConfig) : {
    preset: 'Aura',
    primary: 'lime',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
};

const layoutConfig = reactive(initialConfig);

// Aplicar tema oscuro inicial si es necesario
if (layoutConfig.darkTheme) {
    document.documentElement.classList.add('app-dark');
}

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

// Guardar en localStorage cuando cambie
watch(layoutConfig, (newConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
}, { deep: true });

export function useLayout() {
    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle(event));
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
    };

    const toggleMenu = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    // Sincronización con backend (llamado desde AppConfigurator o Stores)
    const saveThemeToBackend = () => {
        return {
            theme: { ...layoutConfig }
        };
    };

    const loadThemeFromBackend = (settings) => {
        if (settings && settings.theme) {
            // Actualizar config con datos del backend si existen
            Object.assign(layoutConfig, settings.theme);

            // Aplicar modo oscuro si cambió
            if (layoutConfig.darkTheme) {
                document.documentElement.classList.add('app-dark');
            } else {
                document.documentElement.classList.remove('app-dark');
            }
        }
    };

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode,
        saveThemeToBackend,
        loadThemeFromBackend
    };
}
