const redis = require('redis');
const client = redis.createClient(
    {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        no_ready_check: true,
        auth_pass: process.env.REDIS_PASS
    });


const cacheService = {
    type: {
        user: `v${process.env.npm_package_version}_USER`,
        userdetail: `v${process.env.npm_package_version}_USERDETAIL:[key]`
    },
    set(_key, value, keyparam='') {
        let key = _key;
        if(keyparam){
            key = key.replace('[key]', keyparam);
        }
        console.log('set cache '+key);
        client.set(key, JSON.stringify(value));
    },
    get(_key) {
        return (req, res, next) => {

            console.log("TEST");
            console.log(res.locals);

            let key = _key;
            if(req.params.id){
                key = key.replace('[key]', req.params.id);
            }

            console.log('get cache '+key);
            client.get(key, function (err, data) {
                if (data) {
                    console.log('get from cache');
                    res.status(200).send(JSON.parse(data));
                }
                else {
                    console.log('get from db');
                    next();
                }
            });
        }
    },
    update(key, newData){
        client.get(key, function (err, data) {
            let datas = [];
            if (data) {
                datas = JSON.parse(data);
                let existingData = datas.filter(dt=>{
                    return dt._id == newData._id;
                });

                if(existingData.length > 0){
                    let datatoupdate = existingData[0];
                    let idx = datas.indexOf(datatoupdate);
                    if(idx !== -1){
                        datas.splice(idx, 1);
                    }
                }
            }
            datas[datas.length] = newData;
            client.set(key, JSON.stringify(datas));
        });        
    },
    deleteKey(_key, keyparam){
        let key = _key;
        if(keyparam){
            key = key.replace('[key]', keyparam);
        }
        client.del(key);
    }, 
    removeItem(_key, idremoved){
        client.get(_key, function (err, data) {
            let datas = [];
            if (data) {
                datas = JSON.parse(data);
                let existingData = datas.filter(dt=>{
                    return dt._id === idremoved;
                });

                if(existingData.length > 0){
                    let datatoupdate = existingData[0];
                    let idx = datas.indexOf(datatoupdate);
                    if(idx !== -1){
                        datas.splice(idx, 1);
                    }
                }
                
            }
            client.set(_key, JSON.stringify(datas));
        });   
    },
    clear(){
        console.log('clearing cache');
        client.flushdb();
    }
};

// cacheService.clear();
module.exports = cacheService;