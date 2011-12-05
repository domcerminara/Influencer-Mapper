//Dominic Cerminara

//Send Request to get Klout influencers
function getKlout(handle) {                                   
    $.ajax({
      url: 'http://api.klout.com/1/soi/influenced_by.json?',
      data: {
        key: '5g4hjp8svh6sam8fe7jhzpd2',
        users: handle,
        callback: 'getTwitter'
      },
      dataType: 'jsonp'
    });
    
    return false;
  };           

  function getTwitter(result) {
     if(!result.users)
     {
       $('#error').html("<p>This twitter account doesn't have any influencers!</p>");   
     }
     $.getJSON("http://api.twitter.com/1/users/lookup.json?screen_name=" + result.users[0].twitter_screen_name + "," + result.users[0].influencers[0].twitter_screen_name + "," + result.users[0].influencers[1].twitter_screen_name + "," + result.users[0].influencers[2].twitter_screen_name + "," + result.users[0].influencers[3].twitter_screen_name + "," + result.users[0].influencers[4].twitter_screen_name + "&include_entities=true&callback=?", 
      function(json) {
      var users = new Array();
      for(var i=0;i<json.length;i++)
      {
        if(json[i].status && json[i].status.geo)
        {
          var x = {
            twitter: json[i].screen_name, 
            location: json[i].status.geo
            };
          users.push(x);
        }
        else
        {
          var x = {
            twitter: json[i].screen_name, 
            location: json[i].location
            };
          users.push(x);
        }
      }
      plotMarkers(users);  
      });
      };
      
function plotMarkers(users){
  for(var x=0;x<users.length;x++)
  { 
    if(users[x].location.coordinates)
    {
      var myLatlng = new google.maps.LatLng(users[x].location.coordinates[0], users[x].location.coordinates[1]);
      var center = users[x].twitter;
      break;
    }  
  }
  
  var myOptions = {
    zoom: 10,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: center
});
  for(var i=0;i<users.length;i++)
  {
    if(users[i].location.coordinates)
    {
      var marker = new google.maps.Marker({
      position: new google.maps.LatLng(users[i].location.coordinates[0], users[i].location.coordinates[1]),
      map: map,
      title: users[i].twitter
      });
    }
    else
    {
      $('#others').html("<p>You are also influenced by these Tweeters, but they don't share their location! <a href='/'>Find more influencers!</a></p>");
      $('#others').after("<a href='http://twitter.com/" + users[i].twitter + "' target='_blank' class='otherTweeter'><p>" + users[i].twitter + "</p></a>");
    }
  }
};      
      
      
