/*********************************CSSOM Objects*********************************
 * Normalizes cssom objects.
 * @module {g3.css}
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 ******************************************************************************/
(function(g3, $, window, document, undefined){
   g3.css = g3.css || {};
/*****************************Object StyleSheetList*****************************
 * Public class 'g3.css.StyleSheetList'.
 * Normalizes Mozila's 'styleSheetList' or MS styleSheets list of all style 
 * sheets.
 * @module {g3.css}
 * @constructor
 * @param {Object} 'win' the window object that defaults to 'window'.
 * @return {} None because we use a class library. Initialization is passed to
 * method 'init()'.
 * @function {g3.css.StyleSheetList.init}
 * @public
 * @param {Object} 'win' the window object that defaults to 'window'.
 * @return {} None.
 * @function {g3.css.StyleSheetList.getNative}
 * @public
 * @return {Object} Returns the native styleSheet list.
 * @function {g3.css.StyleSheetList.item}
 * @public
 * @param {Number} 'n' an index in the native styleSsheet list.
 * @return {styleSheet} Returns a normalized 'g3.css.StyleSheet' object built 
 * from a native one found at index 'n'.
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 * @reference
 * http://msdn.microsoft.com/en-us/library/ie/ms531200%28v=vs.85%29.aspx
 * https://developer.mozilla.org/en-US/docs/Web/API/Document.styleSheets
 ******************************************************************************/
g3.css.StyleSheetList = g3.Class({
   constructor: function(win){
      var styleList;
      function init(self, win){
         if(win && (win.self === win) && (win.window == win))
            styleList = win.document.styleSheets;
         else
            styleList = window.document.styleSheets;
         self.length = styleList.length;
         return self;
      };
      this.getNative = function(){
         return styleList;
      };
      init(this, win);
   },
   item: function(n){
      return new g3.css.StyleSheet(this.getNative()[n]);
   }
});

/*******************************Object StyleSheet*******************************
 * Public class 'g3.css.StyleSheet'.
 * Normalizes Mozila's or MS 'styleSheet' object that represents a single style 
 * sheet.
 * @module {g3.css}
 * @constructor
 * @param {styleSheet} 'style' a native styleSheet object.
 * @return {} None because we use a class library. Initialization is passed to
 * method 'init()'.
 * @function {g3.css.StyleSheet.init}
 * @public
 * @param {styleSheet} 'style' a native styleSheet object.
 * @return {StyleSheet} It is chainable.
 * @function {g3.css.StyleSheet.getNative}
 * @public
 * @return {Object} Returns the native styleSheet object.
 * @function {g3.css.StyleSheet.set}
 * @public
 * @param {String} 'prop' a property to set if accessor properties cannot be 
 * defined.
 * @param {String} 'value' a value of the property that is set.
 * @return {} None.
 * @function {g3.css.StyleSheet.deleteRule}
 * @public
 * @param {Number} 'ndx' the index where the new rule is added.
 * @return {Boolean} False if 'ndx' is off range [0, this.length-1] or an empty
 * style argument during construction or an internal failure to delete and 
 * update length. In last case trust the updated property 'this.cssText'.
 * @function {g3.css.StyleSheet.insertRule}
 * @public
 * @param {String} 'rule' a new rule to add.
 * @param {Number} 'ndx' the index where the new rule is added.
 * @return {Boolean} False if 'ndx' is off range [0, this.length] or an empty
 * style argument during construction or an internal failure to insert and 
 * update length. In last case trust the updated property 'this.cssText'.
 * @function {g3.css.StyleSheet.replaceRule}
 * @public
 * @param {String} 'rule' a new rule that replaces the old one at index 'ndx'.
 * @param {Number} 'ndx' the index where the new rule replaces the old one.
 * @return {Boolean} False if 'ndx' is off range [0, this.length] or an empty
 * style argument during construction or an internal failure to delete, insert 
 * and update length. In last case do not trust property 'this.cssText'.
 * 
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 * @reference
 * http://msdn.microsoft.com/en-us/library/ie/ms535871%28v=vs.85%29.aspx
 * http://msdn.microsoft.com/en-us/library/dd229916%28v=VS.85%29.aspx
 * http://msdn.microsoft.com/en-us/library/ie/ff800817%28v=vs.94%29.aspx
 * http://msdn.microsoft.com/en-us/library/ie/jj127351%28v=vs.85%29.aspx
 * https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * http://help.dottoro.com/ljqlhiwa.php#cssRules
 * http://davidwalsh.name/add-rules-stylesheets
 ******************************************************************************/
g3.css.StyleSheet = g3.Class({
   constructor: function(style){
      function init(self, style){
         //private functions
         self.getNative = function(){
            return style;
         };
         if(style){
            if(style.ownerNode)
               self.ownerNode = style.ownerNode; //read
            else if(style.owningElement)
               self.ownerNode = style.owningElement; //read, IE8
            else
               self.ownerNode = null;
            //all browsers, read
            if(style.ownerRule)
               self.ownerRule = style.ownerRule;
            else
               self.ownerRule = null;
             //all browsers, read
            if(style.type)
               self.type = style.type;
            else
               self.type = null;
            //IE, read, write
            if(style.cssText)
               self.cssText = style.cssText;
            else
               self.cssText = null;
         }else{
            self.ownerNode = null;
            self.ownerRule = null;
            self.type = null;
            self.cssText = null;
         }
         //ATTENTION: circular reference when used!
         //self.parentStyleSheet = ((style && style.parentStyleSheet)? new g3.css.StyleSheet(style.parentStyleSheet): null); //read
         //emulate native: cssRules and length properties
         self.cssRules = [];
         self.length = 0;
         if(style){
            if(style.cssRules){
               self.length = style.cssRules.length;
               for(i = 0; i < self.length; i++)
                  if(typeof style.cssRules[i] === 'object')
                     self.cssRules.push(new g3.css.Rule(style.cssRules[i]));
            }else if(style.rules){
               self.length = style.rules.length;
               for(var i = 0; i < self.length; i++)
                  if(typeof style.rules[i] === 'object')
                     self.cssRules.push(new g3.css.Rule(style.rules[i], {'style_rule': {'type': 1}}));
            }
            //FF & compatible
            if(!self.cssText){
               self.cssText = '';
               for(var i = 0; i < self.length; i++){
                  self.cssText += self.cssRules[i].cssText + '\n';
               }
            }
            //handle IE madness: self.cssText contains imported rules but they 
            //don't exist in self.cssRules above! We need a custom rule object!
            if(style.imports && (style.imports.length > 0)){
               //extract @import rules
               //or, self.cssText.match(/@import.*[^;];/gi);
               var imports = self.cssText.match(/@import(?:[^;])*;/gi);
               self.disposition = imports.length;
               if(imports){
                  for(var i = 0; i < imports.length; i++)
                     self.cssRules.unshift(new g3.css.Rule({}, {'import_rule': {'cssText': imports[i], 'type': 3, 'styleSheet': style.imports[i]}}));
                  self.length = self.cssRules.length;
               }
            }else
               self.disposition = 0;
         }
         try{
            //accessor properties: setters & getters
            Object.defineProperties(self, {
               disabled: {
                  get: function(){ //read
                     return ((style)? style.disabled: null);
                  },
                  set: function(x){ //write
                     style.disabled = x;
                  },
                  configurable: true,
                  enumerable: true
               },
               href: {
                  get: function(){
                     return ((style)? style.href: null);
                  },
                  set: function(x){ //write in IE
                     style.href = x;
                  },
                  configurable: true,
                  enumerable: true
               },
               media: {
                  get: function(){
                     var tmp = ((style)? style.media: null);
                     if(typeof tmp === 'object')
                        return tmp.mediaText;
                     else
                        return tmp;
                  },
                  set: function(x){ //write
                     if(typeof style.media === 'object')
                        style.media.mediaText = x;
                     else
                        style.media = x;
                  },
                  configurable: true,
                  enumerable: true
               },
               title: {
                  get: function(){
                     return ((style)? style.title: null);
                  },
                  set: function(x){ //write in IE
                     style.title = x;
                  },
                  configurable: true,
                  enumerable: true
               }
            });
         }catch(e){
            self.disabled = ((style)? style.disabled: null); //read-write
            self.href = ((style)? style.href: null); //write in IE
            self.media = ((style)? style.media: null); //write in IE
            if(self.media && typeof self.media === 'object')
               self.media = style.media.mediaText;
            self.title = ((style)? style.title: null); //write in IE
         };
         return self;
      }
      init(this, style);
   },
   //define a 'set()' function if 'Object.defineProperties' fails
   set: function(prop, value){
      this[prop] = this.getNative()[prop] = value;
   },
   deleteRule: function(ndx){
      var style = this.getNative(),
          result = false;
      if(!style || (typeof ndx !== 'number') || (ndx >= this.length) || (ndx < 0))
         return result;
      ndx -= this.disposition;
      try{
         if(style.deleteRule){
            style.deleteRule(ndx);
            result = true;
         }else if(style.removeRule){
            style.removeRule(ndx);
            result = true;
         }
      }catch(e){
         alert('Failed to delete rule: ' + e);
      }
      if(result){
         --this.length;
         this.cssRules.splice(ndx + this.disposition, 1);
         //IE
         this.cssText = style.cssText;
         //FF & compatible
         if(!this.cssText){
            this.cssText = '';
            for(var i = 0; i < this.length; i++){
               this.cssText += this.cssRules[i].cssText + '\n';
            }
         }
         /*
         //take into account possible deletion failure
         if(style.cssRules && (this.length > style.cssRules.length)){
            this.length = style.cssRules.length;
            this.cssRules.splice(ndx, 1);
         }else if(style.rules && (this.length > style.rules.length)){
            this.length = style.rules.length;
            this.cssRules.splice(ndx, 1);
         }else
            result = false;
         this.cssText = style.cssText;
         */
      }
      return result;
   },
   insertRule: function(rule, ndx){
      var style = this.getNative(),
          result = false;
      if(!style || (typeof rule !== 'string') || (typeof ndx !== 'number') || (ndx > this.length) || (ndx < 0))
         return false;
      ndx -= this.disposition;
      try{
         if(style.insertRule){
            style.insertRule(rule, ndx);
            result = true;
         }else if(style.addRule){
            var selector, declaration;
            selector = rule.slice(0, rule.indexOf('{'));
            declaration = rule.slice(rule.indexOf('{')+1, rule.lastIndexOf('}'));
            style.addRule(selector, declaration, ndx);
            result = true;
         }
      }catch(e){
         alert('Failed to insert rule: ' + e);
      }
      if(result){
         if(style.cssRules)
            this.cssRules.splice(ndx + this.disposition, 0, new g3.css.Rule(style.cssRules[ndx]));
         else if(style.rules)
            this.cssRules.splice(ndx + this.disposition, 0, new g3.css.Rule(style.rules[ndx]));
         else
            result = false;
         if(result){
            ++this.length;
            //IE
            this.cssText = style.cssText;
            //FF & compatible
            if(!this.cssText){
               this.cssText = '';
               for(var i = 0; i < this.length; i++){
                  this.cssText += this.cssRules[i].cssText + '\n';
               }
            }
         }
         /*
         //take into account possible insertion failure
         if(style.cssRules && (this.length < style.cssRules.length)){
            this.length = style.cssRules.length;
            this.cssRules.splice(ndx, 0, new g3.css.Rule(style.cssRules[ndx]));
         }else if(style.rules && (this.length < style.rules.length)){
            this.length = style.rules.length;
            this.cssRules.splice(ndx, 0, new g3.css.Rule(style.rules[ndx]));
         }else
            result = false;
         this.cssText = style.cssText;
         */
      }
      return result;
   },
   replaceRule: function(rule, ndx){
      return (this.deleteRule(ndx) && this.insertRule(rule, ndx));
   }
});

/**********************************Object Rule**********************************
 * Public class 'g3.css.Rule'.
 * Normalizes Mozila's or MS 'Rule' object that represents a single style 
 * rule.
 * @module {g3.css}
 * @constructor
 * @param {Rule} 'rule' a native style rule object.
 * @return {} None because we use a class library. Initialization is passed to
 * method 'init()'.
 * @function {g3.css.Rule.init}
 * @public
 * @param {Rule} 'rule' a native style rule object.
 * @return {Rule} It is chainable.
 * @function {g3.css.Rule.getNative}
 * @public
 * @return {Object} Returns the native style rule object.
 * @function {g3.css.Rule.getTypeName}
 * @public
 * @return {String} A descriptive string of the propery 'this.type'.
 * 
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 * @reference
 * https://developer.mozilla.org/en-US/docs/Web/API/CSSRule?redirectlocale=en-US&redirectslug=DOM%2FcssRule
 * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule
 * https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_dynamic_styling_information?redirectlocale=en-US&redirectslug=Web%2FGuide%2FDOM%2FUsing_dynamic_styling_information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule?redirectlocale=en-US&redirectslug=CSS%2FAt-rule
 * http://msdn.microsoft.com/en-us/library/ie/ff975067%28v=vs.85%29.aspx
 * http://msdn.microsoft.com/en-us/library/ie/ms535887%28v=vs.85%29.aspx
 * http://msdn.microsoft.com/en-us/library/aa358815%28v=vs.85%29.aspx
 * http://help.dottoro.com/ljdxvksd.php
 ******************************************************************************/
g3.css.Rule = g3.Class({
   constructor: function(rule, obj){
      function init(self, rule, obj){
         self.getNative = function(){
            //IE for @import only
            if(obj && obj.import_rule)
               return obj.import_rule.styleSheet;
            //FF & compatible for @import only
            else if(rule && rule.styleSheet)
               return rule.styleSheet;
            //all browsers except for @import
            else
               return rule;
         };
         if(rule){
            //FF & compatible, read
            if(rule.cssText)
               self.cssText = rule.cssText;
            //IE, read, write
            else if(rule.style)
               self.cssText = rule.selectorText + ' { ' + rule.style.cssText + ' }';
            //IE for @import only
            else if(obj && obj.import_rule)
               self.cssText = obj.import_rule.cssText;
            else
               self.cssText = null;
            //all browsers, read
            if(rule.selectorText)
               self.selector = rule.selectorText;
            else
               self.selector = null;
            //all browsers, read
            if(rule.style)
               self.declaration = rule.style.cssText;
            else
               self.declaration = null;
            //FF & compatible, read
            if(rule.type)
               self.type = rule.type;
            //IE for @import only
            else if(obj && obj.import_rule)
               self.type = obj.import_rule.type;
            //IE for style rule only
            else if(obj && obj.style_rule)
               self.type = obj.style_rule.type;
            else
               self.type = null;
            //FF & compatible for @import only, read
            if(rule.href)
               self.href = rule.href;
            //IE for @import only
            else if(obj && obj.import_rule && obj.import_rule.styleSheet)
               self.href = obj.import_rule.styleSheet.href;
            else
               self.href = null;
            //FF & compatible for @import only, read
            if(rule.media)
               self.media = rule.media.mediaText;
            //IE for @import only
            else if(obj && obj.import_rule && obj.import_rule.styleSheet)
               self.media = obj.import_rule.styleSheet.media;
            else
               self.media = null;
         }else{
            self.cssText = null;
            self.selector = null;
            self.declaration = null;
            self.type = null;
            self.href = null;
            self.media = null;
         }
         //ATTENTION: circular reference when used!
         //self.parentRule = ((rule && rule.parentRule)? new g3.css.Rule(rule.parentRule): null); //read
         //ATTENTION: circular reference when used!
         //self.parentStyleSheet = ((rule && rule.parentStyleSheet)? new g3.css.StyleSheet(rule.parentStyleSheet): null); //read
         return self;
      };
      init(this, rule, obj);
   },
   STATIC: {
      type: {
         0: 'UNKNOWN_RULE',
         1: 'STYLE_RULE',
         2: 'CHARSET_RULE',
         3: 'IMPORT_RULE',
         4: 'MEDIA_RULE',
         5: 'FONT_FACE_RULE',
         6: 'PAGE_RULE',
         7: 'NAMESPACE_RULE'
      }
   },
   getTypeName: function(){
      return g3.css.Rule.type[this.type];
   }
});
}(window.g3 = window.g3 || {}, jQuery, window, document));