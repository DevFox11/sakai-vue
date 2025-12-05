<script setup>
import { ref, inject } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
});

const model = ref([
    {
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        to: '/'
    },
    {
        label: 'Comunicaciones',
        icon: 'pi pi-fw pi-comments',
        items: [
            { label: 'Mensajes', icon: 'pi pi-fw pi-envelope', to: '/pages/empty' },
            { label: 'Campañas', icon: 'pi pi-fw pi-send', to: '/pages/empty' }
        ]
    },
    {
        label: 'CRM',
        icon: 'pi pi-fw pi-sitemap',
        items: [
            { label: 'Leads y pipelines', icon: 'pi pi-fw pi-users', to: '/pages/prospectos' }
        ]
    },
    {
        label: 'Tareas',
        icon: 'pi pi-fw pi-check-square',
        to: '/pages/empty'
    },
    {
        label: 'Listas',
        icon: 'pi pi-fw pi-list',
        items: [
            { label: 'Contactos', icon: 'pi pi-fw pi-user', to: '/pages/empty' },
            { label: 'Empresas', icon: 'pi pi-fw pi-building', to: '/pages/empty' }
        ]
    },
    {
        label: 'IA y Automatización',
        icon: 'pi pi-fw pi-bolt',
        items: [
            { label: 'Flujos', icon: 'pi pi-fw pi-arrows-alt', to: '/pages/empty' },
            { label: 'Bots', icon: 'pi pi-fw pi-android', to: '/pages/empty' }
        ]
    },
    {
        label: 'Insights',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
            { label: 'Estadísticas', icon: 'pi pi-fw pi-chart-line', to: '/pages/estadisticasReportes' },
            { label: 'Reportes', icon: 'pi pi-fw pi-file', to: '/pages/empty' }
        ]
    },
    {
        label: 'WhatsApp Business',
        icon: 'pi pi-fw pi-whatsapp',
        to: '/pages/empty'
    }
]);
</script>

<template>
    <ul class="layout-menu" :class="{ 'collapsed': collapsed }">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" :collapsed="collapsed"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
    padding: 0 0.5rem;
    margin: 0;
    list-style-type: none;

    &.collapsed {
        padding: 0 0.25rem;
    }
}

.menu-separator {
    height: 1px;
    background: var(--surface-border);
    margin: 0.75rem 0.5rem;
}
</style>
