import {Component, OnInit} from '@angular/core';
import { AlertController, Events, IonicPage, NavController, PopoverController } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {StationDetailPage} from "../station-detail/station-detail";
import { PopoverPage } from '../popover/popover';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@IonicPage({
  name: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  stations: any = [];
  selectedStation: any = {};

  constructor(public navCtrl: NavController, private api: ApiProvider, public popoverCtrl: PopoverController,
              public alertCtrl: AlertController, public events: Events,
              private imageLoaderConfig: ImageLoaderConfig, private launchNavigator: LaunchNavigator) {

      this.imageLoaderConfig.enableDebugMode();
  }

  getStations() {
    this.api.get('stations').subscribe(
        (response) => {
          this.stations = response;
        }
    )
  }

  selectStation(station: any) {
    this.selectedStation = station;

    if (localStorage.getItem('station-'+this.selectedStation.id)) {
      this.navCtrl.push(StationDetailPage, {stationId: localStorage.getItem('station-' + this.selectedStation.id)});
      return;
    }

    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Informe a senha de acesso do condomínio. Ela pode ser obtida com o síndico.",
      inputs: [
        {
          name: 'password',
          placeholder: 'Senha do condomínio'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.password && data.password !== "") {
                this.api.get('stations/' + this.selectedStation.id + '/check-password/' + data.password).subscribe(
                    (response) => {
                    if (response.success) {
                        localStorage.setItem('station-' + this.selectedStation.id + '-password', data.password);
                        localStorage.setItem('station-' + this.selectedStation.id, this.selectedStation.id);
                        this.navCtrl.push(StationDetailPage, {stationId: this.selectedStation.id});
                        return;
                    }

                    const alert = this.alertCtrl.create({
                        title: 'Senha inválida',
                        subTitle: 'Sua senha parece estar errada. Verifique se foi digitada corretamente.',
                        buttons: ['Vou checar o password']
                    });
                    alert.present();
                })
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
        ev: myEvent
    });

  }

  ngOnInit(): void {
    this.getStations();
  }

  ngAfterViewInit() {

    this.events.subscribe('logout', () => {

    });
  }

  accessMap (station) {
    let options: LaunchNavigatorOptions = {
    };


    this.launchNavigator.navigate([station.lat, station.lng], options)
      .then(
          (success) => console.log('Launched navigator', success),
          (error) => console.log('Error launching navigator', error)
      );
  }
}
