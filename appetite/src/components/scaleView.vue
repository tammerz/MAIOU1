<template>
  <Page :actionBarHidden="isCard">
    <ActionBar>
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      <customActionbar />
    </ActionBar>
    <GridLayout rows="auto, *, auto, auto,*" columns="*" :class="!isCard ? 'open-card wrapper' : ''">
      <FlexboxLayout v-if="!isCard" row="0" col="0" colSpan="2" justifyContent="flex-end" alignItems="center" class="body2">
        <Label v-if="connected == true" :text="String.fromCharCode(0x25cf) + ' ' + $GN.live" class="link-button" color="red" />
        <Label v-if="connected == false" :text="String.fromCharCode(0x23f8) + ' ' + $GN.lastKnown" class="link-button" />
        <Label v-if="connected == 'error' " :text="String.fromCharCode(0x26A0) + ' ' + $GN.productError" class="link-button" color="red" />
      </FlexboxLayout>

      <GridLayout row="2" columns="*" rows="auto, *, *,auto">
        <Label row="1" col="0" :text="displayWeight" class="weight-text" />

        <GridLayout row="2" col="0" width="95%" height="30" :columns="progress" class="progressbar">
          <StackLayout col="0" class="progressbar-value"></StackLayout>
        </GridLayout>

        <FlexboxLayout v-if="isCard" row="3" col="0" justifyContent="flex-end">
          <Button :text="$GN.more + ' ' + String.fromCharCode(0x276f)" class="body link-button" />
        </FlexboxLayout>
      </GridLayout>

      <GridLayout v-if="!isCard" row="3" columns="*,*" rows="*,*,20,*" class="p-y-20">
        <Button row="0" col="0" :text="$GN.tare" class="fine-button" @tap="sendAction('tare')" :isEnabled="!loadStatus" />

        <Button row="0" col="1" :text="$GN.reset" class="fine-button" @tap="sendAction('resetToInit')" :isEnabled="!loadStatus" />

        <Button row="1" col="0" :text="$GN.feed" colSpan="2" class="fine-button" @tap="decoy" :isEnabled="!loadStatus" />

        <FlexboxLayout row="3" col="0" colSpan="2" justifyContent="flex-end">
          <Button :text="$GN.settings + ' ' + String.fromCharCode(0x276f)" class="body link-button" @tap="goToSettingsView" />
        </FlexboxLayout>

        <ActivityIndicator v-show="loadStatus" row="0" col="0" rowSpan="3" colSpan="2" busy="true"></ActivityIndicator>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
// Utils
import customActionbar from "@/components/utils/customActionbar.vue";

// Components / Pages
import settingsView from "@/components/settingsView.vue";

export default {
  name: "scaleView",
  components: {
    customActionbar,
  },
  props: {
    isCard: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      animatedWeight: 0,
      percent: "50*,50*",
    };
  },
  methods: {
    decoy() {
      alert({
        title: "Feature pending.",
        message: "Soon™",
        okButtonText: "😡 K",
      });
    },
    sendAction(name) {
      this.$store.dispatch("sendAction", { name });
    },

    goToSettingsView() {
      this.$navigateTo(settingsView, {
        transition: "slideLeft",
        curve: "easeIn"
      });
    },
  },
  computed: {
    weight() {
      return Math.max(0, this.$store.getters.get_weight / 1000).toFixed(3);
    },

    maxWeight() {
      return this.$store.getters.get_maxWeight;
    },

    displayWeight() {
      return this.weight + " Kg";
    },

    progress() {
      var percent = ((this.weight * 1000) / this.maxWeight) * 100;
      return percent + "*," + (100 - percent) + "*";
    },

    actionStatus() {
      return this.$store.getters.get_actionStatus;
    },

    connected() {
      return this.$store.getters.get_connected;
    },

    loadStatus() {
      return this.$store.getters.get_loadStatus;
    },
  },
};
</script>

<style scoped>
.weight-text {
  text-align: center;
  font-size: 50;
  font-weight: 500;
  height: 100%;
}
.progressbar {
  background: #3d464e;
  border-radius: 5;
  border-width: 2;
  border-color: #3d464e;
}
.progressbar-value {
  background: #d7af85;
  border-radius: 4 0 0 4;
}
</style>
