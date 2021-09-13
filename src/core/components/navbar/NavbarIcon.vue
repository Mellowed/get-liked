<template>
  <div
    class="navigation-icon-container"
    @mouseover="navigationIconColor = 'sideBarNavigatorIconOnHover'"
    @mouseleave="navigationIconColor = 'sideBarNavigatorIcon'"
    @mousedown="ItemSelected"
  >
    <!-- The white highlight selection bar on the left -->
    <div v-if="active" style="width: 2px; height:100%; background-color: white; position: relative"></div>
    <!-- The icon -->

    <v-tooltip open-delay="500" bottom>
      <template v-slot:activator="{on, attrs}">
        <v-icon
          v-bind="attrs"
          v-on="on"
          class="navigation-icon-center"
          :color="active ? 'sideBarNavigatorIconOnHover' : navigationIconColor"
          flat
          >{{ icon }}</v-icon
        >
      </template>
      <pre>{{ name }}</pre>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TwoColumns',
  components: {},
  props: {
    name: {
      type: String,
      default: '',
    },
    baseColour: {
      type: String,
      default: 'sideBarNavigatorIcon',
    },
    icon: {
      type: String,
      default: 'mdi mdi-checkbox-blank-circle-outline',
    },
    id: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    baseColour: function(newVal) {
      this.navigationIconColor = newVal;
    },
  },

  methods: {
    ItemSelected(e: MouseEvent): void {
      e.preventDefault();
      this.$emit('selected', this.id);
    },
  },
  data: () => ({
    navigationIconColor: 'sideBarNavigatorIcon',
  }),
});
</script>
<style>
.navigation-icon-center {
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.navigation-icon-container {
  height: 42px;
  display: flex;
  cursor: pointer;
}
</style>
