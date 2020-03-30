import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  corporateCount = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: '# of Corporates/NGOs Engaged'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Line 1',
        data: [12, 27, 53]
      }
    ]
  } as any);
  volunteerCount = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: '# of Volunteers/Individuals Engaged'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Line 1',
        data: [123, 223, 468]
      }
    ]
  } as any);
  foodPackets = new Chart({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: '# of food packets/rations distributed to parties'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Tahsildar',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'Circle Inspector',
            y: 11.84
        }, {
            name: 'NGOs',
            y: 10.85
        }, {
            name: 'Collector',
            y: 4.67
        }, {
            name: 'Corporates',
            y: 4.18
        }, {
            name: 'Others',
            y: 7.05
        }]
    }]
  } as any);
  medicalEmergencies = new Chart({
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: '# of Medical Emergencies'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Emergencies',
        colorByPoint: true,
        data: [{
            name: 'Active',
            y: 942,
            sliced: true,
            selected: true
        }, {
            name: 'Cured/Discharged/Migrated',
            y: 100
        }, {
            name: 'Death',
            y: 29
        }]
    }]
  } as any);
  csrFunds = new Chart({
    chart: {
        type: 'column'
    },
    title: {
        text: '# of CSR Funds Spent'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rainfall (mm)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'CSR Funds',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }]
  } as any)
  constructor() { }

  ngOnInit(): void {
  }

}
