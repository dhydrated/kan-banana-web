
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

  KanBananaWeb.Views.Index = Backbone.View.extend({
	  tagName: "div",
          className: "launch-button",
	  events: {
	    "click div.launch-button":"open",
	  },
	  render: function() {
	    $(this.el).html('<a class="btn btn-primary btn-large">Learn more »</a>');
            return this;
	  },
          open: function(){
               alert('yeay');
          }
	});

   var tryButton = new KanBananaWeb.Views.Index();
});
