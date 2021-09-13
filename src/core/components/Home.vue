<template>
  <div style="height: 100%">
    <v-container>
      <v-row>
        <v-list dark subheader two-line>
          <v-card-title style="margin-left: 0px"> Youtube Music to Spotify </v-card-title>
          <v-divider style="margin-left: 10px; margin-right: 10px"></v-divider>
          <!-- Youtube Music -->
          <v-list-item>
            <!-- Checkbox -->
            <v-list-item-avatar>
              <pre>1)</pre>
            </v-list-item-avatar>
            <!-- Description -->
            <v-list-item-content>
              <v-list-item-title>Collect you tracks from Youtube Music</v-list-item-title>
              <v-list-item-subtitle>Choose to either login or scrape youtube music</v-list-item-subtitle>
            </v-list-item-content>

            <!-- Tooltip/btn -->
            <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark v-bind="attrs" v-on="on" icon>
                    <v-icon @click="goToGooglePage" color="grey lighten-1">mdi-youtube</v-icon>
                  </v-btn>
                </template>
                <pre>Go to the youtube music interface page  </pre>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
          <!-- Temporary playlist -->
          <v-list-item>
            <!-- Checkbox -->
            <v-list-item-avatar>
              <pre>2)</pre>
            </v-list-item-avatar>
            <!-- Description -->
            <v-list-item-content>
              <v-list-item-title>Youtube tracks will be added to the temporary playlist</v-list-item-title>
              <v-list-item-subtitle>View the tracks to be added to your spotify playlist</v-list-item-subtitle>
            </v-list-item-content>

            <!-- Tooltip/btn -->
            <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark v-bind="attrs" v-on="on" icon>
                    <v-icon @click="goToTempPlaylist" color="grey lighten-1">mdi-memory</v-icon>
                  </v-btn>
                </template>
                <pre>Go to the temporary playlist page  </pre>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <!-- Checkbox -->
            <v-list-item-avatar>
              <pre>3)</pre>
            </v-list-item-avatar>
            <!-- Description -->
            <v-list-item-content>
              <v-list-item-title>Link the tracks</v-list-item-title>
              <v-list-item-subtitle>Provide access to your spotify account and begin linking</v-list-item-subtitle>
            </v-list-item-content>

            <!-- Tooltip/btn -->
            <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark v-bind="attrs" v-on="on" icon>
                    <v-icon @click="goToSpotifyPage" color="grey lighten-1">mdi-spotify</v-icon>
                  </v-btn>
                </template>
                <pre>Go to the temporary playlist page  </pre>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <!-- Checkbox -->
            <v-list-item-avatar>
              <pre>4)</pre>
            </v-list-item-avatar>
            <!-- Description -->
            <v-list-item-content>
              <v-list-item-title>Create a new spotify playlist</v-list-item-title>
              <v-list-item-subtitle
                >Name and generate your new spotify playlist once the linking is complete</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <!-- Selected playlist -->
          <v-divider style="margin-left: 35px; width: 125px"></v-divider>
          <v-img
            style="bottom: 48px; height: 98px; position: absolute; left: 36px; width: 200px"
            contain
            src="icons/512iTitle.png"
          ></v-img>
        </v-list>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StoreApi from '../api/storeApi';

export default Vue.extend({
  name: 'Home',
  components: {},
  data: () => ({}),
  computed: {},
  methods: {
    goToGooglePage() {
      StoreApi.setItem('selectedPage', 1);
    },
    goToTempPlaylist() {
      StoreApi.setItem('selectedPage', 2);
    },
    goToSpotifyPage() {
      StoreApi.setItem('selectedPage', 3);
    },
  },
});
</script>
