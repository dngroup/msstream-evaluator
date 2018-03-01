<template>
<div>
  <b-container>
      <h4>Please provide some informations on your needs</h4>
      <hr color="black">
      <b-form @submit="priceComputation">
        <b-card header="Select your services" border-variant="primary" header-bg-variant="primary" header-text-variant="white" class="card-margin">
          <b-form-group label="Encoding Service">
          <b-form-select v-model="encodingOption" :options="encodingOptions" />
          </b-form-group>
          <b-form-group label="Streaming servers and hosting service">
          <b-form-select v-model="hostingOption" :options="hostingOptions" />
          </b-form-group>
        </b-card>
        <b-card header="Parameters" border-variant="primary" header-bg-variant="primary" header-text-variant="white" class="card-margin">
        <b-form-group id="exampleInputGroup1"
                      label="Number of Videos"
                      label-for="exampleInput1">
          <b-form-input id="exampleInput1"
                        type="number"
                        v-model="input.nbrVideos"
                        required
                        placeholder="Enter the number of videos you want to be able to upload">
          </b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup2"
                      label="Video mean time (in minutes)"
                      label-for="exampleInput2">
          <b-form-input id="exampleInput2"
                        type="number"
                        v-model="input.videoMeanTime"
                        required
                        placeholder="Enter the mean time of your videos">
          </b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup4"
                      label="Video views per day"
                      label-for="exampleInput4">
          <b-form-input id="exampleInput4"
                        type="number"
                        v-model="input.nbrViewsPerDay"
                        required
                        placeholder="Enter the number of video views per day">
          </b-form-input>
        </b-form-group>
                <b-form-group id="exampleInputGroup5"
                      label="The current price of your video streaming system per month *,**"
                      label-for="exampleInput5">
          <b-form-input id="exampleInput5"
                        type="number"
                        v-model="input.price"
                        placeholder="Enter the price of your current video streaming system in €/month">
          </b-form-input>
        </b-form-group>
        </b-card>
        <b-card v-show="showAdvancedOptions" header="Advanced parameters" border-variant="warning" header-bg-variant="warning" header-text-variant="black" class="card-margin">
          <b-form-group id="exampleInputGroup3"
                      label="Video data consumption in GB per day *"
                      label-for="exampleInput3">
          <b-form-input id="exampleInput3"
                        type="number"
                        v-model="input.videoDataConsumptionPerMonth"
                        placeholder="Enter video data consumption in GB per month">
          </b-form-input>
          </b-form-group>
          <b-form-group
                      label="CDN currently used *">
          <b-form-select v-model="input.cdnUsed" :options="cdnOptions" />
        </b-form-group>
          <b-form-group label="Location">
          <b-form-select v-model="locationOption" :options="locationOptions" />
          </b-form-group>
                  <b-form-group id="exampleInputGroup8"
                      label="Storage needed in GB *"
                      label-for="exampleInput8">
          <b-form-input id="exampleInput8"
                        type="number"
                        v-model="input.storageNeeded"
                        placeholder="Enter storage needed in GB">
          </b-form-input>
        </b-form-group>
        </b-card>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button variant="warning" v-on:click="advancedOptions" v-show="!showAdvancedOptions">Show advanced parameters</b-button>
        <b-button variant="warning" v-on:click="advancedOptions" v-show="showAdvancedOptions">Close advanced parameters</b-button>
      </b-form>
      <p style="margin-top: 1vh;font-size: 0.85em;">* Optionnal.</p>
      <p style="margin-top: -13px;font-size: 0.85em;">** If you don't provide a price, it will be estimated using standard CDN pricing, in order to compute an estimated gain.</p>
  </b-container>

  <div class="backcolor">
    <b-container>
      <div class="botpadding">
      <h4 class="withpadding">Result</h4>
      <hr color="white">
      <div v-show="isResultComputed">
      <p>New price with MS-Stream: {{ourPricePerMonths.total}} €/months</p>
      <p>Estimated gain: {{estimatedGain}} % of your current video streaming cost</p>
      </div>
      </div>
    </b-container>
  </div>
  <div class="bottom-footer">
  <hr>
  <b-container>

    © 2018 MS-STREAM
  </b-container>
</div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: "PricingEvaluator",
  data() {
    return {
      prices: {            
        playerService: 0,
        encodingService: {
            pricePerMinute: 0,
            rent: 0
        },
        hostingService: {
            priceData: 0,
            priceStorage: 0
        }
      },
      encodingOption: true,
      hostingOption: true,
      locationOption: "France",
      locationOptions: [
        {value: "France", text: 'France'},
      ],
      encodingOptions: [
        {value: false, text: 'Host the encoding service on your own platform'},
        {value: true, text: 'Use the remote encoding service'},
      ],
      hostingOptions: [
        {value: false, text: 'Host the content on your own servers'},
        {value: true, text: 'Use the hosting service'},
      ],
      showAdvancedOptions: false,
      cdnOptions: [
        {value: "LeaseWeb", text: 'LeaseWeb'},
        {value: "OVH", text: 'OVH'}
      ],
      defaultQualities: [
        {
          name: "SD",
          height: 720,
          width: 480,
          bitrate: 1000
        },
        {
          name: "HD",
          height: 1280,
          width: 720,
          bitrate: 3000
        },
        {
          name: "Full-HD",
          height: 1920,
          width: 1080,
          bitrate: 5000
        }
      ],
      isResultComputed: false,
      input: {
        nbrVideos: 20000,
        videoMeanTime: 10,
        qualities: [],
        videoDataConsumptionPerMonth: null,
        nbrViewsPerDay: 200000,
        price: null,
        cdnUsed: "LeaseWeb",
        videoDetails: [],
        location: "",
        storageNeeded: null,
      },
      computed: {
        dataToStore: 0,
        outputBandwidth: 0
      },
      currentCDNInfos: {
        LeaseWeb: {
          storagePerTB: 7.5,
          price1: 49,
          price2: 499,
          price3: 2990,
          price4: 4500
        },
        OVH: {
          bandwidthPerMbps: 0.176,
          storagePerTB: 7
        }
      },
      ourCost: {
        total: 0,
        encodingService: 0,
        hostingService: 0
      },
      ourPricePerMonths: {
        total: 0,
        playerService: 0,
        encodingService: 0,
        hostingService: 0
      },
      estimatedGain: 0
    };
  },
  mounted: function() {
    this.getPricing();
  },
  methods: {
    priceComputation: function(evt) {
      evt.preventDefault();

      var storage;
      var bandwidth;
      var currentPrice;
      var ourPrice = 0;
      var marginMultiplicator = 3;
      var meanTimeinSeconds = this.input.videoMeanTime * 60;
      var storage_needed = 0; //kB
      var meanBandwidthPerVideo; //kbps
      var meanVideoPerSeconds;
      var viewPerMonth = this.input.nbrViewsPerDay * 30;
      var dataPerSeconds;
      var dataPerMonth;
      var minutesToEncode = this.input.videoMeanTime * this.input.nbrVideos;

      // Storage
      if (this.input.storageNeeded !== null && this.input.storageNeeded !== 0) {
        storage_needed = this.input.storageNeeded / 1000; //TB
      } else {
        for (var i = 0; i < this.input.nbrVideos; i++) {
          for (var j = 0; j < this.defaultQualities.length; j++) {
            storage_needed +=
              this.defaultQualities[j].bitrate * meanTimeinSeconds / 1000000000 / 8 ; //TB
          }
        }
      }

      // Mean bandwidth per video
      meanBandwidthPerVideo =
        this.defaultQualities.reduce((a, b) => {
          return { bitrate: a.bitrate + b.bitrate };
        }).bitrate / this.defaultQualities.length;

      // Mean videos per seconds
      meanVideoPerSeconds = this.input.nbrViewsPerDay / (60 * 60 * 24);

      //Quantité qui sort du CDN par mois (en Gbps)
      if (this.input.videoDataConsumptionPerMonth !== null && this.input.videoDataConsumptionPerMonth !== 0) {
        dataPerMonth = this.input.videoDataConsumptionPerDay * 30 / 1000;
        dataPerSeconds = dataPerMonth * 8 * 1000000 / 30 / 24 / 60 / 60;
      } else {
        dataPerSeconds = meanVideoPerSeconds * meanBandwidthPerVideo / 1000; // Mb
        dataPerMonth = dataPerSeconds * 60 * 60 * 24 * 30 / 1000000 / 8; // TB
      }

      // Get current price
      if (this.input.price !== null && this.input.price !== 0) {
        currentPrice = this.input.price;
      } else {
        if (dataPerMonth <= 2) {
          currentPrice = this.currentCDNInfos.LeaseWeb.price1;
        } else if (dataPerMonth <= 25) {
          currentPrice = this.currentCDNInfos.LeaseWeb.price2;
        } else if (dataPerMonth <= 500) {
          currentPrice = this.currentCDNInfos.LeaseWeb.price3;
        } else if (dataPerMonth <= 1000) {
          currentPrice = this.currentCDNInfos.LeaseWeb.price4;
        } else {
          currentPrice = this.currentCDNInfos.LeaseWeb.price4 + 1000;
        }
        var realLeaseWebStorage = (storage_needed - 1  > 0) ? storage_needed - 1 : 0;
        currentPrice += Math.round(this.currentCDNInfos.LeaseWeb.storagePerTB * storage_needed);
      }

      //Get our price = Quantité qui sort par mois ramené au prix OVH + Storage
      var serverNeeded = Math.ceil(
          dataPerSeconds * this.currentCDNInfos.OVH.bandwidthPerMbps / 44
        );
      this.ourCost.hostingService = serverNeeded * 44;
      var realStorageNeeded = ((storage_needed - serverNeeded) > 0)? storage_needed - serverNeeded : 0;
      this.ourCost.hostingService += Math.round(this.currentCDNInfos.OVH.storagePerTB * realStorageNeeded);

      // Update result
      this.ourPricePerMonths.total = this.ourCost.hostingService;
      this.estimatedGain = this.computeGain(currentPrice, ourPrice);
      this.isResultComputed = true;
    },
    computeGain: function(currentPrice, ourPrice) {
      return Math.round((currentPrice - ourPrice) / currentPrice * 100);
    },
    advancedOptions: function() {
      this.showAdvancedOptions = !this.showAdvancedOptions;
    },
    getPricing() {
       var instance = {
                    baseURL: 'api/prices',
                    method: 'get'
                };
        axios(instance).then((response) => {
            this.prices = response.data;
        }).catch((response) => {
            console.log(response)
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.backcolor {
  margin-top: 3vh;
  background-color: #0f182f;
  color: rgb(243, 243, 243);
}
.bottom-footer {
  margin-top: 1vh;
  margin-bottom: 2vh;
}
.withpadding {
  padding-top: 2vh;
}
.botpadding {
  padding-bottom: 15vh;
}

.card-margin {
  margin-bottom: 2vh;
}
.btn-msstream {
  color: white;
  background-color: #0f182f;
  border-color: #0f182f;
}
</style>
