
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
    	  this.fetch();
      },
      template: template('projects-list'),
      events: {
    	  "click .create-project" : "launchProjectForm",
    	  "click .save-project" : "saveProject",
    	  "click #kb-projects-table .btn-remove" : "removeProject",
    	  "click #kb-projects-table .btn-edit" : "launchEditProjectForm"
      },
      render: function() {
          this.$el.html(this.template(this));
    	  that = this;
    	  this.projects.each(function(project){
			  var projectRow = new KanBanana.Views.ProjectRow({id: project.get('id'), model: project});
			  that.$('#kb-projects-table').append(projectRow.render().el);
		  },this);
          return this;
      },
      fetch: function() {
    	  this.projects = new KanBanana.Collections.Projects();
    	  var that = this;
    	  this.projects.fetch({
    		  success: function(){
    			  that.render();
    		  },
    		  error: function(){
    			  console.log('error');
    		  }
    	  });
      },
      launchProjectForm: function(){
    	  var form =  $('#project-form-modal');
    	  form.modal();
    	  
    	  form.find('#project-name').val('');
    	  form.find('#project-name').focus();
    	  form.find('#project-desc').val('');
      },
      launchEditProjectForm: function(events){
    	  
    	  this.launchProjectForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.projects.each(function(project){
    		  if(project.get && project.get('id') == selectedId){
		    	  var form =  $('#project-form-modal');
		    	  form.modal();
				  form.find('#project-id').val(project.get('id'));
				  form.find('#project-name').val(project.get('name'));
				  form.find('#project-desc').val(project.get('description'));
    		  }
    	  });
    	  
      },
      saveProject: function(){
    	  that = this;
    	  var form =  $('#project-form-modal');
    	  var projectId = form.find('#project-id').val();
    	  
    	  //new
    	  if(projectId === ''){
    		  var newProject = new KanBanana.Models.Project({name: $('#project-name').val(), description: $('#project-desc').val()});
        	  newProject.save({},{success: function(model, response) {
        		  that.projects.add(model);
        		  var projectRow = new KanBanana.Views.ProjectRow({id: newProject.get('id'), model: newProject});
        		  that.$('#kb-projects-table').append(projectRow.render().el);
    		  }});
    	  }
    	  //update
    	  else{
    		  this.projects.each(function(project){
        		  if(project.get && project.get('id') == projectId){
    		    	  var form =  $('#project-form-modal');
    		    	  form.modal();
    				  project.set('name', form.find('#project-name').val());
    				  project.set('description', form.find('#project-desc').val());
        			  project.save({success: function(model, response) {
        			  }});
        		  }
        	  });
    	  }
    	  
    	  $('#project-form-modal').modal('hide');
    	  
    	  this.render();
      },
      removeProject: function(events){
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.projects.each(function(project){
    		  if(project && project.get('id') == selectedId){
    			  project.destroy({success: function(model, response) {
    				  $('#'+selectedId).remove();  
    			  }});
    		  }
    	  });
      },
  });
  

  KanBanana.Views.ProjectRow = Backbone.View.extend({
	  tagName: "tr",
      template: template('project-row'),
      render: function() {
          this.$el.html(this.template(this));
          return this;
      },
      name: function() { 
    	  return this.model.get('name');    
      },
      description: function() { 
    	  return this.model.get('description');    
      },
  });

  

  KanBanana.Views.ProjectView = Backbone.View.extend({
	  template: template('project-view'),
      initialize: function(){
    	  this.render();
      },
      render: function() {
          this.$el.append(this.template(this));
          var projectList = new KanBanana.Views.ProjectList({el: "#project-table"});
          return this;
      }
  });
  
  KanBanana.Router = Backbone.Router.extend({
	    initialize: function(options) {
	      this.el = options.el
	    },
	    routes: {
	      "": "index",
		  "projects": "projects"
	    },
	    index: function() {
	    	console.log('index');
	    },
	    projects: function() {
	    	console.log('projects');
	    	new KanBanana.Views.ProjectView({el: this.el});
	    }
	  });

	  KanBanana.boot = function(container) {
	    container = $(container);
	    var router = new KanBanana.Router({el: container})
	    Backbone.history.start();
	  }

  
});
