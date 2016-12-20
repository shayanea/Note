app.service('DatabaseService',function($log,$localStorage){

    var self = this;

    self.RemoveNote = function(){
        return db.allDocs().then(function(_response){
            var toBeDeleted = _response.rows.length;
            _response.rows.forEach(function(row){
                db.remove(row.id, row.value.rev)
                .then((res)=> {
                    if(res.ok){
                        --toBeDeleted;   
                    }
                }).catch((err)=> {
                    console.log(err);
                })
            });
        });
    },
    self.FillData = function(){
        db.put({
            _id: new Date().getTime() + '',
            body: "Welcome To Notes",
            tags: '',
            deleted: false
        }).then((result)=> {
            if(result.ok){$localStorage.FirstTime = false;};
        }).catch((err)=> {
            console.log(err);
        });
    }
})