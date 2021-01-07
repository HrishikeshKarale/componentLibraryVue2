<script lang="ts">
import Vue from 'vue';
import { Component_library_vue2Sample } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    Component_library_vue2Sample,
  }
});
</script>

<template>
  <div id="app">
    <component_library_vue2-sample />
  </div>
</template>
