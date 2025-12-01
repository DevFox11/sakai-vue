<template>
  <div v-if="!organizationsStore.currentOrganizationId" class="grid grid-cols-12">
    <div class="col-span-12">
      <div class="card text-center py-12">
        <i class="pi pi-building text-6xl text-surface-300 mb-4"></i>
        <h3 class="text-2xl font-bold text-surface-900 dark:text-white mb-2">No hay organización seleccionada</h3>
        <p class="text-surface-600 dark:text-surface-400 mb-6">Por favor, seleccione una organización para acceder a las funcionalidades de CRM</p>
        <Button
          label="Seleccionar Organización"
          icon="pi pi-building"
          @click="goToNoOrganization"
          severity="primary"
        />
      </div>
    </div>
  </div>

  <div v-else class="grid grid-cols-12 gap-6">
    <!-- Estadísticas de Leads -->
    <!-- Header de Gestión -->
    <div class="col-span-12">
      <div class="card mb-0">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div>
              <h2 class="text-xl font-bold text-surface-900 dark:text-white m-0">Gestión de Leads</h2>
              <p class="text-sm text-surface-500 m-0">Administra y da seguimiento a tus prospectos</p>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <Button
              label="Nuevo Lead"
              icon="pi pi-plus"
              @click="openCreateLeadDialog"
              severity="primary"
              size="small"
            />
            <Button
              label="Filtros Avanzados"
              icon="pi pi-filter"
              @click="toggleAdvancedFilters"
              severity="secondary"
              outlined
              size="small"
              :class="{ 'bg-primary-50 border-primary-200 text-primary-700': showAdvancedFilters }"
            />
            <Button
              label="Segmentación"
              icon="pi pi-cog"
              @click="openSegmentationDialog"
              severity="help"
              outlined
              size="small"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas estilo Dashboard -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-surface-500 font-medium mb-4">Total Leads</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats.totalLeads }}</div>
          </div>
          <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-list text-blue-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-primary font-medium">Global </span>
        <span class="text-surface-500">registrados en el sistema</span>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-surface-500 font-medium mb-4">Nuevos Hoy</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats.newToday }}</div>
          </div>
          <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-calendar-plus text-green-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">+{{ stats.newToday }} </span>
        <span class="text-surface-500"> desde el último día</span>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-surface-500 font-medium mb-4">Contactados</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats.contacted }}</div>
          </div>
          <div class="flex items-center justify-center bg-indigo-100 dark:bg-indigo-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-comments text-indigo-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-indigo-500 font-medium">En seguimiento </span>
        <span class="text-surface-500">activo</span>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-surface-500 font-medium mb-4">Oportunidades</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats.opportunities }}</div>
          </div>
          <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-star text-orange-500 !text-xl"></i>
          </div>
        </div>
        <span class="text-orange-500 font-medium">Alta prioridad </span>
        <span class="text-surface-500">para cierre</span>
      </div>
    </div>

    <!-- Dialogo de Filtros Avanzados -->
    <Dialog 
      v-model:visible="showAdvancedFilters" 
      modal 
      header="Filtros Avanzados" 
      :style="{ width: '90vw', maxWidth: '800px' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    >
      <div class="grid grid-cols-12 gap-6 pt-4">
        <!-- Filtros de Fecha -->
        <div class="col-span-12">
          <Fieldset legend="Rango de Fechas" :toggleable="false">
            <template #legend>
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-primary-500"></i>
                <span class="font-semibold">Rango de Fechas</span>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Desde
                </label>
                <DatePicker
                  v-model="advancedFilters.created_after"
                  dateFormat="dd/mm/yy"
                  class="w-full"
                  showIcon
                  placeholder="Fecha inicial"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Hasta
                </label>
                <DatePicker
                  v-model="advancedFilters.created_before"
                  dateFormat="dd/mm/yy"
                  class="w-full"
                  showIcon
                  placeholder="Fecha final"
                />
              </div>
            </div>
          </Fieldset>
        </div>

        <!-- Parámetros UTM -->
        <div class="col-span-12">
          <Fieldset legend="Parámetros UTM" :toggleable="false">
            <template #legend>
              <div class="flex items-center gap-2">
                <i class="pi pi-chart-line text-primary-500"></i>
                <span class="font-semibold">Parámetros UTM</span>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Fuente
                </label>
                <InputText
                  v-model="advancedFilters.utm_source"
                  placeholder="utm_source"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Campaña
                </label>
                <InputText
                  v-model="advancedFilters.utm_campaign"
                  placeholder="utm_campaign"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Medio
                </label>
                <InputText
                  v-model="advancedFilters.utm_medium"
                  placeholder="utm_medium"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Término
                </label>
                <InputText
                  v-model="advancedFilters.utm_term"
                  placeholder="utm_term"
                  class="w-full"
                />
              </div>
            </div>
          </Fieldset>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Limpiar"
            icon="pi pi-times"
            @click="clearAdvancedFilters"
            severity="secondary"
            outlined
          />
          <Button
            label="Aplicar Filtros"
            icon="pi pi-check"
            @click="applyAdvancedFilters"
            severity="primary"
          />
        </div>
      </template>
    </Dialog>

    <!-- Tabla de Leads con Filtros Integrados -->
    <div class="col-span-12">
      <div class="card">
        <DataTable
          :value="leads"
          v-model:selection="selectedLeads"
          v-model:filters="leadsFilters"
          :paginator="true"
          :rows="rows"
          dataKey="id"
          :loading="loadingLeads"
          filterDisplay="menu"
          :globalFilterFields="['name', 'email', 'company', 'phone']"
          showGridlines
        >
          <template #header>
            <div class="flex justify-between">
              <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" outlined @click="clearFilters()" />
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="leadsFilters['global'].value" placeholder="Buscar leads..." />
              </IconField>
            </div>
          </template>
          <template #empty> No se encontraron leads. </template>
          <template #loading> Cargando leads... </template>
          
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          
          <Column field="name" header="Nombre" style="min-width: 12rem" sortable>
            <template #body="{ data }">
              <div class="font-medium">{{ data.name }}</div>
              <div class="text-sm text-surface-500">{{ data.email }}</div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre" />
            </template>
          </Column>
          
          <Column field="company" header="Empresa" style="min-width: 10rem" sortable>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Buscar empresa" />
            </template>
          </Column>
          
          <Column field="status" header="Estado" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
            <template #filter="{ filterModel }">
              <Select v-model="filterModel.value" :options="statusOptions" placeholder="Seleccionar" showClear>
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="getStatusSeverity(slotProps.option)" />
                </template>
              </Select>
            </template>
          </Column>
          
          <Column field="stage_id" header="Etapa" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              <span class="p-tag" :style="{ backgroundColor: data.stage_color || '#6b7280' }">
                {{ data.stage_name }}
              </span>
            </template>
            <template #filter="{ filterModel }">
              <Select 
                v-model="filterModel.value" 
                :options="stages" 
                optionLabel="name" 
                optionValue="id"
                placeholder="Seleccionar" 
                showClear
              >
                <template #option="slotProps">
                  <span class="p-tag" :style="{ backgroundColor: slotProps.option.color || '#6b7280' }">
                    {{ slotProps.option.name }}
                  </span>
                </template>
              </Select>
            </template>
          </Column>
          
          <Column field="owner_id" header="Asignado" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ data.owner_name }}
            </template>
            <template #filter="{ filterModel }">
              <Select 
                v-model="filterModel.value" 
                :options="owners" 
                optionLabel="name" 
                optionValue="id"
                placeholder="Seleccionar" 
                showClear
              />
            </template>
          </Column>
          
          <Column field="created_at" header="Creado" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ formatDate(data.created_at) }}
            </template>
          </Column>
          
          <Column header="Acciones" style="min-width: 10rem">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                @click="viewLead(data)"
              />
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="editLead(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="confirmDeleteLead(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Diálogo de segmentación -->
    <Dialog
      v-model:visible="segmentationDialog"
      header="Segmentación de Leads"
      :modal="true"
      :closable="false"
      :style="{ width: '90vw', maxWidth: '700px' }"
    >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre de la segmentación</label>
          <InputText
            v-model="segmentationForm.name"
            placeholder="Nombre descriptivo para este grupo"
            class="w-full"
          />
        </div>
        <div class="col-span-12">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Regla de segmentación</label>
          <div class="field-radiobutton">
            <RadioButton v-model="segmentationForm.ruleType" inputId="rule_and" value="AND" />
            <label for="rule_and">TODAS las condiciones deben cumplirse</label>
          </div>
          <div class="field-radiobutton">
            <RadioButton v-model="segmentationForm.ruleType" inputId="rule_or" value="OR" />
            <label for="rule_or">CUALQUIER condición puede cumplirse</label>
          </div>
        </div>
        <div class="col-span-12">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Condiciones</label>
          <div class="flex flex-wrap gap-2 mb-3">
            <div
              v-for="(condition, index) in segmentationForm.conditions"
              :key="index"
              class="p-2 bg-surface-100 dark:bg-surface-800 rounded flex items-center"
            >
              <span>{{ condition.field }} {{ condition.operator }} {{ condition.value }}</span>
              <Button
                icon="pi pi-times"
                size="small"
                severity="danger"
                text
                rounded
                class="ml-2"
                @click="removeCondition(index)"
              />
            </div>
          </div>
          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-4">
              <Dropdown
                v-model="newCondition.field"
                :options="conditionFields"
                placeholder="Campo"
                class="w-full"
              />
            </div>
            <div class="col-span-3">
              <Dropdown
                v-model="newCondition.operator"
                :options="conditionOperators"
                placeholder="Operador"
                class="w-full"
              />
            </div>
            <div class="col-span-4">
              <InputText
                v-model="newCondition.value"
                placeholder="Valor"
                class="w-full"
              />
            </div>
            <div class="col-span-1">
              <Button
                icon="pi pi-plus"
                @click="addCondition"
                class="w-full"
              />
            </div>
          </div>
        </div>
        <div class="col-span-12">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Leads que coinciden</label>
          <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded">
            <span class="font-medium">{{ matchingLeadsCount }}</span> leads coinciden con esta segmentación
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          label="Cancelar"
          severity="secondary"
          @click="hideSegmentationDialog"
          outlined
        />
        <Button
          label="Guardar Segmentación"
          @click="saveSegmentation"
          severity="primary"
        />
      </div>
    </Dialog>

    <!-- Diálogo para crear/editar lead -->
    <Dialog 
      v-model:visible="leadDialog" 
      :header="leadDialogMode === 'create' ? 'Crear Nuevo Lead' : 'Editar Lead'" 
      :modal="true" 
      :closable="false"
      :style="{ width: '90vw', maxWidth: '600px' }"
    >
      <form @submit.prevent="saveLead">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="name" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre *</label>
            <InputText 
              id="name" 
              v-model="leadForm.name" 
              type="text" 
              class="w-full" 
              required
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="email" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
            <InputText 
              id="email" 
              v-model="leadForm.email" 
              type="email" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="phone" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Teléfono</label>
            <InputText 
              id="phone" 
              v-model="leadForm.phone" 
              type="tel" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="company" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Empresa</label>
            <InputText 
              id="company" 
              v-model="leadForm.company" 
              type="text" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="notes" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Notas</label>
            <Textarea 
              id="notes" 
              v-model="leadForm.notes" 
              rows="3" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="status" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Estado</label>
            <Dropdown 
              id="status" 
              v-model="leadForm.status" 
              :options="statusOptions" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="stage_id" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Etapa</label>
            <Dropdown 
              id="stage_id" 
              v-model="leadForm.stage_id" 
              :options="stages" 
              optionLabel="name" 
              optionValue="id"
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="owner_id" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Asignado a</label>
            <Dropdown 
              id="owner_id" 
              v-model="leadForm.owner_id" 
              :options="owners" 
              optionLabel="name" 
              optionValue="id"
              class="w-full"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            @click="hideLeadDialog" 
            outlined
          />
          <Button 
            label="Guardar" 
            type="submit" 
            severity="primary"
          />
        </div>
      </form>
    </Dialog>
    
    <!-- Confirmación de eliminación -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import crmService from '@/service/crm/crmService';
import apiClient from '@/api/axios';
import { useOrganizationsStore } from '@/stores/organizations';

// Función simple de debounce para evitar importar lodash
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const router = useRouter();

const toast = useToast();
const confirm = useConfirm();
const organizationsStore = useOrganizationsStore();

// Variables de estado
const leads = ref([]);
const selectedLeads = ref([]);
const totalLeads = ref(0);
const first = ref(0);
const rows = ref(10);

// Estadísticas
const stats = ref({
  totalLeads: 0,
  newToday: 0,
  contacted: 0,
  opportunities: 0
});

// Filtros para DataTable
const leadsFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  company: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  stage_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  owner_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});

// Filtros antiguos (mantener para filtros avanzados si se necesitan)
const filters = ref({
  search: '',
  status: null,
  stage: null,
  owner: null,
  tags: [],
  created_after: null,
  created_before: null,
  utm_source: null,
  utm_campaign: null
});

// Filtros avanzados
const advancedFilters = ref({
  created_after: null,
  created_before: null,
  utm_source: '',
  utm_campaign: '',
  utm_medium: '',
  utm_term: ''
});

// Control de UI
const showAdvancedFilters = ref(false);
const segmentationDialog = ref(false);
const loadingLeads = ref(false);

// Variables para segmentación
const segmentationForm = ref({
  name: '',
  ruleType: 'AND', // 'AND' o 'OR'
  conditions: []
});

const newCondition = ref({
  field: null,
  operator: null,
  value: ''
});

const conditionFields = ref([
  { label: 'Estado', value: 'status' },
  { label: 'Etapa', value: 'stage' },
  { label: 'Asignado a', value: 'owner' },
  { label: 'Fuente UTM', value: 'utm_source' },
  { label: 'Campaña UTM', value: 'utm_campaign' },
  { label: 'Empresa', value: 'company' }
]);

const conditionOperators = ref([
  { label: 'Igual a', value: '=' },
  { label: 'Diferente de', value: '!=' },
  { label: 'Contiene', value: 'contains' },
  { label: 'Mayor que', value: '>' },
  { label: 'Menor que', value: '<' }
]);

const matchingLeadsCount = ref(0);

// Diálogo de lead
const leadDialog = ref(false);
const leadDialogMode = ref('create'); // 'create' o 'edit'
const leadForm = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  status: 'nuevo',
  stage_id: null,
  owner_id: null
});

// Opciones para dropdowns
const statusOptions = ref(['nuevo', 'contactado', 'oportunidad', 'ganado', 'perdido']);
const stageOptions = ref([]);
const ownerOptions = ref([]);
const tagOptions = ref(['Caliente', 'Cálido', 'Frío', 'VIP']);
const stages = ref([]);
const owners = ref([]);

// Cargar datos iniciales
onMounted(async () => {
  if (!organizationsStore.currentOrganizationId) {
    // Si no hay organización seleccionada, mostrar un error o redirigir
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No hay organización seleccionada. Por favor, seleccione una organización.',
      life: 5000
    });
    return;
  }

  await loadStats();
  await loadStages();
  await loadOwners();
  await loadLeads();
});

// Función para aplicar filtros con debounce
const debouncedSearch = debounce(() => {
  applyFilters();
}, 500);

// Funciones de UI
const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const openSegmentationDialog = () => {
  segmentationDialog.value = true;
};

// Funciones
const loadLeads = async () => {
  loadingLeads.value = true;
  try {
    if (!organizationsStore.currentOrganizationId) {
      throw new Error('No hay organización seleccionada');
    }

    const params = {
      skip: first.value,
      limit: rows.value,
      search: filters.value.search || undefined,
      status: filters.value.status || undefined,
      stage_id: filters.value.stage || undefined,
      owner_id: filters.value.owner || undefined,
    };

    // Añadir filtros avanzados si existen
    if (filters.value.created_after) {
      params.created_after = formatDateForAPI(filters.value.created_after);
    }
    if (filters.value.created_before) {
      params.created_before = formatDateForAPI(filters.value.created_before);
    }
    if (filters.value.utm_source) {
      params.utm_source = filters.value.utm_source;
    }
    if (filters.value.utm_campaign) {
      params.utm_campaign = filters.value.utm_campaign;
    }

    const response = await crmService.getLeads(organizationsStore.currentOrganizationId, params);
    leads.value = response;
    // En una implementación real, totalLeads se obtendría de los headers o de una llamada separada
    totalLeads.value = response.length;
  } catch (error) {
    console.error('Error cargando leads:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'No se pudieron cargar los leads',
      life: 3000
    });
  } finally {
    loadingLeads.value = false;
  }
};

const loadStats = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) {
      throw new Error('No hay organización seleccionada');
    }

    const allLeads = await crmService.getLeads(organizationsStore.currentOrganizationId);

    stats.value.totalLeads = allLeads.length;

    // Calcular leads nuevos hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    stats.value.newToday = allLeads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      leadDate.setHours(0, 0, 0, 0);
      return leadDate.getTime() === today.getTime();
    }).length;

    // Calcular leads contactados
    stats.value.contacted = allLeads.filter(lead =>
      lead.status === 'contactado' ||
      lead.status === 'oportunidad' ||
      lead.status === 'ganado'
    ).length;

    // Calcular oportunidades
    stats.value.opportunities = allLeads.filter(lead =>
      lead.status === 'oportunidad' ||
      lead.status === 'ganado'
    ).length;

  } catch (error) {
    console.error('Error cargando estadísticas:', error);
    if (error.message !== 'No hay organización seleccionada') {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las estadísticas',
        life: 3000
      });
    }
  }
};

const goToNoOrganization = () => {
  // Redirigir al usuario a la página de selección/creación de organización
  router.push('/no-organization');
};

const applyFilters = async () => {
  if (!organizationsStore.currentOrganizationId) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No hay organización seleccionada. Por favor, seleccione una organización.',
      life: 5000
    });
    return;
  }

  first.value = 0; // Reiniciar a la primera página cuando se aplican filtros
  await loadLeads();
  await loadStats();
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

// Funciones de segmentación
const addCondition = () => {
  if (newCondition.value.field && newCondition.value.operator && newCondition.value.value) {
    segmentationForm.value.conditions.push({ ...newCondition.value });
    newCondition.value = { field: null, operator: null, value: '' };

    // Actualizar conteo de leads coincidentes
    updateMatchingLeadsCount();
  }
};

const removeCondition = (index) => {
  segmentationForm.value.conditions.splice(index, 1);
  updateMatchingLeadsCount();
};

const updateMatchingLeadsCount = async () => {
  // En una implementación real, haríamos una llamada API para contar los leads coincidentes
  // Por ahora, usamos una lógica simple de frontend
  let count = 0;
  if (leads.value && segmentationForm.value.conditions.length > 0) {
    for (const lead of leads.value) {
      let matches = true;

      for (const condition of segmentationForm.value.conditions) {
        let leadValue;
        switch (condition.field) {
          case 'status':
            leadValue = lead.status;
            break;
          case 'stage':
            leadValue = lead.stage_name;
            break;
          case 'owner':
            leadValue = lead.owner_name;
            break;
          case 'utm_source':
            leadValue = lead.utm_source;
            break;
          case 'utm_campaign':
            leadValue = lead.utm_campaign;
            break;
          case 'company':
            leadValue = lead.company;
            break;
          default:
            leadValue = lead[condition.field];
        }

        let conditionMet = false;
        switch (condition.operator) {
          case '=':
            conditionMet = leadValue === condition.value;
            break;
          case '!=':
            conditionMet = leadValue !== condition.value;
            break;
          case 'contains':
            conditionMet = leadValue && leadValue.toLowerCase().includes(condition.value.toLowerCase());
            break;
          case '>':
            conditionMet = leadValue > condition.value;
            break;
          case '<':
            conditionMet = leadValue < condition.value;
            break;
        }

        if (segmentationForm.value.ruleType === 'AND') {
          matches = matches && conditionMet;
        } else { // OR
          matches = matches || conditionMet;
        }
      }

      if (matches) {
        count++;
      }
    }
  }

  matchingLeadsCount.value = count;
};

const hideSegmentationDialog = () => {
  segmentationDialog.value = false;
  // Resetear el formulario
  segmentationForm.value = {
    name: '',
    ruleType: 'AND',
    conditions: []
  };
  matchingLeadsCount.value = 0;
};

const saveSegmentation = async () => {
  try {
    // En una implementación real, guardaríamos la segmentación en el backend
    // Por ahora, simplemente mostramos una notificación
    toast.add({
      severity: 'success',
      summary: 'Segmentación guardada',
      detail: `La segmentación "${segmentationForm.value.name}" ha sido guardada`,
      life: 3000
    });

    hideSegmentationDialog();
  } catch (error) {
    console.error('Error guardando segmentación:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la segmentación',
      life: 3000
    });
  }
};

const loadStages = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) {
      throw new Error('No hay organización seleccionada');
    }

    const stagesData = await crmService.getStages(organizationsStore.currentOrganizationId);
    stages.value = stagesData;
    stageOptions.value = stagesData.map(stage => stage.name);
  } catch (error) {
    console.error('Error cargando etapas:', error);
    if (error.message !== 'No hay organización seleccionada') {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las etapas',
        life: 3000
      });
    }
  }
};

const loadOwners = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) {
      throw new Error('No hay organización seleccionada');
    }

    // Obtener miembros de la organización para asignar leads
    const response = await apiClient.get('/organizations/' + organizationsStore.currentOrganizationId + '/members', {
      headers: {
        'X-Organization-ID': organizationsStore.currentOrganizationId
      }
    });
    owners.value = response.data;
    ownerOptions.value = response.data.map(owner => owner.name);
  } catch (error) {
    console.error('Error cargando propietarios:', error);
    if (error.message !== 'No hay organización seleccionada') {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los propietarios',
        life: 3000
      });
    }
  }
};

const openCreateLeadDialog = () => {
  leadDialogMode.value = 'create';
  leadForm.value = {
    id: null,
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    status: 'nuevo',
    stage_id: stages.value.length > 0 ? stages.value[0].id : null,
    owner_id: null
  };
  leadDialog.value = true;
};

const editLead = (lead) => {
  leadDialogMode.value = 'edit';
  leadForm.value = { ...lead };
  leadDialog.value = true;
};

const viewLead = (lead) => {
  // Redirigir a la vista detallada del lead
  // router.push(`/leads/${lead.id}`);
  console.log('Ver lead:', lead);
};

const saveLead = async () => {
  try {
    if (leadDialogMode.value === 'create') {
      await crmService.createLead(leadForm.value, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead creado', life: 3000 });
    } else {
      await crmService.updateLead(leadForm.value.id, leadForm.value, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead actualizado', life: 3000 });
    }

    await loadLeads();
    hideLeadDialog();
  } catch (error) {
    console.error('Error guardando lead:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.response?.data?.detail || 'No se pudo guardar el lead', 
      life: 3000 
    });
  }
};

const hideLeadDialog = () => {
  leadDialog.value = false;
};

const confirmDeleteLead = (lead) => {
  confirm.require({
    message: `¿Está seguro que desea eliminar el lead ${lead.name}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await crmService.deleteLead(lead.id, organizationsStore.currentOrganizationId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead eliminado', life: 3000 });
        await loadLeads();
      } catch (error) {
        console.error('Error eliminando lead:', error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo eliminar el lead', 
          life: 3000 
        });
      }
    }
  });
};

const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'nuevo': 'p-tag p-tag-info',
    'contactado': 'p-tag p-tag-warning',
    'oportunidad': 'p-tag p-tag-secondary',
    'ganado': 'p-tag p-tag-success',
    'perdido': 'p-tag p-tag-danger'
  };
  return statusClasses[status] || 'p-tag';
};

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  loadLeads();
};

// Función para limpiar filtros
const clearFilters = () => {
  leadsFilters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    company: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    stage_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    owner_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  };
};

// Función para obtener el severity del status (para Tag component)
const getStatusSeverity = (status) => {
  switch (status) {
    case 'nuevo':
      return 'info';
    case 'contactado':
      return 'primary';
    case 'oportunidad':
      return 'warn';
    case 'ganado':
      return 'success';
    case 'perdido':
      return 'danger';
    default:
      return null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Funciones para filtros avanzados
const clearAdvancedFilters = () => {
  advancedFilters.value = {
    created_after: null,
    created_before: null,
    utm_source: '',
    utm_campaign: '',
    utm_medium: '',
    utm_term: ''
  };
};

const applyAdvancedFilters = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay organización seleccionada',
        life: 3000
      });
      return;
    }

    loadingLeads.value = true;
    
    const params = {
      skip: 0,
      limit: rows.value
    };

    // Agregar filtros avanzados si existen
    if (advancedFilters.value.created_after) {
      params.created_after = formatDateForAPI(advancedFilters.value.created_after);
    }
    if (advancedFilters.value.created_before) {
      params.created_before = formatDateForAPI(advancedFilters.value.created_before);
    }
    if (advancedFilters.value.utm_source) {
      params.utm_source = advancedFilters.value.utm_source;
    }
    if (advancedFilters.value.utm_campaign) {
      params.utm_campaign = advancedFilters.value.utm_campaign;
    }
    if (advancedFilters.value.utm_medium) {
      params.utm_medium = advancedFilters.value.utm_medium;
    }
    if (advancedFilters.value.utm_term) {
      params.utm_term = advancedFilters.value.utm_term;
    }

    const response = await crmService.getLeads(organizationsStore.currentOrganizationId, params);

    leads.value = response;
    totalLeads.value = response.length;
    
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Se encontraron ${response.data.length} leads`,
      life: 3000
    });
  } catch (error) {
    console.error('Error aplicando filtros avanzados:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron aplicar los filtros',
      life: 3000
    });
  } finally {
    loadingLeads.value = false;
  }
};
</script>