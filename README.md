# test-



<?php
session_write_close();
error_reporting(0);
ob_start("ob_gzhandler");
$content =trim(file_get_contents("php://input"));

require_once realpath(dirname(__FILE__ ) . '/globals.php');
class auto
{
    public function search($q,$g,$auto,$uname,$loc,$lat,$lng,$id,$flg)
    {
        $auto_res=array();   $i=0;
        if($_GET['mm']){$tkn= "bearer ".implode('-',array_reverse(explode('-',base64_decode(substr(strip_tags($_GET['mm']),0,-2)))));}
        else $tkn=  self::check_token(1);
       
        if(isset($tkn))
        {   
            if(!$uname) $uname="mmimaps";
            if($lat!='undefined' & $lat!='') $loc="$lat,$lng";
            $atlas_o=Atlas_Url."places/search/json?query=$q&location=$loc&bridge&explain&username=$uname";
           // echo $tkn;
           // die($atlas_o);
            $param=array();$param[] = "Authorization: $tkn";
            $object = new globals();
            $atlas_result=$object->curl('header',$atlas_o,$param,'','');
            if($atlas_result->error=='invalid_token') { die(json_encode(array(2))); /*self::check_token(1);*/}
            //echo "<pre>"; print_r($param);print_r($atlas_result);die;
            $suggested = json_decode(json_encode($atlas_result->suggestedSearches), true);
            $search_string=  urldecode($q);
            $before = "<span class='highligher-search'>";$after = '</span>';
            if($suggested && ($id=='auto' || $id=='auto_callback'))
            {/*for brand & category*/
                #print_r($suggested);die;
                foreach($suggested as $row)
                {
                    $keyword=str_replace('-',' ',$row['keyword']);
                    $identifier=$row['identifier'];
                    $location=$row['location'];
                    $hyperLink=$row['hyperLink'];
                    $match_arr=[];
                    preg_match('/refLocation=(.*?)&keywords/', $hyperLink, $match);
                    $keyword_cat=$keyword;
                    $cat=explode('keywords=',$hyperLink)[1];//print_r($cat);die;
                    if($cat) $keyword_cat=$cat;
                    $match_arr=explode(',',$match[1]);
                    $dis_addr=$keyword." ".$identifier." ".$location;
                    $address="place-".str_replace('#','',str_replace(" ","+",str_replace(", ","-, ",strtolower(str_replace("/","$",$keyword."-near-".$location)))))."@zdata=".base64_encode($match_arr[0]."+".$match_arr[1]."+16++".$keyword_cat."+el").'ed';
                    if(strlen($address)>200) $address=str_replace('@zdata','?@zdata',$address);
                    $location=  preg_replace("/,/","<p>",$location,1);
                    $dis_adr=  ucfirst($keyword)." ".$identifier." ".$location;
                    /*distance suggestion*/
                    $class="search-fill-cat";
                    /*$distance="";
                     if($_GET['cl'] && $lat && $lng)
                    {
                        $dist=self::distance($lat,$lng,$y,$x);
                        if($dist<1) $distance='<span class="search-dis">'.round($dist*1000).'<br> mts</span>';
                        else $distance='<span class="search-dis">'.round($dist,1).'<br> Kms</span>';
                        $class="";
                        //die("$lat,$lng-$y,$x=$dist");
                    }*/
                    $ppName = preg_replace('#('.$search_string.')#i',$before.'$1'.$after,$dis_adr);if(!$ppName)$ppName=$dis_adr;
                    $cat_img="<img src='images/search_cat/c_pin.png'>";
                   /* $keywords=$row['keyword'];
                    if($keywords)
                    {
                        $icn=self::icon_code($keywords);
                        if($icn) $cat_img="<img src='images/search_cat/$icn.png'>";
                    }*/
                    
                    $dis_addr="<div id='asa'><div class='icon-item icon-cat icon-cat-search'><i class='material-icons'>search</i></div><div class='search-item search-item-cat clearfix'><span class='search-fill $class'>".str_replace(";","/",$ppName)."</p></span>$distance</div><div>";
                    $auto_res[$i++]=array("p"=>$p,"addr"=>$dis_addr,"x"=>$x,"y"=>$y,"address"=>$address);
                }
            }
            $company_array = json_decode(json_encode($atlas_result->suggestedLocations), true);
            if($id==='raw'){return $company_array;die;/*for search*/}
            $added_array = json_decode(json_encode($atlas_result->userAddedLocations), true);
            
            $array=array_merge($company_array,$added_array);
            if($array)
            {
               
                foreach($array as $row)
                {
                    #print_r($row);die;
                    $adrs=preg_replace('/\s+/', ' ',  strip_tags($row['placeAddress']));
                    $placeNameNew = preg_replace('/\s+/', ' ',  strip_tags($row['placeName']));
                $alias= preg_replace('/\s+/', ' ',$row['alternateName']);
                   
                    if($alias && stripos($placeNameNew,$search_string)===FALSE)
                    {
                        $alias_arr=explode(',',$alias);
                        $find="";
                        foreach ($alias_arr as $alias_name) { 
                            if($find)continue;
                            if (stripos($alias_name,$search_string)!==FALSE) { 
                             $find=  ucwords($alias_name);
                            }
                        }
                        if($find) $placeNameNew=$find;
                       // $alias='<div class="alias-name" style="font-size: 12px;">('.explode(',',$alias)[0].')</div>';
                    }
                    
                    $p=$row['p'];
                    $type=$row['type'];
                    if(($id=='auto_end' || $id=='auto_start') && $type=='POI') $y=($row['entryLatitude']?$row['entryLatitude']:$row['latitude']); else $y=$row['latitude'];
                    if(($id=='auto_end' || $id=='auto_start') && $type=='POI') $x=($row['entryLongitude']?$row['entryLongitude']:$row['longitude']);else $x=$row['longitude'];
                    if(!$x || !$y) continue;
                    $eloc=$row['eLoc'];
                    $type=$row['type'];
                    $username=$row['userName'];
                    if($type=="POI") $zoom=17;elseif(strpos($type,'HOUSE')!==false) $zoom=18; elseif($type=="STREET") $zoom=17;else if($type=="SUBSUBLOCALITY") $zoom=16; elseif($type=="SUB_LOCALITY" || $type=="VILLAGE") $zoom=15;elseif($type=="LOCALITY" || $type=="SUB_DISTRICT" || $type=="PINCODE" || $type=="DISTRICT") $zoom=14; else if($type=="CITY"){ $zoom=13;}else if($type=="STATE") {$zoom=12;} else $zoom=16;
                    if($flg && $type=="POI") $flg="nozm";
                    $address="place-".str_replace('#','',str_replace(" ","+",str_replace(", ","-",strtolower(str_replace("/","$",$placeNameNew.', '.$adrs)))))."-".$eloc.(strlen($adrs)>40?'?':'')."@zdata=".base64_encode($y."+".$x.'+'.$zoom.'+'.$eloc.'+'.$add_categ_code.'+'.$p).'ed';
                    $address=str_replace(['&',';'],'',$address);
                    if(strlen($address)>200) $address=str_replace('@zdata','?@zdata',$address);
                    //$adrs=  preg_replace("/,/","<p>",$adrs,1);
                    //$adrs=  preg_replace("/,/","",$adrs,1);
                    if($placeNameNew) $pName=$placeNameNew; else $pName=$adrs;
                    if($username) $icon="fa fa-user-plus"; else $icon='ti-location-pin';
                    /*calculate distance*/
                    $distance="";$class="search-fill-cat";
                    if($_GET['cl'] && $lat && $lng)
                    {
                        $dist=self::distance($lat,$lng,$y,$x);
                        if($dist<1) $distance='<span class="search-dis">'.round($dist*1000).'<br> mts</span>';
                        else $distance='<span class="search-dis">'.round($dist,1).'<br> Kms</span>';
                        $class="";                     //die("$lat,$lng-$y,$x=$dist");
                    }
                    $ppName = preg_replace('#('.$search_string.')#i',$before.'$1'.$after,$pName);if(!$ppName)$ppName=$pName;
                    $cat_img="<img src='images/search_cat/c_pin.png'>";
                    $keywords=$row['keywords'][0];
                    if($keywords)
                    {
                        $icn=self::icon_code($keywords);
                        if($icn) $cat_img="<img src='images/search_cat/$icn.png'>";
                    }
                    if(strtoupper($search_string)==strtoupper($eloc)){ $cat_img="<img src='images/search_cat/c_eloc.png'>";$ppName="[$eloc] - ".$ppName;}
                    $dis_addr="<div id='asa'><div class='icon-item icon-cat'>$cat_img</div><div class='search-item search-item-cat clearfix'><span class='search-fill $class'>".str_replace(";","/",$ppName)."<p>".str_replace(array($pName.","), '', $adrs)."</p></span>$distance<span class='search-text-fill' onclick=\"top_ref=2;event.stopPropagation();$('#".$id."').val('".  addslashes($pName)."').focus();\"><i class='material-icons' >arrow_upward</span></div><div>";
                       $auto_res[$i++]=array("p"=>$p,"addr"=>$dis_addr,"x"=>$x,"y"=>$y,"ex"=>$row['entryLongitude'],"ey"=>$row['entryLatitude'],"address"=>$address,"type"=>$type);

                }
               
            }
        }
        if(empty($array) && $atlas_result==204 && $id=='auto') return '[{"p":2,"addr":"<div class=\'addmissing_sec\'><a onclick=\'maps.add_place();\'><strong><small>Looking for something else!</small><br>ADD A MISSING PLACE</strong><span class=\'missing_icon\'><img src=\'images/missing_icon.png\'></span></a></div>","x":"","y":"","address":""}]';
        else  return json_encode($auto_res);
    }
    public function get_geo($q,$g,$auto,$uname,$loc,$lat,$lng,$id)
    { 
        $cord=explode(',',  urldecode(str_replace(", ",",",str_replace("  "," ",$q))));
        if (count($cord)==2 && filter_var($cord[0], FILTER_VALIDATE_FLOAT) && filter_var($cord[1], FILTER_VALIDATE_FLOAT) && $id=='first')
        {
           $url=_REV_GEO_."?lng=".trim($cord[1])."&lat=".trim($cord[0]);
            $object = new globals();
            $result=$object->curl('get',$url,$param,'','');//print_r($result);die;
            if($result->results[0]->lng!=$cord[1] || $result->results[0]->lat!=$cord[0]) $adrs=$cord[0].",".$cord[1]."#".$cord[1].",".$cord[0]."#";
            else $adrs=($result->results[0]->formatted_address?$result->results[0]->formatted_address:$cord[0].",".$cord[1])."#".$result->results[0]->lng.",".$result->results[0]->lat."#".$result->results[0]->place_id;
            die($adrs);
        }
        
        $auto_res=array();   $i=0;$added_array=array();
        if($_GET['mm']){$tkn= "bearer ".implode('-',array_reverse(explode('-',base64_decode(substr(strip_tags($_GET['mm']),0,-2)))));}
        else $tkn=  self::check_token(1);
        if(isset($tkn))
        {
            if($lat!='undefined' & $lat!='') $loc="$lat,$lng";
            //echo'<pre>'.print_r($uname,TRUE).'</pre>';
           // $atlas_o=Atlas_Url."places/textsearch/json?query=$q&location=$loc&bridge&explain&username=$uname";
           # print_r($atlas_o);die($tkn);
            if($_REQUEST["filter"]=="undefined") $flt="";
            else { $flt="&filter=".urlencode($_REQUEST["filter"]); }
            $atlas_o=Atlas_Url."places/textsearch/json?query=$q&location=$loc&bridge&explain&username=$uname".$flt;
            $param=array();$param[] = "Authorization: $tkn";
            $object = new globals();
            $atlas_result=$object->curl('header',$atlas_o,$param,'','');#print_r($atlas_result);die;
            $company_array = json_decode(json_encode($atlas_result->suggestedLocations), true);//print_r($company_array);
            $added_array = json_decode(json_encode($atlas_result->userAddedLocations), true);
            if($added_array) $array=array_merge($company_array,$added_array);
            else $array=$company_array;
           // print_r($array);   die;
            $suggested = json_decode(json_encode($atlas_result->suggestedSearches), true);  //print_r($suggested);die;
             $sh_filter=0;
            if(strpos($atlas_result->explanation->keyword,"TRNECS")!==false) {
                       $sh_filter=1;
                       require_once('nearby-new.php'); 
                        unset($_SESSION["ev_filter"]);
                       echo  nearby::atlas_result($lat, $lng, $atlas_result->explanation->keyword,'EV charging near me','','','','');
                        $placeNameNew="ev+charging-near-me";
                        $zoom=16;
                        $add_categ_code="ev charging+el";
                       // $p="ev charging+el";
                        $address_s="place-".str_replace('#','',str_replace(" ","+",str_replace(", ","-",strtolower(str_replace("/","$",$placeNameNew.', '.$adrs)))))."?@zdata=".base64_encode($lat."+".$lng.'+'.$zoom.'+'.$eloc.'+'.$add_categ_code.'+'.$p).'ed';
                 
                      echo '<script>  showdot=0;
            filter_str_new="";call_url("'.$placeNameNew.'","'.$address_s.'");</script>';die();
                            
             }
            $total_num=count($array)+count($suggested);
            $result_ul='<div id="poi_dv" style="display:none"></div><div class="search-result-scroll twest12" id="near_dv"><div class="evFilterSec" style="display:none;" id="ev_filter_data">
             </div><div class="search-list-click-wrap s-result-scroll-item light-blue-top-bdr"><div class="search-title light-blue-bg"> <div class="list-top-arrow"> <i class="fa fa-chevron-up"></i></div>
                <div class="search-title-left blue-font pull-left"><h2>List of results <span id="geo_num">'.$total_num.'</span></h2>  </div>
                </div>'."<script>if(marker2) map.removeLayer(marker2);$('#as-results-auto').hide();  if(req!=0)req.abort();$('input').css({'background':'','background-size':'20px'});if(near_markers) map.removeLayer(near_markers);</script>".''
                . ' <ul class="list-of-result directions-list-of-route search-suggestion-list route-list-visible" id="nearby-result">';
            
          
            if($array)
            { 
                $near_search_icon="if(near_markers) map.removeLayer(near_markers);near_markers = L.markerClusterGroup();if(nearby_marker_group) map.removeLayer(nearby_marker_group);var nearby_search_icon = L.divIcon({className: '',iconAnchor: [13, 18], popupAnchor: [14, -45], html: '<div class=\'cat_img\'><img src=\'images/general.png\' class=\'img_srch\'></div>'});";
                $mkr_near_n=0;
                $thumb='<img id="ph_'.$eloc.'"src="images/search_cat/c_pin.png"  style="min-height:25px"/>'; 
                foreach($array as $row)
                {
                   # print_r($row);die;
                    $adrs=  addslashes($row['placeAddress']);
                    $placeNameNew = addslashes($row['placeName']);
                    //$addr=  preg_replace("/,/","</a></h3><p>",$adrs,1);
                    $addr=  preg_replace("/,/","",$adrs,1);
                    if($placeNameNew) $pName=$placeNameNew; else $pName=$adrs;
                    $p=$row['p'];
                    $y=$row['latitude'];
                    $x=$row['longitude'];
                    $keywords=$row['keywords'];//print_r($keywords);die;
                    $icon=$keywords[0];
                    if($icon && $_GET['id']!='first')
                    {
                        $cat_icon=self::icon_code($keywords[0]);
                        if($cat_icon)
                        {
                            $thumb='<img id="ph_'.$eloc.'"src="images/search_cat/'.$cat_icon.'.png"  style="min-height:25px"/>'; 
                        }else{
                            $thumb='<img id="ph_'.$eloc.'"src="images/search_cat/c_pin.png"  style="min-height:25px"/>'; 
                        }
                       /* require_once 'nearby-new.php';
                        $icn=nearby::icon_code(array($icon,$keywords[1]));*/
                        $icn="ic_common";$bg="none";
                        $cat_info=globals::cat_code(($keywords[0]>1?$keywords[1]:$keywords[0]));
                        if($cat_info)
                        {
                            $icn=$cat_info['icon'];
                            $bg=$cat_info['bg'];
                        }
                       # print_r($icn);die();
                        if($icn)
                        {
                            $near_search_icon.="nearby_search_icon".$mkr_near_n." = L.divIcon({className: '',iconAnchor: [13, 18], popupAnchor: [14, -45], html: '<div class=\'cat_img\' style=\'background:".$bg.";".$extra_style."\'><img src=\'images/cat/$icn.png\' class=\'img_cat\'></div>'});";
                        }
                        
                        
                    }
                    else  $near_search_icon.="nearby_search_icon".$mkr_near_n." = L.divIcon({className: '',iconAnchor: [13, 18], popupAnchor: [14, -45], html: '<div class=\'cat_img\'><img src=\'images/cat/ic_common.png\' class=\'img_cat\'></div>'});";
                     #       die($icn);
                     if(!$x || !$y) continue;
                    $eloc=$row['eLoc'];
                    $type=$row['type'];
                    $username=$row['userName'];
                    $uap="|||".$eloc."||||||||||||".$row['latitude']."|".$row['longitude']."|1||||".$placeNameNew;
                    $uad='';if($username) $uad='<span class="uadd_p">User added place</span>';
                    if($type=="POI") $zoom=17;elseif(strpos($type,'HOUSE')!==false) $zoom=18; elseif($type=="STREET") $zoom=17;else if($type=="SUBSUBLOCALITY") $zoom=16; elseif($type=="SUB_LOCALITY" || $type=="VILLAGE") $zoom=15;elseif($type=="LOCALITY" || $type=="SUB_DISTRICT" || $type=="PINCODE" || $type=="DISTRICT") $zoom=14; else if($type=="CITY"){ $zoom=13;}else if($type=="STATE") {$zoom=12;} else $zoom=16;
                    //$address="place-".str_replace(" ","+",str_replace(", ","-",strtolower(str_replace("/","$",$placeNameNew))))."-".$eloc."@zdata=".base64_encode($y."+".$x.'+'.$zoom.'+'.$eloc.'+'.$add_categ_code.'+'.$p).'ed';
                    $address="place-".str_replace('#','',str_replace(" ","+",str_replace(", ","-",strtolower(str_replace("/","$",$placeNameNew.', '.$adrs)))))."-".$eloc."@zdata=".base64_encode($y."+".$x.'+'.$zoom.'+'.$eloc.'+'.$add_categ_code.'+'.$p).'ed';
                     if(strlen($address)>200) $address=str_replace('@zdata','?@zdata',$address);
                    if($_GET['id']=='first') die($placeNameNew.", ".$adrs.'#'.($row['entryLongitude']?$row['entryLongitude']:$row['longitude']).','.($row['entryLatitude']?$row['entryLatitude']:$row['latitude']).'#'.$eloc);
                    if(count($array)==1 && $eloc==strtoupper($q)) die("<script>call_url('$placeNameNew, $adrs','".$address."');get_place_details('".$address."');</script>");
                    if($id=='auto') $click='onclick="get_place_details(\''.$address.'\');"';
                    elseif($id=='auto_near') $click='onclick="put_near_where(\''.str_replace('</a></h3><p>','',strip_tags($addr)).'\',\''.$y.'\',\''.$x.'\')"';
                    
                    $before = "<span class='highligher-search'>";$after = '</span>';
                    $ppName = preg_replace('#('.urldecode($q).')#i',$before.'$1'.$after,$pName);if(!$ppName)$ppName=$pName;
                    if(strtoupper($q)==strtoupper($eloc)) $ppName="[$eloc] - $ppName";
                    $result_ul.='<li onmouseover="open_popup(\'\',\''.$placeNameNew.' '.$addr.'<br> Eloc:'.str_replace('ID','',$eloc).'\',\''.$address.'\','.$y.','.$x.',\''.$uap.'\',\'\',\'India\',\''.$eloc.'\');" onmouseout="map.removeLayer(rich_popup)"><div class="directions-route" '.$click.' >                
                    <div class="directions-route-in-wrap pull-left">
                    <div class="directions-route-img default_brand_img">
                   '.$thumb.'
                    </div>
                    <div class="directions-route-text"><h3><a style="cursor:pointer">'.$ppName.'</a></h3><p>'.str_replace(array($pName,','), ' ', $adrs).'</p></h3>'.$uad.'</div>
                    </div>
                    </div></li>';
                    $addr=  addslashes(str_replace(array("\n", "\r"), '',$addr));
                    $nearby_marker.="nearby_marker[$mkr_near_n] = new L.Marker(new L.LatLng($y, $x), {icon: nearby_search_icon".$mkr_near_n.",title:'$addr'});nearby_marker[$mkr_near_n].on('click', function(e) {open_popup('','$placeNameNew $addr<br>eLoc: ".str_replace('ID','',$eloc)."','$address',$y,$x,'$uap','','India','$eloc');});near_markers.addLayer(nearby_marker[$mkr_near_n]);";
                    if($marker_group) $marker_group.=",nearby_marker[$mkr_near_n]"; else $marker_group="nearby_marker[$mkr_near_n]";
                    $mkr_near_n++;
                    
                }
               
            }
        $noresult='<div class=\'search-list-click-wrap s-result-scroll-item\'><div class=\'addmissing_sec\'><a onclick=\'maps.add_place();\'><strong><small>Looking for something else!</small><br>ADD A MISSING PLACE</strong><span class=\'missing_icon\'><img src=\'images/missing_icon.png\'></span></a></div></div><script>if(near_markers) map.removeLayer(near_markers);</script>';
        if(empty($array)) {die($noresult);echo self::geocode($id,$q);die;}
        else echo $result_ul."</ul></div></div><script>$(document).ready(function(){ $near_search_icon $nearby_marker  near_markers=new L.featureGroup([$marker_group]); map.addLayer(near_markers);if(!mobilecheck()) map.setActiveArea('viewport');if('$drag'=='') { map.fitBounds(near_markers.getBounds());} });$('.list-of-result').mCustomScrollbar({theme:'dark',scrollInertia:50});
</script>";
           
        }
        #else if(empty($array)) {echo self::geocode($id,$q);die;}
        return json_encode($auto_res);
    }
    function geocode($id,$q)
    { 
        
            $geo_url=geocode_url."?match=1&addr=$q";
            $object = new globals();
            $output=$object->curl('get',$geo_url,'','','');  
            $res=$output;
            $res_arr=$res->results;
            $ct=count($res_arr);
            if(!$res) die('<div class="search-result-scroll"><div class="search-list-click-wrap s-result-scroll-item "><br><center><h4>Refine your search<script>remove_layers();</script></h4></div></div>');
            if(!$ct && !$user_added_ct)
            { 
                die('<div class=\'search-list-click-wrap s-result-scroll-item\'><div class=\'addmissing_sec\'><a onclick=\'maps.add_place();\'><strong><small>Looking for something else!</small><br>ADD A MISSING PLACE</strong><span class=\'missing_icon\'><img src=\'images/missing_icon.png\'></span></a></div></div><script>if(near_markers) map.removeLayer(near_markers);</script>');
            }
        //print_r($output);
            $result_txt='<div class="search-result-scroll test1"><div class="search-list-click-wrap s-result-scroll-item light-blue-top-bdr"><div class="search-title light-blue-bg">
               <div class="list-top-arrow">
                <i class="fa fa-chevron-up"></i>
            </div>
                <div class="search-title-left blue-font pull-left">
                    <h2>List of results '.($ct+$user_added_ct).'</h2>
                   
                </div>
              
            </div>'."<script>if(marker2) map.removeLayer(marker2);$('#as-results-auto').hide();  if(req!=0)req.abort();$('input').css({'background':'','background-size':'20px'});if(near_markers) map.removeLayer(near_markers);</script>".''
                . ' <ul class="list-of-result directions-list-of-route search-suggestion-list route-list-visible" id="nearby-result">';
           //else $result_txt="<li style='background:#d26d00;;padding:2px'></li>";
         //  echo "<pre>";print_r($res_arr).'</pre>';
       
        foreach($res_arr as $result)
        {
           $name="";
          #echo"<pre>"; print_r($result);echo"</pre>";die;
           $lat=$result->lat;
           $ri=$result->ri;
           $lng=$result->lng;
           if($b==''){$ff_match=array('lat'=>$lat,'lng'=>$lng);$b++;}
           if(substr($lat,0,3)==substr(strip_tags($_GET['lat']),0,3) || substr($lng,0,3)==substr(strip_tags($_GET['lng']),0,3)) $ff_match=array('lat'=>$lat,'lng'=>$lng);
           if(substr($lat,0,3)==substr(strip_tags($_GET['lat']),0,3) && substr($lng,0,3)==substr(strip_tags($_GET['lng']),0,3)) $ff_match=array('lat'=>$lat,'lng'=>$lng);
           $hno=$result->houseNumber;
           $hname=$result->houseName;
           $poi=$result->poi;
           
           if(strpos($poi,'/')!==false){$poi_arr=explode('/',$poi); if(strpos(strtolower($poi_arr[1]),strtolower($_GET['q']))!==false) {$fele=$poi_arr[0];$poi_arr[0]=$poi_arr[1];$poi_arr[1]=$fele;$poi=  implode('/',$poi_arr);} else if(strpos(strtolower($poi_arr[2]),strtolower($_GET['q']))!==false) {$fele=$poi_arr[0];$poi_arr[0]=$poi_arr[2];$poi_arr[2]=$fele;$poi=  implode('/',$poi_arr);
           }}
           $type=$result->type;
          // $poi1=explode('/',$poi);$poi=$poi1[0];
           $thumb='<img id="ph_'.$eloc.'"src="images/search_loc1.png"  style="min-height:25px"/>';    
           $street=$result->street;if($street) $street=" $street,";
           $locality=explode(';',$result->locality)[0];
           $sub_loc=explode(';',$result->subLocality)[0];
           $ssub_loc=$result->subsubLocality;
           $village=$result->village;
           $district=explode(';',$result->district)[0];
           $sub_d=$result->subDistrict;
           $city=explode(';',$result->city)[0];
           $state=explode(';',$result->state)[0];
           
           $eloc=$result->place_id;if($eloc==null){$eloc="";$POI="";} else {$POI="ID$eloc";}
           if(strpos(strip_tags($_GET['search_eloc_auto']),$eloc)!==false) {$ct--;continue;}
           $zoom=16;
           if($type=='VILLAGE') {$name=$village.", $sub_d, $district, $state";$zoom=15;}
           else if($type=="CITY") {$name="$city, $state";$zoom=13;}
           else if($type=="STATE") {$name="$state";$zoom=12;}
           else if($type=="DISTRICT") {$name="$district, $state";$zoom=13;}
           else if($type=="SUB_DISTRICT") {$name="$sub_d, $district, $state";$zoom=14;}
           else if($type=="LOCALITY") {$name="$locality, $city, $state";$zoom=14;}
           else if($type=="SUB_LOCALITY") {$name="$sub_loc, $locality, $city, $state";$zoom=15;}
           else if($type=="SUBSUB_LOCALITY") {$name="$ssub_loc $sub_loc, $locality, $city, $state";$zoom=15;}
           else if($type=="HOUSE_NUMBER") {$name="$hno, $sub_loc, $locality, $city, $state";$zoom=18;}
           else if($type=="HOUSE_NAME") {$name="$hname, $sub_loc, $locality, $city, $state";$zoom=18;}
           else if($type=="STREET") { 
               $zoom=17;
               if ($city)
                $name="$street, $sub_loc, $locality, $city, $state";
               else
                $name="$street, $sub_d, $district, $state";
           }
           else if($type=="POI") {
               $zoom=17;
               if ($city)
                $name="$poi,$street $sub_loc, $locality, $city, $state";
               else
                $name="$poi, $sub_d, $district, $state";
           }
           if($name=="") $name=$result->formatted_address;
           $name=str_replace(", ,",",",str_replace(", , ,",",",str_replace(", , , ,",",",$name)));
             if($_GET['id']=='first') die($name.'#'.$lng.','.$lat.'#'.$eloc);
           $address="place-".str_replace('#','',str_replace(" ","+",str_replace(", ","-",strtolower(urlencode(str_replace('/','$',$name))))))."-".$eloc."@zdata=".base64_encode($lat."+".$lng.'+'.$zoom.'+'.$POI.'+'.$add_categ_code.'+'.$ri).'ed';
            if(strlen($address)>200) $address=str_replace('@zdata','?@zdata',$address);
           $addr=  preg_replace("/,/","</a><p>",$name,1);
           if($id=='auto') $click='onclick="show_location(\'\',\''.$address.'\');get_place_details(\''.$address.'\');"';
           elseif($id=='auto_near') $click='onclick="put_near_where(\''.str_replace('</a></h3><p>','',strip_tags($addr)).'\',\''.$lat.'\',\''.$lng.'\')"';
        
              $result_txt.='<li>
                <div class="directions-route"  '.$click.'>
                
                  <div class="directions-route-in-wrap pull-left">
                    <div class="directions-route-img default_brand_img">
                     '.$thumb.'
                    </div>
                    <div class="directions-route-text" >
                        <h3><a style="cursor:pointer">'.$addr.'</h3>
                    </div>
                  </div>
                </div></li>';
        }
        if($id=='near') return $ff_match;/*for category & brand search*/
        if(!$res_arr && !$user_added_ct) die('Timeout');
    
        $result_txt.="</ul></div></div>";
       
        echo $result_txt;
            
        }
     public function check_token($atmpt)
        {
             
        //$tkn=globals::decode($_COOKIE['token'],hash_key);
         $tkn=$_SESSION['atlas_tkn'];
         if(!isset($tkn) || $atmpt || strpos($tkn,'bearer')===false) {
            $atlas_o=Atlas_Url_Uat."oauth/token";
            $param="grant_type=client_credentials&client_id=".Atlas_ClientId."&client_secret=".Atlas_Secret;
            $object = new globals();
            $atlas_res=$object->curl('post',$atlas_o,$param,'','');
            if($atlas_res->access_token) 
            { 
                 $tkn=$atlas_res->token_type." ".$atlas_res->access_token;
                 $_SESSION['atlas_tkn']=$tkn;
               // $_SESSION['token']=$tkn;
                //setcookie('token', $tkn, time()+$atlas_res->expires_in);
                return $tkn;
            }
        }
        else return $tkn;
      }
      public function auto_callback($q,$g,$auto,$uname,$loc,$lat,$lng,$id,$state) {
        $auto_res=array();   $i=0;
        if($_GET['mm']){$tkn= "bearer ".implode('-',array_reverse(explode('-',base64_decode(substr(strip_tags($_GET['mm']),0,-2)))));}
        else $tkn=  self::check_token(1);
        if(isset($tkn))
        {   
            if(!$uname) $uname="mmimaps";
            $param_state='';
            if($state) $param_state = '&filter=cop:'.$state;
            if($lat!='undefined' & $lat!='') $loc="$lat,$lng";
            $atlas_o=Atlas_Url."places/search/json?query=$q&location=$loc&bridge&explain&username=$uname".$param_state;
            $param=array();$param[] = "Authorization: $tkn";
            $object = new globals();
            $atlas_result=$object->curl('header',$atlas_o,$param,'','');
            if($atlas_result->error=='invalid_token') { die(json_encode(array(2))); }
            //echo "<pre>"; print_r($param);print_r($atlas_result);die;
            $suggested = json_decode(json_encode($atlas_result->suggestedSearches), true);
            $search_string=  urldecode($q);
            $before = "<span class='highligher-search'>";$after = '</span>';
            
            $company_array = json_decode(json_encode($atlas_result->suggestedLocations), true);
            $added_array = json_decode(json_encode($atlas_result->userAddedLocations), true);
            $array=array_merge($company_array,$added_array);
            if($array){
                foreach($array as $row){
                    $adrs=preg_replace('/\s+/', ' ',  strip_tags($row['placeAddress']));
                    $placeNameNew = preg_replace('/\s+/', ' ',  strip_tags($row['placeName']));
                    $alias= preg_replace('/\s+/', ' ',$row['alternateName']);
                   
                    if($alias && stripos($placeNameNew,$search_string)===FALSE){
                        $alias_arr=explode(',',$alias);
                        $find="";
                        foreach ($alias_arr as $alias_name) { 
                            if($find)
                                continue;
                            if (stripos($alias_name,$search_string)!==FALSE) { 
                             $find=  ucwords($alias_name);
                            }
                        }
                        if($find) 
                            $placeNameNew=$find;
                    }
                    
                    $p=$row['p'];
                    $type=$row['type'];
                    if(($id=='auto_end' || $id=='auto_start') && $type=='POI') 
                        $y=($row['entryLatitude']?$row['entryLatitude']:$row['latitude']); 
                    else 
                        $y=$row['latitude'];
                    if(($id=='auto_end' || $id=='auto_start') && $type=='POI') 
                        $x=($row['entryLongitude']?$row['entryLongitude']:$row['longitude']);
                    else 
                        $x=$row['longitude'];
                    if(!$x || !$y) 
                        continue;
                    $eloc=$row['eLoc'];
                    $type=$row['type'];
                    $username=$row['userName'];
                    if($type=="POI") 
                        $zoom=17;
                    elseif(strpos($type,'HOUSE')!==false) 
                        $zoom=18; 
                    elseif($type=="STREET") 
                        $zoom=17;
                    else if($type=="SUBSUBLOCALITY") 
                        $zoom=16; 
                    elseif($type=="SUB_LOCALITY" || $type=="VILLAGE") 
                        $zoom=15;
                    elseif($type=="LOCALITY" || $type=="SUB_DISTRICT" || $type=="PINCODE" || $type=="DISTRICT") 
                        $zoom=14; 
                    else if($type=="CITY"){ 
                        $zoom=13;
                    }
                    else if($type=="STATE") {
                        $zoom=12;
                    } 
                    else 
                        $zoom=16;

                    $address="place-".str_replace('#','',str_replace(" ","+",str_replace(", ","-",strtolower(str_replace("/","$",$placeNameNew.', '.$adrs)))))."-".$eloc.(strlen($adrs)>40?'?':'')."@zdata=".base64_encode($y."+".$x.'+'.$zoom.'+'.$eloc.'+'.$add_categ_code.'+'.$p).'ed';

                    $address=str_replace(['&',';'],'',$address);
                    if(strlen($address)>200) 
                        $address=str_replace('@zdata','?@zdata',$address);
                    //$adrs=  preg_replace("/,/","<p>",$adrs,1);
                    $adrs=  preg_replace("/,/","",$adrs,1);
                    if($placeNameNew) 
                        $pName=$placeNameNew; 
                    else 
                        $pName=$adrs;
                    if($username) 
                        $icon="fa fa-user-plus"; 
                    else 
                        $icon='ti-location-pin';
                    /*calculate distance*/
                    $distance="";
                    $class="search-fill-cat";
                    if($_GET['cl'] && $lat && $lng){
                        $dist=self::distance($lat,$lng,$y,$x);
                        if($dist<1) 
                            $distance='<span class="search-dis">'.round($dist*1000).'<br> mts</span>';
                        else 
                            $distance='<span class="search-dis">'.round($dist,1).'<br> Kms</span>';
                        $class="";
                        //die("$lat,$lng-$y,$x=$dist");
                    }
                    $ppName = preg_replace('#('.$search_string.')#i',$before.'$1'.$after,$pName);

                    if(!$ppName)
                        $ppName=$pName;

                    $cat_img="<img src='images/search_cat/c_pin.png'>";
                    $keywords=$row['keywords'][0];
                    if($keywords){
                        $icn=self::icon_code($keywords);
                        if($icn) 
                            $cat_img="<img src='images/search_cat/$icn.png'>";
                    }
                    if(strtoupper($search_string)==strtoupper($eloc)){ 
                        $cat_img="<img src='images/search_cat/c_eloc.png'>";
                        $ppName="[$eloc] - ".$ppName;
                    }
                    $dis_addr="<div id='asa'><div class='icon-item icon-cat'>$cat_img</div><div class='search-item search-item-cat clearfix'><span class='search-fill $class'>".str_replace(";","/",$ppName)."<p>".str_replace(array($pName.","), '', $adrs)."</p></span>$distance<span class='search-text-fill' onclick=\"top_ref=2;event.stopPropagation();$('#".$id."').val('".  addslashes($pName)."').focus();\"><i class='material-icons' >arrow_upward</span></div><div>";
                    $auto_res[$i++]=array("p"=>$p,"addr"=>$dis_addr,"x"=>$x,"y"=>$y,"ex"=>$row['entryLongitude'],"ey"=>$row['entryLatitude'],"address"=>$address);
                }
                #print_r($auto_res);die;
               
            }
        }

        if(empty($array) && $atlas_result==204 && $id=='auto') 
            return '[{"p":2,"addr":"<div class=\'addmissing_sec\'><a onclick=\'maps.add_place();\'><strong><small>Looking for something else!</small><br>ADD A MISSING PLACE</strong><span class=\'missing_icon\'><img src=\'images/missing_icon.png\'></span></a></div>","x":"","y":"","address":""}]';
        else 
            return json_encode($auto_res);
    }

    function distance($lat1, $lon1, $lat2, $lon2) 
    {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            return $dist * 60 * 1.1515*1.609344;
    }
    function icon_code($cds)
    {
       #die($cds);
        $arr=array('FODRDS','FODIND','FODBAK','FODFFD','FODCON','FODOTL','FODOTH','FODCOF');if(array_search($cds,$arr)!==false)return'c_resturant';
        if(array_search($cds,['FINBNK','bank'])!==false || strpos($cds,'bank')!==false) return'c_bank';
        if(array_search($cds,['FINATM','atm','atms'])!==false || strpos($cds,'atm')!==false) return'c_atm';
        if(array_search($cds,['COMPUB'])!==false) return'c_toilet';
        if(array_search($cds,['TRNARC','TRNTRL','airport'])!==false) return'c_airport';
        $parkg=array('PARKNG','PRKMBK','PRKTRK','PRKBUS','PRKMLT','PRKNOP','PRKWPM','PRKCYC','PRKCNT','PRKRDS','PRKUNG','TRNPRK','PRKSRF');if(array_search($cds,$parkg)!==false)return'c_parking';
        $chem=array('MDS24H','MDSJAN','HLTMDS','chemistry');if(array_search($cds,$chem)!==false)return'c_chemist';
        $gym=array('HLTGYM');if(array_search($cds,$gym)!==false)return'c_gym';
        if(array_search($cds,['HLTHSP','TRNTRL','HLTAMB','HLTBLD','HLTEYE','HLTHSP','HSPAUR','HSPCAN','HSPCHD','HSPDNH','HSPENT','HSPEYH','HSPHMH','HSPHRH','HSPMAT','HSPMNH','HSPNAT','HSPORH','HSPURO','HSPVTH'])!==false) return'c_hospital';
        $hot=array('HOTNOP','HOTRES','HOTSAP','PREHRG','HOTPRE','HOTYTH','HOTALL','HOTHST','PRENRT','HOTHRG','NOPHRG');if(array_search($cds,$hot)!==false)return'c_hotel';
        if(array_search($cds,['METPLR','TRNMET'])!==false) return'c_metro';
        if(array_search($cds,['TRNPMP','petrol bunk','petroleum refinery'])!==false) return'c_petrolpump';
        if(array_search($cds,['TRNRAL','TRNRAM','TRNRWB','TRNRWT'])!==false) return'c_railway';
        if(array_search($cds,['TRNCGS','TRNECS','TRNSPS','CGSBMW'])!==false) return'ic_ev_s';
        if(array_search($cds,['HISMON'])!==false) return'ic_monument_s';
        if(array_search($cds,['COMCLG','UNVPVT'])!==false) return'ic_college_s';
        if(array_search($cds,['COMSCH'])!==false) return'ic_school_s';
        if(array_search($cds,['RELPND'])!==false) return'pandal_icon';
        
    }
}
if($_GET && get!=1)
{

    $ref=$_SERVER['HTTP_REFERER'];
    //if(($ref=="" && $_GET['1']!=1) || (strpos($ref,'10.10.21')===false && strpos($ref, '99.0.8.118') === false  && strpos($ref,'mapmyindia.com')===false&& $_GET['1']!=1)) die('[{1}]');
    if(strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest' && $_GET['1']!=1) die("[{2}]");
    /*aes*/
    if(strpos($_SERVER['REQUEST_URI'],'?en')!==false)
    {
        $input=  ltrim(array_keys($_GET)[0],'en');
        require_once realpath(dirname(__FILE__ ) . '/aes.php');
        $obj = new AES();
        $plainText = $obj->decrypt($input, encryption_key);
        $payload=  json_decode($plainText,TRUE);
        $_GET=$payload;
        //print_r($_GET);die;
    }

    if(strpos($_SERVER['REQUEST_URI'],'?em')!==false)
    {
        $input=  ltrim(array_keys($_GET)[0],'em');
        require_once realpath(dirname(__FILE__ ) . '/aes.php');
        $obj = new AES();
        $plainText = $obj->decrypt($input, encryption_key);
        $payload=  json_decode($plainText,TRUE);
        $_GET=$payload;
       $flg="nozm";
       #print_r($_GET);die;
    }

    /*aes*/
    $q=  strip_tags(urldecode($_GET['q']));
    $g=  strip_tags($_GET['g']);
    $auto=  strip_tags($_GET['auto']);
    $uname=  strip_tags($_GET['uname']);if(!$uname) $uname="mmimaps";
    $loc=  strip_tags($_GET['loc']);
    $lat=  strip_tags($_GET['lat']);
    $i=  strip_tags($_GET['i']);
    $id=  strip_tags($_GET['id']);
    $lng=  strip_tags($_GET['lng']);
    $state=  strip_tags($_GET['state']); 

    if($q && !$id && $state) {echo auto::auto_callback(urlencode($q),$g,$auto,$uname,$loc,$lat,$lng,$i,$state);}
   else if($q && !$id & !$flg) { echo auto::search(urlencode($q),$g,$auto,$uname,$loc,$lat,$lng,$i,'');}
     else if($flg) {  echo auto::search(urlencode($q),$g,$auto,$uname,$loc,$lat,$lng,$i,$flg);}
    if($q && $id) {echo auto::get_geo(urlencode($q),$g,$auto,$uname,$loc,$lat,$lng,$id);}
    if(!$q) die('[]');
}
?>
