<template>
<b-container class="globalpadding">
    <b-card header="Pricing for every service" border-variant="primary" header-bg-variant="primary" header-text-variant="white">
        <b-form @submit="onSubmit">
        <b-form-group id="PlayerService"
                      label="Player Service (price per view)"
                      label-for="inputPlayerService">
          <b-form-input id="inputPlayerService"
                        type="number"
                        step="0.000001"
                        v-model="services.playerService"
                        required
                        placeholder="Enter the price per view">
          </b-form-input>
        </b-form-group>
        <b-form-group id="EncodingServiceThem"
                      label="Price of self hosted encoding service (fixed price per month)"
                      label-for="inputEncodingService">
          <b-form-input id="inputEncodingService"
                        type="number"
                        v-model="services.encodingService.rent"
                        step="0.000001"
                        required
                        placeholder="Enter the price of the Encoding Service rent">
          </b-form-input>
          </b-form-group>
        <b-form-group id="EncodingServiceUs"
                      label="Price of encoding service (price per minute of video to encode)"
                      label-for="inputEncodingService2">
          <b-form-input id="inputEncodingService2"
                        type="number"
                        step="0.000001"
                        v-model="services.encodingService.pricePerMinute"
                        required
                        placeholder="Enter the price of the Encoding Service">
          </b-form-input>
        </b-form-group>
                <b-form-group id="hostingService"
                      label="Hosting Service Output Data (price per TB per month)"
                      label-for="inputHosting1">
          <b-form-input id="inputHosting1"
                        type="number"
                        step="0.000001"
                        v-model="services.hostingService.priceData"
                        required
                        placeholder="Enter the price of the output data per TB">
          </b-form-input>
        </b-form-group>
        <b-form-group id="hostingService2"
                      label="Hosting Service Storage (price per TB)"
                      label-for="inputHosting2">
          <b-form-input id="inputHosting2"
                        type="number"
                        step="0.000001"
                        v-model="services.hostingService.priceStorage"
                        required
                        placeholder="Enter the price of storage per TB">
          </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Save</b-button>
        </b-form>
    </b-card>
</b-container>
</template>

<script>
import axios from 'axios';
export default {
  name: "Pricing",
  data() {
    return {
        services: {
            playerService: 0,
            encodingService: {
                pricePerMinute: 0,
                rent: 0
            },
            hostingService: {
                priceData: 0,
                priceStorage: 0
            }
        }
    }

    },
  mounted: function() {
    this.getPricing();
  },
    methods: {
        onSubmit: function(evt) {
            evt.preventDefault();
            var instance = {
                    baseURL: 'api/prices',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: this.services
                };
            axios(instance).then((response)=> {
                console.log(response)
            }).catch((response)=> {
                console.log(response)
            })
        },
        getPricing() {
       var instance = {
                    baseURL: 'api/prices',
                    method: 'get'
                };
        axios(instance).then((response) => {
            this.services = response.data;
        }).catch((response) => {
            console.log(response)
        });
    }
    }
}
</script>

<style>
.globalpadding {
    padding-bottom: 2vh;
}
</style>