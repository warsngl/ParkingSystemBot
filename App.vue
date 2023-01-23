<template>
  <div class="bg-gray-200 p-4">
    <div ref="map" class="h-64"></div>
    <button
      class="bg-blue-500 text-white p-2 rounded-lg"
      @click="saveMapPosition"
    >
      Save Map Position
    </button>
    <button
      class="bg-gray-800 text-white p-2 rounded-lg ml-4"
      @click="toggleTheme"
    >
      Toggle Theme
    </button>
    <hr class="my-4" />
    <h3 class="text-lg">Saved Positions:</h3>
    <ul class="list-inside">
      <li
        v-for="position in savedPositions"
        @click="goToSavedPosition(position)"
        class="text-lg font-medium"
      >
        <router-link
          :to="{
            name: 'map',
            params: { lat: position.lat, lng: position.lng },
          }"
        >
          {{ position.lat }}, {{ position.lng }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      savedPositions: [],
    };
  },
  methods: {
    toggleTheme() {
      if (this.theme === "light") {
        this.theme = "dark";
        document.body.classList.add("dark-theme");
      } else {
        this.theme = "light";
        document.body.classList.remove("dark-theme");
      }
    },
    saveMapPosition() {
      if (!this.map) return;
      const center = this.map.getCenter();
      localStorage.setItem(
        "mapPosition",
        JSON.stringify({
          lat: center.lat(),
          lng: center.lng(),
        })
      );
      this.savedPositions.push({ lat: center.lat(), lng: center.lng() });
    },
    loadMapPosition() {
      this.savedPositions =
        JSON.parse(localStorage.getItem("mapPosition")) || [];
    },
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {
              reject(
                new Error("Geolocation is not supported by this browser.")
              );
            }
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    },
    async initMap(coords) {
      const googleMaps = await import(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyB2Nc8a3Qg4IG__s_TOrDU0m1M8ka2-njI"
      );
      this.map = new googleMaps.Map(this.$refs.map, {
        zoom: 14,
        center: coords,
        disableDefaultUI: true,
      });
      new googleMaps.Marker({
        position: coords,
        map: this.map,
      });
    },
    goToSavedPosition(position) {
      this.map.setCenter(position);
    },
  },

  mounted() {
    this.initMap(this.$route.params);
  },
};
</script>
