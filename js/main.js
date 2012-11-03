$(function() {
  var App = {
    Models : {},
    Collections : {},
    Views : {}
  },
  countries = [ 'Peru', 'Cambodia', 'Sudan', 'Bangladesh', 'China', 'United States', 'United Kingdom', 'India', 'Kenya', 'Nigeria', 'South Africa', 'Azerbaijan' ],
  indicators = [ 'Education', 'Time export', 'Time import', 'Documents to export', 'Documents to import', 'Logistics', 'Container cost export', 'Container cost to import' ],
  descriptors = './scripts/field_descriptors.json',
  fields = './data/fields.json';
  
  App.Models.Indicator = Backbone.Model.extend({
    defaults : {
      name : 'indicator',
      description : 'description',
      value : 0
    },
    
    initialize : function() {
      this.set('src', 'http://placekitten.com/80' || this.get('name'));
    }
  });
  
  App.Collections.Country = Backbone.Collection.extend({
    model : App.Models.Indicator,
    
    initialize : function(name) {
      this.name = name;
    }
  });
  
  App.Views.Indicator = Backbone.View.extend({
    model : App.Models.Indicator,
    tagName : 'li',
    className : 'indicator',
    template : _.template(
      '<img />'
    ),
    
    initialize : function() {
      this.model.on('remove', this.remove, this);
    },
    
    render : function() {
      var self = this,
          view = this.template(this.model.toJSON());
      this.$el.html(view);
      setTimeout(function() {
        var height = self.model.get('value') * 300;
        self.$el.css({ 'height' : height + 'px' });
      }, 1000);
      return this;
    }
  });
  
  App.Views.Country = Backbone.View.extend({
    tagName : 'ul',
    className : '',
    template : _.template(
      '<%= name %>'
    ),
    
    initialize : function(country) {
      this.country = country;
      this.country.on('reset', this.render, this);
      this.country.on('add', this.addIndicator, this);
    },
    
    addIndicator : function(model) {
      var view = new App.Views.Indicator({model : model});
      this.$el.append(view.render().el);
    },
    
    render : function() {
      this.$el.html(this.template(this.country.toJSON));
      if (this.model.length) _.each(this.models, this.addIndicator);
      return this;
    }
  });
  
  App.Views.App = Backbone.View.extend({
    el : $('DIV#content'),
    iconTemplate : _.template(
      '<li class="<%= className %>" id="<%= id %>"><img src="<%= src %>" title="<%= tooltip %>" /></li>'
    ),
    
    events : {
      'click li.icon>img' : 'toggleItem'
    },
    
    initialize : function() {
      var self = this;
      this.top_bar = this.$('DIV#top-bar UL');
      this.side_bar = this.$('DIV#side-bar UL');
      this.cols = this.$('DIV#cols');
      
      _.each(App.countries, function(country) {
        var flag = self.iconTemplate({
          className : 'flag',
          id : country.name,
          src : country.name ? "img/flags/"+country.name.replace(" ", "_")+".png" : 'http://placekitten.com/80',
          tooltip : country.name
        });
        self.top_bar.append(flag);
        var view = new App.Views.Country(country);
        self.cols.append(view.render().el);
      });

      _.each(indicators, function(indicator) {
        var descriptor = App.descriptors[indicator];
        var view = self.iconTemplate({
          className : 'icon',
          id : indicator,
          src : 'http://placekitten.com/80' || descriptor.icon,
          tooltip : descriptor.description || 'this is a descriptor'
        });
        self.side_bar.append(view);
      });
    },
    
    toggleItem : function(e) {
      var self = this,
          li = $(e.target.parentElement),
          id = e.target.parentElement.id,
          indicator = App.fields[id];
      li.toggleClass('active');
      _.each(App.countries, function(country) {
        if (li.hasClass('active')) {
          var model = new App.Models.Indicator({
            name : id,
            description : indicator.description,
            value : indicator.data[country.name]
          });
          country.add(model);
        } else {
          country.remove(country.where({name : id}));
        }
      });
    }
  });
  
  App.Router = Backbone.Router.extend({
    routes : {
      
    }
  });
  
  function init() {
    App.countries = [];
    _.each(countries, function(country) {
      App.countries.push(new App.Collections.Country(country));
    });
    App.app = new App.Views.App;
    
    // $(document).tooltip({
      // track : true
    // });
  }
  
  $.getJSON(
    descriptors,
    function(json) {
      App.descriptors = json;
      $.getJSON(
        fields,
        function(json) {
          App.fields = json;
          init();
        }
      );
    }
  );
});

$(function() {
	$("#toggledocs").click(function() {
		$("#docs").slideToggle();
		$("#blackout").fadeToggle();
		$("#toggledocs span").toggle();
	});
});
