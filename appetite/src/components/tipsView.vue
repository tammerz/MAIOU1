<template>
  <Page :actionBarHidden="isCard">
    <ActionBar>
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      <customActionbar />
    </ActionBar>
    <GridLayout rows="*,auto" class="p-0">
      <ScrollView row="0" rowSpan="2" @loaded="disableScroll" ref="tipsScrollView">
        <GridLayout :rows="isCard ? '*' : 'auto, *'" :class="!isCard ? 'open-card wrapper' : ''">
          <GridLayout row="0" rows="auto, *, auto">
            <StackLayout row="0" @loaded="setClipChildren">
              <GridLayout columns="*,auto" class="fine-button m-x-10 p-l-5 p-r-10" @tap="selectPetType" height="60">
                <StackLayout col="0">
                  <Label :text="$GN.selectPetType" class="h3 m-0 p-0" verticalAlignment="center" />
                  <Label v-if="petType != null" :text="petTypes[petType]" class="h2 m-0 p-0 p-l-5" verticalAlignment="center" />
                </StackLayout>
                <Label col="1" :text="String.fromCharCode(0x25bc)" class="h2" verticalAlignment="center" />
              </GridLayout>

              <StackLayout class="m-5" />

              <GridLayout v-show="petType != null" columns="*,auto" class="fine-button m-x-10 p-l-5 p-r-10" @tap="selectPetSubType" height="60">
                <StackLayout col="0">
                  <Label :text="$GN.selectPetSubType" class="h3 m-0 p-0" verticalAlignment="center" />
                  <Label v-if="petSubType != null" :text="petSubTypes[petSubType]" class="h2 m-0 p-0 p-l-5" verticalAlignment="center" />
                </StackLayout>
                <Label col="1" :text="String.fromCharCode(0x25bc)" class="h2" verticalAlignment="center" />
              </GridLayout>
            </StackLayout>
            <Label
              row="2"
              editable="false"
              textWrap="true"
              class="m-x-15 m-t-10 "
              v-if="petType != null && isCard"
              :text="currentPetTipsDescription.slice(0, 220) + '... ' + $GN.more + ' ' + String.fromCharCode(0x276f)"
              @tap="goToTipsView"
            >
              <FormattedString>
                <Span :text="currentPetTipsDescription.slice(0, 180)" />
                <Span text="...  " class="font-weight-bold"  />
                <Span :text="$GN.more + ' ' + String.fromCharCode(0x276f)" class="underline font-weight-bold" />
              </FormattedString>
            </Label>
          </GridLayout>

          <StackLayout row="1" v-if="!isCard" class="body2 p-b-20">
            <Label v-if="petType != null" :text="currentPetTipsDescription" class="m-5" textWrap="true" />
            <StackLayout class="hr muted-2" />
            <StackLayout v-if="petSubType != null">
              <StackLayout v-for="(tip, index) in currentPetTips" :key="index">
                <FlexboxLayout v-if="Array.isArray(tip)" alignItems="center" class="m-5">
                  <Label v-if="tip[0].includes('0x')" :text="String.fromCharCode(tip[0])" textWrap="true" width="60" class="text-center" />
                  <Label v-else :text="tip[0]" textWrap="true" class="m-r-10" />
                  <Label :text="tip[1]" textWrap="true" />
                </FlexboxLayout>
                <Label v-else :text="tip" class="m-5" textWrap="true" />
              </StackLayout>
            </StackLayout>
          </StackLayout>
        </GridLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script>
// Utils
import customActionbar from "@/components/utils/customActionbar.vue";

// Components / Pages
import tipsView from "@/components/tipsView.vue";

export default {
  name: "tipsView",
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
      dummyText:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis eveniet hic magnam at, provident ad soluta facere veniam repellendus dolore ex labore sit molestias excepturi nihil similique doloremque amet quae veritatis temporibus, sint qui, laborum adipisci eum? Quaerat totam qui sit harum perspiciatis temporibus voluptates inventore iste, aliquam reprehenderit vitae!",
      dummyText2:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis eveniet hic magnam at, provident ad soluta facere veniam repellendus dolore ex labore sit molestias excepturi nihil similique doloremque amet quae veritatis temporibus, sint qui, laborum adipisci eum? Quaerat totam qui sit harum perspiciatis temporibus voluptates inventore iste, aliquam reprehenderit vitae!",
    };
  },
  methods: {
    disableScroll() {
      if (this.isCard) {
        this.$refs.tipsScrollView.nativeView.android.setScrollEnabled(false);
      }
    },
    selectPetType() {
      action(this.$GN.selectPetType, this.$GN.cancel, this.petTypes).then((result) => {
        const index = this.petTypes.indexOf(result);
        if (index >= 0) {
          this.$store.dispatch("set_petSubType", null);
          this.$store.dispatch("set_petType", index);
          // this.goToTipsView();
        }
      });
    },

    selectPetSubType() {
      action(this.$GN.selectPetSubType, this.$GN.cancel, this.petSubTypes).then((result) => {
        const index = this.petSubTypes.indexOf(result);
        if (index >= 0) {
          this.$store.dispatch("set_petSubType", index).then(() => {
            this.goToTipsView();
          });
        }
      });
    },

    goToTipsView() {
      if (this.isCard) {
        this.$navigateTo(tipsView, {
          transition: "slideLeft",
          curve: "easeIn",
        });
      }
    },

    setClipChildren(event) {
      const layout = event.object;
      if (layout.android) {
        layout.android.getParent().setClipChildren(false);
      }
    },
  },
  computed: {
    petType() {
      return this.$store.getters.get_petType;
    },

    petTypes() {
      return this.$store.getters.get_petTypes;
    },

    petSubType() {
      return this.$store.getters.get_petSubType;
    },

    petSubTypes() {
      return this.$store.getters.get_petSubTypes;
    },

    currentPetTipsDescription() {
      return this.$store.getters.get_currentPetTipsDescription;
    },

    currentPetTips() {
      return this.$store.getters.get_currentPetTips;
    },
  },
};
</script>

<style scoped></style>
