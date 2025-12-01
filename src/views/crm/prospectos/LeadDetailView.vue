<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Información principal del lead -->
    <div class="col-span-12 lg:col-span-8">
      <div class="card">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-surface-900 dark:text-white">{{ lead.name }}</h2>
            <div class="text-surface-500">{{ lead.email }} • {{ lead.phone }}</div>
          </div>
          <div class="flex gap-2">
            <Button 
              label="Editar" 
              icon="pi pi-pencil" 
              @click="openEditLeadDialog"
              severity="info" 
            />
            <Button 
              label="Eliminar" 
              icon="pi pi-trash" 
              @click="confirmDeleteLead"
              severity="danger" 
            />
          </div>
        </div>
        
        <div class="grid grid-cols-12 gap-4 mb-6">
          <div class="col-span-12 md:col-span-6">
            <h3 class="font-semibold mb-2">Información de Contacto</h3>
            <div class="flex flex-col gap-2">
              <div><i class="pi pi-envelope text-surface-500 mr-2"></i>{{ lead.email || 'No proporcionado' }}</div>
              <div><i class="pi pi-phone text-surface-500 mr-2"></i>{{ lead.phone || 'No proporcionado' }}</div>
              <div><i class="pi pi-building text-surface-500 mr-2"></i>{{ lead.company || 'No proporcionado' }}</div>
            </div>
          </div>
          
          <div class="col-span-12 md:col-span-6">
            <h3 class="font-semibold mb-2">Detalles del Lead</h3>
            <div class="flex flex-col gap-2">
              <div>
                <span class="text-surface-500">Estado:</span> 
                <span :class="getStatusBadgeClass(lead.status)" class="ml-2">{{ lead.status }}</span>
              </div>
              <div>
                <span class="text-surface-500">Etapa:</span> 
                <span class="p-tag ml-2" :style="{ backgroundColor: currentStage?.color || '#6b7280' }">
                  {{ currentStage?.name || 'No asignada' }}
                </span>
              </div>
              <div>
                <span class="text-surface-500">Asignado a:</span> 
                <span class="ml-2">{{ getOwnerName(lead.owner_id) || 'Nadie' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Notas</h3>
          <Textarea 
            v-model="lead.notes" 
            rows="4" 
            class="w-full"
            @blur="updateNotes"
          />
        </div>
        
        <!-- UTM Information -->
        <div v-if="hasUtmData" class="mb-6">
          <h3 class="font-semibold mb-2">Información UTM</h3>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6 lg:col-span-3">
              <div class="text-surface-500">Fuente</div>
              <div>{{ lead.utm_source || 'N/A' }}</div>
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-3">
              <div class="text-surface-500">Medio</div>
              <div>{{ lead.utm_medium || 'N/A' }}</div>
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-3">
              <div class="text-surface-500">Campaña</div>
              <div>{{ lead.utm_campaign || 'N/A' }}</div>
            </div>
            <div class="col-span-12 md:col-span-6 lg:col-span-3">
              <div class="text-surface-500">Término</div>
              <div>{{ lead.utm_term || 'N/A' }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actividades del lead -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Historial de Actividades</h3>
          <Button 
            label="Agregar Nota" 
            icon="pi pi-plus" 
            @click="openAddNoteDialog"
            severity="secondary" 
            size="small"
          />
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="activity in activities" 
            :key="activity.id" 
            class="p-4 border rounded-lg"
          >
            <div class="flex justify-between">
              <div class="font-medium">
                <i :class="getActivityIcon(activity.type)" class="mr-2"></i>
                {{ getActivityTypeLabel(activity.type) }}
              </div>
              <div class="text-sm text-surface-500">{{ formatDate(activity.created_at) }}</div>
            </div>
            <div class="mt-2 text-sm" v-if="activity.detail">
              <div v-if="activity.type === 'note'">
                <strong v-if="activity.detail.title">{{ activity.detail.title }}:</strong>
                {{ activity.detail.note }}
              </div>
              <div v-else-if="activity.type === 'stage_change'">
                Cambió de "{{ getStageName(activity.detail.previous_stage_id) }}" a "{{ getStageName(activity.detail.new_stage_id) }}"
              </div>
              <div v-else-if="activity.type === 'owner_change'">
                Asignado de "{{ getOwnerName(activity.detail.previous_owner_id) }}" a "{{ getOwnerName(activity.detail.new_owner_id) }}"
              </div>
              <div v-else>
                {{ activity.detail | formatDetail }}
              </div>
            </div>
            <div class="mt-2 text-xs text-surface-500">
              por {{ activity.created_by_name || 'Sistema' }}
            </div>
          </div>
          
          <div v-if="activities.length === 0" class="text-center py-4 text-surface-500">
            No hay actividades registradas para este lead
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar con acciones -->
    <div class="col-span-12 lg:col-span-4">
      <div class="card">
        <h3 class="font-bold mb-4">Acciones Rápidas</h3>
        
        <!-- Cambiar etapa -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Cambiar Etapa</label>
          <div class="flex gap-2">
            <Dropdown 
              v-model="newStageId" 
              :options="stages" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Seleccionar etapa"
              class="flex-1"
            />
            <Button 
              label="Mover" 
              @click="moveLeadToStage"
              :disabled="!newStageId"
            />
          </div>
        </div>
        
        <!-- Asignar a agente -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Asignar a</label>
          <div class="flex gap-2">
            <Dropdown 
              v-model="newOwnerId" 
              :options="owners" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Seleccionar agente"
              class="flex-1"
            />
            <Button 
              label="Asignar" 
              @click="assignLeadToAgent"
              :disabled="!newOwnerId"
            />
          </div>
        </div>
        
        <!-- Agregar nota rápida -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Agregar Nota Rápida</label>
          <div class="flex gap-2">
            <Textarea 
              v-model="quickNote" 
              rows="2" 
              placeholder="Escribe una nota..."
              class="flex-1"
            />
          </div>
          <Button 
            label="Agregar" 
            @click="addQuickNote"
            :disabled="!quickNote.trim()"
            class="mt-2 w-full"
          />
        </div>
        
        <!-- Información adicional -->
        <div class="border-t pt-4 mt-4">
          <h4 class="font-semibold mb-2">Detalles Adicionales</h4>
          <div class="space-y-2 text-sm">
            <div>
              <span class="text-surface-500">Creado:</span> {{ formatDate(lead.created_at) }}
            </div>
            <div>
              <span class="text-surface-500">Última actualización:</span> {{ formatDate(lead.updated_at) }}
            </div>
            <div>
              <span class="text-surface-500">Puntuación:</span> {{ lead.score || 0 }}
            </div>
            <div v-if="lead.visits_count">
              <span class="text-surface-500">Visitas:</span> {{ lead.visits_count }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Diálogo para editar lead -->
    <Dialog 
      v-model:visible="editLeadDialog" 
      header="Editar Lead" 
      :modal="true" 
      :closable="false"
      class="w-11 md:w-6"
    >
      <form @submit.prevent="updateLead">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="name" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre *</label>
            <InputText 
              id="name" 
              v-model="editForm.name" 
              type="text" 
              class="w-full" 
              required
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="email" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
            <InputText 
              id="email" 
              v-model="editForm.email" 
              type="email" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="phone" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Teléfono</label>
            <InputText 
              id="phone" 
              v-model="editForm.phone" 
              type="tel" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="company" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Empresa</label>
            <InputText 
              id="company" 
              v-model="editForm.company" 
              type="text" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="status" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Estado</label>
            <Dropdown 
              id="status" 
              v-model="editForm.status" 
              :options="statusOptions" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="stage_id" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Etapa</label>
            <Dropdown 
              id="stage_id" 
              v-model="editForm.stage_id" 
              :options="stages" 
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
            @click="hideEditLeadDialog" 
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
    
    <!-- Diálogo para agregar nota -->
    <Dialog 
      v-model:visible="addNoteDialog" 
      header="Agregar Nota" 
      :modal="true" 
      :closable="false"
      class="w-11 md:w-6"
    >
      <form @submit.prevent="saveNote">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="noteTitle" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Título</label>
            <InputText 
              id="noteTitle" 
              v-model="noteForm.title" 
              type="text" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="noteContent" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Contenido</label>
            <Textarea 
              id="noteContent" 
              v-model="noteForm.note" 
              rows="4" 
              class="w-full"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            @click="hideAddNoteDialog" 
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
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import crmService from '@/service/crm/crmService';
import apiClient from '@/api/axios';
import { useOrganizationsStore } from '@/stores/organizations';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const organizationsStore = useOrganizationsStore();

// Variables de estado
const leadId = ref(route.params.id);
const lead = ref({});
const activities = ref([]);
const stages = ref([]);
const owners = ref([]);
const currentStage = ref(null);

// Diálogos
const editLeadDialog = ref(false);
const addNoteDialog = ref(false);

// Formularios
const editForm = ref({});
const noteForm = ref({
  title: '',
  note: ''
});

// Acciones rápidas
const newStageId = ref(null);
const newOwnerId = ref(null);
const quickNote = ref('');

// Opciones
const statusOptions = ['nuevo', 'contactado', 'oportunidad', 'ganado', 'perdido'];

// Cargar datos iniciales
onMounted(async () => {
  await loadLead();
  await loadActivities();
  await loadStages();
  await loadOwners();
});

// Funciones
const loadLead = async () => {
  try {
    const leadData = await crmService.getLead(leadId.value, organizationsStore.currentOrganizationId);
    lead.value = leadData;
    
    // Encontrar la etapa actual
    if (stages.value.length > 0 && lead.value.stage_id) {
      currentStage.value = stages.value.find(s => s.id === lead.value.stage_id);
    }
  } catch (error) {
    console.error('Error cargando lead:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el lead', life: 3000 });
    router.push('/pages/prospectos'); // Volver a la lista si hay error
  }
};

const loadActivities = async () => {
  try {
    const activitiesData = await crmService.getLeadActivities(leadId.value, organizationsStore.currentOrganizationId);
    activities.value = activitiesData;
  } catch (error) {
    console.error('Error cargando actividades:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las actividades', life: 3000 });
  }
};

const loadStages = async () => {
  try {
    const stagesData = await crmService.getStages(organizationsStore.currentOrganizationId);
    stages.value = stagesData;
    
    // Actualizar la etapa actual si ya se cargó el lead
    if (lead.value && lead.value.stage_id) {
      currentStage.value = stages.value.find(s => s.id === lead.value.stage_id);
    }
  } catch (error) {
    console.error('Error cargando etapas:', error);
  }
};

const loadOwners = async () => {
  try {
    const response = await apiClient.get(`/organizations/${organizationsStore.currentOrganizationId}/members`, {
      headers: {
        'X-Organization-ID': organizationsStore.currentOrganizationId
      }
    });
    owners.value = response.data;
  } catch (error) {
    console.error('Error cargando propietarios:', error);
  }
};

const updateLead = async () => {
  try {
    await crmService.updateLead(leadId.value, editForm.value, organizationsStore.currentOrganizationId);
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead actualizado', life: 3000 });
    await loadLead();
    hideEditLeadDialog();
  } catch (error) {
    console.error('Error actualizando lead:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.response?.data?.detail || 'No se pudo actualizar el lead', 
      life: 3000 
    });
  }
};

const updateNotes = async () => {
  try {
    await crmService.updateLead(leadId.value, { notes: lead.value.notes }, organizationsStore.currentOrganizationId);
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Notas actualizadas', life: 3000 });
  } catch (error) {
    console.error('Error actualizando notas:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudieron actualizar las notas', 
      life: 3000 
    });
  }
};

const moveLeadToStage = async () => {
  try {
    await crmService.moveLead(leadId.value, newStageId.value, organizationsStore.currentOrganizationId);
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead movido de etapa', life: 3000 });
    await loadLead();
    await loadActivities();
    newStageId.value = null;
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

const assignLeadToAgent = async () => {
  try {
    await crmService.assignLead(leadId.value, newOwnerId.value, organizationsStore.currentOrganizationId);
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead asignado', life: 3000 });
    await loadLead();
    newOwnerId.value = null;
  } catch (error) {
    console.error('Error asignando lead:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo asignar el lead', 
      life: 3000 
    });
  }
};

const addQuickNote = async () => {
  try {
    await crmService.addLeadNote(leadId.value, quickNote.value, 'Nota rápida', organizationsStore.currentOrganizationId);
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Nota agregada', life: 3000 });
    quickNote.value = '';
    await loadActivities(); // Refrescar la lista de actividades
  } catch (error) {
    console.error('Error agregando nota:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo agregar la nota', 
      life: 3000 
    });
  }
};

const saveNote = async () => {
  try {
    await crmService.addLeadNote(leadId.value, noteForm.value.note, noteForm.value.title, organizationsStore.currentOrganizationId);
    
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Nota agregada', life: 3000 });
    hideAddNoteDialog();
    await loadActivities();
  } catch (error) {
    console.error('Error guardando nota:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo guardar la nota', 
      life: 3000 
    });
  }
};

const openEditLeadDialog = () => {
  editForm.value = { ...lead.value };
  editLeadDialog.value = true;
};

const hideEditLeadDialog = () => {
  editLeadDialog.value = false;
};

const openAddNoteDialog = () => {
  noteForm.value = { title: '', note: '' };
  addNoteDialog.value = true;
};

const hideAddNoteDialog = () => {
  addNoteDialog.value = false;
};

const confirmDeleteLead = () => {
  confirm.require({
    message: `¿Está seguro que desea eliminar el lead ${lead.value.name}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await crmService.deleteLead(leadId.value, organizationsStore.currentOrganizationId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead eliminado', life: 3000 });
        router.push('/pages/prospectos'); // Volver a la lista
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const getStageName = (stageId) => {
  const stage = stages.value.find(s => s.id === stageId);
  return stage ? stage.name : 'Desconocida';
};

const getOwnerName = (ownerId) => {
  if (!ownerId) return 'Nadie';
  const owner = owners.value.find(u => u.id === ownerId);
  return owner ? owner.name : 'Desconocido';
};

const getActivityIcon = (type) => {
  const icons = {
    'note': 'pi pi-sticky-note',
    'message': 'pi pi-comment',
    'call': 'pi pi-phone',
    'stage_change': 'pi pi-exchange',
    'owner_change': 'pi pi-user-plus',
    'system': 'pi pi-cog'
  };
  return icons[type] || 'pi pi-info-circle';
};

const getActivityTypeLabel = (type) => {
  const labels = {
    'note': 'Nota',
    'message': 'Mensaje',
    'call': 'Llamada',
    'stage_change': 'Cambio de Etapa',
    'owner_change': 'Cambio de Asignación',
    'system': 'Sistema'
  };
  return labels[type] || type;
};

const hasUtmData = () => {
  return lead.value.utm_source || 
         lead.value.utm_medium || 
         lead.value.utm_campaign || 
         lead.value.utm_term || 
         lead.value.utm_content;
};
</script>