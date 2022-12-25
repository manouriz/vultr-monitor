// -------- divs
$("#header1_0").append('<div class="container_chart_bdw">');
var lst_range = document.createElement("select");
lst_range.id = "lst_range";
lst_range.setAttribute("class","lst");
lst_range.add(new Option('Last 24 Hours','1days'));
lst_range.add(new Option('Last 3 Days','3days'));
lst_range.add(new Option('Last 7 Days','7days'));
lst_range.add(new Option('Last 30 Days','1months'));
$("#header1_0").append(lst_range);
$("#lst_range").change(function() {
  init_chart();
});
$("#header1_0").append('<div class="container_charts">');

// -------- js
document.body.style.border = "3px solid green";
const colors = ['#e6194B', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', '#ffe119'];
function load_data(callback){
	var lst_servers = $(".table-row .checkboxcheckmark").map(function(i){
		var id = $(this).val().substring(2);
		var label = $("a.vpsdesc").get(i).innerText;
		return {id:id, label:label};		
	}).get();
	//console.log('lst_servers',lst_servers);
	var range_days = $("#lst_range").find(":selected").val();
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
			//console.log('data',data);
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

function init_chart(){
	$(".container_chart_bdw *").remove();
	$(".container_chart_bdw").append('<canvas id="chart_bdw" class="chart"></canvas>');
	
	$(".container_charts *").remove();	
	$(".container_charts").append('<canvas id="chart_cpu" class="chart"></canvas>');
	$(".container_charts").append('<canvas id="chart_dsk" class="chart"></canvas>');
	$(".container_charts").append('<canvas id="chart_net" class="chart"></canvas>');

	load_data(function(item){
		var conf_bdw = load_config(item.bdw.grp,item.bdw.data);
		var conf_cpu = load_config(item.cpu.grp,item.cpu.data);
		var conf_dsk = load_config(item.dsk.grp,item.dsk.data);
		var conf_net = load_config(item.net.grp,item.net.data);
		
		new Chart(document.getElementById('chart_bdw'),conf_bdw);
		new Chart(document.getElementById('chart_cpu'),conf_cpu);
		new Chart(document.getElementById('chart_dsk'),conf_dsk);
		new Chart(document.getElementById('chart_net'),conf_net);		
	});
}

$(document).ready(function() {
    console.log( "ready!" );
	init_chart();
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

