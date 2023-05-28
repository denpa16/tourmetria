import Vue from 'vue';

// Если уже добавлен плагин в /config/plugins, сюда дублировать не нужно.
import Clickoutside from '~/directives/clickoutside';

Vue.directive('clickoutside', Clickoutside);
