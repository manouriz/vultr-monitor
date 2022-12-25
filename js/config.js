// <block:actions:2>
const actions = [
  {
    name: 'Randomize',
    handler(chart) {
      chart.data.datasets.forEach(dataset => {
        dataset.data = Utils.numbers({count: chart.data.labels.length, min: -100, max: 100});
      });
      chart.update();
    }
  },
  {
    name: 'Add Dataset',
    handler(chart) {
      const data = chart.data;
      const dsColor = Utils.namedColor(chart.data.datasets.length);
      const newDataset = {
        label: 'Dataset ' + (data.datasets.length + 1),
        backgroundColor: Utils.transparentize(dsColor, 0.5),
        borderColor: dsColor,
        data: Utils.numbers({count: data.labels.length, min: -100, max: 100}),
      };
      chart.data.datasets.push(newDataset);
      chart.update();
    }
  },
  {
    name: 'Add Data',
    handler(chart) {
      const data = chart.data;
      if (data.datasets.length > 0) {
        data.labels = Utils.months({count: data.labels.length + 1});

        for (let index = 0; index < data.datasets.length; ++index) {
          data.datasets[index].data.push(Utils.rand(-100, 100));
        }

        chart.update();
      }
    }
  },
  {
    name: 'Remove Dataset',
    handler(chart) {
      chart.data.datasets.pop();
      chart.update();
    }
  },
  {
    name: 'Remove Data',
    handler(chart) {
      chart.data.labels.splice(-1, 1); // remove the label first

      chart.data.datasets.forEach(dataset => {
        dataset.data.pop();
      });

      chart.update();
    }
  }
];
// </block:actions>

// <block:setup:1>
// data
// </block:setup>

// <block:config:0>
function load_config(grp,data){
	var range_days = $("#lst_range").find(":selected").val();
	var unit = 'day';
	switch(range_days){
		case '1days': unit = 'hour' ;break;
		case '3days': unit = 'day' ;break;
		case '7days': unit = 'day' ;break;
		case '1months': unit = 'day' ;break;	
	}
	if(grp == 'bdw'){
		unit = 'day';
	}
		
	var y = {};
	if(grp == 'net' || grp == 'bdw'){
		y = {
			ticks: {
				callback: function(value, index, ticks) {
					if(value>1000000000){
						return Math.round(value/1024000000*100)/100 + ' Gbps';
					}else if(value>1000000){
						return Math.round(value/1024000*100)/100 + ' Mbps';
					}else{
						return Math.round(value/1024*100)/100 + ' Kbps';
					}
				}
			}
		};
	}else if(grp == 'cpu'){
		y = {
			ticks: {
				callback: function(value, index, ticks) {
					return value + '%';
				}
			}
		};
	}
	
	var title = '';
	switch(grp){
		case 'bdw': title = 'Usage Chart Bandwidth (Bytes received)'; break;
		case 'cpu': title = 'Usage Chart CPU'; break;
		case 'dsk': title = 'Usage Chart DISK Write'; break;
		case 'net': title = 'Usage Chart NETWORK (Input)'; break;	
	}
	
	return {
	  type: 'line',
	  data: data,
	  options: {
		responsive: true,
		plugins: {
		  legend: {
			position: 'top',
		  },
		  title: {
			display: true,
			text: title
		  }
		},
        scales: {
            x: {
                type: 'time',
                time: {
                    /*
					displayFormats: {
                        quarter: 'hh dd'
						
                    }
					*/
					unit: unit									
                }
            },
			y: y			
        }	
	  }
	};
}
// </block:config>

