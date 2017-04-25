$( document ).ready(function() {

    Vue.component('project-row', {
       template: '#project-row',
       props: {
           project: Object
       },
       data: function () {
            return {
                vproject: this.project,
                editMode: false,
                categorie: ["plop"]
            }
        },
       methods: {
           vote: function (_for) {
               var that = this;
               if (that.project.current_user.logged_user)
                   $.ajax({
                       method: 'POST',
                       url: _for ? that.project.urls.vote_for : that.project.urls.vote_against,
                       success: function(res) {
                           that.vproject = res;
                       }
                   });
               else
                   location.href = "users/sign_in";
           },
           join: function (join) {
               var that = this;
               if (that.project.current_user.logged_user)
                   $.ajax({
                       method: 'POST',
                       url: join ? that.project.urls.join : that.project.urls.leave,
                       success: function(res) {
                           that.vproject = res;
                       }
                   });
               else
                   location.href = "users/sign_in";
           },
           edit: function () {
               var that = this;
               location.href = that.vproject.urls.edit
           },
           update_project: function () {
               var that = this;
               Vue.http.patch(that.vproject.url,{name: that.vproject.name, description: that.vproject.description}).then( function (response) {
                   that.vproject = response.body;
                   that.editMode = false},
                   console.log("error")
               )

               // that.editMode = false
           }
       }
    });


    var projects = new Vue({
        el: '#projects',
        data: {
            projects: [],
            currentRoute: window.location.pathname
        },
        mounted: function() {
            var that;
            that = this;
            $.ajax({
                url: this.ProjectsUrl,
                success: function(res) {
                    that.projects = res.constructor === Array ? res : [res];
                }
            });
        },
        computed: {
            ProjectsUrl: function () {
                if (this.currentRoute === "/")
                    return "/projects.json"
                else
                    return this.currentRoute + ".json";
            }
        }
    });
});