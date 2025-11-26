<script setup>
import ProgressBar from 'primevue/progressbar';
import { useLoading } from '@/composables/useLoading';

const { isLoading } = useLoading();
</script>

<template>
    <div v-if="isLoading" class="fixed top-0 left-0 w-full z-[9999]">
        <ProgressBar mode="indeterminate" style="height: 3px; border-radius: 0;" />
    </div>
</template>

<style scoped>
:deep(.p-progressbar) {
    background: transparent;
}
:deep(.p-progressbar-value) {
    background: var(--primary-color);
}
</style>
