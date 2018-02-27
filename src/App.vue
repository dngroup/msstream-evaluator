<template>
  <div id="app">
    <div class="jumbotron" id="jumbotron">
        <div id="particles">
      <h1 class="maintitle">MS-Stream Pricing Estimation Tool</h1>
        </div>

      </div>
                
      
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>

#particles {
    position: absolute;
    background: #002641;
    background: #002641;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #05274c;
    background-image: url("assets/bokeh.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
}
.maintitle {
  text-align: center;
  padding-top: 13vh;
}

#jumbotron.jumbotron {
    position: relative;
    padding-bottom: 30vh;
    margin-bottom: 5px;
    color: white;
    background-color: transparent;
}

</style>
