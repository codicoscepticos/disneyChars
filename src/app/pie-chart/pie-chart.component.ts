import { ChangeDetectionStrategy, Component } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Char } from '../interfaces/Char';
HC_exporting(Highcharts);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent {
  constructor(){}
  
  Highcharts:typeof Highcharts = Highcharts;
  chartOptions:Highcharts.Options = {
    chart: {
        backgroundColor: '#f9f9f9',
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 45
        }
    },
    title: {
        text: 'Film Appearance',
        align: 'center'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    tooltip: {
        pointFormat: (
          '{series.name}: <b>{point.percentage:.1f}%</b>' +
          '<br>{point.options.custom.filmsHtml}'
        )
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        },
        series: {
          keys: ['name', 'y', 'custom.filmsHtml'],
        }
    },
    series: [{
        type: 'pie',
        name: 'Films',
        data: [null]
    }]
  };
  public chart:Highcharts.Chart|null = null;
  
  ngOnInit(){}
  
  static chartPointByChar(char:Char){
    let films:string[] = char.films;
    let filmsLength = films.length;
    let htmlFilms = (filmsLength > 0) ? '• ' + films.join('<br>• ') : '';
    
    const point = [ // TODO ChartPoint interface
      char.name,
      filmsLength,
      htmlFilms
    ];
    return point;
  }
  
  chartCallback = (chart:Highcharts.Chart) => {
    if (!this.chart) this.chart = chart;
  }
  
  updateChartData(chars:Char[]) {
    let chart = this.chart;
    if (!chart) return;
    
    const data:any[] = chars.map(PieChartComponent.chartPointByChar);
    const options:Highcharts.Options = {
      series: [{
        type: 'pie',
        name: 'Films',
        data
      }]
    };
    chart.update(options);
  }
}
