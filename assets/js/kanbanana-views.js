
  
  
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
      initialize: function(){
    	this.nameColumn = 'name';  
      },
      render: function() {
          this.$el.html(this.template(this));
          return this;
      },
      name: function() { 
    	  return this.model.get(this.nameColumn);    
      },
      setNameColumn: function(nameColumn){
    	  this.nameColumn = nameColumn;
      }
  });
  

  
  KanBanana.Views.GenericList = Backbone.View.extend({
      render: function() {
          this.$el.html(this.template(this));
    	  that = this;
    	  this.mycollection.each(function(model){
			  var aRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
			  aRow.setNameColumn(this.mainColumn);
			  that.$(that.elTable).append(aRow.render().el);
		  },this);
          return this;
      },
      getCollection: function(){
    	  
    	  console.log('need to implement this method');
    	  
    	  return null;
      },
      getModel: function(){
    	
    	  console.log('need to implement this method');
    	  
		  return null;
      },
      fetch: function() {
    	  
    	  this.mycollection = this.getCollection();
    	  var that = this;
    	  this.mycollection.fetch({
    		  success: function(){
    			  that.render();
    		  },
    		  error: function(){
    			  console.log('error');
    		  }
    	  });
      },
      launchForm: function(){
    	  var that = this;
    	  var form =  $(this.elFormModal);
    	  form.modal();
    	  $.each(this.attributes, function(index, value){
    		  form.find('#'+that.modelType+'-' + index + ' ' + value).val('');
    		  form.find('#'+that.modelType+'-' + index).focus();
    	  });
      },
      launchEditForm: function(events){
    	  var that = this;
    	  this.launchForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.mycollection.each(function(model){
    		  if(model && model.get('id') == selectedId){
		    	  var form =  $(that.elFormModal);
		    	  var self = that;
		    	  form.modal();
		    	  $.each(that.attributes, function(index, value){
	    			  console.log('#'+that.modelType+'-' + index);
		    		  form.find('#'+that.modelType+'-' + index).val(model.get(index));
		    	  });
				  
    		  }
    	  });
    	  
      },
      remove: function(events){
    	  console.log('remove');
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  console.log(this.mycollection);
    	  this.mycollection.each(function(aModel){
    		  console.log(aModel.get('id')  + ' = ' + selectedId);
    		  if(aModel && aModel.get('id') == selectedId){
    			  console.log(aModel);
    			  aModel.destroy({success: function(model, response) {
    				  console.log(model);
    				  $('#'+selectedId).remove();  
    			  }});
    		  }
    	  });
      },
      getModelInForm: function(){
    	  var model = {projectId: this.projectId}
    	  var that = this;
    	  $.each(that.attributes, function(index, value){
    		  
    		  var val = $('#'+that.modelType+'-'+index+' ' + value).val();
    		  
    		  if(idIsNotNull(index, val)){
    			  
    			  model[index] = val;
    		  }
    	  });
    	  
    	  function idIsNotNull(field, value) {
    		  
    		  if(field === 'id' 
    			  && (value === null 
    			  || value === "")){
    			  
    			  return false;
    		  }
    		  return true;
    	  }
    	  
    	  console.log('hahahaha');
    	  console.log(model);
    	  
    	  return model;
      },
      save: function(){
    	  that = this;
    	  var form =  $(this.elFormModal);
    	  var modelId = form.find('#'+this.modelType+'-id').val();
    	  
    	  //new
    	  if(modelId === ''){
    		  var newModel = this.getModel();
    		  newModel.save({},{success: function(model, response) {
        		  that.mycollection.add(response);
        		  var aRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
        		  aRow.setNameColumn(that.mainColumn)
        		  that.$(that.elTable).append(aRow.render().el);
    		  }});
    	  }
    	  //update
    	  else{
    		  this.mycollection.each(function(aModel){
        		  if(aModel && aModel.get('id') == modelId){
    		    	  var form =  $(that.elFormModal);
    		    	  form.modal();
    		    	  
    		    	  $.each(that.attributes, function(index, value){
        		    	  aModel.set(index, form.find('#'+that.modelType+'-' + index).val());
    		    	  });
    		    	  
    		    	  aModel.save({success: function(model, response) { }});
        		  }
        	  });
    	  }
    	  
    	  $(this.elFormModal).modal('hide');
    	  
    	  this.render();
      }
  });
  
  KanBanana.Views.StatusList = KanBanana.Views.GenericList.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
    	  this.elTable = '#kb-statuses-table';
    	  this.elFormModal = '#status-form-modal';
    	  this.modelType = 'status';
    	  this.mainColumn = 'name';
    	  this.attributes = {"id":"","name":""};
    	  this.labels = new Array("ID","Name");
      },
      template: template('statuses-list'),
      events: {
    	  "click .create-status" : "launchForm",
    	  "click .save-status" : "save",
    	  "click #kb-statuses-table .btn-remove" : "remove",
    	  "click #kb-statuses-table .btn-edit" : "launchEditForm"
      },
      getModel: function(){
    	
		  return new KanBanana.Models.Status(this.getModelInForm());
      },
      getCollection: function(){
    	  
    	  return new KanBanana.Collections.Statuses({projectId: this.projectId});
      }
  });
  

  
  KanBanana.Views.SizeList = KanBanana.Views.GenericList.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
    	  this.elTable = '#kb-sizes-table';
    	  this.elFormModal = '#size-form-modal';
    	  this.modelType = 'size';
    	  this.mainColumn = 'name';
    	  this.attributes = {"id":"","value":"","name":""};
    	  this.labels = new Array("ID","Value","Name");
      },
      template: template('sizes-list'),
      events: {
    	  "click .create-size" : "launchForm",
    	  "click .save-size" : "save",
    	  "click #kb-sizes-table .btn-remove" : "remove",
    	  "click #kb-sizes-table .btn-edit" : "launchEditForm"
      },
      getModel: function(){
    	
		  return new KanBanana.Models.Size(this.getModelInForm());
      },
      getCollection: function(){
    	  
    	  return new KanBanana.Collections.Sizes({projectId: this.projectId});
      }
  });

  KanBanana.Views.TypeList = KanBanana.Views.GenericList.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
    	  this.elTable = '#kb-types-table';
    	  this.elFormModal = '#type-form-modal';
    	  this.modelType = 'type';
    	  this.mainColumn = 'name';
    	  this.attributes = {"id":"","color":"","name":""};
    	  this.labels = new Array("ID","Color","Name");
      },
      template: template('types-list'),
      events: {
    	  "click .create-type" : "launchForm",
    	  "click .save-type" : "save",
    	  "click #kb-types-table .btn-remove" : "remove",
    	  "click #kb-types-table .btn-edit" : "launchEditForm"
      },
      getModel: function(){
    	
		  return new KanBanana.Models.Type(this.getModelInForm());
      },
      getCollection: function(){
    	  
    	  return new KanBanana.Collections.Types({projectId: this.projectId});
      }
  });
  
  
  KanBanana.Views.MemberList = KanBanana.Views.GenericList.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
    	  this.elTable = '#kb-members-table';
    	  this.elFormModal = '#member-form-modal';
    	  this.modelType = 'member';
    	  this.mainColumn = 'email';
    	  this.attributes = {"id":"","role":"option:selected","email":""};
    	  this.labels = new Array("ID","Role","Email");
      },
      template: template('members-list'),
      events: {
    	  "click .create-member" : "launchForm",
    	  "click .save-member" : "save",
    	  "click #kb-members-table .btn-remove" : "remove",
    	  "click #kb-members-table .btn-edit" : "launchEditForm"
      },
      getModel: function(){
    	
		  return new KanBanana.Models.Member(this.getModelInForm());
      },
      getCollection: function(){
    	  
    	  return new KanBanana.Collections.Members({projectId: this.projectId});
      }
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
          new KanBanana.Views.TypeList({el: "#type-table", projectId: this.projectId});
          new KanBanana.Views.MemberList({el: "#member-table", projectId: this.projectId});
          return this;
      }
  });

  KanBanana.Views.IndexView = Backbone.View.extend({
	  template: template('index-view'),
      initialize: function(){
    	  this.render();
    	  this.checkUser();
      },
      render: function() {
    	  this.$el.empty();
          this.$el.html(this.template(this));
          return this;
      },
      checkUser: function() {
    	  this.userEmail = $('#kb_login_user').val();
    	  
    	  var user = new KanBanana.Models.User();
    	  user.fetchByName();
      }
  });