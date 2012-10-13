
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
  
   var template = function(name) {
    return Handlebars.compile($('#'+name+'-template').html());
  };

  KanBananaWeb.Views.Index = Backbone.View.extend({
          template: template('trybutton'),
          initialize: function() {
              this.render();
          },
	  events: {
	    'click #learn-more-button': 'open'
	  },
	  render: function() {
            this.$el.html(this.template(this));
            return this;
	  },
          open: function(event){
		console.log(event);
		//event.preventDefault();
                
          }
	});

   var tryButton = new KanBananaWeb.Views.Index({el: $("div.launch-button")});


});
