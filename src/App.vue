<template>
  <div ref="map" id="map"></div>
  <div class="control">
    <div class="flex justify-start">
      <button
        class="bg-blue-500 text-white p-2 rounded-lg"
        @click="saveMapPosition"
      >
        Save Map Position
      </button>
      <!-- <button
        class="bg-gray-800 text-white p-2 rounded-lg ml-2"
        @click="loadSavedPositions"
      >
        Toggle Theme
      </button> -->
      <button
        class="bg-green-500 text-white p-2 rounded-lg ml-2"
        @click="saveCurrentPosition"
      >
        Get position
      </button>
    </div>
    <h3 class="text-lg pl-2">Saved Positions:</h3>
    <ol class="list-inside list-decimal pl-2">
      <li
        v-for="position in savedPositions"
        @click="goToSavedPosition(position)"
        class="text-lg font-medium cursor-pointer"
        :key="position"
      >
        {{ position.lat.toFixed(6) }}, {{ position.lng.toFixed(6) }}
        <!-- <router-link :to="'/map/' + position.lat + '/' + position.lng">
            {{ position.lat }}, {{ position.lng }}
          </router-link> -->
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: true,
      savedPositions: [],
      googleMaps: null,
      currentPosition: null,
      theme: 'light',
      placemarks: [],
    };
  },
  methods: {
    toggleTheme() {
      if (this.theme === 'light') {
        this.theme = 'dark';
        document.body.classList.add('dark-theme');
      } else {
        this.theme = 'light';
        document.body.classList.remove('dark-theme');
      }
    },
    saveMapPosition() {
      if (!this.map) return;
      const [lat, lng] = this.map.getCenter();
      this.savedPositions.push({ lat, lng });
      localStorage.setItem('mapPosition', JSON.stringify(this.savedPositions));
    },
    loadMapPosition() {
      let localSavedPosition = JSON.parse(localStorage.getItem('mapPosition'));
      localSavedPosition && localSavedPosition.length > 0
        ? this.savedPositions.push(...localSavedPosition)
        : (this.savedPositions = []);
    },
    loadSavedPositions() {
      this.savedPositions.forEach((p) => this.addPlaceMark(p));
    },
    saveCurrentPosition() {
      this.getCurrentPosition().then((res) => (this.currentPosition = res));
    },
    mapControl() {
      console.log(this.map.getCenter());
    },
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {
              reject(
                new Error('Geolocation is not supported by this browser.')
              );
            }
          );
        } else {
          reject(new Error('Geolocation is not supported by this browser.'));
        }
      });
    },
    initMap(position) {
      // const googleMaps = await import(
      //   'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2Nc8a3Qg4IG__s_TOrDU0m1M8ka2-njI&callback=initMap'
      // );
      // this.map = new googleMaps.maps.Map(this.$refs.map, {
      //   zoom: 14,
      //   center: coords,
      //   disableDefaultUI: true,
      // });
      // new googleMaps.Marker({
      //   position: coords,
      //   map: this.map,
      // });
      ymaps.ready(() => {
        this.map = new ymaps.Map(this.$refs.map, {
          center: [position.lat, position.lng],
          zoom: 18,
        });
        // this.map.geoObjects.add(
        //   new ymaps.GeoObject(
        //     {
        //       // Описание геометрии.
        //       geometry: {
        //         type: 'Point',
        //         coordinates: [55.8, 37.8],
        //       },
        //       // Свойства.
        //       properties: {
        //         // Контент метки.
        //         iconContent: 'Я тащусь',
        //         hintContent: 'Ну давай уже тащи',
        //       },
        //     },
        //     {
        //       // Опции.
        //       // Иконка метки будет растягиваться под размер ее содержимого.
        //       preset: 'islands#blackStretchyIcon',
        //       // Метку можно перемещать.
        //       draggable: true,
        //     }
        //   )
        // );
      });
    },
    goToSavedPosition(position) {
      this.map.setCenter([position.lat, position.lng]);
    },
    addPlaceMark(position) {
      // debugger
      this.placemarks.push(
        new ymaps.GeoObject(
          {
            // Описание геометрии.
            geometry: {
              type: 'Point',
              coordinates: [62.6726051, 50.8237546],
            },
            // Свойства.
            properties: {
              // Контент метки.
              iconContent: 'Я тащусь',
              hintContent: 'Ну давай уже тащи',
            },
          },
          {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            draggable: true,
          }
        )
        // myPieChart = new ymaps.Placemark([
        //     55.847, 37.6
        // ], {
        //     // Данные для построения диаграммы.
        //     data: [
        //         {weight: 8, color: '#0E4779'},
        //         {weight: 6, color: '#1E98FF'},
        //         {weight: 4, color: '#82CDFF'}
        //     ],
        //     iconCaption: "Диаграмма"
        // }, {
        //     // Зададим произвольный макет метки.
        //     iconLayout: 'default#pieChart',
        //     // Радиус диаграммы в пикселях.
        //     iconPieChartRadius: 30,
        //     // Радиус центральной части макета.
        //     iconPieChartCoreRadius: 10,
        //     // Стиль заливки центральной части.
        //     iconPieChartCoreFillStyle: '#ffffff',
        //     // Cтиль линий-разделителей секторов и внешней обводки диаграммы.
        //     iconPieChartStrokeStyle: '#ffffff',
        //     // Ширина линий-разделителей секторов и внешней обводки диаграммы.
        //     iconPieChartStrokeWidth: 3,
        //     // Максимальная ширина подписи метки.
        //     iconPieChartCaptionMaxWidth: 200
        // });
        // myPlacemarkWithContent = new ymaps.Placemark(
        //   [55.661574, 37.573856],
        //   {
        //     hintContent: 'Собственный значок метки с контентом',
        //     balloonContent: 'А эта — новогодняя',
        //     iconContent: '12',
        //   },
        //   {
        //     // Опции.
        //     // Необходимо указать данный тип макета.
        //     iconLayout: 'default#imageWithContent',
        //     // Своё изображение иконки метки.
        //     iconImageHref: 'images/ball.png',
        //     // Размеры метки.
        //     iconImageSize: [48, 48],
        //     // Смещение левого верхнего угла иконки относительно
        //     // её "ножки" (точки привязки).
        //     iconImageOffset: [-24, -24],
        //     // Смещение слоя с содержимым относительно слоя с картинкой.
        //     iconContentOffset: [15, 15],
        //     // Макет содержимого.
        //     iconContentLayout: MyIconContentLayout,
        //   }
        // );
      );
      // this.map?.geoObjects?.add(myPlacemark);
    },
  },
  // watch: {
  //   "placemarks.length"(val, oldVal) {
  //     console.log(val,oldVal)
  //     val > oldVal && this.placemarks.forEach((p) => this.map.geoObjects.add(p));
  //   },
  // },
  created() {
    this.getCurrentPosition().then(
      (res) => (
        (this.currentPosition = res), this.initMap(this.currentPosition)
      ),
      (rej) => this.initMap(this.$route.params)
    );
    this.loadMapPosition();
  },
};
</script>
<style>
#app {
  @apply h-[100vh] w-[100vw] dark:bg-gray-800 lg:flex;
}
#map {
  @apply h-[100vh] w-[100vw];
}
.control {
  @apply fixed bottom-0 w-[100vw];
}
ol {
  @apply h-[140px] overflow-y-auto;
}
</style>
