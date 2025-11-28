<template>
  <Dialog
    v-model:visible="displayModal"
    modal
    header="Crear Nueva Organización"
    :style="{ width: '450px' }"
    :closable="true"
    :draggable="false"
    @hide="resetForm"
  >
    <form @submit.prevent="createOrganization">
      <div class="field mb-4">
        <label for="organizationName" class="block text-900 font-medium mb-2">Nombre de la Organización</label>
        <InputText
          id="organizationName"
          v-model="form.name"
          type="text"
          class="w-full"
          :class="{ 'p-invalid': errors.name }"
          placeholder="Ingresa el nombre de la organización"
          autofocus
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <div class="field mb-4">
        <label for="organizationSlug" class="block text-900 font-medium mb-2">Slug de la Organización</label>
        <InputText
          id="organizationSlug"
          v-model="form.slug"
          type="text"
          class="w-full"
          :class="{ 'p-invalid': errors.slug }"
          placeholder="Identificador único para la URL"
        />
        <small v-if="errors.slug" class="p-error">{{ errors.slug }}</small>
        <small class="block mt-2 text-muted-color">Este será el identificador único para acceder a tu organización en la plataforma</small>
      </div>

      <div class="flex justify-content-end gap-3 mt-6 pt-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeModal"
        />
        <Button
          type="submit"
          label="Crear Organización"
          icon="pi pi-check"
          class="p-button-primary"
          :loading="loading"
          :disabled="loading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axios';

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'created']);

// Store y router
const authStore = useAuthStore();
const router = useRouter();

// Refs
const displayModal = ref(false);
const loading = ref(false);

// Form data
const form = reactive({
  name: '',
  slug: ''
});

// Errors
const errors = reactive({
  name: '',
  slug: ''
});

// Watch para controlar la visibilidad del modal
watch(() => props.modelValue, (newValue) => {
  displayModal.value = newValue;
  if (newValue) {
    // Limpiar errores cuando se abre
    resetForm();
  }
});

// Watch para autogenerar slug cuando cambia el nombre
watch(() => form.name, (newName) => {
  if (newName && !form.slug) { // Solo si slug está vacío
    form.slug = newName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Reemplaza caracteres no alfanuméricos con guión
      .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
      .replace(/^-|-$/g, ''); // Elimina guiones al inicio o final
  }
});

// Actualizar el valor del prop cuando cambia el ref
watch(displayModal, (newValue) => {
  emit('update:modelValue', newValue);
});

// Función para validar el formulario
const validateForm = () => {
  let isValid = true;
  // Resetear errores
  errors.name = '';
  errors.slug = '';

  // Validar nombre
  if (!form.name || form.name.trim() === '') {
    errors.name = 'El nombre de la organización es requerido';
    isValid = false;
  } else if (form.name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
    isValid = false;
  }

  // Validar slug
  if (!form.slug || form.slug.trim() === '') {
    errors.slug = 'El slug es requerido';
    isValid = false;
  } else if (form.slug.length < 3) {
    errors.slug = 'El slug debe tener al menos 3 caracteres';
    isValid = false;
  } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
    errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    isValid = false;
  }

  return isValid;
};

// Función para crear la organización
const createOrganization = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const response = await apiClient.post('/organizations', {
      name: form.name.trim(),
      slug: form.slug.trim(),
      subscription_plan_id: 1 // Plan gratuito por defecto
    });

    // Mostrar mensaje de éxito
    // Aquí normalmente usarías PrimeVue Toast, pero no está importado
    console.log('Organización creada exitosamente:', response.data);

    // Resetear el formulario
    resetForm();

    // Emitir evento de creación
    emit('created', response.data);

    // Cerrar el modal
    closeModal();

    // Opcional: redirigir al dashboard
    router.push({ name: 'dashboard' });

  } catch (error) {
    console.error('Error creando organización:', error);

    // Mostrar error específico si viene del backend
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.detail && typeof errorData.detail === 'string') {
        alert(errorData.detail); // En producción usarías un toast
      } else if (Array.isArray(errorData.detail)) {
        const firstError = errorData.detail[0];
        alert(firstError.msg || 'Error al crear la organización');
      }
    } else {
      alert('Error al crear la organización. Inténtalo de nuevo.');
    }
  } finally {
    loading.value = false;
  }
};

// Función para resetear el formulario
const resetForm = () => {
  form.name = '';
  form.slug = '';
  errors.name = '';
  errors.slug = '';
};

// Función para cerrar el modal
const closeModal = () => {
  displayModal.value = false;
};
</script>