<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Pipeline Visualization -->
    <div class="col-span-12">
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-surface-900 dark:text-white">Pipeline de Ventas</h2>
          <Button 
            label="Nueva Etapa" 
            icon="pi pi-plus" 
            @click="openCreateStageDialog"
            severity="primary" 
          />
        </div>
        
        <!-- Visualización del pipeline -->
        <div class="flex overflow-x-auto py-4" v-if="stages.length > 0">
          <div 
            v-for="stage in stages" 
            :key="stage.id" 
            class="flex flex-col items-center px-4 min-w-[200px]"
          >
            <div 
              class="w-full p-4 rounded-lg border-2 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 mb-2"
              :style="{ borderColor: stage.color }"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold" :style="{ color: stage.color }">{{ stage.name }}</h3>
                <div class="flex gap-1">
                  <Button 
                    icon="pi pi-pencil" 
                    severity="info" 
                    text 
                    rounded 
                    size="small"
                    @click="editStage(stage)"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    severity="danger" 
                    text 
                    rounded 
                    size="small"
                    @click="confirmDeleteStage(stage)"
                  />
                </div>
              </div>
              <div class="text-sm text-surface-500 mb-2">{{ stage.probability }}% cierre</div>
              <div class="text-center text-2xl font-bold">{{ getLeadsInStage(stage.id) }}</div>
              <div class="text-center text-sm text-surface-500">leads</div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-surface-500">
          No hay etapas configuradas. Cree la primera etapa del pipeline.
        </div>
      </div>
    </div>

    <!-- Leads por etapa -->
    <div class="col-span-12">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Leads en el Pipeline</h3>
        
        <div class="flex overflow-x-auto pb-4" v-if="stages.length > 0">
          <div 
            v-for="stage in stages" 
            :key="stage.id" 
            class="flex-shrink-0 w-80 mr-4 border rounded-lg"
          >
            <div 
              class="p-3 rounded-t-lg text-white font-bold"
              :style="{ backgroundColor: stage.color }"
            >
              {{ stage.name }} ({{ getLeadsInStage(stage.id) }})
            </div>
            <div class="p-2 max-h-[500px] overflow-y-auto">
              <div 
                v-for="lead in getLeadsByStage(stage.id)" 
                :key="lead.id" 
                class="p-3 mb-2 border rounded cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                @click="viewLead(lead)"
              >
                <div class="font-medium">{{ lead.name }}</div>
                <div class="text-sm text-surface-500">{{ lead.email }}</div>
                <div class="text-sm text-surface-500">${{ lead.estimated_value || 'N/A' }}</div>
                <div class="mt-2 flex justify-end">
                  <Button 
                    label="Mover" 
                    size="small" 
                    @click.stop="openMoveLeadDialog(lead, stage.id)"
                    text
                  />
                </div>
              </div>
              
              <div v-if="getLeadsByStage(stage.id).length === 0" class="text-center py-4 text-surface-500">
                No hay leads en esta etapa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo para crear/editar etapa -->
    <Dialog 
      v-model:visible="stageDialog" 
      :header="stageDialogMode === 'create' ? 'Crear Nueva Etapa' : 'Editar Etapa'" 
      :modal="true" 
      :closable="false"
      class="w-11 md:w-4"
    >
      <form @submit.prevent="saveStage">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="stageName" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre *</label>
            <InputText 
              id="stageName" 
              v-model="stageForm.name" 
              type="text" 
              class="w-full" 
              required
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="probability" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Probabilidad de Cierre (%)</label>
            <InputNumber 
              id="probability" 
              v-model="stageForm.probability" 
              mode="decimal" 
              :min="0" 
              :max="100" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="orderPos" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Posición</label>
            <InputNumber 
              id="orderPos" 
              v-model="stageForm.order_pos" 
              mode="decimal" 
              :min="0" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="color" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Color</label>
            <ColorPicker v-model="stageForm.color" />
            <InputText 
              id="color" 
              v-model="stageForm.color" 
              type="text" 
              class="w-full mt-2"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            @click="hideStageDialog" 
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
    
    <!-- Diálogo para mover lead -->
    <Dialog 
      v-model:visible="moveLeadDialog" 
      header="Mover Lead de Etapa" 
      :modal="true" 
      :closable="false"
      class="w-11 md:w-4"
    >
      <p class="mb-4">Mover lead <strong>{{ leadToMove.name }}</strong> de <strong>{{ currentStageName }}</strong> a:</p>
      
      <div class="grid grid-cols-1 gap-3">
        <div 
          v-for="stage in stages.filter(s => s.id !== currentStageId)" 
          :key="stage.id"
          class="p-3 border rounded cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          @click="confirmMoveLead(stage.id)"
        >
          <div class="font-medium">{{ stage.name }}</div>
          <div class="text-sm text-surface-500">{{ stage.probability }}% cierre</div>
        </div>
      </div>
      
      <div class="flex justify-end gap-2 mt-6">
        <Button 
          label="Cancelar" 
          severity="secondary" 
          @click="hideMoveLeadDialog" 
          outlined
        />
      </div>
    </Dialog>
    
    <!-- Confirmación de eliminación -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import apiClient from '@/api/axios';
import { useOrganizationsStore } from '@/stores/organizations';
import { useRouter } from 'vue-router';

const toast = useToast();
const confirm = useConfirm();
const organizationsStore = useOrganizationsStore();
const router = useRouter();

// Variables de estado
const stages = ref([]);
const allLeads = ref([]);
const stageDialog = ref(false);
const stageDialogMode = ref('create');
const moveLeadDialog = ref(false);

// Formulario de etapa
const stageForm = ref({
  id: null,
  name: '',
  probability: 0,
  order_pos: 0,
  color: '#6b7280'
});

// Variables para mover lead
const leadToMove = ref({});
const currentStageId = ref(null);
const currentStageName = ref('');

// Cargar datos iniciales
onMounted(async () => {
  await loadStages();
  await loadAllLeads();
});

// Funciones
const loadStages = async () => {
  try {
    const response = await apiClient.get(`/leads/stages/`, {
      headers: {
        'X-Organization-ID': organizationsStore.currentOrganizationId
      }
    });
    stages.value = response.data.sort((a, b) => a.order_pos - b.order_pos);
  } catch (error) {
    console.error('Error cargando etapas:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las etapas', life: 3000 });
  }
};

const loadAllLeads = async () => {
  try {
    const response = await apiClient.get(`/leads/`, {
      headers: {
        'X-Organization-ID': organizationsStore.currentOrganizationId
      }
    });
    allLeads.value = response.data;
  } catch (error) {
    console.error('Error cargando leads:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los leads', life: 3000 });
  }
};

const getLeadsInStage = (stageId) => {
  return allLeads.value.filter(lead => lead.stage_id === stageId).length;
};

const getLeadsByStage = (stageId) => {
  return allLeads.value.filter(lead => lead.stage_id === stageId);
};

const openCreateStageDialog = () => {
  stageDialogMode.value = 'create';
  stageForm.value = {
    id: null,
    name: '',
    probability: 0,
    order_pos: stages.value.length > 0 ? Math.max(...stages.value.map(s => s.order_pos)) + 1 : 0,
    color: '#6b7280'
  };
  stageDialog.value = true;
};

const editStage = (stage) => {
  stageDialogMode.value = 'edit';
  stageForm.value = { ...stage };
  stageDialog.value = true;
};

const saveStage = async () => {
  try {
    if (stageDialogMode.value === 'create') {
      await apiClient.post('/leads/stages/', stageForm.value, {
        headers: {
          'X-Organization-ID': organizationsStore.currentOrganizationId
        }
      });
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Etapa creada', life: 3000 });
    } else {
      await apiClient.put(`/leads/stages/${stageForm.value.id}`, stageForm.value, {
        headers: {
          'X-Organization-ID': organizationsStore.currentOrganizationId
        }
      });
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Etapa actualizada', life: 3000 });
    }
    
    await loadStages();
    hideStageDialog();
  } catch (error) {
    console.error('Error guardando etapa:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.response?.data?.detail || 'No se pudo guardar la etapa', 
      life: 3000 
    });
  }
};

const hideStageDialog = () => {
  stageDialog.value = false;
};

const confirmDeleteStage = (stage) => {
  confirm.require({
    message: `¿Está seguro que desea eliminar la etapa ${stage.name}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await apiClient.delete(`/leads/stages/${stage.id}`, {
          headers: {
            'X-Organization-ID': organizationsStore.currentOrganizationId
          }
        });
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Etapa eliminada', life: 3000 });
        await loadStages();
      } catch (error) {
        console.error('Error eliminando etapa:', error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo eliminar la etapa', 
          life: 3000 
        });
      }
    }
  });
};

const openMoveLeadDialog = (lead, stageId) => {
  leadToMove.value = lead;
  currentStageId.value = stageId;
  
  const currentStage = stages.value.find(s => s.id === stageId);
  currentStageName.value = currentStage ? currentStage.name : 'Desconocida';
  
  moveLeadDialog.value = true;
};

const hideMoveLeadDialog = () => {
  moveLeadDialog.value = false;
};

const confirmMoveLead = async (newStageId) => {
  try {
    await apiClient.put('/leads/move', {
      lead_id: leadToMove.value.id,
      stage_id: newStageId
    }, {
      headers: {
        'X-Organization-ID': organizationsStore.currentOrganizationId
      }
    });
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead movido de etapa', life: 3000 });
    await loadAllLeads();
    hideMoveLeadDialog();
  } catch (error) {
    console.error('Error moviendo lead:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo mover el lead', 
      life: 3000 
    });
  }
};

const viewLead = (lead) => {
  // Redirigir a la vista detallada del lead
  router.push(`/leads/${lead.id}`);
};
</script>