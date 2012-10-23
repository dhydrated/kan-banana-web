
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
          this.render();
      },
      template: template('project-row'),
      events: {
    	"click .btn-remove ": "remove",  
      },
      render: function() {
          this.$el.append(this.template(this));
          return this;
      },
      id: function() { 
    	  return this.model.get('id');    
      },
      name: function() { 
    	  return this.model.get('name');    
      },
      description: function() { 
    	  return this.model.get('description');    
      },
      remove: function(events){
    	  selectedId = events.currentTarget.id.replace('remove-','');
    	  if(selectedId == this.id()){
        	  alert(this.model.get('id'));
    	  }
      },
  });

  // The initialize function is always called when instantiating a Backbone View.
  // Consider it the constructor of the class.
  var projectList = new KanBanana.Views.ProjectList({el: '#project-table'});
  

  //window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  //proj.save();

});
