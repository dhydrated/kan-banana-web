
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