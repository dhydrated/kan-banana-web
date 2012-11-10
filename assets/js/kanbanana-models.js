
KanBanana.Models.User = Backbone.Model.extend({
  urlRoot: '/services/user',
  fetchByName: function() {
	  this.userEmail = $('#kb_login_user').val();
	  that = this;
	  $.ajax({
		  url: '/services/user/username/'+this.userEmail,
		  success: function(model) {
			  model = $.parseJSON(model);
			  if(model.id == null){
				  //email is not recognized. creating new user.
				  that.set('email', that.userEmail);
				  that.set('nickName', that.userEmail);
				  that.save();
			  }
			  else{
			  }
		  }
		});
  },

});


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