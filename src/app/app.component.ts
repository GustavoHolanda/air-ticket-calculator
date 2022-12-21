import { Component } from '@angular/core';
import axios from 'axios';

interface City {
  city: string;
  latitude: number;
  longitude: number;
}
interface Country {
  country: string;
  cities: City[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'desafio-final';

  countries: Country[] = [];

  selectedOriginCountry: Country | undefined = undefined;
  selectedOriginCity: City | undefined = undefined;

  selectedDestinyCountry: Country | undefined = undefined;
  selectedDestinyCity: City | undefined = undefined;

  economic: boolean = true;

  miles = 0;

  adults = 0;
  kids = 0;

  toStr = JSON.stringify;

  ngOnInit() {
    this.getCountries();
  }

  onChangeOriginCountry(e: any) {
    this.selectedOriginCountry = JSON.parse(e.target.value) as Country;
    this.selectedOriginCity = undefined;
  }

  onChangeOriginCity(e: any) {
    if (e) {
      this.selectedOriginCity = JSON.parse(e.target.value) as City;
    } else {
      this.selectedOriginCity = undefined;
    }
  }

  onChangeDestinyCountry(e: any) {
    this.selectedDestinyCountry = JSON.parse(e.target.value) as Country;
    this.selectedDestinyCity = undefined;
  }

  onChangeDestinyCity(e: any) {
    if (e) {
      this.selectedDestinyCity = JSON.parse(e.target.value) as City;
    } else {
      this.selectedOriginCity = undefined;
    }
  }

  getCountries = () => {
    axios.get('http://localhost:3000/countries').then((response) => {
      this.countries = response.data;
      console.log(this.countries);
    });
  };

  degreesToRadians(degrees: number): number {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  getDistance() {
    const originLatitude = this.selectedOriginCity?.latitude;
    const originLongitude = this.selectedOriginCity?.longitude;

    const destinationLatitude = this.selectedDestinyCity?.latitude;
    const destinationLongitude = this.selectedDestinyCity?.longitude;

    if (
      originLatitude &&
      originLongitude &&
      destinationLatitude &&
      destinationLongitude
    ) {
      const EARTH_RADIUS = 6_371.071; // Earth
      const diffLatitudeRadians = this.degreesToRadians(
        destinationLatitude - originLatitude
      );
      const diffLongitudeRadians = this.degreesToRadians(
        destinationLongitude - originLongitude
      );
      const originLatitudeRadians = this.degreesToRadians(originLatitude);
      const destinationLatitudeRadians =
        this.degreesToRadians(destinationLatitude);

      const kmDistance =
        2 *
        EARTH_RADIUS *
        Math.asin(
          Math.sqrt(
            Math.sin(diffLatitudeRadians / 2) *
              Math.sin(diffLatitudeRadians / 2) +
              Math.cos(originLatitudeRadians) *
                Math.cos(destinationLatitudeRadians) *
                Math.sin(diffLongitudeRadians / 2) *
                Math.sin(diffLongitudeRadians / 2)
          )
        );

      return kmDistance;
    }
    return 0;
  }

  getValues(kids: boolean) {
    if (this.selectedOriginCity && this.selectedDestinyCity) {
      const distance = this.getDistance();
      if (
        this.selectedOriginCountry?.country ===
        this.selectedDestinyCountry?.country
      ) {
        return this.getTypeValue(kids ? distance * 0.15 : distance * 0.3, kids);
      }
      return this.getTypeValue(kids ? distance * 0.25 : distance * 0.5, kids);
    }
    return 0;
  }

  getTypeValue(value: number, kids: boolean) {
    if (this.economic) {
      return value;
    }
    return kids ? value * 1.4 : value * 1.8;
  }

  getTotalValue() {
    if (this.selectedOriginCity && this.selectedDestinyCity) {
      const adultValue = this.getValues(false) * this.adults;
      const kidsValue = this.getValues(true) * this.kids;
      const milesValue = this.miles * 0.02;

      return adultValue + kidsValue - milesValue;
    }

    return 0;
  }

  addAdult() {
    this.adults = this.adults + 1;
  }

  subtractAdult() {
    if (this.adults > 0) this.adults = this.adults - 1;
  }

  addKid() {
    this.kids = this.kids + 1;
  }

  subtractKid() {
    if (this.kids > 0) this.kids = this.kids - 1;
  }

  changeMiles(e: string) {
    this.miles = Number(e);
  }
}
