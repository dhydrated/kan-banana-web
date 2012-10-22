
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
      model: KanBanana.Models.Project,
	  url: '/services/project'
  });
  
  KanBanana.Views.ProjectList = Backbone.View.extend({
      initialize: function(){
          console.log('ProjectList');
          this.render();
      },
      template: template('projects-list'),
      render: function() {
    	  
    	  var projects = new KanBanana.Collections.Projects();
    	  
    	  projects.fetch({
    		  success: function(){
    	    	  var index = projects.length;
    	    	  
    	    	  for (var i=0;i<index;i++){
    	    		  var project = projects.shift();
    	    		  
    	    		  var projectRow = new KanBanana.Views.ProjectRow({model: project})
    	    	  }

    		  },
    		  error: function(){
    			  console.log('error');
    		  }
    	  });
    	  
          this.$el.html(this.template(this));
          return this;
      }
  });
  

  KanBanana.Views.ProjectRow = Backbone.View.extend({
	  el: '#kb-projects-table',
      initialize: function(){
          console.log('ProjectRow');
          this.render();
      },
      template: template('project-row'),
      render: function() {
          this.$el.append(this.template(this));
          return this;
      },
      name: function() { 
    	  console.log(this.model.get('name'));
    	  return this.model.get('name');    
      },
      description: function() { 
    	  console.log(this.model.get('description'));
    	  return this.model.get('description');    
      }
  });

  // The initialize function is always called when instantiating a Backbone View.
  // Consider it the constructor of the class.
  var projectList = new KanBanana.Views.ProjectList({el: '#project-table'});
  

  //window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  //proj.save();

});
