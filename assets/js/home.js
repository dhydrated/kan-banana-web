
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

  KanBanana.Views.GenericModelRow = Backbone.View.extend({
	  tagName: "tr",
      template: template('generic-model-row'),
      render: function() {
          this.$el.html(this.template(this));
          return this;
      },
      name: function() { 
    	  return this.model.get('name');    
      },
  });
  
  KanBanana.Views.StatusList = Backbone.View.extend({
      initialize: function(){
    	  this.fetch();
      },
      template: template('statuses-list'),
      events: {
    	  "click .create-status" : "launchStatusForm",
    	  "click .save-status" : "saveStatus",
    	  "click #kb-statuses-table .btn-remove" : "removeStatus",
    	  "click #kb-statuses-table .btn-edit" : "launchEditStatusForm"
      },
      render: function() {
          this.$el.html(this.template(this));
    	  that = this;
    	  this.statuses.each(function(status){
			  var statusRow = new KanBanana.Views.StatusRow({id: status.get('id'), model: status});
			  that.$('#kb-statuses-table').append(statusRow.render().el);
		  },this);
          return this;
      },
      fetch: function() {
    	  
    	  KanBanana.Collections.Statuses = Backbone.Collection.extend({
    		  url: '/services/project/'+this.options.projectId+'/status'
    	  });
    	  
    	  this.statuses = new KanBanana.Collections.Statuses(context);
    	  var that = this;
    	  this.statuses.fetch({
    		  success: function(){
    			  that.render();
    		  },
    		  error: function(){
    			  console.log('error');
    		  }
    	  });
      },
      launchStatusForm: function(){
    	  var form =  $('#status-form-modal');
    	  form.modal();
    	  
    	  form.find('#status-name').val('');
    	  form.find('#status-name').focus();
      },
      launchEditStatusForm: function(events){
    	  
    	  this.launchStatusForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.statuses.each(function(status){
    		  if(status && status.get('id') == selectedId){
		    	  var form =  $('#status-form-modal');
		    	  form.modal();
				  form.find('#status-id').val(project.get('id'));
				  form.find('#status-name').val(project.get('name'));
    		  }
    	  });
    	  
      },
      saveStatus: function(){
    	  that = this;
    	  var form =  $('#status-form-modal');
    	  var statusId = form.find('#status-id').val();
    	  
    	  //new
    	  if(statusId === ''){
    		  var newStatus = new KanBanana.Models.Status({name: $('#project-name').val()});
        	  newStatus.save({},{success: function(model, response) {
        		  that.statuses.add(model);
        		  var statusRow = new KanBanana.Views.StatusRow({id: newStatus.get('id'), model: newStatus});
        		  that.$('#kb-statuses-table').append(statusRow.render().el);
    		  }});
    	  }
    	  //update
    	  else{
    		  this.statuses.each(function(status){
        		  if(status && status.get('id') == statusId){
    		    	  var form =  $('#status-form-modal');
    		    	  form.modal();
    		    	  status.set('name', form.find('#status-name').val());
    		    	  status.save({success: function(model, response) {
        			  }});
        		  }
        	  });
    	  }
    	  
    	  $('#status-form-modal').modal('hide');
    	  
    	  this.render();
      },
      removeStatus: function(events){
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.statuses.each(function(status){
    		  if(status && status.get('id') == selectedId){
    			  status.destroy({success: function(model, response) {
    				  $('#'+selectedId).remove();  
    			  }});
    		  }
    	  });
      },
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

  KanBanana.Views.ProjectView = Backbone.View.extend({
	  template: template('project-view'),
      initialize: function(){
    	  this.render();
      },
      render: function() {
    	  this.$el.empty();
          this.$el.append(this.template(this));
          new KanBanana.Views.ProjectList({el: "#project-table"});
          return this;
      }
  });

  KanBanana.Views.ProjectSettingsView = Backbone.View.extend({
	  template: template('project-settings-view'),
      initialize: function(){
    	  this.render();
      },
      render: function() {
    	  this.$el.empty();
          this.$el.append(this.template(this));
          new KanBanana.Views.StatusList({el: "#status-table", projectId: this.options.projectId});
          return this;
      }
  });

  KanBanana.Views.IndexView = Backbone.View.extend({
	  template: template('index-view'),
      initialize: function(){
    	  this.render();
      },
      render: function() {
    	  this.$el.empty();
          this.$el.html(this.template(this));
          return this;
      }
  });
  
  KanBanana.Router = Backbone.Router.extend({
	    initialize: function(options) {
	      this.el = options.el
	    },
	    routes: {
	      "": "index",
		  "projects": "projects",
		  "project-settings/:projectId": "projectSettings",
	    },
	    index: function() {
	    	console.log('index');
	    	new KanBanana.Views.IndexView({el: this.el});
	    },
	    projects: function() {
	    	console.log('projects');
	    	new KanBanana.Views.ProjectView({el: this.el});
	    },
	    projectSettings: function(projectId) {
	    	console.log('projectSettings');
	    	console.log('projectId: ' + projectId);
	    	context = {el: this.el, projectId: projectId};
	    	new KanBanana.Views.ProjectSettingsView(context);
	    }
	  });

	  KanBanana.boot = function(container) {
	    container = $(container);
	    var router = new KanBanana.Router({el: container})
	    Backbone.history.start();
	  }

  
});
