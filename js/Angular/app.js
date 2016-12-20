'use strict';

// CREATE DATABSE
var db = new PouchDB('note', { skip_setup: true });

var dbtag = new PouchDB('tags', { skip_setup: true });

const app = angular.module('Note',['ui.router','ngStorage']);

app
.config(function($stateProvider,$urlRouterProvider,appConfig) {

    $urlRouterProvider.otherwise("/list");

    $stateProvider
    .state('list', {
        url: '/list',
        templateUrl: appConfig.template + "/list.tpl.html",
        controller: 'ListController',
        resolve: {
            List: function(NoteService){
                return NoteService.GetUnTrashNote();
            }
        }
    })
    .state('trash', {
        url: '/trash',
        templateUrl: appConfig.template + "/trash.tpl.html",
        controller: 'TrashController',
        resolve: {
            List: function(NoteService){
                return NoteService.GetTrashNote();
            }
        }
    })
    .state('tags', {
        url: '/tags',
        templateUrl: appConfig.template + "/tags.tpl.html",
        controller: 'TagsController',
        resolve: {
            Notes: function(NoteService){
                return NoteService.GetUnTrashNote();
            },
            List: function(TagService){
                return TagService.TagList();
            }
        }
    })
    .state('notes', {
        url: '/notes/:id/:title',
        templateUrl: appConfig.template + "/notes.tpl.html",
        controller: 'NotesController',
        resolve: {
            Notes: function(NoteService){
                return NoteService.GetUnTrashNote();
            }
        }
    })
})

// APP DETAIL
.constant("appConfig", {
    appversion:'0.0.1',
    appproducer:'Shayan Araghi',
    template: "template"
})

.run(function($log,DatabaseService,$localStorage){
    $log.info('Angular Application Is Running');
    
    if(typeof $localStorage.FirstTime == 'undefined'){
        DatabaseService.FillData();
    }

    // CHECK IF DATABASE IS EXIST OR NOT
    db.info()
    .then((res) => {
        //console.log(res);
    })
    .catch(e => {
        console.log(e);
        var db = new PouchDB('note', { skip_setup: true });
    });
});