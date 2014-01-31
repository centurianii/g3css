/*********************************Object Class**********************************
 * A class abstraction that is based on prototypal inheritance.
 * It implements inheritance, static members, class mixins.
 * @module {g3}
 * @function {g3.Class}
 * @public
 * @param {[Function, Function, ... ]Object} 
 * The last argument is an object with the following behaviour:
 * the overiden 'constructor' method will become the new class constructor,
 * everything defined inside the constructor with 'this' will become a public 
 * member, everything defined with 'var' or 'function' will become a private 
 * member. The internal functions they become privileged methods. 
 * All other functions of this argument will become prototypal methods with one 
 * exception: all members (properties, functions) inside an object that is the 
 * value of a member called 'STATIC' will be attached to the 'constructor' 
 * function as static members. Should note that duplicates from parent are 
 * overwriten.
 * Use of special static property 'Super': access the parent constructor with
 * 'newClass.Super.call(this, arg1, arg2, ...)' and every parent's method with
 * 'newClass.Super.prototype.method.call(this, arg1, arg2, ...)'.
 * The next important argument is the first one: public properties of this one
 * declared with 'this' and prototypal ones are inhereted to the new object 
 * (that's why it should be a function). Also, all static members of parent are 
 * passed to this constructor as static too.
 * All in-between arguments are borrow their prototypal properties to the new  
 * object resulting in object mixins (that's why they should be functions).

 * @return {Function} A constructor function.
 *
 * @version 0.1
 * @author https://github.com/jiem/my-class
 * @copyright MIT licence.
 *
 * Updates by Scripto JS Editor by Centurian Comet:
 * 1. redefine global namespace
 * 2. correct AMD module code not to overwrite my g3 global object.
*******************************************************************************/
(function($, window, document, undefined){
   // Namespace object
   var g3;
   // Return as AMD module or attach to head object
   if (typeof define !== 'undefined')
      define([], function () {
      g3 = g3 || {};
      return g3;
    });
   else if (typeof window !== 'undefined')
      g3 = window.g3 = window.g3 || {};
   else{
      g3 = g3 || {};
      module.exports = g3;
   }

   g3.Class = function () {
      var len = arguments.length;
      if(len === 0 || (len === 1 && arguments[0] === null))
         return function() {};
      var body = arguments[len - 1];
      var SuperClass = len > 1 ? arguments[0] : null;
      var implementClasses = len > 2;
      var Class, SuperClassEmpty;

      //we expect last object to overide 'constructor' otherwise the new is empty!
      if (body.constructor === Object) {
         Class = function() {};
      } else {
         Class = body.constructor;
         delete body.constructor;
      }

      //'Class.Super' is a reserved word for g3.Class!
      if (SuperClass) {
         SuperClassEmpty = function() {};
         SuperClassEmpty.prototype = SuperClass.prototype;
         Class.prototype = new SuperClassEmpty();
         Class.prototype.constructor = Class;
         Class.Super = SuperClass;
         extend(Class, SuperClass, false); //works for static members!
      }

      if (implementClasses)
         for (var i = 1; i < len - 1; i++)
            extend(Class.prototype, arguments[i].prototype, false);

      extendClass(Class, body);

      return Class;
   };

   //============================================================================
   // @method g3.extendClass
   // @params Class:function, extension:Object, ?override:boolean=true
   var extendClass = g3.extendClass = function (Class, extension, override) {
      //'STATIC' is a reserved word from last argument of g3.Class!
      if (extension.STATIC) {
         extend(Class, extension.STATIC, override); //overwrites previous parent's static members
         delete extension.STATIC;
      }
      extend(Class.prototype, extension, override);
   };

   //============================================================================
   var extend = function (obj, extension, override) {
      var prop;
      if (override === false) {
         for (prop in extension)
            if (!(prop in obj))
               obj[prop] = extension[prop];
      } else {
         for (prop in extension)
            obj[prop] = extension[prop];
         if (extension.toString !== Object.prototype.toString)
            obj.toString = extension.toString;
      }
   };
}(jQuery, window, document));