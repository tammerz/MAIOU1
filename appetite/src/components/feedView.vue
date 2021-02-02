<template>
  <Page :actionBarHidden="isCard">
    <ActionBar>
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      <customActionbar />
    </ActionBar>

    <GridLayout rows="auto,*" :class="!isCard ? 'open-card wrapper' : ''" :isPassThroughParentEnabled="!isCard" :isUserInteractionEnabled="isCard">
      <GridLayout row="0" columns="60, auto, 1*, auto, 1.5*" class="table-row head">
        <Label col="0" text="Type" />
        <StackLayout col="1" class="v-divider" />
        <Label col="2" text="Weight" />
        <StackLayout col="3" class="v-divider" />
        <Label col="4" text="Time" />
      </GridLayout>

      <ListView row="1" for="item in getHistoryData" separatorColor="#d7af85" @itemTap="goToFeedView">
        <v-template>
          <GridLayout columns="60, auto, 1*, auto, 1.5*" class="table-row">
            <Label col="0" :text="item.type" />
            <StackLayout col="1" class="v-divider" />
            <Label col="2" :text="item.weight" />
            <StackLayout col="3" class="v-divider" />
            <Label col="4" :text="tomeFromNow(item.time)" />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
// Utils
import customActionbar from "@/components/utils/customActionbar.vue";

// Components / Pages
import feedView from "@/components/feedView.vue";

import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";

export default {
  name: "feedView",
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
      tableCols: "60, auto, *, auto, 1.5*",

      randomData: [
        { type: "2", weight: "4.742", time: 1612034514023 },
        { type: "3", weight: "8.545", time: 1612025874023 },
        { type: "7", weight: "9.792", time: 1612017234023 },
        { type: "5", weight: "4.822", time: 1612008594023 },
        { type: "9", weight: "6.583", time: 1611999954023 },
        { type: "2", weight: "8.480", time: 1611991314023 },
        { type: "4", weight: "0.543", time: 1611982674023 },
        { type: "7", weight: "7.666", time: 1611974034023 },
        { type: "9", weight: "5.923", time: 1611965394023 },
        { type: "7", weight: "3.338", time: 1611956754023 },
        { type: "2", weight: "1.020", time: 1611948114023 },
        { type: "3", weight: "5.217", time: 1611939474023 },
        { type: "8", weight: "5.272", time: 1611930834023 },
        { type: "4", weight: "7.307", time: 1611922194023 },
        { type: "0", weight: "7.261", time: 1611913554023 },
        { type: "2", weight: "5.249", time: 1611904914023 },
        { type: "4", weight: "6.660", time: 1611896274023 },
        { type: "1", weight: "3.563", time: 1611887634023 },
        { type: "1", weight: "4.589", time: 1611878994023 },
        { type: "3", weight: "0.155", time: 1611870354023 },
        { type: "4", weight: "3.864", time: 1611861714023 },
        { type: "4", weight: "9.901", time: 1611853074023 },
        { type: "8", weight: "3.772", time: 1611844434023 },
        { type: "8", weight: "6.559", time: 1611835794023 },
        { type: "2", weight: "4.013", time: 1611827154023 },
        { type: "5", weight: "4.221", time: 1611818514023 },
        { type: "0", weight: "0.155", time: 1611809874023 },
        { type: "3", weight: "9.365", time: 1611801234023 },
        { type: "3", weight: "3.555", time: 1611792594023 },
        { type: "8", weight: "2.434", time: 1611783954023 },
      ],
    };
  },
  methods: {
    decoy() {
      alert({
        title: "Feature pending.",
        message: "Sorry",
        okButtonText: "😡 K",
      });
    },

    goToFeedView() {
      if (this.isCard) {
        this.$navigateTo(feedView, {
          transition: "slideLeft",
          curve: "easeIn",
        });
      }
    },

    tomeFromNow(timestamp) {
      dayjs.extend(relativeTime);
      return dayjs(timestamp).fromNow();
    },
  },
  computed: {
    getHistoryData() {
      // return this.$store.getters.get_historyData;
      return this.isCard ? this.randomData.slice(0, 3) : this.randomData;
    },
  },
};
</script>

<style scoped>
.table-row {
  padding: 0;
  margin: 0;
  height: 50;
  font-size: 20;
  vertical-align: center;
  border-width: 2;
  border-color: transparent;
  text-align: center;
}
.table-row.head {
  margin: 0;
  font-weight: 500;
  border-color: #d7af85;
  border-radius: 5 5 0 0;
}

.table-row label {
  vertical-align: center;
  padding: 0;
  margin: 0;
}

.v-divider {
  width: 1;
  margin: 5;
  padding: 5;
  background-color: #d7af85;
}
</style>
