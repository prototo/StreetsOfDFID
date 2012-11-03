$(function() {
  var App = {
    Models : {},
    Collections : {},
    Views : {}
  },
  countries = [ 'Peru', 'Cambodia', 'Sudan', 'Bangladesh', 'China', 'United States', 'United Kingdom', 'India', 'Kenya', 'Nigeria', 'South Africa', 'Azerbaijan' ],
  descriptors = './scripts/descriptors.json',
  fields = './data/fields.json';
  
  App.Models.Indicator = Backbone.Model.extend({
    defaults : {
      name : 'indicator',
      description : 'description',
      value : 0
    },
    
    initialise : function() {
      
    }
  });
  
  App.Collections.Country = Backbone.Collection.extend({
    
  });
  
  App.Views.Indicator = Backbone.View.extend({
    tagName : 'li',
    className : '',
    template : _.template(
      '<img src="<%= name %>" />'
    ),
    
    initialize : function() {
      
    },
    
    render : function() {
      
    }
  });
  
  App.Views.Country = Backbone.View.extend({
    tagName : 'ul',
    className : '',
    template : _.template(
      
    ),
    
    initialize : function() {
      
    },
    
    render : function() {
      
    }
  });
  
  App.Views.App = Backbone.View.extend({
    el : $('DIV#content'),
    
    events : {
      
    },
    
    initialise : function() {
      this.top_bar = this.$('DIV#top-bar');
      this.side_bar = this.$('DIV#side-bar');
      this.cols = this.$('DIV#cols');
    }
  });
  
  App.Router = Backbone.Router.extend({
    routes : {
      
    }
  });
  
  function init() {
    // do something with descriptors and fields :)
  }
  
  $.getJSON(
    descriptors,
    function(json) {
      App.descriptors = json;
      $.getJSON(
        fiels,
        function(json) {
          App.fields = json;
          init();
        }
      );
    }
  );
});
