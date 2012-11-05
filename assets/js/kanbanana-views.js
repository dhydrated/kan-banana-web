
  
  
  var template = function(name) {
    return Handlebars.compile($('#'+name+'-template').html());
  };
  
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
    	  this.projectId = this.options.projectId;
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
			  var statusRow = new KanBanana.Views.GenericModelRow({id: status.get('id'), model: status});
			  that.$('#kb-statuses-table').append(statusRow.render().el);
		  },this);
          return this;
      },
      fetch: function() {
    	  
    	  this.statuses = new KanBanana.Collections.Statuses({projectId: this.projectId});
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
				  form.find('#status-id').val(status.get('id'));
				  form.find('#status-name').val(status.get('name'));
    		  }
    	  });
    	  
      },
      saveStatus: function(){
    	  that = this;
    	  var form =  $('#status-form-modal');
    	  var statusId = form.find('#status-id').val();
    	  
    	  //new
    	  if(statusId === ''){
    		  var newStatus = new KanBanana.Models.Status({name: $('#status-name').val(), projectId: this.projectId});
        	  newStatus.save({},{success: function(model, response) {
        		  that.statuses.add(model);
        		  var statusRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
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
    	  console.log('remove');
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.statuses.each(function(status){
    		  console.log(status.get('id')  + ' = ' + selectedId);
    		  if(status && status.get('id') == selectedId){
    			  console.log(status);
    			  status.destroy({success: function(model, response) {
    				  console.log(model);
    				  $('#'+selectedId).remove();  
    			  }});
    		  }
    	  });
      },
  });
  
  KanBanana.Views.SizeList = Backbone.View.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
      },
      template: template('sizes-list'),
      events: {
    	  "click .create-size" : "launchCreateForm",
    	  "click .save-size" : "save",
    	  "click #kb-sizes-table .btn-remove" : "remove",
    	  "click #kb-sizes-table .btn-edit" : "launchEditForm"
      },
      render: function() {
          this.$el.html(this.template(this));
    	  that = this;
    	  this.sizes.each(function(size){
			  var aRow = new KanBanana.Views.GenericModelRow({id: size.get('id'), model: size});
			  that.$('#kb-sizes-table').append(aRow.render().el);
		  },this);
          return this;
      },
      fetch: function() {
    	  
    	  this.sizes = new KanBanana.Collections.Sizes({projectId: this.projectId});
    	  var that = this;
    	  this.sizes.fetch({
    		  success: function(){
    			  that.render();
    		  },
    		  error: function(){
    			  console.log('error');
    		  }
    	  });
      },
      launchCreateForm: function(){
    	  console.log('create');
    	  var form =  $('#size-form-modal');
    	  form.modal();
    	  
    	  form.find('#size-name').val('');
    	  form.find('#size-name').focus();
    	  form.find('#size-value').val('');
      },
      launchEditForm: function(events){
    	  
    	  this.launchCreateForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.sizes.each(function(aModel){
    		  if(aModel && aModel.get('id') == selectedId){
		    	  var form =  $('#size-form-modal');
		    	  form.modal();
				  form.find('#size-id').val(aModel.get('id'));
				  form.find('#size-name').val(aModel.get('name'));
				  form.find('#size-value').val(aModel.get('value'));
    		  }
    	  });
    	  
      },
      save: function(){
    	  that = this;
    	  var form =  $('#size-form-modal');
    	  var modelId = form.find('#size-id').val();
    	  
    	  //new
    	  if(modelId === ''){
    		  var newModel = new KanBanana.Models.Size({
    			  name: $('#size-name').val()
    			  , value: $('#size-value').val()
    			  , projectId: this.projectId
    		  });
        	  newModel.save({},{success: function(model, response) {
        		  that.sizes.add(model);
        		  var aRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
        		  that.$('#kb-sizes-table').append(aRow.render().el);
    		  }});
    	  }
    	  //update
    	  else{
    		  this.sizes.each(function(aModel){
        		  if(aModel && aModel.get('id') == modelId){
    		    	  var form =  $('#size-form-modal');
    		    	  form.modal();
    		    	  aModel.set('name', form.find('#size-name').val());
    		    	  aModel.set('value', form.find('#size-value').val());
    		    	  aModel.save({success: function(model, response) {
        			  }});
        		  }
        	  });
    	  }
    	  
    	  $('#size-form-modal').modal('hide');
    	  
    	  this.render();
      },
      remove: function(events){
    	  console.log('remove');
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.sizes.each(function(aModel){
    		  if(aModel && aModel.get('id') == selectedId){
    			  aModel.destroy({success: function(model, response) {
    				  console.log(model);
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
    	  this.projectId = this.options.projectId;
    	  this.render();
      },
      render: function() {
    	  this.$el.empty();
          this.$el.append(this.template(this));
          new KanBanana.Views.StatusList({el: "#status-table", projectId: this.projectId});
          new KanBanana.Views.SizeList({el: "#size-table", projectId: this.projectId});
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