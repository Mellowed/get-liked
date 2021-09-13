<template>
  <v-app>
    <div style="height: 100%">
      <v-toolbar class="basic-toolbar" color="sideBarNavigator" dense height="32px" flat>
        <v-toolbar-items>
          <v-btn @click="goBack" icon color="white">
            <v-icon>mdi-menu-open</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-progress-linear
        :active="activeProgressBar"
        style="position: absolute; margin-left: 48px"
        indeterminate
        color="cyan"
      ></v-progress-linear>
      <v-divider color="black" />
      <!-- Page space is total height minus toolbar and spacer -->
      <div style="width: 100%; height: calc(100vh - 32px - 1px)">
        <v-row style="height: 100%; width: 100%; margin: 0px">
          <v-card height="100%" draggable="false" width="48px" flat tile color="sideBarNavigator" class="column-1">
            <NavBar>
              <template v-slot:navigationIcons>
                <template v-for="(item, index, key) in navigationIcons">
                  <NavigationIcon
                    :name="item.name"
                    :key="key"
                    :id="index"
                    :baseColour="index == 2 ? tracksUpdatedColour : ''"
                    :active="selectedItem == index"
                    @selected="itemSelected"
                    :icon="item.icon"
                  />
                </template>
              </template>
            </NavBar>
          </v-card>
          <v-card style="width: calc(100% - 48px)" draggable="false" flat tile color="editorBackground">
            <Home v-if="selectedItem == 0" style="height: 100%" />
            <Youtube v-if="selectedItem == 1" style="height: 100%" />
            <TrackTable v-show="selectedItem == 2" tracks="tracks" style="height: 100%; overflow-y: hidden" />
            <Spotify v-show="selectedItem == 3" style="height: 100%; overflow-y: hidden" />
          </v-card>
        </v-row>
      </div>
    </div>
    <!-- Notifications -->
    <v-snackbar v-model="notificationBar" :timeout="10000">
      {{ notification }}
      <template v-slot:action="{attrs}">
        <v-btn color="blue" text v-bind="attrs" @click="notificationBar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import TrackTable from '@/core/components/TrackTable.vue';
import StoreApi from '@/core/api/storeApi';
import NavBar from '@/core/components/navbar/Navbar.vue';
import NavigationIcon from '@/core/components/navbar/NavbarIcon.vue';
import Youtube from '@/core/components/Youtube.vue';
import Spotify from '@/core/components/Spotify.vue';
import Home from '@/core/components/Home.vue';

export default Vue.extend({
  name: 'App',
  components: {NavBar, NavigationIcon, TrackTable, Youtube, Spotify, Home},
  data: () => ({
    tracksUpdatedColour: '',
    notificationBar: false,
    navigationIcons: [
      {name: 'Home', icon: 'mdi-view-dashboard'},
      {name: 'Youtube Music Interface', icon: 'mdi-youtube'},
      {name: 'Temporary Playlist', icon: 'mdi-memory'},
      {name: 'Spotify Interface', icon: 'mdi-spotify'},
    ],
  }),
  computed: {
    notification(): string {
      // Get the last item in the array
      return StoreApi.getState().notifications.slice(-1)[0];
    },
    selectedItem: {
      get(): number {
        return StoreApi.getState().selectedPage;
      },
      set(value: number) {
        StoreApi.setItem('selectedPage', value);
      },
    },
    activeProgressBar(): boolean {
      return StoreApi.getState().progressBarActive;
    },
    tracks(): Array<any> {
      return StoreApi.getState().tracks;
    },
  },

  watch: {
    tracks(newCount) {
      this.tracksUpdatedColour = 'sideBarNavigatorIcon';
      if (newCount.length > 0) {
        Vue.nextTick(() => {
          this.tracksUpdatedColour = 'blue';
        });
      }
    },
    // Enable the snackbar when a change in the notificationsBox is detected
    notification: {
      handler: function (newValue) {
        if (newValue !== '') {
          this.notificationBar = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    goBack(): void {
      switch (StoreApi.getState().selectedPage) {
        case 1:
          StoreApi.setItem('authentication.google.hasAccess', false);
          StoreApi.setItem('ytMusic.selectedMethod', '');
          break;
        case 3:
          StoreApi.setItem('authentication.spotify.hasAccess', false);
          StoreApi.setItem('spotify.selectedMethod', '');
          break;

        default:
          break;
      }
    },
    itemSelected(val: number): void {
      this.selectedItem = val;
    },
  },
});
</script>

<style>
html {
  width: 600px;
  height: 600px;
  overflow-y: hidden !important;
}

.basic-toolbar .v-toolbar__content {
  padding: 0px !important;
}

/* Custom scrollbar */

/* width */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
