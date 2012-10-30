
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

  KanBanana.Views.GoButton = Backbone.View.extend({
      initialize: function(){
    	  this.render();
      },
      template: template('go-button'),
      render: function(){
    	  this.$el.html(this.template(this));
      }
  });

  // The initialize function is always called when instantiating a Backbone View.
  // Consider it the constructor of the class.
  new KanBanana.Views.GoButton({el:"#launch-button"});
  

  //window.proj = new KanBanana.Views.Project({name:'Hello World!', description:'Testing project.'});

  //proj.save();

});
