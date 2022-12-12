import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
export class GeographyPointDto {

  lat: string = null;
  long: string = null;
 }
@Component({
  selector: 'app-select-location-map-box',
  templateUrl: './select-location-map-box.component.html',
  styleUrls: ['./select-location-map-box.component.scss'],
})
export class SelectLocationMapBoxComponent implements OnInit {
  map: mapboxgl.Map;
  marker = new mapboxgl.Marker({
    draggable: true
  });
  geography=new GeographyPointDto();
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 36.268370176225446;
  lng = 59.63287141963738;
  imageChangedEvent: any = '';
  showCropper = false;
  croppedImage: any = '';
  constructor(
    public activeModal: NgbActiveModal,
) {
  }

  ngOnInit() {
    this.buildMap(this.geography);
    this.marker.on('dragend', (event) => {

      this.onDragEnd();

    });
    this.map.on('click', (event) => {
      //const coordinates = [event.lngLat.lng, event.lngLat.lat];
      //var el = document.createElement('div');
      //var img = document.createElement('img');
      //img.setAttribute('src', "../assets/marker-icon.png")
      //el.append(img)
      //el.id = 'marker';
      this.marker.setLngLat([event.lngLat.lng, event.lngLat.lat])
        .addTo(this.map);
      this.onDragEnd();

    });
  
  }


  buildMap(geography: GeographyPointDto) {
    if (!mapboxgl.accessToken) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    mapboxgl.setRTLTextPlugin(
      'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      (e) => { },
      true // Lazy load the plugin
    );

    }

    if (geography && geography.lat && geography.long) {

      this.map = new mapboxgl.Map({
        // accessToken:"",
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 16,
        center: [geography.long, geography.lat],

      });


      this.marker.setLngLat([geography.long, geography.lat])
        .addTo(this.map);
    }
    else {
      this.map = new mapboxgl.Map({
        // accessToken:"",
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 100,
        center: [this.lng, this.lat],

      });
    }
    /// Add map controls
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));



  }



  onDragEnd() {
    const lngLat = this.marker.getLngLat();
    this.geography = new GeographyPointDto();
    this.geography.long = lngLat.lng;
    this.geography.lat = lngLat.lat;
  }


  select() {

    this.activeModal.close(this.geography)
  }

  dismiss() {
    this.activeModal.close(false)
  }
}
