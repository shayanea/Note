app.service('NoteService',function($rootScope,TagService){
    var costume = [];
    var note = [];
    var self = this;

    function myMapFunction(doc) {
        if (doc.deleted) {
            emit(true);
        }else{
            emit(false);
        }
    }

    self.GetAll = function(){
        return db.allDocs({
            include_docs: true,
        }).then((result)=> {
            return result.rows;
        }).catch((err) => {
            return costume;
        });
    },
    self.GetUnTrashNote = function(){
        return db.query(myMapFunction, {key : false, include_docs : true})
        .then((result)=> {
            return result.rows;
        }).catch((err) => {
            return costume;
        });
    },
    self.GetTrashNote = function(){
        return db.query(myMapFunction, {key : true, include_docs : true})
        .then((result)=> {
            return result.rows;
        }).catch((err)=> {
            return costume;
        });
    },
    self.MoveToTrash = function(id){
        return db.get(id).then((doc)=> {
            return db.put({
                _id: id,
                _rev: doc._rev,
                body: doc.body,
                tags: doc.tags,
                deleted: true
            });
        }).then((response)=> {
            return response.ok;
        }).catch((err)=> {
            console.log(err);
        });
    },
    self.Restore = function(id){
        return db.get(id).then((doc)=> {
            return db.put({
                _id: id,
                _rev: doc._rev,
                body: doc.body,
                tags: doc.tags,
                deleted: false
            });
        }).then((response)=> {
            return response.ok;
        }).catch((err)=> {
            console.log(err);
        });
    },
    self.Update = function(id,body,tags){
        TagService.AddTag(tags)
        .then((res)=> {
            db.get(id).then((doc)=> {
                return db.put({
                    _id: id,
                    _rev: doc._rev,
                    body: body,
                    tags: res,
                    deleted: false
                });
            }).then((response)=> {
                if(response.ok){ $rootScope.$emit('UpdateList',true) }
            }).catch((err)=> {
                console.log(err);
            });
        }).catch((error)=> {
            console.log(error);
        });
    },
    self.Save = function(data,tags){
        TagService.AddTag(tags)
        .then((res)=> {
            console.log(res);
            db.put({
                _id: new Date().getTime() + '',
                body: data,
                tags: res,
                deleted: false
            }).then((result)=> {
                if(result.ok){$rootScope.$emit('UpdateList',true)};
            }).catch((err)=> {
                console.log(err);
            });
        }).catch((error)=> {
            console.log(error);
        });
    }
});