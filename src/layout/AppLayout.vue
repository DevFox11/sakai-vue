<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const route = useRoute();
import { useOrganizationsStore } from '@/stores/organizations';

const organizationsStore = useOrganizationsStore();
let timeout = null;

// Sincronizar cambios de tema con el backend (con debounce)
watch(layoutConfig, (newConfig) => {
    if (!organizationsStore.currentOrganization) return;
    
    // Evitar llamadas innecesarias si es la misma config que ya tiene la org
    const currentTheme = organizationsStore.currentOrganization.settings?.theme;
    if (JSON.stringify(newConfig) === JSON.stringify(currentTheme)) return;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        organizationsStore.updateSettings({ theme: newConfig });
    }, 1500); // Esperar 1.5s para agrupar cambios rápidos
}, { deep: true });

const home = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = computed(() => route.meta.breadcrumb);

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'layout-theme-dark': layoutConfig.darkTheme,
        'layout-theme-light': !layoutConfig.darkTheme
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <Breadcrumb v-if="breadcrumbItems" :home="home" :model="breadcrumbItems" class="mb-4">
                    <template #item="{ item, props }">
                        <router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to" custom>
                            <a :href="href" v-bind="props.action" @click="navigate">
                                <span v-if="item.icon" :class="item.icon" />
                                <span v-if="item.label">{{ item.label }}</span>
                            </a>
                        </router-link>
                        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                            <span v-if="item.label">{{ item.label }}</span>
                        </a>
                    </template>
                </Breadcrumb>
                <router-view></router-view>
            </div>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>
