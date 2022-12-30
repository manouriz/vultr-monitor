/*
	Created by Manouriz
	https://github.com/manouriz/vultr-monitor
	Version 1.0.3

*/

// -------- js
//document.body.style.border = "3px solid green";
const colors = ['#e6194B', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', '#ffe119'];
function load_data(callback){
	var lst_servers = $(".lst_box.servers").find(":checked").map(function(i){
		var id = $(this).attr("value");
		var label = $(this).attr("label");
		return {id:id, label:label};		
	}).get();
	//console.log('lst_servers',lst_servers);
	var range_days = $(".lst_box.date_range").find(":checked").val();
	//console.log('range_days',range_days);
	//var url_template = "https://my.vultr.com/_ajax/get_graph.php?SUBID={id}&graphs=server_monitors&period=-"+range_days;
	var url_template = "https://my.vultr.com/_ajax/get_graph.php?SUBID={id}&graphs=all&period=-"+range_days;
	var datas_bdw = [];
	var datas_cpu = [];
	var datas_dsk = [];
	var datas_net = [];
	lst_servers.forEach(function(server){
		var url = url_template.replace("{id}",server.id);
		//console.log('url',url);
		get_url_content(url,function(data){
			//console.log('STR: data[0]',data[0]);
			// sort data
			data[0] = data[0].sort(function(a,b){return a[0]-b[0]});
			data[1] = data[1].sort(function(a,b){return a[0]-b[0]});
			data[2] = data[2].sort(function(a,b){return a[0]-b[0]});
			data[3] = data[3].sort(function(a,b){return a[0]-b[0]});			

			// add to servers data array
			datas_bdw.push({'name':server.label, 'grp': 'bdw', 'data':data[0]});
			datas_cpu.push({'name':server.label, 'grp': 'cpu', 'data':data[1]});
			datas_dsk.push({'name':server.label, 'grp': 'dsk', 'data':data[2]});
			datas_net.push({'name':server.label, 'grp': 'net', 'data':data[3]});					
			
			if(datas_cpu.length == lst_servers.length){
							
				var labels_bdw = [];
				var datasets_bdw = [];
				datas_bdw.forEach(function(item,i){
					labels_bdw = item.data.map(o => o[0]);					
					var dataset = {					
						data: item.data.map(o => o[1]),
						label: item.name,
						borderColor: colors[i],
						backgroundColor: colors[i],
						borderWidth:2,
						pointRadius:1,
						fill: false
					};
					datasets_bdw.push(dataset);
				});
							
				var labels_cpu = [];
				var datasets_cpu = [];
				datas_cpu.forEach(function(item,i){
					labels_cpu = item.data.map(o => o[0]);					
					var dataset = {					
						data: item.data.map(o => o[1]),
						label: item.name,
						borderColor: colors[i],
						backgroundColor: colors[i],
						borderWidth:2,
						pointRadius:1,
						fill: false
					};
					datasets_cpu.push(dataset);
				});				
				
				var labels_dsk = [];
				var datasets_dsk = [];
				datas_dsk.forEach(function(item,i){
					labels_dsk = item.data.map(o => o[0]);					
					var dataset = {					
						data: item.data.map(o => o[1]),
						label: item.name,
						borderColor: colors[i],
						backgroundColor: colors[i],
						borderWidth:2,
						pointRadius:1,
						fill: false
					};
					datasets_dsk.push(dataset);
				});
				
				var labels_net = [];
				var datasets_net = [];
				datas_net.forEach(function(item,i){
					labels_net = item.data.map(o => o[0]);					
					var dataset = {					
						data: item.data.map(o => o[1]),
						label: item.name,
						borderColor: colors[i],
						backgroundColor: colors[i],
						borderWidth:2,
						pointRadius:1,
						fill: false
					};
					datasets_net.push(dataset);
				});
				
				
				callback({
					bdw: {
						grp: 'bdw',
						data: {
							labels: labels_bdw,
							datasets: datasets_bdw
						}
					},
					cpu: {
						grp: 'cpu',
						data: {
							labels: labels_cpu,
							datasets: datasets_cpu
						}
					},
					dsk: {
						grp: 'dsk',
						data: {
							labels: labels_dsk,
							datasets: datasets_dsk
						}
					},
					net: {
						grp: 'net',
						data: {
							labels: labels_net,
							datasets: datasets_net
						}
					}				
				});
				
				
			}
		});
	});

	
	
}

function init_charts(){
	
	$(".container_charts *").remove();	
	$(".container_charts").append('<canvas id="chart_bdw" class="chart"></canvas>');
	$(".container_charts").append('<canvas id="chart_cpu" class="chart"></canvas>');
	$(".container_charts").append('<canvas id="chart_dsk" class="chart"></canvas>');
	$(".container_charts").append('<canvas id="chart_net" class="chart"></canvas>');

	$(".container_charts").removeClass("grid-full").removeClass("grid-half").removeClass("grid-allinrow");
	var chart_size = 'grid-' + $(".lst_box.chart_size input:checked").val();
	$(".container_charts").addClass(chart_size);

	load_data(function(item){
		var conf_bdw = load_config(item.bdw.grp,item.bdw.data);
		var conf_cpu = load_config(item.cpu.grp,item.cpu.data);
		var conf_dsk = load_config(item.dsk.grp,item.dsk.data);
		var conf_net = load_config(item.net.grp,item.net.data);
		
		if($(".lst_box.charts #id_bdw:checked").val()){new Chart(document.getElementById('chart_bdw'),conf_bdw)};
		if($(".lst_box.charts #id_cpu:checked").val()){new Chart(document.getElementById('chart_cpu'),conf_cpu)};
		if($(".lst_box.charts #id_dsk:checked").val()){new Chart(document.getElementById('chart_dsk'),conf_dsk)};
		if($(".lst_box.charts #id_net:checked").val()){new Chart(document.getElementById('chart_net'),conf_net)};		
	});
}

$(document).ready(function() {
    console.log( "ready!" );
	draw_settings();
	load_settings();
	//init_chart();
});


function get_url_content(url,callback){
	console.log('Getting url content: ',url);
	$.getJSON(url, function(data,error) {
		//console.log('Data from JSON loaded.');
		var data_bdw = data["graph_result_map"]["monthly_bandwidth"]["flot_data"][0]["data"]; // Bytes received
		var data_cpu = data["graph_result_map"]["cpu"]["flot_data"][0]["data"];
		//var data_dsk = data["graph_result_map"]["disk_ops"]["flot_data"][0]["data"];// read
		var data_dsk = data["graph_result_map"]["disk_ops"]["flot_data"][1]["data"]; // write
		var data_net = data["graph_result_map"]["network"]["flot_data"][0]["data"]; // Input
		callback([data_bdw,data_cpu,data_dsk,data_net]);
	})
	.fail(function(jqXHR, textStatus, errorThrown) { console.log('getJSON request failed! ' + textStatus); });
}

function draw_settings(){
	console.log('Drawing Settings bar.');
	var lst_servers = $(".table-row .checkboxcheckmark").map(function(i){
		var id = $(this).val().substring(2);
		var label = $("a.vpsdesc").get(i).innerText;
		return {id:id, label:label};		
	}).get();
	var html = '';
	html += '<table class="settings">';
	html += '	<tr>';
	// draw servers list
	html += '		<td>';
	html += '			<p>Servers List</p>';
	html += '			<div class="lst_box servers">';
	lst_servers.forEach(function(server){
		html += '				<div><input type="checkbox" id="id_' + server.id + '" value="' + server.id + '" label="' + server.label + '"><label for="id_' + server.id + '">' + server.label + '</label></div>';
	});
	html += '			</div>';
	html += '			<div><a href="#" class="btn_all">Select All</a> | <a href="#" class="btn_none">None</a> | <a href="#" class="btn_invert">Invert</a></div>';
	html += '		</td>';
	// draw charts selection
	html += '		<td>';
	html += '			<p>Charts</p>';
	html += '			<div class="lst_box charts">';
	html += '				<div><input type="checkbox" id="id_bdw" value="bdw" checked><label for="id_bdw">Bandwidth Usage</label></div>';
	html += '				<div><input type="checkbox" id="id_cpu" value="cpu" checked><label for="id_cpu">CPU Usage</label></div>';
	html += '				<div><input type="checkbox" id="id_dsk" value="dsk" checked><label for="id_dsk">DISK Writes</label></div>';
	html += '				<div><input type="checkbox" id="id_net" value="net" checked><label for="id_net">NETWORK Input</label></div>';
	html += '			</div>';
	html += '			<div><a href="#" class="btn_all">Select All</a> | <a href="#" class="btn_none">None</a> | <a href="#" class="btn_invert">Invert</a></div>';
	html += '		</td>';
	// draw Date-range selection
	html += '		<td>';
	html += '			<p>Time Range</p>';
	html += '			<div class="lst_box date_range">';
	html += '				<div><input type="radio" name="lst_range" id="id_1days" value="1days" checked><label for="id_1days">Last 24 Hours</label></div>';
	html += '				<div><input type="radio" name="lst_range" id="id_3days" value="3days"><label for="id_3days">Last 3 Days</label></div>';
	html += '				<div><input type="radio" name="lst_range" id="id_7days" value="7days"><label for="id_7days">Last 7 Days</label></div>';
	html += '				<div><input type="radio" name="lst_range" id="id_1months" value="1months"><label for="id_1months">Last 30 Days</label></div>';
	html += '			</div>';
	html += '		</td>';
	// draw Chart size
	html += '		<td>';
	html += '			<p>Chart Size</p>';
	html += '			<div class="lst_box chart_size">';
	html += '				<div><input type="radio" name="lst_size"  id="id_full" value="full"><label for="id_full">Large (Full page width)</label></div>';
	html += '				<div><input type="radio" name="lst_size"  id="id_half" value="half" checked><label for="id_half">Medium (Half page width)</label></div>';
	html += '				<div><input type="radio" name="lst_size"  id="id_allinrow" value="allinrow"><label for="id_allinrow">Small (All in a row)</label></div>';
	html += '			</div>';
	html += '		</td>';
	// draw TD to fit columns
	html += '		<td><a id="show_charts" class="button btn-sm">Show Charts</a></td>';
	html += '	</tr>';
	html += '</table>';
	
	$("#header1_0").append('<div class="container_settings">').append(html);
	$("#header1_0").append('<div class="container_charts">');

	$("#show_charts").click(function() {
		init_charts();
		save_settings();
	});

	$(".btn_all").click(function() {
		$(this).closest("td").find("input").prop("checked", true);
	});
	$(".btn_none").click(function() {
		$(this).closest("td").find("input").prop("checked", false);
	});
	$(".btn_invert").click(function() {
		$(this).closest("td").find("input").each(function(){
			$(this).is(":checked") ? $(this).prop('checked', false) : $(this).prop('checked', true);
		});
	});

}

function save_settings(){
	var servers = [];
	$(".lst_box.servers input:checked").each(function(){
		var val = $(this).attr("value");
		servers.push(val);
	});

	var charts = [];
	$(".lst_box.charts input:checked").each(function(){
		var val = $(this).attr("value");
		charts.push(val);
	});

	var date_range = $(".lst_box.date_range input:checked").val();
	var chart_size = $(".lst_box.chart_size input:checked").val();

	var settings = {
		servers: servers,
		charts: charts,
		date_range: date_range,
		chart_size
	};

	//console.log("Settings",settings);

	localStorage.setItem('settings', JSON.stringify(settings));
}

function load_settings(){
	console.log('Loading settings...');
	var settings_str = localStorage.getItem('settings');
	if(settings_str != undefined){
		settings = JSON.parse(settings_str);
		console.log("settings",settings);	
		if(settings.servers != undefined){
			settings.servers.forEach(function(id){
				$(".lst_box.servers input[id='id_" + id + "']").prop("checked", true);
			});
		}
		if(settings.charts != undefined){
			$(".lst_box.charts input:checked").prop("checked", false); // clear checked options
			settings.charts.forEach(function(id){
				$(".lst_box.charts input[id='id_" + id + "']").prop("checked", true);
			});
		}
		if(settings.date_range != undefined){
			$(".lst_box.date_range input[id='id_" + settings.date_range + "']").prop("checked", true);
		}
		if(settings.chart_size != undefined){
			$(".lst_box.chart_size input[id='id_" + settings.chart_size + "']").prop("checked", true);
		}
	}
	
}