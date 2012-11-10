  
  KanBanana.Collections.Users = Backbone.Collection.extend({
      model: KanBanana.Models.User,
	  url: '/services/user'
  });
  
  KanBanana.Collections.Projects = Backbone.Collection.extend({
      model: KanBanana.Models.Project,
	  url: '/services/project'
  });
  

  KanBanana.Collections.Statuses = Backbone.Collection.extend({
		initialize: function(options){
		  this.projectId = options.projectId;
		},
		url: function() {
		  return '/services/project/'+this.projectId+'/status';
		},
  });
  
  
  KanBanana.Collections.Sizes = Backbone.Collection.extend({
		initialize: function(options){
		  this.projectId = options.projectId;
		},
		url: function() {
		  return '/services/project/'+this.projectId+'/story_size';
		},
  });
  
  
  KanBanana.Collections.Types = Backbone.Collection.extend({
		initialize: function(options){
		  this.projectId = options.projectId;
		},
		url: function() {
		  return '/services/project/'+this.projectId+'/story_type';
		},
  });
  
  
  KanBanana.Collections.Members = Backbone.Collection.extend({
		initialize: function(options){
		  this.projectId = options.projectId;
		},
		url: function() {
			  return '/services/project/'+this.projectId+'/member';
		},
  });