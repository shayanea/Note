app
.controller('ListController',function($scope,NoteService,List,$rootScope){

    $scope.Lists = List;

    if($scope.Lists.length > 0){$rootScope.$emit('Share',$scope.Lists[0].doc);}

    $scope.RemoveNote = function(item){
        var index = $scope.Lists.indexOf(item);
        NoteService.MoveToTrash(item.doc._id)
        .then((res)=> {
            if(res){
                $scope.$apply(function(){
                    $scope.Lists.splice(index,1);
                });
            }
        })
    };

    $scope.ShowNote = function(item){
        $rootScope.$emit('Share',item.doc);
    };

    $scope.NewNote = function(){
        $rootScope.$emit('Clear',true);
    };
    
    $rootScope.$on('UpdateList',function(event, data){
        if(data){
            NoteService.GetAll().then((res)=> {
                $scope.$apply(function() { 
                    $scope.Lists = res;
                });
            }).catch((err)=> {
                $scope.Lists = [];
            })
        }
    });
})

.controller('TrashController',function($scope,List,NoteService,DatabaseService,$rootScope){

    $scope.Lists = List;

    if($scope.Lists.length > 0){$rootScope.SharedNote = $scope.Lists[0].doc;}

    $scope.RestoreNote = function(item){
        var index = $scope.Lists.indexOf(item);
        NoteService.Restore(item.doc._id)
        .then((res) =>{
            if(res){
                $scope.$apply(function(){
                    $scope.Lists.splice(index,1);
                });
            }
        }).catch((err)=> {
            console.log(err);
        })
    };

    $scope.ClearTabel = function(){
        DatabaseService.RemoveNote()
        .then((res)=> {
            $scope.$apply(function(){
                $scope.Lists = [];
            });
        }).catch((err)=> {
            console.log(err);
        })
    };

    $scope.ShowNote = function(item){
        $rootScope.SharedNote = item.doc;
    };

})

.controller('NoteController',function($scope,NoteService,TagService,$rootScope){

    $scope.Note = {};

    $scope.Tags = [];

    $rootScope.$on('Share',function(event, data){
        console.log(data);
        if(data){
            $scope.Note = data;
            TagService.GetTagById($scope.Note.tags)
            .then((res)=> {
                $scope.$apply(function(){
                    $scope.Tags = res;
                });
            }).catch((err)=> {  
                console.log(err);
            })
            $scope.ShowMark = true;
        }  
    });

    $rootScope.$on('Clear',function(event, data){
        if(data){
            $scope.Note = {};
            $scope.ShowMark = false;
            $scope.Tags = [];
            $scope.tag = "";
        }
    });

    $rootScope.$on('UpdateList',function(event, data){
        if(data){
            $scope.Note = {};
            $scope.ShowMark = false;
            $scope.Tags = [];
            $scope.tag = "";
        }
    });

    $scope.Restore = function(id){
        NoteService.Restore(id);
    };

    $scope.AddNote = function(item){
        if(typeof item != undefined){
            if(typeof item._id == "undefined"){
                NoteService.Save(item.body,$scope.Tags);
                $scope.Tags = [];
                $scope.tag = "";
            }else{
                NoteService.Update(item._id,item.body,$scope.Tags);
                $scope.Tags = [];
                $scope.tag = "";
            }
        }
    };

    $scope.AddTag = function(event,data){
        if(event == 13 && typeof data != "undefined" && data != ""){
            $scope.Tags.push(
                {
                    title:data
                }
            );
            $scope.tag = "";
        }
    };

    $scope.RemoveTag = function(item){
        var index = $scope.Tags.indexOf(item);
        $scope.Tags.splice(index,1);
    };

})

.controller('TagsController',function($scope,List,$state,TagService){

    $scope.Tags = List;

    $scope.ShowNote = function(data){
        console.log(data);
        $state.go('notes',{id:data._id,title:data.title});
    };

    $scope.RemoveTag = function(item){
        var index = $scope.Tags.indexOf(item);
        console.log(index);
        TagService.Remove(item.doc._id)
        .then((res)=> {
            if(res.ok){
                $scope.$apply(function(){
                    $scope.Tags.splice(index,1);
                });
            }
        }).catch((err)=> {
            console.log(err);
        });
    };
        
})

.controller('NotesController',function($scope,$state,$stateParams,NoteService,Notes,$rootScope){

    if(typeof $stateParams.id != "undefined" || typeof $stateParams.title != "undefined"){
        $scope.Title = $stateParams.title;

        var matches = [];
        $scope.NoteList = [];
        Notes.forEach(function(e) {
            matches = matches.concat(e.doc.tags.filter(function(c) {
                if(c.id === $stateParams.id){
                    $scope.NoteList.push(e);
                    return e;
                }
            }));
        });
    }else{
        $state.go('tags');
    }

    $scope.RemoveNote = function(id){
        NoteService.MoveToTrash(id);
    };

    $scope.ShowNote = function(item){
        $rootScope.$emit('Share',item.doc);
    };

    
});