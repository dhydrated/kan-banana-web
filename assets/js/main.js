
window.KanBananaWeb = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    console.log('Hello from Backbone!');
  }
};

$(document).ready(function(){
  KanBananaWeb.init();

  TryButton = Backbone.View.extend({
	  id: "launch-app",
	  events: {
	    "click #launch-app":"open",
	  },
	  render: function() {
	    $(this.el).html('<a class="btn btn-primary btn-large">Learn more »</a>');
            return this;
	  },
          open: function(){
               alert('yeay');
          }
	});

   var tryButton = new TryButton();
});
