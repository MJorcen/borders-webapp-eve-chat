<template>
  <GoogleMap
    :api-key="apiKey"
    style="width: 208px; height: 100px"
    mapId="a44bf139b94a600d"
    :center="{
      lat: props.position?.lat || 40.689247,
      lng: props.position?.lng || -74.044502,
    }"
    :zoom="15"
    :fullscreenControl="false"
    :mapTypeControl="false"
    :zoomControl="false"
    :streetViewControl="false"
  >
    <Marker
      :options="{
        position: {
          lat: props.position?.lat || 40.689247,
          lng: props.position?.lng || -74.044502,
        },
      }"
    />
  </GoogleMap>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { GoogleMap } from "vue3-google-map";

interface Prop {
  position: any;
  modelValue: any;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: {},
  position: {},
});

const apiKey = import.meta.env.VITE_APP_GOOGLE_MAP_KEY;

const emit = defineEmits(["update:modelValue"]);

// const center = { lat: 40.689247, lng: -74.044502 };
// const center2 = { lat: 40.689247, lng: -74.064604 };

// const markerOptions = { position: center };
// const pinOptions = { background: "#fdbf2d" };
</script>
<style lang="scss" scoped></style>
