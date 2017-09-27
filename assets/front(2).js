jQuery.fn.exists = function(){return this.length>0;}
var ajax_request;

function busy(e,button)
{
	if (e) {
        $('body').css('cursor', 'wait');	
    } else $('body').css('cursor', 'auto');        

    if (e) {    
    	dump('busy loading');        
        $(".main-preloader").show();
        if (!empty(button)){           
	 	   button.css({ 'pointer-events' : 'none' });	 	   	  
	 	}	 		 	
    } else {    	
    	dump('done loading');
    	$(".main-preloader").hide();    	
    	if (!empty(button)){
	 	   button.css({ 'pointer-events' : 'auto' });	 	   	  
	 	}
    }       
}

function empty(data)
{
	if (typeof data === "undefined" || data==null || data=="" ) { 
		return true;
	}
	return false;
}

function dump(data)
{
	console.debug(data);
}

$(document).ready(function(){
	
	if ( $(".readmore").exists() ){
		$('.readmore').readmore({
		  speed: 75,
		  collapsedHeight:25,
		  moreLink: '<a href="javascript:;">'+js_lang.read_more+'</a>',
		  lessLink: '<a href="javascript:;">'+js_lang.read_less+'</a>'
		});
	}
	
	if ( $(".select-material").exists() ) {
       $('.select-material').material_select();
    }	
    
     if ( $(".mobile_inputs").exists()){
      try {	
	      $(".mobile_inputs").intlTelInput({      
	        autoPlaceholder: false,		
	        defaultCountry: default_country,            
	        autoHideDialCode:true,    
	        nationalMode:false,
	        autoFormat:false,
	        utilsScript: site_url+"/assets/intel/lib/libphonenumber/build/utils.js"
	      });
	   }
	   catch(err) {
		 dump(err.message);
	   }   
    }	     
    
    $.validate({ 	
		language : jsLanguageValidator,
	    form : '#frm',    
	    onError : function() {      
	    },
	    onSuccess : function() { 	           
	      var params= $("#frm").serialize();
	      var action = $("#frm #action").val();
	      var button = $('#frm button[type="submit"]');
	      dump(button);
	      callAjax(action,params,button);
	      return false;
	    }  
	}); 
		
	$.validate({ 	
		language : jsLanguageValidator,
	    form : '#frm-trytrial',    
	    onError : function() {      
	    },
	    onSuccess : function() { 	           
	      window.location.href = home_url+"/pricing/?email="+ $("#email_address").val();
	      return false;
	    }  
	}); 
	
	$( document ).on( "click", ".resend-code", function() {
	    callAjax("resendCode","hash="+$("#hash").val() +"&verification_type="+$("#verification_type").val() , $(".btn") );
	}); 
				
	$( document ).on( "click", ".language-selector", function() {	
		var h=$("#lang-list").height()+3;
		dump(h);	
		$("#lang-list").css({"top":"-"+h+"px"});
		$("#lang-list").slideToggle( "fast" );
	});
	
			
	$.validate({ 	
		language : jsLanguageValidator,
	    form : '#frm-existing',    
	    onError : function() {      
	    },
	    onSuccess : function() { 	           
	      var params= $("#frm-existing").serialize();
	      var action = $("#frm-existing #action").val();
	      var button = $('#frm-existing button[type="submit"]');
	      dump(button);
	      callAjax(action,params,button);
	      return false;
	    }  
	}); 
	
	$( document ).on( "click", ".existing-click", function() {		
		$(".existing-application-wrap").slideToggle( "fast" );
	});
	
	$( document ).on( "click", ".mobile-toggle", function() {				
	   $( ".mobile-menu-wrap" ).slideToggle( "fast", function() {    		  	  
       });
	});
	
}); /*end docu*/

/*mycall*/
function callAjax(action,params,button)
{
		
	dump(ajax_url+"/"+action+"?"+params);
	
	params+="&language="+language;
	
	ajax_request = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		//async: false,
		dataType: 'json',
		//timeout: 10000,		
	 beforeSend: function() {
	 	dump("before=>");
	 	dump( ajax_request );
	 	if(ajax_request != null) {
	 	   ajax_request.abort();
	 	   dump("ajax abort");
	 	   busy(false,button);	 	   
	 	} else {
	 	   busy(true,button);	 	  
	 	}
	 },
	 complete: function(data) {					
		ajax_request= (function () { return; })();
		dump( 'Completed');
		dump(ajax_request);
		
		busy(false,button);
				
	 },
	 success: function (data) {	  
	 	dump(data);
	 	
	 	dump("action->"+action);
	 	
	 	if (data.code==1){
	 			 	
	 		switch (action)
	 		{				
	 			case "signup":
	 			case "verifySignupCode":	
	 			case "getSignup": 			
	 			toast(data.msg);
	 			window.location.href = data.details;
	 			break;
	 			
	 			case "paymentOption":	 
	 			case "paypalExpressCheckout":
	 			case "PaymentStripe":
	 			case "atz":
	 			
	 			setTimeout(function () {
                   button.css({ 'pointer-events' : 'none' });	 
                }, 200);
                
	 			toast(data.msg);
	 			window.location.href = data.details;
	 			break;
	 			
	 			case "customerRating":
	 			 //alert(data.msg);
	 			 $(".track-rating-wrap").html( '<h3 style="margin-top:40%;">'+data.msg+"</h3>");
	 			break;
	 			
	 			default:	 	 			
	 			toast(data.msg);
	 			break;
	 		}
	 		
	 	} else {
	 		
	 		// failed mycon
	 		switch ( action )
	 		{	 		 			
	 			
	 			case "customerRating":
	 			 alert(data.msg);
	 			break;
	 			
	 			default :	 			 			
	 			toastf(data.msg);	
	 			break;
	 		}
	 			 		
	 	}
	 },
	 error: function (request,error) {	    
	 	 	 		
	 }
    });       
}

function toast(message)
{
	 Materialize.toast(message, 4000,'toast-success');
}
function toastf(message)
{
	 Materialize.toast(message, 4000);
}

$(document).ready(function(){
	$.validate({ 	
		language : jsLanguageValidator,
	    form : '#frm-stripe',    
	    onError : function() {      
	    },
	    onSuccess : function() { 	           
	      	    	
	       var cards = $("#card_number").val();       
	       var cvv = $("#cvc").val();  
	       var expiration_yr = $("#expiration_year").val(); 
	       var expiration_month = $("#expiration_month").val();  	       
	            
	       dump("cards->"+cards);
	       dump("cvv->"+cvv);	       
	       dump("expiration_yr->"+expiration_yr);
	       dump("expiration_month->"+expiration_month);
	       busy(true);
	       
	       Stripe.setPublishableKey( $("#publish_key").val() );
	       Stripe.card.createToken({
			  number: cards ,
			  cvc: cvv,
			  exp_month: expiration_month ,
			  exp_year: expiration_yr
		   }, stripeResponseHandler);	
		   
	       return false;
	    }  
	}); 
}); 

function stripeResponseHandler(status, response)
{
	dump('stripe response');
	dump(status);
	dump(response);
	if (response.error) {
		busy(false);
		toastf( response.error.message );
	} else {
		busy(false);
		var button = $('#frm-stripe button[type="submit"]');
		var params = $( "#frm-stripe").serialize();     
		params+="&stripe_token="+response.id;   
        callAjax("PaymentStripe",params,button);	       
	}
}

var map_track;
var track_marker_location;
var track_marker_driver;
var track_marker_drofoff;
var bounds = [];
var track_origin;
var track_driver_location;
var track_dropoff;
var track_route_type=1;
var track_interval_handle;
var track_ajax;

$(document).ready(function(){
	
	if ( $(".track_map").exists() ){		
		map_track = new GMaps({
		  div: '.track_map',
		   lat: task_lat ,
	       lng: task_lng ,
		   zoom: 5,
		   styles: map_style,
		   mapTypeControl :false
		}); 
		
				
		var latlng = new google.maps.LatLng(task_lat, task_lng );
		bounds.push(latlng);
		
		map_track.setCenter( task_lat , task_lng );
	    //map_track.setZoom(10);

	    track_origin=[task_lat,task_lng];
	    
	    /*task location*/
	    track_marker_location = map_track.addMarker({
          lat: task_lat ,
          lng: task_lng ,
          icon : icon_finish ,
          infoWindow:{
          	 content: delivery_address
          }
        });
	    
        /*driver location*/
        if ( driver_location_lat>0){        	
        	track_marker_driver = map_track.addMarker({
	          lat: driver_location_lat ,
	          lng: driver_location_lng ,
	          icon : icon_driver ,
	          infoWindow:{
	          	 content: driver_info_window
	          }
	        });
	        
	        track_driver_location=[driver_location_lat,driver_location_lng];
	        
	        var latlng = new google.maps.LatLng(driver_location_lat, driver_location_lng );
		    bounds.push(latlng);
		    
		    track_route_type=2;
		    
		    
		    map_track.addControl({
			  position: 'top_right',
			  content: find_driver_label ,
			  style: {
			    margin: '20px 10px',
			    padding: '1px 6px',
			    border: 'solid 1px #717B87',
			    background: '#fff'
			  },
			  events: {
			    click: function(){
			    	findDriver();
			    }
			  }
			});
			    		    
        } 
        
        /*droff off*/
        if (!empty(dropoff_task_lat)){
        	track_marker_drofoff = map_track.addMarker({
	          lat: dropoff_task_lat ,
	          lng: dropoff_task_lng ,
	          icon : icon_dropoff ,
	          infoWindow:{
	          	 content: drofoff_info_window
	          }
	        });
	        
	        var latlng = new google.maps.LatLng(dropoff_task_lat, dropoff_task_lng );
		    bounds.push(latlng);
		    
		    track_dropoff = [dropoff_task_lat , dropoff_task_lng ];
		    
		    track_route_type=3;
		    
        }
        
        map_track.fitLatLngBounds(bounds);

        // plot route
        dump(track_route_type);
        switch (track_route_type)
        {
        	case 2:
	        	map_track.drawRoute({
	        		origin: track_origin,
	        		destination: track_driver_location,
	        		travelMode : travel_mode,        		
	        		strokeColor: '#fdab1a',
	                strokeOpacity: 0.5,
	                strokeWeight: 6
	        	});
        	break;
        	
        	case 3:
        	  if ( trans_type=="delivery"){
        	  	 map_track.drawRoute({
	        		origin: track_driver_location,
	        		destination: track_dropoff,
	        		travelMode : travel_mode,        		
	        		strokeColor: '#fdab1a',
	                strokeOpacity: 0.5,
	                strokeWeight: 6
	        	 });
	        	 
	        	 map_track.drawRoute({
	        		origin: track_dropoff,
	        		destination: track_origin,
	        		travelMode : travel_mode,        		
	        		strokeColor: '#98bbf6',
	                strokeOpacity: 0.5,
	                strokeWeight: 6
	        	 });
	        	 
        	  } else {
        	  	
        	  	 map_track.drawRoute({
	        		origin: track_driver_location,
	        		destination: track_origin,
	        		travelMode : travel_mode,        		
	        		strokeColor: '#fdab1a',
	                strokeOpacity: 0.5,
	                strokeWeight: 6
	        	 });
	        	 
	        	 map_track.drawRoute({
	        		origin: track_origin,
	        		destination: track_dropoff,
	        		travelMode : travel_mode,        		
	        		strokeColor: '#98bbf6',
	                strokeOpacity: 0.5,
	                strokeWeight: 6
	        	 });
        	  	
        	  }
        	break;
        }

        /*run track ajax */
        runTrackMap();
        //track_interval_handle = setInterval(function(){runTrackMap()}, 8000);
        
	} /*exists*/
			
	$( document ).on( "click", ".track-center-map", function() {
		map_track.fitLatLngBounds(bounds);
	});
	
	if ( $(".raty-stars").exists() ){
		initRating();
	}
	
});/* end ready*/

function findDriver()
{
	map_track.setCenter( driver_location_lat , driver_location_lng );
    map_track.setZoom(16);
}

function runTrackMap()
{
	dump( $("#task_status").val() );
	if ( $("#task_status").val()=="cancel" || $("#task_status").val()=="failed" ){		
		return;
	}
	
	 if($("#task_status").val()=="successful"){
	 	$(".track-rating-wrap").show();
	 	return;
	 }
	
	if ( $("#task_status").val()=="inprogress"){
		$(".track-arrived-wrap").show();
		$(".eta-wrap").hide();
		$(".track-contact-wrap").show();
		return;
	}
	
	var action='runTrackMap';
	var params="task_id="+task_id;
	
	track_ajax = $.ajax({
		url: ajax_url+"/"+action, 
		data: params,
		type: 'post',                  
		//async: false,
		dataType: 'json',
		//timeout: 10000,		
	 beforeSend: function() {
	 	dump("before=>");
	 	dump( track_ajax );
	 	if(track_ajax != null) {
	 	   track_ajax.abort();
	 	   dump("ajax abort");	 	   	 	 
	 	   $(".spinner").hide();
	 	} else {	 	   
	 	   $(".spinner").show();
	 	}
	 },
	 complete: function(data) {					
		track_ajax= (function () { return; })();		
		dump(track_ajax);							
	 },
	 success: function (data) {	  
	      clearInterval(track_interval_handle);	 
	      track_interval_handle = setInterval(function(){runTrackMap()}, 8500);
	      //dump(data.details.task_info.status_raw);
	      $(".spinner").hide();
	      if ( data.code==1){	      
	      	   task_info = data.details.task_info;
	      	   dump(task_info);
	      	   
	      	   $(".task-stats").html( task_info.status );	      	   	      	   	      	   
	      	   $(".track_eta").html( task_info.eta );	      	   
	      	   $("#task_status").val( task_info.status_raw )
	      	   
	      	   if ( task_info.driver_id>0){
	      	   	  dump(' has driver id');
	      	   	  if (!empty(track_marker_driver)){
	      	   	  	   dump('track_marker_driver defined ');
	      	           track_marker_driver.setPosition( new google.maps.LatLng( task_info.driver_location_lat , task_info.driver_location_lng ) );	      	   
	      	   	  } else {
	      	   	  	  
	      	   	  }
	      	   } else {
	      	   	  dump('no assign driver');
	      	   }
	      	   	      	   
	      } else {
	      	  $(".track_eta").html( "" );
	      }
     },
	 error: function (request,error) {	    
	 	  clearInterval(track_interval_handle);	 	 	 		
	 	  track_interval_handle = setInterval(function(){runTrackMap()}, 8500);
	 }
    });  	 
}

function initRating()
{
	$('.raty-stars').raty({ 
		readOnly: false, 
		score: function() {
             return $(this).attr('data-score');
       },
		path: site_url+'/assets/raty/images',
		hints:''
    });    
}