app.service('TagService',function($rootScope){
    var custome= [];

    function find(doc,ids) {
        var items = [];
        $.grep(doc, function(e){ 
            for(var i=0;ids.length > i; i++){
                if(e.doc._id == ids[i].id){
                    items.push(e.doc);
                }
            }
         });
         return items;
    }

    this.TagList = function(){
        return dbtag.allDocs({
            include_docs: true,
        }).then((result)=> {
            return(result.rows);
        }).catch((err) => {
            return custome;
        });
    },
    this.AddTag = function(data){
        return dbtag.bulkDocs(data).then((result)=> {
            return result;
        }).catch((err)=> {
            console.log(err);
        })
    },
    this.Update = function(){

    },
    this.Remove = function(id){
        return dbtag.get(id).then(function(doc) {
            return dbtag.remove(doc);
        }).then(function (result) {
            return result;
        }).catch(function (err) {
            console.log(err);
        });
    },
    this.GetNoteByTag = function(id){
        return db.allDocs({
            include_docs: true,
        }).then((result)=> {
            return find(result.rows,id);
        }).catch((err) => {
            console.log(err);
            return custome;
        });
    },
    this.GetTagById = function(id){
        return dbtag.allDocs({
            include_docs: true,
        }).then((result)=> {
            return find(result.rows,id);
        }).catch((err) => {
            console.log(err);
            return custome;
        });
    }
})