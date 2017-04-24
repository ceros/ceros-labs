<template>
  <div id="app" class="container">
    <form>
      <h3>Experience URLs</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="desktopUrl">URL of Desktop Experience</label>
            <input type="text" class="form-control" id="desktopUrl" placeholder="http://view.ceros.com/example/desktop/" v-model.trim="desktopUrl">
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label for="mobileUrl">URL of Mobile Experience</label>
            <input type="text" class="form-control" id="mobileUrl" placeholder="http://view.ceros.com/example/mobile/" v-model.trim="mobileUrl">
          </div>
        </div>

      </div>

      <div class="row">

        <div class="col-md-6">
          <div class="form-group">
            <label for="redirectOn">Redirect Based on</label>
            <select id="redirectOn" class="form-control" v-model="breakOn">
              <option v-for="(item, key) in breakTypes" v-bind:value="key">{{ item }}</option>
            </select>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label for="viewPortWidth">View Port Width</label>
            <input type="number" class="form-control" v-bind:disabled="!requiresViewPort" id="viewPortWidth" placeholder="414" v-model.number="minViewPort" >
          </div>
        </div>

      </div>

      <div class="row">
        <div class="col-md-12">
          <h3>Tag Options</h3>
          <label class="checkbox-inline">
            <input type="checkbox" id="preservePageNumber" v-model="preservePage"> Preserve Ceros Page Number
          </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="preserveFragment" v-model="preserveFragment"> Preserve URL's Fragment (aka. Hash or Anchor)
          </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="preserveQuery" v-model="preserveQuery"> Preserve URL's Query String
          </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="forceHttps" v-model="forceHttps"> Force the URL to use HTTPS
          </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="redirectPreview" v-model="redirectPreview"> Redirect Preview Player
          </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="avoidReRedirects" v-model="avoidReRedirects"> Do not redirect back to referrer
          </label>

          <label class="checkbox-inline">
            <input type="checkbox" id="shouldLog" v-model="shouldLog"> Log debugging information to JavaScript Console
          </label>
        </div>
      </div>
    </form>

    <div class="row">
      <div class="col-md-6">
        <div v-show="mobileUrl && desktopUrl">
          <h4>Desktop Tag</h4>
          <redirect-tag
              type="desktop"
              v-bind:altVariantUrl="mobileUrl"
              v-bind:viewPortWidth="minViewPort"
              v-bind:breakOnType="breakOn"
              v-bind:preservePages="preservePage"
              v-bind:preserveFragment="preserveFragment"
              v-bind:preserveQuery="preserveQuery"
              v-bind:forceHttps="forceHttps"
              v-bind:redirectPreview="redirectPreview"
              v-bind:avoidReRedirects="avoidReRedirects"
              v-bind:shouldLog="shouldLog"
          ></redirect-tag>
        </div>
      </div>

      <div class="col-md-6">
        <div v-show="mobileUrl && desktopUrl">
          <h4>Mobile Tag</h4>
          <redirect-tag
              type="mobile"
              v-bind:altVariantUrl="desktopUrl"
              v-bind:viewPortWidth="minViewPort"
              v-bind:breakOnType="breakOn"
              v-bind:preservePages="preservePage"
              v-bind:preserveFragment="preserveFragment"
              v-bind:preserveQuery="preserveQuery"
              v-bind:forceHttps="forceHttps"
              v-bind:redirectPreview="redirectPreview"
              v-bind:avoidReRedirects="avoidReRedirects"
              v-bind:shouldLog="shouldLog"
          ></redirect-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import * as constants from './modules/constants';
  import RedirectTag from './components/RedirectTag.vue';

  export default {
    name: 'app',

    data () {
      return {
        mobileUrl: "",
        desktopUrl: "",

        breakOn: constants.BREAK_TYPE_VIEW_PORT,
        breakTypes: {
          [constants.BREAK_TYPE_VIEW_PORT]: "View Port",
          [constants.BREAK_TYPE_USER_AGENT]: "User Agent",
          [constants.BREAK_TYPE_TOUCH_EVENTS]: "Touch Event Support",
        },

        minViewPort: 414,

        forceHttps: false,
        preservePage: false,
        preserveFragment: true,
        preserveQuery: true,
        redirectPreview: false,
        avoidReRedirects: true,
        shouldLog: false
      }
    },

    computed: {
      requiresViewPort () {
          return (this.breakOn === constants.BREAK_TYPE_VIEW_PORT);
      }
    },

    components: {
      'redirect-tag': RedirectTag
    }
  }

</script>

<style>
  #app {
    padding-top: 10px;
  }

  h4 {
    padding-top: 10px;
  }
</style>
