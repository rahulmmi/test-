var mmisub =['mt0', 'mt1', 'mt2', 'mt3', 'mt4', 'mt5'],attb="<span>Map Data © MapmyIndia &nbsp;<a style='cursor:pointer;color: #212121;margin-right: 5px;' onclick=\"$('.whatsnewWidgetSec').show();$('.whatsnewList').scrollTop(0);\"><u>Version 9.6.6</u></a><a style='cursor:pointer;color:#369CF5' onclick=\"var url='place-report@zdata='+btoa(map.getCenter().lat+'+'+map.getCenter().lng+'+'+map.getZoom()+'++');writeReport(url);\" id='report_I' ><u>Report Issue</u></a></span>",
map_type=1,traffic_type=0,traffic_report=0,set_url ='',dy_urls,dymap_tile=[],
trffic_t=0,weather_tile=0,weather_ts=0,sat_active='';
var glblll=0, forceL=false,hondaZoom=0;
var forcecross=0;
var fcnt=1;
var showfl=0;
var filter_str_new="";
var fltr_aud=1;


var maps = 
{
    map_click_url:'',
    def_url:'',
    current:'',
    def_locality:"delhi",
    near_js:0,
    set_tile:function(tileType,load)
    {debugger;
      
       if(tileType=="map_default") dy_urls='["https:\/\/{s}.mapmyindia.com\/advancedmaps\/v1\/{key}\/still_map\/{z}\/{x}\/{y}.png"]';
       else dy_urls= document.getElementById(tileType).getAttribute("dyurls");
    
        if(dymap_tile){
        for (var index = 0; index < dymap_tile.length; index++) {
                if(dymap_tile[index]){
                    map.removeLayer(dymap_tile[index]);
                }  
            }
        }

        if(dy_urls){
            dy_urls=JSON.parse(dy_urls);
            for (var index = 0; index < dy_urls.length; index++) {
                var durl=dy_urls[index].replace("{key}",map_key);
        
                  if(tileType=='map_satellite'){

                    dymap_tile[index]=  new L.tileLayer(durl,{attribution: attb.replace("MapmyIndia"," MapmyIndia, Satellite Ã‚Â© Bhuvan (NRSC)"),maxZoom: 17,  minZoom: 4,subdomains:mmisub});
                    sat_active=1;
                }
                else{
                    if(tileType=='map_default')
                    { 
                         dymap_tile[index]=L.mapboxGL();$(".leaflet-control-attribution").html('<div><img src="images/mmilogo.png" alt="MapmyIndia.com" title="MapmyIndia.com" id="watermark_logo"></div>'+attb);
                                  $(".leaflet-tile-pane").css('z-index', 500);
                          }
                    else

                    {
                    dymap_tile[index]=  new L.tileLayer(durl,{attribution: attb,maxZoom: 19,  minZoom: 4,subdomains:mmisub});
                     $(".leaflet-tile-pane").css('z-index', 200);
                    }
                    sat_active='';

                }
                map.addLayer(dymap_tile[index]);
            }
           
            
            if($("#traffic_show").is(':checked')==true) {
                map.addLayer(trffic_t);
                trffic_t.bringToFront();
            };
            if(tileType=='map_default'){
                $("#watermark_logo").attr("src","images/mmilogo.png");
            }else{
                $("#watermark_logo").attr("src","images/watermark_hybrid.png");
            }  
            $(".mapStyleBlock").removeClass('active');
            $("#"+tileType+" .mapStyleBlock").addClass('active');
        }

           
        $("#layer_panel_sec").removeClass("layer_panel_pos");
        if(!load && !map_type) maps.set_current('',map.getCenter());
        if(map.hasLayer(trffic_t)) {map.removeLayer(trffic_t);traffic.display();}
      
    },
    manual_drg:0,layerMarker:[],
    tiles:function()
    {
    var url = window.location.toString().split('/');var curUrl = url.slice(-1)[0];
        var tl_rq=curUrl.match("@(.*)zdata"),tls_rq='map_default',ttr=[];
        if(tl_rq)
        {
            if(tl_rq[1].indexOf(',')>=1)
            {
                var ttr=conv(tl_rq[1],'decode').split(',');
                if(ttr[3]==2) tls_rq='b_t';
                else if(ttr[3]==3) tls_rq='map_satellite';else if(ttr==4) tls_rq='map_indic';
                if(ttr[0]) map_lat=ttr[0]; if(ttr[1]) map_lng=ttr[1]; if(ttr[0]) map_zm=ttr[2]; 
            }
        }
        //map = new L.Map('map', { zoomControl: false}).setView([map_lat, map_lng], map_zm); 
        map = new L.Map('map', { zoomControl: false,minZoom:3,maxZoom:22}).setView([map_lat, map_lng], map_zm);
        
        maps.set_tile(tls_rq,1);
        L.control.scale().addTo(map);
        if(ttr!=undefined){
        if(parseInt(ttr[4])){$('#traffic_show').trigger('click');traffic.display();}/*show traffic & weather onload*/
        if(parseInt(ttr[5])){ window.setTimeout(function (){maps.weather('temp',1);},1000);}
        if(parseInt(ttr[6])){ window.setTimeout(function (){ maps.pano('','','',1);maps.pano_status=1;},1000);}
        }   
    
  /*  var lay_mrkers='';
        var iconL = L.divIcon({className: 'bbfont',html:"<div class='multiLevelTrig'><img src='images/ic_multi_floor.png' style='width:34px'><div class='pulse'></div></div>", iconAnchor: [17, 5],popupAnchor: [0, -33]});
        maps.layerMarker[0] = L.marker([28.542363,77.156028], {icon: iconL,id:"Dlf Promenade",name:"Dlf Promenade, New Delhi"});
        maps.layerMarker[1] = L.marker([28.614557,77.243296], {icon: iconL,id:"autoexpo",name:"Auto Expo 2020, Pragati Maidan, New Delhi"});
        maps.layerMarker[2] = L.marker([28.463059,77.497757], {icon: iconL,id:"expomart",name:"Auto Expo 2020, India Expo Mart, Greater Noida"});
        maps.layerMarker[3] = L.marker([13.062753,77.474869], {icon: iconL,id:"BIEC Hall",name:"BIEC Hall, Bangalore"});
        
        lay_mrkers = new L.featureGroup(maps.layerMarker);
        if(map_zm>14) map.addLayer(lay_mrkers);*/
       /* 
        lay_mrkers.on("click", function (event) {
            var cord = event.layer._latlng,name=event.layer.options.name;
            if() var name = 'Dlf Promenade'; else var name = 'EXCON 2019'; 
            var html = '<div id="myModal" class="modal add-place-modal fade in" role="dialog" style="display:block">'
              +'<div class="modal-dialog">'
                +'<!-- Modal content-->'
                +'<div class="modal-content">'
                  +'<div class="modal-header">'
                    +'<button type="button" class="close addp-back-btn" data-dismiss="modal" onclick="$(\'#error_modal\').hide()">&times;</button>'
                    +'<h4 class="modal-title">'+name+'</h4>'
                  +'</div>'
                  +'<div class="modal-body">'
                      +'<div class="multiLevel-body">'
                      +'<iframe allowfullscreen allow="geolocation;" src="https://www.mapmyindia.com/api/advanced-maps/doc/sample/map_sdk/map?lat='+cord.lat+'&lng='+cord.lng+'&zoom=16&host=pod'+'"  allowfullscreen></iframe>'
                      +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>'
            +'</div>';
            $("#error_modal").html(html).show().delay(500);
        });     
 */
/*    map.on('zoomend', function(e) {
        if(lay_mrkers) map.removeLayer(lay_mrkers);
            if(map.getZoom()>16) map.addLayer(lay_mrkers);
            if(sat_active==1 && map.getZoom()>17) map.setZoom(17);
            /*if(maps.click_marker)map.removeLayer(maps.click_marker); 
            var url = window.location.toString().split('/');
            var curUrl = url.slice(-1)[0];
            
        });  */

        map.on('dragend', function(e) 
        { 
            maps.set_current(e,map.getCenter());$(".ft-layer-link").hide();
            /*if(maps.click_marker)map.removeLayer(maps.click_marker); */
            var url = window.location.toString().split('/');
            var curUrl = url.slice(-1)[0];
            if (curUrl.indexOf('add-a-place') !== -1 || curUrl.indexOf('add-a-business') !== -1) 
            {
                map.closePopup();
                try
                {
                    uap_tap_action();
                    /*if(curUrl.indexOf('add-a-business') !== -1) 
                    {
                        $(".buttonDiv").hide();
                        return false;
                    }*/
                }catch(e){}
            }
            if (curUrl.indexOf('my-world-data=d29ybGQ=ed') !== -1) 
            {
                getListContent(uname,'d29ybGQ=',1)
            }
            if (curUrl.indexOf('place-') !== -1 || curUrl.indexOf('-near-') !== -1) 
            {
                var data=curUrl.split('data='),data_arr=atob(data[1].replace(/ed(?=[^ed]*$)/, '')).split('+');
                var cat_n=data[0].split('-');
                if(data_arr[4] &&data_arr[5]=='el' ){ 
                maps.near_search(data_arr[4],'','',1,'',cat_n[1]);maps.manual_drg=2;
                }
            }
            if((glb_rep==1 || mul_report_apnd) && !$('#traffic_control').hasClass('active')) 
            {
                if(map.getZoom()>10) {
                    glb_rep=1;
                    (mul_report_apnd ? get_report('click','', mul_report_apnd) : get_report('click','401','401'));
                }
                else
                {
                    glb_rep='';
                    if(report_m) map.removeLayer(report_m);
                    report_m='';
                    $(".rpp_spn").html("Report");
                    $("#loader").hide();
                    return false; 
                }
            }
            if($('#traffic_control').hasClass('active')) 
            {   
                //glb_rep==1
                //get_report('click','401','401');
                traffic.newQueryTraffic();
                traffic.isTrafficLayerOn = 0;
            }
            if(xyzzz && curUrl.indexOf('current-location')==-1) 
            {
                $('#geo_location').removeClass('active');if(maps.watchId) navigator.geolocation.clearWatch(maps.watchId);
            }
            if($('#side_3').css('display') != 'none' && curUrl.indexOf('get-eLoc')!=-1) 
            {
                addGetEloc();
            }
            $("#layer_panel_sec").removeClass("layer_panel_pos");
        });

        map.on('moveend', function(e) 
        {
               hondaZoom= map.getZoom();
 
            $('#success_sec').hide();
            var url = window.location.toString().split('/'),curUrl = url.slice(-1)[0];
            if (curUrl.indexOf('my-world-data=d29ybGQ=ed') !== -1) getListContent(uname,'d29ybGQ=',1); 
            else if (curUrl.indexOf('place-') !== -1 || curUrl.indexOf('-near-') !== -1) 
            { 
                if((!maps.manual_drg && e.hard==false && !drag)|| maps.manual_drg==2){ 
                var data=curUrl.split('data='),data_arr=atob(data[1].replace(/ed(?=[^ed]*$)/, '')).split('+');
                var cat_n=data[0].split('-');
                if(data_arr[3]){
                if(data_arr[4] && data_arr[5]=='el' && !near_state && $("#auto").val()){maps.near_search(data_arr[4],'','',1,'',cat_n[1]);}
                }else {maps.manual_drg=0;drag=0; }
                }   
            }
            else if(maps.pano_status==1) maps.pano('','','',1);
            if($('#traffic_control').hasClass('active'))
            {
                traffic.newQueryTraffic();
                traffic.isTrafficLayerOn = 0;
                if((glb_rep==1 || mul_report_apnd) && map.getZoom()>9) {
                    glb_rep=1;
                    (mul_report_apnd ? get_report('click','', mul_report_apnd) : get_report('click','401','401'));
                }
                else
                {
                    glb_rep='';
                    if(report_m) map.removeLayer(report_m);
                    report_m='';
                    $(".rpp_spn").html("Report");
                    $("#loader").hide();
                    return false;
                }
            }
            if((glb_rep==1 || mul_report_apnd) && !$('#traffic_control').hasClass('active')) 
            {
                if(map.getZoom()>9) {
                    glb_rep=1;
                    (mul_report_apnd ? get_report('click','', mul_report_apnd) : get_report('click','401','401'));
                }
                else
                {
                    glb_rep='';
                    if(report_m) map.removeLayer(report_m);
                    report_m='';
                    $(".rpp_spn").html("Report");
                    $("#loader").hide();
                    return false; 
                }
            }
            if(xyzzz && last_click!='gloc' && locationOn!='true' && curUrl.indexOf('@')!==0 && curUrl!='' && curUrl.indexOf('current-location')==-1) 
            {
                map.removeLayer(xyzzz);map.removeLayer(marker_cur);$('#geo_location').removeClass('active');
                if(maps.watchId) navigator.geolocation.clearWatch(maps.watchId);
            }
            if($('#side_3').css('display') != 'none' && curUrl.indexOf('get-eLoc')!=-1) 
            {
                addGetEloc();
            }
         
        });
        /*map.on('dblclick', function(e) {maps.click_context(e.latlng);});*/
        $(".panel-primary").click(function(){$(".as-results").hide();   });
        map.on('contextmenu', function(e) {if(curUrl.indexOf('hondaAssistShareLocation')== 0) return false;if(curUrl.indexOf('add-a-') != -1) return false;if(curUrl.indexOf('corona')!==0 && curUrl.indexOf('add-a-') !==0) maps.click_context(e.latlng);});
        map.on('click', function(e) {$("#map").focus();var url = window.location.toString().split('/');var curUrl = url.slice(-1)[0];if (curUrl.indexOf('add-a-') !== -1 && mobilecheck()) {return false;maps.click_context(e.latlng);}$(".as-results").hide();$(".ft-layer-link").hide();$("#near_sugg_tab").click(); $("#layer_panel_sec").removeClass("layer_panel_pos");$("#weather_panel_close").click();});
        map.on('dragstart', function (e) {
            var url = window.location.toString().split('/'),curUrl = url.slice(-1)[0];
             if(curUrl.indexOf('get-eLoc')!=-1 ) {
                $('#show_eloc_sec,.digi-move').hide();
                $('#success_sec').hide();
            }
        });
    },
    uri:function()
    {
        var url = window.location.toString().split('/');return url.slice(-1)[0];
    },
    
    popup_click:0,
    click_marker:0,
    click_context:function(latlng,act)
    {
        if(mobilecheck()) try{navigator.vibrate(50);}catch(e){}
        var url = window.location.toString().split('/');
        var curUrl = url.slice(-1)[0];
        var clicked=latlng;
        var icon_click_m = L.divIcon({className: 'bbfont',html:"<img src='images/general.png' style='width:34px'>", iconAnchor: [15, 45],popupAnchor: [0, -33]});
        if (curUrl.indexOf('add-a-') !== -1 ) 
        {
            return false;
            if(maps.click_marker) 
            {
                map.removeLayer(maps.click_marker);
            }
            maps.click_marker = new L.Marker(new L.LatLng(parseFloat(clicked.lat), parseFloat(clicked.lng)), {icon: icon_click_m,draggable:true});
            map.addLayer(maps.click_marker);
            maps.click_marker.on("dragend", function(event) 
            {
                var position = event.target.getLatLng();
                $.ajax({url: "get_click_revg?"+position.lat+"&"+position.lng+"&"+map.getZoom()+"&"+'2'}).done(function(data) 
                {
                    var decode = JSON.parse(data);
                    var placeData= decode.user_add_place.split('|');
                    var placeName = placeData[2];
                    var placeAdr = placeData[19].split('.');
                    var placeDis = 'Selected location is <strong>'+placeData[18]+' mtrs</strong> away from';
                    window.setTimeout(function () 
                    {
                        $('.search-addp-map-result').show();
                        $('.addp-dis').html(placeDis);
                        $('.addp-name').text(placeName);
                        $('.addp-addr').text(placeAdr[0]);
                        $('#addpauto').val(placeName);
            $('.place_data').text(decode.user_add_place);
                    },20 );
                });
                maps.click_marker.setLatLng(position);
                map.setView(maps.click_marker.getLatLng(),map.getZoom()); 
            });
            $.ajax({url: "get_click_revg?"+clicked.lat+"&"+clicked.lng+"&"+map.getZoom()+"&"+'2'}).done(function(data) 
            {
                var decode = JSON.parse(data);
                var placeData= decode.user_add_place.split('|');
                var placeName = placeData[2];
                var placeAdr = placeData[19].split('.');
                var placeDis = 'Selected location is <strong>'+placeData[18]+' mtrs</strong> away from';
                window.setTimeout(function () 
                {
                    $('.search-addp-map-result').show();
                    $('.addp-dis').html(placeDis);
                    $('.addp-name').text(placeName);
                    $('.addp-addr').text(placeAdr[0]);
                    $('#addpauto').val(placeName);
            $('.place_data').text(decode.user_add_place);
                },20 );
            });
        }
        else
        { 
           
            if(maps.map_click_url) maps.map_click_url.abort();
            $('.as-results').hide(100);
            if(maps.popup_click) map.removeLayer(maps.popup_click);
            if(maps.click_marker) map.removeLayer(maps.click_marker);
            if(!act){
                notify("Loading please wait..",1,1);
                
                window.setTimeout(function () 
                {
                    if(maps.click_marker) map.removeLayer(maps.click_marker);
                    maps.click_marker = new L.Marker(new L.LatLng(parseFloat(clicked.lat), parseFloat(clicked.lng)), {icon: icon_click_m}).addTo(map);
                },20 ); 
            }   
                maps.map_click_url=$.ajax({url: "get_click_revg?en",type: 'POST',data:en.code({'lat':clicked.lat,'lng':clicked.lng,'z':map.getZoom(),'pp':2})}).done(function(data) 
                {
                    if(data=='[]') {window.location.reload();return false;}
                    if(data.trim()!='' && data.trim()!='undefined')
                    {  
                        var json = JSON.parse(data);
                        if(act){if(json.address) get_place_details(json.address);}
                        else 
                        {
                            var f_text = reportPopup(json,clicked.lat,clicked.lng,1);
                            
                            window.setTimeout(function () {
                            maps.click_marker.bindPopup("<div id='click_div_pop' >"+f_text+"</div>",{className:"simple_pop",autoClose: false}).openPopup();
                            maps.click_marker.on('popupclose', function() 
                                {window.setTimeout(function () { map.removeLayer(maps.click_marker); },10 ); });
                           },20);
                           notify('');
                        }
                    }
                });
        }
    },
    pano_status:0,
    feedback:function(check)
    {
        $('#add_new_list').load('send_feedback').show();
        pushy('hide');$("#f_email").focus();if(uname){$("#f_email").val(uemail);$("#feed_back").focus();}else{ $("#f_email").val(''); }
    },

    /***geolocation*/
    ly : "",
    lx : "",
    ac :"",
    rev_url:"",
    gt_loc:0,

    displayPosition:function(position,mapObj,triggerId) 
    {   
        $(".load-geo").hide();    
        maps.ly = position.coords.latitude;
        maps.lx = position.coords.longitude;   
        maps.ac = position.coords.accuracy;
        maps.current = maps.ly+','+maps.lx;
        var radius = maps.ac / 2;
        if(radius>2000) radius=2000;
        if(maps.ly.toString().indexOf('.')==-1) {if(curl_loc_bt==0)  show_error("Invalid Location information."); return false}
        if (maps.ly > 36.261688 || maps.ly < 6.747100)  
        {
            return false;
        }
         maps.manual_drg=2;/*for nearby*/
        if(xyzzz) 
        {
            mapObj.removeLayer(xyzzz);
        }
        var uri=maps.uri();
        if(!uri || curl_loc_bt===0) 
        {
      
            xyzzz = L.circle([maps.ly, maps.lx], radius, {weight: 1, fillOpacity: 0.1,color:'#ccc',fillColor:'#e52629'});
            locationOn = 'true';
            mapObj.addLayer(xyzzz);
            if(!mapObj.hasLayer(marker_cur))            
            { 
                var search = L.divIcon({iconAnchor: [10, 10],className: 'bfont',popupAnchor: [-20,0],html: "<div><div class='cur_loc'></div></div>"});
                marker_cur = L.marker([maps.ly,maps.lx], {icon: search}).bindPopup("<div id='click_div_pop' ><center><img src='images/load.gif' style='width:20px;margin-left:0px'></center></div>",{className:'popup_class simple_pop',closeButton:true});
                marker_cur.on('click', function(e)
                {
                    $.getJSON( "get_click_revg?"+e.latlng.lat+"&"+e.latlng.lng,function(loc)
                    {
                        var html = reportPopup(loc,e.latlng.lat,e.latlng.lng);
                        $('#click_div_pop').html(html);
                    });
                });
                maps.reverseCurrent(radius);
                mapObj.addLayer(marker_cur); 
                if(mapObj.getZoom()==4 || !uri || uri.indexOf('@')===0) mapObj.fitBounds(xyzzz.getBounds());
                else {mapObj.setView(new L.LatLng(maps.ly,maps.lx),mapObj.getZoom());}
            }    
            else if(marker_cur) 
            { 
                marker_cur.setLatLng([maps.ly, maps.lx]).update(); /*set only latlong on move*/
                mapObj.panTo({lon: maps.lx, lat: maps.ly});
            }
              $("#"+triggerId).addClass('active');
              $("#"+triggerId).html('<i class="material-icons"  style="display: inline;">location_searching</i>');
              try{localStorage.setItem('errorCode',"");}catch(e){}
        }
        else maps.reverseCurrent(radius);
      
    },

    reverseCurrent : function(radius,callback)
    { 
        var url = window.location.toString().split('/');var curl = url.slice(-1)[0];
        var zmm=10; if($("#map").length && map) zmm=map.getZoom();
        if(maps.rev_url) maps.rev_url.abort();
        maps.rev_url=$.post( "get_click_revg?en",en.code({'lat':maps.ly,'lng':maps.lx,'z':zmm,'rd':radius}),function(loc)
        { 
            if(loc) 
            {
                var json_loc = "";
                try{json_loc = JSON.parse(loc);}catch(e){}
                if(callback) {callback(json_loc);return true;}
                if(!json_loc || json_loc==1) return false;
                if(json_loc.add_place!='') 
                {
                    maps.def_locality = json_loc.add_place; 
                }
                var rev_n = json_loc.add_place;
                var functions = 'get_place_details(\''+json_loc.address+'\');';
                /*if(divClick != '') $("#"+divClick).val(rev_n);*/
            } 
            if(rev_n != '' && rev_n != undefined)
            {
                if(json_loc.temprature===null){$(".aqiHome").hide();}
                else{
                    if(curl.indexOf('direction')==0){
                    {$(".aqiHome").hide();}
                    }else{
                    $(".aqiHome").show();
                     }
                    $("#htempp").html(json_loc.temprature+"<sup>&#176;</sup>C ");
                    $("#haqi").html("AQI "+json_loc.aqi);
                    $("#weatherIcon").html('<img src="images/weather/move_weather_'+json_loc.weatherIcon+'.png" alt="" />');
                    $("#haqi").css("background", json_loc.colorCodeaqi);
                    $("#haqi").css("border", "1px solid "+json_loc.colorCodeborderaqi);
                    $("#haqi").css("color", json_loc.coloraqi);
                }
                $("#cur_loc_d").html('<i class="material-icons">location_searching</i> <span onclick="'+functions+'" >'+rev_n.replace('Unknown place','Current Location')+'</span>').show(300);
                if(json_loc.temp && !mobilecheck()) $(".cur-temp-sec").html('<div class="text-center cur-temp-item"><div class="tooltip"><span class="tooltiptext">'+json_loc.wx+'</span></div><span class="nearbyImg"><img src="images/weather/'+json_loc.icon+'.png"></span><p>'+json_loc.temp+'<sup>0</sup>C</p></div>');
            maps.def_locality=rev_n; maps.eloc=json_loc.address;
        if(divClick == 'auto_start') { divClick=""; $("#start_dirs").val(maps.lx+','+maps.ly+',');$("#auto_start").val('Current Location');if($("#end_dirs").val() || curl.indexOf('data=')!=-1) { newdr.driving_box('');}}
                else if(divClick == 'auto_end') {divClick="";$("#end_dirs").val(maps.lx+','+maps.ly+',');$("#auto_end").val('Current Location');if($("#start_dirs").val()) newdr.driving_box('');}
            }
        });
    },

    curr_call:0,
    call_current:function(div)
    {       
        /*autosearch current location rev*/
        if(maps.current==maps.ly+","+maps.lx && maps.def_locality!='delhi') 
        {
            $("#"+div).html("<p>"+maps.def_locality+"</p>");
        }
        else
        {
           if(maps.curr_call) maps.curr_call.abort();
           maps.curr_call=$.get('get_click_revg?'+maps.ly+'&'+maps.lx+'&5&loc', function(data_c) {$('#'+div).html("<p>"+data_c+"</p>");});
        }  
    },
    geoperms:1,
    geoloc_error:function(error,mapObj,triggerId)
    { 
        var e_mess=0;$(".load-geo").hide();  
        try{localStorage.setItem('errorCode', error.code);}catch(e){}
        switch(error.code) 
        {
            case error.PERMISSION_DENIED:
                maps.geoperms="denied";
               e_mess = "MapmyIndia does not have permission to view your location. Please change in browser settings!";
                break;
            case error.POSITION_UNAVAILABLE:
                e_mess = "Location information is unavailable. Please tap current location again.";
                break;
            case error.TIMEOUT:
               e_mess = "The request to get location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                e_mess = "Location information not available.";
                break;
        }
        if(!curl_loc_bt) show_error(e_mess);
        $(".load-geo").hide();
        $("#"+triggerId).html('<i class="material-icons">location_disabled</i>');
    },
    set_current:function(e, move_latln)   
    { 
        if(e) var current_zoom = e.target._zoom;else var current_zoom=map.getZoom();
        if(!move_latln) move_latln=map.getCenter();
        var trf_report=0;if($('#traffic_control').hasClass('active')) trf_report=1;
        var weather=0;if($('#weather_panel_trigger').hasClass('active')) weather=1;
        if($(".rpp_spn").html()!='Report') trf_report=trf_report+2;
        var set_url = move_latln.lat.toFixed(6)+","+move_latln.lng.toFixed(6)+","+current_zoom+","+map_type+","+trf_report+","+weather;
        set_url = conv(set_url,'encode');
        var urlContent = breakUrl();
        if(urlContent)
        {
            if(!urlContent[0])
            {
                var newUrl = "@"+set_url+"zdata";
            }
            else if(urlContent[0].indexOf("near-me") !== -1)
            {
                if(urlContent[0].indexOf("place-") == -1)
                {
                    var nr_cat=urlContent[0].replace('-near-me','');maps.near_search(nr_cat);
                }
                else
                {
                    var zData = urlContent[urlContent.length-1].split('=');
                    var newUrl = urlContent[0]+'@'+set_url+'zdata='+zData[1].replace(/ed(?=[^ed]*$)/, '')+"ed";
                }  
            }
            else if(urlContent[0].indexOf("direction-") !== -1 || urlContent[0].indexOf("place-") !== -1)
            {
                var zData = urlContent[urlContent.length-1].split('=');
                var newUrl = urlContent[0]+'@'+set_url+'zdata='+zData[1].replace(/ed(?=[^ed]*$)/, '')+"ed";
            }
        }
        else
        {
            var newUrl = "@"+set_url+"zdata";
        }

        if(move_latln && typeof(newUrl)!='undefined')
        {
            window.history.replaceState('', '', newUrl);
        } 

        if(xyzzz && !$('#res_info').is(':visible')) 
        {
            removeCurrentMarker();
        }
    },
    watchId:0,
    get_current:function(onload,mapObj,triggerId)
    {  /*direct method safetycheck*/
        if(!mapObj) mapObj=map;
        if(!triggerId) triggerId="geo_location";
        curl_loc_bt = onload; 
        var url_nw = window.location.toString().split('/');var curl_nw = url_nw.slice(-1)[0];
        if(curl_nw.indexOf("add-a-place")!==-1 || curl_nw.indexOf("add-a-business")!==-1)
        {
            $("#uap_tap_dv #eloc_tap_dv").hide();
            $("#uap_tap_dv span").show();
        }
        if(curl_loc_bt==0) $(".load-geo").show();
        if (navigator.geolocation) {
            if(onload===0)  $("#"+triggerId).html("<img src='images/loading_small.gif'>");
            if(mobilecheck())
            {
            maps.watchId = navigator.geolocation.watchPosition(function(position){maps.displayPosition(position,mapObj,triggerId);},function(error){maps.geoloc_error(error,mapObj,triggerId);},{timeout:60000,maximumAge:250});
            }
            else
            {
                navigator.geolocation.getCurrentPosition(function(position){maps.displayPosition(position,mapObj,triggerId);},function(error){maps.geoloc_error(error,mapObj,triggerId);},{enableHighAccuracy:true,timeout:60000,maximumAge:250});
            }
        }
    },

    search_eloc_auto:0,
    get_geo:function(id,type)
    {  
        if(!id || $("#"+id).val()=='') return false;
        var str=$("#"+id).val().replace(/\%20/g, '+').replace(/\\/g, '');
        if(str=='') return false;
        var url_n = window.location.toString().split('/');var curl = url_n.slice(-1)[0];
        if(req) req.abort();
        if(id=='auto') auto_load('');
        else $('#'+id).css({"background":"","background-size":"20px"});$('.as-results').hide();
      
        if(type=='geo') {} else {maps.search_eloc_auto=0;}
        
        if(id=='near_what') var r_url="near-what"; else r_url="get-geo";/*r_url="near-new";*/
        str=str.replace(/[\\#+()$~%'":_*?<>{}]/g, '').replace(/&/g,'and').trim();
        req=$.get(r_url+"?id="+id+"&type="+type+"&lat="+(maps.ly?maps.ly:sess_lat[0])+"&lng="+(maps.lx?maps.lx:sess_lat[1])+ "&centerLat=" +map.getCenter().lat + "&centerLng=" +map.getCenter().lng + "&search_eloc_auto="+maps.search_eloc_auto+"&q="+encodeURIComponent(str)+"&uname="+uname,function(geo_result)
        { 
            if((curl=='' || curl.indexOf('place-')!=-1 || curl.indexOf('search=')!=-1) && geo_result.indexOf('<script>show_location')==-1 && geo_result.indexOf('<script>call_url(')==-1){ remove_layers; call_url('','search='+encodeURIComponent(str)); }
            if(type=='geo')  {$("#last_li").after(geo_result);$("#geo_more,#last_li").remove();/*$("#nearby-result").mCustomScrollbar('destroy');*/}
            else {$("#res_info").html(geo_result).show(); $("#nearby-result").mCustomScrollbar({theme:"dark",scrollInertia:100});auto_load('x');}
        });
        try{event.preventDefault();}catch(e){}
    },

    load_file:function(filename, filetype)
    {
        if (filetype=="js")
        { 
            var fileref=document.createElement('script'); fileref.setAttribute("type","text/javascript");fileref.setAttribute("src", filename);
        }
        else if (filetype=="css")
        { 
            var fileref=document.createElement("link");fileref.setAttribute("rel", "stylesheet");fileref.setAttribute("type", "text/css"); fileref.setAttribute("href", filename);
        } 
        if (typeof fileref!="undefined") 
        {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },
    nr_marker:'',
    nr_putmarker:function(action,lat,lng)
    {       
           map.removeLayer(maps.nr_marker);
            if(action==1)
            {
                var icon_d = L.icon({iconUrl: 'images/marker_direction_steps.png',iconSize: [36, 51], iconAnchor: [19, 65],popupAnchor: [0, -36]});
                maps.nr_marker = new L.Marker(new L.LatLng(parseFloat(lat), parseFloat(lng)), {icon: icon_d,draggable:false});map.addLayer(maps.nr_marker);
            }
            else map.removeLayer(maps.nr_marker);
    },
    near_search:function(search,lat,lng,drag,bnd,cat_name,loc_name)
    { 

        var ev_data=maps.ly+","+maps.lx;
        
        var url_n = window.location.toString().split('/');var curl = url_n.slice(-1)[0];
        if(curl.indexOf('zdata=')>1)
        { 
            var curl_s=curl.split('data=');/**call data for existing url*/
            var names=curl_s[0].split('-near-');
            if(!loc_name)
            {
                if(names[1]) loc_name=names[1].split('@')[0];
                else loc_name=names[0].replace('@z','');
            }
            var datas=atob(curl_s[1].replace(/ed(?=[^ed]*$)/, '')).split('+'); 
            if(datas[1]) lng=datas[1]; if(datas[0]) lat=datas[0];
        }
        if(!drag) 
        {
            if($("#nearby_tab").hasClass('active')) $("#place_tab").click();maps.manual_drg=1;   
        }
        else {if(loc_name==undefined && $("#auto").val()) loc_name=$("#auto").val().split('Near')[1];ev_data=datas[6];/*for ev data*/}
        var bound="";
        try{if(mobilecheck()) map.setActiveArea('viewport_all'); else map.setActiveArea('viewport');}catch(e){}
        if(bnd) bound=bnd;
        else if(drag)
        {
            bound=map.getBounds();
            bound=bound._northEast.lat.toFixed(6)+","+bound._southWest.lng.toFixed(6)+";"+bound._southWest.lat.toFixed(6)+","+bound._northEast.lng.toFixed(6);
        }

        if(!cat_name) cat_name=search;
        if(!loc_name) loc_name="me";
    var nuri="place-"+cat_name.replace(/\ /g, '+')+"-near-"+loc_name.replace('?','')+"?@zdata="+btoa((lat?parseFloat(lat).toFixed(6):map.getCenter().lat.toFixed(6))+"+"+(lng?parseFloat(lng).toFixed(6):map.getCenter().lng.toFixed(6))+"+"+map.getZoom()+"+"+bound+"+"+search.replace('+',' ')+"+el+"+ev_data)+"ed";
        $('#auto').val(cat_name);
       try{ 
        if(typeof datas[6]!=="undefined"){
            if(datas[6].indexOf('audi')!=-1 && fltr_aud==1){
                filter_str_new='Audi';
            }
            if(datas[6].indexOf('hyundai')!=-1){
                filter_str_new='Hyundai';
            }
        }}
        catch(err){
          }
        get_place_details(nuri,drag,filter_str_new);          
    },
    near_box:function(url)
    {
        remove_layers(); $("#uap_tap_dv").hide();
        var url_n = window.location.toString().split('/');
        var curl = url_n.slice(-1)[0];
        var dta=curl.split("data=");
        var cat_place=dta[0].replace(/\+/g, ' ').split('-near-');
        home(); $("#main_page").animate({left: '0px'}, 300);
        /**check in url*/
        var auto_near_call=0;
        if(dta[1]!=null && curl.indexOf('-near-')!=-1 && curl.indexOf('-current-location')==-1)
        { 
            var data_val=atob(dta[1].replace(/ed(?=[^ed]*$)/, '')).split(','); 
            var what_name=dta[0].substring(0,dta[0].indexOf('-near'));
            if(what_name!='search') $('#near_what').val(what_name.replace(/\%252/g, ' ').replace(/\$/g, '/').replace(/\+/g, ' ').replace(/\%20/g, ' ')); else $('#near_what').val('');
            var where_name=dta[0].match("near-(.*)@");
            var where_adrs=where_name[1].replace(/\-/g, ' ').replace(/\$/g, '/').replace(/\+/g, ' ').replace(/\%20/g, ' ');
            if(!data_val[2]){return false;} 
           /* $('#auto_near').val(where_adrs);*/
            $('#nearPage').show();
            $('#routePage').hide();
            $('#tab1primary').hide();
            $('#get-dire').hide();
            var disp_name=dta[0].split('-near-');
            var nr_lt=0,nr_ln=0,nr_bnd=0,nr_cat=0,cat_name=disp_name[0],loc_name=disp_name[1].replace('@z','');
            if(data_val[2].indexOf('+el')>1)
            {
                var cord_nr=atob(dta[1].replace(/ed(?=[^ed]*$)/, '')).split('+');
                if(cord_nr[0]) nr_lt=cord_nr[0];
                if(cord_nr[1]) nr_ln=cord_nr[1];
                if(cord_nr[4]) nr_cat=cord_nr[4];
                if(cord_nr[3]) nr_bnd=cord_nr[3];
            }
            else
            {
                if(data_val[1]) nr_lt=data_val[1];
                if(data_val[0]) nr_ln=data_val[0];
                if(data_val[2]) nr_cat=data_val[2].replace('CAT','');
                var icon_d = L.icon({iconUrl: 'images/general.png',iconSize: [36, 45], iconAnchor: [15, 45],popupAnchor: [0, -36]});
                if(marker2) map.addLayer(marker2)
            }
            if(nr_lt && nr_ln && nr_cat)  maps.near_search(nr_cat,nr_lt,nr_ln,0,nr_bnd,cat_name,loc_name);
            return false;/*************************/

        }  
        else if(curl.indexOf('-near-me')!=-1)
        {
            var nr_cat=curl.replace('-near-me','');maps.near_search(nr_cat);
        }
        else
        {
            home(1);
            if(url){ call_url('',url);show_location('',url);  }
            if(mobilecheck()){$('#auto').focus();$(".as-list,.set-home-sec").hide();}
            else
            {   $('#cat_tab').show();$("#cat-more-btn").click();}
                $("#main_page").animate({left: '0px'}, 100);$("#collapse").html('&#x027EA;');
        }
    },    
    login_dv:function(html,length)
    { 
        setTimeout(function()
        {
            if(html)
            {
                var decode = JSON.parse(html);
                $("#login_dv").html(decode[0]);
                $("#login_dv_menu").html(decode[1]);
                if(!mobilecheck()) $('.side-bar-scroll').mCustomScrollbar({theme:'dark',scrollInertia:50});
                if(!length && decode[2]){$("#res_info").html(decode[2]).show();}

            }

        }, 30);
    },
    local_search:function(val)
    { 
        try{
        if(!val.x) return false; var nadr='<div id="asa"><div class="icon-item"><i class="material-icons">access_time</i></div>'+val.addr.replace('search-fill','search-fill search-fill-cat').replace('search-item-cat','').replace('highligher-search','').match("<div class='search-item(.*)</p></span>")[0].replace(/ *\[[^)]*\- */, "")+'</div>';
        var d = new Date(),f = { "p":val.p, "addr": nadr, "address": val.address,"x":val.x,"y":val.y,"ex":val.ex,"ey":val.ey,"dt":d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}; 
        var k=1;var pre_i=0;
        var new_val=new Array();
        var loc_st=localStorage.getItem("local");
        if(val.addr.indexOf('Current L')==-1 && val.addr.indexOf('ti-menu-alt')==-1 && val.addr.indexOf('add this')==-1) new_val[pre_i]=f; else {var k=0;}
        if(loc_st) 
        {
            var local = JSON.parse(loc_st);
            for(var i=0;i<local.length;i++)
            { 
                if(local[i].address==val.address || local[i].addr.indexOf('Current L')!=-1 || local[i].addr.indexOf('add this')!=-1|| i>4) continue;
                new_val[k]=local[i];k++;
            }
        }
        localStorage.setItem("local",JSON.stringify(new_val));   
        }catch(e){}
    },
    notification:function()
    {
        $.post('notification', function (data) 
        {
            if(data){  var noti = JSON.parse(data);if(noti.html) $("#notif").html(noti.html);}
        });
    },
    add_place:function(type)
    {
        map.setActiveArea('map');
        auto_load('dr'); 
        /*if(!type) maps.get_current(1);*/
        window.setTimeout(function ()
        {
            
            var lat = map.getCenter().lat;
            var lng = map.getCenter().lng;
            $("#loader").show();$("#auto").blur();$(".as-results").hide(); 
            if(type=="business") call_url('Add business in mapmyindia maps', 'add-a-business');
            else call_url('Add place in mapmyindia maps', 'add-a-place');
            if (xhr != null)
            {
                xhr.abort();
                xhr = null;
            }
            xhr=$.ajax({url: "get_click_revg?" + lat + "&" + lng + "&" + map.getZoom() + "&" + '2'}).done(function (data)
            {
                if (data == '[]') {
            show_error(1);
                    return false;
                }
                if (data.trim() != '' && data.trim() != 'undefined')
                {
                    var json = JSON.parse(data);
                    var res_user_added_place = json.user_add_place;
                    if(type =='get'){
                        addMissingPlace(lat,lng,res_user_added_place,type,json.adrs);
                    }else{
                        addMissingPlace(lat,lng,res_user_added_place,type);
                    }
        
                }
            });
        }, 600);
    },
    weather:function(type,time,data)
    {
    if(!data) comman('weather','weather-inventory',{"evt":"weather-inventory","time":time,"type":type});
        else
        {
            if(weather_tile) map.removeLayer(weather_tile);$(".weather-panel-btm").hide();
            if(data==1){show_error('Unable to load weather data');return false;}
            if(time==1) weather_ts=data.response.series[0].ts;
            $(".panel-title").removeClass('active');$("#w_"+type).addClass('active');
            $(".weather_link").removeClass('active');$("#w_"+type+"_"+time).addClass('active');
            var fts=''; 
            if(type == 'cloudsFcst') {var weather_fts=data.response.series[0].fts[0];fts = '&fts='+weather_fts;}
            weather_tile =  new L.tileLayer('https://api.weather.com/v3/TileServer/tile/'+type+'?ts=' + weather_ts+fts +'&xyz={x}:{y}:{z}&apiKey=8191cad7cb99410f91cad7cb99110fc6',{maxZoom: 18,  minZoom: 4,subdomains:mmisub,opacity:.3});
            map.addLayer(weather_tile);
            $("#weather_panel_trigger").addClass('active');
           
            if(data.color) $("#w_th_rclr").html(data.color).show();
            if(!time)$("#w_forc_dv").html(data.forcast).hide();
            maps.set_current();
        }
    }
};

$(document).on("click", "li[id^='ct_']", function(){ var ci=this.id.replace('ct_','');maps.near_search(ci,'','','','',ci);return false;}); 
    var jqxhrs = [];$(window).bind("beforeunload", function (event) {abort_all();});
    function abort_all(){$.each(jqxhrs, function (idx, jqxhr) {if (jqxhr) jqxhr.abort();});}
    function registerJqxhr(event, jqxhr, settings) {jqxhrs.push(jqxhr);}
    function unregisterJqxhr(event, jqxhr, settings) { var idx = $.inArray(jqxhr, jqxhrs);jqxhrs.splice(idx, 1);}
    $(document).ajaxSend(registerJqxhr);$(document).ajaxComplete(unregisterJqxhr);

$(window).load(function(){ if($("#map").length) maps.tiles(); });
/*$(window).load(function(){ maps.get_current(1);});  */

var traffic=
{
        map_click_ur:"",
        trafficGeoJsonLayer :"",
        oldTrafficGeoJsonLayer : "",
        trafficData :"",
        trafficLastQueried :-1,
        isTrafficLayerOn: 0,
        json_req :0,
        traffic_city :0,
        traffic_call_again:0,
        report_markers:"",
            display:function(){
                                          
                            var traffic_checkbox=$("#traffic_show").is(':checked');
                           
                            if(traffic_checkbox==true)
                            {
                                traffic.showTrafficOnMap();
                                $("#traffic_control").addClass('active');
                                $('.traffic_menu div').removeClass('off');
                                $("#menu_traffic").prop('checked', true);
                                $('#traffic_control').find('img').attr('src','images/maplayer/ic_toggle_on.png');
                                $('#traffic_control').find('img').attr('class','ic_toggle_on');
                             
                            }
                            else
                            {
                                traffic.hideTrafficFromMap();
                                $("#traffic_control").removeClass('active');
                                $("#dot").hide();
                                $('.traffic_menu div').addClass('off');$("#menu_traffic").prop('checked', false);
                                if(trffic_t) map.removeLayer(trffic_t); 
                                if(traffic_m) map.removeLayer(traffic_m);  
                                /*if(report_m) map.removeLayer(report_m);*/
                                if(traffic.json_req) traffic.json_req.abort();
                            }
            },
            showTrafficOnMap:function()
            {
                var mzm=19;/*if(map.hasLayer(bhu_t))mzm=17;*/
               try{
                if(!map.hasLayer(trffic_t)) {
                    
                    t_urls= document.getElementById("traffic_control").getAttribute("turl");
                  
                    if(t_urls){
                        t_urls=JSON.parse(t_urls);
                        t_urls=t_urls[0].replace("{key}",map_key);

                        trffic_t=new L.tileLayer(t_urls+'?'+new Date().getTime(),{maxZoom: mzm,  minZoom: 4,subdomains:mmisub});map.addLayer(trffic_t);
                    /*trffic_t=new L.tileLayer('https://{s}.mapmyindia.com/advancedmaps/v1/'+map_key+'/traffic_tile/{z}/{x}/{y}.png?'+new Date().getTime(),{maxZoom: mzm,  minZoom: 4,subdomains:mmisub});map.addLayer(trffic_t);*/
                }
            }
                if (traffic.trafficLastQueried == -1) {       traffic.newQueryTraffic(); return false;    }
              }
                catch(e){ console.log(e)}
                /*if(traffic_report) {show_report_marker_traffic('traffic',traffic_report);}*/
            },
            hideTrafficFromMap:function() {
                if (traffic.isTrafficLayerOn || traffic.trafficGeoJsonLayer)  map.removeLayer(traffic.trafficGeoJsonLayer);
                if (traffic.oldTrafficGeoJsonLayer)     map.removeLayer(traffic.oldTrafficGeoJsonLayer);
                traffic.isTrafficLayerOn = 0;
                traffic_type=0;
            },
            newQueryTraffic:function()
            {
                if(traffic.json_req) {traffic.json_req.abort();}
                if($("#traffic_show").is(':checked')==false) return false;
                 map.setActiveArea('map');
                var bound=map.getBounds();
                var miny=bound._northEast.lat;var minx=bound._northEast.lng;
                var maxy=bound._southWest.lat;var maxx=bound._southWest.lng;
                $("#dot").show();
                traffic.json_req=$.ajax({url: "traffic_Data",method:"post",data:en.code({"minx":minx,"miny":miny,"maxx":maxx,"maxy":maxy,"zoom":map.getZoom()}),async: true,dataType: 'json', complete: function(result)
                {
                    if(!result) return false;
                    traffic.trafficData = result.responseJSON;
                    $("#loader").hide();  $("#dot").hide();
                    if(traffic.trafficData==undefined) return false;
                    traffic.trafficLastQueried = $.now();
                    traffic_report=traffic.trafficData.report;
                    show_report_marker_traffic('traffic',traffic_report,traffic.trafficData.cat);
                    traffic.showTrafficOnMap();
                    if(traffic.traffic_call_again!=0) clearTimeout(traffic.traffic_call_again);
                    traffic.traffic_call_again = setTimeout(traffic.newQueryTraffic, 150000);
                }});
       
            }
};
if($("#traffic_show").is(':checked')==true) traffic.queryTrreadReviewaffic();
/*
 * var map_click_url= '';
 * var def_url="";/*@28.61,77.23,5z*/

function render()
{}
function auto_load(act){
       /*New Code */
//           map.eachLayer(function (layer) { map.removeLayer(layer); });
       
        var ld_h='';
        if(act=='x'){ ld_h='<div class="close-search-icon hamburger-trigger-sec" onclick="auto_load(\'dr\')"><a class="hamburger-trigger "><div class="hamburger-trigger-item side-menu"><i class="material-icons side-menu" >close</i></div></a></div>';}
        else if(act=='dr'){showdot=0;
            filter_str_new=''; filter_str='';remove_layers(); pop_state=0;home(1);$("#auto").focus();$('.as-results,#side-back,#side_2,#side_3,#show_eloc_sec,.eloc-message-alert,.eloc-img-side,#success_sec,#eloc_tap_dv,#down_band').hide();clearTimeout(timeoutHandles);$("#side-menu,#side_1,.reportTrig").show();if(place_d) place_d.abort();ld_h='<div class="directions-trigger-sec"><a id="dir_tab" title="Get Direction" class="directions-trigger"><div class="directions-trigger-item"><i class="material-icons">directions</i></div></a></div> ';}
        else ld_h='<div class="close-search-icon hamburger-trigger-sec" onclick="auto_load(\'dr\')"><a class="hamburger-trigger "><div class="hamburger-trigger-item side-menu"><img src="images/loading_small.gif" style="width:18px;margin-top:6px"></div></a></div>';
        $("#auto_load").html(ld_h);
    }
/*globals*/
var timeoutHandles=0;
var req=0,
marker2 = "",
profile_dt=[],
pg_journey=1,pg_report=1,pg_review=1,pg_contri=1,
timeline_marker="",
simplepoly_timeline="",
mk="",
staticMrkr = "",
edtmk="",
marker_cur = "",
path_dir = "",
path_dir_alt = "",
path_dir_alt1 = "",
from_marker = "",
to_marker = "",
via1_marker = "",
near_search=0,
near_markers=0,
via2_marker = "",
via3_marker = "",
latlngss = "",
path2 = "",
mark = "",
marker_along1 = new Array(),
marker_along = new Array(),
fwd = 0,
fwds = 0,
flags = "chk",
xyzzz = "",
abcd = "",
nearby_marker=[],
along_marker=[],
nearby_marker_group=0,
along_marker_group=0,
mark_n = new Array(),
mark_n1 = new Array(),
marker_new1 = new Array(),
marker_new = new Array(),
group_stars=0,
main_mark = new Array(),
device_marker =[],device_tmt=0,share_marker =[],shareRes,
tot = new Array(),
arr_add = new Array(),
marker = new Array(),
flaginfodet = "",
loadmorearray = new Array(),
curl_loc_bt = '',
currLocDet = "",
errorCode ="",
locationOn ='';
divClick = '';
catList=new Array();
leaflet_sum = [], 
leaflet_group = [], 
leaflet_rt = [], 
leaflet_polyline = '', 
trafi_dir = "", 
trafi_dir_alt = "",
leaflet_walk =[],
leaflet_congestion =[],
emoji=['\ud83c[\udf00-\udfff]','\ud83d[\udc00-\ude4f]','\ud83d[\ude80-\udeff]'];
var mul_report =[],mul_report_apnd='';
function removeemoji(inputid) {
  var str = $('#'+inputid).val();
  str = str.replace(/([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g, '');
  $("#"+inputid).val(str);
}
$("input").keyup(function(){
   removeemoji(this.id);
});
function conv(no,type)
{ 
    if(no=='' || no==undefined) 
    {
        return false;
    }
   
    var code = ["f","l","j","t","a","s","e","o","q","v"];
    var res="";
    if(type=='encode')
    { 
        for (var x = 0; x < no.length; x++)
        {
            var cd=code[no[x]];
            if(cd==undefined) cd=no[x];
            if(cd=='.') cd='i';
            res+=cd;
        }  
    }
    else
    {
        for (var x = 0; x < no.length; x++)
        {
            var cd=code.indexOf(no[x]);
            if(cd==undefined || cd==-1) cd=no[x];
            if(cd=='i') cd='.';
            res+=cd;
        }
    }
    return res;
}

window.onload = function () 
{  
    var hash=window.location.hash.substr(1).toString();
    var url = window.location.toString().split('/');var curl = url.slice(-1)[0];
    $(document).ready(function()
    { 
        if(hash && curl.indexOf('pin=')==-1)
            {
            if(hash.indexOf('driving+d')!==-1)
            {
                var d_url=hash.split('-');
                var name=d_url.slice(1,d_url.length-4).toString().replace(/\+/g, '-').split(';');
                var d_latln=atob(d_url[d_url.length-4]).split(',');
                var d_from=d_latln[0].split('+');
                var d_to=d_latln[1].split('+');
                var dir_url="direction-from-"+name[0].replace(/\ /g, '-').replace(/\//g, '$').toLowerCase().replace('current-location-','')+"-to-"+name[1].replace(/\ /g, '-').replace(/\//g, '$').toLowerCase().replace('current-location-','')+"data="+btoa("from+"+d_from[1]+","+d_from[0]+"+to+"+d_to[1]+","+d_to[0]);
                call_url('',dir_url);
                newdr.driving_box('');
            }
            else if(hash.indexOf('maps-')!==-1)
            {
                var p_url=hash.split('-');
                var name=p_url.slice(0,p_url.length-4).toString().replace(/\+/g, '-');
                var p_latln=atob(p_url[p_url.length-4]).split('+');
                var p_eloc=atob(p_url[p_url.length-3]);
                var n_url="place-"+name+"-"+p_eloc+"@zdata="+btoa(p_latln[0]+"+"+p_latln[1]+'+16+'+eloc)+"ed"; 
                call_url('',n_url);
                show_location('',n_url.replace("place-","")); 
                get_place_details(n_url);
            }
            else if(hash.indexOf('places-')!==-1)
            {
                var p_url=hash.split('-');
                $("#loader").show();
                var name=p_url.slice(0,p_url.length-4).toString().replace(/\+/g, '-').replace("place-","");
                var p_latln=atob(p_url[p_url.length-4]).split('+');
                var cat_name=atob(p_url[p_url.length-1]);
                $.getJSON( "near-what?q="+cat_name, function(data) 
                {     
                    var n_url="near";
                    if(data!='')
                    {   var cat_code=data[0].address.split('#');
                        if(cat_code[0]) var n_url=cat_name+"-near-"+name+"@zdata="+btoa(p_latln[0]+","+p_latln[1]+'+'+cat_code[0]); 
                    }
                    call_url('',n_url);
                    near('');
                    $("#loader").show();
                }).fail(function() { });
            }
            else 
            {
                home();
            }
        }
        else
        {    
            curl=curl.replace(/\#/g, '');
            if(curl.indexOf('place-') == 0) /*reload or link for place*/
            {   
                var currentURL = breakUrl(curl);
                var decodeString = "";try{decodeString =atob(currentURL[(currentURL.length)-1].replace('ed','')).split('+');}catch(e){}

                if(decodeString[0] || decodeString[1])
                {
                    curl=curl.replace(/\,%20/g, '-').replace(/\%20/g, '+');
                    if(mobilecheck()) map.setActiveArea('viewport_all'); else if(map) map.setActiveArea('viewport')
                    if($("#place_direction").html()) show_location('',curl);
                    /*get_place_details(curl);*/
                }
                else
                {
                    home();
                }
                return false;
            }
            else if(curl=="usernotexist") { show_error("The User does not exist. Please try another one.");  return false;}
            else if(curl.indexOf('direction') !== -1)
            {
                var dta = curl.split("data=");
                try{if(dta[1]!=null) dta=atob(dta[1].replace('ed','')).split('+');}catch(e){}
                
                if(!$('#res_info').html()) {newdr.driving_box(''); return false;}
                if((curl.indexOf('from-current_location')!=-1 || curl.indexOf('from-current-location')!=-1) && !dta[1])
                {
                    divClick = 'auto_start';
                    $('#geo_location').trigger('click');
                }else{
                    if(mobilecheck())
                    {
                        setTimeout(function(){
                            if(curl.indexOf('!data') !== -1 || curl.indexOf('zrd') !== -1){$(".panel-primary,#route_detail").hide();$('#row1_adv,#ac-plc-header,#num_routes').show();}
                            else if(curl.indexOf('!!data') !== -1){$(".panel-primary,#route_detail").hide();$('#row2_adv,#ac-plc-header,#num_routes').show();}
                            else if(curl.indexOf('!!!data') !== -1){$(".panel-primary,#route_detail").hide();$('#row3_adv,#ac-plc-header,#num_routes').show();}
                        },500);
                    }else{
                            back_state=1;
                            if(curl=='direction'){ $("#dir_tab").click();}
                            else if(curl.indexOf('z!data') !== -1){$("#row1_li").click();$("#num_routes,#row2_adv,#row3_adv,#step_by").hide();$(".search-title,#route_detail,#row1_adv,#all_route").show();}
                            else if(curl.indexOf('z!!data') !== -1){$("#row2_li").click();$("#num_routes,#row1_adv,#row3_adv,#step_by").hide();$(".search-title,#route_detail,#row2_adv,#all_route").show();}
                            else if(curl.indexOf('z!!!data') !== -1){$("#row3_li").click();$("#num_routes,#row1_adv,#row2_adv,#step_by").hide();$(".search-title,#route_detail,#row3_adv,#all_route").show();}
                            else if(curl.indexOf('@zdata') !== -1){$(".search-title,#num_routes,#route_list").show();$("#route_detail,#row3_adv,#all_route").hide();} 
                            else {pop_state=0;newdr.driving_box('');return false;}
                    }
                }
                close_cat();
                return false;
            }
            else if(curl.indexOf('alarm$')!== -1){
                $("#get-eloc-sec-bus").hide();
                var cut_url = curl.split("?");
                var type= cut_url[0].split("$")[1];
                var dv_url = cut_url[1].split("&");
                var cood_lat = dv_url[0].replace("loc=","").split(",")[0];var cood_lng = dv_url[0].split(",")[1];
                var timestm = dv_url[1].replace("timestamp=","");
                var address = dv_url[3].replace("address=","");
                var dattime = getmovementtime(timestm);
                timeStr = dattime[0].substr(0,5)+' '+dattime[2];
                var alarmDesc = getAlarmTypeStr(type)[0];
                
                var alarmTypeImage = getAlarmTypeStr(type)[1];
                if(alarmTypeImage == '.png'){
                    alarmTypeImage ='default_alarm.png';
                }
                var direc = "direction-from--to-"+address.replace(/\ /g, '-').replace(/\//g, '$').toLowerCase().replace('current-location-','')+"@zdata="+btoa("from++to+"+cood_lng+","+cood_lat);
                var pinId = type + "/" + cut_url[0].split("$")[2] + "?loc=" + cood_lat + "," + cood_lng + "&timestamp=" + timestm + "&geofence=null&address=" + encodeURIComponent(address.replace(/\+/g, ' '));

                var htmll = '<div class="search-result-scroll poi_5RQ8VG"><div class="search-list-click-wrap poi-scroll-item new-poi-sec">'
                                +'<div class="action-bar theme-mob-bg clearfix" >'
                                    +'<div class="pull-left">'
                                        +'<a href="javascript:void(0)" onclick="history.go(-1)" class="pull-left control-slide"><i class="ti-arrow-circle-left"></i> <span>Back</span></a> '
                                    +'</div>'
                                +'</div>'
                                +'<div class="poi-scroll"><div class="reportSec">'
                                    +'<ul class="timeline timeline-detail-new timeline-alarm clearfix">'
                                        +'<li class="blue" index="" alarmdes="">'
                                        +'<div class="timeContent">'
                                            +'<span class="timecircle">'
                                            +'</span>'
                                            +'<span class="statusCircle">'
                                                +'<img id="alarm_icon" src="images/my_device/'+alarmTypeImage+'" alt="">'
                                            +'</span>'
                                            +'<h5 id="alarm_name">'+alarmDesc+'</h5>'
                                            +'<div id="alarm_time" class="statusTime">'+timeStr+'</div>'
                                            +'<p id="alarm_add">'+decodeURI(address.replace(/\+/g, ' '))+'</p>'
                                            +'<div class="direct-btn">'
                                            +'<button id="alarm_direc" type="button" onclick="" class="btn claim-login">'
                                            +'<i class="material-icons">directions</i>&nbsp; Get Directions</button>'
                                            +'<button id="alarm_share" type="button" class="btn claim-login"><i class="material-icons">share</i>&nbsp; Share Device</button>'
                                            +'</div>'
                                        +'</div>'
                                    +'</li>'
                                +'</ul>'
                                +'</div>'
                            +'</div>';
                $("#alarm_direc").attr("onclick","removeAlarmLayer();call_url('','"+direc+"');newdr.driving_box('');return false;");
                $("#alarm_share").attr("onclick","share('https://maps.mapmyindia.com/alarm/"+pinId+"')");
                $("#res_info").html(htmll).show();
            }
            else if(curl.indexOf('search=') !== -1)
            {
                var string=curl.replace('search=','').replace(/\+/g, ' ');
                $("#auto").val(decodeURIComponent(string));
                maps.get_geo("auto");
            }
            else if(curl.indexOf('add-a-place') !== -1)
            {
                maps.add_place();
                return false;
            }
            else if(curl.indexOf('add-a-business') !== -1)
            {
                maps.add_place('business');
                return false;
            }
            else if(curl.indexOf('report') === 0 && (curl.indexOf('report@')==-1 || curl.replace('@','').indexOf('@')==-1))
            {
                home(0);
                if(curl.indexOf('report@WRC-')!==-1){
                    var rep_arr = curl.split('WRC-');
                    var cord_arr = rep_arr[1].split(',');
                    var center_lat = atob(cord_arr[0]);
                    var center_lng = atob(cord_arr[1]);
                    var zm = atob(cord_arr[2]);
                }
                else if(curl.indexOf('@') == -1 || curl.indexOf('report@')!==-1)
                { 
                    var center_lat = map.getCenter().lat;
                    var center_lng = map.getCenter().lng;
                    var zm = map.getZoom();
                }
                else 
                {
                    var rep_arr = curl.split('@');
                    var cord_arr = rep_arr[1].split(',');
                    var center_lat = atob(cord_arr[0]);
                    var center_lng = atob(cord_arr[1]);
                    var zm = atob(cord_arr[2]);
                }
                pop_state=1;
                url="place-"+center_lat+","+center_lng+"@zdata="+btoa(center_lat+"+"+center_lng+"+"+zm+"+")+"ed";
                writeReport(url);
                return false;
            }
            else if(curl.indexOf('report@') ===0)
            {
                readReport('',curl.replace('/','!'),0);
                return false;
            }
            else if(curl.indexOf('enquiry@') ===0)
            {
                singleEnquiry('',curl.replace('enquiry@',''));
                return false;
            }
            else if(curl.indexOf('corona?') !== -1 || curl=='corona' || window.location.href.indexOf('corona/') !== -1 ){}
            else if(curl=='change-password') change_password();
            else if(curl=='near' ||curl.indexOf('-near-') !== -1)
            { 
                if(curl.indexOf('place-') !== -1)
                {
                   /* maps.near_box(''); */
                    return false;
                }
                else if(curl.indexOf('search-near-')!==-1) $("#near-menu-trigger,#cat-more-btn").click();
            }
            else if(curl=='nhai')
            {
                $('.leaflet-control-attribution.leaflet-control').before("<div style='float: right;width: 70px;background: #f2ca03;margin: 0 0 0 5px;border-radius: 50%;'><img src='images/cross-strip1.png' style='width:100%'></div>");
            }
            else if(curl.indexOf('@') == 0) /*onload map loc dia*/
            {
        $("#cat_tab,#get-eloc-sec-bus,.get-eloc-sec-bus").hide();
                show_map(curl);
                return false;
            }
            else if(curl.indexOf('traffic') ===0)
            {
                show_map(curl.replace('traffic',''));
                $('#traffic_control').trigger('click');
                return false;
            }
            else if(curl.indexOf('reseted') !== -1)
            {
                $.post('userAuth?140', en.code({'mamth':'M140'}), function (data) 
                { 
                    var decode = JSON.parse(data);
                    if(!decode.response)
                    {
                        var heading = 'Your password has been successfully updated';
                        var message = 'Please, keep it in your records so you do not forget it'; 
                       /* var type = 'green_bg';*/
                        notify(heading);
                    }
                });
                return false;
            }
            else if(curl.indexOf('pin') !== -1&& curl.indexOf('-pin') == -1)
            {
                getPin(curl);
                return false;
            }
            else if(curl.indexOf('verified') !== -1)
            {
                verify_user(curl);
                return false;
            }
            else if(curl.indexOf('feedback') !== -1)
            {
                maps.feedback();
                return false;
            }
            else if(curl.indexOf('get-eLoc') !== -1)
            {
                home(0);
                comman('getEloc','menu',{"evt":"getEloc","url":maps.uri()});
                return false;
            }
                else if(curl.indexOf('durga-pandals') !== -1)
                {
                    viewMyPandals('youngbikers','edited');return false;
            }
            else if(curl.indexOf('signin') !== -1 || curl.indexOf('signup') !== -1)
            { 
                $.post('userAuth?140', en.code({'mamth':'M140'}), function (data) 
                {
                    var decode = JSON.parse(data);
                    if(decode.response) $("#res_info").html(decode.response).show();
                    $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').show();
                    return false;

                });
                return false;
            }
             else if(curl.indexOf('SetPassword') !== -1)
            { 

                $.post('userAuth?SetPassword', en.code({'mamth':'SetPassword'}), function (data) 
                {
                    var decode = JSON.parse(data);
                    if(decode.response) $("#res_info").html(decode.response).show();

                     setTimeout(function(){  $("#passwrd").focus();},600);
                   
                    $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').show();
                    return false;

                });
                return false;
            }
            else if(curl.indexOf('hondaAssistShareLocation') !== -1)
            { 
                $(".search-new-sec,.download-app-trigger election-trigger,.download-app-trigger election-trigger,#fscrn_dv,.scale-sec lhid,.scale-sec,.download-app-trigger,#login_dv,#layer_panel_trigger,#geo_location,.reportTrig,.covid-trigger-img,.cookiesSec").hide();
                hondaShareLocation(curl.split("shareLocationId=")[1]);
                return false;
            
            }
            else if(curl.indexOf('realview') !== -1)
            {
                var id = curl.split('-');
                if(id.length == 3) {maps.pano(id['1']+'-'+id['2']);}
                else maps.pano(id['1']);
                return false;
            }
            else if(curl=='add-home'|| curl=='add-work' || curl=='printv' || curl.indexOf('embed.jsp')!=-1){call_url('','.');return false}
            else if(curl=='my-world-data' || curl=='corona'){}
            else if($("#map").length && curl.length > 2 && curl.indexOf('signup') === -1)
            { 
              if(curl.indexOf('not-found') == -1)
              {
                 view_profile(curl);
              }else{
                  notfound();  
              }
            }
            else 
            { 

            } 
        }
    });
};

var pop_state=0;/*$(document).on("click", function(){pop_state=0;});*/
var near_state=0;
var back_state=0;
var like_event=0;
window.onpopstate = function(event) 
{
    if (xhr != null)
    {
        xhr.abort();
        xhr = null;
    }
    $('#loader,.as-results,#modal_new').hide();
    $("#dir_tab").show();
    $('.with-nav-tabs').show();
    $("#side-back,#eloc_tap_dv,.eloc-message-alert,#down_band,#success_sec").hide();  /*get eloc css*/
    var url = window.location.toString().split('/');
    var curl = url.slice(-1)[0];
    if(curl && !like_event) pop_state=1;
    if(pop_state) near_state=pop_state;
    if(!curl){$(".panel-primary").show();auto_load('dr');}
    if(!curl && mobilecheck()) $(".covidTrigMain").show();
    if($("#p_top").length>=1) printpw(1);
    if(curl.indexOf('place-')==0) 
    { 
        var currentURL = breakUrl(curl);
        var decodeString = atob(currentURL[(currentURL.length)-1].replace('ed','')).split('+');
        if(pop_state && decodeString[4] && map.hasLayer(near_markers))
        {
            $('#poi_dv').slideUp( "fast", function() {});$("#near_dv").slideDown( "fast", function() {});map.removeLayer(marker2);pop_state=0;return false;/*show hide cat & info div*/
        }
        
        if(decodeString[0] && decodeString[1])
        {
            home();
            show_location('',curl);
            get_place_details(curl);call_url('',curl);
        }
        else
        {
            home();
        }
        return false;
    }
    else if(curl.indexOf('direction') !== -1)
    {
        if(!$('#res_info').html()) {newdr.driving_box(''); return false;}
        adv_route();
        if(mobilecheck()) 
        {
            $(".s-result-scroll-item").css("top","calc(100vh - 175px)");
            if(curl.indexOf('zrd') !== -1)  {return false;}  
            if(curl.indexOf('from--to')==-1 && (curl.indexOf('zd') !== -1 || curl.indexOf('!d') !== -1))  {$(".panel-primary,#route_detail").hide();$('#row1_adv,#ac-plc-header,#num_routes').show();pop_state=0;}
            else if(curl.indexOf('from--to')!=-1) {return false;}
            else newdr.x();
        }else{
            
            if(curl=='direction'){ $("#dir_tab").click();}
            else if(curl.indexOf('!data') !== -1){$("#row1_li").click();back_state=1;$("#num_routes,#row2_adv,#row3_adv,#step_by").hide();$(".search-title,#route_detail,#row1_adv,#all_route").show();}
            else if(curl.indexOf('!!data') !== -1){$("#row2_li").click();back_state=1;$("#num_routes,#row1_adv,#row3_adv,#step_by").hide();$(".search-title,#route_detail,#row2_adv,#all_route").show();}
            else if(curl.indexOf('!!!data') !== -1){$("#row3_li").click();back_state=1;$("#num_routes,#row1_adv,#row2_adv,#step_by").hide();$(".search-title,#route_detail,#row3_adv,#all_route").show();}
            else if(curl.indexOf('@zdata') !== -1 || curl.indexOf('@zrdata') !== -1){$(".search-title,#num_routes,#route_list").show();$("#route_detail,#row3_adv,#all_route").hide();} 
            else if(purl!=curl && curl=='direction'){newdr.driving_box('');}
            else {newdr.driving_box('');} 
        }
        
        /*if(curl.indexOf('search=') !== -1)
        if(curl=='direction'){ $("#dir_tab").click();}
        else if(purl==curl){if(mobilecheck() && $(".spc-add-via").css('display') != 'none') $(".panel-primary").hide();}
        else if(purl!=curl && curl=='direction'){newdr.driving_box('');}
        else {pop_state=0;newdr.driving_box('');}*/
        return false;
    }
    else if(curl=='nhai') {home();return false;}
    else if(curl=='near' ||curl.indexOf('-near-') !== -1)
    {
        maps.near_box('');
        return false;
    }
    else if(curl.indexOf('search=') !== -1)
    {
        var string=curl.replace('search=','').replace(/\+/g, ' ');
        $("#auto").val(decodeURIComponent(string));
        maps.get_geo("auto");
    }
    else if(curl.indexOf('get-eLoc') !== -1)
    {
        home(0);
        $(document).ready(function(){ comman('getEloc','menu',{"evt":"getEloc","url":maps.uri()});});
       
        
        return false;
    }
    else if(curl.indexOf('durga-pandals') !== -1)
    {
    viewMyPandals('youngbikers','edited');return false;
    }
    else if(curl.indexOf('report-') ===0)
    {
        readReport('',curl.replace('/','!'),0);
        return false;
    }
    else if(curl.indexOf('report') === 0 && curl.indexOf('report-')==-1)
    {
        home(0);
        if(curl.indexOf('@') == -1)
        { 
            var center_lat = map.getCenter().lat;
            var center_lng = map.getCenter().lng;
            var zm = map.getZoom();
            call_url('',"report@"+btoa(center_lat)+","+btoa(center_lng)+","+btoa(zm));
        }
        else 
        {
            var rep_arr=curl.split('@');
            var cord_arr=rep_arr[1].split(','); 
            if(!cord_arr[1])
            {
                readReport('',curl.replace('/','!'),0);return false;
            }
            var center_lat=atob(cord_arr[0]);
            var center_lng=atob(cord_arr[1]);
            var zm="";try{zm=atob(cord_arr[2]);}catch(e){}
        }
        $.ajax({url : "get_click_revg?"+center_lat+"&"+center_lng,type : "get",async: false, success : function(res) 
        {
            if(!res) 
            {
                url="place-"+center_lat+","+center_lng+"@zdata="+btoa(center_lat+"+"+center_lng+"+"+zm+"+")+"ed"; 
            }
            else 
            {
                url=JSON.parse(res).address;
            }
            writeReport(url);
        }});
        return false;
    }
    else if(curl=='add-home'|| curl=='add-work'){return false}
    else if(curl=='nhai') {home();return false;}
    else if(curl=='signin'){home();$("#signin").click();}
    else if(curl.indexOf('add-a-place') !== -1)
    {
        if(mobilecheck()){
            $('#map').insertAfter('.addp-web-onmap-sec');
            $('#auto').val('');
            maps.add_place();
            return false;
        }else{
            maps.add_place();return false;
        }
    }
    else if(curl.indexOf('add-a-business') !== -1)
    {
        if(mobilecheck()){
            $('#map').insertAfter('.addp-web-onmap-sec');
            $('#auto').val('');
             maps.add_place('business');
            return false;
        }else{
             maps.add_place('business');return false;
        }
    }
    else if(curl.indexOf('enquiry@') ===0)
    {
        singleEnquiry('',curl.replace('enquiry@',''));
        return false;
    }
    else if(curl.indexOf('corona?') !== -1 || curl=='corona' || window.location.href.indexOf('corona/') !== -1 ){}
    else if(curl.indexOf('@')==0) 
    {
        home();
        show_map(curl);
        return false;
    }
    else if(curl.indexOf('realview') !== -1)
    {
        var id = curl.split('-');
        if(id.length == 3) {maps.pano(id['1']+'-'+id['2']);}
        else maps.pano(id['1']);
        return false;
    }
    else if(curl.length > 2)
    { 
        if(curl.indexOf('not-found') == -1)
          {
             view_profile(curl);
          }else{
              notfound();  
          }
    }
    else if(curl.indexOf('feedback') !== -1)
    {
        maps.feedback();
        return false;
    }
    else 
    {
        if(glb_dc) $("#g_devices,#layer_panel_close").click();
        if(!event.state && curl) 
        {
            history.go(-1);
        }
        else
        {
            home(0);if(!x_cat)$("#cat_tab").show();
        }
    }
};

var show_map=function(location)
{ 
    var loc = location.replace('@','').replace(/%20/g,'').split(','); 
    if(loc[1] == '' || loc[1] == undefined)
    { 
        loc = atob(location.replace('@','')).replace(/%20/g,'').split(','); if(!loc[0]) return false;
    }
    $('#place_details').html('').hide(); $("#get-eloc-sec").hide();/*remove place details*/
    remove_layers();/**remove buttons & layers*/
    window.setTimeout(function () 
    {
        var s_lat = (loc[0] && loc[1]) ? conv(loc[0],'decode') : loc[0];
        if(loc[1]) { var s_lng = conv(loc[1],'decode');}
        if(mobilecheck() && loc[0].indexOf('.')!=-1 || loc[0].length==6) close_cat();
        else 
        {
            if(location.length==7) close_cat(); else $("#cat_tab").show();
        }
        var s_zoom = (loc[2]) ? conv(loc[2],'decode').replace(/[^0-9]/g,'') : 17;if(!s_zoom) s_zoom=16;
        if(loc.length<2) return false;
        if(loc[0].indexOf('.')==-1 || loc[1].indexOf('.')==-1 ) {return false;}
        if(loc[0].indexOf('.')==-1 && loc.length>2){ map.setView(new L.LatLng(s_lat,s_lng),s_zoom);return false;} notify("");
        var icon_d = L.icon({iconUrl: 'images/general.png',iconSize: [36, 45], iconAnchor: [15, 45],popupAnchor: [0, -36]});
        if(loc[1] && loc[0]){ try{map.setView(new L.LatLng(s_lat,s_lng),s_zoom);}catch(e){}if(location.indexOf(loc[0])!=-1) $('#auto').val(loc);
        try{if(mobilecheck()) map.setActiveArea('viewport_all'); else if(map) map.setActiveArea('viewport');}catch(e){}
        if(loc[3] && loc[3]=='link') return false;/*sdk logo click*/
        marker2 = new L.Marker(new L.LatLng(parseFloat(s_lat), parseFloat(s_lng)), {icon: icon_d,draggable:false}).bindPopup("<div style='text-align:center;padding:10px'>Loading..</div>");
        try{map.addLayer(marker2);marker2.openPopup();}catch(e){}
        }
        if(rev_url) rev_url.abort();
        var parameters = (loc[1] && loc[0]) ? "get_click_revg?"+s_lat+"&"+s_lng+"&"+s_zoom : "get_click_revg?pid="+s_lat; 
        rev_url=$.ajax({url: parameters}).done(function(data) 
        {
            if(data.trim()=='[]') {if(!s_lng) window.location.href='search='+s_lat;return false;}
            var json_r = JSON.parse(data);
            if(!loc[1] && !loc[2])
            {
            call_url('',json_r); 
            show_location('',json_r,''); 
            get_place_details(json_r);
            }
            else
            {
            $(".get-eloc-sec-bus").hide();
            var html = reportPopup(json_r,s_lat,s_lng);
            $("#street_adrs").val(json_r.add_place);
            try{
            map.removeLayer(marker2);
            marker2 = new L.Marker(new L.LatLng(parseFloat(s_lat), parseFloat(s_lng)), {icon: icon_d,draggable:false}).bindPopup(html);
            map.addLayer(marker2);marker2.openPopup();
            }catch(e){} 
            }
            auto_load('x');
        });
        /*curl_loc_bt = 3; to stop geolocation render*/
    }, 50);
};
var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

function pano_bck(){
    $('#show_pano').hide();
    if(history.state) history.go(-1);
    else home(1);
}
function notfound()
{
      $("#loader").show();
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth',
            data: {'mamth':'notfound'},
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                var text = decode.response;
                $('#res_info').html(text).show().delay(4500);
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
                show_error(1);
            }
        });
        return false;    
};

function hondaShareLocation(shareLocationId)
{
    $("#loader").show();
    $("#bckDrc").hide();
    
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?hondaLocShare',
            data: en.code({'mamth':'hondaLocShare','shareId':shareLocationId}),
            timeout: 15000,
            success:function (data) 
            {
                $("#loader").show();
                var decode = JSON.parse(data);
                var text = decode.response;
                var hRes= decode.result;
                if(text!=null){
                    $('.new-category-sec').hide();
                    $('#res_info').html(text).show().delay(4500);
                    $("#loader").hide();
                }else{
                    if(hondaTimer) clearInterval(hondaTimer); 
                    $("#loader,#res_info").hide();
                    map.removeLayer(group_stars);
                    show_error(hRes.message);  return false;
                }
                
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                /*show_error(1);*/
                $("#loader").hide();
            }
        });  
        return false;      
}
function shareLocation(username,button)
{
     home('');
    $("#loader").show();
    $("#bckDrc").hide();
    if(button == 0) {show_error(1);return false;}
   
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?shareLoc',
            data: en.code({'mamth':'shareLoc','button':button}),
            timeout: 15000,
            success:function (data) 
            {
                $("#loader").show();
                var decode = JSON.parse(data);
                var text = decode.response;
                $('.new-category-sec').hide();
                $('#res_info').html(text).show().delay(4500);
                var htmlres = $(".share_card_sec").html();
                if(htmlres.trim() != '') $('.proAd_sec').hide(); else $('.proAd_sec').show();
                if(button == 'back' || typeof button == 'undefined') { call_url(username+' Share Location',username+'?my-share-data=');}
                else { call_url(username+' Share Location',username+'?my-share-data='+button);}
                if(mobilecheck()){$(".panel-primary").hide();}
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                show_error(1);
                $("#loader").hide();
            }
        });  
        return false;      
}

function home(call)
{               
    $("#map").animate(
    { 
        top:0,
        bottom:0,
        left:0,
        right:0 
    });      
    $("#auto_cross_bt").hide();
    remove_layers();
    if(route_url) route_url.abort();
    if(trafi_route) trafi_route.abort();
    if(trafi_route_new) trafi_route_new.abort();
    if(call || call==undefined) 
    { 
        call_url('MapmyIndia Maps: Search locations, driving directions and places nearby','.');
        if(!x_cat) $("#cat_tab").show();if(!close_getelc) $('#get-eloc-sec,#get-eloc-sec-bus').show();/*set in get_eloc & menu*/
        if(mobilecheck()) $('.with-nav-tabs').show();
        
        $("#res_info").hide().html('');
        $('#error_modal').hide().html('');
    }
    $('#tab1primary').show();
    $('#tab3primary').hide();
    $("#mapLayerSidePanelMain .layer_sec").hide();
    $("#mapLayerSidePanelMain .step_01").show();
    $("#mapLayerSidePanelMain .step_02 .toggleTrafficCommon").removeClass("active");
    $("#mapLayerSidePanelMain .step_02 .toggleTrafficCommon img").attr("src","images/maplayer/ic_toggle_off.png");
    if(maps.nr_marker) map.removeLayer(maps.nr_marker);
    if(!$('#res_info').html())$('#res_info').hide();
    $('.search-list-click-wrap').hide();
    $( ".nav-tabs li" ).removeClass( "active" );$( ".nav-tabs li:nth-child(1)" ).addClass( "active" );
    if(!$(".nav-tabs li:nth-child(1)" ).hasClass( "active"))
    {$( ".nav-tabs li" ).removeClass( "active" );$( ".nav-tabs li:nth-child(1)" ).addClass( "active" );}
    if(maps.uri()!='get-eLoc') $("#auto").val('');
    
    if(maps.click_marker) map.removeLayer(maps.click_marker);/*right click*/
    $("#uap_tap_dv,#tap_dv").hide();
     if(typeof removeDevices!=='undefined') removeDevices(); 
}
var place_d = 0,search_word=0,search_index=0;
var get_place_details=function(eloc,drag,filter_str)
{      
  
    if(!eloc) return false;   
     var fltrr='';
    filter_str_new=filter_str;   
    if(typeof filter_str!=="undefined")  fltrr="&filter_str="+filter_str;
    $("#main_page").animate({left: '0px'}, 300);$("#collapse").html('&#x027EA;');
    $('#geo_location').removeClass('active');if(maps.watchId) navigator.geolocation.clearWatch(maps.watchId);
    search_index=$(".as-results ul li.active").index()+1;
    var pp_st=pop_state,url = window.location.toString().split('/'),curl = url.slice(-1)[0];
    var tt = eloc.match("place-(.*)@");
    var title=decodeURIComponent(tt[0]).substring(6,tt[0].lastIndexOf("-")).replace(/\+/g," ").replace(/\-/g,", ").replace(/\$/g,"/").replace('?','');
    if(eloc.search('-near-')!==-1) { 
        title=tt[0].substring(6,tt[0].length-1).replace(/\-/g," ").replace(/\+/g," ");
        if(curl!=eloc) call_url("Map for "+title+" - MapmyIndia",eloc,'','',drag); 
    }
    else if(curl!=eloc) {call_url(title+" - MapmyIndia",eloc,'',''); }
    var currentURL = eloc.split(new RegExp(['-', '@', 'zdata='].join('|'), 'g'));

    /*nearby & dir*/ 
    var param=atob(currentURL[currentURL.length-1].replace('ed','')).split('+');
    if($('#auto').val()!=title && title) $('#auto').val(ucwords(title.split(",")[0].replace(/\$/g,"/").replace(' near me','').replace('?','')));
    if(param[5]!='el') {$("#auto_end").val($("#auto").val());/*$("#end_dirs").val(param[1]+","+param[0]);fini*/}
    $("#searchnearByDV").hide();
    $("#auto_cross_bt").show();
    abort_all();
    if(maps.click_marker) map.removeLayer(maps.click_marker);/*right click*/
    if(rich_popup) map.removeLayer(rich_popup);
    var poi = eloc.replace(/\&/g,"%26");
    if(!poi) return false;
    /*if(param[5]=='el') $("#clear_auto").html("<img src='images/load.gif' style='width:18px'>"); else $("#loader").show();*/
    close_cat();auto_load('');

    if(!param[4] || drag){if(marker2) map.removeLayer(marker2);}
    if(!marker2._map && !param[4]) { 
        if(param[5]=="nozm")
        {
         
          show_location("nozm",eloc); 
        }
        else show_location((param[5]=='nr'?'near':''),eloc);
         
}



    place_d = $.get( "poi_details?poi="+poi+"&pop="+pp_st+fltrr, function(data) 
    {
        if(window.innerWidth>600) {var ht="auto";var mht="80vh";}
        else {var ht="auto"; var mht="auto";}
        if(data)
        {   
            try{var decode= JSON.parse(data);}catch(e){auto_load('x');show_error(1);$("#loader").hide();return false;}
            if(!decode.html) { auto_load('x');show_error(1);return false;}
            else
            {
                if(map.hasLayer(near_markers) && !param[4])
                { /*back from near result*/
                   $('#poi_dv').html(decode.html).slideDown( "fast", function() {}).scrollTop();$("#near_dv").slideUp( "fast", function() {});;
                }
                else $('#res_info').html(decode.html).show().scrollTop();
            }
            
            $('.main-page').css('overflow-y','visible');$(".panel-primary").show();
            if(mobilecheck() && decode.encode){if(param[3].length==6)  if(mobilecheck()) $(".panel-primary").hide();else $(".panel-primary").show();}
            if(!pp_st){
               
                if(currentURL[(currentURL.length)-2].indexOf('WR') !== -1 || currentURL[(currentURL.length)-2].indexOf('wr') !== -1)
                {
                    writeReview(decode.encode) 
                } 
                else if(currentURL[(currentURL.length)-2].indexOf('RR') !== -1 || currentURL[(currentURL.length)-2].indexOf('rr') !== -1)
                {
                    var pinId = (currentURL[(currentURL.length)-3]).split('!!');
                    readReview(decode.encode,pinId[1]); 
                }
                else if(currentURL[(currentURL.length)-2].indexOf('LR') !== -1)
                {
                    var pinId = (currentURL[(currentURL.length)-3]).split('!!');listReport(decode.encode,pinId[1]); /*list report*/
                }
                else if(!currentURL[(currentURL.length)-2])
                {
                    $('#error_modal').hide().html('');
                }
            }
        }
        auto_load('x');
    });
};
/*poi photo*/$(document).on("click", "img[id^='poi_img']", function(){ $("#error_modal").html("<div class='img_box_ou'>"+$(".place-img").html()+"<div  class='img_x' onclick=\"$('#error_modal').html('').hide()\"><i class='material-icons'>close</i></div></div>").show();}); 
$(document).on("click", "img[id='enlarge']", function(){var imgPth=this.src;$("#error_modal").html("<div class='img_box_ou'><img src='"+imgPth.replace('medium_','').replace('medium','original')+"'><div  class='img_x' onclick=\"$('#error_modal').hide()\"><i class='material-icons'>close</i></div></div>").show();});
call_details = function(adrs)
{
    home(); 
    call_url('',adrs);
    show_location('',adrs);
    get_place_details(adrs);
    if(rich_popup) map.closePopup(rich_popup);
};
function homework(id){notify("Search place to set as "+id);$('.with-nav-tabs').show();call_url('','add-'+id);$('#auto').focus();$('#res_info,.as-results').hide();return false;}
var rich_popup=0;
open_popup = function(name,adrs,link,lat,lng,uap,other)
{
    $(document).ready(function(){
    if(rich_popup) map.removeLayer(rich_popup);
    var jsonData = {'add_place':name+' '+adrs,'address':link,'adrs':name+' '+adrs,'user_add_place':uap,'other':other};
    var html = reportPopup(jsonData,lat,lng);
    rich_popup = L.popup({className:"simple_pop",offset:[-10,-10],autoPan:false}).setLatLng(L.latLng(lat, lng)).setContent(html);
    map.addLayer(rich_popup);
    });
};
var login_callback=function(type){
    if(type=='rw') reviewsSubmit(reviewFormData);else if(type=='rp') reportsSubmit(reportformData);
    else if(type=='adp') save_UAP();else if(type=='sugp') save_SuggestedEdit();else if(type=='set_home' || type=='set_work' || type == 'my-fav-route') {$("#"+type).click();}
    else if(type.indexOf('*pin_')!==-1){var type=type.replace("*","");$("#"+type).click();}
    else if($("#"+type)) $("#"+type).click()
},purl="";
var call_url=function(title, reqUrl, description, keyword, drag, add)
{  
    if(mobilecheck() && $("#geo_location").hasClass('active')) {$('.aqiHome').show();}
    else{if(mobilecheck()){$('.aqiHome').hide();}}
    reqUrl=reqUrl.replace(/\#/g,"");
    if(pop_state!=1){
        if(reqUrl || reqUrl.indexOf('@')!==0) 
        {
         $("#get-eloc-sec-bus,.get-eloc-sec-bus,.covidTrigMain,#cat_tab").hide();
        }
        if(reqUrl.indexOf('direction')==0)
        {
            if(mobilecheck()){$('.aqiHome').hide();}
        }
        if(reqUrl!='add-a-place'){$("#uap_tap_dv").hide();$(".addp-web-onmap-sec").hide();}
        var url = window.location.toString().split('/');
        var curUrl = url.slice(-1)[0];
        var newUrl = reqUrl;
        if(!curUrl && newUrl=='.') return true;
        curUrlComponent = (curUrl.indexOf('direction-') !== -1 || curUrl.indexOf('place-') !== -1) ? breakUrl(curUrl) : '';
        reqUrlComponent =  (reqUrl.indexOf('direction-') !== -1 || reqUrl.indexOf('place-') !== -1) ? breakUrl(reqUrl) : '';
       
        if(reqUrlComponent && curUrlComponent)
        { 
            var curDecode ="",reqDecode ="";
            try{curDecode =atob(curUrlComponent[(curUrlComponent.length)-1].replace('ed','')).split('+');
             reqDecode = atob(reqUrlComponent[(reqUrlComponent.length)-1].replace('ed','')).split('+');}catch(e){}
            if(curUrl.indexOf('direction-') !== -1 && reqUrl.indexOf('direction-') !== -1 && (reqUrl.indexOf('!data') !== -1 || curUrl.indexOf('!data') !== -1))
            { 
                if(title!=1) document.title = title;
                if( ((curDecode[1] != reqDecode[1]) || (curDecode[3] != reqDecode[3])) || (curDecode[5] != reqDecode[5]) || reqUrl.indexOf('!data') !== -1||  curUrl.indexOf('!data') !== -1)
                {
                    window.history.pushState(newUrl , title, newUrl);
                }
            }
            else if(curUrl.indexOf('place-') !== -1 && reqUrl.indexOf('place-') !== -1)
            {
                if((curDecode[3] != reqDecode[3]) || (curUrlComponent[(curUrlComponent.length)-2] != reqUrlComponent[(reqUrlComponent.length)-2])|| !curDecode[3])
                {
                   if(reqUrl!=curUrl) document.title = title;
                   if(drag) window.history.replaceState(newUrl , title, newUrl);   
                   else window.history.pushState(newUrl , title, newUrl); 
                }
            }
            else if(curUrl.indexOf('place-') !== -1 && reqUrl.indexOf('direction-') !== -1)
            {
                document.title = title;
                window.history.pushState(newUrl , title, newUrl);   
            }
            else {document.title = title; window.history.pushState(newUrl , title, newUrl); }
        }
        else
        {
            if(title=='' || title=='.' || title.indexOf('@')===0) 
            {
                title="MapmyIndia Maps: Search locations, driving directions and places nearby";
            }
            var nttl=ucwords(title.replace(/\-/g," ").replace(/\+/g," ").replace(/\%20/g, '+').replace(/\+/g, ' '));
            if(curUrl != newUrl)
            { 
               window.history.pushState(newUrl,title,newUrl.replace(/\%20/g, '+').replace(':',';'));  
            }  
            document.title = nttl;
        }

        if(description)
        {
            $("[name='description']").prop('content',description);
            $("[name='keywords']").prop('content',keyword);
        }
        clearInterval(trackPin);
        if(trackMarker){map.removeLayer(trackMarker);}
        /*if(title.indexOf("My People") === -1 && title.indexOf("My Device") === -1)
        {
            intouchMaps.removeDevices();
        }*/
        if(newUrl=='.') {try{map.setActiveArea('viewport_all');}catch(e){}if(!x_cat) $("#cat_tab").show();}
        if(!mobilecheck()) collapse('',newUrl);
        if(curUrl!=newUrl) {purl=curUrl;}
    }
    else if(pop_state==1 && add=='replace' && back_state==0)
    {
        var url = window.location.toString().split('/');
        var curUrl = url.slice(-1)[0];
        var newUrl = reqUrl;
        curUrlComponent = (curUrl.indexOf('direction-') !== -1 || curUrl.indexOf('place-') !== -1) ? breakUrl(curUrl) : '';
        reqUrlComponent =  (reqUrl.indexOf('direction-') !== -1 || reqUrl.indexOf('place-') !== -1) ? breakUrl(reqUrl) : '';
       
        if(reqUrlComponent && curUrlComponent)
        { 
            var curDecode ="",reqDecode ="";
            try{curDecode =atob(curUrlComponent[(curUrlComponent.length)-1].replace('ed','')).split('+');
             reqDecode = atob(reqUrlComponent[(reqUrlComponent.length)-1].replace('ed','')).split('+');}catch(e){}
            if(curUrl.indexOf('direction-') !== -1 && reqUrl.indexOf('direction-') !== -1 && (reqUrl.indexOf('!data') !== -1 || curUrl.indexOf('!data') !== -1))
            { 
                if(title!=1) document.title = title;
                if(purl != newUrl)
                {   
                    window.history.pushState(newUrl , title, newUrl);   
                }
            } 
        }  
    }
    else {pop_state=0;if(!title) title="MapmyIndia Maps: Search locations, driving directions and places nearby"; document.title = title;}
    if(newUrl!='.' && newUrl!='get-eLoc' ) {if($('#eloc-close').is(':visible') && typeof close_eloc === "function") {close_eloc('all');}close_cat();  ga_analytics(reqUrl);} 
    if(reqUrl.indexOf('timeline')!=-1)
    {
            if($('.canvas .n-m-c-list #traffic_control').css('display') != 'none')
            {
                $('.canvas .n-m-c-list #traffic_control').hide();
                $('.canvas .n-m-c-list #layer_panel_trigger').hide(); 
            }
    }else{
            if($('.canvas .n-m-c-list #traffic_control').css('display') == 'none')
            {
                $('.canvas .n-m-c-list #traffic_control').show();
                $('.canvas .n-m-c-list #layer_panel_trigger').show(); 
            }
    }

        $('#taketour_dv').hide();
   
        
  /*ga('send', 'pageview');*/ 
};
function open_app(os,linkToOpen)
{
    var store_lnk="https://itunes.apple.com/in/app/map-directions-local-searches-travel-guide/id723492531?mt=8";
    if(os=='android') {store_lnk="https://play.google.com/store/apps/details?id=com.mmi.maps&hl=en";}
    $("#loader").show();
    window.location.href = linkToOpen;
    var intw=setInterval(store_or_close, 9000);
        var start = Date.now();

        function store_or_close(){
          var now = Date.now();
          if (now - start < 7500) {
              return false;
          } else {
              window.clearInterval(intw);
              window.location.replace(store_lnk);
              return false;
          }
        }
 }
function collapse(action,url)
{
    if(action==1)
    {
        if(url=='m')
        {
            if(parseInt($('#poi_info').css('top'))<($(window).height()*90/100)) $("#poi_info").animate({top: '99vh'}, 300); else $("#poi_info").animate({top: '65vh'}, 300);
        }
        else if($('#main_page').css('left')=='0px')
        {
           $("#main_page").animate({left: '-=404px'}, 300);
          $("#collapse").html('&#x027EB;').show();
        }
        else {
             $("#main_page").animate({left: '0px'}, 300);$("#collapse").html('&#x027EA;');
        }
    }
    else {
        window.setTimeout(function (){
        /*alert(url+"#"+$("#res_info").css("display"));*/
       /* if((url=='.' || url=='' || $("#res_info").css("display")=="none") && $('#main_page').css('left')=='0px') $("#collapse").hide(50);
        else if($("#res_info").css("display")!=="none" && url!='.'){$("#collapse").show(50);}*/
        },2000);
    }
};

var show_location = function (source,hash,inputId) /*search & display loc**/
{  
    if(source=='nozm') return false;
    /*check search current loc*/ 
    if(hash.slice(-2)!='ed') hash+='ed';
    var hash_address = hash.replace('@RR','@').replace('@RW','@').split("@");
    var title_text = hash.match("(.*)@");
    var title_f ="";
    try{
        title_f = title_text[1].toString().replace("place-","").replace(/\-/g,", ").replace(/\_/g," ").replace(/\+/g," ");
    }catch(e){}

    if(hash.indexOf('data=geo')==-1)
    {        
        /*var arr_len=hash_address.length;*/
        var display_latln = hash_address[hash_address.length-1].substring(0,hash_address[hash_address.length-1].indexOf('zd')).split(',');
        var dia_elc="";
        if(display_latln == "WR" || display_latln == "wr")
        {
            display_latln = [""];
        }
        var ltln_pos1 = hash_address[hash_address.length-1].substring(hash_address[hash_address.length-1].indexOf('data=')+5,hash_address[hash_address.length-1].indexOf('ed'));/*latlng & zoom*/
        try
        {
            var ltln_pos = atob(ltln_pos1).split('+');
            dia_elc="<br>eLoc: <span class='dia_elc'>"+ltln_pos[3]+"</span>";
        }
        catch(err)
        {
            $("#mainH").show();
        }
        if(maps.def_locality == title_f)
        { 
           if(ltln_pos[0] && ltln_pos[1]) map.setView(new L.LatLng(ltln_pos[0],ltln_pos[1]),12); 
        }
        else
        {
            if(hash_address[hash_address.length-1].indexOf('data=geo')==-1)
            { 
                yy1 = ltln_pos[0];xx1 = ltln_pos[1]; 
                if(yy1.indexOf('.')==-1 || xx1.indexOf('.')==-1)
                {
                    return false;
                }

                var zz=ltln_pos[2].replace('z','');
                /*if(maps.lx==xx1 && maps.ly==yy1 && marker_cur ){}*/
                $(document).ready(function()
                {  
                     if(map.hasLayer(marker2))  map.removeLayer(marker2);
                    var url = window.location.toString().split('/');
                    var curl = url.slice(-1)[0];
                    if(!near_markers) remove_layers();/*remove if not cat icon*/
                    var icon_d = L.icon({iconUrl: 'images/general.png',iconSize: [36, 45], iconAnchor: [19, 45],popupAnchor: [-1, -36]});
                    var hadrs ="",jsonData ="",jsonHtml="";
                    try{ 
                        hadrs=hash_address[hash_address.length-2].replace('place-','').replace(/\+/g," ").replace(/\-/g,",").split(',');hadrs.pop();
                        jsonData = {
                            'add_place':ucwords(hadrs.join(',').replace('$','/')),
                            'address':hash,
                            'adrs':ucwords(hadrs.join(',').replace('$','/')),
                            'user_add_place':'|||'+ltln_pos[3]+'||||||||||||'+yy1+'|'+xx1+'|1||||'+hadrs
                        } ;
                        jsonHtml = reportPopup(jsonData,yy1,xx1,1);
                    }catch(e){}
                    if(curl.indexOf("covid")==-1) {if(mobilecheck()) map.setActiveArea('viewport_all'); else map.setActiveArea('viewport');}
                    if(curl.indexOf("-near-")==-1)
                    {


                        /*if(map.hasLayer(marker2))  map.removeLayer(marker2);*/
                        marker2 = new L.Marker(new L.LatLng(parseFloat(yy1), parseFloat(xx1)), {icon: icon_d,draggable:false}).bindPopup(jsonHtml);
                        marker2.on("dragend", function(e) {get_location(e.target._latlng)});  
                        map.addLayer(marker2);
                        if(!near_markers){
                        var group = new L.featureGroup([marker2]);
                        map.fitBounds(group.getBounds()).setZoom(zz);
                        
                        }
                    }
                    if(source=='' || source=='nozm' || source=='near')
                    {
                        if(display_latln[0]==undefined || display_latln[0]=='' || display_latln[1]==undefined )  
                        {
                            var disp_lat=yy1; 
                            var disp_lng=xx1;
                            var disp_z=15;
                        }
                        else 
                        {
                            var disp_lat=conv(display_latln[0],'decode');
                            var disp_lng=conv(display_latln[1],'decode');
                            var disp_z=conv(display_latln[2],'deocde');zz=disp_z;
                        }
                        /*converte all cord*/          
                        if(!ltln_pos[4]) 
                            {  
                                   map.setView(new L.LatLng(disp_lat,disp_lng),zz); 
                            }
                    }
                });
            }
        } 
    }

    if(!$.inArray(inputId, ['auto_start','auto_end']) === -1)
    {
        $('#place_details').hide();/*hide if any place details*/
    }
 
    $("#mainH").show();var eloc="";
    if(hash.indexOf('data=geo')==-1){if(ltln_pos[3]) var eloc=ltln_pos[3].replace('ID','');else var eloc="";}
    var placeName = decodeURIComponent(title_f).replace(", "+eloc,'').replace(/\$/g, '/');
    var title = 'Map of '+placeName+' - MapmyIndia';
    var description = 'Get map of '+placeName+' by Mapmyindia. Find location,directions,places & brands near '+placeName;
    var keyword = 'map of '+placeName+', directions of '+placeName+', places nearby '+placeName;

    /*if(!$('#auto').val()) $('#auto').val(ucwords(placeName));*/
    $("[name='description']").prop('content',description);
    $("[name='keywords']").prop('content',keyword); 
    /*document.title = title;*/
    $('#search-near-dir').hide();
    $('#search-clear').show();
    $("#nearPage").hide();
    $('#distDVView').hide();/* route advice*/
    $("#routePage").hide();
    $("#direction_mess").hide();
    $("#cur_loc").html('<img src="images/current_loc.png">');
};

function share_cp()
{
    var curl= new Clipboard('#curl');
    curl.on('success', function(e) 
    {
        show_error('','Copied to clipboard! Paste to share.','green_bg');
    }).on('error', function(e) {
        show_error('','Failed due to security, copy URL manually','red_bg');
    });
}
var dlink=0;
function share(loc,type,textTitle,media) 
{       
    if(!loc) loc=location;
    dlink=0;
    var corona_ban='';
    var titl = 'SHARE ON';
    if(loc.indexOf('covid-19') != -1 || loc.indexOf('corona') != -1) {
       if(loc.indexOf('near/')==-1)
        {
          var corona_ban = '<div class="covidBanner" style="float: left;width: 100%;background: #fff;"><img src="images/covid-banner.jpg" alt=""></div>'; 
         var titl = 'In these challenging times of coronavirus pandemic, get "live and latest info assist" at COVID-19 guide from MapmyIndia.';
         if(loc.indexOf('?') != -1 && loc.indexOf('?access') == -1) {var corona_type = loc.split("?"); titl+="Please check the "+corona_type[1].replace('issues-nearby', 'lockdown_issue').replace(/\_/g, ' ')+" Map Layer here.";}  
        }
    }
    var text='<div class="share-modal share-wrap"><div class="search-title">'+"<input type='text' id='share_input' style='outline: none;background:#fff;border:none;color:#fff;;width:2px;height:2px;' class='input' value='"+loc.split('?access_token')[0]+"'><input type='hidden' id='share_title' class='input' value='"+textTitle+"'>"+
     '<div class="search-title-right pull-right">'+
        '<a onclick="$(\'#error_modal\').hide()" class="share_close_btn">'+
            '<i class="material-icons">close</i>'+
        '</a>'+
    '</div>'+
       '<div class="search-title-left blue-font pull-left">'+
        '<div class="pull-left">'+
            '<h3>'+titl+'</h3>'+
        '</div>'+
    '</div>'+
    '</div>'+  corona_ban +    
    '<ul class="share-list">'+
        '<li>'+
            '<a data-clipboard-text="'+loc+'" id="curl" onclick="share_cp()" class="fa_url">'+
                '<i class="fa fa-link"></i>'+
                '<span>URL</span>'+
            '</a>'+
        '</li>'+
        '<li>'+
            '<a onclick="share_social(\'social_f\')" id="social_f" class="fa_fb">'+
                '<i class="fa fa-facebook"></i>'+
                '<span>Facebook</span>'+
            '</a>'+
        '</li>'+
        '<li>'+
            '<a onclick="share_social(\'social_t\')" id="social_t" class="fa_tw">'+
                '<i class="fa fa-twitter"></i>'+
                '<span>Twitter</span>'+
            '</a>'+
        '</li>';
        if(mobilecheck())
        {
            text += 
            '<li>'+
                '<a onclick="share_social(\'social_w\')" id="social_w" class="fa_wh">'+
                    '<i class="fa fa-whatsapp"></i>'+
                    '<span>Whatsapp</span>'+
                '</a>'+
            '</li>';
        }
        text +=
        '<li>'+
            '<a onclick="share_social(\'social_m\')" id="social_m" class="fa_em">'+
                '<i class="fa fa-envelope-o"></i>'+
                '<span>Email</span>'+
            '</a>'+
        '</li>';
        if(type)
        {
            text += 
            '<li>'+
                '<a onclick="share_social(\'social_phn\')" id="social_phn" class="fa_wh fa_ph">'+
                    '<i class="fa fa-mobile"></i>'+
                    '<span>Phone</span>'+
                '</a>'+
            '</li>';
        }
        text +=
    '</ul></div>';
    $("#error_modal").html(text);
    /*check direct single media*/
    if(media){
        share_social(media);return false;
    }
    else $("#error_modal").show();
    
    var currentURL=document.URL;
    if (currentURL.indexOf('add-a') !== -1) $(".share_close_btn").attr("onclick","$('#error_modal').hide();$('.addp-back-btn').click();");
}
function share_social(media)
{
    var currentURL=document.URL.split('?access_token')[0];
    if (currentURL.indexOf('add-a-place') !== -1)
    {
        var iurl = "https://maps.mapmyindia.com/image-" + $("#place_lat").val() + "-" + $("#place_lon").val() + ".jpg";
        if ($("#"+media).attr('data-event') == 'eloc')
        {

            var eloc = $(".addp_get_eloc").find("strong").html();
            var currentURL = 'http://eloc.me/' + eloc;
            var currentTitle = 'Added a Eloc ' + eloc + ' - a 6 character digital address called an eLoc by MapmyIndia. Click to add your place!';
            /*var win = window.open("https://www.facebook.com/sharer.php?u=" + currentURL + "&summary=MapmyIndia Maps&title=" + currentTitle + "&picture=" + iurl, "", "height=368,width=600,left=100,top=100,menubar=0");*/
        }
        else 
        {
            currentURL = $("#share_input").val();
            currentTitle = 'Added a Eloc ' + $(".addp_get_eloc").find("strong").html() + ' - a 6 character digital address called an eLoc by MapmyIndia. Click to add your place!';
        }
    }
    else 
    {
        
        var currentTitle = document.title;
        
        var ct = currentTitle;
        currentTitle = currentTitle.substring(0,currentTitle.indexOf('@')).replace(/\+/g, '_').replace(/\%20/g, '_').replace(/<br>/, "\n");
        /*atob(encodedString);*/
        
        if(!currentTitle) 
        {
            currentTitle = ct.replace(/\+/g, '_').replace(/\%20/g, '_').replace(/<br>/, "\n");
        } 
        if(currentURL.indexOf('place-') !== -1)
        {
            var cr_arr=document.URL.split('data=');
            var zdata=atob(cr_arr[1].replace('ed','')).split('+');
            if(zdata[0]) var iurl="https://maps.mapmyindia.com/image-"+zdata[0]+"-"+zdata[1]+".jpg";
            else var iurl="";

            var eloc = zdata[3];
            var placeName = $('#auto').val().replace(/Copy|Copied!|/g,'').trim().replace('eloc.me/'+eloc,'').trim();
            currentURL = $("#share_input").val();
            if(currentURL=='https://eloc.me/') {send_err("social_share Issue url"+currentURL+" media "+media);show_error(1);return false;}
            if($(this).attr('data-event') == 'eloc')
            {
                currentTitle = 'Searched for '+eloc+' - a 6 character digital address called an eLoc by MapmyIndia. Click to search for yours!';
            }
        }
        else
        {
            currentTitle=document.title;currentURL = $("#share_input").val();
            /*var win=window.open("https://www.facebook.com/sharer.php?u="+currentURL+"&summary=MapmyIndia Maps&title="+currentURL.split('@')[0]+"&description=Get map of "+currentTitle+" from MapmyIndia Maps","","height=368,width=600,left=100,top=100,menubar=0");*/
        }
        if(currentURL.indexOf('eloc.me')!==-1 || currentURL.indexOf('checkin')!==-1) currentTitle ='I want you to check out a place on MapmyIndia Move! Check it out:';
        else if(currentURL.indexOf('review')!==-1) {currentTitle ='I would like you to check this review on Mapmyindia Move:';}
        else if(currentURL.indexOf('report@')!==-1) currentTitle ='I would like you to check this report on Mapmyindia Move:';
        
    }
    
    if(!currentURL){send_err("social_share Issue url"+currentURL+" media "+media);show_error(1);return false;}
    if(currentURL.indexOf('eloc.me')!=-1 && currentURL.length!=21) {currentURL=currentURL.replace('ID','');}
    
    
    if(currentURL.indexOf('review@')!==-1||currentURL.indexOf('report@')!==-1 || currentURL.indexOf('journey=')!==-1 || currentURL.indexOf('checkin')!==-1 || currentURL.indexOf('vehicle/')!==-1 || currentURL.indexOf('alarm/')!==-1)
    {
        if(dlink) currentURL=dlink;
        else {notify('Loading wait...');
            setTimeout(function(){
                $.ajax({url: 'userAuth?deepLink',type: "POST",async:false,data:en.code({'mamth':'deepLink','url':currentURL}),success: function(data){ if(!data) {show_error(1);return false;}currentURL=data;dlink=data;share_social(media);notify('');}});
            },200);
            return false;
        }  
        
    }
    else if(currentURL.indexOf('report@')!==-1)
    {
        var u=currentURL.split('@'); currentURL=u[0]+"/ONMAP/"+u[3];
    }
    else if(currentURL.indexOf('journey=')!==-1 )
    {
        var u=currentURL.split('@'); currentURL="https://maps.mapmyindia.com/review/"+u[1];console.log(currentURL);
    }
    
    currentURL=encodeURIComponent(currentURL.replace(/\ /g, '+'));
    if(currentURL.indexOf('%2Fcorona')>1) { 
        currentTitle='In these challenging times of coronavirus pandemic, get \"live and latest info assist\" at COVID-19 guide from MapmyIndia.';
        if(currentURL.indexOf('%3F') != -1 && currentURL.indexOf('access_t') == -1) {var corona_type = currentURL.split("%3F"); currentTitle+="Please check the "+corona_type[1].replace('issues-nearby', 'lockdown_issue').replace(/\_/g, ' ').replace(/\%2C/g, ', ')+" Map Layer here.";}
    }
    if($("#share_title").val() && $("#share_title").val()!='undefined') 
    {
        currentTitle = $("#share_title").val();
    }
    if(media=='social_f')
    { 
        var surl="https://www.facebook.com/sharer.php?u="+currentURL+"&summary=MapmyIndia Maps&quote="+currentTitle.replace(/\<br>/g, '%0A')+"&description=Get map of "+currentTitle+" from MapmyIndia Maps",win=window.open(surl,"","height=368,width=600,left=200,top=200,menubar=0");  
        setTimeout(function(){win.location.href=surl;}, 2000);  
    }
    else if(media=='social_t')
    {
        if($("#share_title").val() && $("#share_title").val()!='undefined') currentURL="-";
        if(currentURL.indexOf('-review=')!=-1){try{var dts=currentURL.split('=');currentTitle="Reviewed - "+dts[2]+"%0a "+dts[3]+"%0a";}catch(e){}}
        else if(currentURL.indexOf('report-')!=-1){try{var dts=currentURL.split('-');currentTitle="Reported - "+dts[1]+"%0a "+dts[3];}catch(e){}}
        var win=window.open("https://twitter.com/share?url="+currentURL+"&via=MapmyIndiaMove&text="+escape(currentTitle.replace(/\<br>/g, '\n')),"","height=260,width=500,left=100,top=100,menubar=0");
    }
    else if(media=='social_w')
    { 
        if($("#share_title").val() && $("#share_title").val()!='undefined') currentURL="";
        var win=window.open("whatsapp://send?text="+currentTitle.replace(/\<br>/g, '%0A')+"%0A %0A "+currentURL,"","data-action=share/whatsapp/share");
    }
    else if(media=='social_m')
    {
          var ur=decodeURIComponent(currentURL.replace(/ /g,"-")).replace(/\%20/g, '-');
          if(currentTitle.indexOf(ur)!==-1) ur="";
          document.location.href = "mailto:?subject="+ encodeURIComponent('MapmyIndia Maps')+ "&body=" + encodeURIComponent(currentTitle.replace("MapmyIndia",""))+' '+ur;
    }
    else if(media=='social_phn')
    {
          send_to_phone(currentURL,'share_link')
    }
    return false; 

}
var glb_datas;
var glb_vals;
var glb_p;

var datas = "";
var vals = "";
var p = "";
var poi = "";
var poi_address = "";
var poi_locality = "";
var poi_city = "";
var poi_district = "";
var poi_state = "";
var poi_pin = "";
var poi_x = "";
var poi_y = "";

var addp=0; 
var add_place_marker=0;
var rev_url=0;

function add_place_div(lat,lng)
{   
    return false;
    $("#auto").val('');
    show_error("We're working on this, try later!");
    return false;
    remove_layers();
    if(lat=='' || lat=='undefined')
    {
        mct=map.getCenter();
        lat=mct.lat;lng=mct.lng;
    }
    call_url('Add Place','add-a-place@'+lat+','+lng+','+map.getZoom()+'zdata='+btoa(lat+'+'+lng+'+'+map.getZoom()));
    if(addp) addp.abort();
    var icon_d = L.icon({iconUrl: 'images/marker_default.png',iconSize: [36, 51], iconAnchor: [15, 45],popupAnchor: [-3, -76]});
    add_place_marker = new L.Marker(new L.LatLng(lat,lng), {icon: icon_d,draggable:true});
    map.addLayer(add_place_marker);
    add_place_marker.on("dragend", function(e) {add_place_div(e.target._latlng.lat,e.target._latlng.lng)});  
    if(popup_context)map.removeLayer(popup_context);/*remove pop*/

    /*get add place html*/
    addp=$.post("add-place", function(data)
    {  
        $('#place_details').html(data).fadeIn(100).css("z-index","10");
        $('#map-sidebar').hide();
        if(rev_url) rev_url.abort();
        rev_url=$.ajax({url: "get_click_revg?"+lat+"&"+lng}).done(function(data) {var json_r = JSON.parse(data);$("#street_adrs").val(json_r.add_place);});
    });
    /*get rev*/
}
var route_url=0;
var trafi_route = 0;
var trafi_route_new = 0;
$("#auto_end,#auto_start").keyup(function(){ if($(this).attr('id')=='auto_start') $("#start_dirs").val(''); else $("#end_dirs").val('');}).blur(function(){$('#'+this.id).css({"background":"","background-size":"20px"});if(req!=0)req.abort();});
function decode(encoded) 
{
    var points = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
        var b, shift = 0, result = 0;
        do {

            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);


        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push([lat / 1E6, lng / 1E6])


    }
    return points
}

function ConvertTime(SecondsInStringFormat)
{
    var sec_num = parseInt(SecondsInStringFormat, 10); 
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) {
        hours = hours;
    }
    if (minutes < 10) {
        minutes = minutes;
    }
    if (seconds < 10) {
        seconds = seconds;
    }
    var time = hours + ' <span>h</span> ' + minutes + '<span> min </span>';
    if (hours == 0)
    {
        var time = minutes + ' <span>min </span>';
    }
    else
    {
        if (hours == 1)
            var time = hours + '<span> h </span>' + minutes + ' <span>min </span>';
        else
        {
            if(hours>24) 
            {
                var rem_hrs=hours%24,day=(hours-rem_hrs)/24;
                var time = day+(day==1?'<span> day </span>':'<span> days </span>')+rem_hrs + ' <span>h </span>' + minutes + ' <span>min</span> ';
            }
            else var time = hours + ' <span>h </span>' + minutes + ' <span>min</span> '; /*******bal remove,**/
        }
    }
    return time;
}

function auto_focus(name)
{

}
function auto_blur()
{
    $('.top-heading').css('background', '#fff');
    $('.menu-btn').show();
    $('#direction_div').show();
    $("input[name='auto']").val("");
    $('#mapup').hide();
    $('.as-results').hide(100);
    $('.search-direction').show();
    $('#search-cancel').hide();
    $('#start_dir').hide();
    $('#end_dir').hide();
    var fth = $('#footerTxt').html();
    if (fth != '')
        $('#footerID').show();
}
function show_error(msg,head,type)
{
    if(msg == 1)
    { msg='We are having some difficulties reaching our network right now. Please try again later.<a href="javascript:void(0)" onclick="$(\'#z-popup,#loader\').hide().html(\'\')" class="note_color">Continue using</a>';}
    if(!head) {head = 'Notification'; }
    if(!type || type == 'note_bg'){type = 'note_bg'; var fa = 'fa-info'} else { $('#error_modal').hide().html(''); var fa ='fa-check'}
    var addplacepop=false;
    if(head=='add-a-place'){
        addplacepop=true;
        head='Success';
    }
    var message = 
    '<div class="common-error-popup">'+
       '<div class="c-e-p-sec">'+
            '<a class="c-close-btn" onclick="$(\'#z-popup\').hide().html(\'\')"><i class="material-icons">cancel</i></a>'+
            '<div class="error-icon '+type+'"><i class="fa '+fa+'"></i></div>'+
            '<div class="c-e-p-text">'+
                '<h2>'+ucfirst(head)+'</h2>';
                if(msg)
                {
                    message += '<p>'+ucfirst(msg)+'</p>';
                }
            message +='</div>'+
        '</div>'+
    '</div>';
    if(type && type == 'green_bg' && addplacepop==false)
    {
        $('#z-popup').html(message).show().delay(4500).fadeOut();
    }
    else
    {
        $('#z-popup').html(message).show();
    }
    
}
function notify(msg,note,nohide)
{
    if(!msg) {$('.success-message-alert').hide();return false;}
    var messg=(!note?'<div class="alert alert-success"><strong>Notification!</strong> '+msg+'</div>':'<div class="alert alert-success">'+msg+'</div>');
    $('.success-message-alert').html(messg).show();
    if(nohide!=1) {$('.success-message-alert').delay(4500).fadeOut();}
}
function showConfirmation(id, event, usrId)
{
    var changedHtml='';
    var functions;
    if(id && event)
    {
        functions = (event == 'listContent' || event == 'listContentRoute') ? 'deleteListContent(\''+id+'\', \''+usrId+'\',\''+event+'\')' : 'deleteList(\''+id+'\', \''+usrId+'\')';
        changedHtml='<h2>Delete Confirmation</h2>'+'<p style="margin-bottom:15px;">Are you sure you want to delete this item?</p>';
    }
    else
    {
        if (event == 'edit')
            functions = 'save_SuggestedEdit()';
        if (event == 'adduap')
            functions = 'save_UAP()';
        changedHtml='<h2>Submit Confirmation</h2>' + '<p style="margin-bottom:15px;">Are you sure you want to submit this place?</p>' ;
    }
   
    var message =
    '<div class="common-error-popup">'+
        '<div class="c-e-p-sec">'+
            '<a href="javascript:void(0)" onclick="$(\'#z-popup\').hide().html(\'\')" class="c-close-btn"><i class="ti-close"></i></a>'+
            '<div class="error-icon blue_confirm_bg"><i class="fa fa-question"></i></div>'+
                '<div class="c-e-p-text">'+changedHtml+
                    '<div class="pull-right del-confirm">'+
                        '<button class="btn" onclick="'+functions+';$(\'#z-popup\').hide().html(\'\')">Ok</button>'+
                        '<button class="btn" onclick="$(\'#z-popup\').hide().html(\'\')">Cancel</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
    $('#z-popup').html(message).show();
}

function removeCurrentMarker()
{
    if(maps.rev_url) maps.rev_url.abort();
    /*if(marker_cur) map.removeLayer(marker_cur);*/
    marker_cur = '';
    map.removeLayer(xyzzz);
    if(maps.watchId > 0 || (xyzzz && mobilecheck())){navigator.geolocation.clearWatch(maps.watchId);}
    $("#geo_location").removeClass('active');
    $('#cur_loc_d').html('<i class="material-icons">location_searching</i><span id="getCurrent" style="margin-left: 2px;text-decoration:underline;cursor:pointer;font-style:italic">@ Current Location</span>');/*below search box*/
}

function remove_layers()
{
    try{
        if(marker2) map.removeLayer(marker2);
        if(rich_popup) map.removeLayer(rich_popup);
        if(mk) map.removeLayer(mk);
        if(edtmk) map.removeLayer(edtmk);
        if(staticMrkr) map.removeLayer(staticMrkr);
        if(path_dir) map.removeLayer(path_dir);
        if(path_dir_alt) map.removeLayer(path_dir_alt);
        if(path_dir_alt1) map.removeLayer(path_dir_alt1);
        if(from_marker) map.removeLayer(from_marker);
        if(to_marker) map.removeLayer(to_marker);
        if(via1_marker) map.removeLayer(via1_marker);
        if(via3_marker) map.removeLayer(via3_marker);
        if(via2_marker) map.removeLayer(via2_marker);
        if(path2) map.removeLayer(path2);
        if(leaflet_polyline) map.removeLayer(leaflet_polyline);
        if(leaflet_rt) map.removeLayer(leaflet_rt);
        if(leaflet_group) map.removeLayer(leaflet_group);
        if(leaflet_sum) map.removeLayer(leaflet_sum);
        if(leaflet_congestion[0]) map.removeLayer(leaflet_congestion[0]);
        if(leaflet_congestion[1]) map.removeLayer(leaflet_congestion[1]);
        if(leaflet_congestion[2]) map.removeLayer(leaflet_congestion[2]);
        if(mul_report.length<1) {if(report_m) map.removeLayer(report_m);report_mr='';}
        if(traffic_m) {map.removeLayer(traffic_m);traffic_m='';}
        /*removeCurrentMarker();*/
        if(rprt){rprt='';}
        if(report_marker){report_marker=[];} 
        if(review_marker){review_marker=[];} 
        if(activity_marker){activity_marker=[];}
        if(mark) map.removeLayer(mark);
        if(along_marker_group) map.removeLayer(along_marker_group);
        if(maps.popup_click) map.removeLayer(maps.popup_click);/*right click*/
        if(saves_m) map.removeLayer(saves_m);
        if(fav_m) map.removeLayer(fav_m);
        if("object" ==typeof home_marker) map.removeLayer(home_marker);
        if("object" ==typeof work_marker) map.removeLayer(work_marker);
        if(nearby_marker_group) map.removeLayer(nearby_marker_group);/* search nearby pages*/
        if(along_marker_group) map.removeLayer(along_marker_group);/*along*/
        if(near_search) map.removeLayer(near_search);
        if(near_markers) map.removeLayer(near_markers);/*nearc searched loc*/
        if(group_stars) map.removeLayer(group_stars);$("#uap_tap_dv").hide();$(".addp-web-onmap-sec").hide();
        if(world_markers) {map.removeLayer(world_markers);}
        if(timeline_marker) map.removeLayer(timeline_marker);
        if(simplepoly_timeline) {map.removeLayer(simplepoly_timeline);}
    }catch(e){console.log(e);}
}

function pushy(action)
{ 
    $(".drawer-bg-overlay").hide();
    $(".drawer-nav").removeClass("drawer-abs-ad");
}

var issue_req=0;
function send_issue(lat,lng,adrs)
{
    var issue="";
    var name="";
    var email="";
    var phone="";
    if(lat=='feedback')
    {
        issue=$('#feed_back').val();
        email=$('#email').val();
    }
    else
    {
        issue=$('#issue').val();
        if(issue.trim()==''){$('#issue').focus();return false;}
    }
    $('#loader').show();
    if(issue_req) issue_req.abort();
    issue_req=$.post("submit-issue-feedback",{issue: issue,lat:lat,lng:lng,adrs:adrs,name:name,email:email}, function(data)
    { 
        if(lat=='feedback')
        {
            show_error(data);
        }
        else
        {
            if(data.trim()=='blank'){$('#issue').focus();return false;}
            else if(data.trim()=='Unable to submit query!!' || data.trim()=='' || data.trim()==1){show_error(data);return false;}
            else $('#report_text').html(data);
        }
        $('#loader').hide();
    });
}

function reportPopup(json,lat,lng,show)
{ 
    if(typeof(json) == "undefined") return false;
    if(typeof(json.other) == "undefined") json.other='';
    if(json.save == "saved") var save_data = "saved"; else var save_data = "save";
    var res_adrs = json.address;
    var res_user_added_place = json.user_add_place;
    show=0;
    var eloc = '';
    if(json.elc) eloc = json.elc; 
    else if(res_adrs.indexOf('-near-')==-1) {if(res_adrs.indexOf('?@z')!==-1) eloc = res_adrs.split('?@z')[0].slice(-6);else eloc = res_adrs.split('@z')[0].slice(-6);}
    var click_adrs = json.adrs.replace('/','$').replace(/\%20/g, ' ');
    if(click_adrs.indexOf('<br>')!=-1)  click_adrs=click_adrs.split('<br>')[0]; 
    var popups1=json.popups;if(!popups1) var popclass = '';else var popclass = popups1;
    if(typeof(res_user_added_place) != "undefined")
    {
        var user_added_place = res_user_added_place.split("|");
        popclass = (user_added_place[17] == '' || !user_added_place[17] || user_added_place[17] == null ||(json.area!='India' && json.area)) ? 'disabpopcont' : '';
        if(user_added_place[3].length==6 && user_added_place[3]!=eloc) eloc=user_added_place[3];
    }
    else user_added_place=eloc;
    
    
    var dir_from ="",dir_from_cord ="",dir_to_cord="",dir_to="";
    if(maps.uri().indexOf('direction')!=-1){ 
    dir_from = (typeof($("#auto_start").val()) == 'undefined') ? '' : $("#auto_start").val();
    dir_from_cord = (typeof($("#end_dirs").val()) == 'undefined') ? '' : $("#end_dirs").val();
    dir_to_cord = (typeof($("#start_dirs").val()) == 'undefined') ? '' : $("#start_dirs").val();
    dir_to = (typeof($("#auto_end").val()) == 'undefined') ? '' : $("#auto_end").val();
    }
    else $("#auto_start,#auto_end,#end_dirs,#start_dirs").val('');
    var click_dir_from = "direction-from-"+click_adrs.replace(/\//g, '$').replace(/\ /g, '-').toLowerCase().replace('current-location-','')+"?-to-"+dir_to.replace(/\//g, '$').replace(/\ /g, '-').toLowerCase().replace('current-location-','')+"?@zdata="+btoa("from+"+lng+","+lat+","+eloc+"+to+"+dir_from_cord+"+v+||");
    var click_dir_to = "direction-from-"+dir_from.replace(/\//g, '$').replace(/\ /g, '-').toLowerCase().replace('current-location-','')+"?-to-"+click_adrs.replace(/\//g, '$').replace(/\ /g, '-').toLowerCase().replace('current-location-','')+"?@zdata="+btoa("from+"+dir_to_cord+"+to+"+lng+","+lat+","+eloc+"+v+||");
    var pop_icn="location_on",device_name="";
    var url = window.location.toString().split('/');var curl = url.slice(-1)[0].split(',');
    if(curl[2]!=undefined  && curl[1].indexOf('.')!=-1 && url.indexOf('data=')==-1 && lng==curl[1]){device_name="<i aria-hidden='true' class='fa fa-car'></i> <u>"+decodeURIComponent(curl[2])+" ...<i class='fa fa-map-marker' aria-hidden='true'></i><br></b></u>";}
    var share_elc="";
    if(eloc.length==6) share_elc="<div class='new_context' style='cursor:pointer'><b><span><div onclick=\"share('http://eloc.me/"+eloc+"')\"><i class='material-icons'>link</i> <span class='dia_elc'>eloc.me/"+eloc+"</span></div></span></b></div>";
    var f_text = 
    "<div id='top_lclick1'>"+
        "<div class='custom-leaf'>"+
        "<div class='blfont ' style='padding:0 10px 0 0;width:190px' "+(!popclass ? ' onclick="if(marker2) map.removeLayer(marker2);get_place_details(\''+res_adrs.replace('/','')+'\');$(\'.leaflet-popup-content-wrapper\').hide()"': '')+">"+
                "<b>"+device_name+decodeURIComponent(json.adrs.replace(/\%20/g, ' ').replace('<br><b>','<div class="new_context"><b><span>').replace('</b>','</b></div>').replace(':',':</span>'))+
            "</div>"+(eloc?share_elc:'')+'<span class="rating-star" style="display: block;color: #e56a0e;">';
            for(var $i=0;$i<5;$i++){
                if($i<json.rating)
                {
                    var $remain=json.rating-$i;if($remain>0.5) f_text +='<i class="fa fa-star" alt="Review place"></i>'; else f_text +='<i class="fa fa-star-half-o" alt="Review place"></i>';    
                }else f_text +='';
                
            } 
            f_text += '</span>'+(show && lat?"<div class=\'blfont'\>"+parseFloat(lat).toFixed(6)+", "+parseFloat(lng).toFixed(6)+"</div>":'')+
        "</div><br><div id='ev_class'>";
        if(json.hasOwnProperty('other'))
        {
            f_text += json.other;
        }
        f_text += "</div><div class='custom-control' style='background-color: #f2f2f2;'>"+
            "<div class='blfont line "+popclass+"' style='padding:5px 7px 0' onclick=\"map.closePopup();call_url('Direction','"+click_dir_to.replace(/\//g, '$')+"');newdr.driving_box('');\">"+
                "<i class='material-icons' aria-hidden='true'> directions </i> Direction To"+
            "</div>"+
            "<div class='blfont "+popclass+"' style='padding:5px 7px 0 0;' onclick=\"map.closePopup();$('#auto_start-start_dirs .n-d-StaticIcon img').attr('src','images/directions/ic_start_loc_dark.png');call_url('Direction','"+click_dir_from.replace(/\//g, '$')+"');newdr.driving_box('');\">"+
                "<i class='material-icons' aria-hidden='true'> directions </i> Direction From"+
            "</div>"+
        "</div>"+
        "<div class='custom-control' style='background-color: #f2f2f2;'>"+
            "<div class='blfont line "+popclass+"' style='padding:5px 7px 0;' onclick=\"maps.near_box('"+res_adrs+"');\">"+
                "<img src='images/ic_nearby_tooltip.png' alt=''/ style='width: 14px;position: relative;top: 2px;'> Nearby"+
            "</div>"+
            "<div class='blfont "+popclass+"' style='padding:5px 7px 0 0;' onclick=\"map.closePopup();writeReport('"+res_adrs.replace('/','')+"',"+show+");\">"+
                "<i class='material-icons' aria-hidden='true'> report_problem </i> Report"+
            "</div>"+
        "</div>"+
        "<div class='custom-control' style='background-color: #f2f2f2;'>"+
            "<div class='blfont line "+popclass+"' style='padding:5px 7px 10px' onclick=\"addMissingPlace('"+lat+"','"+lng+"','"+res_user_added_place+"','add-a-place','"+res_adrs+"');\">"+
                "<i class='material-icons' aria-hidden='true'> add </i> Add a Place"+
            "</div>"+
            "<div class='blfont "+popclass+"' style='padding:5px 7px 10px 0;' onclick=\"listForm('"+eloc+"','','"+json.add_place+"','"+lat+"','"+lng+"','"+json.address+"')\">"+
                "<i class='material-icons' aria-hidden='true'> playlist_add </i> "+save_data+
            "</div>"+
        "</div>"+
    "</div>\n";  

    return f_text;
}

function reportPopupContent(description,userName,url,cat,subCat,visibility,name,rid,rlike,liked,rflag)
{
    if(rlike==0 || rlike=='undefined') rlike=0;
    if(rflag==0|| rflag=='undefined') rflag='';
    var likeImg="";
   if(liked>0) var likeImg="ic_poi_action_like";else  var likeImg="ic_poi_action_dislike";
    var flagedImg="ic_poi_unflag_small";if(rflag) var flagedImg="ic_poi_flag_small";
    var rprt =
   "<div class='top_lclick1' id='top_lclick1'>"+
       "<div class='custom-leaf'>"+
           "<div class='blfont ' onclick=\"if(near_markers) map.removeLayer(near_markers);readReport('"+userName+"','"+url.replace('/','!')+"',"+visibility+");\" style='padding:0 10px 0 0;width:190px'><b><b><h5 style='font-size: 14px;'>"+cat+"</h5><p style='color: #757575;margin:0;'>"+subCat+"</p></b></div>"+
       "</div><br>"+
       "<div class='custom-control reportedby-custom'>"+
           "<strong>Reported By: </strong>"+
           "<span onclick=\"view_profile('"+userName+"','');\"><i class='fa fa-user'></i>"+name+"</span>"+
       "</div>"+
       "<div class='custom-control custom-control-pop' style='background-color: #f2f2f2;'>"+
           "<div class='blfont line' style='padding:10px 0 10px 7px;text-align:center;'>"+
           "<a class='pin_like_new' data-like='"+rid+"' id='likes_"+rid+"' alt='"+(rlike)+"'>"+
               "<img src='images/place/"+likeImg+".png' alt=''/>"+(rlike>1?' Helpful':' Helpful')+" </a>"+
           "</div>"+
        "<div class='blfont line' style='width:40%;padding:10px 0 10px 7px;text-align:center;'>"+
           "<a class='comment_new' onclick=\"if(near_markers) map.removeLayer(near_markers);readReport('"+userName+"','"+url.replace('/','!')+"@cmtopnnew"+"',"+visibility+");\">"+
                "<img style='width: 13px;margin-bottom: -3px;' src='images/Comment.png' alt=''><p style='display:none;'>"+rlike+"</p>"+(rlike>1?' Comment':' Comment')+" </a>"+
           "</div>"+
        "<div class='blfont' style='padding:10px 0;text-align:center;'>"+
           "<a id='share_locations' class='share-poi' onclick='share(\"https://maps.mapmyindia.com/report/ONMAP/"+rid+"\")' alt='Share Location'><i class='material-icons'>share</i> <span>Share</span></a>"+
           "</div>"+
           "<!--<div class='blfont' style='padding:10px 7px;text-align:center;'>"+
           "<a class='pin_flag' data-user='"+rid+"' id='"+rid+"'>"+
               "<img src='images/place/"+flagedImg+".png' alt=''/>"+(rflag>0?' Flagged':' Flag')+" </a>"+
           "</div>-->"+
       "</div>\n";
   return rprt;
}

var trackPin;
var trackMarker;
var gpsTime = 0;
function getPin(curl)
{
    $("#loader").show();
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?158',
        data: en.code({'mamth':'M158','pin':curl}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.message == 'success')
            {
                if(gpsTime != decode.time)
                {
                    $("#res_info").html(decode.response).show();
                    var icon_d = L.icon({iconUrl: "images/general.png",iconSize: [36, 45], iconAnchor: [15, 45],popupAnchor: [0, -36]});
                    trackMarker = new L.Marker(new L.LatLng(parseFloat(decode.lat), parseFloat(decode.lng)), {icon: icon_d,draggable:false}); 
                    map.addLayer(trackMarker);
                    map.setView(new L.LatLng(parseFloat(decode.lat), parseFloat(decode.lng)), 18,{animation: true,"pan": {"duration": 10}});
                    (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
                    if(mobilecheck()){$('.map-control').css('top','30%');}
                }
                trackPin = setTimeout(function(){getPin(curl)}, 30000);
            }
            else if(decode.message == 'nodataforthispin')
            {
                show_error('No data found for this pin');
            }
            else if(decode.message == 'linkexpired')
            {
                show_error('Entered link has expired');
            }
            else if(decode.message == 'invalidpin')
            {
                show_error('Entered pin is not a valid pin.');
            }
            else if(decode.message == 'any server error message')
            {
                show_error(1);
            }
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
}

/**********************************auth.js starts here***********************************************************/
var alphaExp = /^[a-zA-Z\s]{3,}$/;
var alphaNumExp = /^[0-9a-zA-Z\s]{3,}$/;
var alphaNumDashExp = /^[0-9a-zA-Z\s_\-@\*\.]{3,}$/;
var emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
var phoneExp = /^\d{10}$/;
var pwdExp = /^\S{3,}$/;
var pwdExpNew = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var maxSize = 2000000;
var allowedFileTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/pjpeg'];
var totalFilesAllowed = 4; 
var group_stars = '';
var list_content_marker = [];
var activity_marker = [];
var report_marker = [];
var review_marker = [];
var world_markers="";
var star_marker = 0;
var star_marker_gp = [];
var rprt = '';
var xhr = null;
var storedEvent = '';
var curNo = '';

L.NumberedDivIcon = L.Icon.extend(
{
    options: 
    {
        iconUrl: '',
        number: '',
        shadowUrl: null,
        iconSize: [36, 51], 
        iconAnchor: [15, 45], 
        popupAnchor: [-3, -76],
        className: ''
    },

    createIcon: function () 
    {
        var div = document.createElement('div');
        var img = this._createImg(this.options['iconUrl']);
        var numdiv = document.createElement('div');
        numdiv.setAttribute ( "class", "list-star" );
        numdiv.innerHTML = this.options['number'] || '';
        div.appendChild ( img );
        div.appendChild ( numdiv );
        this._setIconStyles(div, 'icon');
        return div;
    },
});

function ucwords (str) 
{
    str=str.replace(/\,/g, ', ').replace(/\,  /g, ', ');
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) 
    {
        return $1.toUpperCase();
    });
}

function ucfirst(str)
{
    return str.charAt(0).toUpperCase() + str.substr(1);
}

function is_int(n)
{
    return Number(n) === n && n % 1 === 0;
}

function is_float(n)
{
    return Number(n) === n && n % 1 !== 0;
}

function rand(min, max) 
{
    return Math.random() * (max - min) + min;
}

function bytes_to_size(bytes,decimals) 
{
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

var deviceType;
function mobilecheck() 
{
    var rt=((deviceType == 1 || deviceType.length>=1) && deviceType!='d' && deviceType!='0') ? true : false;
    return rt;
};

function tap_action()
{
    try{map.setActiveArea('map');}catch(e){return false;}
    var center = map.getCenter();
    var zm = map.getZoom();
    var url = "place-"+center.lat+","+center.lng+"@zdata="+btoa(center.lat+"+"+center.lng+"+"+zm+"+")+"ed"; 
    writeReport(url);
    $("#tap_dv,.get-eloc-sec-bus").hide();
}

function tap_addPlace()
{
    map.setActiveArea('map');
    var center = map.getCenter();
    var zm = map.getZoom();
    var curl = document.URL;
    /*if(curl.indexOf("add-a-business")!==-1) 
    {
        $(".buttonDiv").hide();
        return false;
    }*/
    xhr=$.ajax({url: "get_click_revg?" + center.lat + "&" + center.lng + "&" + map.getZoom() + "&" + '2'}).done(function (data)
    {
        if (data == '[]') {
            show_error(1);
            return false;
        }
        if (data.trim() != '' && data.trim() != 'undefined')
        {
            var json = JSON.parse(data);
            var res_user_added_place = json.user_add_place;
            $("#modal_new").show();
            $(".reportTrig").show();
            populateaddPlcForm(center.lat, center.lng, res_user_added_place);
            /*addMissingPlace(center.lat,center.lng,res_user_added_place,"add-a-place",json.adrs);*/

        }
    });
}

function breakUrl(url) /* if url passed will decode that url else address bar url*/
{
    if(!url)
    {
        var url = window.location.toString().split('/');
        var urlContent = url[(url.length)-1];
        var separators = ['@'];
    }
    else
    {
        urlContent = url;
        if(url.indexOf('direction-') !== -1)
        {
            var separators = ['-from-','-to-', '@', 'data=', 'zdata='];    
        }
        else if(url.indexOf('place-') !== -1 || url.indexOf('place-') !== -1)
        {
            var separators = ['-', '@', 'zdata=', 'data='];
        }
    }
    if(urlContent)
    {
        if(separators)
        {
            var decodeString = urlContent.split(new RegExp(separators.join('|'), 'g'));
            return decodeString;
        }
        else  return false;
    }
    else
    {
        return false;
    }
}

function setCookie(cookieName,cookieValue,nDays) 
{
    var today = new Date();
    var expire = new Date();
    if (nDays==null || nDays==0) nDays=1;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue)+ ";expires="+expire.toGMTString();
}

function checkStoredEvent(storedEvent)
{
    switch(storedEvent[0].event) 
    {
        case 'favourite':
        case 'myRoute':
            history.go(-1);
            save_search(storedEvent[0].value,data);
        break;
        case 'addImage':
            history.go(-1);
            $("#addImage_browse").focus();
            $("#addImage_browse").click();
        case 'addToList':            
        case 'following':
        case 'follower':
        case 'beenHere': 
        case 'reviewFlag':
        case 'review':
            history.go(-1);
        break;
    }
}

function eLocDetail()
{
    var message =
    '<div class="interstitial-win-main clearfix">'+
        '<a class="parent-closebtn cls-pop eloc-close">'+   
            '<i class="ti-close"></i>'+
        '</a>'+
        '<div class="i-w-img">'+
            '<img src="images/inter_win.jpg" alt="" />'+
        '</div>'+
        '<div class="i-w-text">'+
            '<h2>eLoc is the pincode to your doorstep</h2>'+
            '<ul class="i-w-list">'+
                '<li>'+
                    'An eLoc is a simple 6 character <strong>digital address</strong> for any place, address, flat, house number, office, government building, road, administrative area, metro pillar... etc.'+
                '</li>'+
                '<li>'+
                    '<i class="fa fa-circle"></i>'+
                    "<strong>How to find your eLoc?</strong><br>Simply search for an address in the search bar! And if you can't find your address, add a place & your eLoc will be generated instantaneously"+
                '</li>'+
            '</ul>'+
            '<div class="i-w-btn-wrap">'+
                '<a href="http://www.mapmyindia.com/eloc/" target="_blank" class="btn btn-primary btn-bdr">Learn more</a>'+
                '<a onclick="addMissingPlace(\'28.549513\',\'77.267809\',\'68||MapmyIndia Head Office New Delhi|MMI000|||||Okhla Industrial Estate Phase 3|||Kalkaji|New Delhi|Delhi|110020|HOUSE_ADDRESS|near|J5BRXQ|5|68, Okhla Industrial Estate Phase 3, New Delhi, Delhi. 2 m from MapmyIndia Head Office New Delhi pin-110020\');" class="btn btn-primary cls-pop">Find an eLoc</a>'+
            '</div>'+
        '</div>'+
    '</div>';
    $('#error_modal').html(message).show();
}
var rname;
function save_route(save,route_name,routeId)
{
    var r_save=2;if($("#r1_li").css("display")=="block") r_save=1;
    var fname=ucwords($("#auto_start").val()),tname=ucwords($("#auto_end").val());
    var url = window.location.toString().split('/'),curl = url.slice(-1)[0];
    var dta = curl.split("data=");
    if(dta[1]!=null) dta=decodeURIComponent(atob(dta[1].replace('ed',''))).split('+');
    var from_elc=dta[1]+"@"+fname.replace('Current Location', maps.def_locality),to_elc=dta[3]+"@"+tname.replace('Current Location', maps.def_locality);
    var via="";
    if(dta[5]) via = dta[5].split('|');via_dtl="",via_names='';
    if(via){ try{via_names=curl.match("via-(.*)@")[0].split('?');}catch(e){} }
    for(var i=0;i<via.length;i++)
    {
        if(via[i]) {via_dtl+=via[i]+"@"+via_names[i]+"|";}
    }
   
    placeid=from_elc+"|"+via_dtl+to_elc;
    uri=curl;
    if(save)
    {
        rname=$("#route_n").val();
    var json= {"rname":rname,"placeid":placeid,"route_id":routeId};
        if(!rname.trim()) {show_error('Please give your route a name');$("#route_n").focus();}
        else
        {
           comman('my-fav-route','save_route',json);
        }
        return false;
    }
   if(route_name==undefined) route_name="";
   if(routeId==undefined) routeId="";
    var htm='<div class="cropit-overlay-popup save-to-email" id="change-cropit" "=""><div class="cropit-head"><h2>Save your route</h2><a class="parent-closebtn cls-pop"><i class="ti-close"></i></a></div><div class="cropit-change-pic-sec"><p>Your routes will be saved in My Route section in the side drawer menu.</p><div class="cropit-pic-progress"><span class="input input--hoshi error-main-div"><input class="input__field input__field--hoshi" type="text" id="route_n" value="'+route_name+'"><label class="input__label input__label--hoshi input__label--hoshi-color-1 f_phone_br"><span class="input__label-content input__label-content--hoshi">Give your route a name</span></label></span><div class="cropit-export-sec clearfix"><div class="pull-right"><button class="btn submit-common" id="route-button" onclick="if(!$(\'#route_n\').val()) show_error(\'Enter route name\');save_route(3,\'\',\''+routeId+'\')">Submit</button></div></div></div></div></div>';
    $("#error_modal").html(htm).show();$("#route_n").select();
}
var click_evt='',save_url='';
function save_search(list_id,type,name,placeId,url,lat,lng,locType,listName,status,listVisibility,data_id)
{
    if(save_url) save_url.abort();
    save_url=$.ajax(
    {
        type: 'POST',
        url: 'userAuth?140',
        data: en.code({'mamth':'M140','list_id':list_id,'evt':click_evt}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response)
            {
                if(!decode.html){ $('#error_modal').html(decode.response).show();return false;}
                var error = false;
               
                if(!url || url == "undefined") url = document.URL; 
                var urlContent = breakUrl(url);
                var decodeString ="";
                if(urlContent) decodeString =atob(urlContent[(urlContent.length)-1].replace('ed','')).split('+');

                switch(type) 
                {
                    case 'addToList':
                    case 'favourite':
                        if(!name) name = ucwords($("#auto").val());
                    break;
                    case 'myRoute':
                        if(!name)  name = ucwords($("#auto_start").val())+' to '+ucwords($("#auto_end").val())
                } 
                
                if(!placeId) placeId = ((type=='myRoute')) ? decodeString[1].substr(decodeString[1].length - 6)+'-'+decodeString[3].substr(decodeString[3].length - 6) : decodeString[3];
                if(!lat) lat = (type=='myRoute') ? '' : decodeString[0];
                if(!lng) lng = (type=='myRoute') ? '' : decodeString[1];
                var act_id=$('.active-loc').children().children().attr('id');/*i det*/
                if(!locType) locType = (type=='favourite' && act_id) ? $('.active-loc').children().children().attr('id') : '';
                
                if(!listName) listName = (type=='addToList' && list_id == '') ? $("input[name='list-name']").val() : '';

                if(status===undefined) status = ((type =='favourite' && $('#my-fav').children().prop('class')=='fa fa-heart' && locType == '') || (type=='myRoute' && $('#my-fav-route').children().prop('class')=='fa fa-heart')) ? 0 : 1; 
                if($('.active-loc').children().children().attr('data-user') == act_id && act_id) status=0;
                if(!listVisibility) listVisibility = ($('#list-privacy').is(":checked")) ? 1 : 0;
        
                if((type == 'addToList' || type == 'myRoute') && name.length < 2)
                {
                    if(type == 'addToList' && list_id){show_error("Place Name cannot be less than 2 characters"); error = true;}
                    if(type == 'myRoute'){show_error("Route Name cannot be less than 2 characters");error = true;}

                }

                if(!list_id)
                {
                    if(type == 'addToList' && listName.length < 2)
                    {
                        show_error("List Name cannot be less than 2 characters");
                        error = true;
                    }
                if(type == 'addToList' && listName.length > 20)
                    {
                        show_error("List Name cannot be greater than 20 characters");
                        error = true;
                    }
                }
                if(!data_id) data_id=$(".list_"+list_id).attr('id');
                if(!error)
                {
                    if( xhr != null ) 
                    {
                        xhr.abort();
                        xhr = null;
                    }
                    var types = ["favourite","myRoute" ];
                    if(jQuery.inArray(type, types) === -1 || locType=='home' ||locType=='office')
                    {
                        $("#loader").show();
                    }
                    var new_url=url;
                    if(!placeId || placeId==undefined)  placeId ="";
                    xhr = $.ajax(
                    {
                        type: 'POST',
                        url: 'userAuth?114',
                        data: en.code({'name':name,'place-id':(placeId.length==6?placeId:placeId.replace('?','').slice(-6)),'url':new_url,'lat':lat,'lng':lng,'loc-type':locType,'list-id':list_id,'status':status,'list-name':listName,'list-visibility':listVisibility,'mamth':'M114','ppid':data_id}),
                        timeout: 15000,
                        success:function (data) 
                        {
                            var decode = JSON.parse(data);
                            $("#loader").hide();
                            if(decode.response == false)
                            {
                                 $("#loader").hide();
                                if(decode.errors)
                                {
                                    show_error(decode.errors[0]);
                                }
                                else  show_error(1);
                            }
                            else if(decode.response.response == '201' && (locType=='home' || locType=='office') && maps.uri().indexOf('place-')==-1)
                            {
                                if(maps.uri()=='add-home' || maps.uri()=='add-work' || ((locType=='home' || locType=='office') && maps.uri().indexOf('place-')==-1)) {setTimeout(function(){viewMyPlace(uname);}, 700);notify((locType.charAt(0).toUpperCase() + locType.slice(1))+' successfully '+(status?'added':'removed'));}
                            }
                            else if(decode.response.statusCode == '201' || decode.response.statusCode == '200' || decode.response.response == '201')
                            {
                              if(type=='addToList')
                              {
                                    var url = window.location.toString().split('/');
                                    var curl = url.slice(-1)[0];
                                    
                                    if(curl.indexOf('my-place')!=-1) {setTimeout(function(){viewMyPlace(uname);}, 500);if(!list_id) {notify('List successfully created.');}else{$('#error_modal').hide().html('');notify('Place successfully created');}}
                                    else if(list_id){if(curl.indexOf(placeId)!=-1) {get_place_details(curl);}$('#error_modal').hide().html('');notify('Place '+(data_id?'removed':'added')+' successfully');}
                                    else {notify('List successfully created.');setTimeout(function(){listForm(placeId,list_id);}, 300);}
                                    $("#loader").hide();return false;
                              }/*show checked in list*/
                              /*else if(maps.uri()=='add-home' || maps.uri()=='add-work' || ((locType=='home' || locType=='office') && maps.uri().indexOf('place-')==-1)) {setTimeout(function(){viewMyPlace(uname);}, 700);notify(locType+' Successfully '+(status?'added':'removed'));}*/
                              else if(type=='myRoute')
                              {/*route save*/
                                   if(status == 0)
                                        {
                                            $("#my-fav-route").html('<i class="fa fa-heart-o" aria-hidden="true"></i> <span>Save</span>');
                                            if($('#add-route').text() == 1)
                                            { 
                                                $('#add-route').text('Add');
                                                $($('#add-route').parent()).removeAttr('onclick'); 
                                            }
                                            else
                                            {
                                                $('#add-route').text(parseInt($('#add-route').text())-1);
                                                $($('#add-route').parent()).attr('onclick','pushy(\'hide\');home();getListContent("'+decode.userName+'","'+btoa('IN('+decode.response.data.listId+')')+'" )'); 
                                            }
                                        }
                                        else
                                        {
                                            $("#my-fav-route").html('<i class="fa fa-heart" aria-hidden="true"></i> <span>Saved</span>');
                                            if($('#add-route').text() == 'Add') 
                                            {
                                                $('#add-route').text(1);
                                                $($('#add-route').parent()).attr('onclick','pushy(\'hide\');home();getListContent("'+decode.userName+'",1,"'+btoa('IN('+decode.response.data.listId+')')+'" )');
                                            }
                                            else
                                            {
                                                $('#add-route').html(parseInt($('#add-route').text())+1);
                                                $($('#add-route').parent()).attr('onclick','pushy(\'hide\');home();getListContent("'+decode.userName+'",1,"'+btoa('IN('+decode.response.data.listId+')')+'" )');
                                            }
                                        }
                              }
                              else if(type=='favourite')
                              {
                                if(status == 0)
                                {
                                            $("#my-fav").html('<i class="fa fa-heart-o" aria-hidden="true"></i> <span>Save</span>');
                                            $('#loc-type').fadeOut(500).html('');
                                            $('#home-loc').fadeOut(500).html(''); 
                                            $('#office-loc').fadeOut(500).html('');
                                            if($('#add-save').text() == 1)
                                            {
                                                $('#add-save').text('Add');
                                                $($('#add-save').parent()).removeAttr('onclick'); 
                                            }
                                            else
                                            {
                                                $('#add-save').text(parseInt($('#add-save').text())-1);
                                                $($('#add-save').parent()).attr('onclick','pushy(\'hide\');home();getListContent("'+decode.userName+'","'+btoa('IN('+decode.response.data.listId+')')+'" )');
                                            }
                                }
                                else
                                {
                                            $("#my-fav").html('<i class="fa fa-heart" aria-hidden="true"></i> <span>Saved</span>');
                                            if($('#add-save').text() == 'Add')
                                            {
                                                $('#add-save').text(1);
                                                $($('#add-save').parent()).attr('onclick','pushy(\'hide\');home();getListContent("'+decode.userName+'","'+btoa('IN('+decode.response.data.listId+')')+'" )');
                                            }
                                            else
                                            {
                                                $('#add-save').html(parseInt($('#add-save').text())+1);
                                                $($('#add-save').parent()).attr('onclick','pushy(\'hide\');home();getListContent("'+decode.userName+'","'+btoa('IN('+decode.response.data.listId+')')+'" )');
                                            }
                                }
                                if(locType=='home' || locType=='office')
                                {
                                    comman('menu','menu',{"evt":"menu","url":maps.uri()});
                                   get_place_details(window.location.toString().split('/').slice(-1)[0]); notify('Successfully added');$("#loader").hide();
                                }
                                    setTimeout(function(){  
                                        if($('.active-loc').children().children().attr('id'))
                                        {    
                                            var tp=$('.active-loc').attr("data-fav");
                                            $('.active-loc').removeClass('active-loc');
                                            if(tp)
                                            {
                                               if(tp == 'home')
                                               {
                                                   if($("#home").hasClass('fa-check-square'))
                                                   {
                                                       $("#home").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                       $("#saved_home").hide();
                                                       $("#set_home .set-item-text p").html('Set as home').show(100);
                                                   }
                                                   else
                                                   {
                                                       $("#home").removeClass('fa-square-o').addClass('fa-check-square').attr("data-user", "home");
                                                       $("#set_home .set-item-text p").html('&#10004; Saved as home').show(100);
                                                   }
                                                   if($("#office").hasClass('fa-check-square'))
                                                   {
                                                       $("#office").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                       $("#saved_office").hide();
                                                       $("#set_home .set-item-text p").html('Set as work').show(100);
                                                   }
                                                }
                                                else
                                                {
                                                    if($("#office").hasClass('fa-check-square'))
                                                    {
                                                        $("#office").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                        $("#saved_office").hide();
                                                        $("#set_home .set-item-text p").html('Set as work').show(100);
                                                    }
                                                    else
                                                    {
                                                      $("#office").removeClass('fa-square-o').addClass('fa-check-square').attr("data-user", "office");
                                                       $("#set_work .set-item-text p").html('&#10004; Saved as work').show(100);
                                                    }
                                                    if($("#home").hasClass('fa-check-square'))
                                                    {
                                                        $("#home").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                        $("#saved_home").hide();
                                                        $("#set_home .set-item-text p").html('Set as home').show(100);
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                $('#loc-type').fadeOut(500).html('');  
                                                $('#home-loc').fadeOut(500).html(''); 
                                                $('#office-loc').fadeOut(500).html('');
                                            }
                                        }
                                    },4000);
                              }

                            
                            }
                            else if(decode.response.statusCode == "400") {show_error(decode.response.data.errors[0].displayMessage);$("#loader").hide();return true;}
                            else if(decode.response.response == '407' && type == 'addToList')
                            {
                                show_error('Place already exists in selected list. Try adding it to another list?.');
                            }
                            else if(decode.response.response == '407' && type == 'favourite')
                            {
                                show_error('Place already exists in selected list. Try adding it to another list?.');
                            }
                            else if(decode.response.response == '406' && type == 'addToList')
                            {
                                show_error('List name already exist.');
                            }
                            else
                            {
                                show_error(1);
                            }
                            if(jQuery.inArray(type, types) === -1)
                            {
                                $("#loader").hide();
                            }
                            xhr = null;
                        },
                        error: function(jqXHR, textStatus, errorThrown) 
                        {
                            if(jQuery.inArray(type, types) === -1)
                            {
                                $("#loader").hide();
                            }
                            show_error(1);
                        }
                    });
                }
            }
            else
            {
                $("#signin").trigger("click");
                var string = [];
                string.push({event:type,value:list_id});
                localStorage.setItem('event', JSON.stringify(string));
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });
    return false;
};


/*--------------------------------------------------List Action Starts------------------------------------------------*/
function add_list(id)
{ 
    setTimeout(function()
    {
        $("#loader").show();
        $('.share-modal').hide();
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?102',
            data: en.code({'mamth':'M102','place-id':id}),
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                if(decode.response)
                {
                    $(".add-to-list-modal").html("<div id='inner'>"+decode.response+"</div>").show();
                }
                else
                {
                    var string = [];
                    string.push({event:'addToList',value:id});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
                show_error(1);
            }
        });
    }, 30);
}

function readList(userId)
{
    setTimeout(function()
    {
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        var data = $("#list-scroll-bar").attr("data-user");
        if(typeof(data) != "undefined")
        {
            data =  atob(data).split("-");
            var page = data[0];
        }
        else
        {
            var page = 1;
        }
        (page == 1) ? $("#loader").show() : $("#review-loader").show();
        xhr = $.ajax(
        {
            type: 'POST',
            url: 'userAuth?110',
            data: en.code({'mamth':'M110','page':page,'userId':userId}),
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                var html = decode.response;
                if(html)
                {
                    var newPage = parseInt(page)+1;
                    if(page == 1)
                    {
                        $("#res_info").html(html).show();
                        call_url(userName+' My List',userName+'?list');
                        if(mobilecheck()){$(".with-nav-tabs").hide();}
                        $("#loader").hide();
                    }
                    else
                    {
                        window.setTimeout(function () 
                        { 
                            $(html).appendTo("#user-list");
                            $("#list-scroll-bar").mCustomScrollbar("update");
                            $("#list-scroll-bar").mCustomScrollbar("scrollTo","#to-scroll",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                            $("#review-loader").hide();
                        }, 200);
                    }
                    $("#list-scroll-bar").attr("data-user",btoa(newPage+"-"+decode.count).replace(/=/g,""));
                    $("#list-scroll-bar").mCustomScrollbar(
                    {
                        scrollButtons:{enable:true},
                        theme:"dark",
                        callbacks:
                        {
                            onTotalScroll:function()
                            {  
                                var newData = $("#list-scroll-bar").attr("data-user");
                                if(typeof(newData) != "undefined")
                                {
                                    newData = atob(newData).split("-");
                                    if(newData[1] == 10)
                                    {
                                        $("#to-scroll").removeAttr("id");
                                        readList(userName);
                                    }
                                }
                            },
                        }
                    });
                }
                else
                {
                    (page == 1) ? $("#loader").hide() : $("#review-loader").hide();
                }
                xhr = null;
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#review-loader").hide();
                show_error(1);
            }
        });
        return false;
    }, 30);
}
function listForm(id,list_id,place_name,lat,lng,url) 
{
    setTimeout(function()
    {
    var currentURL = "";
        if(url) var currentURL = document.URL.split("/").slice(0, -1).join('/')+"/";
        if($("#loader").css("display")!="block") $("#loader").show();
        $('.share-modal').hide();
   
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?102',
            data: en.code({'mamth':'M102','place-id':id,'list_id':list_id,'event':'signin','center':1,'place_name':place_name,'lat':lat,'lng':lng,'url':currentURL+url}),
            timeout: 15000,
            success:function (data)
            {
                var decode = JSON.parse(data);
                if(decode.response)
                {
                   
                    if(list_id){ $("#"+list_id).html(decode.response);}
                    else $(".show_modal").html("<div id='inner' class='inner_add_list place-save-new'>"+decode.response+"</div>").show();
                  
                }
                else if(decode.response == false || decode.response == null)
                { 
                    $('#error_modal').html(decode.html).show();
                    var string = [];
                    string.push({event:'addToList'});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                $("#loader").hide();
          
            }
        });
    }, 30);
}

function updateList(listId, listName, privacy, statusType,preValue)
{
    $("#loader").show();
    if(statusType == 'status')
    {
        var public  = (privacy == 0) ? 1 : 0;
        var private = (privacy == 0) ? 0 : 1;  
    }
    else
    {
        var public  = (privacy == 0) ? 0 : 1;
        var private = (privacy == 0) ? 1 : 0;
    }

    if(listName==preValue){ $('#edit-list-'+atob(listId)).hide(); $('#name-'+atob(listId)).fadeIn(500);  $("#loader").hide();$('#list-control-'+atob(listId)).fadeIn(500);return false;}
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?111',
        data: en.code({'mamth':'M111','list-id':listId,'list-name':listName,'public':public,'private':private}),
        timeout: 15000,
        success:function (data) 
        {  
            var decode = JSON.parse(data);
            if(decode.response.statusCode == '201' || decode.response.statusCode == '200')
            {
                var message = ''; 
                var msgType = 'green_bg';
                if(statusType == 'status')
                {
                    if(public == 1)
                    {
                        $('#privacy-'+atob(listId)).html('<i class="fa fa-unlock" aria-hidden="true"></i>');
                        $('#eye-'+atob(listId)).html('<i class="ti-eye"></i> Public');
                        var heading = 'You just made this list public';
                    }
                    else
                    {
                        $('#privacy-'+atob(listId)).html('<i class="fa fa-lock" aria-hidden="true"></i>');
                        $('#eye-'+atob(listId)).html('<i class="ti-eye"></i> Private');
                        var heading = 'You just made this list private';
                    }
                    viewMyPlace(uname);
                }
                else
                {
                    $('.list-name-'+atob(listId)).removeAttr("style");
                    $('#edit-list-'+atob(listId)).hide();
                    $('#name-'+atob(listId)).text(listName);
                    $('#name-'+atob(listId)).fadeIn(500);
                    $('#list-control-'+atob(listId)).fadeIn(500);
                    viewMyPlace(uname);
                    var heading = 'List name successfully updated';
                }
                notify(heading);
            }
            else if(decode.response.statusCode == '101' && decode.response.data[0]['error']){show_error(decode.response.data[0]['error'][0]);}
            else if(decode.response.statusCode == '406'){show_error('List name alreay exist');}
            else if(decode.response == false)
            {
                if(decode.errors)
                {
                    show_error(decode.errors);
                }
            }
            else
            {
                show_error(1);
            }
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
}

function deleteList(listId)
{    
    $("#loader").show();
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?133',
        data: en.code({'mamth':'M133','list-id':listId}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response.statusCode == '201' || decode.response.statusCode == '200')
            {
                notify("Successfully deleted");
                viewMyPlace(uname);

            }
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
}

var listContentId = '';
function getListContent(userName,id,drag,listName,userId,sideClick)
{    
    if(glb_dc==1) sideClick=1;
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var data = $("#list-content-scroll-bar").attr("data-user");
    if(typeof(data) != 'undefined' && id!=="ZGV2aWNlcw==")
    {
        try{data =  atob(data).split("-");
        if(data!="") var page = data[0];
        else var page = 1;
        }catch(e){var page = 1;}
    }
    else
    {
        var page = 1;
    }
    if(id != listContentId)
    {
        list_content_marker=[];
    }
    listContentId = id;
    if(id=="d29ybGQ=") page=1;
    if(!userName)
    {
        /*var url = window.location.toString().split('/');var curUrl = url.slice(-1)[0];
        var userName = curUrl.split('?');
    var userName = userName[0];*/
        userName=(uname?uname:'my');
    }
      

    (page == 1) ? $("#loader").show() : $("#review-loader").show();
    if(mobilecheck()) map.setActiveArea('viewport_all'); else if(map) map.setActiveArea('viewport');
    var center=[],bounds={};
    var center = map.getCenter();
    var bounds = {east:map.getBounds().getEast(),west: map.getBounds().getWest(),north:map.getBounds().getNorth(),south:map.getBounds().getSouth(),centerLat:center.lat,centerLng:center.lng};
 
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?113',
        data: en.code({'mamth':'M113','page':page,'pop':pop_state,'userId':userId,'userName':userName,'list-id':id,'drag':drag,'bounds':btoa(JSON.stringify(bounds)).replace('=',''),'y':maps.ly,'x':maps.lx,'listName':listName,'pop':pop_state}),
        timeout: 15000,
        success:function (data) 
        { 
           var decode = "";try{ decode = JSON.parse(data);}catch(e){}
            var html = decode.response;var tcount = decode.count;
            if(html)
            {
                var newPage = parseInt(page)+1;
                if(page==1)
                {
                    $("#res_info").html(html).show(); 
                    if(!curl) {var url = window.location.toString().split('/');var curl = url.slice(-1)[0];}
                    var name = $('.act-vis').attr('data-name');if(!name) name=listName;
                    if(mobilecheck()){$('.with-nav-tabs').hide();}
                    if(curl.indexOf('my-devices-data')!=-1 && listName)
                    {
                        $("#loader").show();
                        $("#"+listName).click();
                        if(userName && name){ call_url(userName+' '+name,userName+'?'+name.trim().toLowerCase().replace(/[\. ,:-]+/g, '-').replace(/[\"']+/g, '~')+'-data='+listName);}
                        if(!sideClick) $("#res_info").show();
                        return false;
                    }
                    if(userName && name){ call_url(userName+' '+name,userName+'?'+name.trim().toLowerCase().replace(/[\. ,:-]+/g, '-').replace(/[\"']+/g, '~')+'-data='+id+'ed');}
                    else if(!userName && id=='d29ybGQ='){call_url(userName+' '+name,'my?'+name.trim().toLowerCase().replace(/[\. ,:-]+/g, '-').replace(/[\"']+/g, '~')+'-data='+id+'ed');}
                    if(!sideClick) $("#res_info").show();
                    $("#loader").hide();
                    $('#report-loader').hide();
                }
                else
                {
                    window.setTimeout(function () 
                    {
                        $(html).appendTo('#sortable');
                        $("#list-content-scroll-bar").mCustomScrollbar("update");
                        $("#list-content-scroll-bar").mCustomScrollbar("scrollTo","#to-scroll",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                        $("#review-loader").hide();
                        $('#report-loader').hide();
                    }, 200);
                }

                /*var count=$('.new-r-head').last().attr('id');console.log(count);*/
                var count = decode.count;
                $("#list-content-scroll-bar").attr("data-user",btoa(newPage+'-'+count).replace(/=/g,''));
                if(!mobilecheck()) $("#list-content-scroll-bar").css("overflow-y","auto");
                $("#list-content-scroll-bar").scroll(function() { 
                    var h = $(this).height();var scroll = $(this).scrollTop();var Height = $(this)[0].scrollHeight-h;
                    var per=scroll*100/Height;
                    if(per>=60)
                    {
                        if(last_pg==pg_contri) return false;
                        last_pg=pg_contri;
                        var newData = $("#list-content-scroll-bar").attr("data-user");
                        newData = atob(newData).split('-');
                        if(newData[1]>= 10)
                        {
                            /*$('#review-loader').show();*/
                            $('#report-loader').show();
                            $('#to-scroll').removeAttr('id');
                            getListContent(userName,id,drag,listName,userId);
                        }
                    }
                });

            }
            else
            {
                (page == 1) ? $("#loader").hide() : $("#review-loader,#report-loader").hide();
                /*if(html==null && tcount==null) viewMyPlace(userName,userId);
                if(html==null && tcount==0) return false;*/
            }
            $('#report-loader').hide();
            xhr = null;
            pg_contri++;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader,#report-loader").hide();
            if(textStatus!='abort') show_error(1);
        }
    });
}

function deleteListContent(id, userID, event)
{
    $("#loader").show();
    var split = atob(id).split('-');//console.log(split);
    if(event=='listContentRoute') event='route'
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?134',
        data: en.code({'mamth':'M134','data-id':split[0], 'list-id':split[1], 'event':event}),
        timeout: 15000,
        success:function (data) 
        {
            var decode ="";
            $("#loader").hide();
            try{decode =JSON.parse(data);}catch(e){show_error(1);return false;}
            if(decode.response.statusCode == '201' || decode.response.statusCode == '200')
            {
               notify("Successfully deleted");
               if(maps.uri().search('data=')!=-1)
               {
                    var listDetail = maps.uri().split('-data=');
                    $("#res_info").html('');remove_layers();
                    getListContent('',listDetail[1].replace('ed',''),'',split[2],userID);
                    $("#loader").hide();
                    return false;
               }
                if(decode.count == 0)
                {
                    $("#popup_user_list_show").trigger("click");
                }
                var place = decode.count == 0 ? decode.count+' Place' : decode.count+' Places';
                $('.data-'+split[0]).hide(500, function(){ $('.data-'+split[0]).remove(); });
                $(".list-count").text(place+' found');

                if(split[1] == 2){$("#add-save").text((decode.count == 0) ? 'Add' : decode.count);}
                if(split[1] == 3){$("#add-route").text((decode.count == 0) ? 'Add' : decode.count);}
            }
            else
            {
                show_error(1);
            }
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
}
/*--------------------------------------------------List Action Ends------------------------------------------------*/

/*--------------------------------------------------Profile Action starts------------------------------------------------*/

$(document).on("click", "#popup_user_followers_show", function(event)
{    
    var name = atob($(this).attr("name"));
    var id = atob($(this).attr("data-id"));
    readFollower(name, id);
    event.preventDefault();
});

$(document).on("click", "#popup_user_following_show", function(event)
{
    var name = atob($(this).attr("name"));
    var id = atob($(this).attr("data-id"));
    readFollowing(name, id);
    event.preventDefault();
});

$(document).on("click", "#popup_user_list_show", function(event)
{
    var name = atob($(this).attr("name"));
    readList(name);
    event.preventDefault();
});
$(document).bind("keydown", function (e) { if (e.ctrlKey && e.keyCode === 80) { load_module('print');return false;} return true; });
function load_module(name){if(name) $("#error_modal").load(name);}
function view_profile(userName, userId)
{
    home(0);
    pushy('hide');
    if(!pop_state) $("#loader").show();
    var type = null;
    if(userName.indexOf('?')!=-1) 
    {
        var userData = userName.split('?');
        userName = userData[0];
        type = userData[1];
    }
    
    var urname=userName;
    if(userName.indexOf('!R')>1)
    {
        var arr_u=userName.split('!R');
        var urname=arr_u[0]+"@"+arr_u[1].split('').reverse().join('');
    }
    
    var center = map.getCenter();
    var bounds = {east:map.getBounds().getEast(),west: map.getBounds().getWest(),north:map.getBounds().getNorth(),south:map.getBounds().getSouth(),centerLat:center.lat,centerLng:center.lng};
    if(type)
    {
        if(type=='follower'){ readFollower(urname);return false;}
        if(type=='following'){ readFollowing(urname);return false;}
        if(type=='my-place'){viewMyPlace(urname);return false;}
        if(type=='my-place'){viewMyPlace(urname);return false;}
        if(type.indexOf('my-share-data=')!=-1){
            var splitType = type.split('=');
            if(splitType[1])
            {
                shareLocation(urname,splitType[1]);return false;
                /*intouchMaps.get_share(splitType[1],'');*/
            }else{
                shareLocation(urname);return false;
            }
        }
        
        if(type.search('route-data=')!=-1){getListContent(urname,'SU4oMyk=','','');return false;}
        if(type.search('my-devices-data=')!=-1){var id='';if(type.search('ZGV2aWNlcw')==-1){var ids=type.split('=');var id=ids[1];}$("#res_info").hide();getListContent(urname,'ZGV2aWNlcw==','',id,1);return false;}
        if(type.search('my-saved-eloc')!=-1){viewMyEloc(urname);return false;}
        if(type.search('contributions')!=-1){viewMyEloc(urname,'contributions');return false;}
        if(type.search('journey=')!=-1){var jr_splt=type.replace('journey=','').split('@');singleReview(jr_splt[0],jr_splt[1]);return false;}
        if(type.search('point')!=-1 && type.search('point-on-map-data')==-1){viewMyEloc(urname,'point');return false;}
        if(type.search('favourites-data')!=-1) {var listDetail = type.split('-data=');getListContent(urname,listDetail[1].replace('ed',''),'',listDetail[0],'');return false;}
        if(type.search('my-claim-data')!=-1) {var listDetail = type.split('-data=');getListContent(urname,listDetail[1].replace('ed',''),'',listDetail[0],'');return false;}
        if(type.search('my-world-data=')!=-1){
            if(type.indexOf('d29ybGQ=')==-1)
            {
                var splitCurl=type.split('=');
                var splitUrl = splitCurl[1].split('-');
                singleReview(splitUrl[0],splitUrl[1]);
                close_cat();
                return false;
            }else{
                getListContent(urname,'d29ybGQ=');return false;
            }
        }
        if(type.search('timeline')!=-1){timeline();return false;}
        if(type=='list'){readList(urname);return false;}
        
    }
    else if(profile_dt[0]==urname && pop_state)
    {
        if(profile_dt[1])
        {
            $("#res_info").html(profile_dt[1]).show();$(".scrolling-cont").scrollTop(profile_dt[2]);call_url(urname,urname);if(mobilecheck()) $('.panel-primary').hide();return false;
        }
    }
    if(!pop_state) pg_journey=1; 
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?130',
        data: en.code({'mamth':'M130','userName':urname,'userId': userId,'pop':pop_state,'type':type,'bounds':btoa(JSON.stringify(bounds)).replace('=','')}),
        timeout: 15000,
        success:function (data) 
        {
            var decode ="";
            try{decode =JSON.parse(data);}catch(e){$('#loader').hide();show_error(1);return false;}
            if(!decode.valid) { notfound();$('#loader').hide();return false;}
            if(decode.valid.response == 201 || decode.valid.statusCode == 200)
            { 
                var usrId = decode.valid.data_response.userId;
                var text = decode.response;
                $("#res_info").html(text);
                switch(type) 
                {
                    case 'list':
                        readList(userId);
                        break;
                    case 'follower':
                        readFollower(urname);
                        break;
                    case 'following':
                        readFollowing(urname);
                        break;
                    case 'activity':
                    case 'journey':
                    intouchMaps.init(map,{token:decode.token,randerFlag:false});
                        $('.active-activity').addClass('active');
                        $('.active-report').removeClass('active');
                        $('.active-review').removeClass('active');
                        $('#res_info').show();
                        break;
                    case 'reported-event':
                        $('.active-report').addClass('active');
                        $('.active-activity').removeClass('active');
                        $('.active-review').removeClass('active');
                        $('#res_info').show();
                        break;
                    case 'review':
                    case 'world':
                    intouchMaps.init(map,{token:decode.token,randerFlag:false});
                        $('.active-review').addClass('active');
                        $('.active-activity').removeClass('active');
                        $('.active-report').removeClass('active');
                        $('#res_info').show();
                        break;  
                    case 'people':
                    case 'device':
                        intouchMaps.init(map,{token:decode.token,randerFlag:false});
                        (type == 'people') ? intouchMaps.setDeviceType(2) : intouchMaps.setDeviceType(1);
                        intouchMaps.setUserName(urname);
                        intouchMaps.getDevices();
                        intouchMaps.getDevicePeopleDetail();
                        break;                                                                    
                    default:

                        if(type !=null)
                        {
                            if(type.indexOf("data=") !== -1)
                            {
                                var listDetail = type.split('-data=');
                                getListContent(urname,listDetail[1].replace('ed',''),'',listDetail[0],usrId);
                /*if(type.indexOf('favourites-')==-1) call_url(decode.userName,userName);*/
                            }
                            else if(type.indexOf("people=") !== -1 || type.indexOf("device=") !== -1)
                            {
                                var entityId = type.split('=');
                                intouchMaps.init(map,{token:decode.token,randerFlag:false});
                                intouchMaps.setUserName(urname);
                                intouchMaps.getDevicePeopleDetail(entityId[1]);
                            }
                            else
                            {
                                call_url(decode.userName,userName);
                                $('#res_info').show();
                            }
                        }
                        else
                        {
                            if(typeof intouchMaps!=='undefined')  intouchMaps.init(map,{token:decode.token,randerFlag:false});
                            call_url(document.title,decode.valid.data_response.username);
                            $('#res_info').show();
                        }
                }
                if(typeof intouchMaps!=='undefined')  intouchMaps.removeDevices();
                if(mobilecheck()){$('.with-nav-tabs').hide();}
            }
            else if(decode.valid.response == 101  || decode.valid.statusCode == 204)
            {
                notfound();
            }
            else
            {
               show_error(1);
            }
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
           show_error(1);
        }
    });
    return false
}
function profile_dtt(usr)
{
    if(usr) profile_dt[0]=usr;profile_dt[1]=$("#res_info").html(),profile_dt[2]=$(".scrolling-cont").scrollTop();
} 
function edit_profile(userName)
{
    $("#loader").show();
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?135',
        data: en.code({'mamth':'M135','userName':userName}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var text = decode.response;
            $("#error_modal").html(text).show();
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
    return false;
}

function change_password()
{
    $("#loader").show();
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?109',
        data: en.code({'mamth':'M109','type':'change'}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var text = decode.response;
            $("#error_modal").html(text).show().delay(4500);
            call_url('Change Password | MapmyIndia','change-password');
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
    return false;
}

function forgot_password()
{
    $("#loader").show();
    $.ajax(
    {
        type: 'POST',
        url: 'userAuth?109',
        data: en.code({'mamth':'M109','type':'forgot'}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var text = decode.response;
            $("#error_modal").html(text).show().delay(4500);
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
    return false;
}

function verify_user(curl)
{
    $("#loader").show();
    var split = curl.replace(/ed/g, '').split('-'); 
    var decode = atob(atob(split[1]));
    if(decode == 201)
    {
        var heading = 'Congratulations! Your account has been successfully activated';
        /*var message = ''; 
        var type = 'green_bg';*/
        notify(heading);
        call_url('','.');
    }
    else if(decode == 412)
    {
        var heading = 'Your account is already active';
        var message = ''; 
        var type = 'note_bg';
        show_error(message,heading,type);
        call_url('','.');
    }
    else
    {
        var heading = 'Your activation key is incorrect';
        var message = 'Please verify your account in order to publish reviews, ratings & reports. <a class="red_color resend">Click here</a> to resend verification email'; 
        var type = 'note_bg';
        show_error(message,heading,type);
    }
    $("#loader").hide();
}

/*--------------------------------------------------Profile Action Ends------------------------------------------------*/

/*--------------------------------------------------Follow/Unfollow section Starts------------------------------------------------*/

function follow(value)
{
    $("#loader").show();
    var detail = atob(atob(value)).split('-');
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?145',
        data: en.code({'mamth':'M145','toFollowUserName':detail[0], 'toFollowId': detail[1],'toFollowName':detail[2],'type':detail[3],'flag':detail[4]}),
        timeout: 15000,
        success:function (data) 
        {         
            var decode = JSON.parse(data);
            
            if(decode.response.statusCode == 201 || decode.response.statusCode == 200)
            {
                var html=$('#'+btoa(detail[0]).replace(/=/g,'')+'').html();profile_dt=[];
                var txt="<img src='images/pro/ic_profile_unfollow.png' alt='unfollow'>";if(html=='follow') txt="unfollow";
                $('#'+btoa(detail[0]).replace(/=/g,'')+'').html(txt).attr('onclick',"unfollow('"+btoa(btoa(detail[0]+'-'+detail[1]))+"')");

                if($("#popup_user_followers_show").length) 
                {
                  $('#popup_user_followers_show a h4').text(parseInt($($('#popup_user_followers_show').children().children()[0]).text())+1);
                }
            }
            else if(decode.response.statusCode == 304)
            {
                var html=$('#'+btoa(detail[0]).replace(/=/g,'')+'').html();profile_dt=[];
                var txt="<img src='images/pro/ic_profile_unfollow.png' alt='unfollow'>";if(html=='follow') txt="unfollow";
                $('#'+btoa(detail[0]).replace(/=/g,'')+'').html(txt).attr('onclick',"unfollow('"+btoa(btoa(detail[0]+'-'+detail[1]))+"')");
                show_error('Already done');
            }
            else if(decode.response.statusCode == "400") {
                if(decode.response.data) show_error(decode.response.data.errors[0].displayMessage);
                else show_error(1);
                $("#loader").hide();
                return true;
            }
            else if(decode.response.response == 101)show_error(1);
            else if(!decode.loggedIn)
            {
                $('#error_modal').html(decode.response).show();
            }
            else
            {
                show_error(1);
            }
            xhr = null;
            $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });
}

function unfollow(value)
{
    $("#loader").show();
    var detail = atob(atob(value)).split('-');
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?146',
        data: en.code({'mamth':'M146','toUnFollowUserName':detail[0], 'toUnfollowId': detail[1]}),
        timeout: 15000,
        success:function (data) 
        { 
            var decode = JSON.parse(data);  
            if(decode.response.statusCode == 201 || decode.response.statusCode == 200)
            {
                var html=$('#'+btoa(detail[0]).replace(/=/g,'')+'').html();profile_dt=[];
                var txt="<img src='images/pro/ic_profile_follow.png' alt='unfollow'>";if(html=='unfollow') txt="follow";
                $('#'+btoa(detail[0]).replace(/=/g,'')+'').html(txt).attr('onclick',"follow('"+btoa(btoa(detail[0]+'-'+detail[1]+'-person-2'))+"')");
                if($("#popup_user_followers_show").length) 
                {
                    $('#popup_user_followers_show a h4').text(parseInt($($('#popup_user_followers_show').children().children()[0]).text())-1);
                }
            }
            else if(decode.response.statusCode == 304)
            {
                var html=$('#'+btoa(detail[0]).replace(/=/g,'')+'').html();
                var txt="<img src='images/pro/ic_profile_follow.png' alt='unfollow'>";if(html=='unfollow') txt="follow";
                $('#'+btoa(detail[0]).replace(/=/g,'')+'').html(txt).attr('onclick',"follow('"+btoa(btoa(detail[0]+'-'+detail[1]+'-person-2'))+"')");
                show_error('Already done');
            }
            else if(decode.response.statusCode == "400") {
                if(decode.response.data) show_error(decode.response.data.errors[0].displayMessage);
                else show_error(1);
                $("#loader").hide();
                return true;
            }
            else if(!decode.loggedIn)
            {
                $("#signin").trigger("click");
                var string = [];
                string.push({event:"following",value:detail[0]});
                localStorage.setItem("event", JSON.stringify(string));
            }
            else
            {
                show_error(1);
            }
            xhr = null;
           $("#loader").hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });
}

function readFollower(userName, userId)
{
    setTimeout(function()
    {
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        var data = $("#follower-scroll-bar").attr("data-user");
        if(typeof(data) != "undefined")
        {
            data =  atob(data).split("-");
            var page = data[0];
        }
        else
        {
            var page = 1;
        }
        (page == 1) ? $("#loader").show() : $(".small-loader").show();
        xhr = $.ajax(
        {
            type: 'POST',
            url: 'userAuth?143',
            data: en.code({'mamth':'M143','page':page,'userId':userId, 'userName': userName}),
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                var html = decode.response;
                
                if(html)
                {
                    var newPage = parseInt(page)+1;
                    if(page == 1)
                    {
                        $("#res_info").html(html).show();
                        if(group_stars){map.removeLayer(group_stars);}
                        call_url(userName+' Follower',userName+'?follower');
                        if(mobilecheck()){$(".with-nav-tabs").hide();}
                        $("#loader").hide();$("#follower-scroll-bar").mCustomScrollbar({theme:"dark",scrollInertia:100});
                    }
                    else
                    {
                        $(html).appendTo("#user-follower");
                        $("#follower-scroll-bar").mCustomScrollbar("update");
                        $("#follower-scroll-bar").mCustomScrollbar("scrollTo","#to-scroll",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                        $("#review-loader").hide();
                    }
                    $("#follower-scroll-bar").attr("data-user",btoa(newPage+"-"+decode.count).replace(/=/g,""));
                    
                }
                else if(!decode.loggedIn)
                {
                    $("#signin").trigger("click");
                    var string = [];$("#loader").hide();
                    string.push({event:"follower",value:userName});
                    localStorage.setItem("event", JSON.stringify(string));
                }
                
                else
                {
                    (page == 1) ? $("#loader").hide() : $("#review-loader").hide();
                }
                xhr = null;
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#list-loader").hide();
                show_error(1);
            }
        });
        return false;
    }, 30);
}
function readFollowing(userName, userId)
{
    setTimeout(function()
    {
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        var data = $("#following-scroll-bar").attr("data-user");
        if(typeof(data) != "undefined")
        {
            data =  atob(data).split("-");
            var page = data[0];
        }
        else
        {
            var page = 1;
        }
        (page == 1) ? $("#loader").show() : $("#review-loader").show();
        xhr = $.ajax(
        {
            type: 'POST',
            url: 'userAuth?144',
            data: en.code({'mamth':'M144','page':page,'userName':userName, 'userId': userId,'pop':pop_state}),
            timeout: 150000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                var html = decode.response;
                
                if(html)
                {
                    var newPage = parseInt(page)+1;
                    if(page == 1)
                    {
                        $("#res_info").html(html).show();
                        if(group_stars){map.removeLayer(group_stars);}
                        call_url(userName+' Following',userName+'?following');
                        if(mobilecheck()){$(".with-nav-tabs").hide();}
                        $("#following-scroll-bar").mCustomScrollbar({theme:"dark",scrollInertia:100});
                        $("#loader").hide();
                    }
                    else
                    {
                        $(html).appendTo("#user-following");
                        $("#review-loader").hide();
                    }
                }
                else if(!decode.loggedIn)
                {
                    $("#signin").trigger("click");
                    var string = []; $("#loader").hide();
                    string.push({event:"following",value:userName});
                    localStorage.setItem("event", JSON.stringify(string));
                }
                else
                {
                    (page == 1) ? $("#loader").hide() : $("#review-loader").hide();
                }
                xhr = null;
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#list-loader").hide();
                show_error(1);
            }
        });
        return false;
    }, 30);
}
/*--------------------------------------------------Follow/Unfollow section Ends------------------------------------------------*/

function getActivity(userName)
{
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var data = atob($("#activity").attr("data-user")).split('-');
    var page = data[0];
    $(".small-loader").show();
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?136',
        data: en.code({'mamth':'M136','page':page,'userName':userName}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                var newPage = parseInt(page)+1;
                $(html).appendTo("#activity-list");
                $("#activity").mCustomScrollbar("update");
                $("#activity").mCustomScrollbar("scrollTo","#to-scroll-activity",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                $("#activity").attr("data-user",btoa(newPage+"-"+decode.count).replace(/=/g,""));
            }
            window.setTimeout(function () { $(".small-loader").hide(); }, 500);
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $(".small-loader").hide();
            show_error(1);
        }
    });
}

$(document).on("submit", "#been-form", function(event)
{
    var error = false;
    var totalFileSize = 0;
    var form = $('#been-form')[0];
    if(!window.File && window.FileReader && window.FileList && window.Blob)
    { 
        show_error("Your browser does not support new File API! Please upgrade.");
        error = true;
    }
    else
    {
        var totalSelectedFiles = form.elements['pinfile[]'].files.length;
    }
    if(totalSelectedFiles > totalFilesAllowed)
    {
        show_error( "You have selected "+totalSelectedFiles+" file(s), " + totalFilesAllowed +" is maximum!");
        error = true;
    }

    $(form.elements['pinfile[]'].files).each(function(i, ifile)
    {
        if(ifile.value !== "")
        {
            if(allowedFileTypes.indexOf(ifile.type) === -1)
            { 
                show_error( "<b>"+ ifile.name + "</b> is unsupported file type!");
                error = true;
            }
            totalFileSize = totalFileSize + ifile.size;
        }
    });

    if(totalFileSize > maxSize)
    { 
        show_error( "You have "+totalSelectedFiles+" file(s) with total size "+bytes_to_size(totalFileSize)+", Allowed size is " + bytes_to_size(maxSize) +", Try smaller file!");
        error = true;
    }

    var separators  = ['-', '@', 'zdata='];
    var currentURL  = document.URL.split(new RegExp(separators.join('|'), 'g'));
    var decodeString = atob(currentURL[(currentURL.length)-1].replace('ed','')).split('+');
    var formData = new FormData(form);
    var fileData = $('input[type="file"]')[0].files;
    for(var i = 0;i<fileData.length;i++)
    {
        formData.append("file_"+i, fileData[i]);
    }

    var otherData = $(this).serializeArray();
    if((otherData[0].value) == '' || (otherData[0].value).length < 20 )
    {
        show_error('Story should be atleast 20 characters.');
        error = true;
    }
    
    if(!error)
    {
        $.each(otherData,function(key,input)
        {
            formData.append(input.name,input.value);
        });
        formData.append('place-id',decodeString[3].replace('ID',''));
        formData.append('place-name', $('.poi-title').html());
        formData.append('place-adrs', ($('#full-adr').html()) ? $('#full-adr').html() : $('.poi-title').html());
        formData.append('lat', decodeString[0]);
        formData.append('lng', decodeString[1]);
        formData.append('mamth','M128');
        
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        
        $('#loader').show();
        xhr = $.ajax(
        {
            url : 'userAuth',
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            cache: false,
            mimeType:"multipart/form-data",
            success: function(data)
            {
                var decode = JSON.parse(data);
                if(decode.response == '201')
                {
                    $('#been-status').html('<i class="fa fa-check" aria-hidden="true"></i>');
                    $($('#been-status').parent()[0]).removeAttr('onclick');
                    var heading = 'Good to see you here';
                    var message = 'Have a great day ahead'; 
                    var type = 'green_bg';
                    show_error(message,heading,type);
                }
                else if(decode.response == false)
                {
                    if(decode.errors)
                    {
                        show_error(decode.errors[0]);
                    }
                }
                else
                {
                    show_error(1);
                }
                $("#loader").hide();
                xhr = null;
            },
        });
    }
    event.preventDefault();
});

/*--------------------------------------------------Been Here section Ends------------------------------------------------*/

/*--------------------------------------------------Report section Starts------------------------------------------------*/

function writeReport(place,show,userToken,source)
{ 
    $("#z-popup").hide();
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var eloc='',place_name='',success_callback="report_callback",close_btn="back";
    if(source=='corona'){success_callback="";close_btn="";}
    if(place)
    {
        var urlen=place.split('zdata=');
        if(urlen[1]) 
        {
            var encd=atob(urlen[1].replace('ed','')).split('+');
            if(encd[3]) 
            {eloc=encd[3];
            place_name=urlen[0].replace("-"+eloc,"");
            }
        }
    }
    $("#res_info").hide();
   
   var center = map.getCenter(); var zm = map.getZoom();
   if((!show || pop_state==0) && source!='corona')
   {
       call_url('',"report@"+btoa(""+center.lat+"")+","+btoa(""+center.lng+"")+","+btoa(""+zm+"").replace('=',''));
   }
   if($("#modal_new").html()!=undefined)
   {
    $('#loader').show();
    $("#modal_new").html('').load("mmi-report?source=moveweb&first=corona1&lat="+center.lat+"&lng="+center.lng+"&zoom="+zm+"&eloc="+eloc+"&place_name="+place_name+"&user_token="+userToken+"&success_callback="+success_callback+"&closebuttonurl="+close_btn+"&"+cachdt).show();
   }
   /* xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?118',
        data: en.code({'mamth':'M118','place':place,'urlContent':JSON.stringify(breakUrl(place)),'show':show}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var html = decode.response;
        if(!show){home(0);}
            $('#error_modal').html(html).show().delay(4500);
          
            var center = map.getCenter();
            var zm = map.getZoom();
        if(!show || pop_state==0){call_url('',"report@"+btoa(""+center.lat+"")+","+btoa(""+center.lng+"")+","+btoa(""+zm+"").replace('=',''));}
            $('#loader').hide();
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });*/
}
function report_callback(pin)
{ 
    if(pin) readReport('','report@@@'+pin,1);
    $("#modal_new").html('').hide();
    notify("Your report has been submitted");
}

function timeline(date) /*place report*/
{ 
   if( xhr != null) 
    {
        xhr.abort();
        xhr = null;
    }
    
    $("#loader").show(); 
    call_url("My Timeline",uname+"?timeline");
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?timeline',
        data: en.code({'mamth':'timeline','date':date}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response)
            {  var html = decode.html;
                 
                    $('#res_info').html(html).show().delay(3500);
            }
            else
            {
                show_error("You don't have permission to access this url.");
            }
            (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
            $("#loader").hide();
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $('.with-nav-tabs').show();
            $("#loader").hide();
           
        } 
    });
};
function listReport(placeId) /*place report*/
{ 
    var plcDetail = atob(atob(placeId)).split('-');
    var count = 0;
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    
    if(plcDetail[1] == 1) { $("#loader").show();}
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?113',
        data: en.code({'mamth':'M113','page':plcDetail[1],'place-id':plcDetail[0].replace('ID','')}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                if(plcDetail[1] == 1)
                {
                    var urlContent = breakUrl();
                    $('#poi_other').html(html).show().delay(4500);
                    $('#poi_info').hide();
                    $('.action-bar').removeClass('visible-xs visible-sm').removeAttr('style');
                    if(urlContent[1].indexOf("LRz") === -1)
                    {
                        var secondPart = urlContent[1].replace(/WRzdata|wrzdata|zdata/g,'LRzdata');
                        call_url('', urlContent[0]+'@'+secondPart);
                        $('#report-loader').hide();
                    }
                }
                else
                {
                    $(html).appendTo('#place-report');
                    $('#report-loader').show();
                }
                  var count=$('.new-r-head:last').attr('id');
                  $('#place-report').attr('data-user',btoa(btoa(plcDetail[0]+'-'+(parseInt(plcDetail[1])+1)+'-'+count)));
                  if(!mobilecheck()) $("#rp_scrl").css("overflow-y","auto");
                  $("#rp_scrl,#poi_other").scroll(function() { 
                        var h = $(this).height();var scroll = $(this).scrollTop();var Height = $(this)[0].scrollHeight-h;
                        var per=scroll*100/Height; 
                        if(per>=80)
                        {
                            if(last_pg==pg_report) return false;
                            last_pg=pg_report;
                            var data = atob(atob($("#place-report").attr("data-user"))).split('-');
                                
                            if(data[2]>= 10)
                            {
                                $('#report-loader').show();
                                $('#to-scroll').removeAttr('id');
                                listReport($("#place-report").attr("data-user"));
                            }
                        }
                   });
            }
            (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
            $('#report-loader').hide();
            $("#loader").hide();
            pg_report++;
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $('.with-nav-tabs').show();
            $("#loader").hide();
        } 
    });
};
function send_to_phone(curl,sharetype)
{
     var clicks = 'to-phone';
     if(!curl) {var url = window.location.toString().split('/');var curl = url.slice(-1)[0]}
     if(curl.indexOf("my-share-data") !== -1) var clicks = 'tshare';
     comman(clicks,'COMMON',{"evt":"send-to","signin":1,"url":curl,"sharetype":sharetype});
}
var cmn=0,close_getelc=0;
function comman(click_id,mamth,rq_data,loader,callback)
{
    if(cmn) cmn.abort();
    var s_id='loader';if(click_id=='journey') s_id='jrn-ldr';
    if(loader!==0) $("#"+s_id).show();
    rq_data["mamth"]=mamth;rq_data['click_id']=click_id;
    
    var pload = en.code(rq_data);
    cmn = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?'+mamth,
        data:pload,
        timeout: 15000,
        success:function (data) 
        {
        var decode ="";try{ decode = JSON.parse(data);}catch(e){if(mamth=='menu') $("#side-menu").hide();}
            $("#"+s_id).hide();
            
            if(decode.response)
            { 
                if(callback){callback(decode.response);}
                if(click_id=='to-phone' || click_id=='tshare')
                {
                    if(decode.login) 
                    {
                        $("#error_modal").html(decode.response).show();
                        $('.send-to-phone-sec').hide();
                    }
                    else
                    {
                        if(rq_data["url"].indexOf("my-share-data") === -1)
                        {
                            $("#error_modal").html(decode.response).hide();
                            $('.send-to-phone-sec').show();
                        }else{
                            $("#error_modal").html(decode.response).show();
                            $('.send-to-phone-sec').hide();
                        }
                    }
                }
                else if(mamth=='save_route')
                { 
                    if(decode.html=="201" || decode.html=="200")
                    { 
                        $(".pull-right #my-fav-route").html('<i class="material-icons">playlist_add_check</i> <span>Saved</span>').attr("onClick", "save_route('','"+$('#route_n').val()+"');");
                        $("#error_modal").html('').hide(); 
                       notify("Route successfully saved");
                    }
                    else if(decode.html=="400" || decode.error) {if(decode.error) show_error(decode.error);else show_error(1);}
                    else if(decode.html=="login") { $("#error_modal").html(decode.response).show(); }
                    else show_error(1);
                }
                else if(mamth=='menu')
                {
                    mmi();
                    if(decode.response[1])
                    {
                        $("#login_dv_menu").html(decode.response[1]);$("#side-menu").show();if(!mobilecheck()) $('.side-bar-scroll').mCustomScrollbar({theme:'dark',scrollInertia:50});  
                        if(decode.response[0]) $("#login_dv").html(decode.response[0]);
                    }
                    if(decode.getEloc)
                    {
                        $("#get_eloc_dv").html(decode.getEloc[1]);/*div*/
                        if(maps.uri() && maps.uri().indexOf('@')!==0) $("#get-eloc-sec").hide();
                        if(decode.getEloc[0]) $("#eloc_tap").html(decode.getEloc[0]);/*marker*/
                        if(click_id=='getEloc') addGetEloc();
                    }
                   else window.setTimeout(function () { $("#review-loader").hide(); }, 4000);
                   if(decode.login) $("#signin,#error_modal").hide(); 
                    deviceType=decode.mobile;
                }
                else if(mamth=='journey')
                {
                    if(decode.html)
                    {
                        $(decode.html).appendTo("#journey_ul");pg_journey++;filter_journey('');
                        profile_dtt(rq_data["user_name"]);                                                
                    }
                    else
                    {
                        
                        if(pg_journey == 1) 
                        {
                            $(".blank_state_jrn").show();
                            $(".filter-body-content").css("background-color","transparent");
                            $('.filter-sec').hide();
                            $(".place-review-sec").hide();   
                        }
                        else pg_journey=0;
                    }
                }
            }
        if(mamth=='weather-inventory')
            {
               if(!decode) decode=1;
                maps.weather(rq_data.type,rq_data.time,decode);
            }
            $("#"+s_id).hide();
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            if(textStatus!='abort') show_error(1);
            $("#"+s_id).hide(); if(mamth=='journey') pg_journey--;
        }
    });
}
function readReport(user,location, visibility,bnd,back) /*place report*/
{ 
    $("#read_review_close").trigger("click");
    var loc = location.split('@');
    /*var category = loc[1].split('@');*/
    var type = (loc[1]) ? loc[1].replace(/[_]/g,' ')+'('+loc[2].replace(/[+]/g,' ')+')':loc[1].replace('_',' ');
    var title = 'Reported Events '+type.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});

    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    
    $("#loader").show(); 
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?113',
        data: en.code({'userName':user,'mamth':'M113','data-id':loc[3],'bound':bnd,'url':maps.uri()}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.statusCode == 204) {
                $("#loader").hide();
                show_error("The issue you are looking is no longer available !");
                return false;
            }
            if(decode.response)
            {
                $("#res_info").html(decode.response).show();
                if(loc[4]=="cmtopnnew") $("#respond_comment_"+loc[3]).trigger("click");
                if(location.indexOf('corona')!==-1) $("#infoTextCom").show();
                if(back) {
                    $('.bckCorona').removeAttr('onclick');
                    $('.bckCorona').attr('href','corona');
                }
                call_url(title,location);
            }
            else
            {
                show_error('','Report Expired<br><h6 style="font-weight: 500;">Sorry, The report link you followed has expired and is not valid anymore. <a href="javascript:void(0)" style="color: #3A78E7;text-decoration:underline;" onclick="writeReport();">Click here</a> to file a new report.</h6>','red_bg');
            }
            (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
            $("#loader").hide();
            if(!mobilecheck()) $("#rp_scrl").css("overflow-y","auto");
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $('.with-nav-tabs').show();
            $("#loader").hide();
            show_error(1);
        } 
    });
};

function getReport(userName)
{
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var data = atob($("#report").attr("data-user")).split('-');
    var page = data[0];
    $("#review-loader").show();
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?113',
        data: en.code({'mamth':'M113','page':page,'userName':userName}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                var newPage = parseInt(page)+1;
                $(html).appendTo("#report-list");
                $("#report").mCustomScrollbar("update");
                $("#report").mCustomScrollbar("scrollTo","#to-scroll-report",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                $("#report").attr("data-user",btoa(newPage+"-"+decode.count).replace(/=/g,""));
            }
            window.setTimeout(function () { $("#review-loader").hide(); }, 500);
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#review-loader").hide();
            show_error(1);
        }
    });
}


/*--------------------------------------------------Review section Starts------------------------------------------------*/

function writeReview(placeId)
{
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    notify('Please wait..',1,1);
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?121',
        data: en.code({'mamth':'M121','id':placeId}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                $('#error_modal').html(html).show().delay(4500);
                var poiName = $('.poi-title').text().replace('eloc.me/','').replace($('.poi-eloc').text().replace('Copy','').trim(),'').replace('Copy','').trim();
                poiName = (poiName.split(' ').length > 2) ? poiName : poiName+' '+$('#full-adr').text().replace(poiName,'');
                $('#review-poi-title').text(poiName);
                notify('');
                var urlContent = breakUrl();
                if(urlContent[1].indexOf("WRz") === -1)
                {
                    var secondPart = urlContent[1].replace(/RRzdata|rrzdata|zdata/g,'WRzdata');
                    window.history.replaceState('', '', urlContent[0]+'@'+secondPart);
                }
            }
            else
            {
                var string = [];
                string.push({event:'review'});
                localStorage.setItem('event', JSON.stringify(string));
                $("#signin").trigger("click");
            }
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            if(textStatus!='abort') show_error(1);
        }
    });
}


var last_pg=0;
function readReview(placeId,pinId,bnd)
{ 
    var plcDetail ="";try{plcDetail = atob(atob(placeId)).split('-');}catch(e){return false;}
    var count = 0;
     
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    } 
    if(plcDetail[1] == 1) { $("#loader").show();}
     var url = window.location.toString().split('/');var curl = url.slice(-1)[0];
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?124',
        data: en.code({'mamth':'M124','page':plcDetail[1],'place-id':plcDetail[0].replace('ID',''),'pinId':pinId,'curl':curl,'bound':bnd}),
        timeout: 150000,
        success:function (data) 
        {
            var decode =""; try{decode= JSON.parse(data);}catch(e){show_error(1);$("#loader").hide();return false;}
            var html = decode.response;
            if(html)
            {
                if(plcDetail[1] == 1)
                {
                    if(mobilecheck()){$(".panel-primary").hide();}
                    var urlContent = breakUrl();
                    $('#poi_other').html(html).show().delay(4500);
                    $('#poi_info').hide();
                    $('.action-bar').removeClass('visible-xs visible-sm').removeAttr('style');
                    
                    $('#review-count').text($('#reviewCount').text());
                    if(urlContent[1].indexOf("RRz") === -1 && bnd!='no')
                    {
                        var secondPart = urlContent[1].replace(/WRzdata|wrzdata|zdata/g,'RRzdata');
                        call_url('', urlContent[0]+'@'+secondPart);
                    }
                }
                else
                {
                       $(html).appendTo('#place-review');
                       $('#review-loader').show();
                   
                }
                var count=$('.new-r-head:last').attr('id');
                $('#place-review').attr('data-user',btoa(btoa(plcDetail[0]+'-'+(parseInt(plcDetail[1])+1)+'-'+count)));
                if(!mobilecheck()) $("#rw_scrl").css("overflow-y","auto");
                $("#rw_scrl,#poi_other").scroll(function() { 
                    var h = $(this).height();var scroll = $(this).scrollTop();var Height = $(this)[0].scrollHeight-h;
                    var per=scroll*100/Height; 
                    if(per>=80)
                    {
                        if(last_pg==pg_review) return false;
                        last_pg=pg_review;
                        var data = atob(atob($("#place-review").attr("data-user"))).split('-');
                             
                        if(data[2]>= 10)
                        {
                            $('#review-loader').show();
                            $('#to-scroll').removeAttr('id');
                            readReview($("#place-review").attr("data-user"));
                        }
                    }
                });
            }
            $("#loader").hide();
            $('#review-loader').hide();
            $("#loader").hide();
            pg_review++;
            xhr = null; 
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
         
        }
    });
}
function singleReview(placeId,pinId)
{
    var plc='',pg='';if(placeId!='review'){/*review for applink*/ var plcDetail = atob(atob(placeId)).split('-'),plc=plcDetail[0].replace('ID',''),pg=plcDetail[1];}
    var count = 0;
     
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    } 
    if(pg == 1) { $("#loader").show();}
     var url = window.location.toString().split('/');var curl = url.slice(-1)[0];
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?124',
        data: en.code({'mamth':'M124','page':pg,'place-id':plc,'pinId':pinId,'curl':curl,'dataCount':'1'}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response)
            {
                if(curl.indexOf('pin')==-1) call_url('','review?journey='+placeId+"@"+pinId);
                $("#res_info").html(decode.response).show();
                $('.action-bar').removeClass('visible-xs visible-sm').removeAttr('style');
            }
            else
            {
                show_error(1);
            }
            (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
            if(!mobilecheck()) $("#rw_scrl").css("overflow-y","auto");
            $("#loader").hide();
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $('.with-nav-tabs').show();
            $("#loader").hide();
            show_error(1);
        }
    });
}
function getReview(userName)
{
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var data = atob($("#review").attr("data-user")).split('-');
    var page = data[0];
    $(".small-loader").show();
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?131',
        data: en.code({'mamth':'M131','page':page,'userName':userName}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                var newPage = parseInt(page)+1;
                $(html).appendTo("#review-list");
                $("#review").mCustomScrollbar("update");
                $("#review").mCustomScrollbar("scrollTo","#to-scroll-review",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                $("#review").attr("data-user",btoa(newPage+"-"+decode.count).replace(/=/g,""));
            }
            window.setTimeout(function () { $(".small-loader").hide(); }, 500);
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $(".small-loader").hide();
            show_error(1);
        }
    });
}

var reviewFormData,reportformData;
var submitVal;

$(document).on("click", "#review-form-second", function(event)
{
    var error = false;
    var email = $('#review-email-next').val();
    if(!emailRegex.test(email))
    {
        show_error('Please Enter a valid email.');
        $("#review-email-next").focus();
        error = true;
    }

    if(!error)
    {
        reviewFormData.append('email', email);
        submitReview(false,reviewFormData,email);
    }
    event.preventDefault();
});

/*--------------------------------------------------Review section Ends------------------------------------------------*/
var report_m='';var traffic_m='';var traffic_event='';var glb_rep='';
$(document).on("click", "#g_report", function (event) 
{
    if(glb_rep==1)
    {
        $(".rpp_spn").html("Report");
        glb_rep='';
        map.removeLayer(report_m);
        report_m='';return false;
    } 
    glb_rep=1; 
    get_report('click','401','401');
});

var gt_rport="";var report_icon_url="";
function get_report(event,pcat,ccat)
{ 
    /*$("#loader").show();*/
    if(map.getZoom()<10) {
        notify("Please zoom-in more to view the events");
        glb_rep=1;
        return false;
    }
    if((event=='click' || event=='remove') && !glb_rep)
    {
        glb_rep='';
        if(report_m) map.removeLayer(report_m);
        report_m='';
        $(".rpp_spn").html("Report");
        $("#loader").hide();
        return false;
    }  
    if(mobilecheck()) map.setActiveArea('viewport_all'); else map.setActiveArea('viewport');
    var bound=map.getBounds();
    var b_lat=bound._southWest.lat+"|"+bound._northEast.lat;var b_lng=bound._southWest.lng+"|"+bound._northEast.lng;
    if(gt_rport)  gt_rport.abort();
    gt_rport=$.post('userAuth?157', en.code({'mamth':'M157','lat':bound._southWest.lat,'lng':bound._southWest.lng,'pcat':pcat,'ccat':ccat,'y_lat':bound._northEast.lat,'y_lng':bound._northEast.lng}), function (data) 
    {
        /*$("#loader").hide();*/
        data = JSON.parse(data);
        if(data.response)
        {
            report_icon_url = data.response.baseURLObj['icon_url'];
            $.each(data.cat.parentCategories, function (i, cat) {
                catList[cat.id] = cat.name;
                $.each(cat.childCategories, function (j, subcat) {
                    catList[cat.id+"-"+subcat.id] = subcat.name;
                });
            });
            /*console.log(catList);*/
            $(".rpp_spn").html("<i class='fa fa-check' aria-hidden='true'></i> Report");
            show_report_marker('report',data.response.reports);
        }
        else  {
            $("#loader").hide();
            if(report_m) map.removeLayer(report_m);
            return false;
        }
    });
}
var newpopup=0;
function show_report_marker(from,data)
{
    if(data){ 
        var rdata=data;if(rdata==null) return false;
        if(from=='report')
        {
            if(report_m) map.removeLayer(report_m);report_m = L.markerClusterGroup();report_mr='';
        }
        else {if(traffic_m) map.removeLayer(traffic_m);traffic_m = L.markerClusterGroup();traffic_event=1;}
        for (var i = 0; i < rdata.length; i++) {
            var parentcat = rdata[i].parentCategory;
            var childcat = rdata[i].childCategory;
            var cat_code = parentcat+"-"+childcat;
            var rcat=catList[parentcat];
            var rchildcat=catList[cat_code];
            if(!rcat) continue;
            var rid=rdata[i].id;    
            var rflag=rdata[i].flaged;    
            var rlike=rdata[i].liked;
            /*if(rcat=='Traffic' && map.hasLayer(traffic_m)) continue;*/
            var rpath = report_icon_url+"0/web/36px/2x/";
            var r_ic=L.divIcon({className: '',iconSize: [24, 24],iconAnchor: [24,24], popupAnchor: [-14, -18],html: "<div class='report_icn rpt_icn_err'><img src='"+rpath+parentcat+"_"+childcat+".png?"+cachdt+"'></div>"});

            if(rdata[i].parentCategory) 
            {
                var rprt = reportPopupContent(rdata[i].description,rdata[i].addedBy,"report@"+rcat+"@"+rchildcat+"@"+rdata[i].id,rcat,rchildcat,1,rdata[i].addedBy,rid,rlike,rflag);
                var newpopup = L.popup({closeOnClick: true,autoClose: true}).setLatLng(L.latLng(rdata[i].latitude, rdata[i].longitude)).setContent(rprt);
                nearby_marker[i] = new L.Marker(new L.LatLng(rdata[i].latitude, rdata[i].longitude), {icon: r_ic}).bindPopup(newpopup).openPopup();
                if(from=='report') report_m.addLayer(nearby_marker[i]); else traffic_m.addLayer(nearby_marker[i]);
                if(nearby_marker[i]) nearby_marker[i].on('click', function(e) {if($('.leaflet-popup').length>1) $(".leaflet-popup-pane").find('div:first').remove();});
            }
    }
    if(from=='report') map.addLayer(report_m); else map.addLayer(traffic_m);
    $(".rpt_icn_err img").attr("onerror","this.onerror=null;this.src='"+rpath+"0.png'");
    $("#loader").hide();
    
    }
}

/*------------------------------ report nearby traffic start---------------------------------------------*/

function show_report_marker_traffic(from,data,cat)
{
    if(data)
    { 
        var rdata=data;
        if(rdata==null) return false;

        if(from=='report')
        {
            if(report_m) map.removeLayer(report_m);report_m = L.markerClusterGroup();report_mr='';
        }
        else {if(traffic_m) map.removeLayer(traffic_m);traffic_m = L.markerClusterGroup();traffic_event=1;}
        for (var i = 0; i < rdata.length; i++) {
            var parentcat = rdata[i].parentCategory;
            var childcat = rdata[i].childCategory;
            var cat_code = parentcat+"-"+childcat;
            var rcat=cat[parentcat];
            var rchildcat=cat[cat_code];
            if(!rcat) continue;
            var rid=rdata[i].id;    
            var rflag=rdata[i].flaged;    
            var rlike=rdata[i].liked;
            if(rcat=='Traffic' && map.hasLayer(traffic_m)) continue;
            if(from == "traffic") if(rchildcat!='Road Closed') continue;
            var rpath = "https://mmi-explore-images.s3.ap-south-1.amazonaws.com/reports/0/web/36px/2x/";
            var r_ic=L.divIcon({className: '',iconSize: [24, 24],iconAnchor: [24,24], popupAnchor: [-14, -18],html: "<div class='report_icn rpt_icn_err'><img src='"+rpath+parentcat+"_"+childcat+".png?"+cachdt+"'></div>"});

            if(rchildcat) {var rprt = reportPopupContent(rdata[i].description,rdata[i].addedBy,"report@"+rcat+"@"+rchildcat+"@"+rdata[i].id,rcat,rchildcat,1,rdata[i].addedBy,rid,rlike,rflag);
            nearby_marker[i] = new L.Marker(new L.LatLng(rdata[i].latitude, rdata[i].longitude), {icon: r_ic}).bindPopup(rprt);
            if(from=='report') report_m.addLayer(nearby_marker[i]); else traffic_m.addLayer(nearby_marker[i]);}
        }
        if(from=='report') map.addLayer(report_m); else map.addLayer(traffic_m);
        $(".rpt_icn_error img").attr("onerror","this.onerror=null;this.src='https://mmi-explore-images.s3.ap-south-1.amazonaws.com/reports/0/web/36px/2x/0.png?"+cachdt+"'");
    }
}

/*--------------------------------------------------Mydevices section start------------------------------------------------*/
var glb_dc='';
$(document).on("click", "#g_devices", function (event) 
{
    if(glb_dc==1)
    {
        $(".devices_spn").html("My Devices");
        $("#res_info").html("");
        $("#g_devices .toggleTrafficCommon img").attr("src","images/maplayer/ic_toggle_off.png");
        /*$("#mapLayerSidePanelMain").removeClass("customPanelMain");*/
        call_url('','.');
        map.removeLayer(group_stars);removeDevices();
        /*home(1);*/
        glb_dc='';
        return false;
    } 
    glb_dc=1;
    /*$("#mapLayerSidePanelMain").removeClass("customPanelMain");*/
    $("#g_devices .toggleTrafficCommon img").attr("src","images/maplayer/ic_toggle_on.png");
    getListContent(uname,'ZGV2aWNlcw==','','','',1);$("#res_info").hide();
    $(".devices_spn").html("<i class='fa fa-check' aria-hidden='true'></i> My Devices");
});

/*--------------------------------------------------MySaves section start------------------------------------------------*/
    var saves_m='',fav_m='';var glb_save='',gt_fav='';
    var nearby_marker_save=[],nearby_marker_fav=[];
    $(document).on("click", "#g_saves", function (event) 
    {
        if(glb_save==1)
        {
            $(this).find('.toggleTrafficCommon').removeClass('active');
            $(this).find('.toggleTrafficCommon img').attr('src','images/maplayer/ic_toggle_off.png');
            glb_save='';
            map.removeLayer(saves_m);saves_m='';nearby_marker_save=[];
            return false;
        } 
        
        get_all_saves('save',this);
    });
    $(document).on("click", "#g_fav", function (event) 
    {
        if(gt_fav==1)
        {
            $(this).find('.toggleTrafficCommon').removeClass('active');
            $(this).find('.toggleTrafficCommon img').attr('src','images/maplayer/ic_toggle_off.png');
            gt_fav='';
            map.removeLayer(fav_m);fav_m='';nearby_marker_fav=[];
            return false;
        } 
        
        get_all_saves('fav',this);
    });
    var gt_saves="";
    function get_all_saves(event,div)
    { 
        map.setActiveArea('map');
        var bound=map.getBounds();
        if(gt_saves)  gt_saves.abort();
        gt_saves=$.post('userAuth?161', en.code({'mamth':'M161'}), function (data) 
        {
            var data = JSON.parse(data);
            if(data==204){
                show_save_marker(data,event,div);
            }else{
                if(event=='save')glb_save=1;
                else gt_fav=1;
                /*$(".saves_spn").html("<i class='fa fa-check' aria-hidden='true'></i> My Saves");*/
                show_save_marker(data.listItems,event,div);
            }
        });
    }
    function show_save_marker(data,event,div)
    {
        if(data)
        { 
            var sdata=data;
            if(sdata==null) return false;
            nearby_marker_save=[];
            nearby_marker_fav=[];
            if(!saves_m) saves_m = L.markerClusterGroup({maxClusterRadius:20});
            if(!fav_m) fav_m = L.markerClusterGroup({maxClusterRadius:20});
            map.closePopup();
            $(div).find('.toggleTrafficCommon').addClass('active');
            $(div).find('.toggleTrafficCommon img').attr('src','images/maplayer/ic_toggle_on.png');
            var fcount=0,scount=0;
            for (var i = 0; i < sdata.length; i++) 
            {
                var lat=sdata[i].latitude;
                var lng=sdata[i].longitude;
                var pname=sdata[i].placeName;
                var itemId=sdata[i].itemId;
                var eloc=sdata[i].eLoc;
                var rating=sdata[i].rating;
                var listName=sdata[i].listName;

                if(!lat) continue;
                if(sdata[i].listName==undefined) continue;  
                var $url = "place-"+pname.replace(/\#/g," ").replace(/\ /g,"+").replace(/\, /g,"-, ").replace(/\//g,"$")+"@zdata="+btoa(lat+"+"+lng+"+16+ID"+eloc+"++el")+'ed';
                if(listName=='Favourites') s_icon='ic_fav_mrk';
                else if(listName=='Point On Map') s_icon='ic_point_on_map_mrk';
                else s_icon='ic_custom_mrk';
                var s_ic=L.divIcon({className: '',iconSize: [35, 35],iconAnchor: [24,24], popupAnchor: [-8, -18],html: "<div class='saves_icn'><img src='images/"+s_icon+".png?"+cachdt+"'></div>"});
                if(sdata[i].placeName) 
                {
                    var save_popup = '<div class="custom-leaf"><div class="blfont " style="padding:0 10px 0 0;width:190px" onclick="if(marker2) map.removeLayer(marker2);get_place_details(\''+$url+'\');"><b>'+sdata[i].placeName+'</b>'
                    +'</div><div class="new_context" style="cursor:pointer"><b><b><span><div onclick="share(\'http://eloc.me/'+sdata[i].eLoc+'\')"><i class="material-icons">link</i> <span class="dia_elc">eloc.me/'+sdata[i].eLoc+'</span>'
                    +'<div class="tooltip-share"><i class="material-icons">share</i> Share</div></div></span></b></b></div></div>';
                    map.closePopup();   
                    if(event=='fav' && sdata[i].listName=="Favourites")
                    {
                        if(nearby_marker_fav) map.removeLayer(nearby_marker_fav);
                        nearby_marker_fav[fcount] = new L.Marker(new L.LatLng(lat, lng), {icon: s_ic,zIndexOffset:30}).bindPopup(save_popup,{});
                        fav_m.addLayer(nearby_marker_fav[fcount]);
                        fcount++;
                    }else if(event=='save' && sdata[i].listName!="Favourites" && sdata[i].listName!="Point On Map"){
                        if(nearby_marker_save) map.removeLayer(nearby_marker_save);
                        nearby_marker_save[scount] = new L.Marker(new L.LatLng(lat, lng), {icon: s_ic,zIndexOffset:30}).bindPopup(save_popup,{});
                        saves_m.addLayer(nearby_marker_save[scount]);
                        scount++;
                    }

                }
            }

            if(event=='save'){
                if(nearby_marker_save.length<1) {
                    $(div).find('.toggleTrafficCommon').removeClass('active');
                    $(div).find('.toggleTrafficCommon img').attr('src','images/maplayer/ic_toggle_off.png');
                    show_error("You have yet to save a place. Start by saving a place to see them on the map through this toggle");
                    return false;
                }
                if(saves_m) map.removeLayer(saves_m);
                //saves_m =  new L.featureGroup(nearby_marker_save);
                map.addLayer(saves_m);
                //map.fitBounds(saves_m.getBounds());
            }else{ 
                if(nearby_marker_fav.length<1) {
                    $(div).find('.toggleTrafficCommon').removeClass('active');
                    $(div).find('.toggleTrafficCommon img').attr('src','images/maplayer/ic_toggle_off.png');
                    show_error("You have yet to save your favourites place. Start by saving a place to see them on the map through this toggle");
                    return false;
                }
                if(fav_m) map.removeLayer(fav_m);
                //fav_m =  new L.featureGroup(nearby_marker_fav);
                map.addLayer(fav_m);
                //map.fitBounds(fav_m.getBounds());
            }
            if(mobilecheck()) map.setActiveArea('viewport_all'); else map.setActiveArea('viewport');
        }
    }
function suggestAnEdit(suggestParam) 
{
    phonecount = 1;
    if( xhr != null) 
    {
        xhr.abort();
        xhr = null;
    }
    $('#loader').show();
    var curl = window.location.toString().split("/").slice(-1)[0];
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth',
        data: {'mamth':'M156','suggestParam':suggestParam,'curl':curl},
        timeout: 15000,
        success:function (data) 
        {            
            var decode = JSON.parse(data);
            var html = decode.response;
            var loggedIn=decode.loggedIn;
            $('#res_info').html(html).show().delay(500);
            $("#editscroll").mCustomScrollbar({theme: "dark", scrollInertia: 100});
            remove_layers();
        
            if (decode.loggedIn) 
            {
                loadsuggestedEdits();
                $('#suggestsubmit').attr('name', 'Submit');
                $("#suggestsubmit").text("Submit");
            }
            else 
            {
                loadsuggestedEdits();
                $('#suggestsubmit').attr('name', 'Next');
                $("#suggestsubmit").text("Sign-in To Post");
            }
            $('.main-page').css('overflow-y', 'visible');
            $('#loader').hide();
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });
}
function save_SuggestedEdit(username)
{
    var username_val='';
    var edtemail = $('input:text[id=edtemail]').val();
    var form = $('#uedtplcform')[0];
    var place_category = '', place_location = '', place_website = '', place_phone = '',
            place_closed = '', addhoursjson = '', place_description = '', place_type = '';

    $('input:text[id=sph]').each(function ()
    {
        if (place_phone == '') {
            place_phone = $(this).val();
        }
        else {
            if ($(this).val() != '')
                place_phone = place_phone + "," + $(this).val();
        }
    });
    var addhoursObj = {};
    var open_hours = $("input[name=edtopen_hours]:checked").val();
    if (open_hours != 'open always') {
        $('.sedit-bus-app-block').each(function (index, item) {
            var spanValues = [];
            $(this).find('.multiSel span').each(function () {
                spanValues.push($(this).text());
            });
           /* var checkbox = $(this).find("input[type='checkbox']");
            var pipedSpanValues = spanValues.join("");*/
            if (spanValues.length > 0) {
        var pipedSpanValues = spanValues.join("");
                var text2 = $(this).find('.edttimeSelectopen option:selected').text();
                var text3 = $(this).find('.edttimeSelectclose option:selected').text();
                if ($(this).find(".edttimeSelectopen").hasClass("disableseladd") && $(this).find(".edttimeSelectclose").hasClass("disableseladd")) {
                    addhoursObj[index] = pipedSpanValues + "|" + "Open 24 Hours";
                }
                else if (text2 || text3) {
                    if (text2 === "Open Time") {
                        text2 = "";
                    }
                    if (text3 === "Close Time") {
                        text3 = "";
                    }
                    addhoursObj[index] = pipedSpanValues + "|" + text2 + "|" + text3;
                }
                
            }
        });
    }
    else {
        addhoursObj[0] = 'open always';
    }
    if (addhoursObj!= '{}')
     addhoursjson = JSON.stringify(addhoursObj);


    place_location = $('input[name="edtcat_option"]:checked').val();
    if(place_location=="0"){
    if($("#drag_lat").val() == '') var drag_lat = $("#edtplace_lat").val(); else var drag_lat = $("#drag_lat").val();
         if($("#drag_lon").val() == '') var drag_lon = $("#edtplace_lon").val(); else var drag_lon = $("#drag_lon").val();
         $("#edtplace_lat").val(drag_lat);
         $("#edtplace_lon").val(drag_lon);
    }
    place_type=$('ul#eplace_type').find('li.active').attr("value");
    place_description = $('textarea[id=descrptionedit]').val();

    $('#loader').show();
    var formData = new FormData(form);
    formData.append('place_type', place_type);
    formData.append('place_category', place_category);
    formData.append('place_location', place_location);
    formData.append('place_phone', place_phone);
    formData.append('place_hours', addhoursjson);
    formData.append('place_description', place_description);
    formData.append('place_closed', place_closed);
    formData.append('useremail', edtemail);
    formData.append('mamth', 'M151');

    if (xhr != null) {
        xhr.abort();
        xhr = null;
    }
    xhr = $.ajax(
            {
                url: 'userAuth',
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                mimeType: "multipart/form-data",
                success: function (data)
                {
                    var res = JSON.parse(data);
                    $(".panel-primary").css('z-index','2');
                    
                    if (res.response.response == '201')
                    {
            var userexist=res.response.userexist;
                        var message = 'Data submitted successfully. Your edits will be reviewed by our data team and published soon.';
                      /*  var type = 'green_bg';*/
                        notify(message);
                        if (staticMrkr)
                            map.removeLayer(staticMrkr);
                        if (edtmk)
                            map.removeLayer(edtmk);
                        $('#loader').hide();
                        if ($('#suggestsubmit').attr('name') == 'Next' && userexist == 1) {
                            $("#signin").trigger("click");
                            window.setTimeout(function () {
                                $(".user_email").val(edtemail);
                            }, 500);
                            return false;
                        }
                        else {
                
                  $("#backbtn").trigger("click");
                            return false;
                        }

                    }
                    else if(res.response.error) {show_error(res.response.error);$('#loader').hide();}
                    else
                    {
                        show_error('Data could not be submitted. Please try again');
            $("#editscroll").mCustomScrollbar("destroy");
                        if (staticMrkr)
                            map.removeLayer(staticMrkr);
                        if (edtmk)
                            map.removeLayer(edtmk);

                        $("#backbtn").trigger("click");
                        $('#loader').hide();
                        return false;
                    }
                }
            });
}
function addMarkerUAP(lat, lng){
    
    map.setActiveArea('map');
    map.panTo(new L.LatLng(lat, lng));  
    var curUrl = document.URL;
    if(curUrl.indexOf("add-a-")!==-1) 
    {
       if($("#uap_tap_dv").css('display') == 'none') {
           $("#uap_tap_dv").show();
        }
        if(window.mobilecheck()) $("#success_sec").addClass("crete-mob");
        else  $("#success_sec").removeClass("crete-mob");
    }
    else if(!window.mobilecheck()){
        if($("#uap_tap_dv").css('display') == 'none') {
           $("#uap_tap_dv").show();
        }
    } 
    return false;
}
function addMissingPlace(lat,lng,user_added_places,type,adrs){
    if( xhr != null) 
    {
        xhr.abort();
        xhr = null;
    }
    remove_layers();
    
    $('#loader').show();
    if (user_added_places == '' || user_added_places == 'undefined' || lat == '' || lat == 'undefined' || lng == '' || lng == 'undefined') {
        $('#loader').hide();
        return;
    }
    
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?154',
        data: en.code({'mamth':'M154','lat':lat,'lng':lng,'placeParam':user_added_places,'type':type}),
        timeout: 15000,
        success:function (data) 
        { 
            
            map.closePopup();
            document.title = "Mapmyindia Maps: Add a Place";
            if(type=="business") call_url('', 'add-a-business'); else call_url('', 'add-a-place');
            $(".main-page").css("overflow-y", "visible");
            var decode = JSON.parse(data);
            var html = decode.response;
            var loggedIn=decode.loggedIn;
            /* $("#res_info").html("");
            if(type=="business") $('#res_info').html(html).show().delay(500);*/
            $("#modal_new").html(html).show().delay(500);
            $("#cat_tab,.as-results,.get-eloc-sec-bus").hide();
            if(adrs) populateaddPlcForm(lat, lng, user_added_places);
            
            if(type && type!='business' && type!='add-a-place')
            {
                $("#side-menu, .directions-trigger-sec").hide();
                $("#side-back").show();
                $("#auto").attr("placeholder","Search places ");
                $(".addp-new-head .gen-eloc").find('h2').html("Create eLoc"); 
                if(mobilecheck()) 
                        {
                            $("#type_uapcancel,.addp-new-head #type_uapbackbtn").attr("href","get-eLoc");
                            $("#type_uapcancel,.addp-new-head #type_uapbackbtn").attr("onclick","");
                        }else{
                    $("#type_uapcancel,.addp-new-head #type_uapbackbtn").attr("onclick","addGetEloc();");
                    $("#type_uapcancel,.addp-new-head #type_uapbackbtn").attr("href","javascript:void(0)");
                }
                $(".addp_user_try ul #addpanother").attr("onclick","addGetEloc();");
            }
            $("#uapscroll").mCustomScrollbar({theme: "dark", scrollInertia: 100});
        $("#addpauto").autoSuggest(a, 
            {
                asHtmlID : "addpauto",
                selectedItemProp : "addr",
                searchObjProps : "addr",
                resultsHighlight : false
            });
        /*if(!window.mobilecheck()){*/
            $("#nearbyland").autoSuggest(a, 
            {
                asHtmlID : "nearbyland",
                selectedItemProp : "addr",
                searchObjProps : "addr",
                resultsHighlight : false
            });
     /*}*/
            addMarkerUAP(lat,lng); 
            if (decode.loggedIn) {
                if(window.mobilecheck()){$('.with-nav-tabs').hide();}
                $("#addpdivemail").hide();
            }
            $('.uapsubmit').attr('name', 'Next');
            $('.uapsubmit').text('Next');
            $('#loader,#tap_dv').hide();
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });
}

$(document).on("click", "#uapcancel, #uapbackbtn", function (event) 
{
    var name = $(this).attr("name");
    if (name == "back") 
    {
        if(window.mobilecheck())
        {
            $("#uapbackbtn").attr("name", "cancel");
            $("#mobnext").attr("name", "Next");
        $("#mobnext").text("Next");
            $("#uapbackbtn > i").addClass('material-icons');
            $("#uapbackbtn > i").html('close');
            $("#uapbackbtn > i").removeClass('ti-arrow-circle-left');
        }
        else
        {
            $("#uapcancel").html('<i class="ti-arrow-circle-left"></i>');
            $("#uapcancel").attr("name", "cancel");
            $("#uapsubmit").attr("name", "Next");
            $("#uapsubmit").text("Next");
        }
        $("#add_place_step02,#add_place_step03").hide();
        $("#add_place_step01").show();
    }
    else if(name == "cancel")
    {
        home();
        if (window.mobilecheck()) 
        {
            $(".with-nav-tabs").show();
            $('#map').insertAfter('.addp-web-onmap-sec');
            call_url('','.');
        }
        $(".addp-web-onmap-sec").hide();
    }
    else if (name == "new_Submit" || name == "Submit") 
    {
        if(window.mobilecheck())
        {
            $("#uapbackbtn").attr("name", "cancel");
            $("#mobnext").attr("name", "Next");
            $("#uapbackbtn > i").addClass('material-icons');
            $("#uapbackbtn > i").html('close');
            $("#uapbackbtn > i").removeClass('ti-arrow-circle-left');
        }
        else
        {
            $("#uapcancel").html('<i class="ti-arrow-circle-left"></i>');
            $("#uapcancel").attr("name", "cancel");
            $("#uapsubmit").attr("name", "Next");
            $("#uapsubmit").text("Next");
        }
        $("#add_place_step02,#add_place_step03").hide();
        $("#add_place_step01").show();
    }
});

$(document).on("click", "#uapsubmit, #mobnext", function (event) 
{    
    var name = $(this).attr("name");
    if (name == "Next") 
    {
        if (addpValidationsStep0()) 
        {
            $(".addp-user-sugg").hide();
            $("#add_place_step01").hide();
            $("#add_place_step02").show();
        
        if(window.mobilecheck())
            {
                var add = $("#uapsubmit").val(); 
                if(add == "Submit") 
                {
                    $("#mobnext").attr("name", "Submit");
                    $("#mobnext").text("Submit");  
                }else{
                    $("#mobnext").attr("name", "new_Submit");
                    $("#mobnext").text("Sign-in to POST");
                }
                $("#uapbackbtn").attr("name", "back");
                $("#uapbackbtn > i").removeClass('material-icons');
                $("#uapbackbtn > i").html('');
                $("#uapbackbtn > i").addClass('ti-arrow-circle-left');
            }
            else
            {
                $("#uapcancel").html('<i class="ti-arrow-circle-left"></i>');
                $("#uapcancel").attr("name", "back");
                var add = $("#uapsubmit").val(); 
                if(add == "Submit") 
                {
                    $("#uapsubmit").attr("name", "Submit");
                    $("#uapsubmit").text("Submit");  
                }else{
                    $("#uapsubmit").attr("name", "new_Submit");
                    $("#uapsubmit").text("Sign-in to POST");
                }
            }
        }
    }
    else if (name == "Submit") 
    {
        if(addpValidationsStep1())
        {
            showConfirmation(false,"adduap");
        }
    }
    else if (name == "new_Submit") 
    {
        var valid = addpValidationsStep1(); 
        if(!valid) return false;
    $.post('userAuth?140', en.code({'mamth':'M140','evt':'addPlace',"lat":$("#place_lat").val(),"lon":$("#place_lon").val()}), function (data) 
        {
            var decode = JSON.parse(data);
            $('#error_modal').html(decode.response).show();
            $(".row #addPlace-sec").show();
            $("#head-title").html('Sign-in/Sign-up to post your Add Place');
            $(".addDesc").html($("#uplaceaddr").val());
            $(".r-s-head").show();
            var pname =  $("#uplace_name").val();
            var type = $("input[name=cat_option]:checked").val();
            if(type == 0) var cat = 'Residential'; else var cat = 'Non-Residential';
            $("#pname").text(pname+' > '+cat);
            return false;    
        });
        /*$('#signin_add_place').show();*/
        $(".login-sec,#login-text").show();
        $("#signup-text").hide();
        $(".panel-primary").css('z-index','1');
    }
    event.preventDefault();
});

function populate(selector)
{
    var select = $(selector);
    var hours, minutes, ampm;
    if (selector == ".timeSelectopen" || selector == ".edttimeSelectopen")
        select.append($('<option selected disabled hidden" value="">Open Time</option>'));
    if (selector == ".timeSelectclose" || selector == ".edttimeSelectclose")
        select.append($('<option selected disabled hidden" value="">Close Time</option>'));
    for (var i = 420; i <= 1830; i += 30)
    {
        hours = Math.floor(i / 60);
        minutes = i % 60;
        if (minutes < 10)
        {
            minutes = "0" + minutes;
        }
        ampm = hours % 24 < 12 ? "AM" : "PM";
        hours = hours % 12;
        if (hours === 0)
        {
            hours = 12;
        }
        select.append($("<option></option>").attr("value", i).text(hours + ":" + minutes + " " + ampm));
    }
    $(document).on("focus", selector, function ()
    {
      $(this).removeAttr("size");
    });
    $(document).on("blur", selector, function ()
    {
        $(this).attr("size", "1");
    });
    $(document).on("change", selector, function ()
    {
        $(this).attr("size", "1");
    });
    return false
}

$(document).on("click", ".dropdown dt a", function ()
{
    $(".dropdown dd ul").hide();
    $(this).parents(".dropdown").find("dd ul").toggle();
    return false
});
$(document).on("click", ".dropdown dd ul li a", function ()
{
    var dd = $(this).parents(".dropdown");
    dd.find("dd ul").hide();
    return false
});
$(document).bind("click", function (e)
{
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("dropdown"))
        $(".dropdown dd ul").hide();
});
var count_day = 0;
var happy_count=0;
$(document).on("click", "#operatingtimesdiv .mutliSelect input[name='Days[]']", function ()
{
    var title = $(this).val() + ",";
    var days_val = $(this).attr("id");
    if ($(this).is(':checked'))
    {
        count_day = count_day+1;
        var curhtml = '<span title="' + title + '" id="'+days_val+'">' + title + '</span>';
        var existingspan;
        $("#operatingtimesdiv p.multiSel").each(function () {
        var currentElement = $(this).html();
        existingspan = existingspan + currentElement;
        });
        if (existingspan.indexOf(curhtml) == -1) {
            $(this).parents(".dropdown").find("p").append(curhtml);
            $(this).parents(".dropdown").find(".hida").hide();
        }
        else {
            $(this).prop('checked', false);
        }
        if(count_day==7){
            $(this).parents(".dropdown").find(".mutliSelect input[id='Select_all']").prop('checked', true);
        }
    }
    else
    {
        count_day = count_day-1;
        $(this).parents(".dropdown").find('span[title="' + title + '"]').remove();
        var ret = $(".hida");
        var dd = $(this).parents(".dropdown");
        if($(this).parents(".dropdown").find("p.multiSel").html()=="")
        {
            $(this).parents(".dropdown").find(".hida").show();
        }
        if(count_day<7){
            $(this).parents(".dropdown").find(".mutliSelect input[id='Select_all']").prop('checked', false);
        }
    }
    if(count_day==7) $("#openhoursdiv").hide();
    else $("#openhoursdiv").show();
});
$(document).on("click", "#operatingtimesdivHappy .mutliSelect input[name='Days[]']", function ()
{
    var title = $(this).val() + ",";
    var days_val = $(this).attr("id");
    if ($(this).is(':checked'))
    {
        if(happy_count<2){
            happy_count = happy_count+1;
            var curhtml = '<span title="' + title + '" id="'+days_val+'">' + title + '</span>';
            var existingspan;
            $("#operatingtimesdivHappy p.multiSel").each(function () {
                var currentElement = $(this).html();
                existingspan = existingspan + currentElement;
            });
            if (existingspan.indexOf(curhtml) == -1) {
                $(this).parents(".dropdown").find("p").append(curhtml);
                $("#operatingtimesdivHappy .hida").hide();
            }
            else {
                $(this).prop('checked', false);
            }
        }else{
            show_error("Please select only two days!")
            return false;
        }
    }
    else
    {
        happy_count = happy_count-1;
        $(this).parents(".dropdown").find('span[title="' + title + '"]').remove();
        var ret = $(".hida");
        var dd = $(this).parents(".dropdown");
        if($("#operatingtimesdivHappy p.multiSel").html()=="") $("#operatingtimesdivHappy .hida").show(); 
    }
    if(count_day==7) $("#openhoursdiv").hide();
    else $("#openhoursdiv").show();

});

function select_allDays(source) {
    var checkboxes = $(".mutliSelect input[type='checkbox']");
    $(source).parents(".dropdown").find("p").html('');
    for (var i = 1; i < 8; i++) 
    {
        if (checkboxes[i] != source)
        {
            checkboxes[i].checked = source.checked;
            var title = $(checkboxes[i]).val() + ",";
            var days_val = $(checkboxes[i]).attr("id");
            
            if ($(source).is(':checked'))
            {
                count_day = count_day+1;
                var curhtml = '<span title="' + title + '" id="'+days_val+'">' + title + '</span>';
                var existingspan;
                $("dt p.multiSel").each(function () {
                    var currentElement = $(source).html();
                    existingspan = existingspan + currentElement;
                });  
                if (existingspan.indexOf(curhtml) == -1) {
                    $(source).parents(".dropdown").find("p").append(curhtml);
                    $(".hida").hide();
                }
                else {
                    $(source).prop('checked', false);
                }
                if(count_day>6){count_day=7;}
            }
            else
            {
                count_day = count_day-1;
                $(source).parents(".dropdown").find('span[title="' + title + '"]').remove();
                var ret = $(".hida");
                var dd = $(this).parents(".dropdown");
                dd.find("dt a").append(ret);
                if($(source).parents(".dropdown").find("p.multiSel").html()=="") 
                {
                    $(source).parents(".dropdown").find(".hida").show();    
                }
                
               
            }
        }
    }
    if(count_day==7) $("#openhoursdiv").hide();
    else $("#openhoursdiv").show();
}

$(document).on("click", "#edtoperatingtimesdiv .mutliSelect input[type='checkbox']", function ()
{
    var title = $(this).val() + ",";
    if ($(this).is(':checked'))
    {
        var curhtml = '<span title="' + title + '">' + title + '</span>';
        var existingspan;
        $("p.multiSel").each(function () {
            var currentElement = $(this).html();
            existingspan = existingspan + currentElement;
        });
        if (existingspan.indexOf(curhtml) == -1) {
            $(this).parents(".dropdown").find("p").append(curhtml);
            $(".hida").hide();
        }
        else {
            $(this).prop('checked', false);
        }
    }
    else
    {
        $(this).parents(".dropdown").find('span[title="' + title + '"]').remove();
        var ret = $(".hida");
        var dd = $(this).parents(".dropdown");
        dd.find("dt a").append(ret);
    }
});
$(document).on("click", ".mutliSelect label", function ()
{
    var labelID = $(this).attr('for');
    var checkboxId=labelID+'day';
    $(this).parent("li").find("input").trigger('click');
});
$(document).on("click", ".a-h-check-block label", function ()
{
    var labelID = $(this).attr('for');
    var checkboxId=labelID+'-hrs';
    $(this).parent().find("input").trigger('click');
});

function viewMyPlace(userName,UserId)
{    
    auto_load('');
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    if(!pop_state) $("#loader").show();
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?159',
        data: en.code({'mamth':'M159','pop':pop_state,'userId':UserId,'userName':userName}),
        timeout: 150000,
        success:function (data) 
        { 
            auto_load('dr');
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                home(0);call_url(userName+' My Saves',userName+'?my-place');
                $("#res_info").html(html).show();
                if(mobilecheck()){$('.with-nav-tabs').hide();}
                $("#list-content-scroll-bar").mCustomScrollbar(
                {
                    scrollButtons:{enable:true},
                    theme:"dark",
                });
            }
            else if(html == 'null') {
               $("#res_info").hide(); 
            }
            else{
                $("#res_info").hide();
            }
            window.setTimeout(function () { $("#loader").hide() }, 500);
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
     $("#loader").hide();
}
var x_cat=0;
function close_cat()
{
    $('#cat_tab').hide();$('#near-menu-trigger').show();$('#near-menu-search').addClass('show-trigger');
}
function viewMyEloc(userName,list_name,userId)
{    
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var data = $("#list-content-scroll-bar").attr("data-user");
    if(typeof(data) != 'undefined')
    {
        data =  atob(data).split("-");
        if(data!="") var page = data[0];
        else var page = 1;
    }
    else
    {
        var page = 1;
    }
    (page == 1) ? $("#loader").show() : $("#review-loader").show();
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth?155',
        data: en.code({'mamth':'M155','page':page,'userId':userId,'userName':userName,'list_name':list_name}),
        timeout: 15000,
        success:function (data) 
        { 
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                var newPage = parseInt(page)+1;
                if(page == 1)
                {
                    $("#res_info").html(html).show();
                    if(list_name) call_url(userName+' '+list_name,userName+'?'+list_name);
                    else call_url(userName+' My Saved eLoc',userName+'?my-saved-eloc');
                    if(mobilecheck()){$('.with-nav-tabs').hide();}
                    $('#report-loader').hide();
                }
                else
                {
                    $(html).appendTo('#sortable');
                    $("#list-content-scroll-bar").mCustomScrollbar("update");
                    $("#list-content-scroll-bar").mCustomScrollbar("scrollTo","#to-scroll",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                    $('#report-loader').hide();
                }
                var count=$('.new-r-head:last').attr('id');
                $("#list-content-scroll-bar").attr("data-user",btoa(newPage+'-'+count).replace(/=/g,''));
                if(!mobilecheck()) $("#list-content-scroll-bar").css("overflow-y","auto");
                $("#list-content-scroll-bar").scroll(function() { 
                    var h = $(this).height();var scroll = $(this).scrollTop();var Height = $(this)[0].scrollHeight-h;
                    var per=scroll*100/Height; 
                    if(per>=80)
                    {
                        if(last_pg==pg_contri) return false;
                        last_pg=pg_contri;
                        var newData = $("#list-content-scroll-bar").attr("data-user");
                        newData = atob(newData).split('-');
                        if(newData[1]>= 10)
                        {
                            /*$('#review-loader').show();*/
                            $('#report-loader').show();
                            $('#to-scroll').removeAttr('id');
                            viewMyEloc(userName)
                        }
                    }
                });
                /*$("#list-content-scroll-bar").attr("data-user",btoa(newPage+'-'+decode.count).replace(/=/g,''));
                $("#list-content-scroll-bar").mCustomScrollbar(
                {
                    scrollButtons:{enable:true},
                    theme:"dark",
                    callbacks:
                    {
                        onTotalScroll:function()
                        {  
                            var newData = $("#list-content-scroll-bar").attr("data-user");
                            if(typeof(newData) != 'undefined')
                            {
                                newData = atob(newData).split('-');
                                if(newData[1] == 10)
                                {
                                    $('#to-scroll').removeAttr('id');
                                    viewMyEloc(userName)
                                }
                            }
                        },
                    }
                });*/
            }
            pg_contri++;
            window.setTimeout(function () { (page == 1) ? $("#loader").hide() : $("#review-loader,#report-loader").hide(); }, 500);
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
}
function viewMyPandals(userName,type)
{    
    if( xhr != null ) 
    {
        xhr.abort();
        xhr = null;
    }
    var data = $("#list-content-scroll-bar").attr("data-user");
    if(typeof(data) != 'undefined')
    {
        data =  atob(data).split("-");
        var page = data[0];
    }
    else
    {
        var page = 1;
    }
    (page == 1) ? $("#loader").show() : $("#review-loader").show();
    xhr = $.ajax(
    {
        type: 'POST',
        url: 'userAuth',
        data: {'mamth':'M155','page':page,'userName':userName,'list_type':type},
        timeout: 15000,
        success:function (data) 
        { 
            var decode = JSON.parse(data);
            var html = decode.response;
            if(html)
            {
                var newPage = parseInt(page)+1;
                if(page == 1)
                {
                    $("#res_info").html(html).show();
                    if(type) call_url("durga-pandals","durga-pandals");
                    else call_url(userName+' My Saved eLoc',userName+'?my-saved-eloc');
                    if(mobilecheck()){$('.with-nav-tabs').show();}
                }
                else
                {
                    $(html).appendTo('#sortable');
                    $("#list-content-scroll-bar").mCustomScrollbar("update");
                    $("#list-content-scroll-bar").mCustomScrollbar("scrollTo","#to-scroll",{scrollInertia:2500,scrollEasing:"easeInOutQuad"});
                }
                $("#list-content-scroll-bar").attr("data-user",btoa(newPage+'-'+decode.count).replace(/=/g,''));
                $("#list-content-scroll-bar").mCustomScrollbar(
                {
                    scrollButtons:{enable:true},
                    theme:"dark",
                    callbacks:
                    {
                        onTotalScroll:function()
                        {  
                            var newData = $("#list-content-scroll-bar").attr("data-user");
                            if(typeof(newData) != 'undefined')
                            {
                                newData = atob(newData).split('-');
                                if(newData[1] == 10)
                                {
                                    $('#to-scroll').removeAttr('id');
                                    viewMyPandals('youngbikers','edited');
                                }
                            }
                        },
                    }
                });
            }
            window.setTimeout(function () { (page == 1) ? $("#loader").hide() : $("#review-loader").hide(); }, 500);
            xhr = null;
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            $("#loader").hide();
            show_error(1);
        }
    });
}


/*--------------------------------------------------Facebook login Starts------------------------------------------------*/

function facebookLogin(login) 
{
    FB.login(function(response) 
    {
        if(response.authResponse) 
        {
            $("#loader").show();
            storedEvent = localStorage.getItem("event");
            $.post("facebook",{'login':login,'storedEvent':storedEvent}, function (data) 
            { 
                var decode = JSON.parse(data);
                if(decode.response)
                {
                    if(decode.message.html)
                    {
                        $("#res_info").html("").hide();
                        maps.login_dv(decode.message.html);
                        if(storedEvent)
                        {   
                            storedEvent=JSON.parse(storedEvent);
                            var data = storedEvent[0].event;
                            checkStoredEvent(data);
                            localStorage.setItem('event','');
                        }
                        else
                        {
                            call_url("MapmyIndia Maps: Search locations, driving directions and places nearby",".");
                        }
                    }
                    else
                    {
                        if(!decode.message.publish)
                        {
                            $('.post-fb').children().removeClass('fa-toggle-on').addClass('fa-toggle-off');                
                        }
                    }
                }
                else
                {
                    $('.post-fb').children().removeClass('fa-toggle-on').addClass('fa-toggle-off');
                } 
                $("#loader").hide();
            });
        }
        else
        {
            $('.post-fb').children().removeClass('fa-toggle-on').addClass('fa-toggle-off');
            $("#loader").hide();
        }
    }, {scope: 'email,publish_actions'});
}


function googleLogin(login)
{
    alert('ds');
}
/*--------------------------------------------------Twitter login Starts------------------------------------------------*/

function handleTwitterPopup(html)
{
    $("#res_info").html("").hide();
    storedEvent = localStorage.getItem("event");
    if(storedEvent)
    {   
        storedEvent = JSON.parse(storedEvent);
        var data = storedEvent[0].event;
        checkStoredEvent(data);
        localStorage.setItem("event","");
    }
    else
    {
        call_url("MapmyIndia Maps: Search locations, driving directions and places nearby",".");
    }
    maps.login_dv(JSON.stringify(html));
    $("#loader").hide();
}

$(document).on("click","#tw",function(event)
{
    $("#loader").show();   
    storedEvent = localStorage.getItem("event");
    setCookie('storedEvent',storedEvent,1);
    var win = window.open("twitter", "Twitter", "width=640,height=480");
    var interval = window.setInterval(function() 
    {
        if (win == null || win.closed) 
        {
            window.clearInterval(interval);
            $("#loader").hide();
        }
    }, 1000);
});

/*--------------------------------------------------Twitter login Ends------------------------------------------------*/

/*--------------------------------------------------Check Access To Post Starts------------------------------------------------*/

$(document).on("click", ".post-fb,.post-tw", function(event)
{
    var socialClass = $(this).hasClass('post-fb') ? 'post-fb' : 'post-tw';
    if($('.'+socialClass+'').children().hasClass('fa-toggle-on'))
    {
        $('.'+socialClass+'').children().removeClass('fa-toggle-on').addClass('fa-toggle-off')
    }
    else
    {
        $('.'+socialClass+'').children().removeClass('fa-toggle-off').addClass('fa-toggle-on');

        if(socialClass == 'post-fb')
        {
    var win= window.open("social/fblogin/?post=true","fb","height=500,width=500,top=30%,left:30%");
        }
        else if(socialClass == 'post-tw')
        {
            $("#loader").show();
            $.post('userAuth?152', en.code({'mamth':'M152'}), function (data) 
            {
                var decode = JSON.parse(data);
                if(!decode.response)
                {
                    window.open("twitter", "Twitter", "width=640,height=480");    
                }
                else
                {
                    $("#loader").hide();
                }
            });   
        }
    }
    event.preventDefault();
});
/*--------------------------------------------------Check Access To Post Ends------------------------------------------------*/

/*--------------------------------------------------Social login Ends------------------------------------------------*/

/*--------------------------------------------------Social share Starts------------------------------------------------*/

function shareOnFb(twShare,desc,image,link,name)
{
    var fbObj = 
    {
        method: 'feed',
        link: link,
        picture: image,
        name: name,
        caption: 'MAPS.MAPMYINDIA.COM',
        description: desc,
        display:'popup'
    };
    FB.ui(fbObj, function(response)
    {
        if(twShare)
        {
            shareOnTw();   
        }   
    });
}

function shareOnTw(desc,image,link,name)
{
    var url = 'https://twitter.com/intent/tweet/?text=Check%20out%20this%20website!&url=https%3A%2F%2Fjonsuh.com%2F&via=jonsuh';
    var width = 500;
    var height = 300;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    window.open(url,"","menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}

function loginDv(evt_id)
{   
        var lg_r=0;
    showfl=1;
        indoormp=undefined;
        window.setTimeout(function () {if(!lg_r) notify('Loading..',1);}, 1000);
        $.post('userAuth?101', en.code({'mamth':'M101','event':evt_id}), function (data) 
        { 
            var decode ="";try{ decode =JSON.parse(data);}catch(e){show_error(1);return false;}
            var text = decode.response; notify('');lg_r=1;
            var url = window.location.toString().split('/'),curl = url.slice(-1)[0];
            if(evt_id=='signin')
            {
                if(curl.indexOf('place-')==-1 && curl.indexOf('direction')==-1) {home(0);call_url('MapmyIndia Sign In','signin');}
                $("#error_modal").html(text).show();
            }
            else $("#error_modal").html(text).show();
            pushy('hide');
            
            var storedEmail = localStorage.getItem("user-exist-email");
           
            $(".user_email").val(storedEmail);
            localStorage.removeItem('user-exist-email');
            $('.as-results').hide();
            $('#mobile-tour-bar').hide();
            $('#welcome-car').hide();
            if(evt_id.indexOf('cmmnt')==0){ $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').hide();}
            else if(curl.indexOf('place-')==-1 && curl.indexOf('direction')==-1) $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').show(); 
            else {
                $('#res_info').show();
                $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').hide();
            }

        });
}
function loginDvForce(evt_id)
{
        var lg_r=0;
    showfl=0;
        window.setTimeout(function () {if(!lg_r) notify('Loading..',1);}, 1000);
        $.post('userAuth?101', en.code({'mamth':'M101','event':evt_id}), function (data)
        {
            var decode ="";try{ decode =JSON.parse(data);}catch(e){show_error(1);return false;}
            var text = decode.response; notify('');lg_r=1;
            var url = window.location.toString().split('/'),curl = url.slice(-1)[0];
            if(evt_id=='signin')
            {  
               
                $("#error_modal").html(text).show();
                $("#error_modal").css("z-index","999999");
            }
            else $("#error_modal").html(text).show();
            pushy('hide');
           
            if(fcnt==2)$("#close_login").show();
      else $("#close_login").hide();  
            if(fcnt==3){
            $("#countdown-number,#loader-login").show();
            var counter = 16;
            var interval = setInterval(function() {
            counter--;
            if (counter <= 0) {
            clearInterval(interval);
            $('#loader-login').hide();
            $('#countdown-number').hide();
            $('#close_login').show();
            return;
           }else{
          $('#countdown-number').text(counter);
        
           }
          }, 1000);
            window.setTimeout(function () { $("#close_login").show(); }, 15000);
           }

            var storedEmail = localStorage.getItem("user-exist-email");

            $(".user_email").val(storedEmail);
            localStorage.removeItem('user-exist-email');
            $('.as-results').hide();
            $('#mobile-tour-bar').hide();
            $('#welcome-car').hide();
                 
           if(curl.indexOf('place-')==0 || curl.indexOf('report@')==0 || curl.indexOf('review@')==0 || curl.indexOf('enquiry@')==0 || curl.indexOf('report@')==0 || curl.indexOf('my-world-data=')==0) $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').hide();
           //else if(curl=='') setTimeout(function(){ $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').show();},1000);
           // else {
                $('#res_info').show();
            //    $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').hide();
            //}

        });
}

function markNotificationAsRead(notification_id){

        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?marknotificationread',
            data: en.code({'mamth':'marknotificationread','notification_id':notification_id}),
            timeout: 15000,
            success:function (data) 
            {
                
              var response = JSON.parse(data);
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
             
            }
        });


    }
$(document).ready(function()
{
    /*maps.notification();  */
   getNoticount();
   setInterval(function(){ getNoticount(); }, 145000); 
    function getNoticount(){
        
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?notif',
            data: en.code({'mamth':'notif','action':'count'}),
            timeout: 15000,
            success:function (data) 
            {
                
              var obj = JSON.parse(data);
              if(obj.count>0){$("#not_cnt").html(obj.count);
               $("#not_cnt").show();
              }else {$("#not_cnt").hide();}
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
              //  $("#loader").hide();
               // show_error(1);
            }
        });
    }
    var page=1;
    var count=0;
    var ap=0;
   $("#notication_id").on("click",function(){
        
         ap=0;
         page=1;
        $("#ldr").removeClass("NotLdrBtm");
        $("#ldr").addClass("NotLdrTop");
        loadNotiData(page,10,ap);
    });

    
     $('#notif_data').on('scroll', function() {
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-10) {
            page+=1;
            ap=1;
           $("#ldr").addClass("NotLdrBtm");
            $("#ldr").removeClass("NotLdrTop");
           loadNotiData(page,10,ap);

        }
    });
    function loadNotiData(page,perpage,ap){
        $("#ldr").show();
     $.ajax(
        {
            type: 'POST',
            url: 'userAuth?notif',
            data: en.code({'mamth':'notif','page':page,'perpage':perpage}),
            timeout: 15000,
            success:function (data) 
            {
              var obj = JSON.parse(data);
            if(ap==1) {$("#notif_data").append(obj.response);}else {$("#notif_data").html(obj.response); } 
              if(obj.count>0)$("#not_cnt").html(obj.count);
              else $("#not_cnt").hide();
              $("#ldr").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
            }
        });
    }
    

 

/*    $(document).on("click",".review_flag,.pin_flag",function(event)
    {
        var id = $(this).attr('data-user');
        if($(this).text().trim()=="Flagged") {
            show_error("Already Flagged");
            return false;
        }
        $("#loader").show();
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?147',
            data: en.code({'mamth':'M147','eventId':id}),
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                if(decode.response)
                {
                   if(decode.html) $("#error_modal").html("<div id='inner'>"+decode.html+"</div>").show();
                   else $("#error_modal").html(decode.response).show();
                   like_event =1;
                }
                else
                {
                    var string = [];
                    string.push({event:'reviewFlag'});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
                show_error(1);
            }
        });
    });*/
$(document).on("click",".review_flag,.pin_flag",function(event)
    {
        var id = $(this).attr('data-user');
        var flagged=$(this).attr('alt');
        if($(this).text().trim()=="Flagged" || flagged>=1 ) {
            show_error("Already Flagged");
            return false;
        }
        $("#loader").show();
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?147',
            data: en.code({'mamth':'M147','eventId':id}),
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                if(decode.response)
                {
                   if(decode.html) $("#error_modal").html("<div id='inner'>"+decode.html+"</div>").show();
                   else $("#error_modal").html(decode.response).show();
                   like_event =1;
                }
                else
                {
                    var string = [];
                    string.push({event:'reviewFlag'});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
                show_error(1);
            }
        });
    });

$(document).on("click",".pin_like_new",function(event)
{
         $(".pin_like_new").css('pointer-events','none');
        var id = $(this).attr('data-like');  
        lk_cnt=$(this).attr('alt'); 
        var img=$( "a[data-like*='"+id+"']" ).html();
        var like_ct=img.match(">(.*)Helpful");
        var like_no=parseInt(lk_cnt);
        var like_sts=1,like_mg='ic_poi_action_like';
        if(img.indexOf('action_like')>=1)
        {
            like_sts=0;like_mg='ic_poi_action_dislike';
            like_no=like_no-1;
        }
        else
        {
            like_no=like_no+1;
        }
        if(like_no<0)like_no=0;
        if(glblll==1)
        {
             like_no=like_no-1;
        }
       else {
           like_no=like_no;
         }
        $(this).attr("alt",like_no); 
        $("#likes_"+id).attr("alt",like_no);
        var like_txt="<img src='images/place/"+like_mg+".png'> Helpful";
        if(like_no==1) like_txt="<img src='images/place/"+like_mg+".png'>  Helpful";
        else if(like_no>1) like_txt="<img src='images/place/"+like_mg+".png'>  Helpful";
        if(!$('.review-action-sec').attr('data-user')) $( "a[data-like*='"+id+"']" ).fadeOut(200).fadeIn(200);
        
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?mlike',
            data: en.code({'mamth':'MLIKE','eventId':id,"status":like_sts}),
            timeout: 15000,
            success:function (data) 
            {
                var decode="";try{ decode=JSON.parse(data);
                if(decode.response)
                {

                    $(".pin_like_new").css('pointer-events','');
                   /* $("#cnt_"+id).html(like_no+" people found this useful");
                    if(like_no!=0) $("#lk_"+id).show();
                    setTimeout(function(){
                        if(like_no==0) $("#lk_"+id).hide();
                    },10);*/
                    
                    if(decode.html==201) 
                     {
                        glblll==0;
                         //$(this).attr("alt",like_no);
                         //$("#likes_"+id).attr("alt",like_no);
                       $("#cnt_"+id).html(like_no+" people found this useful");
                    if(like_no!=0) $("#lk_"+id).show();
                    setTimeout(function(){
                        if(like_no==0) $("#lk_"+id).hide();
                    },10);
                     $( "a[data-like*='"+id+"']" ).html(like_txt);
                     }
                    else {
                     $('#error_modal').html(decode.response).show();
                    like_event=0;
                    }
                    if($('.review-action-sec').attr('data-user')) {
                    profile_dtt($('.review-action-sec').attr('data-user'));}
                    else {like_event =1;}
                    
                }
                else
                {
                    var string = [];
                    string.push({event:'addToList'});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                }catch(e){show_error(1);}
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                show_error(1);
            }
        });
    });

/*$(document).on("click",".pin_like",function(event)
{
        var id = $(this).attr('data-like');   
        var img=$( "a[data-like*='"+id+"']" ).html();
        var like_ct=img.match(">(.*)Helpful");
        console.log(img);
        var like_no=parseInt(like_ct[1]);
        if(!like_no)like_no=0;
        var like_sts=1,like_mg='ic_poi_action_like';
        if(img.indexOf('action_like')>=1)
        {
            like_sts=0;like_mg='ic_poi_action_dislike';
            like_no=like_no-1;
        }
        else
        {
            like_no=like_no+1;
        }
        var like_txt="<img src='images/place/"+like_mg+".png'> Helpful";
        if(like_no==1) like_txt="<img src='images/place/"+like_mg+".png'>  Helpful";
        else if(like_no>1) like_txt="<img src='images/place/"+like_mg+".png'>  Helpful";
        if(!$('.review-action-sec').attr('data-user')) $( "a[data-like*='"+id+"']" ).fadeOut(200).fadeIn(200);
        
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?mlike',
            data: en.code({'mamth':'MLIKE','eventId':id,"status":like_sts}),
            timeout: 15000,
            success:function (data) 
            {
                var decode="";try{ decode=JSON.parse(data);
                if(decode.response)
                {
                    if(decode.html==201) $( "a[data-like*='"+id+"']" ).html(like_txt);
                    else $('#error_modal').html(decode.response).show();
                    like_event=0;
                    if($('.review-action-sec').attr('data-user')) profile_dtt($('.review-action-sec').attr('data-user'));
                    else like_event =1;
                   
                }
                else
                {
                    var string = [];
                    string.push({event:'addToList'});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                }catch(e){show_error(1);}
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                show_error(1);
            }
        });
    });*/
/*$(document).on("click",".pin_like",function(event)
{
        var id = $(this).attr('data-like');   
        var img=$( "a[data-like*='"+id+"']" ).html();
        var like_ct=img.match(">(.*)Like");
        var like_no=parseInt(like_ct[1]);
        if(!like_no)like_no=0;
        var like_sts=1,like_mg='ic_poi_action_like';
        if(img.indexOf('action_like')>=1)
        {
            like_sts=0;like_mg='ic_poi_action_dislike';
            like_no=like_no-1;
        }
        else
        {
            like_no=like_no+1;
        }
        var like_txt="<img src='images/place/"+like_mg+".png'> Like";
        if(like_no==1) like_txt="<img src='images/place/"+like_mg+".png'> 1 Like";
        else if(like_no>1) like_txt="<img src='images/place/"+like_mg+".png'> "+like_no+" Likes";
        if(!$('.review-action-sec').attr('data-user')) $( "a[data-like*='"+id+"']" ).fadeOut(200).fadeIn(200);
        
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?mlike',
            data: en.code({'mamth':'MLIKE','eventId':id,"status":like_sts}),
            timeout: 15000,
            success:function (data) 
            {
                var decode="";try{ decode=JSON.parse(data);
                if(decode.response)
                {
                    if(decode.html==201) $( "a[data-like*='"+id+"']" ).html(like_txt);
                    else $('#error_modal').html(decode.response).show();
                    like_event=0;
                    if($('.review-action-sec').attr('data-user')) profile_dtt($('.review-action-sec').attr('data-user'));
                    else like_event =1;
                    console.log($('.review-action-sec').html());
                }
                else
                {
                    var string = [];
                    string.push({event:'addToList'});
                    localStorage.setItem('event', JSON.stringify(string));
                    $("#signin").trigger("click");
                }
                }catch(e){show_error(1);}
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                show_error(1);
            }
        });
    });*/
    $('body').on("click","#signin,#signup",function(event)
    { 
        var clickEvent = $(this).attr('id');
        try{storedEvent = localStorage.getItem("event");}catch(e){}
        loginDv($(this).attr('id'));
        event.preventDefault();
    });
    
    $(document).on("click","#signout",function(event)
    {
        $.post('userAuth', {'mamth':'M105'}, function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response == true)
            {
        uname='',forceL=false;
        home_work=[];
                maps.login_dv(decode.html); pushy('hide');
                $($('#signin').children()[0]).hide();
                $('.side-bar-scroll').each(function () 
                {
                    this.style.setProperty( 'height', 'calc(100vh - 100px)', 'important' );
                });
                notify("You are now logged out!");
                $("#notication_id").hide();
                call_url('','.');home();
            }
            $("#g_saves_new").hide();
            $("#my-fav-route").html('<i class="fa fa-heart-o" aria-hidden="true"></i> <span>Save</span>');
            $("#my-fav").html('<i class="fa fa-heart-o" aria-hidden="true"></i> <span>Save</span>');
        });
        event.preventDefault();
    });

  $(document).on("change", "#profile-pic", function(event)
    { 
        var error = false;
        var totalFileSize = 0;
        var thisInput = this;
        var form = $('#edit-profile-pic-form')[0];
        if(!window.File && window.FileReader && window.FileList && window.Blob)
        { 
            show_error("Your browser does not support new File API! Please upgrade.");
        }
        else
        {
            var totalSelectedFiles = form.elements['image[]'].files.length;
            if(totalSelectedFiles > totalFilesAllowed)
            {
                show_error( "You have selected "+totalSelectedFiles+" file(s), " + totalFilesAllowed +" is maximum!");
                error = false;
            }

            $(form.elements['image[]'].files).each(function(i, ifile)
            {
                if(ifile.value !== "")
                {
                    if(allowedFileTypes.indexOf(ifile.type) === -1)
                    { 
                        show_error( "<b>"+ ifile.name + "</b> is unsupported file type!");
                        error = true;
                    }
                    totalFileSize = totalFileSize + ifile.size;
                }
            });

            if(totalFileSize > maxSize)
            { 
                show_error( "You have "+totalSelectedFiles+" file(s) with total size "+bytes_to_size(totalFileSize)+", Allowed size is " + bytes_to_size(maxSize) +", Try smaller file!");
                error = true;
            }

            if(!error)
            {
                if( xhr != null ) 
                {
                    xhr.abort();
                    xhr = null;
                }
                
                $('#loader').show();
                var formData = new FormData();
                var url = $(form).attr("action");
        
                xhr = $.ajax(
                {
                    url : url,
                    type: "POST",
                    data : formData,
                    contentType: false,
                    cache: false,
                    processData:false,
                    mimeType:"multipart/form-data",
                    success:function (data) 
                    {
                        var decode = JSON.parse(data);
                        if(decode.response.response == 201)
                        {
                            var heading = 'Your profile picture was successfully updated';
                            /*var message = ''; 
                            var type = 'green_bg';*/
                            notify(heading);
                            var reader = new FileReader();
                            reader.onload = function (e) 
                            {
                                $('#large-profile-pic').attr('src', e.target.result);
                                $('#small-profile-pic').attr('src', e.target.result);
                                $('#side-profile-pic').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(thisInput.files[0]);
                        }
                        else
                        {
                            show_error(1);
                        }
                        $("#loader").hide();
                        xhr = null;
                    },
                });
            }
        }
        event.preventDefault();
    });

    

    $(document).on("submit", "#forgot-password-form", function(event)
    {
        var error = false;
        var formData = $(this).serializeArray();
        formData.push({name: 'mamth', value: 'M106'});
        if(formData[0].value.length < 1)
        {
            show_error('Please enter your username or email.');
            error = true;
        }

        if(!error)
        {
            if( xhr != null ) 
            {
                xhr.abort();
                xhr = null;
            }

            $('#loader').show();
            pushy('hide');
            xhr = $.ajax(
            {
                type: 'POST',
                url: 'userAuth',
                data: formData,
                success:function (data) 
                {
                    var decode = JSON.parse(data);
                    if(decode.response.response == 200)
                    {
                        var heading = decode.response.message;
                        var message = 'Please enter the OTP to activate your account'; 
                        var type = 'green_bg';
            $(".otp_send").attr('data-id', decode.response.data.user_id);
                        $("#forgot-password-form").hide();
                        $(".otp_send").show();
                    }
                    else if(decode.response.response == 411)
                    {   
                        var heading = 'Email does not exist';
                        var message = 'Please enter a valid email'; 
                        var type = 'note_bg';
                        show_error(message,heading,type);
                    }
                    else if(decode.response == false)
                    {
                        if(decode.errors)
                        {
                            show_error(decode.errors);
                        }
                    }
                    else
                    {
                        show_error('1');
                    }
                    $("#loader").hide();
                    xhr = null;
                },
            });
        }
        event.preventDefault();
    });


    $(document).on("submit", "#forgot-otp-form", function(event)
    {
        var error = false;
        var formData = $(this).serializeArray();
        if(formData[0].value.length < 0)
        {
            show_error('Please enter OTP.');
            error = true;
        }
        var Id = $(".otp_send").attr('data-id');
        formData.push({name: 'mamth', value: 'verifyUser'}, {name: 'type', value: 'resetpassword'}, {name: 'id', value: Id}, {name: 'otp', value: formData[0].value});
        
        if(!error)
        {
            if( xhr != null )
            {
                xhr.abort();
                xhr = null;
            }

            $('#loader').show();
            pushy('hide');
            xhr = $.ajax(
            {
                type: 'POST',
                url: 'userAuth',
                data: formData,
                success:function (data) 
                {
                    var decode = JSON.parse(data);
                    if(decode.response == 200)
                    {
                        $(".otp_send").hide();   
                        $("#make_new_pass").show();
                    }
                    else if(decode.response == 411)
                    {   
                        var heading = 'Email does not exist';
                        var message = 'Please enter a valid email'; 
                        var type = 'note_bg';
                        show_error(message,heading,type);
                    }
                    else if(decode.response == false)
                    {
                        if(decode.errors)
                        {
                            show_error(decode.errors);
                        }
                    }
                    else
                    {
                        show_error('1');
                    }
                    $("#loader").hide();
                    xhr = null;
                },
            });
        }
        event.preventDefault();
    });

    $(document).on("submit", "#reset-password-form", function(event)
    {
        var error = false;
        var formData = $(this).serializeArray();
        var Id = $("#otp_id").attr("data-id");

        if((formData[0].value.length < 0) && Id)
        {
            show_error('Please enter New Password.');
            error = true;
        }
        if(!pwdExp.test(formData[0].value) || formData[0].value.length < 6)
        {
            $("input:password[name=new-password]").siblings(".error-input-text").html("Please enter New Password");
            $("input:password[name=new-password]").parent().addClass("error-field");
            /*show_error("New Password cannot be less than 6 characters and cannot contain spaces.");*/
            error = true;
        }
        if((formData[1].value.length < 0) && Id)
        {
            $("input:password[name=new-password]").siblings(".error-input-text").html("Please enter Confirm Password.");
            $("input:password[name=new-password]").parent().addClass("error-field");
            /*show_error('Please enter Confirm Password.');*/
            error = true;
        }
        if(formData[0].value != formData[1].value)
        {
            $("input:password[name=new-password]").siblings(".error-input-text").html("New password and Confirm password does not match.");
            $("input:password[name=new-password]").parent().addClass("error-field");
            /*show_error('New password and Confirm password does not match.');*/
            error = true;
        }
        formData.push({name: 'mamth', value: 'M107'}, {name: 'id', value: Id}, {name: 'passkey', value: MD5(formData[0].value)});
        formData.splice(0,2);
        if(!error)
        {
            if( xhr != null )
            {
                xhr.abort();
                xhr = null;
            }

            $('#loader').show();
            pushy('hide');
            xhr = $.ajax(
            {
                type: 'POST',
                url: 'userAuth',
                data: formData,
                success:function (data) 
                {
                    var decode = JSON.parse(data);
                    if(decode.response.statusCode == 200)
                    { 
                        $('.stepper-main-forgot-sec').hide();
                        $('.forgot_sucess').show();
                    }
                    else if(decode.response.statusCode == 400)
                    { 
                        var heading = 'Notification';
                        var message = decode.response.errors[0].displayMessage; 
                        var type = 'note_bg';
                        show_error(message,heading,type);
                    }
                    else if(decode.response.statusCode != 400 || decode.response.statusCode != 200)
                    { 
                        var heading = 'Error';
                        var message = 'Please Try Again Something Went wrong'; 
                        var type = 'note_bg';
                        show_error(message,heading,type);
                    }
                    else if(decode.response.response == 411)
                    {   
                        var heading = 'Please Try Again Something Went wrong';
                        var message = decode.response.message; 
                        var type = 'note_bg';
                        show_error(message,heading,type);
                    }
                    else if(decode.response == false)
                    {
                        if(decode.errors)
                        {
                            show_error(decode.errors);
                        }
                    }
                    else
                    {
                        show_error('1');
                    }
                    $("#loader").hide();
                    xhr = null;
                },
            });
        }
        event.preventDefault();
    });

    $(document).on("click", ".resend", function(event)
    {
        $('#loader').show();
        $('#error_modal').hide().html('');
        $.post("userAuth", {"mamth":"M125"}, function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response.response == '201')
            {
                var heading = 'Just one more step';
                var message = 'A new activation email has been sent to your email, Follow the instructions in the email to activate your account'; 
                var type = 'green_bg';
                show_error(message,heading,type);
            }
            $('#loader').hide();
        });
        event.preventDefault();
    });

    $(document).on("submit", "#violation-form", function(event)
    {
        var error = false;
        var formData = $(this).serializeArray();
        var eid=$("input[name=event-id]").val();
        var c=$("#"+eid).attr("flg");
        if(c=='') c=0;
        formData.push({name: 'mamth', value: 'M148'});
        if(!$("#policy-violation").val())
        {
            show_error("Please select a violation type from dropdown.");
            error = true;
        }
        if(!error)
        {
            if( xhr != null ) 
            {
                xhr.abort();
                xhr = null;
            }

            $('#loader').show();
            xhr = $.ajax(
            {
                type: 'POST',
                url: 'userAuth',
                data: formData,
                success:function (data) 
                {
                    var decode = JSON.parse(data);
                    if(decode.response.statusCode == '201' || decode.response.statusCode == '200')
                    {
                        $("#fade_layer").hide();
                        var heading = 'Thank you';
                        var message = 'Your content abuse review has been registered'; 
                        var type = 'green_bg';
                          c=parseInt(c)+1;
                        $("#"+eid).attr('flg',c);
                         $("#"+eid).attr('alt',c);
                        $( "a[data-user*='"+eid+"']" ).html("<img src='images/place/ic_poi_flag_small.png'> "+c+" Flag"); $(".show_modal").hide();
        //                $( "a[data-user*='"+eid+"']" ).html("<img src='images/place/ic_poi_flag_small.png'> Flagged"); $(".show_modal").hide();
                       notify(message,heading,type);
                    }
                    else if(decode.response.response == '419')
                    {
                        show_error(decode.response.message);
                    }
                    else if(decode.response == false)
                    {
                        if(decode.errors)
                        {
                            show_error(decode.errors);
                        }
                    }
                    else if(decode.response.response == '419')
                    {
                            show_error(decode.response.message);
                    }
                    else
                    {
                        show_error(1);
                    }
                    $("#loader").hide();
                    xhr = null;
                },
            });
        }
        event.preventDefault();
    });

    $(document).on("click", "#add-save,#add-list,#add-route,#add-review,#add-report", function()
    {
        var split = $(this).attr('id').split('-');
        switch(split[1]) 
        {
            case 'save':
                show_error('Please search a place to add it to my save.');
                break;
            case 'list':
                show_error('Please search a place to add it to my list.');
                break;
            case 'route':
                call_url('','direction');newdr.driving_box('');
                pushy('hide');
                show_error('Please search a route to add it to my route.');
                break;
            case 'review':
                show_error('Please search a place to add it to my review.');
                break;
            case 'report':
                show_error('Please search a place to add it to my report.');
                break;
        }
    });    

    $(document).on("focus", ".input__field", function()
    {
        $(this).next().children().addClass("read_only_label");
    });

    $(document).on("focusout", ".input__field", function()
    {
        if(!$(this).val())
        {
            $(this).next().children().removeClass("read_only_label");
        }
    });

    $(document).on("change", "#review_browse,#report_browse,#been_browse,#place_browse", function(event)
    {
        if($(this).attr('id') == 'review_browse')
        {
            var actionType = 'review';
            var fileType = 'review';
        }
        else if($(this).attr('id') == 'report_browse')
        {
            var actionType = 'report';   
            var fileType = 'report';  
        }
        else if($(this).attr('id') == 'been_browse')
        {
            var actionType = 'been';   
            var fileType = 'pin'
        }
        else if($(this).attr('id') == 'place_browse')
        {
            var actionType = 'place';   
            var fileType = 'place'
        }        
        var totalSelectedFiles = $('#'+actionType+'-form')[0].elements[fileType+'file[]'].files.length;
        var files =  (totalSelectedFiles > 1) ? ' files selected' : ' file selected';
        $('#'+actionType+'_add_img').text(totalSelectedFiles+files);
        event.preventDefault();
    });

    $(document).on("change", "#uaddplace_browse", function(event)
    {
        var totalSelectedFiles = $('#uapform')[0].elements['addplaceImage[]'].files.length;
        var files =  (totalSelectedFiles > 1) ? ' files selected' : ' file selected';   
        $('#uaplace_add_img').text(totalSelectedFiles+files);
        event.preventDefault();
    });

    $(document).on("change", "#edtplace_browse", function(event)
    {
        var totalSelectedFiles = $('#uedtplcform')[0].elements['edtplaceImage[]'].files.length;
        var files =  (totalSelectedFiles > 1) ? ' files selected' : ' file selected';
        
        $('#edtplace_add_img').text(totalSelectedFiles+files);
        event.preventDefault();
    });

    $(document).on("click", "#addImgg", function(event)
    {
        addimageloginchk(function(val)
        {
            if(val=='true')
            {
                var html = 
                '<div class="cropit-overlay-popup" id="change-cropit">'+
                    '<div class="cropit-head">'+
                        '<h2>Add a image</h2>'+
                        '<a href="javascript:void(0)" onclick="$(\'#error_modal\').hide().html(\'\')" class="parent-closebtn" id="add_new_list_close_btn"><i class="ti-close"></i></a>'+
                    '</div>'+
                    '<div class="cropit-change-pic-sec">'+
                        '<form id="place-form">'+
                            '<h2>'+$('.poi-title').text()+'</h2>'+
                            '<span class="input input--hoshi">'+
                                '<div class="add-img-sec">'+   
                                    '<span><i class="fa fa-picture-o"></i></span>'+
                                    '<input multiple="" type="file" id="place_browse" name="placefile[]" accept="image/png,image/gif,image/jpeg" data-user="AddImage">'+
                                    '<input  type="hidden" name="place_eloc" id="place_eloc" value="'+$('#addImgg').attr('data-value')+'">'+
                                    '<a href="javascript:void(0)" id="place_add_img" class="add_images">Add image...</a>'+
                                '</div>'+
                            '</span>'+
                            '<div>'+
                                '<strong><i class="fa fa-info-circle"></i></strong>'+ 
                                '<span style="font-style:italic">Images supported in gif, jpeg, &amp; png formats; Max file size: 2MB.</span>'+
                            '</div>'+
                            '<div class="text-right">'+
                                '<button type="submit" class="btn submit-common m-i-10">Upload</button>'+
                            '</div>'+
                        '</form>'+
                    '</div>'+
                '</div>';
                $('#error_modal').html(html).show().delay(4500);
            }
        });
        event.preventDefault();
    });

    function addimageloginchk(callback)
    {
        $.ajax(
        {
            url: 'userAuth?140',
            type: "POST",
            async:false,
            data:en.code({'mamth':'M140','evt':'addImgg'}),
            success: function(data)
            {
                var decode = JSON.parse(data);
                if(decode.html)
                {
                    return(callback('true'))
                }
                else
                {
                    $('#error_modal').html(decode.response).show();
                  
                }
            }
        });
    }    

    $(document).on("submit", "#place-form", function(event)
    {       
        var error = false;
        var totalFileSize = 0;
        var form = $('#place-form')[0];
        var totalSelectedFiles=0;
        if(!window.File && window.FileReader && window.FileList && window.Blob)
        { 
            show_error("Your browser does not support new File API! Please upgrade.");
            error = true;
        }
        else
        {
            totalSelectedFiles = form.elements['placefile[]'].files.length;
        }

        if(totalSelectedFiles > totalFilesAllowed)
        {
            show_error( "You have selected "+totalSelectedFiles+" files, " + totalFilesAllowed +" is maximum!");
            error = true;
        }
        else if(totalSelectedFiles == 0)
        {
            show_error( "You have not selected any image, please select one");
            error = true;  
        }

        $(form.elements['placefile[]'].files).each(function(i, ifile)
        {
            if(ifile.value !== "")
            {
                if(allowedFileTypes.indexOf(ifile.type) === -1)
                { 
                    show_error( "<b>"+ ifile.name + "</b> is unsupported file type! Accepted Formats: png,jpg,gif");
                    error = true;
                }
                totalFileSize = totalFileSize + ifile.size;
            }
        });
        if(totalFileSize > maxSize)
        { 
            show_error( "You have "+totalSelectedFiles+" files with total size "+bytes_to_size(totalFileSize)+", Allowed size is "+bytes_to_size(maxSize)+", Try smaller file!");
            error = true;
        }
        
        /*var totalSelectedFiles = form.elements['place-form[]'].files.length;
        var files =  (totalSelectedFiles > 1) ? ' files selected' : ' file selected';*/
        
        var place_eloc1 = form.elements['place_eloc'].value;
        if (!error) 
        {
            $('#loader').show();
            var formData = new FormData(form);
            formData.append('place_eloc1',place_eloc1);
            formData.append('mamth','M153');
            if( xhr != null ) 
            {
                xhr.abort();
                xhr = null;
            }
            xhr = $.ajax(
            {
                url : 'userAuth',
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                mimeType:"multipart/form-data",
                success: function(data)
                {
                    var res = JSON.parse(data);
                    
                    if (res.response.response=='201') 
                    {
                        var message = ' Photos will be publicly available in search after approval in sometime'; 
                        var heading='Thanks for the upload';
                        var type = 'green_bg';
                        show_error(message,heading,type);
                    }
                    else if(res.response.error) {show_error(res.response.error);$('#loader').hide();}
                    else
                    {
                        show_error('Data could not be submitted. Please try again');                    
                    }

                    $('#loader').hide();
                }
            });
        }
        event.preventDefault();
    });
  
    /*onclick calls*/
    $(".collapse-map-control").click(function() /*controls*/
    {
        var mydirection = "right";
        $(".expand-map-control").toggle("slide", { direction: mydirection }, 100);
        $(".collapse-map-control").toggleClass("active");
    });

    $(document).on("click",".map-zoom-in",function(event)  
    {
        if(sat_active==1 && map.getZoom()>=17){
            return false;
        } 
        else{
            map.zoomIn(); 
            hondaZoom= map.getZoom();
        }  
    }).on("click",".map-zoom-out",function(event)  
    {
        map.zoomOut();
        hondaZoom= map.getZoom();
    });
    $(document).on( 'keypress', function ( e ) 
    {  
        if(!$("input,textarea").is(":focus")){ 
        if ( e.keyCode === 43 ) 
        {
            map.zoomIn(); 
        }
        else if ( e.keyCode === 45 )  
        {
            map.zoomOut();
        }
    }
    });

    /*$(".dyLayerMap").click(function(){
        maps.set_tile(this.id);
    });*/
    
    $("#menu_traffic").change(function()
    { 
        if($(this).is(":checked")) 
        {
            $("#traffic_show").prop('checked', true);
        } 
        else 
        {
            $("#traffic_show").prop('checked', false); traffic.display(); 
        }
    });

    $(document).on("click","#traffic_control",function(event)  
    {
        /*$("#mapLayerSidePanelMain").removeClass("customPanelMain");*/
        $('#traffic_show').trigger('click');
        if($("#traffic_show").is(':checked')){
           $(this).find('img').attr('src','images/maplayer/ic_toggle_on.png');
           $(this).find('img').attr('class','ic_toggle_on');
        }else{
            $(this).find('img').attr('src','images/maplayer/ic_toggle_off.png');
           $(this).find('img').attr('class','ic_toggle_off');
        }
        traffic.display();
        if(map.hasLayer(trffic_t)) maps.set_current();
        else window.history.replaceState('', '', '');
        return false;
    });
    
    $(document).on("click","#geo_location",function(event)  
    { 
        var url = window.location.toString().split('/');
        var curl = url.slice(-1)[0];
        if(curl.indexOf('direction')==0){
            {$(".aqiHome").hide();}
        }else{
            if($("#haqi").text()!="AQI 15"){$(".aqiHome").show();}
        }

        if($(this).hasClass('active'))
        {
           removeCurrentMarker();
        }
        else
        {
           maps.get_current(0);
        }
    }); 
    
    $(document).on("click","#getCurrent",function(event)  
    { 
        $('#geo_location').trigger('click'); 
    });

   /* $('#clear_auto').click(function()
    {
        home(1);$("#auto").focus();$('.as-results').hide();if(place_d) place_d.abort();
    });*/
    
    $('body').on("click",'#clear_auto_via1',function(){$("#auto_via1").val(''); $('#via1_dirs').val('');$("#as-results-auto_via1").val('');});
    $('body').on("click",'#clear_auto_via2',function(){$("#auto_via2").val('');$('#via2_dirs').val('');$("#as-results-auto_via2").val('');});
    $('body').on("click",'#clear_auto_via3',function(){$("#auto_via3").val('');$('#via3_dirs').val('');$("#as-results-auto_via3").val('');});

    $('body').on("click",'#clear_auto_via1',function()
    {
        $("#auto_via1").val(''); 
        $('#via1_dirs').val('');
        $("#as-results-auto_via1").val('');
    });

    $('body').on("click",'#clear_auto_via2',function()
    {
        $("#auto_via2").val('');
        $('#via2_dirs').val('');
        $("#as-results-auto_via2").val('');
    });
    
    $('body').on("click",'#clear_auto_via3',function()
    {
        $("#auto_via3").val('');
        $('#via3_dirs').val('');
        $("#as-results-auto_via3").val('');
    });
    
    $('#auto_geo').click(function()
    {
        maps.get_geo('auto');
    $("#uap_tap_dv").hide();
    });


    $("#clear_start,#clear_end").click(function()
    {
        var id=this.id.split('_');
        $("#auto_"+id[1]+",#"+id[1]+"_dirs").val('').focus();$('.as-results,#res_info').hide();
        
        if($("#auto_via1,#auto_via2,#auto_via3").length == 1 && id[1] == 'end') 
        {
            var via_txt = $('#auto_via1').val();var via_val = $('#via1_dirs').val();
            $('#auto_end').val(via_txt).blur();$('#end_dirs').val(via_val);$("#auto_via1-via1_dirs").remove();newdr.get_routes();
        }
        else if($("#auto_via1,#auto_via2,#auto_via3").length == 2 && id[1] == 'end') 
        {
            var via_txt = $('#auto_via2').val();var via_val = $('#via2_dirs').val();
            $('#auto_end').val(via_txt).blur();$('#end_dirs').val(via_val);$("#auto_via2-via2_dirs").remove();newdr.get_routes();
        }
        else if($("#auto_via1,#auto_via2,#auto_via3").length == 3 && id[1] == 'end') 
        {
            var via_txt = $('#auto_via3').val();var via_val = $('#via3_dirs').val();
            $('#auto_end').val(via_txt).blur();$('#end_dirs').val(via_val);$("#auto_via3-via3_dirs").remove();newdr.get_routes();
        }
        else {
        if(trafi_route) trafi_route.abort();if(route_url) route_url.abort();}
        if(along_marker_group) map.removeLayer(along_marker_group);
        if(leaflet_polyline) map.removeLayer(leaflet_polyline);
        if(path_dir) map.removeLayer(path_dir);
        if(path_dir_alt) map.removeLayer(path_dir_alt);
        if(path_dir_alt1) map.removeLayer(path_dir_alt1);
        if(leaflet_congestion[0])map.removeLayer(leaflet_congestion[0]);
        if(leaflet_congestion[1])map.removeLayer(leaflet_congestion[1]);
        if(leaflet_congestion[2])map.removeLayer(leaflet_congestion[2]);
        var h_txt='end_dirs',r_mrk=from_marker;if(id[1]=='end') {h_txt='start_dirs';r_mrk=to_marker;} var h_val=$('#'+h_txt).val().split(',');
        if(h_val[0] && (to_marker || from_marker)) {map.panTo([h_val[1],h_val[0]], {animate: true, duration: 1.0});}
        call_url('Driving Direction','direction');map.removeLayer(r_mrk);
        $('#'+this.id).css({"background":"","background-size":"20px"});
    });
    
    $("#get_d").click(function()
    {
    if(!$('#auto_start').val()) $("#error").html('Start location is required').show().delay(4500).fadeOut();
        if(!$('#auto_end').val()) $("#error").html('Destination location is required').show().delay(4500).fadeOut();
        else if($("#auto_via1").length && (!$("#via1_dirs").val() ||!$("#auto_via1").val())) $("#auto_via1").focus();
        else if($("#auto_via2").length && (!$("#via2_dirs").val() ||!$("#auto_via2").val())) $("#auto_via2").focus();
        else if($("#auto_via3").length && (!$("#via3_dirs").val() ||!$("#auto_via3").val())) $("#auto_via3").focus();
        else
        {
           pop_state=0; newdr.get_routes();
        }
    });
    
    $(document).on("click", "#dir_tab", function(event){
        if($(this).hasClass("active")) return false;
        if(place_d) place_d.abort();
        call_url('Get map direction by MapmyIndia','direction');
        newdr.driving_box('');
        if(leaflet_polyline) map.removeLayer(leaflet_polyline);
        leaflet_rt=[],leaflet_group=[],leaflet_sum=[];
        $('.main-page').css('overflow-y','visible');
        $('.reportTrig').hide();
    });

    $("#dir_menu").click(function()
    {
        call_url('','direction');
        newdr.driving_box('');
        pushy('hide');
    });

    
    $('body').on("click","#route_time span",function() /*advise back*/
    { 
        $("#step_by").hide();
        $('#all_route').show();
        if($("#route_dist").html().indexOf('Route ')==-1) 
        {
            $("#route_time").html('<span>ETA</span><h2>'+newdr.alt_strTim+'</h2>');
        }
        else 
        {
            $("#route_time").html('<span>ETA</span><h2>'+newdr.strTim+'</h2>');  
        }
        if(mark) map.removeLayer(mark); 
    });    
    $('body').on("click","#adv_back",function(event)  /*advise back*/
    { 
        if(mark)  map.removeLayer(mark);
        if(along_marker_group) map.removeLayer(along_marker_group);
        var sltn=$("#start_dirs").val().split(',');
        var eltn=$("#end_dirs").val().split(',');
        map.fitBounds([[sltn[1],sltn[0]],[eltn[1],eltn[0]]],{paddingTopLeft: [100, 100],paddingBottomRight:[50,10]}); 
    });

    $("#read_review_show").click(function()
    {
        $("#read_review_modal").show(); 
    }); 
    $("#write_review_show").click(function()
    {
        $("#read_review_modal").hide();
        $("#write_review_modal").show();
    }); 
    $("#read_review_close").click(function()
    {
        $("#read_review_modal").css("display","none"); 
    }); 
    $("#write_review_close").click(function()
    {
        $("#write_review_modal").css("display","none");
    });
    $('body').on("click","#lb-popup",function(event)  
    {
        $("#lb-control").show();  
    });
});
var last_click="";
$(document).on("click","a",function(ev)  
{
      var id=$(this).attr('id');if(!id) id=$(this).attr('class');
      if(id!=undefined) last_click=id;
});
$(document).keydown(function(e){if (e.keyCode === 27){$('.as-results,.infoTextLayer,.infoText').hide(100);$("#lb-control").fadeOut('slow');}});
$('body').on("click",".search-title",function(event)  {$(".set_height").toggleClass("showlist");    }); 
$(".layer-item-wrap").click(function(){$(".ft-layer-link").toggle();}); 
$(document).on("mouseover", ".direction-append-item" , function() { var ival= $(this).find("input").val();if(ival) $(this).draggable({revert:true,revertDuration: 0}).find(".direction-suffle").show(); $( this).droppable({
      drop: function( event, ui ) {
        var target_id=event.target.id;
        if(!drag_id) return false;
        var drag_arr=drag_id.split('-');
        var target_arr=target_id.split('-');
        var drag_val=$('#'+drag_arr[0]).val();
        var target_val=$('#'+target_arr[0]).val();
        $('#'+target_arr[0]).val(drag_val);$('#'+drag_arr[0]).val(target_val);
        var drag_cord=$('#'+drag_arr[1]).val();
        var target_cord=$('#'+target_arr[1]).val();
        $('#'+target_arr[1]).val(drag_cord);$('#'+drag_arr[1]).val('').val(target_cord);
        drag_id=0;
        if(path_dir_alt) newdr.get_routes();
      }
    });});/*drag */
 $(document).on("mouseleave", ".direction-append-item" , function() { $(this).find(".direction-suffle").hide();});
 $( function() {
 
});

/****finishes****/
$(document).on( 'keydown', function ( e ) 
{ 
    if ( e.keyCode === 27 ) 
    {  
        $('#fade_layer' ).hide(200);/*escape*/
        pushy('hide');$(".ft-layer-link").hide();$('#z-popup').hide();
        if($("#loader").is(":visible"))
        { 
            $("#loader").hide();if(req) req.abort();if(route_url) route_url.abort();
        } 
        /*$('#error_modal').hide();*/
    }
});

$(document).ajaxError(function (e, jqXHR, ajaxSettings, thrownError) 
{ 
    if(jqXHR.statusText=='error' && jqXHR.status === 0 ){notify('INTERNET_DISCONNECTED');return}
    if (jqXHR.status === 0 || jqXHR.readyState === 0 ) return
    auto_load('x');
    send_err(thrownError+ajaxSettings.url);
});
window.onerror = function(messageNew, url, lineNumber) 
{ 
    if(messageNew.indexOf('t.originalEvent') === -1)
    {
        send_err(messageNew, url, lineNumber);
    }
}; 
send_err=function(messageNew, url, lineNumber)
{
        var Err = messageNew+"("+url+")["+lineNumber+"]-"+window.location.toString().split("/").slice(-1)[0];   
        $.post("err_mess", {Err: Err}, function(result){  });
        $("#loader").hide();$('input').css({"background":"","background-size":"20px"});$("#loader").hide();
}
$(document).on("click", "#change_user_photo", function(event)
{
    event.preventDefault();
    $("#profile-pic:hidden").trigger("click");return false;
});

$(document).on("click", "#been_add_img,#review_add_img,#report_add_img,#place_add_img", function(event)
{
    if($(this).attr('id') == 'been_add_img')
    {
        var browseEvent = 'been';
    }
    else if($(this).attr('id') == 'review_add_img')
    {
        var browseEvent = 'review';
    }
    else if($(this).attr('id') == 'report_add_img')
    {
        var browseEvent = 'report';
    }
    else if($(this).attr('id') == 'place_add_img')
    {
        var browseEvent = 'place';
    }
    $('#'+browseEvent+'_browse').click();
    event.preventDefault();
});


$(document).on("click", ".cls-pop", function(event)
{
    $('#error_modal').hide().html('');
    $('#z-popup').hide().html('');
    var urlContent = breakUrl();
    if(urlContent.length > 1)
    { 
        if(urlContent[1].indexOf("WRz") !== -1 || urlContent[1].indexOf("wrz") !== -1 || urlContent[1].indexOf("RRz") !== -1 || urlContent[1].indexOf("rrz") !== -1)
        {
            var secondPart = urlContent[1].replace(/RRzdata|rrzdata|wrzdata|WRzdata/g,'zdata');
            window.history.replaceState('', '', urlContent[0]+'@'+secondPart);
        }
        else if(urlContent[0]=='report') history.go(-1);
    }
    if($(this).hasClass('eloc-close')){setCookie('popupState','shown',365);}
    event.preventDefault();
});

$(document).on("click", "#fscrn_dv", function(event)
{
    document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreen && !document.webkitIsFullScreen ? document.documentElement.requestFullScreen ? document.documentElement.requestFullScreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullScreen && document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen()
    if(document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen) {$("#fscrn_dv div a img").attr("src","images/ic_fullscreen.png");$("#fscrn_dv div a").attr("title","Fullscreen");}
    else {$("#fscrn_dv div a img").attr("src","images/ic_fullscreen_exit.png");$("#fscrn_dv div a").attr("title","Exit Fullscreen");}
});
function fullscrn(id,triggerId)
{
  if(id)
  {  
        var elem = document.getElementById(id),cls=elem.className;
        if(cls.indexOf("fullscrn")==-1)
        {
            if (elem.requestFullscreen) {elem.requestFullscreen();} else if (elem.mozRequestFullScreen) { /* Fx */
              elem.mozRequestFullScreen();} else if (elem.webkitRequestFullscreen) { /* Crm, Sfari & Opera */
              elem.webkitRequestFullscreen();} else if (elem.msRequestFullscreen) { /* IE/Edge */ elem.msRequestFullscreen();}
              elem.classList.add("fullscrn");
        }
        else
        {    if (document.exitFullscreen) {document.exitFullscreen();} else if (document.mozCancelFullScreen) { 
                document.mozCancelFullScreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen();} else if (document.msExitFullscreen) {
                document.msExitFullscreen();}         elem.classList.remove("fullscrn");
        }
  }
}
$(document).keydown(function (e) {
     if(e.key == "F11") {e.preventDefault()};
});                                                                                        
var last_s="";
$('#tml_dt').keydown(function (e) {
    last_s=this.value;return false;
}).keyup(function(){if(last_s!=this.value) this.value=last_s;});  

function adv_route()
{
    if(mark)  map.removeLayer(mark);
    if(along_marker_group) map.removeLayer(along_marker_group);
    var sltn=$("#start_dirs").val().split(',');
    var eltn=$("#end_dirs").val().split(',');
    map.fitBounds([[sltn[1],sltn[0]],[eltn[1],eltn[0]]],{paddingTopLeft: [100, 100],paddingBottomRight:[50,10]}); 
} 

function getAlarmTypeStr(alarmLogObj)
{
    var arrAlarmConf = [];
    var image = '';
    var data = data;
    var description = "-";
    
    if (alarmLogObj != null && alarmLogObj!= '' && alarmLogObj!= 'undefined'){
       if(alarmLogObj== '21'){
            if(alarmLogObj.data == '1'){
                description = "Ignition ON";
                image = 'ic_alarms_ignition_on';
            }else{
                description = "Ignition OFF";
                image = 'ic_alarms_ignition_off';
            }
        }else if(alarmLogObj== '22'){
            var actualLimitStr = "-";
        var     actualLimit = alarmLogObj.actualLimit;
            if(actualLimit != null && actualLimit != '' && actualLimit != 'undefined'){
                actualLimitStr = actualLimit;
            }
            var limitStr = "-";
            var limit = alarmLogObj.limit;
        if(limit != null && limit != '' && limit != 'undefined'){
            limitStr = limit;
        }

            description = "Overspeeding";
            image = 'ic_alarm_over_speeding';
        }else if(alarmLogObj== '23'){
            description = "Device Unplugged";
            image = 'ic_alarms_device_unplugged';
        }else if(alarmLogObj== '24'){
            description = "SOS event has generated";
        }else if(alarmLogObj== '25'){
            if(alarmLogObj.data == '1'){
                description = "AC turned ON.";
            }else{
                description = "AC turned OFF.";
            }
        }else if(alarmLogObj== '26'){
            if(alarmLogObj.data === 2){
                 description = "Vehicle entering geofence (<b>" + alarmLogObj.geofenceName + "</b>)";
                 image = 'ic_alarms_geofence_enter';
             }else if(alarmLogObj.data === 3){
                 description = "Vehicle leaving geofence (<b>" + alarmLogObj.geofenceName + "</b>)";
                 image = 'ic_alarms_geofence_exit';
             }else if(alarmLogObj.data === 4){
                 description = "Vehicle having long stay in geofence (<b>" + alarmlogsdata.geofenceName + "</b>)";
             }
        }else if(alarmLogObj== '27'){
            description = "Stoppage";
            image = 'ic_alarm_stopage';
        }else if(alarmLogObj== '28'){
            var actualDuration = alarmLogObj.actualDuration;
            var duration = alarmLogObj.duration;
            description = " Idling";
            image = 'ic_alarms_idling';
        }else if(alarmLogObj== '29'){
            description = "Towing enabled.";
        }else if(alarmLogObj== '30'){
            if(alarmLogObj.data == '1'){
                description = "Female dropped alone";
            }else{
                description = "Female picked alone";    
            }
        }else if(alarmLogObj== '31'){
            description = "Job Delay enabled";
        }else if(alarmLogObj== '32'){
            if(alarmLogObj.data === 2){
                 description = "Door Opened.";
             }else if(alarmLogObj.data === 3){
                 description = "Door Closed.";
             }
        }else if(alarmLogObj== '33'){
            description = "Device Power Low";
        }else if(alarmLogObj== '34'){
            description = "Temprature enabled";
        }else if(alarmLogObj== '35'){
            description = "Route Close.";
        }else if(alarmLogObj== '36'){
            description = "Forcefully Close";
        }else if(alarmLogObj== '37'){
            description = "Speed And Idling";
        }else if(alarmLogObj== '38'){
            description = "Service";
        }else if(alarmLogObj== '39'){
            description = "Insurance";
        }else if(alarmLogObj== '40'){
            description = "Registration";
        }else if(alarmLogObj== '41'){
            description = "Pollution";
        }else if(alarmLogObj== '42'){
            if (alarmLogObj.data == '1'){
                description = "Pickup  incompleted late";
            }else{
                description = "Drop  incompleted late"; 
            }
        }else if(alarmLogObj== '43'){
            description = "Immobilization";
        }else if(alarmLogObj== '44'){
            description = "Immobilization Shorting";
        }else if(alarmLogObj== '45'){
            description = "Crash";
        }else if(alarmLogObj== '46'){
            description = "OBD Unplugged";
        }else if(alarmLogObj== '47'){
            description = "Route Start";
        }else if(alarmLogObj== '48'){
            description = "Stop point";
        }else if(alarmLogObj== '49'){
            description = "Route End";
        }else if(alarmLogObj== '50'){
            description = "Idea Alarm Switch Off";
        }else if(alarmLogObj== '121'){
            description = "Idea Alarm Location Not Avail";
        }else if(alarmLogObj== '122'){
            description = "Long Halt";
        }else if(alarmLogObj== '123'){
            description = "Atapah";
        }else if(alarmLogObj== '124'){
            description = "Access Card";
        }else if(alarmLogObj== '125'){
            description = "Device Temper";
        }else if(alarmLogObj== '126'){
            description = "GPRS Connectivity";
        }else if(alarmLogObj== '127'){
            description = "Green Driving";
        }else if(alarmLogObj== '128'){
            description = "Tyre Rotation";
        }else if(alarmLogObj== '129'){
            description = "Battery Low";
            image = 'ic_alarm_low_battery';
        }else if(alarmLogObj== '131'){
            description = "Fuel Theft (BETA)";
        }else if(alarmLogObj== '132'){
            description = "Continuos Driving";
        }else if(alarmLogObj== '133'){
            description = "Mileage";
        }else if(alarmLogObj== '134'){
            description = "Driving";
        }else if(alarmLogObj== '135'){
            description = "Technical Review";
        }else if(alarmLogObj== '143'){
            description = "Over Stoppage";
            image = 'ic_alarm_stopage';
        }else if(alarmLogObj== '144'){
            description = "Time Based Geofence";
        }             
    }
    image = image+'.png';
    arrAlarmConf.push(description);
    arrAlarmConf.push(image);
    return arrAlarmConf;
}

function getmovementtime(timestamp) {
        if (typeof timestamp == 'undefined') {
            return "-";
        }
        var stime = new Date(timestamp * 1000);
        var minutes = stime.getMinutes();
        var hours = stime.getHours();
        var date = stime.getDate();
        var month = stime.getMonth();
        month = month + 1;
        var seconds = stime.getSeconds();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var movetime = hours + ":" + minutes + ":" + seconds;
        if (date < 10) {
            date = "0" + date;
        }
        if (month < 10) {
            month = "0" + month;
        }

        var movedate = date + "/" + month + "/" + stime.getFullYear();
        return [ movetime, movedate, ampm ];
    }

    $(document).off("click", "#send_enquiry");
    $(document).on("click", "#send_enquiry", function(event)
    {
        var formNew = $('.enquiry-form')[0];
        var formData = new FormData(formNew);
        if(!$("#enq_des").val() || $("#enq_des").val().trim()==""){
            $("#enq_des").focus();
            show_error('Please enter your Enquiry');
            return false;
        }else if($("#enq_des").val().length < 10){
            show_error("Description cannot be less than 10 characters");
            error = true;
            return false;
        }
        formData.append("event", "send_enquiry");
        formData.append("mamth", "enquiry");
        
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        $('#loader').show();

        $.ajax(
        {
            type: 'POST',
            url: 'userAuth?enquiry',
            data: formData,
            timeout: 15000,
            processData: false,
            contentType: false,
            success:function (data) 
            {
                $("#loader").hide();
                if(!data) {show_error(1);return false;}
                try{
                    var decode = JSON.parse(data);
                }catch(e){
                    show_error(1);
                    $("#loader").hide();
                    return false;
                }
                if(!decode.loggedIn) {
                    $('#error_modal').html(decode.response).show().delay(4500);
                    return false;
                }
                if(decode.response == false) 
                { 
                    if(decode.errors) show_error(decode.errors);
                }
                else if(decode.response.statusCode == 200 || decode.response.statusCode == 201) 
                {
                    $('#cEnquiry').hide();
                    $("#enq_des").val("");
                    notify("Question submitted successfully");
                    var url = window.location.toString().split("/");
                    var curl = url.slice(-1)[0];
                    setTimeout(function(){listEnquiry(btoa(btoa($("#addImgg").attr("data-value")+'-1')).replace("=",""));},1000);
                    //listEnquiry(btoa(btoa($("#addImgg").attr("data-value")+'-1')).replace("=",""));

                    //get_place_details(curl);
                    return false;
                }
                else if(decode.response.statusCode == 400) {
                    if(decode.response.data) show_error(decode.response.data.errors[0].displayMessage);
                    else show_error(1);
                    $('#loader').hide();
                }
                else
                {
                    show_error(1);
                }
                
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                show_error(1);
            }
        }); 
    });

    function listEnquiry(placeId) /*place report*/
    { 
        var plcDetail = atob(atob(placeId)).split('-');
        var count = 0;
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        
        if(plcDetail[1] == 1) { $("#loader").show();}
        xhr = $.ajax(
        {
            type: 'POST',
            url: 'userAuth?113',
            data: en.code({'mamth':'M113','page':plcDetail[1],'place-id':plcDetail[0].replace('ID',''),'list-id':btoa('enquirylist')}),
            timeout: 150000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                var html = decode.response;
                if(html)
                {
                    if(plcDetail[1] == 1)
                    {
                        var urlContent = breakUrl();
                        $('#poi_other').html(html).show().delay(4500);
                        $('#poi_info').hide();
                        $('.action-bar').removeClass('visible-xs visible-sm').removeAttr('style');
                        if(urlContent[1].indexOf("LEz") === -1)
                        {
                            var secondPart = urlContent[1].replace(/WRzdata|wrzdata|zdata|LRzdata/g,'LEzdata');
                            call_url('', urlContent[0]+'@'+secondPart);
                            $('#report-loader').hide();
                        }
                    }
                    else
                    {
                        $(html).appendTo('#place-report');
                        $('#report-loader').show();
                    }
                      var count=$('.new-r-head:last').attr('id');
                      $('#place-report').attr('data-user',btoa(btoa(plcDetail[0]+'-'+(parseInt(plcDetail[1])+1)+'-'+count)));
                      if(!mobilecheck()) $("#enq_scrl").css("overflow-y","auto");
                      $("#enq_scrl,#poi_other").scroll(function() { 
                            var h = $(this).height();var scroll = $(this).scrollTop();var Height = $(this)[0].scrollHeight-h;
                            var per=scroll*100/Height; 
                            if(per>=80)
                            {
                                if(last_pg==pg_report) return false;
                                last_pg=pg_report;
                                var data = atob(atob($("#place-report").attr("data-user"))).split('-');
                                    
                                if(data[2]>= 10)
                                {
                                    $('#report-loader').show();
                                    $('#to-scroll').removeAttr('id');
                                    listReport($("#place-report").attr("data-user"));
                                }
                            }
                       });
                }
                (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
                $('#report-loader').hide();
                $("#loader").hide();
                pg_report++;
                xhr = null;
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $('.with-nav-tabs').show();
                $("#loader").hide();
            } 
        });
    };

    function singleEnquiry(placeId,pinId)
    {
        var count = 0;
        if( xhr != null ) 
        {
            xhr.abort();
            xhr = null;
        }
        
        $("#loader").show();
        xhr = $.ajax(
        {
            type: 'POST',
            url: 'userAuth?113',
            data: en.code({'mamth':'M113','pinId':pinId,'place-id':placeId.replace('ID',''),'list-id':btoa('enquirydetail')}),
            timeout: 15000,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                if(decode.response)
                {
                    $("#res_info").html(decode.response).show();    
                    call_url("enquiry","enquiry@"+pinId);
                }
                else
                {
                    show_error(1);
                }
                (mobilecheck()) ? $('.with-nav-tabs').hide() : $('.with-nav-tabs').show();
                $("#loader").hide();
                if(!mobilecheck()) $("#rp_scrl").css("overflow-y","auto");
                xhr = null;
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $('.with-nav-tabs').show();
                $("#loader").hide();
                show_error(1);
            } 
        });
    }

/************** claim  **************/
    function createClaim(eloc,req,claimUser,addr)
    {
        $("#loader").show();
        abort_all();
        $.ajax(
        {
            type: 'POST',
            url: 'userAuth',
            data: {'mamth':'claimCreate','req':req},
            timeout: 15000,
            async:true,
            success:function (data) 
            {
                var decode = JSON.parse(data);
                var text = decode.response;
                if(decode.loggedIn) $('#res_info').html(text).show().delay(4500);
                else {
                    notify("This feature requires you to log in.",'','','alert-warning');
                    $('#error_modal').html(text).show().delay(4500);
                    $('#error_modal').show();
                    $("#loader").hide();
                    return false;
                }
                var urlContent = breakUrl();
                var url = window.location.toString().split('/'),curl = url.slice(-1)[0];
                var dta = curl.split("data=");
                var p_url=dta[0].split('-');
                var name=p_url[1]+'+'+p_url[2];
                var p_latln=decodeURIComponent(atob(dta[1].replace('ed',''))).split('+');
                var place_name = name.replace(/\+/g, ' ').replace(/\-/g, ' ');
                if(req) 
                {
                    if(urlContent[1].indexOf("WCRez") === -1)
                    {
                        var secondPart = urlContent[1].replace(/WRzdata|wrzdata|zdata/g,'WCRezdata');
                        call_url('', urlContent[0]+'@'+secondPart);
                    }
                    $(".already-claim").show();
                    $(".create-claim").hide();
                    claimUser = claimUser.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                        return letter.toUpperCase();
                    });
                    $('#claim_request_user').html('<a style="color:#3A78E7;" onclick="view_profile(\''+claimUser+'\')">'+claimUser+'</a> manages this place on MapmyIndia move');
                    $('#place_eloc_reclaim').val(eloc);
                    $('#place_lat_reclaim').val(p_latln[0]);
                    $('#place_lng_reclaim').val(p_latln[1]);
                    $('#place_name_reclaim').val(addr);
                }
                else
                {
                    if(urlContent[1].indexOf("WCz") === -1)
                    {
                        var secondPart = urlContent[1].replace(/WRzdata|wrzdata|zdata/g,'WCzdata');
                        call_url('', urlContent[0]+'@'+secondPart);
                    }
                    $(".already-claim").hide();
                    $(".create-claim").show();
                    $('#place_eloc').val(eloc);
                    $('#place_lat').val(p_latln[0]);
                    $('#place_lng').val(p_latln[1]);
                    $('#place_name').val(addr);
                }
                $("#loader").hide();
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $("#loader").hide();
                show_error(1);
            }
        });
        return false;    
    };
function bookings(book_service,eloc,element,price,lat,lng)
{ 
    var loc=window.location.href;
    if(book_service==1)
    {/*load & popstate*/
        var dzd_arr=['','',''],dzd=loc.split('zdata=');
        if(dzd[0]&& dzd[1])
        {
            var pname=dzd[0].split('/');
            if(pname) $("#auto").val(pname[pname.length-1].replace(/-/g, ' ').replace('@',''));
            if(dzd[1]) dzd_arr=atob(dzd[1]).split('!!');
            book_service=dzd_arr[0];eloc=dzd_arr[1];element=dzd_arr[2];price=dzd_arr[3];lat=dzd_arr[4];lng=dzd_arr[5];
        }
        
    } 
    if (typeof docker !== 'object') { 
        var script = document.createElement("script"); 
        var js_file='';js_file='/../booking/js/booking.js';
        script.src = js_path+js_file+'?'+(window.location.hostname=='maps.mapmyindia.com'?cachdt:new Date().getTime()); 
        script.async = true;
        script.addEventListener('load', function() {
        booking.style();
            if(book_service && eloc)
            {
                booking.slot(book_service,eloc,element,price,lat,lng); 
            }
            else booking.get();
           
        });
        document.head.appendChild(script);
    }
    else 
    {
        if(book_service && eloc)
        {
            booking.slot(book_service,eloc,element,price,lat,lng); 
        }
        else booking.get();
    }
 
    
}

/******  maplayer js *********/
/*$('.map-custom-bg-overlay').on('click', function() {
  $("#mapLayerSidePanelMain").removeClass("customPanelMain");
});*/

/************* set home /work *********/
var set_hw='';
var click_evt='';
function setHomeWork(list_id,type,name,placeId,url,lat,lng,locType,listName,status,listVisibility,data_id){
    //locType=(locType=='office' ? 'work' : 'home');
    if(set_hw) set_hw.abort();
    set_hw=$.ajax(
    {
        type: 'POST',
        url: 'userAuth?140',
        data: en.code({'mamth':'M140','list_id':list_id,'evt':click_evt}),
        timeout: 15000,
        success:function (data) 
        {
            var decode = JSON.parse(data);
            if(decode.response)
            {
                if(!decode.html){ $('#error_modal').html(decode.response).show();return false;}
                var error = false;
               
                if(!url || url == "undefined") url = document.URL; 
                var urlContent = breakUrl(url);
                var decodeString ="";
                if(urlContent) decodeString =atob(urlContent[(urlContent.length)-1].replace('ed','')).split('+');

                if(!name) name = ucwords($("#auto").val());
                
                if(!placeId) placeId = decodeString[3];
                if(!lat) lat = decodeString[0];
                if(!lng) lng = decodeString[1];
                var act_id=$('.active-loc').children().children().attr('id');/*i det*/
                placeId=placeId.replace("?","");

                if(!locType) locType = (type=='favourite' && act_id) ? $('.active-loc').children().children().attr('id') : '';

                if(!error)
                {
                    if( xhr != null ) 
                    {
                        xhr.abort();
                        xhr = null;
                    }
                    var types = ["favourite"];
                    if(jQuery.inArray(type, types) === -1 || locType=='home' || locType=='office')
                    {
                        $("#loader").show();
                    }
                    var new_url=url;
                    if(!placeId || placeId==undefined)  placeId ="";
                    xhr = $.ajax(
                    {
                        type: 'POST',
                        url: 'userAuth?save_hw',
                        data: en.code({'mamth':'save_hw','placeId':placeId,'locType':locType,'lat':lat,'lng':lng,'name':name}),
                        timeout: 15000,
                        success:function (data) 
                        {
                            var decode = JSON.parse(data);
                            $("#loader").hide();
                            if(decode.response == false)
                            {
                                 $("#loader").hide();
                                if(decode.errors)
                                {
                                    show_error(decode.errors[0]);
                                }
                                else  show_error(1);
                            }
                            else if(decode.response.statusCode == '201' || decode.response.statusCode == '200')
                            {
                                if(maps.uri()=='add-home' || maps.uri()=='add-work' || ((locType=='home' || locType=='office') && maps.uri().indexOf('place-')==-1)) {setTimeout(function(){viewMyPlace(uname);}, 700);notify((locType.charAt(0).toUpperCase() + locType.slice(1))+' successfully '+(status?'added':'removed'));}
                                else{
                                    notify('Successfully added');$("#loader").hide();
                                    setTimeout(function(){  
                                        if($('.active-loc').children().children().attr('id'))
                                        {    
                                            var tp=$('.active-loc').attr("data-fav");
                                            $('.active-loc').removeClass('active-loc');
                                            if(tp)
                                            {
                                               if(tp == 'home')
                                               {
                                                   if($("#home").hasClass('fa-check-square'))
                                                   {
                                                       $("#home").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                       $("#saved_home").hide();
                                                       $("#set_home .set-item-text p").html('Set as home').show(100);
                                                   }
                                                   else
                                                   {
                                                       $("#home").removeClass('fa-square-o').addClass('fa-check-square').attr("data-user", "home");
                                                       $("#set_home .set-item-text p").html('&#10004; Saved as home').show(100);
                                                   }
                                                   if($("#office").hasClass('fa-check-square'))
                                                   {
                                                       $("#office").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                       $("#saved_office").hide();
                                                       $("#set_home .set-item-text p").html('Set as work').show(100);
                                                   }
                                                }
                                                else
                                                {
                                                    if($("#office").hasClass('fa-check-square'))
                                                    {
                                                        $("#office").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                        $("#saved_office").hide();
                                                        $("#set_home .set-item-text p").html('Set as work').show(100);
                                                    }
                                                    else
                                                    {
                                                      $("#office").removeClass('fa-square-o').addClass('fa-check-square').attr("data-user", "office");
                                                       $("#set_work .set-item-text p").html('&#10004; Saved as work').show(100);
                                                    }
                                                    if($("#home").hasClass('fa-check-square'))
                                                    {
                                                        $("#home").removeClass('fa-check-square').addClass('fa-square-o').removeAttr("data-user");
                                                        $("#saved_home").hide();
                                                        $("#set_home .set-item-text p").html('Set as home').show(100);
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                $('#loc-type').fadeOut(500).html('');  
                                                $('#home-loc').fadeOut(500).html(''); 
                                                $('#office-loc').fadeOut(500).html('');
                                            }
                                        }
                                    },4000);
                                }
                            }
                            else if(decode.response.statusCode == "400") {
                                show_error(decode.response.data.errors[0].displayMessage);
                                $("#loader").hide();
                                return true;
                            }
                            else
                            {
                                show_error(1);
                            }
                            if(jQuery.inArray(type, types) === -1)
                            {
                                $("#loader").hide();
                            }
                            xhr = null;
                        },
                        error: function(jqXHR, textStatus, errorThrown) 
                        {
                            if(jQuery.inArray(type, types) === -1)
                            {
                                $("#loader").hide();
                            }
                            show_error(1);
                        }
                    });
                }
            }
            else
            {
                $("#signin").trigger("click");
                var string = [];
                string.push({event:type,value:list_id});
                localStorage.setItem('event', JSON.stringify(string));
            }
        },
        error: function(jqXHR, textStatus, errorThrown) 
        {
            show_error(1);
        }
    });
    return false;
}

function searchFunction(type) {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById(type);
    a = div.getElementsByTagName("li");
    for (i = 0; i < a.length; i++) {
        txtValue = $("#"+type).find("li:eq("+i+") .act_text h2").html();
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
}


/******* get token from app *******/

function getToken() {
    var token='';
    if(typeof window.Native !== "undefined" && window.Native !== null) {
            token = window.Native.getAccessToken();
            return token;
    } else {
            return token;
    }
}

var timer= setInterval(function(){
   
    if(!uname && forceL==false){
        var url = window.location.toString().split("/");
        var curl = url.slice(-1)[0]; 
        try{
            var curl_s=curl.split('data=');
            var data_s=atob(curl_s[1]);
            console.log(data_s)
            if(data_s.indexOf("audi")==-1){
               
            }
             else { return false; }
        }catch(e){}

       if(curl.indexOf("signin")==-1){
		   
		var platform="";
		var agent = window.navigator.userAgent;
		if(agent.indexOf('iPhone') !== -1 && agent.indexOf('Safari') == -1) platform = "ios";
		else if(agent.indexOf('wv') !== -1) platform = "android";
		
		if(platform==""){
            if(curl.indexOf("hondaAssistShareLocation")==-1){
                loginDvForce('signin');
            }
			
		}
            
       }
    }
}, 300000); 


function filter_htm(){
    var fltrcall=xhr = $.ajax({method:"post",url: "filter_htm",data:"",
      success: function(data) { 
        var obj =JSON.parse(data); 
        $("#ev_filter_data").html(obj.html);
        $("#ev_filter_data").show();
        $(".s-result-scroll-item").hide();
      }});
}

function realViewOpen(){
       
          setTimeout(function(){  $("#real_drop").hide(); },100);
          if(!uname)loginDv('realView');
          else ShowRealView(tkn);

 }
 function realViewOpenMob(){
          setTimeout(function(){  $("#real_drop").hide(); },100);
          if(!uname)loginDv('realView');
          else ShowRealView(tkn);

 }
 var tkn='';
 function ShowRealView(tkn){
      tkn=tkn;
      var url="https://realview.mapmyindia.com/player/okhla/?access_token="+tkn;
      var html = '<div id="myModal" class="modal add-place-modal real-view-modal fade in" role="dialog" style="display:block">'
              +'<div class="modal-dialog">'
                +'<!-- Modal content-->'
                +'<div class="modal-content">'
                  +'<div class="modal-header">'
                    +'<button type="button" class="close addp-back-btn" data-dismiss="modal" onclick="$(\'#error_modal\').hide()">&times;</button>'
                    +'<h4 class="modal-title">RealView - Okhla Drive</h4>'
                  +'</div>'
                  +'<div class="modal-body">'
                      +'<div class="multiLevel-body">'
                      +'<iframe allowfullscreen allow="geolocation;" src="'+url+'"  allowfullscreen></iframe>'
                      +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>'
            +'</div>';
            $("#error_modal").html(html).show().delay(500);
 }

if(hondaTimer) clearInterval(hondaTimer);    
    var time = new Date().getTime();
     $(document.body).bind("mousemove keypress click", function(e) {
          time = new Date().getTime(); 
        }); 
        function refresh() { 
            if(new Date().getTime() - time >= 1000) { 
                var url = window.location.toString().split("/"); 
                var curl = url.slice(-1)[0]; 
                if(curl.indexOf("hondaAssistShareLocation")!=-1){ 
                    hondaShareLocation(curl.split('shareLocationId=')[1]); 
                } 
            } 
        } 
       var hondaTimer=setInterval(refresh, 10000);

function call_feedbackfrm(){
    $.post('userAuth?CallRealView', {}, function (data) 
{

    var decode = JSON.parse(data);
    console.log(decode);
    if(decode.response) $("#res_info").html(decode.response).show();
    else {
       setTimeout(function(){},1000); 
    }


    $('.with-nav-tabs #cat_tab,.get-eloc-sec-bus,.get-eloc-sec').show();
    return false;

});}    
var real_view_call= function(st){ 
    if(st=="active" && !uname)
    {
        setTimeout(function(){
            loginDvForce('realviewEvent'); 
        },1000);
     
    }
  

}
$(document).on("click","#street_control,#realv_trig",function(e)
       { 
           var rvd=$("#street_control").find('img');
           if(rvd.attr('class')=='ic_toggle_on'){
     
              // map.realview(false);
               rvd.attr('src','images/maplayer/ic_toggle_off.png');
               rvd.attr('class','ic_toggle_off');
               $("#realv_trig").removeClass('active');
            //   real_view_call("inactive");
           }else{
            
                 // map.realview(true);  
               rvd.attr('src','images/maplayer/ic_toggle_on.png');
               rvd.attr('class','ic_toggle_on');
               $("#realv_trig").addClass('active');
               real_view_call("active");
           }
           return false;
        
        });      

