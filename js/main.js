$(function() {
  /* MODELS */
  // Icon model
  IconModel = Backbone.Model.extend({
    defaults : {
      src : "../img/icons/Ackbar.png",
      enabled : false
    },

    initialize : function() {
      
    },

    toggle : function() {
      console.log("toggle");
      this.set({enabled : !this.get('enabled')});
    }
  });

  // Flag model
  FlagModel = Backbone.Model.extend({
    defaults : {
      src : "../img/icons/Ackbar.png",
      enabled : false
    },

    initialize : function() {
      
    },

    toggle : function() {
      this.set({enabled : !this.get('enabled')});
    }
  });

  // Row model
  RowModel = Backbone.Model.extend({
    defaults : {
    },

    initialize : function() {

    },

    remove : function() {
      this.destroy();
    }
  });

  /* COLLECTIONS */
  // Icon collection
  IconList = Backbone.Collection.extend({
    model : IconModel
  });

  //Flag list
  FlagList = Backbone.Collection.extend({
    model : FlagModel
  });

  // Row list
  RowList = Backbone.Collection.extend({
    model : RowModel
  });
  
  var icons = new IconList,
  flags = new FlagList,
  rows = new RowList;

  /* VIEWS */
  // Icon view
  IconView = Backbone.View.extend({
    tagName : 'span',
    className : 'icon',
    
    events : {
      'click' : 'toggle'
    },
    
    initialize : function() {
      this.$el.css('background-image', 'url('+this.model.get('src')+')');
    },

    render : function() {
      return this;
    },

    toggle : function() {
      this.model.toggle();
      this.$el.toggleClass('enabled', this.model.get('enabled'));
    }
  });

  // Flag view
  FlagView = Backbone.View.extend({
    tagName : 'span',

    events : {
      'click .flag' : 'toggle'
    },
    
    toggle : function() {
      this.model.toggle();
    }
  });

  // Row view
  RowView = Backbone.View.extend({
    tagName : 'span',

    events : {
      'click .remove' : 'remove'
    },

    initialize : function() {
      this.model.bind('change', this.render, this);
      this.model.bind('remove', this.remove, this);
    },

    render : function() {
      
    },

    remove : function() {
      this.model.remove();
    }
  });
  
  // App view
  AppView = Backbone.View.extend({
    el : $('#rows'),

    initialize : function() {
      icons.on('add', this.addIcon, this);
      flags.on('add', this.addFlag, this);

      icons.add({});
      icons.add({});
      icons.add({});
      icons.add({});
      icons.add({});
    },

    render : function() {

    },

    addIcon : function(icon) {
      var view = new IconView({model : icon});
      $('#top-bar').append( view.render().$el );
    },

    addFlag : function(flag) {
      var view = new FlagView({model : icon});
      $('#left-row').append( view.render().el );
    }
  });

  var app = new AppView;
});
