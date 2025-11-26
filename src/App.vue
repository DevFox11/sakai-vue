<script setup>
import Toast from 'primevue/toast';
import GlobalLoading from '@/components/GlobalLoading.vue';
import { useLayout } from '@/layout/composables/layout';
import { onMounted } from 'vue';

const { isDarkTheme } = useLayout();

onMounted(() => {
    if (isDarkTheme.value) {
        document.documentElement.classList.add('app-dark');
    }
});
</script>

<template>
    <GlobalLoading />
    <router-view />
    <Toast />
</template>

<style scoped></style>
