define(["mvc/tours","layout/generic-nav-view","mvc/webhooks"],function(a,b,c){var d=Backbone.Collection.extend({model:Backbone.Model.extend({defaults:{visible:!0,target:"_parent"}}),fetch:function(d){d=d||{},this.reset();var e=new b.GenericNavView;this.add(e.render()),this.add({id:"analysis",title:"Analyze Data",url:"",tooltip:"Analysis home view"}),this.add({id:"workflow",title:"Workflow",url:"workflow",tooltip:"Chain tools into workflows",disabled:!Galaxy.user.id}),this.add({id:"shared",title:"Shared Data",url:"library/index",tooltip:"Access published resources",menu:[{title:"Data Libraries",url:"library/list"},{title:"Histories",url:"history/list_published"},{title:"Workflows",url:"workflow/list_published"},{title:"Visualizations",url:"visualization/list_published"},{title:"Pages",url:"page/list_published"}]}),d.user_requests&&this.add({id:"lab",title:"Lab",menu:[{title:"Sequencing Requests",url:"requests/index"},{title:"Find Samples",url:"requests/find_samples_index"},{title:"Help",url:d.lims_doc_url}]}),this.add({id:"visualization",title:"Visualization",url:"visualization/list",tooltip:"Visualize datasets",disabled:!Galaxy.user.id,menu:[{title:"New Track Browser",url:"visualization/trackster",target:"_frame"},{title:"Saved Visualizations",url:"visualization/list",target:"_frame"},{title:"Interactive Environments",url:"visualization/gie_list",target:"galaxy_main"}]}),c.add({url:"api/webhooks/masthead/all",callback:function(a){$(document).ready(function(){$.each(a.models,function(a,b){var c=b.toJSON();c.activate&&Galaxy.page.masthead.collection.add({id:c.name,icon:c.config.icon,url:c.config.url,tooltip:c.config.tooltip,onclick:c.config.function&&new Function(c.config.function)})})})}}),Galaxy.user.get("is_admin")&&this.add({id:"admin",title:"Admin",url:"admin",tooltip:"Administer this Galaxy",cls:"admin-only"});var f={id:"help",title:"Help",tooltip:"Support, contact, and community hubs",menu:[{title:"Support",url:d.support_url,target:"_blank"},{title:"Search",url:d.search_url,target:"_blank"},{title:"Mailing Lists",url:d.mailing_lists,target:"_blank"},{title:"Videos",url:d.screencasts_url,target:"_blank"},{title:"Wiki",url:d.wiki_url,target:"_blank"},{title:"How to Cite Galaxy",url:d.citation_url,target:"_blank"},{title:"Interactive Tours",url:"tours",onclick:function(){Galaxy.app?Galaxy.app.display(new a.ToursView):window.location=Galaxy.root+"tours"}}]};if(d.terms_url&&f.menu.push({title:"Terms and Conditions",url:d.terms_url,target:"_blank"}),d.biostar_url&&f.menu.unshift({title:"Ask a question",url:"biostar/biostar_question_redirect",target:"_blank"}),d.biostar_url&&f.menu.unshift({title:"Galaxy Biostar",url:d.biostar_url_redirect,target:"_blank"}),this.add(f),Galaxy.user.id){var g={id:"user",title:"User",cls:"loggedin-only",tooltip:"Account preferences and saved data",menu:[{title:"Logged in as "+Galaxy.user.get("email")},{title:"Preferences",url:"user?cntrller=user",target:"galaxy_main"},{title:"Custom Builds",url:"user/dbkeys",target:"galaxy_main"},{title:"Logout",url:"user/logout",target:"_top",divider:!0},{title:"Saved Histories",url:"history/list",target:"galaxy_main"},{title:"Saved Datasets",url:"dataset/list",target:"galaxy_main"},{title:"Saved Pages",url:"page/list",target:"_top"},{title:"API Keys",url:"user/api_keys?cntrller=user",target:"galaxy_main"}]};d.use_remote_user&&g.menu.push({title:"Public Name",url:"user/edit_username?cntrller=user",target:"galaxy_main"}),this.add(g)}else{var g={id:"user",title:"User",cls:"loggedout-only",tooltip:"Account registration or login",menu:[{title:"Login",url:"user/login",target:"galaxy_main",noscratchbook:!0}]};d.allow_user_creation&&g.menu.push({title:"Register",url:"user/create",target:"galaxy_main",noscratchbook:!0}),this.add(g)}var h=this.get(d.active_view);return h&&h.set("active",!0),(new jQuery.Deferred).resolve().promise()}}),e=Backbone.View.extend({initialize:function(a){this.model=a.model,this.setElement(this._template()),this.$dropdown=this.$(".dropdown"),this.$toggle=this.$(".dropdown-toggle"),this.$menu=this.$(".dropdown-menu"),this.$note=this.$(".dropdown-note"),this.listenTo(this.model,"change",this.render,this)},events:{"click .dropdown-toggle":"_toggleClick"},render:function(){var a=this;return $(".tooltip").remove(),this.$el.attr("id",this.model.id).css({visibility:this.model.get("visible")&&"visible"||"hidden"}),this.model.set("url",this._formatUrl(this.model.get("url"))),this.$note.html(this.model.get("note")||"").removeClass().addClass("dropdown-note").addClass(this.model.get("note_cls")).css({display:this.model.get("show_note")&&"block"||"none"}),this.$toggle.html(this.model.get("title")||"").removeClass().addClass("dropdown-toggle").addClass(this.model.get("cls")).addClass(this.model.get("icon")&&"dropdown-icon fa "+this.model.get("icon")).addClass(this.model.get("toggle")&&"toggle").attr("target",this.model.get("target")).attr("href",this.model.get("url")).attr("title",this.model.get("tooltip")).tooltip("destroy"),this.model.get("tooltip")&&this.$toggle.tooltip({placement:"bottom"}),this.$dropdown.removeClass().addClass("dropdown").addClass(this.model.get("disabled")&&"disabled").addClass(this.model.get("active")&&"active"),this.model.get("menu")&&this.model.get("show_menu")?(this.$menu.show(),$("#dd-helper").show().off().on("click",function(){$("#dd-helper").hide(),a.model.set("show_menu",!1)})):(a.$menu.hide(),$("#dd-helper").hide()),this.$menu.empty().removeClass("dropdown-menu"),this.model.get("menu")&&(_.each(this.model.get("menu"),function(b){a.$menu.append(a._buildMenuItem(b)),b.divider&&a.$menu.append($("<li/>").addClass("divider"))}),a.$menu.addClass("dropdown-menu"),a.$toggle.append($("<b/>").addClass("caret"))),this},_buildMenuItem:function(a){var b=this;return a=_.defaults(a||{},{title:"",url:"",target:"_parent",noscratchbook:!1}),a.url=b._formatUrl(a.url),$("<li/>").append($("<a/>").attr("href",a.url).attr("target",a.target).html(a.title).on("click",function(c){c.preventDefault(),b.model.set("show_menu",!1),a.onclick?a.onclick():Galaxy.frame.add(a)}))},_toggleClick:function(a){function b(a,b){return $("<div/>").append($("<a/>").attr("href",Galaxy.root+b).html(a)).html()}var c=this,d=this.model;a.preventDefault(),$(".tooltip").hide(),d.trigger("dispatch",function(a){d.id!==a.id&&a.get("menu")&&a.set("show_menu",!1)}),d.get("disabled")?(this.$toggle.popover&&this.$toggle.popover("destroy"),this.$toggle.popover({html:!0,placement:"bottom",content:"Please "+b("login","user/login?use_panels=True")+" or "+b("register","user/create?use_panels=True")+" to use this feature."}).popover("show"),setTimeout(function(){c.$toggle.popover("destroy")},5e3)):d.get("menu")?d.set("show_menu",!0):d.get("onclick")?d.get("onclick")():Galaxy.frame.add(d.attributes)},_formatUrl:function(a){return"string"==typeof a&&-1===a.indexOf("//")&&"/"!=a.charAt(0)?Galaxy.root+a:a},_template:function(){return'<ul class="nav navbar-nav"><li class="dropdown"><a class="dropdown-toggle"/><ul class="dropdown-menu"/><div class="dropdown-note"/></li></ul>'}});return{Collection:d,Tab:e}});
//# sourceMappingURL=../../maps/layout/menu.js.map