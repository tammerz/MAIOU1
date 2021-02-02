<template>
  <Page>
    <ActionBar>
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      <customActionbar />
    </ActionBar>
    <ScrollView>
      <StackLayout class="open-card wrapper body2">
        <Label :text="$GN.settings" class="muted-6" />
        <StackLayout class="hr muted-2" />

        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label :text="$GN.weightLimit" />
          <Button :text="(maxWeight / 1000).toFixed(3) + ' ' + $GN.weightUnit" class="fine-button small" @tap="changeWeightLimit" />
        </FlexboxLayout>

        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label :text="$GN.yourProductId" />
          <Button :text="productId" class="fine-button small" @tap="changeProductId" />
        </FlexboxLayout>

        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label text="More settings soon™" />
          <Button text="¯\_(ツ)_/¯" class="fine-button small" />
        </FlexboxLayout>

        <FlexboxLayout justifyContent="space-between" alignItems="center" class="m-t-20">
          <Label text="Development Options" class="muted-6" />
          <ActivityIndicator v-show="loadStatus" busy="true"></ActivityIndicator>
        </FlexboxLayout>
        <StackLayout class="hr muted-2" />

        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label text="Calibration Step 1" />
          <Button :text="String.fromCharCode(0x25b6)" class="fine-button small" @tap="calibration(0)" :isEnabled="!loadStatus" />
        </FlexboxLayout>
        <FlexboxLayout justifyContent="space-between" alignItems="center">
          <Label text="Calibration Step 2" />
          <Button :text="String.fromCharCode(0x25b6)" class="fine-button small" @tap="calibration(1)" :isEnabled="!loadStatus" />
        </FlexboxLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { Dialogs, inputType } from "@nativescript/core";

// Utils
import customActionbar from "@/components/utils/customActionbar.vue";

export default {
  name: "settingsView",
  components: {
    customActionbar,
  },
  data() {
    return {
      commonDialogOptions: {
        okButtonText: this.$GN.enter,
        cancelButtonText: this.$GN.cancel,
        neutralButtonText: this.$GN.reset,
        inputType: inputType.number,
      },
    };
  },
  methods: {
    changeWeightLimit() {
      let options = this.commonDialogOptions;
      options.title = this.$GN.changeWeightLimit;
      options.message = this.$GN.weightUnitInfo;
      options.defaultText = this.maxWeight.toString();
      Dialogs.prompt(options).then(({ result, text }) => {
        if (result) {
          this.$store.dispatch("set_maxWeight", parseInt(text));
        } else if (result === undefined) {
          this.$store.dispatch("set_maxWeight", 5000);
        }
      });
    },

    changeProductId() {
      let options = this.commonDialogOptions;
      options.title = this.$GN.changeProductId;
      options.defaultText = this.productId.toString();
      Dialogs.prompt(options).then(({ result, text }) => {
        if (result) {
          this.$store.dispatch("set_productId", parseInt(text));
        } else if (result === undefined) {
          this.$store.dispatch("set_productId", 1337);
        }
      });
    },

    calibration(step) {
      if (step == 0) {
        Dialogs.confirm({
          title: "Make sure the scale is clear!",
          message: "(0 kg)!",
          okButtonText: this.$GN.send,
          cancelButtonText: this.$GN.cancel,
        }).then((result) => {
          if (result) {
            this.sendAction("calibrationStepOne");
          }
        });
      } else if (step == 1) {
        Dialogs.prompt({
          title: "Place known weight on scale",
          message: "Then wait 10s & enter that weight here in grams",
          defaultText: "1000",
          okButtonText: this.$GN.send,
          cancelButtonText: this.$GN.cancel,
          inputType: inputType.number,
        }).then(({ result, text }) => {
          if (result) {
            this.sendAction("calibrationStepTwo", { weight: parseInt(text) });
          }
        });
      }
    },

    sendAction(name, data = {}) {
      this.$store.dispatch("sendAction", { name, data });
    },
  },
  computed: {
    maxWeight() {
      return this.$store.getters.get_maxWeight;
    },

    productId() {
      return this.$store.getters.get_productId;
    },

    loadStatus() {
      return this.$store.getters.get_loadStatus;
    },
  },
};
</script>

<style scoped>
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
