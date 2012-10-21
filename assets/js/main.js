
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
	  urlRoot: '/services/project'
  });

  window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  proj.save();

});
