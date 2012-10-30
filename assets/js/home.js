

$(document).ready(function(){
  

  KanBanana.boot = function(container) {
    container = $(container);
    var router = new KanBanana.Router({el: container})
    Backbone.history.start();
  }

  
});
