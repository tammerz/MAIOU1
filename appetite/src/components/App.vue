<template>
  <Frame class="ns-light" ref="mainFrame">
    <Page class="ns-light" @loaded="forceLightTheme">
      <ActionBar>
        <customActionbar />
      </ActionBar>

      <GridLayout columns="*" rows="auto, *, *" class="main-grid">
        <Frame id="scaleViewFrame" col="1" row="0" class="card" clipsToBounds="true" @tap="goToView('scaleView')">
          <scaleView :isCard="true" />
        </Frame>

        <Frame id="tipsViewFrame" col="1" row="1" class="card" clipsToBounds="true">
          <tipsView :isCard="true" />
        </Frame>

        <Frame id="feedViewFrame" col="1" row="2" class="card" clipsToBounds="true" @tap="goToView('feedView')">
          <feedView :isCard="true" />
        </Frame>
      </GridLayout>
    </Page>
  </Frame>
</template>

<script>
import Theme from "@nativescript/theme";

// Utils
import customActionbar from "@/components/utils/customActionbar.vue";

// Components / Pages
import scaleView from "@/components/scaleView.vue";
import tipsView from "@/components/tipsView.vue";
import feedView from "@/components/feedView.vue";


export default {
  components: {
    customActionbar,
    scaleView,
    tipsView,
    feedView,
  },
  data() {
    return {
    };
  },
  methods: {
    forceLightTheme() {
      Theme.setMode(Theme.Light);
    },

    goToView(target) {
      const transitionOptions = {
        transition: "slideLeft",
        curve: "easeIn",
        frame: this.$refs.mainFrame
      }
      switch (target) {
        case "scaleView":
          this.$navigateTo(scaleView, transitionOptions);
          break;
        case "tipsView":
          this.$navigateTo(tipsView, transitionOptions);
          break;
        case "feedView":
          this.$navigateTo(feedView, transitionOptions);
          break;
      }
    },
  },
};
</script>

<style scoped>
.main-grid {
  padding: 15;
}
.card {
  border-radius: 10;
  margin: 8 0;
  background-color: #c1d4d2;
  android-elevation: 5;
}

.card Page {
  background-color: transparent;
  padding: 10 5 0 5;
}

.black {
  background-color: #000000;
}
</style>
