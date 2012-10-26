
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
//          console.log('ProjectList');
          this.render();
      },
      template: template('projects-list'),
      events: {
    	  "click .create-project" : "launchProjectForm",
    	  "click .save-project" : "saveProject",
    	  "click #kb-projects-table .btn-remove" : "removeProject"
      },
      render: function() {
    	  this.projects = new KanBanana.Collections.Projects();
    	  var that = this;
    	  this.projects.fetch({
    		  success: function(){
    			  that.projects.each(function(project){
    				  var projectRow = new KanBanana.Views.ProjectRow({id: project.get('id'), model: project});
    				  that.$('#kb-projects-table').append(projectRow.render().el);
    			  },this);
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
    	  that = this;
    	  var newProject = new KanBanana.Models.Project({name: $('#project-name').val(), description: $('#project-desc').val()});
    	  newProject.save({},{success: function(model, response) {
    		  that.projects.add(model);
    		  var projectRow = new KanBanana.Views.ProjectRow({id: newProject.get('id'), model: newProject});
    		  that.$('#kb-projects-table').append(projectRow.render().el);
		  }});
    	 
    	  
    	  $('#project-form-modal').modal('hide');
      },
      removeProject: function(events){
    	  self = this;
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.projects.each(function(project){
    		  if(project.get && project.get('id') == selectedId){
    			  project.destroy({success: function(model, response) {
    				  $('#'+selectedId).remove();  
    			  }});
    		  }
    	  });
      },
  });
  

  KanBanana.Views.ProjectRow = Backbone.View.extend({
	  //el: '#kb-projects-table',
	  tagName: "tr",
      initialize: function(){
//          this.render();
      },
      template: template('project-row'),
      events: {
    	"click .btn-remove ": "remove",  
      },
      render: function() {
          this.$el.html(this.template(this));
          return this;
      },
      //id: function() { 
    	//  return this.model.get('id');    
      //},
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
    	  console.log(selectedId + ' = ' + this.id);
    	  if(selectedId == this.id){
        	  //this.model.destroy({success: function(model, response) {
        		//  self.$el.find('#'+domId).parentsUntil(self.$el).remove();  
        	  //}});
    	  }
      },
  });

  // The initialize function is always called when instantiating a Backbone View.
  // Consider it the constructor of the class.
  var projectList = new KanBanana.Views.ProjectList({el: '#project-table'});
  

  //window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  //proj.save();

});
