import {Component, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {AuthProvider} from "../../providers/auth/auth";
import {LoginPage} from "../login/login";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {Chart} from 'chart.js';

/**
 * Generated class for the StationDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-station-detail',
    templateUrl: 'station-detail.html',
})
export class StationDetailPage implements OnInit {

    @ViewChild('lineCanvas') lineCanvas;

    station: any = {};
    stationId: number;
    lineChart: any;
    intervalLoadChart: any;
    intervalLoadReservoirLevel: any;
    reservoirs:any = [];

    constructor(public navCtrl: NavController, private auth: AuthProvider,
                public navParams: NavParams, private api: ApiProvider, private storage: LocalStorageProvider) {
        this.stationId = navParams.get('stationId');
        console.log('station-id', this.stationId);
    }

    getStation() {
        this.api.get('stations/' + this.stationId).subscribe(
            (response: any) => {
                this.station = response;
                console.log(this.station);
                this.storage.set(this.stationId + '-station', this.station);
                this.setupChart(this.station.chart);
            }
        );
    }

    getReservoirLevel() {
        this.api.get('reservoir-level/'+this.stationId).subscribe((response) => {
            console.log('Call the reservoir-level', this.lineCanvas, response);
            this.reservoirs = response;
            console.log(this.reservoirs);
        });
    }

    setupChart(chart) {
        // Ok - Assim mostra o grafico
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: chart.labels,
                datasets: [
                    {
                        label: "(m³)",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: chart.data[0],
                        spanGaps: false,
                    }
                ]
            }

        });
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
        this.intervalLoadChart = setInterval(()=> {
            this.getStation();
        }, 600000);

        this.intervalLoadReservoirLevel = setInterval(()=> {
            this.getReservoirLevel();
        }, 600000);


        if (!this.auth.getToken()) {
            this.navCtrl.setRoot(LoginPage);
        }
    }

    ionViewDidLoad() {
        this.getStation();
        this.getReservoirLevel();
    }
    
    ionViewDidLeave() {
        clearInterval(this.intervalLoadChart);
        clearInterval(this.intervalLoadReservoirLevel);
        console.log('ionViewDidLeave');
    }

    ngOnInit() {

    }

}
