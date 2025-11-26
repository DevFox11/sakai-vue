<script setup>
import { ProductService } from '@/service/ProductService';
import { onMounted, ref } from 'vue';

const products = ref(null);

function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
});
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-6">
            <div>
                <div class="font-semibold text-xl text-surface-900 dark:text-white">Ventas Recientes</div>
                <p class="text-muted-color text-sm mt-1">Últimas transacciones de productos</p>
            </div>
            <div>
                <Button
                    icon="pi pi-ellipsis-v"
                    class="p-button-text p-button-plain p-button-rounded"
                    severity="secondary"
                ></Button>
            </div>
        </div>
        <DataTable
            :value="products"
            :rows="5"
            :paginator="true"
            responsiveLayout="scroll"
            :pt="{
                header: {
                    class: 'bg-primary text-white font-semibold',
                    style: 'background-color: var(--primary-color); color: white; border-radius: 6px 6px 0 0;'
                }
            }"
        >
            <Column style="width: 15%" header="Imagen">
                <template #body="slotProps">
                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" width="50" class="shadow rounded" />
                </template>
            </Column>
            <Column field="name" header="Nombre" :sortable="true" style="width: 35%"></Column>
            <Column field="price" header="Precio" :sortable="true" style="width: 35%">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.price) }}
                </template>
            </Column>
            <Column style="width: 15%" header="Ver">
                <template #body>
                    <Button
                        icon="pi pi-search"
                        type="button"
                        class="p-button-text p-button-rounded"
                        severity="primary"
                    ></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
