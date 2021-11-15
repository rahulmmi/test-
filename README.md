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




---------------------------------------------------------------------------------------------------------------------------
<?php
//SessionComponent::write('user.name', 'balmukand');echo $this->Session->read('user.name');die;

error_reporting(0);
header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
if($_SERVER['HTTP_HOST']=='maps.mapmyindia.com')
{
    ini_set('session.cookie_httponly',1);
    ini_set('session.use_only_cookies',1);
}
else if(strpos($_SERVER['HTTP_HOST'],'move.mapmyindia.com')!==false)
{
    header("location:https://maps.mapmyindia.com");die;
}
session_start();
register_shutdown_function('page_error');
if($_SESSION['auth'])  header("Access-Control-Allow-Origin: *");

function page_error() {
   $last_error = error_get_last();
  # print_r($last_error);die;
   if($last_error['type'] === E_ERROR || $last_error['type']==64) {  if($_GET[1]==1){print_r($last_error);die;}
       if($_SESSION['user_name']=='balmukand' || $_GET[1]==1){print_r($last_error);die;}
       else {echo "<center><div  style='width:auto;border-radius:10px;paddig-top:5px;margin-top:20px'><img src='images/side/ic_side_logo.png'><h1>We're under maintenace, Please try later!</h1></div></center>";}
        require_once realpath(dirname(__FILE__ ) . '/DBConnector.php');$db = new DBConnector();
        $res=$db->logs("page-error:".  addslashes(json_encode($last_error)));
   }
}
set_time_limit(0);
ob_start("ob_gzhandler");
require_once 'globals.php';
$uri                        =   str_replace("//","/",$_SERVER["REQUEST_URI"]);
//$uri                      =   strtok($uri, '?');
$uri                        =   str_replace('??@','?@',$uri);
$uri                        =   preg_replace('/\//', '', $uri, 1);
$uri                        =   explode('?',str_replace('?@','@',$uri))[0];//added by bm
$uri_arr                    =   preg_split('/(\/)/', $uri);
$uri_arr_size               =   sizeof($uri_arr); // 2 die();

if($_SERVER['HTTP_X_FORWARDED_PROTO']== "https" || $_SERVER['HTTPS']=='on')
{
    $urih = 'https://';
} 
else 
{
    $urih = 'http://';
}
#echo "<pre>";print_r($_SERVER);die;
//if($_SERVER['HTTP_X_FORWARDED_PROTO']== "https") $urih = 'https://';
$actual_link = $urih."$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";//die($actual_link);
$root = $urih  . $_SERVER['HTTP_HOST'] .dirname(str_replace('app/webroot','',$_SERVER['PHP_SELF']));
$root_arr=explode('/',$root);
$lastInroot=end($root_arr);
if(strpos($_SERVER["REQUEST_URI"],$lastInroot)===false) $root= rtrim(str_replace($lastInroot,'',$root),"/");
//die($_SERVER["REQUEST_URI"]);
//die($root);
$last_dir=end(explode('/',$root));
$dir=preg_split('/(\/)/',preg_replace('/\//', '',$this->Html->url('/'),1));
$root_count=sizeof($dir)-(strpos($_SERVER[REQUEST_URI],$this->Html->url('/'))!==false?1:2);$uri_num=$root_count;
//print_r($_SERVER[REQUEST_URI]);die(" Ss".$uri_num);
if($uri_arr_size>=3 && $_SERVER['HTTP_HOST']=='maps.mapmyindia.com') header("location:https://maps.mapmyindia.com");
//if(strpos($actual_link,'map7.1')===false) $uri_num=$uri_num+1;
$cur_url= $uri_arr[$uri_num];
$cur_url=str_replace('confirm','',str_replace('script','',str_replace('"',"",str_replace("'","",str_replace('alert','',str_replace('%3d','',strip_tags(urldecode($cur_url))))))));
#die($cur_url);

if($cur_url=="SHL"){  
    require_once 'shl_check.php';die;  

}

if($cur_url=="ForgotPassword"){
    die("<script> window.location.href='https://anchor.mapmyindia.com/app#/userRecovery?type=forgotPassword'</script>");

}

if(stripos($cur_url,'call girl')!==false){header("location:./");die;}

if($uri_arr[$uri_num+1])
{     /***/
      if($cur_url=='eloc' || $cur_url=='location' || $cur_url=='vehicle' || $cur_url=='pom') {header("location:../@".str_replace('@','',urldecode($uri_arr[$uri_num+1])));exit;}
      else if ($cur_url=='alarm/') {header("location:../".str_replace('/','$',$uri_arr[$uri_num+1]));exit;}
      else if($cur_url=='checkin') {header("location:../@".$uri_arr[$uri_num+1]);die;}
      else if($cur_url=='profile') {header("location:../".$uri_arr[$uri_num+1]);exit;}
      else if($cur_url=='corona')
      {
          $next_url=$uri_arr[$uri_num+1];
          if($next_url)
          {
              if(strpos($next_url,'testing-centre')!==false) $loc="../corona?corona_testing_centre";
              else if(strpos($next_url,'treatment-centre')!==false) $loc="../corona?corona_treatment_centre";
              else if(strpos($next_url,'sample-collection-centre')!==false) $loc="../corona?corona_sample_collection_centre";
              else if(strpos($next_url,'isolation-ward')!==false) $loc="../corona?corona_isolation_ward";
              else if(strpos($next_url,'ficci')!==false) die('11');
          }
          if($loc) header("location:$loc");
          else {require_once 'covid-19/corona.php';}
          die;
      }
     else if($uri_arr[$uri_num+1]=="near")
     {
    
      $cat=urldecode($uri_arr[$uri_num]);
      $loca=str_replace(",", "+", $uri_arr[$uri_num+2])  ;
      if(!$loca) $loca="28.3323+77.32424";
      $myurl="place-".str_replace(" ", "+",$cat)."-near-".urlencode($loca)."?@embedzdata=".base64_encode("$loca+11++$cat+el+,")."ed";
      header("location:../../$myurl");die;
   
     
     }
      else if($cur_url=='review'){
          if(strlen($uri_arr[$uri_num+1]) == 6 && $uri_arr[$uri_num+2]){
            header("location:../../review?journey=@".$uri_arr[$uri_num+2]);
            die;
          }
          else{
            header("location:".($uri_arr[$uri_num+2] ? '../' : '' )."../review?journey=@".$uri_arr[$uri_num+1].(($uri_arr[$uri_num+2]) ? '@'.$uri_arr[$uri_num+2]:''));
            die;
          }
      }
      else if($cur_url=='report' || $cur_url=='reports')
      {
          $pin=$uri_arr[$uri_num+2];
          if($pin) header("location:../../report@@@".$pin);
          else header("location:".($uri_arr[$uri_num+2]?'../':'')."../report@@@".$uri_arr[$uri_num+1].($uri_arr[$uri_num+2]?'@'.$uri_arr[$uri_num+2]:''));
          die;
      }
      else  if($cur_url=='reports' || $cur_url=='pinid')
      {
        header("location:".($uri_arr[$uri_num+2]?'../':'')."../report@@@".$uri_arr[$uri_num+1].($uri_arr[$uri_num+2]?'@'.$uri_arr[$uri_num+2]:''));
        die;
      }
      $rest_url = implode("$",array_slice($uri_arr, $uri_num));
    //  header("location:".str_replace("app/webroot","",$root)."$rest_url");exit;
      if(strpos($rest_url,'place-')!==false)
      {
        header("location:".str_replace("app/webroot","",$root)."/$rest_url");exit;
      }
      else {
        header("location:".str_replace("app/webroot","",$root)."$rest_url");exit;
      }
      #print_r($rest_url);die;
}
else if($uri_arr_size>=3 && $_SERVER['HTTP_HOST']=='maps.mapmyindia.com') header("location:https://maps.mapmyindia.com/".$cur_url);
//if($_SESSION['user_name']=='balmukand') die($cur_url);

if($cur_url=='uid!' || $cur_url=='uid!!')
{
    if($_SESSION['access_atlas']) 
    { 
        die(base64_encode(implode('-',array_reverse(explode('-',$_SESSION['access_atlas']))))."mm");
    }
    require_once realpath(dirname(__FILE__ ) . '/Auth_login.php');
    $object = new Auth_login();
    $tkn=str_replace('Bearer ','',$object->Authorization());
    if($tkn) 
    { 
        $_SESSION['access_atlas']=$tkn;
        $tkn =  base64_encode(implode('-',array_reverse(explode('-',$tkn))))."mm";
    }
    
    die($tkn);
}
if(strpos($cur_url,'autosugg')!==false)
{ 
    require_once 'auto.php';die;
}
else if(strpos($cur_url,'mmi-report')!==false)
{
 require_once 'mmi_report/index.php';die;
}
else if(strpos($cur_url,'mmi-claim')!==false)
{

 require_once 'mmi_claim/index.php';die;
}
else if(strpos($cur_url,'claim-ajax')!==false)
{

 require_once 'mmi_claim/ajax.php';die;
}

if(strpos($cur_url,'near-what')!==false)
{
    require_once 'nearby_what.php';die;
}
else if(strpos($cur_url,_CSS_.'.css')!==false)
{ 
    $css_folder._CSS_."/";require_once $css_folder.'index.ctp';die;
}
else if(strpos($cur_url,_JS_.'.js')!==false)
{ 
   $js_folder=_JS_."/";require_once $js_folder.'index.ctp';die;
}
else if(strpos($cur_url,'get-geo')!==false)
{
   require_once 'auto.php';die; //require_once 'get_geo.php';die;
}
else if(strpos($_SERVER["REQUEST_URI"],'send-to?')!==false)
{
   require_once 'send_to_phone.php';die(); //require_once 'get_geo.php';die;
}
elseif ($cur_url=='eloc'||$cur_url=='location'||$cur_url=='vehicle') {
      $elc=  array_search($cur_url,$uri_arr);
      header("location:../@".str_replace('@','',$uri_arr[($elc+1)]));
}
elseif ($cur_url=='profile') {
      $elc=  array_search($cur_url,$uri_arr);
      header("location:../".$uri_arr[($elc+1)]);
}
elseif ($cur_url=='getMove' || $cur_url=="getMoveHuawei") {
    require_once realpath(dirname(__FILE__) . '/Mobile_Detect.php');
$detect = new Mobile_Detect;
$mobile = ($detect->isMobile()) ? 1 : 0;
$HTTP_USER_AGENT = strtolower($_SERVER['HTTP_USER_AGENT']);
if((bool) strpos($HTTP_USER_AGENT, 'android')) $os = 'android';
else if(!$android && ((bool) strpos($HTTP_USER_AGENT, 'iphone') || (bool) strpos($HTTP_USER_AGENT, 'ipod'))) $os = 'iphone';
#print_r($_SESSION);die;
if($os=='android') 
{
    $url="https://play.google.com/store/apps/details?id=com.mmi.maps&hl=en";
    if($cur_url=="getMoveHuawei"){ 
        $url="https://appgallery.huawei.com/#/app/C101651625";
    }
   
}
else if($os=='iphone') $url="https://apps.apple.com/in/app/map-directions-local-searches-travel-guide/id723492531";
else $url=".";

#die($os);
header("location:$url");
}
/*elseif (($cur_url=='review' || $cur_url=='checkin'||$cur_url=='pinid') && strpos($cur_url,'?')!==false) {
   // die('ss');
      $elc=  array_search($cur_url,$uri_arr);
      header("location:../?journey=review-".$uri_arr[($elc+1)]);
}*/
elseif ($cur_url=='review' || $cur_url=='checkin'||$cur_url=='pinid') {
      $elc=  array_search($cur_url,$uri_arr);
      $reviewEloc = $_GET['journey'];
      $pin_arr =explode("@", $reviewEloc);
      # print_r($pin_arr);die($pin_arr[count($pin_arr)-1]);
      //echo $pin_arr[count($pin_arr)-1];die("journey=review-".$pin_arr[count($pin_arr)-1]);
      header("location:./?journey=@".$pin_arr[count($pin_arr)-1]);  
}
else if(strpos($cur_url,'poi_details')!==false)
{
    require_once 'details.php';die;
}
else if($cur_url=='navigation' || strpos($cur_url,'navigation?')!==false || strpos($_SERVER["REQUEST_URI"],'direction?')!==false)
{
    $places=$_GET['places'];
    $nav_url_arr=explode(";", $places);
    #####check ELOC passed
    if(strlen(trim($nav_url_arr[0]))===6 || strlen(trim($nav_url_arr[1]))===6)
    {
        define("get",1);
        require_once 'auto.php';
        $i=0;
        foreach($nav_url_arr as  $searc_eloc)
        {
          if(strlen(trim($searc_eloc))==6)
          {
            $search= auto::search($searc_eloc,'','','','','','','raw');
            $lat=$search[0]['latitude'];
            $lng=$search[0]['longitude'];
            $name=preg_replace('/[^A-Za-z0-9\-]/', '',str_replace(' ','-',strtolower($search[0]['placeName'])));
            if($lat && $lng)
            {
                $nav_url_arr[$i]="$lat,$lng,$name";
            }
          }
          $i++;
           #echo "<pre>"; print_r($name);
        }
    }
    #print_r($nav_url_arr);die;
    
    $nav_length=count($nav_url_arr);
    $dir_url="direction-from--";$zdata="from+";
    if($nav_length>1)
    {
        $loc_from=explode(',',$nav_url_arr[0]);
        if($loc_from[0]=='current_location' || $loc_from[0]=='current-location') $dir_url="direction-from-current-location";
        else{
            if (preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_from[0]) && preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_from[1])){ $zdata="from+".round($loc_from[1],6).",".round($loc_from[0],6);}
            if($loc_from[2]) $dir_url="direction-from-".urldecode(implode(",",array_slice($loc_from,2)));
            else $dir_url ="direction-from-".round($loc_from[1],6).",".round($loc_from[0],6);
        }
    }
    
    /*via*/
    $via_url="";$via_zdata="";
    if($nav_length>=3){ $via=1;
    $loc_v1=explode(',',$nav_url_arr[$via]);
    if($loc_v1[0]=='current_location' || $loc_v1[0]=='current-location') $via_url=="-via-current-location";
    else{
        if (preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_v1[0]) && preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_v1[1])){ $via_zdata="+v+".round($loc_v1[1],6).",".round($loc_v1[0],6);}
        $via_url="-via-".urldecode(implode(",",array_slice($loc_v1,2)));
    }}
    if($nav_length>=4){ $via2=2;
    $loc_v2=explode(',',$nav_url_arr[$via2]);
    if($loc_v2[0]=='current_location' || $loc_v2[0]=='current-location') $via_url.="?current-location";
    else{
        if (preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_v2[0]) && preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_v2[1])){ $via_zdata.="|".round($loc_v2[1],6).",".round($loc_v2[0],6);}
        $via_url.="?".urldecode(implode(",",array_slice($loc_v2,2)));
    }}
    if($nav_length>=5){ $via3=3;
    $loc_v3=explode(',',$nav_url_arr[$via3]);
    if($loc_v3[0]=='current_location' || $loc_v3[0]=='current-location') $via_url.="?current-location";
    else{
        if (preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_v3[0]) && preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_v3[1])){ $via_zdata.="|".round($loc_v3[1],6).",".round($loc_v3[0],6);}
        $via_url.="?".urldecode(implode(",",array_slice($loc_v3,2)));
    }}
    
    /*end*/
    /*if($nav_length==2) $end=1;else if($nav_length==3) $end=2;else if($nav_length==4) $end=3;else if($nav_length==5) $end=4;*/
    $end=end($nav_url_arr);
    $loc_end=explode(',',$end);
    if($loc_end[0]=='current_location' || $loc_end[0]=='current-location') $dir_url.="-to-current-location";
    else{
        
        if (preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_end[0]) && preg_match('/^[0-9]+(\\.[0-9]+)?$/', $loc_end[1])){ $zdata.="+to+".round($loc_end[1],6).",".round($loc_end[0],6);}
        if($loc_end[2]) $dir_url.="?-to-".urldecode(implode(",",array_slice($loc_end,2)));
        else $dir_url.="?-to-".round($loc_end[1],6).",".round($loc_end[0],6);
    }
    if($via_url) $dir_url.=$via_url;
    if($via_zdata)$zdata.=$via_zdata;
    
    $dir_url.="@zdata=".base64_encode($zdata);
    header("location:".$dir_url);
    //echo "<pre>"; print_r($dir_url);echo "</pre>";
    die();
}
else if(strpos($cur_url,'details_temp')!==false)
{
    require_once 'details_temp.php';die;
}
else if(strpos($cur_url,'weather_aqi')!==false)
{
    require_once 'weather_aqi.php';die;
}
else if(strpos($cur_url,'filter_htm')!==false)
{
   require_once 'filter_html.php';die;
}
else if(strpos($cur_url,'maplayer_call')!==false)
{
    require_once 'maplayer.php';die;
}
else if(strpos($cur_url,'place-')!==false)
{
    $pu=str_replace('?','',str_replace('-',', ',str_replace('+',' ',preg_replace('/place-/','',strtok(urldecode($cur_url),'@'),1))));
    if(strpos($pu,'near,')) $title=str_replace(',','',  ucfirst ($pu))." | search ".str_replace(',','',str_replace('near','nearby',$pu));
    else $title=ucwords(substr(str_replace('$','/',$pu),0,-8));
    $description="$title. Find location, directions, places & brands,";
    $keywords="Maps of $title ";
    require_once 'index.ctp';die;
}
else if ($cur_url=='direction') 
{   
    $title="Get map direction by MapmyIndia ";$keywords=$description=$title;require_once 'index.ctp';die;
}
else if(strpos($cur_url,'direction-')!==false   && strpos($cur_url,'direction-route')===false)
{ 
    $pu=str_replace('-',' ',str_replace('+',' ',str_replace('direction-from-','',strtok($cur_url,'@'))));
    $pu=explode('@',str_replace('?','',str_replace('%40','@', ucwords($pu))))[0];
    $title="MapmyIndia Move: Get map direction from ".str_replace('?','',$pu);
    $og_desc="India's first super map app with voice-guided directions Get step-by-step voice-guided directions to your destination with live traffic-updates and ETA along the route";
    $description="Get map direction from $pu by Mapmyindia. Find location,directions,places & brands near $pu";
    $keywords="Get map Direction from $pu";
    require_once 'index.ctp';die;
}
else if(strpos($cur_url,'near-')!==false && strpos($cur_url,'near-new')===false)
{ 
    $pu=str_replace('?','',str_replace('-',' ',str_replace('+',' ',str_replace('near-','nearby ',strtok($cur_url,'@')))));
    $title=ucfirst($pu)." , search ".ucfirst($pu);
    $description="$pu";
    $keywords="Map for $pu";
    require_once 'index.ctp';die;
}
else if(strpos($cur_url,'what-div')!==false)
{
    require_once 'what_div.php';die;
}
else if($cur_url=="direction-route")
{
    /*require_once 'direction_bal.php';die;*/
    require_once 'new_direction.php';die;
}
else if($cur_url=="along-route")
{
    require_once 'alongroute.php';die;
}
else if(strpos($cur_url,'QR?')!==false)
{
    require_once 'QR/index.php';die;
}
else if($cur_url=="print")
{
    require_once 'print.php';die;
}
else if($cur_url=="measure")
{
    require_once 'measure.php';die;
}
else if(strpos($cur_url,'geoAnalytics')!==false)
{ 
    if(strpos($cur_url,'&')===false) {require_once 'current_date_election.php';die;}
    else
    {
     $url="https://uatgeoanalytics.mapmyindia.in/".str_replace('~','/',str_replace('geoAnalytics?','',$cur_url))."&key=move_web"; 
     
     if(strpos($cur_url,'image')!==false)
     { 
         $FLS=file_get_contents($url);
         header('Content-Type:image/png ');die($FLS);  
     }
     $object = new globals();
     $resp=$object->curl('get',$url,$param);
     if($resp)
     {
        echo json_encode($resp);
     }
     die;
    }
}
else if(strtolower($cur_url)=="shortcut")
{
    header('Content-type: application/internet-shortcut');
    header('Content-Disposition: attachment; filename="Move.URL"');
    echo "[InternetShortcut]\nURL=https://maps.mapmyindia.com/\nIconFile=https://maps.mapmyindia.com/map7.1/images/favicon.ico\nIconIndex=1";
    die;
}
else if($cur_url=="area")
{
    require_once 'area.php';die;
}
else if(strpos($cur_url,'logs')!==false)
{
    require_once 'logs_bal.php';die;
}
else if(strpos($cur_url,'send_feedback')!==false)
{
   require_once 'send_feedback.php';die(); //require_once 'get_geo.php';die;
}
else if($cur_url=="getAdvices")
{
    require_once 'getAdvices.php';die;
}
else if($cur_url=="submit-issue-feedback")
{
    require_once 'submit_issue.php';die;
}
else if(strpos($cur_url,'userAuth')!==false|| strpos($cur_url,'API')!==false)
{
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
    header('Pragma: no-cache');
    require_once 'auth.php';die;
}
else if($cur_url=="intouch_devices")
{
     echo "<script>$('#g_saves,#g_saves_new,#notication_id').show();</script>"; 
     require_once 'my_devices.php'; 
     try{$num_devices=my_devices::getentities('');}  catch (Exception $e){}
     if($num_devices) $_SESSION['num_devices']=$num_devices;
     /*if($_SESSION['user_name']) {echo "<script>$('#g_saves,#g_saves_new,#notication_id').show();</script>";}*/
     if($num_devices>0){echo "<script>$('#g_devices').show();</script>";}
     /*if($num_devices==0){echo "<script>$('#my_wevices').hide();</script>";}*/
     if(!$num_devices) echo ", 0 Device";
     else if($num_devices<=1) echo ", ".$num_devices." Device";
     else if($num_devices>1) die(", ".$num_devices." Devices");
     die;
     
}
else if($cur_url=="notification")
{
    require_once 'notification.php';die;
}
else if(strpos($cur_url,'cities_list')!==false)
{
   require_once 'cities.php';die;
}
else if(strpos($cur_url,'traffic_Data')!==false)
{
    require_once 'trafficData.php';die;
}
else if(strpos($cur_url,'image-')!==false)
{
    require_once 'image.php';die;
}
else if(strpos($cur_url,'take_tour')!==false)
{
    require_once 'take_tour.php';die;
}
else if(strpos($cur_url,'brand-helper')!==false)
{
    require_once 'brand_helper.php';die;
}
else if(strpos($cur_url,'near-new')!==false)
{
    require_once 'nearby-new.php';die;
}
else if(strpos($cur_url,'get_click_revg')!==false)
{
    require_once 'get_click_revgeocode.php';die;
}
else if(strpos($cur_url,'err_mess')!==false)
{
    
    require_once 'Err_mess.php';die;
}
else if(strpos($cur_url,'twitter')!==false)
{
    require_once 'social/twitter/process.php';
    $twitter = new TwApp();
    $twitter->login();
    die();
}
else if(strpos($cur_url,'facebook')!==false)
{
    require_once 'social/facebook/process.php';
    $facebook = new FbApp();
    $facebook->login();
    die();
}
else if(strpos($cur_url,'reset')!==false && $cur_url !="reseted")
{
  //  require_once 'reset.php';
     require_once 'index.ctp';
    die();
}
else if(strpos($cur_url,'verify')!==false)
{
    require_once 'verify.php';
    die();
}
else if(strpos($cur_url, 'short')!==false)
{
    require_once 'explore-api/constant.php';
    processShortener();
    die();  
}
else if(strpos($cur_url, 'getIntouch')!==false)
{
    require_once 'getIntouch.php';
    die();  
}
else if(strpos($cur_url,'share_location')!==false)
{
   require_once 'share_location.php';die;
}
else if(strpos($cur_url,'similar_places')!==false)
{
    require_once 'similar_places.php';die;
}
else if(strpos($cur_url,'report_list')!==false)
{
    require_once 'report_list.php';die;
}
else if(strpos($cur_url,'enquiry_list')!==false){
    require_once 'enquiry_list.php';die;
}
else if(strpos($cur_url,'share-link')!==false)
{
    require_once 'share_link.php';die;
}
else if(strpos($cur_url,'still_image')!==false)
{   //die($rest."/".$cur_url);
    $cur_url=end(explode('/',$_SERVER["REQUEST_URI"]));
    if(!$_GET['markers']) $cur_url.="&markers=".strip_tags($_GET['center']);
    $FLS=file_get_contents($rest."/".$cur_url);
    if($FLS) {header('Content-Type:image/png ');die($FLS); }
    else die("");
}
else if(strpos($cur_url,'pimage')!==false)
{   //die($rest."/".$cur_url);
   echo $path=strip_tags($_GET['u']);
    $FLS=file_get_contents($path);die($FLS);
    if($FLS) {header('Content-Type:image/png ');die($FLS); }
    else die("");
}
else if($cur_url=='robots.txt')
{
    header("Content-Type: text/plain");
    if($actual_link=='https://maps.mapmyindia.com/robots.txt'){
        echo "Sitemap: https://maps.mapmyindia.com/sitemap.xml";
        die('User-agent: *
Allow: /');}
    else{
        die('User-agent: *
Disallow: /');}
}
else if(strpos($cur_url,'corona')!==false && strpos($cur_url,'@corona')==false)
{
    require_once 'covid-19/corona.php';die;
}
else if(strpos($cur_url,'mp3')!==false)
{
    
    $u=str_replace('$','/',strip_tags($_GET['u']));
    if($u && strpos($u,'http')!==false)
    { 
        header('Content-Type: audio/mpeg');
        header('Cache-Control: no-cache');
        header("Content-Transfer-Encoding: chunked"); 

        $fls=file_get_contents($u);
        die($fls);
    }
    die;
}
else if(strpos($cur_url,'safety_handler')!==false)
{
    require_once 'safetypages/safety.php';die;
}
else if (strpos($cur_url, 'safety_curl') !== false) {
require_once 'safetypages/safety_curl.php';
die;
}
else if(strpos($cur_url,'covid-19')!==false )
{
    header("location:".str_replace('covid-19','corona',$cur_url));
}
else if(strpos($cur_url,'captcha')!==false)
{
    $txt = explode('img-',$actual_link);
    #die(print_r($txt));
    header("Content-Type: image/png");
    $im = @imagecreate(100, 30);
    $background=imagecolorallocate($im,0,0,0);
    $white = imagecolorallocate($im, 128, 128, 128);
    imageline($im, 10, 10, 15, 2, $white);
    imageline($im, 10, 20, 35, 2, $white);
    imageline($im, 80, 30, 45, 2, $white);
    imageline($im, 20, 20, 75, 2, $white);
    imagecolortransparent($im,$background); 
    $text_color = imagecolorallocate($im, 148, 148, 148);
    $grey = imagecolorallocate($im, 128, 128, 128);
    imagestring($im, 5, 10, 5,  $txt[1], $text_color);
    imagettftext($im, 8, 0, 05, 5, $grey, $font, $captch_k);
    imagettftext($im, 2, 0, 14, 3, $text_color, $font, $captch_k);
    imagepng($im);
    imagedestroy($im);die;
}
else 
{ // echo substr($_SERVER["REQUEST_URI"], strrpos($url, '/') + 1);die;die($_SERVER["REQUEST_URI"]);
   
    $url_found="no";
    if(substr($_SERVER[REQUEST_URI], -1)=='/' && $cur_url) header("location:".substr($actual_link,0,-1));
    $cur_url=str_replace('alert','',str_replace('%3d','',strip_tags(urldecode($cur_url))));

  
  
    require_once 'index.ctp';
    die;
}




?>


-----------dbconnector---------
<?php

/**
 * Description : List what all databases are used for connectivity within maps.mapmyindia.com
 * @author Vishwajit Pathak
 * @version 1.0
 * @copyright CE Infosystems Pvt. Ltd. 
 */
class DBConnector 
{

    private $PG_DBASE = "place6_1";
    private $PG_HOST = "localhost";
    private $PG_USER = "postgres";
    private $PG_PWD = "mmicloud";
    private $MS_DBASE_PROD = "mmi_global_v2";
   // private $MS_HOST_PROD = "99.0.70.50";
    private $MS_HOST_PROD = "99.0.5.100";
    private $MS_USER_PROD = "mapsusr";
    private $MS_PWD_PROD = 'bWFwc1BXRF8yMzc=';
    private $MS_DBASE = "mmi_global_v1";
    private $MS_HOST = "localhost";
    private $MS_USER = "root";
    private $MS_PWD = "";
    public function getPGDB() 
    {
        return $this->PG_DBASE;
    }

    public function getPGConnector() 
    {
        $connect = pg_connect("host=" . $this->PG_HOST . " dbname=" . $this->PG_DBASE . " user=" . $this->PG_USER . " password=" . $this->PG_PWD);
        if (!$connect)
        {
            die("PGDB Connection failed.");
        }
        return $connect;
    }

    public function getMYSQLConnection() 
    { 
        $host=$this->MS_HOST;$mysql_user=$this->MS_USER;$mysql_pwd=  base64_decode($this->MS_PWD);$mysql_db=$this->MS_DBASE;
        if(strpos($_SERVER['HTTP_HOST'],'mapmyindia.')!==false)
        {
           $host=$this->MS_HOST_PROD;$mysql_user=$this->MS_USER_PROD;$mysql_pwd=  base64_decode($this->MS_PWD_PROD);$mysql_db=$this->MS_DBASE_PROD; 
        }
        $connect = mysql_connect($host, $mysql_user, $mysql_pwd);
        mysql_select_db($mysql_db, $connect) or die("Database Connection failed.".mysql_error());
        return $connect;
    }
    public function getMYSQLPreparedConnection() 
    { #echo "yes<hr>";die;
        $user_agent=$_SERVER['HTTP_USER_AGENT'];
        if(strpos(strtolower($user_agent),'bot')!==false) return FALSE;
        
        $host=$this->MS_HOST;$mysql_user=$this->MS_USER;$mysql_pwd= base64_decode($this->MS_PWD);$mysql_db=$this->MS_DBASE;
        
        if(strpos($_SERVER['HTTP_HOST'],'mapmyindia')!==false)
        {
           $host=$this->MS_HOST_PROD;$mysql_user=$this->MS_USER_PROD;$mysql_pwd=  base64_decode($this->MS_PWD_PROD);$mysql_db=$this->MS_DBASE_PROD; 
        }
        #die($host."#".$mysql_user."#".$mysql_pwd."#".$mysql_db);
        $connect = mysqli_connect($host,$mysql_user, $mysql_pwd, $mysql_db);
        if (mysqli_error($connect)) 
        {
            die("Unable to connect, try later");
	    header('HTTP/1.1 404 Not Found', true, 404);
            exit();
            return false;
        }
        return $connect;
    }


    public function freeResult($res) 
    {
        $isFree = false;
        try 
        {
            $isFree = pg_free_result($res);
        } 
        catch (Exception $e) 
        {
            echo $e;
        }
        return $isFree;
    }
    function logs($history)
    {    
	$ses_id = session_id().date('mdY');$user_agent=$_SERVER['HTTP_USER_AGENT']; 
	if($_SESSION['last_history']!=$history && $history && $ses_id && strpos($user_agent,'bot')===false) 
	{
            $ip=($_SERVER['HTTP_X_FORWARDED_FOR']?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']);
            $data=date('H:i')."   ".$ip."   ".($_SESSION['user_name']?"(User:".$_SESSION['user_name'].")":"").$history."\n";
            $fl="../tmp/error-logs/issues.log";
            if($_SERVER['HTTP_HOST']=='maps.mapmyindia.com') $fl="/mnt/vol1/error-logs/issues.log";
            error_log($data,3,$fl);
	    /*
            $ltime=date('Y-m-d H:i');$ct=date('d:H');$history.="@$ct";
            $ip=($_SERVER['HTTP_X_FORWARDED_FOR']?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']);
            $con = self::getMYSQLPreparedConnection();
            $user=mysqli_real_escape_string($con,$_SESSION['user_name']);
            $ip=mysqli_real_escape_string($con,$ip);
            $user_agent=mysqli_real_escape_string($con,$_SERVER['HTTP_USER_AGENT']);
            $history=mysqli_real_escape_string($con,$history);
            $host=mysqli_real_escape_string($con,$_SERVER['SERVER_NAME']);
            $referal=str_replace("https://".$host,'',$_SERVER['HTTP_REFERER']);//if(strpos($referal,$host)!==false) $referal="";
            $referal=mysqli_real_escape_string($con,$referal);
            $sql="insert into logs(user,time,login_time,history,session_id,referal,ip,user_agent) values('$user','$ltime','$ltime','$history','$ses_id','ref:$referal,$referal','$ip','$user_agent') ON DUPLICATE KEY UPDATE history=concat('$history',';',REPLACE(history,'$history','')),time='$ltime',user='$user'";
            mysqli_query($con,$sql);	
            if($_SESSION['user_name']=='balmukand' && mysql_error ()) die(mysql_error ());
            mysqli_close($con);*/
            unset($_SESSION['ref']);
            $_SESSION['last_history']=$history;
	}
    }
}

?>

----------index.ctp-------
<?php
$obcat=1;
function callback($buffer)
{
  return (str_replace(array("\n", "\r","\t"),"", $buffer));
}


if($obcat) ob_start("callback");
/**
 * 
 * version 7.1 chnages ##history in search,move app text,current location asking in direction search##191118
 * dated 28 Apr 2016
 * @author  balmukand
 * @copyright   Copyright (c) CE Info System Pvt. Ltd.(MapmyIndia),(http://m.mapmyindia.com/maps)
 * chmod -R 777 app/tmp/cache/
 */
#session_destroy();
#die($_SERVER['HTTP_USER_AGENT']."!".$_SERVER['LOCAL_ADDR']."!".$_SERVER['LOCAL_PORT']."!".$_SERVER['REMOTE_ADDR']);
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
header('Pragma: no-cache');
session_start();
error_reporting(0);


$ref=$_SERVER['HTTP_REFERER'];
if($ref && strpos($ref,'maps.mapmyindia.com')===false) $_SESSION['ref']=$ref;
if($_SERVER['HTTP_X_FORWARDED_PROTO']!== "https" && strpos($_SERVER['HTTP_HOST'],'aps.mapmyindia')){$redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];header('HTTP/1.1 301 Moved Permanently');header('Location: ' . $redirect);exit();}
  function sanitize_output($buffer) {
    $search = array('/\>[^\S ]+/s',  '/[^\S ]+\</s','/(\s)+/s','/<!--(.|\s)*?-->/');$replace = array('>','<','\\1', '');
    $buffer = preg_replace($search, $replace, $buffer);return $buffer;
  }

//ob_start("ob_gzhandler");
$_SESSION['popup'] = ((!empty($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'],$_SERVER['HTTP_HOST']) === FALSE) || !empty($_COOKIE['popupState'])) ? 1 : 0;
if(strpos($cur_url,'fbclid')){
    $nurl=explode('fbclid',$cur_url);
    header('HTTP/1.1 301 Moved Permanently');header('Location: ' .substr($nurl[0],0,-1));exit();
}
require_once 'globals.php';
$_SESSION['auth']=1;
$UFL = 0;
$today=date('Y-m-d');
if($_GET['1']==1) { $UFL = 1; }
require_once realpath(dirname(__FILE__) . '/Mobile_Detect.php');
$detect = new Mobile_Detect;
$mobile = ($detect->isMobile()) ? 1 : 0;
$HTTP_USER_AGENT = strtolower($_SERVER['HTTP_USER_AGENT']);
unset($_SESSION['deviceTp']);
if((bool) strpos($HTTP_USER_AGENT, 'android')) $_SESSION['deviceTp'] = 'android';
else if(!$android && ((bool) strpos($HTTP_USER_AGENT, 'iphone') || (bool) strpos($HTTP_USER_AGENT, 'ipod'))) $_SESSION['deviceTp'] = 'iphone';
#print_r($_SESSION);die;

$deviceType = str_replace('=', '', base64_encode('mapmyindia@'.$mobile.'@mapmyindia'));
$og=explode("data=",$cur_url);$cntr="center=24.595939499830784,77.22556114196777&zoom=4&markers=24.595939499830784,77.22556114196777";
$near_txt="me";

/*if(!$_SESSION['latlng'] && !$og[0] && strpos(strtolower($user_agent),'bot')===false)
{
    try{
    if(!$con){   
        require_once 'DBConnector.php';
        $db = new DBConnector;
        $con = $db->getMYSQLPreparedConnection();
    }
    $sql = "select lat,lng from ip_lat where ip='" . ($_SERVER['HTTP_X_FORWARDED_FOR']?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']) . "' limit 1";
    if ($result=mysqli_query($con, $sql)){ $row=mysqli_fetch_array($result,MYSQLI_ASSOC);$_SESSION['latlng'] = $row["lat"] . "," . $row["lng"];}
    if($con) mysqli_close($con);
    }catch(Exception $e) {}
}*/
if($_SESSION['latlng']) {$latlng = explode(',', $_SESSION['latlng']);$latn=$latlng[0];$lngn=$latlng[1];}
else  {$latn = '28.7041';$lngn = '77.1025';} 
if(strpos($og[0], 'near-me') && strpos($og[0], 'place-')===false) $cur_url ="place-". basename($cur_url).'?@zdata='.base64_encode($latn.'+'.$lngn.'+17++'.str_replace('-near-me', '', basename($cur_url)));
if($og[1]){$og_v=  base64_decode(str_replace('ed','',$og[1]));}
$audd="";
if(strpos($og[0],'place-')===0 || strpos($_SERVER['REQUEST_URI'], 'near-me') == true)
{
  //if(strpos($cur_url, 'near-me') == true) $cur_url = $string;
  
  $exp_str =explode('?@zdata=',$_SERVER['REQUEST_URI']);
  $dcodedstrng=base64_decode($exp_str[1]);
  $exp_pipe=explode('|',$dcodedstrng);
  $model_filter=$exp_pipe[3];
  if(strpos($model_filter,"hyundai")!==false){
    $model_filter='Hyundai';
  }else if(strpos($model_filter,"audi")!==false){
    $ftl=1;
    // echo "<script>if(timer) clearInterval(timer);</script>";
    $model_filter='Audi';
    $audd='style="display:none;"';
    
  }
  //die($model_filter);
  $img_c=explode('+',$og_v);$cntr="center=$img_c[0],$img_c[1]&zoom=$img_c[2]&markers=$img_c[0],$img_c[1]";
  if($img_c[3]!=='0' || ($cur_url && substr($cur_url,0,1)=='@' && strlen($cur_url)==7))
  { 
    
    require_once realpath(dirname(__FILE__ ) . '/details.php');
        $near_txt=str_replace('place-','',str_replace(['?@z','@z'],'',substr($og[0],(strpos($og[0],'-near-')?strpos($og[0],'-near-')+6:strpos($og[0],'place-')),strlen($og[0]))));
        
        $details=details::info($cur_url,1,$model_filter);$script;
        #print_r($details);die;
        if(!empty($details['html'])) 
        {
          $infoHtml=$details['html'];$ogstar=($details['star']?"[".$details['star']."] ":"");
          if($details['title']) $title=$details['title'];
          $cntlatlng=explode(',',$details['cood']);
          if($details['cood']) $cntr="center=$cntlatlng[0],$cntlatlng[1]&zoom=17&markers=$cntlatlng[0],$cntlatlng[1]";
          $oginfo=explode(', ',$title);
          $ogtitle=ctype_digit($oginfo[0])?$title:$oginfo[0];
          $og_desc=$ogstar.implode(' ',array_slice($oginfo,1));
          if($details['eloc']) $ogsimilar='<link rel="canonical" href="https://maps.mapmyindia.com/@'.$details['eloc'].'" />';
          }
          else 
          {
            
            $infoHtml=$details;$title=$og_keywrd=$og_desc=$description=$keywords="";
          }
          
          #die($infoHtml);
        $drag=1;
        if(strpos($infoHtml,'Network Issue'))$infoHtml="";
        if(!$infoHtml)
        {
          require_once realpath(dirname(__FILE__ ) . '/404.php');
          header("HTTP/1.0 404 Not Found");$description='';$og_url='';$keywords='';$title='';$infoHtml=$infores;$script="<script>window.history.pushState('not-found' , '', 'not-found');</script>";
          
        }
      }
      #print_r($img_c);die;
    }
    else if($cur_url=='my-world-data')
    {
      $listId =  401;
      $userId = (!empty($_SESSION['userId'])) ? $_SESSION['userId'] : 401;
      $own = ($_SESSION) ? 1 : 0;
      require_once realpath(dirname(__FILE__ ) . '/my_world.php');
      $world = new my_world();
      require_once realpath(dirname(__FILE__ ) . '/Auth_login.php');
      $object = new Auth_login();
      $infoHtml=$world->getworld($object,$page);
      // print_r($html);die('dd');
    }
    
    if(strpos($og[0],'-near-')!==false){$img_c=explode(',',$og_v);$cntr="center=$img_c[1],$img_c[0]&zoom=11&markers=$img_c[1],$img_c[0]";}
    if(strpos($og[0],'direction-')!==false)
    {
      $img_c=explode('+',$og_v);$img_fv=explode(',',urldecode($img_c[1]));$img_tv=explode(',',urldecode($img_c[3]));$cntr="center=$img_tv[1],$img_tv[0]&zoom=4&markers=$img_tv[1],$img_tv[0]|$img_fv[1],$img_fv[0]";
      
    }
    if($cntr) $og_url="https://maps.mapmyindia.com/still_image?size=300x200&ssf=0&".$cntr;
      if(substr($cur_url,0,1)=='?' && strlen($cur_url)==7) {header('HTTP/1.1 301 Moved Permanently');header('Location: ' . str_replace('?','@',$cur_url));exit();}
      
      if(substr($cur_url,0,1)=='@' && strlen($cur_url)==7)
      {
        
        require_once realpath(dirname(__FILE__ ) . '/details.php');
        $details=details::info($cur_url,1);
        $cat_dis = 1;    #print_r($details);die;
        if(!empty($details['html'])) 
        {
          $infoHtml=$details['html'];$ogstar=($details['star']?"[".$details['star']."] ":"");
          $oginfo=explode(', ',$title);
          $cntlatlng=explode(',',$details['cood']);
          if($details['cood']) $cntr="center=$cntlatlng[0],$cntlatlng[1]&zoom=17&markers=$cntlatlng[0],$cntlatlng[1]";
          $ogtitle=ctype_digit($oginfo[0])?$title:$oginfo[0];
          $og_desc=$ogstar.implode(' ',array_slice($oginfo,1));
          if($details['title']) $title=$details['title'];
          if($details['eloc']) $ogsimilar='<link rel="canonical" href="https://maps.mapmyindia.com/@'.$details['eloc'].'" />';
          }  
        }
        else if(strpos($cur_url,'@')===false && $cur_url && !$title) {$title=str_replace('?,','',str_replace('+','',str_replace('-',' ',  strip_tags(ucwords($cur_url)))));$description=$title;}
        if(strpos($actual_link,'@review=')!==false||strpos($actual_link,'review?')!==false || strpos($actual_link,'review%3D')!==false)
        {
          $user_save=explode('@',str_replace('~',' ',urldecode($actual_link)));
          $pinId=$user_save[1];
          if($pinId)
          {
            if(!$object){
              require_once realpath(dirname(__FILE__ ) . '/Auth_login.php');
              $object = new Auth_login();}
              $response=$object->pin_details($pinId,'review',401);
              $placeId=$response['response']['placeId'];
              $imgurl=exploreApi_v21;
              $imgurl.= $placeId."/assets";
              $response_call_img=globals::curlWithHeader('get','',$imgurl);
              $response_img= json_decode(json_encode($response_call_img),TRUE);
              #echo "<pre>"; print_r($response_img);die($imgurl);
              foreach ($response_img['response']['assets'] as $arr) {
                if($arr['type']=="place") $img_og = $arr['imageObject']['original'];
              }
              
              #echo "<pre>"; print_r($response);die;
              $addedBy=$response['response']['addedBy'];
              $place_name=$response['response']['placeName'];
              $place_lat=$response['response']['latitude'];
              $place_lng=$response['response']['longitude'];
              $pin_story=$response['response']['description'];
              $pin_rate=$response['response']['rating'];
              if($pin_rate){
                $og_star=$pin_rate." ";
                for($i=0;$i<5;$i++)
                {
                  if($i<$pin_rate) $og_star.="★"; else $og_star.="☆";                       
                }
              }
              #echo "<pre>"; print_r($response);die;
            }
            #print_r($user_save);die;
            if($place_name) $p_name = "of ".$place_name;
            if($addedBy) $n_name = " by ".$addedBy;
            $title="Mapmyindia Move Review ".$p_name.$n_name;
            #$title="Mapmyindia Move review of ".$place_name." by ".$addedBy;
            $description=$title." - ".$pin_story;
            if($pin_rate) $rate_st = " Rating: ".$og_star; else $rate_st = '';
            if($pin_story) $story = " Review: ".substr($pin_story,0,50)."...more";
            $og_desc=$rate_st.$story;
            #$og_desc=" Rating: ".$og_star." Review: ".substr($pin_story,0,50)."...more";
            if($img_og)$og_url=$img_og; 
            elseif($place_lat) $og_url="https://maps.mapmyindia.com/still_image?size=300x200&ssf=0&zoom=14&center=$place_lat,$place_lng";
            }
            
            if(strpos($actual_link,'report@')!==false)
            {
              $user_save=explode('@',str_replace('~',' ',urldecode($actual_link)));
              $pinId=$user_save[3];
              if($pinId)
              {
                if(!$object){
                  require_once realpath(dirname(__FILE__ ) . '/Auth_login.php');
                  $object = new Auth_login();}
                  $response = $object->Place_report(401, 401, 401, $pinId, 401, 401, 0);
                  #print_r($response);die;
                  $addedBy=$response['response']['report']['addedByName'];
                  $place_name=$response['response']['report']['placeName'];
                  $place_lat=$response['response']['report']['latitude'];
                  $place_lng=$response['response']['report']['longitude'];
                  $cat= $response['response']['report']['parentCategory'];
                  $ccat= $response['response']['report']['childCategory'];
                  $cat_name= $response['categories'][$cat];
                  $scat_name= $response['categories'][$cat."-".$ccat];
                  #$pin_story=$response['data'][0]['pin_story'];
                  #$cat_name=$response['data'][0]['cat_name'];
                  #$scat_name=$response['data'][0]['child_cat_name'];
                  $title=$user_save[4]." Reported ".$user_save[3];
                  $description=$title." - ".$user_save[6];
                  if($scat_name && $cat_name) $cat_body = $scat_name." - ".$cat_name;
                  if($place_name) $p_name = "at ".$place_name;
                  if($addedBy) $n_name = " by ".$addedBy;
                  $title="Mapmyindia Move Report ";
                  #$og_desci=$addedBy." Reported - ".$cat_name." [$scat_name]";
                  $og_desc="Checkout ".$cat_body." issue reported ".$p_name.$n_name;
                  if($place_lat) $og_url="https://maps.mapmyindia.com/still_image?size=300x200&ssf=0&zoom=17&center=$place_lat,$place_lng";
                    #echo "<pre>"; print_r($response);die;
                  } 
                }
                if(strpos($actual_link,'checkin@')!==false){
                  $user_save=explode('@',urldecode(str_replace('~',' ',$actual_link)));$title=$user_save[3]." CheckedIn ".$user_save[1];$description=$title." - ".$user_save[5];$og_desc=$user_save[5];
                  $og_url="https://maps.mapmyindia.com/still_image?size=300x200&ssf=0&zoom=17&center=".$user_save[4];}
                  if($_SESSION['deviceTp']=='android')
                  {
                    $store_link="https://play.google.com/store/apps/details?id=com.mmi.maps&hl=en";
                  }
                  else 
                  {
                    $store_link="https://itunes.apple.com/in/app/map-directions-local-searches-travel-guide/id723492531?mt=8";
                  }
                  /*require_once 'maplayer.php';*/
                  ?>
<!DOCTYPE html>
<html lang="en">
  
  <head>
    <meta charset="utf-8">
    <title><?php if($title) echo preg_replace('/[^A-Za-z0-9\. -]/', '',str_replace('$','/',urldecode (strip_tags($title)))); else echo "MapmyIndia Maps, Driving Directions, Nearby Local Places";?></title> 
    <meta name="description" content="<?php if($description) echo str_replace('$','/',urldecode (strip_tags($description))); else echo "Get directions to any place with lives traffic updates. Find nearby businessses, restaurants, hotels, petrol pumps, Parking, Atms and more.Explore now!.";?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <meta name="keywords" content="<?php if($keywords) echo str_replace('$','/',urldecode (strip_tags($keywords))); else echo "move, map of india, india map, map directions, search nearby, live traffic, maps, map, nearbuy, near me, map location, search location, location, location on map";?>">
    <meta name="author" content="">
    <meta name="theme-color" content="#2a445b" />
    <meta name="apple-mobile-web-app-capable" content="no">
    <meta property="og:image" itemprop="image" content="<?php echo strip_tags($og_url);?>" />
    <meta property="og:image:width" content="256" />
    <meta property="og:image:height" content="256" />
    <meta property="og:title" content="<?php if($title) echo str_replace('$','/',urldecode (strip_tags(($ogtitle?$ogtitle:$title)))); else echo "MapmyIndia: India Map with Live Traffic, Get Maps Directions, Search Location Nearby.";?>">
    <meta property="og:description" content="<?php if( $og_desc) echo str_replace('$','/',urldecode (strip_tags($og_desc))); else echo "India map with live traffic, location search, maps directions. Search nearby restaurants , hotels, parking, petrol pumps on MapmyIndia Maps.";?>">
    <meta property="og:keywords" content="<?php if($og_keywrd) echo str_replace('$','/',urldecode (strip_tags($og_keywrd))); else echo "maps, map, map of india, india maps, live maps, live traffic, location, search location, map location.";?>">
    <meta property="twitter:title" content="<?php if($title) echo str_replace('$','/',urldecode (strip_tags(($ogtitle?$ogtitle:$title)))); else echo "MapmyIndia: India Map with Live Traffic, Get Maps Directions, Search Location Nearby.";?>">
    <meta property="twitter:description" content="<?php if( $og_desc) echo str_replace('$','/',urldecode (strip_tags($og_desc))); else echo "India map with live traffic, location search, maps directions. Search nearby restaurants , hotels, parking, petrol pumps on MapmyIndia Maps.";?>">
    <meta name="twitter:image" content="<?php echo strip_tags($og_url);?>" />
    <link rel="apple-touch-icon" href="images/mmi-logo.png">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">
    <?php echo $ogsimilar; if($mobile) {?>
      <link rel="manifest" href="manifest.json">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="black">
      <meta name="apple-mobile-web-app-title" content="Move">
      <link rel="apple-touch-icon" href="images/ic_move_logo.png">
      <meta name="msapplication-TileImage" content="images/ic_move_logo.png">
      <meta name="msapplication-TileColor" content="#2F3BA2">
      <?php } ?>
      <base href="<?php echo $root?>/">
      <meta name="google-site-verification" content="ZvTidYVRS_7GDM4ymrQaOKMRXWFmfC3E9vf84aRkJYc" />
      <link rel="stylesheet" href="<?php echo _CSS_; ?>/?<?php echo (LOG?LOG."=":CACHE_DT); ?>.css" media="all">
      <link rel="stylesheet" href="<?php echo _CSS_; ?>/leaflet-cluster.css">
      <?php
    /*
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/themify-icons.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/font-awesome.min.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/jquery-ui.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/resultsx.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/map.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/leaflet-mmi.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/themify-icons.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/owl.carousel.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/slider.css">
    <link rel="stylesheet" href="<?php echo _CSS_; ?>/jquery.mCustomScrollbar.css">
    */
    if(strpos($_SERVER['HTTP_HOST'],'.mapmyindia.com')!==false)
    {
      /*<!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-17882747-9"></script>
      <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-17882747-9');
      </script>*/
      ?>    
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-P8HWD5J');</script>
    <!-- End Google Tag Manager -->
    <?php }  ?>
    
  </head>
  <body>
    <?php if($config_files['diwali']['date_start']<=$today && $config_files['diwali']['date_end']>=$today) {?>
      <div class="deep-bottom-img">
        <div class="deep-img-repeat"></div>
      </div>
      <?php }?>
      <div id="error"></div>
      <div class="loaderDiv1" id="loader">
        <div class="spinner bottomSpinner">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" focusable="false">
            <circle cx="14" cy="14" r="12" fill="none" stroke="#000" stroke-width="2" opacity=".15"/>
            <circle pathLength="1" cx="14" cy="14" r="12" fill="none" stroke="#e52629" stroke-width="3" stroke-dasharray="27 57" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>
    <!--div id="loader"></div-->
    <div id="z-popup"></div>
    <div style="display: none;" id="top_modal"></div>
    <div style="display: none;" id="error_modal" class="show_modal"></div>
    <div style="display: none;" id="modal_new"></div>
    <div class="success-message-alert"></div>
    <div class="eloc-message-alert"></div>
    <div id="show_pano"></div>
    <div id="eloc_tap"></div>
    <div id="tap_dv" onclick="tap_action()">
      <img src="images/poi_brand.png" style="width:30px">
      <span>Move map to adjust & Click here</span>
    </div>
    <div id="uap_tap_dv" onclick="tap_addPlace()" style="display:none;"  >
      <img src="images/poi_brand.png" style="width:30px">
      <span>Move map to adjust</span>
      <div class="digi-tooltip add-bus-tooltip" id="eloc_tap_dv" style="display:none;">
        <div class="create-eloc-sec" id="success_sec" style="display: block;bottom: 28px;left: -120px;">
          <ul class="addp-search-item">
            <li class="addp-map-marker"><i class="fa fa-map-marker"></i> Current Marker Location</li>
            <li id="indexplacename_bus" class="iaddp-name"></li>
            <li id="indexplaceaddr_bus" class="iaddp-addr"></li>
          </ul>
          <div class="buttonDiv"><button class="btn btn-primary" >Done</button></div>
        </div>
      </div>
    </div>
    <div class="whatsnewWidgetSec" style="display:none;">
      <div class="whatsnewOverlay"></div>
      <div class="whatsnewMainWidget">
        <div class="whatsnewMainWidgetHeader clearfix">
          <h2>What's New</h2>
          <a href="javascript:void(0)" onclick="$('.whatsnewWidgetSec').hide();" class="widgerClose">
            <i class="material-icons">close</i>
          </a>
        </div>
        <div class="whatsnewMainWidgetBody">
          <div class="whatsnewListSec">
            <ul class="whatsnewList">
              
              </ul>
            </div>
          </div>  
        </div>
      </div>
      <div class="cookiesSec" style="display:none">
        <div class="cookiesImg">
          <img src="images/cookie.png" alt="" />
        </div>
        <div class="cookiesText">
          <h2>We use cookies</h2>
          <p>By using our site you agree to our use of cookies to deliver better site performance with a responsive map-experience.</p>
          <button class="btn btn-cookies" id="cookieClose">Got it</button>
        </div>
      </div>
      <div id="mapLayerTest"></div>
      
      <style>
        .covid-trigger-img {
          width: 72px;
          height: 72px;
          position: fixed;
          right: 10px;
          top: 60px;
          cursor: pointer;
          z-index: 1;
        }
        </style>
    <div class="covidTrigMain">
      <a style="display:none;" onclick="$('.get-eloc-sec-bus,.new-category-sec').show();$('.covid-trigger-img').hide();" class="covid-trigger-img">
        <img src="images/corona/fab_corona.png" alt="" />
        <span>COVID - 19 Guide</span>
      </a>
    </div>
    
    <div class="canvas" style="">
      
      <div class="top-header">
        
        
        <!-- profile-section -->
        
        <div class="profile" id='login_dv' <?php echo $audd; ?>>
          <?php 
     echo $menu_html[0];
     
     ?>
    </div>
    <?php


if($mobile==0){
  ?>
    <div class="download-app-trigger" <?php echo $audd; ?>>
            <div class="dropdown">
                <button class="btn btn-profile dropdown-toggle" type="button" data-toggle="dropdown" title="Move" alt="Move">
                                  <div class="get-app-icon">
                    <img src="images/ic_move_logo.png?<?php echo CACHE_DT; ?>" alt="" />
                  </div>
                                  <div class="get-app-text" alt="Get the app">
                                    <span class="profile-name">Get the app</span>
                                    <span class="down-arrow"><i class="ti-angle-down lhid" alt="Map app"></i></span>
                                  </div>
              </button>
              <ul class="dropdown-menu">
                  <li><a href="https://play.google.com/store/apps/details?id=com.mmi.maps&hl=en" target="_blank" rel="nofollow"><i class="fa fa-android"></i> Android</a></li>
                <li><a href="https://itunes.apple.com/in/app/map-directions-local-searches-travel-guide/id723492531?mt=8" target="_blank" rel="nofollow"><i class="fa fa-apple"></i> iOS</a></li>
        <li><a id="share_locations" class="share-poi share-eloc" onclick="share('https://maps.mapmyindia.com/getMove','share_link')" alt="Share Location" class="share_btn control-slide share-poi-new"><i class="material-icons">share</i> <span>Share App</span></a></li>
              </ul>
            </div> 
       </div>
       <div class="scale-sec whats-new-trig lhid">
            <div class="map-c-item clearfix">
                <a title="What's new" onclick="whatsNewPopup()">
                    <div class="red-dot red-mark" style="display: none;"></div>
                    <img src="images/ic_gift.png" style="width: 18px;padding-top: 9px;"></a>
            </div>
        </div>
        <div class="scale-sec lhid">
            <div class="map-c-item clearfix">
                <a id="area_dv" title="Measure Area&#13; Click to Start/Remove&#13; Double click to stop on map"><img src="images/ic_area.png" alt="" style="width: 24px;padding-top: 6px;"/></a>
                <a  nofollow="" title="Measure Distance&#13; Click to Start/Remove&#13; Double click to stop on map" id="scale_dv"><i class="material-icons lhid">straighten</i></a>
                <a class="map-zoom-out" title="Print" nofollow="" onclick="load_module('print')"><i class="material-icons lhid">print</i></a>
            </div>
        </div>
    <div class="scale-sec lhid" id="fscrn_dv" >
            <div class="map-c-item clearfix">
                <a title="Fullscreen"><img src="images/ic_fullscreen.png" style="width: 18px;padding-top: 9px;"></a>
            </div>
    </div>
<!--    <div class="download-app-trigger election-trigger" title="Checkout the Indoor Map" >
        <div class="dropdown">
        <button class="btn btn-profile dropdown-toggle" type="button" data-toggle="dropdown" title="Move" alt="Move">
          <div class="get-app-icon">
            <img src="images/ic_multi_floor.png" style="height: 32px;margin-top: 4px;margin-left: 13px;">
          </div>
          <div class="get-app-text" style="margin-left: 10px;padding-left: 5px;border-left: 1px solid #efefef;">
              <span class="profile-name"><a id="multi_dv"  style="color: #212121;">Indoor Map</a></span>
          </div> 
        </button>
        <ul class="dropdown-menu">
            <li>
                <a id="pragati-maidan" onclick="  indoormp='pragati-maidan'; maps.layerMarker[1].fire('click');map.panTo([28.616698,77.243695]);" target="_blank" rel="nofollow">Pragati Maidan</a>
            </li>
            <li>
                <a id="ind_expo" onclick=" indoormp='ind_expo' ; maps.layerMarker[2].fire('click');map.panTo([28.463059,77.497757]);" target="_blank" rel="nofollow">India Expo Mart</a>
            </li>
            <li>
                <a id="dlf_pro" onclick=" indoormp='dlf_pro';  maps.layerMarker[0].fire('click');map.panTo([28.542363,77.156028]);" target="_blank" rel="nofollow">Dlf Promenade</a>
            </li>
            <li>
                <a id="biec" onclick=" indoormp='biec'; maps.layerMarker[3].fire('click');map.panTo([13.062753,77.474869]);" target="_blank" rel="nofollow">BIEC</a>
            </li>
        </ul>

        </div>
     </div>-->
    <?php
     if( $mobile==0 )
        { ?>
     <style><?php echo $csnotcsss = file_get_contents(_CSS_."/notification.css");  ?></style>


     <div class="download-app-trigger mapNot" id="notication_id" style="display:none;" >
         <div class="dropdown">
        <button class="btn btn-profile dropdown-toggle" type="button" data-toggle="dropdown">
        <i class="material-icons">notifications</i>

        <span class="badge" id="not_cnt" style="display:none;">0</span>
       </button>
        <div class="dropdown-menu mainMapNotSec">
        <h2>Notifications <div id="ldr" class="NotLdr"><img src="images/loader_2_2.gif"></div></h2>
        <ul class="mapNotList" id="notif_data">

        </ul>
        </div>
        </div>
     </div>
    <!--Real View-->
       <div class="download-app-trigger election-trigger realviewMain" id="realv_trig">

         <div class="tooltip-info">
           
            <div class="tooltip-sec">
                <p>Get a full panoramic view of the real world
                    with Mapmyindia's real view right
                    from the comfort of where you are.
                </p>
            </div>
         </div>
        <div class="dropdown" > 
        <button id="realv_trig"  class="btn btn-profile dropdown-toggle" type="button" data-toggle="dropdown" title="Move" alt="Move" style="width:130px;">
          <div class="get-app-icon">
            <img src="images/360_Real_View.png" style="height: 32px;margin-top: 4px;margin-left: 13px;">
          </div>
          <div class="get-app-text" style="margin-left: 10px;padding-left: 5px;border-left: 1px solid #efefef;">
              <span class="profile-name"><a id="multi_dv"  style="color: #212121;">Real View</a></span>
          </div> 
        </button>
        <ul class="dropdown-menu" id="real_drop">
            <li>
                <a  target="_blank" rel="nofollow">Okhla Drive</a>
            </li>
        </ul>

        </div>
     </div>
   
 
    
    <?php
     }
    }
    ?>
    <?php 
        /*election2019*/
        if($config_files['election']['status']=1) {
    ?>
    <div id="election_modal" class="election_modal"></div>
    <style>
    
/**election **/

.download-app-trigger.election-trigger .btn-profile { border-radius: 30px;width: 160px;}
.election-trigger .get-app-text {float: left; margin-left: 4px;}
.election-trigger .get-app-switch {float: right;margin-top: 8px;margin-right: 10px;}
.switchBtn {float: right;}
.switchBtn .switch { position: relative;display: inline-block;width: 40px;margin-top: 0;margin-bottom: 0;}
.switchBtn .switch input {display: none;}
 .switchBtn .slider {position: absolute; cursor: pointer;top: 0;left: 4px; right: 0;bottom: 0;background-color: #ccc;-webkit-transition: .4s; transition: .4s; }
.switchBtn .slider:before {position: absolute;content: "";height: 18px; width: 18px;left: 1px;bottom: 1px;background-color: white;-webkit-transition: .4s;transition: .4s;         }
.switchBtn input:checked+.slider { background-color: #1a8ff7;}
.switchBtn input:focus+.slider {box-shadow: 0 0 1px #2196F3;}
.switchBtn input:checked+.slider:before {-webkit-transform: translateX(26px);-ms-transform: translateX(26px);transform: translateX(26px); right: 27px;left: auto;}
.switchBtn .slider.round { border-radius: 34px;}
.switchBtn .slider.round:before { border-radius: 50%;}

.download-app-trigger.realviewMain {
    position: relative;
    cursor: pointer;
}
.download-app-trigger.realviewMain .tooltip-info {
    display: inline-block;
    position: absolute;
    right: 5px;
    z-index: 1;
    top: 7px;
}
.download-app-trigger.realviewMain .tooltip-info a {
    color: #212121;
    padding: 5px;
}
.download-app-trigger.realviewMain .tooltip-info .tooltip-sec {
    width: 280px;
    text-align: left;
    right: 0;
    margin-top: 32px;
    background: #fff;
    padding: 10px;
    border-radius: 5px;
    color: #212121;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: none;
}
.download-app-trigger.realviewMain .tooltip-info .tooltip-sec:before {
    display: none;
}
.download-app-trigger.realviewMain:hover .tooltip-sec {
    display: block;
}

/*.election-trigger .tooltip-info a:hover + .tooltip-sec {
    display: block;
}*/

@media only screen and (max-width:767px) {
  .download-app-trigger.realviewMain {
    display: block;
  position: fixed;
  right: 10px;
  top: 82%;
  margin-top: -65px;
  z-index: -1;
}
.realviewMain .get-app-text {
    display: none;
}
.download-app-trigger.realviewMain .btn-profile {
    width: 36px !important;
    height: 36px;
    border-radius: 50%;
}
.realviewMain .get-app-icon {
    width: 36px !important;
}
.realviewMain .get-app-icon img {
    width: 24px;
    height: 24px !important;
    margin-top: 8px !important;
    margin-left: 3px !important;
}
.add-place-modal.real-view-modal .modal-body .multiLevel-body {
    height: 80vh;
}
}


    </style>
    <script>

    
/*  election*/
var clickdata='';
window.addEventListener("load", function()
{ 
   
    $(document).off("click","#election");
    $(document).on("click","#election",function(event)  
    {   
         if($("#election_checkbox").prop("checked") == true){
                $("#election_checkbox").prop('checked', false);
                if(typeof GeoDataLayer77 !== 'undefined') {
                if(border_layer)map.removeLayer(border_layer);
                map.removeLayer(GeoDataLayer11);
                map.removeLayer(GeoDataLayer22);
                map.removeLayer(GeoDataLayer33);
                map.removeLayer(GeoDataLayer44);
                map.removeLayer(GeoDataLayer55);
                map.removeLayer(GeoDataLayer66);
                map.removeLayer(GeoDataLayer77);
                $("#election_modal").html('').hide();clickdata="0";
                if(pop)  map.removeLayer(pop);}
                if($("#election_data").is(":visible")){$("#res_info").html('');}
            }
            else {
                try{close_eloc('all');close_cat();}catch(e){}$("#election_modal").load('geoAnalytics').show();clickdata="1";$("#election_checkbox").prop('checked', true);
            }
             event.preventDefault();
    });
});
</script>
<?php } if($config_files['chardham']['date_start']<=$today && $config_files['chardham']['date_end']>=$today)   {?>
    <div class="download-app-trigger election-trigger">
        <div class="btn btn-profile" type="button" >
          <div class="get-app-icon">
            <img src="images/ic_chardham.jpg" alt="" />
          </div>
          <div class="get-app-text">
              <span class="profile-name"><a id="chardm" href="https://maps.mapmyindia.com/pilgrimage/chardhamyatra/" target="blank" style="color: #212121;">Chardham Yatra</a></span>
          </div> 
        </div>
     </div>
<?php }
if($config_files['pandal']['date_start']<=$today && $config_files['pandal']['date_end']>=$today)  {
?>
    <div class="download-app-trigger pandal-app-trigger">
        <div class="btn btn-profile" type="button" onclick="maps.near_search('pandals','','','','','pandals');">
          <div class="get-app-icon animated heartBeat slower infinite">
            <img src="images/search_cat/pandal_icon.png" alt="" />
          </div>
          <div class="get-app-text">
              <span class="profile-name"><a id="durgaPnd" style="color: #212121;">Durga Puja Pandals</a></span>
          </div> 
        </div>
     </div>
<?php }//finished elec2019 ?>
    </div>
    <!-- notification-section -->
    <?php
        if($_SESSION['user_name'] && $mobile==0 )
        {
            echo'<div class="notification-wrap profile" id="notif"></div>';
        }
    ?>

       <div class="reportTrig commonreportTrig">
            <a href="javascript:void(0)" onclick="var url='place-report@zdata='+btoa(map.getCenter().lat+'+'+map.getCenter().lng+'+'+map.getZoom()+'++');writeReport(url);" class="help_out_trig">
                <i class="material-icons">add</i>
            </a>
            <span>Report an Issue</span>
        </div>
        <div class="map-control-sec">
         <?php 
                if(!$mobile)
                {?>
                <div class="map-c-item">
                    <a class="map-zoom-in" title=" Map Zoom In" nofollow>
                <i class="material-icons lhid">add</i> 
            </a>
             <a class="map-zoom-out" title=" Map Zoom Out" nofollow>
                <i class="material-icons lhid">remove</i> 
            </a>
         </div>
                <?php } ?>
        <div class="map-c-item"> 
            <input type='checkbox' value='1' id='traffic_show' style='display:none' >
            <!--a id="traffic_control" title="Traffic ON/OFF" nofollow>
                <i class="material-icons lhid">traffic</i> 
            </a-->
            <a style="height: 36px;line-height: 32px;" id="layer_panel_trigger" title=" Map Layers" nofollow>
                <i class="material-icons lhid">layers</i> 
            </a>
         </div>
        <div class="map-c-item">
            <a id="geo_location" class="current-loc" title="GPS Locations" nofollow>
                            <i class="material-icons lhid">location_searching</i>
            </a>
        </div>
        
    </div>
        <?php /*
        <div class="new-map-control">
            <input type='checkbox' value='1' id='traffic_show' name='traffic_show' style='display:none' >
      <ul class="n-m-c-list">
            <?php 
                if(!$mobile)
                {
         echo '<li class="map-zoom-in">
          <a rel="nofollow" href="javascript:void(0)" class="tooltip" alt="Map zoom in"><span class="tooltiptext">Zoom In</span><span>+</span></a>
        </li>
    <li class="map-zoom-out">
          <a rel="nofollow" href="javascript:void(0)" class="tooltip" alt="Map zoom out"><span class="tooltiptext">Zoom Out</span><span>-</span></a>
        </li>';
                }
             ?>
               <li id="layer_panel_trigger">
          <a rel="nofollow" href="javascript:void(0)" class="tooltip" alt="Satellite map of india"><span class="tooltiptext">Map Layer</span><i class="material-icons">layers</i></a>
        </li>
        <li id="geo_location">
          <a rel="nofollow" href="javascript:void(0)" class="tooltip" id="gloc" alt='Live map'>
                        <span class="tooltiptext">Current Location</span><i class="material-icons">location_searching</i></a>
        </li>
                 <li id="traffic_control">
          <a rel="nofollow" href="javascript:void(0)" class="tooltip" alt="Live traffic map"><span class="tooltiptext">Traffic</span><i class="material-icons">traffic</i></a>
        </li>
    <!-- <li id="weather_panel_trigger">
                    <a rel="nofollow" href="javascript:void(0)" class="tooltip" alt="Local weather">
                            <span class="tooltiptext">Weather</span><i class="material-icons">cloud_queue</i>
          </a>
        </li> -->
      </ul>
    </div> 
    <div class="taketourSec">
              <div class="taketour_block">
                  <a id="tk_tour">
                  <span class="tourText">Take a tour</span>
                  <span class="tourIcon"><img src="images/taketour/tour_icon.png" alt="" /></span>                  
                </a>
              </div>
              <a href="#" class="tourleftArrow"></a>
              <a href="#" class="tourrightArrow"></a>
    </div>
        */?>
<?php /*?>
    <div class="layer_panel_sec" id="layer_panel_sec">
  <div class="layer_panel_head clearfix">
    <h2>Map Layers</h2>
    <button class="btn btn-default" id="layer_panel_close"><i class="material-icons">close</i></button>
  </div>
  <div class="l_p_list_sec">
    <ul class="l_p_list">
    <?php if($config_files['mapmyindia']['status']==1) {?>
      <li id="m_t">
        <a rel="nofollow" href="javascript:void(0)" ><div class="l_p_l_item clearfix">
        <div class="l_p_l_img"><img src="images/layer_panel/mapview.jpg" alt="India map" /></div>
        <div class="l_p_l_text"><h4>MapmyIndia</h4></div> 
        </div></a>
      </li>
      <?php }if($config_files['hybrid']['status']==1) {?>
      <li id="h_t">
        <a rel="nofollow" href="javascript:void(0)">
          <div class="l_p_l_item clearfix"><div class="l_p_l_img">
            <img src="images/layer_panel/hybridview.jpg?<?php echo CACHE_DT; ?>" alt="Drive map" /></div>
            <div class="l_p_l_text"><h4>Hybrid</h4></div> 
          </div></a>
      </li>
      <?php }if($config_files['indic']['status']==1) {?>
      <li id="i_t">
        <a rel="nofollow" href="javascript:void(0)">
          <div class="l_p_l_item clearfix"><div class="l_p_l_img">
              <img src="images/layer_panel/regional.png?<?php echo CACHE_DT; ?>" alt="Local map" />
            </div><div class="l_p_l_text"><h4>Indic</h4></div>  
          </div></a>
      </li>
      <?php }?>
      <li id="g_report">
        <a rel="nofollow" href="javascript:void(0)"><div class="l_p_l_item clearfix">
            <div class="l_p_l_img"><img src="images/layer_panel/report_map.png" alt="Road conditions" /></div>
            <div class="l_p_l_text"><h4 class="rpp_spn">Report</h4></div> 
          </div></a>
      </li>

      <li id="g_saves" style="display: none;">
        <a rel="nofollow" href="javascript:void(0)"><div class="l_p_l_item clearfix">
            <div class="l_p_l_img"><img src="images/layer_panel/mysaves_map.png" alt="My saves" /></div>
            <div class="l_p_l_text"><h4 class="saves_spn">My Saves</h4></div> 
          </div></a>
      </li>
 
      <li id="g_devices" style="display: none;">
        <a rel="nofollow" href="javascript:void(0)"><div class="l_p_l_item clearfix">
            <div class="l_p_l_img"><img src="images/layer_panel/device_map.png" alt="My devices"/></div>
            <div class="l_p_l_text"><h4 class="devices_spn">My Devices</h4></div> 
          </div></a>
      </li>
    </ul>
    </div>
</div><!--End Layer Control Panel-->
<?php */?>


<!--start weather-->
<?php /* 
<div class="layer_panel_sec weather_panel_sec" id="weather_panel_sec">
  <div class="layer_panel_head clearfix">
    <h2>Weather</h2>
    <button class="btn btn-default" id="weather_panel_close">
      <i class="material-icons">close</i>
    </button>
  </div>
  <div class="l_p_list_sec clearfix">
    
    <div class="panel-group clearfix" id="accordion">
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
        <h4 class="panel-title" id="w_temp">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)" onclick="maps.weather('temp',1);">
            <span class="panel-img">
              <img src="images/weather/temp.png" alt="" />
            </span>
            <span>Temperature</span>
          </a>
        </h4>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
        <h4 class="panel-title" id="w_windSpeed">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)"  onclick="maps.weather('windSpeed',1)">
            <span class="panel-img">
              <img src="images/weather/wind.png" alt="" />
            </span>
            <span>Wind</span>
          </a>
        </h4>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
        <h4 class="panel-title" id="w_precip24hr">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)"  onclick="maps.weather('precip24hr',1)">
            <span class="panel-img">
              <img src="images/weather/pre.png" alt="" />
            </span>
            <span>Precipitation</span>
          </a>
        </h4>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
        <h4 class="panel-title" id="w_snow24hr">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)" onclick="maps.weather('snow24hr',1)">
            <span class="panel-img">
              <img src="images/weather/snow.png" alt="" />
            </span>
            <span>Snow</span>
          </a>
        </h4>
        </div>
      </div>
      
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
        <h4 class="panel-title" id="w_feelsLike">
          <a rel="nofollow" href="javascript:void(0)"  onclick="maps.weather('feelsLike',1)">
            <span class="panel-img">
              <img src="images/weather/feel-like.png" alt="" />
            </span>
            <span>Feels Like</span>
          </a>
        </h4>
        </div>
      </div>
      
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
        <h4 class="panel-title" id="w_cloudsFcst">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)" onclick="maps.weather('cloudsFcst',1)">
            <span class="panel-img">
              <img src="images/weather/cloud.png" alt="" />
            </span>
            <span>Cloud</span>
          </a>
        </h4>
        </div>
      </div>
      
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
                              <h4 class="panel-title" id="w_uv">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)" onclick="maps.weather('uv',1)">
            <span class="panel-img">
              <img src="images/weather/uv.png" alt="" />
            </span>
            <span>UV</span>
          </a>
        </h4>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading clearfix">
                     <h4 class="panel-title" id="w_dewpoint">
          <a data-toggle="collapse" data-parent="#accordion" rel="nofollow" href="javascript:void(0)"  onclick="maps.weather('dewpoint',1)">
            <span class="panel-img">
              <img src="images/weather/dew.png" alt="" />
            </span>
            <span>Dew point</span>
          </a>
        </h4>
        </div>
      </div>
    </div> 
    
  </div>
</div>

<!--Start bottom date panel weather-->

<!--End bottom date panel weather-->
 <div class="weather-panel-btm weather-date-panel-btm" id="w_forc_dv"></div>
<div class="weather-panel-btm" id="w_th_rclr"> </div>
<!--end weather-->
*/?> 
<div class="container mmi-maps">
        <div class="row main-page" id="main_page" >
            <div class="search-new-sec with-nav-tabs panel-primary" >
        <?php if($mobile && !$og[1]) {?>
        <div class="deep-link-sec-install install-app-sec" style="display: block">
                    <a href="javascript:void(0)" onclick="$(this).parent().hide();$('.covid-trigger-img').attr('style','top:70px !important')" class="install-app-close">
                        <i class="material-icons">close</i>
                    </a>

                    <div class="main-deep-link">
                        <div class="deep-text-area clearfix">
                            <img src="images/ic_move_logo.png" alt="">
                            <h2>Download the App</h2>
                            <p>FREE Map, Navigation, Traffic & IoT</p>
                        </div>
                        <div class="deep-clickable-area clearfix">
                            <button class="btn btn-default pull-right" onclick="setTimeout(function(){window.location = <?php echo "'".$store_link."'";?>;}, 40);">Install</button>
                        </div>
                    </div>
                </div>
                 <div class="download-app-trigger election-trigger realviewMain" onclick="realViewOpenMob();">
        <div class="dropdown" > 
        <button id="realv_trig"  class="btn btn-profile dropdown-toggle" type="button" alt="Move" style="width:130px;">
          <div class="get-app-icon">
            <img src="images/360_Real_View.png" style="height: 32px;margin-top: 4px;margin-left: 13px;">
          </div>
          <div class="get-app-text" style="margin-left: 10px;padding-left: 5px;border-left: 1px solid #efefef;">
              <span class="profile-name"><a id="multi_dv"  style="color: #212121;">Real View</a></span>
          </div> 
        </button>
       

        </div>
     </div>
            <?php } ?>
            <div id="collapse" onclick="collapse(1,'')" alt="map view" >⟪</div> 
            <div class="search-box clearfix"   id="tab1primary" <?php if(strpos($og[0],'direction')!==false || (strpos($og[0],'place-')===0 && $mobile))echo 'style="display: none;"';  ?>>
                            <div class="search-box-main">
                    <div class="hamburger-trigger-sec">
                        <a id="side-menu" class="hamburger-trigger" style="display: block">
                        <div class="red-dot red-mark" id="red_dt" style="display: none;"></div>
                            <div class="hamburger-trigger-item side-menu">
                                <i class="material-icons side-menu lhid" >menu</i>
                            </div>
                        </a>
                        <a id="side-back" class="hamburger-trigger" onclick="close_eloc('dr')" style="display: none">
                            <div class="hamburger-trigger-item side-menu">
                                <i class="material-icons">keyboard_backspace</i>
                            </div>
                        </a>
                    </div> 
                    <div class="search-input-sec clearfix">
                        <div class="search-icon">
                            <i class="material-icons lhid">search</i>
                        </div>
                        <div class="search-text">
                                                    <input type="text" id="auto" name="auto" class="form-control" placeholder="Search for 'corona'" required spellcheck="false" autocomplete="false">
                                                </div>
                    </div> 
                                        
                                <div id="auto_load"><?php //auto_load method in js for show cross,loader,direction tab, and called from auto.js, js_map for place_details & nearby?>
                <?php   
                                    if(!$cur_url || strpos($cur_url,'place')!==0) echo '<div class="directions-trigger-sec">
                        <a id="dir_tab" class="directions-trigger" title="Get Direction">
                            <div class="directions-trigger-item">
                                <i class="material-icons lhid">directions</i>
                            </div>
                        </a>
                    </div>';
                                ?>            
                                </div>
                </div>
                            <div class="current-loc-box" id="cur_loc_d" title='Current Location'></div>
            </div>
              
            <div class="directions-box clearfix"  id="tab3primary" <?php if(strpos($og[0],'direction')===false) echo 'style="display: none;"';  ?>>
                <div class="search-box directions-box-item clearfix">
                    <div class="hamburger-trigger-sec">
                        <a id="side-menu"class="hamburger-trigger">
                            <div class="hamburger-trigger-item side-menu">
                                <i class="material-icons side-menu lhid">menu</i>
                            </div>
                        </a>
                    </div> 
                    <div class="search-input-sec clearfix">
                        <h2>Directions</h2>
                    </div> 
                    <div class="directions-trigger-sec">
                                                <a onclick="<?php if(strpos($cur_url,'@covid')!==false){ $ur=explode('zda',explode('@',$cur_url)[1])[0];echo"window.location.href='corona?".str_replace('covid:','',$ur)."'"; }else echo "newdr.x();$('.covidTrigMain,.covidTrigMain a').show();"; ?>" class="directions-trigger">
                            <div class="directions-trigger-item">
                                <i class="material-icons">close</i>
                            </div>
                        </a>
                    </div> 
                </div>
                <div class="directions-box-main clearfix">
                    <div class="new-direction-sec new-direction-sec-move">
                        <ul class="new-direction-list">
                                        <li class="direction_dir clearfix" id="auto_start-start_dirs" ondragstart="newdr.drag(event);">
                                          <div class="n-d-icon n-d-StaticIcon div-suffle">
                                            <img src="images/directions/ic_start_loc_dark.png" alt="" />
                                          </div>
                                          <div class="n-d-textField">
                                            <input type="text" id="auto_start" class="form-control" placeholder="Enter start location" required="">
                                            <input type="hidden" value="" tabindex="-1" id="start_dirs" name="start_dirs" >
                                            <span class="close-btn" id="clear_start"><a title="Cancel"><i class="ti-close" alt="Driving directions"></i></a></span>
                                          </div>
                                          <div class="n-d-icon n-d-clickIcon">
                                            <a title="Swap" onclick="newdr.exchange('')" id="dir_exchange">
                                              <img src="images/directions/ic_reverse_route_dark.png" alt="" />
                                            </a>
                                          </div>
                                          <div class="n-d-icon n-d-clickIconMove">
                                            <a href="#">
                                              <img src="images/directions/ic_drag_handle_dark.png" alt="">
                                            </a>
                                          </div>
                                        </li>
                                        
                                        <li class="dest_dir direction_dir clearfix" id="auto_end-end_dirs" ondragstart="newdr.drag(event);">
                                          <div class="n-d-icon n-d-StaticIcon div-suffle">
                                            <img src="images/directions/ic_end_loc_dark.png" alt="" />
                                          </div>
                                          <div class="n-d-textField">
                                            <input type="text" id="auto_end" class="form-control" placeholder="Enter end location" required="">
                                                <input type="hidden" value="" id="end_dirs" name="end_dirs" tabindex="-1">
                                                <span class="close-btn" id="clear_end"><a title="Cancel"><i class="ti-close" alt="Map to"></i></a></span>
                                          </div>
                                          <div class="n-d-icon n-d-clickIcon">
                                            <a onclick="newdr.add_destination('')" id="add_dest" class="new-stop">
                                              <img src="images/directions/ic_add_waypoint_dark.png" alt="" />
                                            </a>
                                          </div>
                                          <div class="n-d-icon n-d-clickIconMove">
                                            <a href="#">
                                              <img src="images/directions/ic_drag_handle_dark.png" alt="">
                                            </a>
                                          </div>
                                        </li>
                                        <li class="clearfix" id="way-points" style="display:none">
                                            <div class="n-d-icon n-d-StaticIcon">
                                              <img src="images/directions/ic_add_waypoint_dark.png" alt="" />
                                            </div>
                                            <div class="n-d-textField" style="margin-top: 8px;" onclick="newdr.add_destination('')">
                                             <a type="button" value="Add Waypoint" style="color: #2a445b;">Add Waypoint</a>
                                            </div>
                                          
                                          </li>
                                            
                                      </ul>
                    </div>
                </div>
                <?php if($mobile) echo '<div class="get-route-sec" onclick="newdr.get_routes(\'\',\'mob\');">
                                            <a href="javascript:void(0)" class="get-route-btn">Get Route</a>
                                        </div>';?>
            </div>
              
              
                 <?php
                    $category=globals::cat_code("");$num=1;$seach_category=[];$cat_li="";
                    foreach($category as $c_id=>$ind_cat)
                    {
                       $c_name=$ind_cat['name'];
                       $c_bg=$ind_cat['bg'];
                       $c_icon=$ind_cat['icon'];
                       $search=$ind_cat['search'];
                       if($search===0) continue;
                       $c_link=($near_txt=='me' && !$og_v?'':'place-').$c_id."-near-".$near_txt.($og_v?'?@zdata='.base64_encode($img_c[0]."+".$img_c[1]."+16++$c_id+el").'ed':"");
                    if($c_name=="Holi Sweets")
                        {
                             $cat_li.= '
                        <li id="ct_'.$c_id.'">  
                        <div class="cat-icon" "'.$stll_.'"><img src="images/cat/blue_cat/'.$c_icon.'.png?'.CACHE_DT.'" alt="Find '.$c_name.'" title="Search Nearby '.$c_name.'" /></div>

                        <div class="cat-name"><a  href="./'.$c_link.'"><span style="
                                        font-weight: bold;
                                        "><span style="
                                        color: #d801fa;
                                    ">H</span><span style="
                                        color: #289100;
                                    ">o</span><span style="
                                        color: #f06900;
                                    ">l</span><span style="
                                        color: #0e18f4;
                                    ">i</span> Sweets</span></a></div>
                   
                        </li>';
                    }else{
                         $cat_li.= '
                        <li id="ct_'.$c_id.'">  
                        <div class="cat-icon" "'.$stll_.'"><img src="images/cat/blue_cat/'.$c_icon.'.png?'.CACHE_DT.'" alt="Find '.$c_name.'" title="Search Nearby '.$c_name.'" /></div>
                        <div class="cat-name"><a  href="./'.$c_link.'">'.$c_name.'</a></div>
                        </li>';
                    }

                        

                        $num++;
                        if($num==4)
                        {
                            $cat_li.= ' <li id="cat-more-btn">    
                                    <div class="cat-icon">
                                      <img src="images/cat/blue_cat/ic_more_ldpi.png" alt="" />
                                    </div>
                                    <div class="cat-name"><a>More</a></div>
                                 </li>';
                        }
                        elseif($num==5)
                        {
                            $cat_li.= ' </ul>
                                </div>
                                <div class="rest-category">
                               <ul class="mob-cat-list clearfix">';
                        }
                        /*auto search categegory to put in auto.js*/
                        if($ind_cat['search'])
                        {
                            $search_category[$ind_cat['search']]='<li id="ct_'.$c_id.'"><div class="cat-icon"><img src="images/cat/blue_cat/'.$c_icon.'.png" /></div><div class="cat-name"><a>'.$c_name.'</a></div></li>';
                        }
                    }
                    ksort($search_category);$search_category=implode('',$search_category);/*added hidden ul be;low category*/
                   // if(!$mobile)
                    if(1)
                    {
                    ?>
                    <div class="new-category-sec" id="cat_tab">
                    <div class="new-category-sec-head clearfix">
                        <h1 style="font-weight:bold">Find nearby facilities</h1>
                            <button class="btn btn-default" id="new-category-sec-close" onclick="x_cat=1;close_cat()"><i class="material-icons lhid">close</i></button>
                    </div>
                    <div class="mob-cat-theme">
                            <div class="shown-category">
                                                    <ul class="mob-cat-list clearfix">
                                                            <?php
                                                            echo $cat_li;
                                                            ?>
                                                            <li id="cat-less-btn">
                                                                <div class="cat-icon">
                                                                  <img src="images/cat/blue_cat/ic_less_ldpi.png" alt="Live map of India" />
                                                                </div>
                                                                <div class="cat-name"><a>Less</a></div>
                                                            </li>
                                                        </ul>

                                                    </div>
                      </div>
                      </div>
                    <?php
                    }
                    ?>
                  <div id="auto_cat" style="display: none"><div class="new-category-sec his-new-category" style="display:block;"><div class="mob-cat-theme"><div class="search-his-cat"><ul class="mob-cat-list clearfix"><?php echo $search_category;?></ul></div></div></div></div>
                <?php /*if(!$Mobile){ ?>
                  <div class="get-eloc-sec-bus" id="get-eloc-sec-bus" style="display:none">
                    <a class="bus-close" id="bus-close" onclick="close_getelc=1;$(this).parent().hide();">
                        <i class="material-icons">close</i>
                    </a>
                    <div class="show-eloc-sec" id="side_1">
                        <div class="add_buss_icon">
                            <img src="images/add_business.png" alt="" />
                        </div>
                        <div class="eloc-text-sec">
                            <h2>Add a Business (New)</h2>
                            <p style="margin: 0 0 15px;padding-left: 100px;">Put up your business for customers to look it up and follow you on Move.</p>
                        </div>
                        <div class="eloc-control-sec text-center">
                            <button class="eloc-btn" onclick="maps.add_place('business');">Add a Business</button>
                        </div>
                    </div>
                </div> 
                <?php */ if(!$mobile){ ?>  
                  <div class="get-eloc-sec-bus" id="get-eloc-sec-bus" style="display:none;">
                    <a class="bus-close" id="bus-close" onclick="close_getelc=1;$(this).parent().hide();$('.covid-trigger-img').show();">
                        <i class="material-icons">close</i>
                    </a>
                    <div class="show-eloc-sec" id="side_1">
                        <div class="add_buss_icon">
                            <img src="images/corona/fab_corona.png" alt="" />
                        </div>
                        <div class="eloc-text-sec">
                            <h2>COVID-19 on your mind?</h2>
                            <p style="margin: 0 0 15px;padding-left: 100px;font-weight: bold;color: #444;">Track the latest India stats or find Coronavirus facilities around you with MapmyIndia's COVID-19 Guide.</p>
                        </div>
                        <div class="eloc-control-sec text-center">
                            <button class="eloc-btn eloc-report" onclick="window.location.href='covid-19'"><i class="material-icons">bar_chart</i> Go To the Guide</button>
                        </div>
                    </div>
                </div> 
                  <div class="get-eloc-sec-bus" style="display:none">
                    <a class="bus-close" id="bus-close" onclick="close_getelc=1;$(this).parent().hide();$('.covid-trigger-img').show();">
                        <i class="material-icons">close</i>
                    </a>
                    <div class="show-eloc-sec" id="side_1">
                        <div class="add_buss_icon">
                            <img src="images/corona/fab-corona.png" alt="" />
                        </div>
                        <div class="eloc-text-sec">
                            <h2>Share. We Know You Care.</h2>
                            <p style="margin: 0 0 15px;padding-left: 100px;font-weight: bold;color: #444;">One small action could greatly help someone. Share live pan India COVID-19 Guide and 
                                    Move app with others</p>
                        </div>
                        <div class="eloc-control-sec text-center">
                            <button class="eloc-btn eloc-report" onclick="share('https://maps.mapmyindia.com/corona');"><i class="material-icons">share</i> Share Information</button>
                        </div>
                    </div>
                </div> 
            <?php } ?>
                  
           <?php /*     <div class="get-eloc-sec" id="get-eloc-sec"></div><?php // added div eloc_tap for display button ?> */  ?>
        <div id="get_eloc_dv" style="display: none;"></div>  
        <div id="taketour_dv"></div>      
        </div>
           
            <!--<div class="search-list-click-wrap light-blue-top-bdr set_height"></div>-->
            
            <div id="res_info" ><?php echo $infoHtml;?></div>
            <div class="custom-bg-overlay"></div>
            <nav class="custom-drawer-nav" id="login_dv_menu" >
                <div class="side-bar-scroll mCustomScrollbar _mCS_1 mCS-autoHide mCS_no_scrollbar" data-mcs-theme="minimal-dark" style="position: relative; overflow: visible;">
                        
                        <div class="side-bar-profile side-bar-world-view clearfix" onclick="home(0);getListContent('','d29ybGQ=','','my-world','');event.preventDefault();" id="world_view">    
                            <div class="side-lside pull-left">
                    <div class="side-pic"><img src="images/side/ic_worldview.png" alt="" class="mCS_img_loaded"></div>
                    <div class="side-text"><h2><a href="./my-world-data">My World View</a></h2><p>Your Feed</p></div>
                            </div> 
                        </div><br><br>
                    <div onclick="window.location.reload()" style="text-align:center;cursor:pointer">Connection Failed<br><h2>Try Again</h2></div>
                </div>
            <?php echo $menu_html[1]; ?> 
            </nav>
        </div>

        <div class="row map map-page">
       <div class="addp-web-onmap-sec">
        <div class="addp-user-sugg clearfix">
            <a class="addp-u-s-close" onclick="$(this).parent().hide();">
                        <i class="fa fa-times-circle"></i>
                    </a>
                    <p><i class="fa fa-exclamation-circle"></i><strong> Quick Tip: </strong>The map is centered to your current detected location (as a default)</p>
                    <ul class="addp-user-sugg-list clearfix">
                        <li>
                            <div class="adddp-u-s-icon">
                                <i class="fa fa-search"></i>
                            </div>
                            <div class="adddp-u-s-text">
                                Search for a different place, using the "Street Location Search"
                            </div>
                        </li>
                        <li>
                            <div class="adddp-u-s-icon">
                                <i class="fa fa-arrows"></i>
                            </div>
                            <div class="adddp-u-s-text">
                                Move the map to focus on desired area.
                            </div>
                        </li>
                        <li>
                            <div class="adddp-u-s-icon">
                                <img src="images/addp_03.png" alt="" />
                            </div>
                            <div class="adddp-u-s-text" style="margin-top:10px;">
                                Pan &amp; Zoom the map for detailed view
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="addp-web-addr-block clearfix">
            <a class="addp-u-s-close" onclick="$(this).parent().hide();" style="float:right;">
                        <i class="fa fa-times-circle" style="font-size:24px"></i>
                    </a>
                    <div class="pull-left">
                        <div class="search-addp-map-result">

                            <ul class="addp-search-item">
                                <li class="addp-map-marker">
                                <i class="fa fa-map-marker"></i> Current Marker Location</li>
                                <li id="indexplacedist" class="iaddp-dis">Selected location is <strong></strong>m away from</li>
                                <li id="indexplacename" class="iaddp-name"></li>
                                <li id="indexplaceaddr" class="iaddp-addr"></li>
                            </ul>
                        </div>
            
                    </div>
                    <div class="pull-right">
                        <button class="btn btn-primary" style="display:none">Next</button>
                    </div>
                </div>
            </div>
            <div class="map" id="map"></div>    
        </div>
    </div>
</div>
<!-- feedback-->
<div id="add_new_list">
    <div class="login add-new-list-popup feedback-popup">
        <div class="login_wraper">
            <div class="login-item add-new-list-popup-item col-sm-12">    
                <a onclick="$('#add_new_list').hide()" class="login-close-btn" id="add_new_list_close_btn" title="Close"><i class="ti-close"></i></a>    
                <div class="login-content">
                    <h2>How do you like our new version?</h2>
                    <p>We would love to hear about your experience! Tell us about any issues, & feel free to suggest improvements...</p>
                    <div class="login-form-content">
                        <form>
                            <span class="input input--hoshi">
                                <input class="input__field input__field--hoshi" type="text" id="f_email" value="<?php echo $_SESSION['email'];?>" />
                                <label class="input__label input__label--hoshi input__label--hoshi-color-1" for="input-4">
                                    <span class="input__label-content input__label-content--hoshi read_only_label">Email</span>
                                </label>
                            </span>
            
                            <span class="input input--hoshi">
                                <textarea class="input__field input__field--hoshi" type="text" id="feed_back"></textarea>
                                <label class="input__label input__label--hoshi input__label--hoshi-color-1 des-lab" for="input-4">
                                    <span class="input__label-content input__label-content--hoshi">Feedback</span>
                                </label>
                            </span>
                            <div class="col-sm-12 custom-form-group btn-item">
                                <div class="col-sm-12 pull-right">
                                    <input type="button" class="btn btn-login pull-right" id="send_feedback" value="Submit" onclick="maps.send_feedback()">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>         
    </div>
</div>
<?php//<div id="feedback" class="get-route" title="Feedback" onclick="maps.feedback()"><i class="fa fa-comment-o"></i>&nbsp; Feedback</div>?>
</body>

<script type="text/javascript">
    var uname="<?php echo $_SESSION['user_name']; ?>",home_work=[],uemail="<?php echo $_SESSION['email']; ?>",uid="<?php echo $_SESSION['user_id']; ?>",cachdt="<?php echo CACHE_DT; ?>";
    var js_path="<?php echo _JS_; ?>",css_path="<?php echo _CSS_; ?>",map_key="<?php echo map_key; ?>",drag="<?php echo $drag ?>",intouch_url="<?php echo intouch_url; ?>";
    var evnt_url="<?php echo EventApi; ?>",userpath="<?php echo USER_PATH; ?>",map_lat="23.61",map_lng="80.23",map_zm="5",deviceNAme= "<?php echo $_SESSION['deviceTp']; ?>",ref="<?php  if(strpos($ref,$_SERVER['HTTP_HOST'])===false) echo strip_tags($ref);?>";
    if('<?php echo $mobile;?>'==1) var map_zm="4";
    try 
    { 
        var local_st=localStorage.getItem("local"); 
    }
    catch (exception) 
    {  
        var local_st="";
    }
    var sess_lat="<?php if($_SESSION['latlng']!=',')echo $_SESSION['latlng']; ?>";
    if(sess_lat  && sess_lat!=',')
    { 
        sess_lat=sess_lat.split(",");
        map_lat=sess_lat[0];
        map_lng=sess_lat[1];
        map_zm=11;
    }
    var url_n = window.location.toString().split('/');var curl = url_n.slice(-1)[0];
    
    if(curl.indexOf('appzdata')!=-1 && !local_st) {try{localStorage.setItem("deepVal",1);}catch(e){}}
    if(curl.indexOf('zdata')!=-1) 
    {
        var zdt=curl.split('zdata='); 
        try{var dcd=atob(zdt[1].replace(/ed|![0-4][0-4]/g,''));}catch(e){var dcd='';}
      
        if(zdt[0].indexOf('place-')===0  && dcd) 
        {
         if(dcd_arr){map_lat=dcd_arr[0];map_lng=dcd_arr[1];map_zm=dcd_arr[2];}
        }
        if(zdt[0].indexOf('-near-')!=-1 && dcd && curl.indexOf('direction-')==-1) 
        { 
            var dcd_arr=dcd.split(',');
            if(dcd.indexOf('+el')>1)
            {
                var nt=dcd_arr[0].split('+');
                map_lat=nt[0].substr(0,9);map_lng=nt[1].substr(0,9);map_zm=nt[2];
            }
           else{
            map_lat=dcd_arr[1].substr(0,9); 
            map_lng=dcd_arr[0].substr(0,9);
            map_zm=16;
            }
        }
    }
    else if(local_st) 
    {
        var new_data=JSON.parse(local_st); 
        var map_ltn=new_data[0].address.replace('ed','').split('data=');
        var map_cord=atob(map_ltn[1].replace('ed','')).split('+');
        if(map_cord[0]) map_lat=map_cord[0];
        if(map_cord[1]) map_lng=map_cord[1];
        map_zm=map_cord[2];
    }
    

</script>
<script src="<?php echo _JS_; ?>/?<?php echo CACHE_DT.".js";if($_GET['1']==1) echo "&1=1"; ?>"></script>
<script src="<?php echo _JS_; ?>/vmap/?<?php echo date('ymd').CACHE_DT;if($_GET['1']==1) echo "&1=1"; ?>"></script>


<?php
echo $script;
?>

<!-- map-control-web -->
<script>
 tkn='<?php echo $_SESSION["access_atlas"]; ?>';
$(window).load(function(){

  maplayerD = $.ajax({method:"post",url: "maplayer_call",
      success: function(data) { 
        var obj =JSON.parse(data); 
             $("#mapLayerTest").html(obj.html);
      }});

    if(mobilecheck()) {
        $('.covid-trigger-img').show();
        $('.covid-trigger-img').attr('onclick','window.location.href=\'corona\'');
        setTimeout(function(){
            $(".reportTrig span").hide();
            $(".reportTrig span").addClass("showReport");
        },4000);
    }

    setTimeout(function(){
        if('<?php echo $_COOKIE["what_new"];?>'=='' || '<?php echo $_COOKIE["total"];?>'!=$('ul.whatsnewList li').length) $(".red-mark").show();
        else $(".red-mark").hide();
    $(".help_out_trig").addClass("reportRotate");
    if(!mobilecheck()) $("#red_dt").hide();
    },1000);
    setTimeout(function(){
        var cookie = '<?php echo $_COOKIE["cookie"];?>';

        if ('<?php echo $_COOKIE["cookie"];?>'=='') {
            if(mobilecheck()) $('.cookiesSec').addClass("mobCookiesSec");
            $('.cookiesSec').show();
            /*document.cookie="cookie=1";*/
        }
    },5000);

});

$("#cookieClose").click(function()
{
    document.cookie="cookie=1";
    $(".cookiesSec").hide();
});

function whatsNewPopup(){
    $('.whatsnewWidgetSec').show();
    $('.whatsnewList').scrollTop(0);
    document.cookie='what_new=1';
    document.cookie='total='+$('ul.whatsnewList li').length;
    $('.red-mark').hide();
}

$(document).ready(function()
{  
    comman('menu','menu',{"evt":"menu","url":maps.uri()});/*menu load*/  
    if(maps.uri() && !maps.uri().indexOf('@')===0)  close_cat();
    $(".new-map-control").show();
    if(!$('.map').height()) $('.map').css({"height":$(window).height()+"px"});
    deviceType = '<?php echo $mobile?>';
    if(!curl || curl.indexOf('@')===0) $("#cat_tab,#get-eloc-sec,.get-eloc-sec-bus").show(); 
    $(".login-close-btn").click(function()
    {
        $(".login").css("display","none");
    });

    $.getJSON('new.json?<?php echo CACHE_DT;?>', function(data) {
        var data = data.whats_new;
        var whatsnewhtml='';
        $(data).each(function(i, val)
        {
            whatsnewhtml += '<li>'+
                  '<a>'+
                      '<div class="listTime">'+val.Version+'<span style="color: #888;"> ('+val.Date+')</span>'+(val.status?val.status:'')+'</div>'+
                      '<h2>'+(val.Title?val.Title:'')+'</h2>'+
                      '<p>'+val.Desc+'</p>'+
                  '</a>'+
            '</li>';
        });
        $(".whatsnewList").html(whatsnewhtml);  
    });

    $(".login_btn").click(function()
    {
        $(".login").show();
    });

    $(".search-title").click(function()
    {
        $(".set_height").toggleClass("showlist");
        $(".panel-body.forhide").toggleClass("hidelist");
    });
 

    $("#nearby-categories-item").mCustomScrollbar(
    {
        theme:"dark",
        scrollInertia:100,
    });

    $(document).on("click", "#uaplace_add_img", function(event)
    {
        $("#uaddplace_browse").click();
        event.preventDefault();
    }).on("click", "#edtplace_add_img", function(event)
    {
        $("#edtplace_browse").click();
        event.preventDefault();
    }).on( "click", "#side-menu", function (event)/*side menu*/
    {
       $("#weather_panel_sec").removeClass("layer_panel_pos");
        $(".custom-bg-overlay").attr("style", "display: block");
        $("#login_dv_menu").attr('style', 'left: 0px !important');
        $("#taketour_dv").attr("style", "display: none");
        if(!mobilecheck()) $(".whatnewSec").hide();
        event.preventDefault();
    }).on( "click touch", function ( e ) 
    {
      if($(e.target).css('line-height')=='50px'){
            $(".custom-bg-overlay").attr("style", "display: block");
            $("#login_dv_menu").attr('style', 'left: 0px !important');
          }
          else if(!$(e.target).hasClass('side-menu')) 
          {
                  $(".custom-bg-overlay").hide();
            $("#login_dv_menu").attr('style', 'left: -325px !important');
          }
    }).on( "keydown", function ( e ) 
    {
        if ( e.keyCode === 27 ) 
        {
            $(".custom-bg-overlay").hide();
            $("#login_dv_menu").attr('style', 'left: -325px !important');
        }
    });
    var lastY=0,lastX=0;src = document.getElementById("login_dv_menu");/*hemburger menu drag*/
    src.addEventListener('touchmove', function(e) {
      var thisX= e.touches[0].clientX-195,c_y=e.touches[0].clientY;
      if(!lastY) {lastY=c_y;lastX=thisX;return;}
      if($(this).position().left<=0 && (thisX-lastX)<=0 && Math.abs(c_y-lastY)<20 ){ $(this).attr('style', 'left: '+(thisX-lastX)+'px !important');}
    }, false);src.addEventListener('touchend', function(e) {lastY=0;lastX=0;if($(this).offset().left<-5) {$(this).attr('style', 'left: -325px !important');$(".custom-bg-overlay").hide();f_tch=0;return false;}
else $(this).attr('style', 'left: 0px !important');});
/*siemenu*/
 $(document).on("click", "#weather_close", function(event){if(weather_tile) map.removeLayer(weather_tile);$("#weather_panel_trigger").removeClass( "active");$(".weather-panel-btm").hide();$("#weather_panel_sec").removeClass("layer_panel_pos");maps.set_current();});
 $("#weather_panel_trigger").on("click", function(){$("#weather_panel_sec").addClass("layer_panel_pos");});
 $("#weather_panel_close").on("click", function(){$("#weather_panel_sec").removeClass("layer_panel_pos");});
 if(!$('.map').height()) $('.map').css({"height":$(window).height()+"px"});


/* collapse js starts here */
    $('.tourleftArrow').click(function(e) {
        e.preventDefault();
        $(this).hide();
       $('.tourrightArrow').show();
        $('.taketourSec').animate({
            'left': '-121px'
        });
    });
     $('.tourrightArrow').click(function(e) {
        e.preventDefault();
        $(this).hide();
       $('.tourleftArrow').show();
        $('.taketourSec').animate({
            'left': '0'
        });
    });
    $(document).on("click", "#tk_tour", function(){$("#error_modal").load("take_tour").show();});
   <?php /* if(deviceType!=1 && '<?php echo $_COOKIE['boarding'];?>'=='' && !curl) $("#taketour_dv").load("take_tour");*/?>
    /* collapse js ends here */

});
$(window).load(function(){$(".lhid").show();<?php /*hide in css for font load*/?>});
/*near & onborad */
$(".shown-category .mob-cat-list li:last-child").hide();
    $("#cat-more-btn").on("click", function(){
      $(".rest-category").slideDown();
      $(this).hide();
      $(".shown-category .mob-cat-list li:last-child").show();
      $("#cat_tab h1").html("Search Nearby");
                        return false;
    });
    
    $("#cat-less-btn").on("click", function(){
      $(".rest-category").slideUp();
      $(".shown-category .mob-cat-list li:last-child").hide();
      $("#cat-more-btn").show();
      $("#cat_tab h1").html("Find nearby COVID-19 facilities");return false;
    });
                
/*$("#layer_panel_trigger").on("click", function(){$("#layer_panel_sec").addClass("layer_panel_pos");});
$("#layer_panel_close").on("click", function(){$("#layer_panel_sec").removeClass("layer_panel_pos");});*/
/*$("#layer_panel_trigger").on("click", function(e){ e.stopPropagation(); $("#mapLayerSidePanelMain").addClass("customPanelMain");$(".mapLayerMain .layer_sec").hide();$(".mapLayerMain .step_01").show();});
$("#mapLayerCLose").on("click", function(){$("#mapLayerSidePanelMain").removeClass("customPanelMain");});*/
if(window.innerHeight!=document.body.offsetHeight) $(".map").height(window.innerHeight);
$("#area_dv,#scale_dv").on("click", function(){ 
    if(!uname) {notify('You need to login to use this feature');loginDv(this.id);}
    else{
            if(this.id=='area_dv'){ if($('#scale_dv').hasClass('active')) return false; if($(this).hasClass('active')) {$('.eloc-message-alert').hide(); measureControl._finishMeasure();} else load_module('area'); $(this).toggleClass('active');}
            else {if($('#area_dv').hasClass('active')) return false;$(this).toggleClass('active'); if(!$('.leaflet-bar-part').length) {load_module('measure');} else plugin._toggleMeasure();}
        }
});
</script>

<?php /*
<div class="overlay-popup-sec in" id="app-card" aria-hidden="true" style="display:none;">
    <div class="overlay-main">
      <div class="overlay-main-content onboarding-scroll-mob">
        <button class="btn btn-default" data-dismiss="modal" onclick="$('#app-card').hide();">
        <i class="fa fa-times-circle"></i>
      </button>
        
        <div id="onboardingCarousel2" class="carousel slide" data-ride="carousel">

        <!-- Wrapper for slides -->
        <div class="carousel-inner">
                              <div class="item active">
            <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/opt_02.jpg" alt="" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text app-download-text">
                                                                <div class="map-app-icon">
                  <img src="images/onboarding/app_icon.png" alt="" />
                </div>
                <h2>The Map App for a Smarter Citizen</h2>
                <p>Available on</p>
                <div class="download-app-sec">
                                                                    <a href="https://play.google.com/store/apps/details?id=com.mmi.maps&amp;hl=en" target="_blank" rel="nofollow">
                    <img src="images/onboarding/android_app.png" alt="" />
                  </a>
                  <a href="https://itunes.apple.com/in/app/map-directions-local-searches-travel-guide/id723492531?mt=8" target="_blank" rel="nofollow">
                    <img src="images/onboarding/ios_app.png" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  
    </div>
    </div>
  </div>

<?php

   if(!$_COOKIE['boarding'] && !$cur_url ){
    ?>
<div class="overlay-popup-sec in" id="onboarding-popup-sec" aria-hidden="true" style="display:none" >
    <div class="overlay-main">
      <div class="overlay-main-content onboarding-scroll-mob">
        <button class="btn btn-default" data-dismiss="modal" onclick="close_boarding()">
        <i class="fa fa-times-circle"></i>
      </button>
        
        <div id="onboardingCarousel" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
                <li data-target="#onboardingCarousel" data-slide-to="0" class="active"></li>
                <li data-target="#onboardingCarousel" data-slide-to="1"></li>
        <li data-target="#onboardingCarousel" data-slide-to="2"></li>
        <li data-target="#onboardingCarousel" data-slide-to="3"></li>
        <li data-target="#onboardingCarousel" data-slide-to="4"></li>
        <li data-target="#onboardingCarousel" data-slide-to="5"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner">
                              
        <div class="item active">
            <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/onboarding_01.png" alt="">
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text">
                <h2>Search for house addresses, places or use quick search with</h2>
                <img src="images/onboarding/eloc.png" alt="">
              </div>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/onboarding_02.png" alt="">
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text">
                <h2>Find places nearby like petrol pumps, coffee, ATMs, parking etc. </h2>
              </div>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/onboarding_03.png" alt="">
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text">
                <h2>Track your phones and MapmyIndia Smart IoT devices</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div class="item">
          <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/onboarding_04.png" alt="">
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text">
                <h2>Report & get to know Swachh Bharat and Smart City issues like litter, traffic jam etc.</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div class="item">
          <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/onboarding_05.png" alt="">
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text">
                <h2>With "World View" discover what's cool around you </h2>
              </div>
            </div>
          </div>
        </div>
        
        <div class="item">
          <div class="row">
            <div class="col-md-6">
              <div class="onboarding-img">
                <img src="images/onboarding/onboarding_06.png" alt="">
              </div>
            </div>
            <div class="col-md-6">
              <div class="onboarding-text user-click-sec">
                <h2>Introducing Navigation with live traffic</h2>
                <div class="user-click-item text-center">
                                                                    <button class="btn" id="signup" onclick="$('#onboarding-popup-sec,.modal-backdrop').hide();$('#signup').click();">Sign up</button>
                  <button class="btn btn-signup" onclick="$('#signin').click();$('#onboarding-popup-sec,.modal-backdrop').hide();">Sign in</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Left and right controls -->
        <a class="left carousel-control" href="#onboardingCarousel" data-slide="prev">
        <i class="fa fa-angle-left"></i>
        </a>
        <a class="right carousel-control" href="#onboardingCarousel" data-slide="next">
        <i class="fa fa-angle-right"></i>
        </a>
      </div>
  
    </div>
    </div>
  </div>

    <script>
       
    $(window).load(function(){
        setTimeout(function(){var url = window.location.toString().split('/');var curl = url.slice(-1)[0];if(!curl || curl.indexOf('@')===0) $("#onboarding-popup-sec").modal("show"); },5000);
    });
    function close_boarding()
    {
       document.cookie = "boarding=1";
       setTimeout(function(){var url = window.location.toString().split('/');var curl = url.slice(-1)[0];if(!curl) $('#app-card').show(); },30000);
    }
    </script>
    <?php
    }
    
    */
    if(strpos($_SERVER['HTTP_HOST'],'.mapmyindia.com')!==false){
    ?>
   <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8HWD5J"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-17882747-9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-17882747-9');
    </script>
    <!-- <script type="text/javascript" src="//static.criteo.net/js/ld/ld.js" async="true"></script>
    <script type="text/javascript">
    window.criteo_q = window.criteo_q || [];
    var deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
    window.criteo_q.push(
     { event: "setAccount", account: 60015}, 
     { event: "setEmail", email: "##Email Address of user##" }, 
     { event: "setSiteType", type: deviceType},
     { event: "viewHome"});
    </script>  -->
<script>
    function ga_analytics(reqUrl)
    {
       gtag('config', 'UA-17882747-9');
    }
    function vid_mate_check(){}
    <?php 
 
    if(!$_SESSION['UID'])
    {
       $_SESSION['UID']=md5(session_id());  
       echo '$.ajax({url: "uid!"});';
    }
    ?>
</script>
<!-- Google Tag Manager -->
<!-- End Google Tag Manager (noscript) -->

<script>
   (function(h,o,t,j,a,r){
       h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
       h._hjSettings={hjid:156973,hjsv:6};
       a=o.getElementsByTagName('head')[0];
       r=o.createElement('script');r.async=1;
       r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
       a.appendChild(r);
   })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

<?php
}
else echo "<script>function ga_analytics(reqUrl){}</script>";
/*if($_SERVER['HTTP_HOST']=='maps.mapmyindia.com')*/
{
  
?>


<?php }
if($mobile) {
    echo '<script>
  if (\'serviceWorker\' in navigator) {
  
    navigator.serviceWorker.register(\'service-worker.js\')
      .then(function(reg){
     
      }).catch(function(err) {
        console.log("No it", err)
      });
  }
</script>';
}
?>
<div class="aqiHome" style="display: none;">
            <div class="aqiHomeItem clearfix">
                <div class="aqiHomeItemImg" id="weatherIcon">
                </div>
                <div class="aqiHomeItemText" id="htempp">
                    35<sup>0</sup>C
                </div>
            </div>  
           <div class="aqiHomeItem">
                <div class="aqiHomeData" id="haqi">AQI 15</div>
            </div>  
</div>



</html>
<?php
if($obcat) ob_end_flush();

if($ftl)  echo "<script>if(timer) clearInterval(timer);</script>"; 
?>




