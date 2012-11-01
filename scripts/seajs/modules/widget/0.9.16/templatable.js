define("#widget/0.9.16/templatable",["#jquery/1.7.2/jquery","#handlebars/1.0.0/handlebars","#widget/0.9.16/ast-printer"],function(a,b,c){function g(a){var b=e.parse(a).statements,c="";for(var f=0,g=b.length;f<g;f++){var h=b[f];h.type==="content"?c+=h.string:c+="{{STAT "+f+"}}"}c=k(c);var i=d(c);return i.template=c,i.statements=b,i}function h(a,b){var c=a.find(b);if(c.length===0)throw new Error("Invalid template selector: "+b);var d=l(c.html()),f=a.statements;return d=d.replace(i,function(a,b,c){return e.print(f[c])}),d}function k(a){return a.replace(i,"<!--$1-->")}function l(a){return a.replace(j,"$1")}var d=a("#jquery/1.7.2/jquery"),e=a("#handlebars/1.0.0/handlebars");e.print=a("#widget/0.9.16/ast-printer").print;var f={templateHelpers:null,templateObject:null,parseElementFromTemplate:function(){this.templateObject=g(this.template),this.element=d(this.compile())},compile:function(a,b){a||(a=this.template),b||(b=this.model),b.toJSON&&(b=b.toJSON());var c=this.templateHelpers;if(c)for(var d in c)c.hasOwnProperty(d)&&e.registerHelper(d,c[d]);var f=e.compile(a)(b);if(c)for(d in c)c.hasOwnProperty(d)&&delete e.helpers[d];return f},renderPartial:function(a){var b=this._getTemplatePartial(a);return this.$(a).html(this.compile(b)),this},_getTemplatePartial:function(a){var b;return a?b=h(this.templateObject,a):b=this.template,b}};c.exports=f;var i=/({{STAT (\d+)}})/g,j=/(?:<|&lt;)!--({{STAT \d+}})--(?:>|&gt;)/g});