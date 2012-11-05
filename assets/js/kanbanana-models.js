KanBanana.Models.Project = Backbone.Model.extend({
  urlRoot: '/services/project'
});


KanBanana.Models.Size = Backbone.Model.extend({
	initialize: function(options){
	  this.projectId = options.projectId;
	  this.fetch();
	},
	url: function() {
	  return '/services/project/'+this.projectId+'/story_size';
	},
});

KanBanana.Models.Status = Backbone.Model.extend({
	initialize: function(options){
	  this.projectId = options.projectId;
	  this.fetch();
	},
	url: function() {
	  return '/services/project/'+this.projectId+'/status';
	},
});

KanBanana.Models.Type = Backbone.Model.extend({
	initialize: function(options){
	  this.projectId = options.projectId;
	  this.fetch();
	},
	url: function() {
	  return '/services/project/'+this.projectId+'/story_type';
	},
});

KanBanana.Models.Member = Backbone.Model.extend({
	initialize: function(options){
	  this.projectId = options.projectId;
	  this.fetch();
	},
	url: function() {
		  return '/services/project/'+this.projectId+'/member';
	},
});