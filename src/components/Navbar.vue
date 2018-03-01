<template>
<b-navbar toggleable="md" type="dark" variant="black">


  <b-navbar-brand href="#/">MS-Stream Pricing Estimation Tool</b-navbar-brand>
<b-navbar-toggle target="nav_collapse" right></b-navbar-toggle>
  <b-collapse is-nav id="nav_collapse" right>

    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#/" >Home</b-nav-item>
      <b-nav-item href="#/admin">Admin</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {

    }

    }
}
</script>

<style>
.bg-black {
    background-color: black !important
}

</style>