
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

  KanBanana.Models.Project = Backbone.Model.extend({
	  urlRoot: '/services/project'
  });
  
  KanBanana.Collections.Projects = Backbone.Collection.extend({
      model: KanBanana.Models.Project
  });
  
  KanBanana.Views.ProjectList = Backbone.View.extend({
      initialize: function(){
          alert("Alerts suck.");
      },
      render:
  });

  // The initialize function is always called when instantiating a Backbone View.
  // Consider it the constructor of the class.
  var projectList = new KanBanana.Views.ProjectList();
  

  //window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  //proj.save();

});
