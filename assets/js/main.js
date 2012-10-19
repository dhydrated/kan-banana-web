
window.KanBanana = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    console.log('Hello from Backbone!');
  }
};

$(document).ready(function(){
  KanBanana.init();
  
  var template = function(name) {
    return Handlebars.compile($('#'+name+'-template').html());
  };

  KanBanana.Views.Project = Backbone.Model.extend({
	  
  });

  window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  var jqXhr = $.ajax({
      type: "GET",
      url: '/service/project/agxzfmthbi1iYW5hbmFyDgsSB1Byb2plY3QY0Q8M',
      //url: '/service/project',
      beforeSend: function( xhr ) {
        xhr.overrideMimeType( 'application/json;charset=UTF-8' );
      },
      contentType: 'application/json;charset=UTF-8', 
      dataType: 'json',
      //data: JSON.stringify(window.proj.toJSON()),
      context: this,
      async: true,           
    });


  jqXhr.done(this._successHandler);
  
  function _successHandler(data){
	  
	  console.log(data);
  }
});
