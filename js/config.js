/*
	Created by Manouriz
	https://github.com/manouriz/vultr-monitor

*/

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

