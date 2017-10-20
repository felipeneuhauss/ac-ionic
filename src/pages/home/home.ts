import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {LoginPage} from "../login/login";
import {AuthProvider} from "../../providers/auth/auth";
import {StationDetailPage} from "../station-detail/station-detail";

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

  constructor(public navCtrl: NavController, private api: ApiProvider,
              public alertCtrl: AlertController, private auth: AuthProvider) {
  }

  getStations() {
    this.api.get('/api/stations').subscribe(
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
            this.api.get('/api/stations/' + this.selectedStation.id + '/check-password/' + data.password).subscribe(
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
                }
            )
          }
        }
      ]
    });
    prompt.present();
  }

  ngOnInit(): void {
    this.getStations();
  }

  ngAfterViewInit() {
    if (!this.auth.getToken()) {
      this.navCtrl.setRoot(LoginPage);
    }
  }
}
