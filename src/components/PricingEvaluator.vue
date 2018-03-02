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
                      label="Total number of Videos"
                      label-for="exampleInput1">
          <b-form-input id="exampleInput1"
                        type="number"
                        v-model="input.nbrVideos"
                        required
                        placeholder="Enter the number of videos you want to be able to upload">
          </b-form-input>
        </b-form-group>
        <b-form-group
                      label="Number of new videos per month"
                      label-for="exampleInput63">
          <b-form-input id="exampleInput63"
                        type="number"
                        v-model="input.nbrVideosPerMonth"
                        required
                        placeholder="Enter the number of new videos that will be uploaded every month">
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
                        v-model="input.videoDataConsumptionPerDay"
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
        <table style="width:100%">
           <tr>
            <th scope="col">Service</th>
            <th scope="col">Joada Cost per month</th> 
            <th scope="col">Client Price per month</th>
          </tr>
                
          <tr>
            <th scope="row">Player Service</th>
            <th>{{ourCost.playerService}} €</th> 
            <th>{{ourPricePerMonths.playerService}} €</th>
          </tr>
          <tr>
            <th scope="row">Encoding Service</th>
            <th>{{ourCost.encodingService}} €</th> 
            <th>{{ourPricePerMonths.encodingService}} €</th>
          </tr>
          <tr>
            <th scope="row">Hosting Service</th>
            <th>{{ourCost.hostingService}} €</th> 
            <th>{{ourPricePerMonths.hostingService}} €</th>
          </tr>
          <tr>
            <th scope="row">Total</th>
            <th>{{ourCost.total}} €</th> 
            <th>{{ourPricePerMonths.total}} €</th>
          </tr>
        </table>
      <p style="margin-top: 3vh;">Estimated money spend on video streaming by the client: <strong>{{currentPrice}} €/months</strong></p>
      <p>Estimated gain: <strong>{{estimatedGain}} %</strong> of your current video streaming cost</p>
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
        {value: true, text: 'Use the Joada remote encoding service'},
      ],
      hostingOptions: [
        {value: false, text: 'Host the content on your own servers'},
        {value: true, text: 'Use the Joada hosting service'},
      ],
      showAdvancedOptions: false,
      cdnOptions: [
        {value: "LeaseWeb", text: 'LeaseWeb'}
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
        nbrVideosPerMonth: 100,
        videoMeanTime: 10,
        qualities: [],
        videoDataConsumptionPerDay: null,
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
          pricePerMinuteOfEncoding: 0.024,
          storagePerTB: 7.5,
          price1: 49,
          price2: 499,
          price3: 2990,
          price4: 4500
        },
        OVH: {
          pricePerMinuteOfEncoding: 0.01,
          bandwidthPerMbps: 0.176,
          storagePerTB: 7
        }
      },
      ourCost: {
        total: 0,
        encodingService: 0,
        hostingService: 0,
        playerService: 0
      },
      ourPricePerMonths: {
        total: 0,
        playerService: 0,
        encodingService: 0,
        hostingService: 0
      },
      estimatedGain: 0,
      currentPrice: 0
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
      var minutesToEncode = this.input.videoMeanTime * this.input.nbrVideosPerMonth;

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
      if (this.input.videoDataConsumptionPerDay !== null && this.input.videoDataConsumptionPerDay !== 0) {
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
        currentPrice += Math.round(this.currentCDNInfos.LeaseWeb.pricePerMinuteOfEncoding * minutesToEncode);
      }
      this.currentPrice = currentPrice;

      //Get our cost = Quantité qui sort par mois ramené au prix OVH + Storage
      var serverNeeded = Math.ceil(
          dataPerSeconds * this.currentCDNInfos.OVH.bandwidthPerMbps / 44
        );
      if (!this.hostingOption) {
        this.ourCost.hostingService = 0;
      } else {
        this.ourCost.hostingService = serverNeeded * 44;
        var realStorageNeeded = ((storage_needed - serverNeeded) > 0)? storage_needed - serverNeeded : 0;
        this.ourCost.hostingService += Math.round(this.currentCDNInfos.OVH.storagePerTB * realStorageNeeded);
      }
      if (!this.encodingOption) {
        this.ourCost.encodingService = 0;
      } else {
        this.ourCost.encodingService = Math.round(this.currentCDNInfos.OVH.pricePerMinuteOfEncoding * minutesToEncode);
      }

      this.ourCost.playerService = 0;

      this.ourCost.total = this.ourCost.playerService + this.ourCost.encodingService + this.ourCost.hostingService;

      // Update our price
      if (!this.hostingOption) {
        this.ourPricePerMonths.hostingService = 0;
      } else {
        this.ourPricePerMonths.hostingService = Math.round(this.prices.hostingService.priceData * dataPerMonth + this.prices.hostingService.priceStorage * storage_needed);
      }

      if (!this.encodingOption) {
        this.ourPricePerMonths.encodingService = this.prices.encodingService.rent;
      } else {
        this.ourPricePerMonths.encodingService = Math.round(this.prices.encodingService.pricePerMinute * minutesToEncode);
      }

      this.ourPricePerMonths.playerService = Math.round(viewPerMonth * this.prices.playerService);

      this.ourPricePerMonths.total = this.ourPricePerMonths.playerService + this.ourPricePerMonths.encodingService + this.ourPricePerMonths.hostingService;

      this.estimatedGain = this.computeGain(currentPrice, this.ourPricePerMonths.total);
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
