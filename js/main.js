$(function() {
  var flagid = 1;
  
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
      this.set({enabled : !this.get('enabled')});
    }
  });

  // Flag model
  FlagModel = Backbone.Model.extend({
    defaults : {
      src : "../img/icons/Chewbacca.png",
      enabled : false
    },

    initialize : function() {
      
    },

    toggle : function() {
      var self = this,
      enabled = !self.get('enabled');
      self.set({enabled : enabled});
      if (enabled) {
        rows.add({
          flagid : self.get('flagid')
        });
      } else {
        var row = rows.find(function(row) {
          return row.get('flagid') === self.get('flagid');
        });
        row.clear().remove();
      }
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
      var enabled = this.model.get('enabled');
      this.$el.toggleClass('enabled', enabled);
    }
  });

  // Flag view
  FlagView = Backbone.View.extend({
    tagName : 'span',
    className : 'flag',
    
    events : {
      'click' : 'toggle'
    },
    
    initialize : function() {
      this.$el.css('background-image', 'url('+this.model.get('src')+')');
      this.model.bind('change', this.render, this);
    },

    render : function() {
      var enabled = this.model.get('enabled');
      this.$el.toggleClass('enabled', enabled);
      return this;
    },

    toggle : function() {
      this.model.toggle();
    }
  });

  // Row view
  RowView = Backbone.View.extend({
    tagName : 'span',
    className : 'row',
    template : _.template($('#row-template').html()),

    events : {
      'click .remove' : 'clear'
    },

    initialize : function() {
      this.model.bind('remove', this.remove, this);
      this.model.bind('change', this.render, this);
    },

    render : function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    },

    clear : function() {
      var flagid = this.model.get('flagid'),
      flag = flags.find(function(flag){
        return flag.get('flagid') === flagid;
      });
      flag.toggle();
    }
  });
  
  // App view
  AppView = Backbone.View.extend({
    el : $('#rows'),

    initialize : function() {
      icons.on('add', this.addIcon, this);
      flags.on('add', this.addFlag, this);
      rows.on('add', this.addRow, this);

      // fake fill the icon and flag lists
      _.each(_.range(10), function() { icons.add({}); flags.add({flagid:flagid++}); });
    },

    render : function() {

    },

    addIcon : function(icon) {
      var view = new IconView({model : icon});
      $('#top-bar').append( view.render().$el );
    },

    addFlag : function(flag) {
      var view = new FlagView({model : flag});
      $('#left-bar').append( view.render().el );
    },
    
    addRow : function(row) {
      var view = new RowView({model : row});
      $('#rows').append( view.render().el );
    }
  });

  var app = new AppView;
  
  $('#left-bar').mCustomScrollbar({
  });
  $('#top-bar').mCustomScrollbar({
    horizontalScroll: true
  });
});
