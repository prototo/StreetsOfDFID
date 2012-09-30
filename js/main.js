$(function() {
  var flagid = 1, country_data, field_descriptors,
  display_countries = ['Afghanistan', 'Belgium', 'Chad', 'Cuba', 'Dominican Republic', 'El Salvador', 'Finland', 'Guam', 'Honduras', 'India', 'Japan', 'Kenya', 'Liberia', 'Malaysia', 'Nigeria', 'Oman', 'Poland', 'Romania', 'Singapore', 'Tonga', 'United States', 'United Kingdom', 'Zambia'];
  
  /* MODELS */
  // Icon model
  IconModel = Backbone.Model.extend({
    defaults : {
      icon : "truck",
      enabled : false,
      name : 'Indicator',
      tooltip : "This is an icon",
    },

    initialize : function() {
      this.set({tooltip:this.get('name')});
      if (this.get('icon').length === 0) this.set('icon', 'truck');
    },

    toggle : function() {
      this.set({enabled : !this.get('enabled')});
    }
  });

  // Flag model
  FlagModel = Backbone.Model.extend({
    defaults : {
      icon : "Chewbacca",
      enabled : false,
      name : "country"
    },

    initialize : function() {
      
    },

    toggle : function() {
      var self = this,
      enabled = !self.get('enabled');
      self.set({enabled : enabled});
      if (enabled) {
        rows.add({
          flagid : self.get('flagid'),
          country : self.get('name')
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
      this.$el.css('background-image', 'url(./img/icons/shift_'+this.model.get('category')+"/"+this.model.get('icon')+'.png)');
      this.model.bind('change', this.render, this);
    },

    render : function() {
      var enabled = this.model.get('enabled');
      this.$el.toggleClass('enabled', enabled).simpletip({
        content : this.model.get('tooltip'),
        position : 'bottom'
      });
      return this;
    },

    toggle : function() {
      this.model.toggle();
      var enabled = this.model.get('enabled');
      $('.indicator.'+this.model.get('className')).toggle(enabled);
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
      this.$el.css('background-image', 'url(./img/flags/'+this.model.get('icon')+'.png)');
      this.model.bind('change', this.render, this);
    },

    render : function() {
      var enabled = this.model.get('enabled');
      this.$el.toggleClass('enabled', enabled).simpletip({
        content : this.model.get('name'),
        position : 'right'
      });
      return this;
    },

    toggle : function() {
      this.model.toggle();
    }
  });

  // Row view
  RowView = Backbone.View.extend({
    tagName : 'div',
    className : 'row',

    events : {
      'click .remove' : 'clear'
    },

    initialize : function() {
      var self = this;
      self.model.bind('remove', self.remove, self);
      self.model.bind('change', self.render, self);
    },

    render : function() {
      var self = this,
      template = _.template($('#row-template').html());
      self.$el.html(template(self.model.toJSON())).attr('name', self.model.get('country'));
      icons.each(function(icon) {
        var enabled = icon.get('enabled'),
        className = icon.get('className'),
        $indicator = self.$('.indicator.'+className);
        $indicator.css('display', enabled ? 'inline-block' : 'none');
      });
      return self;
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
      icons.on('change', this.updateRows, this);
      flags.on('add', this.addFlag, this);
      rows.on('add', this.addRow, this);

      _.each(field_descriptors, function(data, name) {
        if (!data.display || !data.icon) return;
        icons.add({
          indicator_name : name,
          category : data.category,
          tooltip : data.description,
          className : data.class_name,
          icon : data.icon
        });
      });
      
      _.each(display_countries, function(name) {
        flags.add({
          flagid : flagid++,
          name : name,
          icon : name.replace(/\W/gi, "_")
        });
      });
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
    },
    
    updateRows : function(indicator) {
      var self = this,
      class_name = indicator.get('className'),
      enabled = indicator.get('enabled');
      rows.each(function(row) {
        var $indicator = self.$el.find('.indicator.'+class_name),
        full_width = country_data[indicator.get('indicator_name')].data[row.get('country')] * 300;
        _.delay(function() {$indicator.css('width', full_width+'px')}, 1000);
      });
    }
  });
  
  $.getJSON('./scripts/country_data.json', function(json) {
    country_data = json;
    $.getJSON('./scripts/field_descriptors.json', function(json) {
      field_descriptors = json;
      _.each(field_descriptors, function(data, name) {
        if (!data.display) return;
        data.class_name = name.replace(/\W/gi, "");
        var span = $('<span>').addClass('indicator')
                              .addClass(data.class_name)
                              .hide();
                              //.css('background-image', 'url(./img/icons/shift_'+data.category+'/'+(data.icon||'truck')+'.png)')
        $('#row-template').append(span);
      });
    
      var app = new AppView;
      $('#left-bar').mCustomScrollbar({
        scrollButtons: { enable: true }
      });
      $('#top-bar').mCustomScrollbar({
        horizontalScroll: true,
        scrollButtons: { enable: true }
      });
    });
  });
});
