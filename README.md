g3css
=====
An abstract set of custom classes that handle the CSSOM objects in different windows and browsers.
What we have here is basically, three classes:
<ul>
<li>the list of all style sheets of a window, represented by <code>g3.css.StyleSheetList</code></li>
<li>a specific style sheet, represented by <code>g3.css.StyleSheet</code> and</li>
<li>a specific rule of a style sheet, represented by <code>g3.css.Rule</code>.</li>
</ul>
<p>Native properties are exposed as custom object properties defined as accessors. So, setting properties on custom objects results in similar changes at the equivalent native ones. Pay attention though, that the other way round, changes on native style object properties through native code are <b>not</b> reflected in custom objects unless they are rebuilt!</p>
<p>Similarly, reading the properties of the custom objects reflects the real values of the native ones.</p>
<h3>Updates in v.0.5</h3>
<ul>
<li>a bug in static method <code>g3.css.StyleSheetList.filter()</code> was corrected</li>
<li>filter on <code>declaration</code> part is possible</li>
<li>custom errors <code>g3.Error</code> are thrown instead of <code>alert()</code>.</li>
</ul>
<h3>Updates in v.0.4</h3>
<ul>
<li>now, filtering is capable through simple or chained(!) filters</li>
<li>user can override the static function <code>filter</code> that belongs to class <code>g3.css.StyleSheetList</code></li>
<li>we can move back and forth between different views of the sheet/rule collection based on filters or not and never re-build anything again(!)</li>
<li>added the ability to build a full tree of style sheets and rules by passing on construction a second argument, <code>new g3.css.StyleSheetList(win, infinite)</code> (the first filter with <code>deep: true</code> will certainly make a deep re-build if not asked from start but only once during object's <code>g3.css.StyleSheetList</code> lifetime!)</li>
<li>if you really want to re-built it just call <code>new g3.css.StyleSheetList(win, infinite)</code></li>
<li>if you don't want to re-built it just call <code>g3.css.StyleSheetList.get(win)</code></li>
<li>inserted rules re-build silently only the specific style sheet they belong to(!)</li>
<li>complex filtering cases tested with success even with IE8 which interprets rules differently</li>
<li>late construction of style sheets and rules on user demand still holds</li>
<li>build-and-forget still holds (call <code>g3.css.StyleSheetList.get(window)</code>) except if user decides to re-build.</li>
</ul>

Usage
=====
<p>Now, when you create a <code>g3.css.StyleSheetList</code> object, all sub-objects of type  <code>g3.css.StyleSheet</code> and <code>g3.css.Rule</code> are created automatically resulting in a 3-level structure and <b>no</b> deeper!</p>
<p>Of course, in reality it can go much deeper but it's very simple to proceed from 4-level and higher with the use of method <code>g3.css.Rule.getNative</code></p>
<p>On v.0.4 this is done with a second argument <code>true</code> passed during construction: <code>new g3.css.StyleSheetList(win, infinite)</code> or, on the first filter with <code>deep: true</code>.</p>
<p>Imagine an html file:</p>
<pre>
   test-g3css-stub1.html
      /     \  &lt;HEAD>
      |     |    ...
  L   |     |    &lt;link rel="stylesheet" type="text/css" media="all" href="test-g3css-stub-link1.css" />
  E   |     |    &lt;style media="screen,print">...&lt;/style>
  V  /  list \   &lt;style media="print">...&lt;/style>
  E  \       /    ...
  L   |     |  &lt;/HEAD>
      |     |  &lt;BODY>
  1   |     |    ...
      \     /  &lt;/BODY>
</pre>
<p><b><u>Level-1</u></b> style list object is apparent: <code>var csslist = new g3.css.StyleSheetList(win);</code></p>
<p><b><u>Level-2</u></b> objects represent style sheets: <code>var sheet0 = csslist.item(0); ...</code></p>
<pre>
   test-g3css-stub1.html
  L   / sheet0 \   &lt;link rel="stylesheet" type="text/css" media="all" href="test-g3css-stub-link1.css" />
  E   |        |
  V  /  sheet1  \  &lt;style media="screen,print">...&lt;/style>
  E  \          /
  L   | sheet2 |   &lt;style media="print">...&lt;/style>
  2   \        /
</pre>
<p><b><u>Level-3</u></b> objects represent rules of a style sheet: <code>var rule00 = sheet0.cssRules[0];</code></p>
<pre>
   test-g3css-stub-link1.css
  L   / rule00 \   @import url("test-g3css-stub-link2.css") screen,print;
  E   |        |
  V  /  rule01  \  .container_12 {...}
  E  \          /
  L   | rule02 |   .grid, .grid_12 {...}
  3   \        /
</pre>
<p>And that's it!</p>
Going deeper
============
<p>Natively, the mechanism is applied with imported rules as in <code>rule00</code>. So, how can we scan a whole style sheet chain coming from imported links?</p>
<p>Programmatically, we could have added a public property: <code>g3.css.Rule.styleSheet</code> that would be a new custom <code>g3.css.StyleSheet</code> object and that would be enough to start a new circle of <b>Level-2 ==> Level-3</b> objects!</p>
<p>Instead, they are built on demand as follows: <code>var sheet00 = new g3.css.Rule.styleSheet(rule00.getNative())</code>, i.e. build the style sheet that comes from rule <code>rule00</code>. And that is enough to start a new circle of construction automatically that will stop when the rules of the new sheet are built!</p>
<p>On v.0.4 this is done with a second argument <code>true</code> passed during construction: <code>new g3.css.StyleSheetList(win, infinite)</code> or, on the first filter with <code>deep: true</code>.</p>
<pre>
  test-g3css-stub-link2.css
  L   / rule000 \   ... {...}
  E   |         |
  V  /  rule001  \ @import url("test-g3css-stub-link3.css");
  E  \           /
  L   | rule002 |   ... {...}
  4   \        /
</pre>
<p>Levels 4-5 are built on demand. The same applies to 6-7 etc.</p>

Dependencies
============
Just <code>my.class.js</code> and my custom error class <code>g3Error.js</code>(included).

Classes
=======
<h2>1. g3.css.StyleSheetList</h2>
<h3>Methods</h3>
<ol>
<li>Constructor: <code>var list = new g3.css.StyleSheetList(win, infinite)</code></li>
<li>Get a style sheet: <code>list.item(n)</code></li>
<li>Filter rules with <code>list.filter(object)</code> where 
<pre>object = {deep: &lt;boolean>, 
href: &lt;uri>, 
rule: &lt;RegExp|String|Array[String]>, 
selector: &lt;RegExp|String|Array[String]>, 
declaration: &lt;RegExp|String|Array[String]>, 
wordPart: &lt;Boolean>, 
style: &lt;Boolean>, 
link: &lt;Boolean>, 
id: &lt;String>}</pre>
</li>
<li>Get a 2D array with <code>list.getFilterRules()</code> where at index <code>i</code> a style sheet  <code>list.get(i)</code> is found with matched rules <code>list.get(i).cssRules[j]</code> that have indeces the values of the array <code>list.getFilterRules()[i]</code></li>
<li>Stop filtering and return to full style sheet/rule view with <code>list.end()</code></li>
<li>Get a constructed style sheet list with <code>g3.css.StyleSheetList.get(window, infinite)</code> or, force to create one if not already there, finally,</li>
<li>build a new custom filter at <code>g3.css.StyleSheetList.filter(text, selectors, wordPart)</code> (see code comments).</li>
</ol>
<h3>Properties</h3>
<ol>
<li>Length of list: <code>list.length</code></li>
</ol>

<h2>2. g3.css.StyleSheet</h2>
<h3>Methods</h3>
<ol>
<li>Constructor: <code>var sheet = list.item(n)</code></li>
<li>Get the native style sheet: <code>sheet.getNative()</code></li>
<li>Set a native style property: <code>sheet.set('media')</code></li>
<li>Insert a rule at index 3: <code>sheet.insertRule('.container_12{width: 50%;}', 3)</code></li>
<li>Delete a rule at index 3: <code>sheet.deleteRule(3)</code></li>
<li>Replace a rule at index 3: <code>sheet.replaceRule('.grid, .grid_12{width: 50%;}', 3)</code></li>
</ol>
<h3>Properties</h3>
<ol>
<li>The <code>style</code> or <code>link</code> node: <code>sheet.ownerNode</code></li>
<li>The <code>@import</code> rule object: <code>sheet.ownerRule</code></li>
<li>The type of style sheet: <code>sheet.type</code></li>
<li>The css text: <code>sheet.cssText</code></li>
<li>An array of <code>g3.css.Rule</code> objects: <code>sheet.cssRules</code></li>
<li>The length of <code>sheet.cssRules</code>: <code>sheet.length</code></li>
<li>The real <code>cssRules</code> array in &lt;=IE8 starts at index higher by (0 for other browsers): <code>sheet.disposition</code></li>
<li>The disabled property: <code>sheet.disabled</code></li>
<li>The href property: <code>sheet.href</code></li>
<li>The media property: <code>sheet.media</code></li>
<li>The title property: <code>sheet.title</code></li>
</ol>

<h2>2. g3.css.Rule</h2>
<h3>Methods</h3>
<ol>
<li>Constructor: <code>var rule = list.item(n).cssRules[m]</code></li>
<li>Get the native rule: <code>rule.getNative()</code></li>
<li>Get a descriptive type name of the type property: <code>rule.getTypeName()</code></li>
</ol>
<h3>Properties</h3>
<ol>
<li>The css text: <code>rule.cssText</code></li>
<li>The selector part of a rule: <code>rule.selector</code></li>
<li>The declaration part of a rule: <code>rule.declaration</code></li>
<li>The type property of a rule: <code>rule.type</code></li>
<li>The href property of a rule: <code>rule.href</code></li>
<li>The media property of a rule: <code>rule.media</code></li>
</ol>

Evaluator test page
===================
See: <a href="http://centurianii.github.io/g3css/">g3css</a>

Have fun!
