<script setup>
import BestSellingWidget from '@/components/dashboard/BestSellingWidget.vue';
import NotificationsWidget from '@/components/dashboard/NotificationsWidget.vue';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget.vue';
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import { onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();
</script>

<template>
    <div class="px-4 pt-4">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-surface-900 dark:text-white">Panel de Control</h1>
            <p class="text-muted-color mt-2">Resumen de tu negocio y desempeño</p>
        </div>

        <div class="grid grid-cols-12 gap-6">
            <StatsWidget />

            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <RecentSalesWidget />
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <RevenueStreamWidget />
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <BestSellingWidget />
            </div>
            <div class="col-span-12 lg:col-span-6 xl:col-span-6">
                <NotificationsWidget />
            </div>
icationsWidget />
onsWidget />
        </div>
    </div>
</template>
