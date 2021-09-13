import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        toolbar: '#ffffff',
        explorerBackground: '#252526',
        editorBackground: '#1e1e1e',
        editorForeground: '#e5e5e5',
        activityBarBadgeBackground: '#555555',
        sideBarNavigator: '#323232',
        sideBarNavigatorIcon: '#888181',
        sideBarNavigatorIconOnHover: '#ffffff',
        sideBarTitleBackground: '#333333',
        sideBarTitleForeground: '#e5e5e5',
        // Vuetify general
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },

      dark: {
        toolbar: '#424242',
        explorerBackground: '#252526',
        editorBackground: '#1e1e1e',
        editorForeground: '#e5e5e5',
        activityBarBadgeBackground: '#555555',
        sideBarNavigatorIcon: '#888181',
        sideBarNavigatorIconOnHover: '#ffffff',
        sideBarNavigator: '#323232',
        sideBarTitleBackground: '#333333',
        sideBarTitleForeground: '#e5e5e5',
        // Vuetify general
        primary: '#2196F3',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
