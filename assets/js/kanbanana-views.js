
  
  
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
    		  form.find('#'+that.modelType+'-' + value).val('');
    		  form.find('#'+that.modelType+'-' + value).focus();
    	  });
      },
      launchEditForm: function(events){
    	  var that = this;
    	  this.launchForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.mycollection.each(function(model){
    		  if(model && model.get('id') == selectedId){
		    	  var form =  $(that
		    			  .elFormModal);
		    	  var self = that;
		    	  form.modal();
		    	  $.each(that.attributes, function(index, value){
	    			  console.log(model);
	    			  console.log(value);
	    			  console.log(model.get(value));
	    			  console.log('#'+that.modelType+'-' + value);
		    		  form.find('#'+that.modelType+'-' + value).val(model.get(value));
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
    	  console.log('need to implement this method');
    	  return null;
      },
      save: function(){
    	  that = this;
    	  var form =  $(this.elFormModal);
    	  var modelId = form.find('#'+this.modelType+'-id').val();
    	  
    	  //new
    	  if(modelId === ''){
    		  var newStatus = new KanBanana.Models.Status(this.getModelInForm());
        	  newStatus.save({},{success: function(model, response) {
        		  that.mycollection.add(response);
        		  var aRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
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
        		    	  aModel.set(value, form.find('#'+that.modelType+'-' + value).val());
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
    	  this.attributes = new Array("id","name");
    	  this.labels = new Array("ID","Name");
      },
      template: template('statuses-list'),
      events: {
    	  "click .create-status" : "launchForm",
    	  "click .save-status" : "save",
    	  "click #kb-statuses-table .btn-remove" : "remove",
    	  "click #kb-statuses-table .btn-edit" : "launchEditForm"
      },
      getModelInForm: function(){
    	  var model = {
    			  name: $('#'+this.modelType+'-name').val()
    			  , projectId: this.projectId
    	      }
    	  return model;
      },
      getModel: function(){
    	
		  return new KanBanana.Models.Status(this.getModelInForm());
      },
      getCollection: function(){
    	  
    	  return new KanBanana.Collections.Statuses({projectId: this.projectId});
      }
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
        		  that.sizes.add(response);
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
  
  KanBanana.Views.TypeList = Backbone.View.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
      },
      template: template('types-list'),
      events: {
    	  "click .create-type" : "launchCreateForm",
    	  "click .save-type" : "save",
    	  "click #kb-types-table .btn-remove" : "remove",
    	  "click #kb-types-table .btn-edit" : "launchEditForm"
      },
      render: function() {
          this.$el.html(this.template(this));
    	  that = this;
    	  this.types.each(function(size){
			  var aRow = new KanBanana.Views.GenericModelRow({id: size.get('id'), model: size});
			  that.$('#kb-types-table').append(aRow.render().el);
		  },this);
          return this;
      },
      fetch: function() {
    	  
    	  this.types = new KanBanana.Collections.Types({projectId: this.projectId});
    	  var that = this;
    	  this.types.fetch({
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
    	  var form =  $('#type-form-modal');
    	  form.modal();
    	  
    	  form.find('#type-name').val('');
    	  form.find('#type-name').focus();
    	  form.find('#type-color').val('');
      },
      launchEditForm: function(events){
    	  
    	  this.launchCreateForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.types.each(function(aModel){
    		  if(aModel && aModel.get('id') == selectedId){
		    	  var form =  $('#type-form-modal');
		    	  form.modal();
				  form.find('#type-id').val(aModel.get('id'));
				  form.find('#type-name').val(aModel.get('name'));
				  form.find('#type-color').val(aModel.get('color'));
    		  }
    	  });
    	  
      },
      save: function(){
    	  that = this;
    	  var form =  $('#type-form-modal');
    	  var modelId = form.find('#type-id').val();
    	  
    	  //new
    	  if(modelId === ''){
    		  var newModel = new KanBanana.Models.Type({
    			  name: $('#type-name').val()
    			  , color: $('#type-color').val()
    			  , projectId: this.projectId
    		  });
        	  newModel.save({},{success: function(model, response) {
        		  that.types.add(response);
        		  var aRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
        		  that.$('#kb-types-table').append(aRow.render().el);
    		  }});
    	  }
    	  //update
    	  else{
    		  this.types.each(function(aModel){
        		  if(aModel && aModel.get('id') == modelId){
    		    	  var form =  $('#type-form-modal');
    		    	  form.modal();
    		    	  aModel.set('name', form.find('#type-name').val());
    		    	  aModel.set('color', form.find('#type-color').val());
    		    	  aModel.save({success: function(model, response) {
        			  }});
        		  }
        	  });
    	  }
    	  
    	  $('#type-form-modal').modal('hide');
    	  
    	  this.render();
      },
      remove: function(events){
    	  console.log('remove');
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.types.each(function(aModel){
    		  if(aModel && aModel.get('id') == selectedId){
    			  aModel.destroy({success: function(model, response) {
    				  console.log(model);
    				  $('#'+selectedId).remove();  
    			  }});
    		  }
    	  });
      },
  });
  
  KanBanana.Views.MemberList = Backbone.View.extend({
      initialize: function(){
    	  this.projectId = this.options.projectId;
    	  this.fetch();
      },
      template: template('members-list'),
      events: {
    	  "click .create-member" : "launchCreateForm",
    	  "click .save-member" : "save",
    	  "click #kb-members-table .btn-remove" : "remove",
    	  "click #kb-members-table .btn-edit" : "launchEditForm"
      },
      render: function() {
          this.$el.html(this.template(this));
    	  that = this;
    	  this.members.each(function(member){
			  var aRow = new KanBanana.Views.GenericModelRow({id: member.get('id'), model: member });
			  aRow.setNameColumn('email');
			  that.$('#kb-members-table').append(aRow.render().el);
		  },this);
          return this;
      },
      fetch: function() {
    	  
    	  this.members = new KanBanana.Collections.Members({projectId: this.projectId});
    	  var that = this;
    	  this.members.fetch({
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
    	  var form =  $('#member-form-modal');
    	  form.modal();
    	  
    	  form.find('#member-email').val('');
    	  form.find('#member-email').focus();
    	  form.find('#member-role option:selected').val('');
      },
      launchEditForm: function(events){
    	  
    	  this.launchCreateForm();
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('edit-','');
    	  this.members.each(function(aModel){
    		  if(aModel && aModel.get('id') == selectedId){
		    	  var form =  $('#member-form-modal');
		    	  form.modal();
				  form.find('#member-id').val(aModel.get('id'));
				  form.find('#member-email').val(aModel.get('email'));
				  form.find('#member-role').val(aModel.get('role'));
    		  }
    	  });
    	  
      },
      save: function(){
    	  that = this;
    	  var form =  $('#member-form-modal');
    	  var modelId = form.find('#member-id').val();
    	  
    	  //new
    	  if(modelId === ''){
    		  var newModel = new KanBanana.Models.Member({
    			  email: $('#member-email').val()
    			  , role: $('#member-role option:selected').val()
    			  , projectId: this.projectId
    		  });
        	  newModel.save({},{success: function(model, response) {
        		  that.members.add(response);
        		  var aRow = new KanBanana.Views.GenericModelRow({id: model.get('id'), model: model});
        		  aRow.setNameColumn('email')
        		  that.$('#kb-members-table').append(aRow.render().el);
    		  }});
    	  }
    	  //update
    	  else{
    		  this.members.each(function(aModel){
        		  if(aModel && aModel.get('id') == modelId){
    		    	  var form =  $('#member-form-modal');
    		    	  form.modal();
    		    	  aModel.set('email', form.find('#member-email').val());
    		    	  aModel.set('role', form.find('#member-role option:selected').val());
    		    	  aModel.save({success: function(model, response) {
        			  }});
        		  }
        	  });
    	  }
    	  
    	  $('#member-form-modal').modal('hide');
    	  
    	  this.render();
      },
      remove: function(events){
    	  console.log('remove');
    	  domId = events.currentTarget.id;
    	  selectedId = domId.replace('remove-','');
    	  this.members.each(function(aModel){
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