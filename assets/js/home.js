
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
      events: {
    	  "click .create-project" : "launchProjectForm",
    	  "click .save-project" : "saveProject"
      },
      render: function() {
    	  var projects = new KanBanana.Collections.Projects();
    	  projects.fetch({
    		  success: function(){
    			  projects.each(function(project){
    				  var projectRow = new KanBanana.Views.ProjectRow({model: project});
    			  },this)
    		  },
    		  error: function(){
    			  console.log('error');
    		  }
    	  });
    	  
          this.$el.html(this.template(this));
          return this;
      },
      launchProjectForm: function(){
    	  $('#project-form-modal').modal();
      },
      saveProject: function(){
    	  console.log('save');
    	  
    	  var newProject = new KanBanana.Models.Project({name: $('#project-name').val(), description: $('#project-desc').val()});
    	  var projectRow = new KanBanana.Views.ProjectRow({model: newProject});
    	  newProject.save();
    	  
    	  $('#project-form-modal').modal('hide');
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
    	  self = this;
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  if(selectedId == this.id()){
        	  this.model.destroy({success: function(model, response) {
        		  self.$el.find('#'+domId).parentsUntil(self.$el).remove();  
        	  }});
    	  }
      },
  });

  // The initialize function is always called when instantiating a Backbone View.
  // Consider it the constructor of the class.
  var projectList = new KanBanana.Views.ProjectList({el: '#project-table'});
  

  //window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  //proj.save();

});
