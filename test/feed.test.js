var request = require('supertest');
var should = require('should'); 
var app = require('../app').app;

var MongoClient = require('mongodb').MongoClient;
var BSON = require('mongodb').BSONPure;

var uri = 'mongodb://localhost:27017/pescadorescolombiadbtest';


describe('Feed', function(){

	before(function(done) {
    	MongoClient.connect(uri, function(err, db) {
		    db.collection("feeds").insert(feeds, function(err, db) {
		    	done();
		    });
		    
		});
  	});

  	after(function (done) {
  		MongoClient.connect(uri, function(err, db) {
		    db.collection("feeds").remove({}, function(err, db) {
		    	done();
		    });
		    
		});
	});

	describe('#GET /feed', function(done){
		it('should return code 200', function(done){
			request(app)
		    	.get('/feed')
		    	.expect(200)
		    	.end(function(err, res){
		    		if (err) return done(err);
					done();
			    });
		});
		it('should return a Content-Type application/json', function(done){
			request(app)
		    	.get('/feed')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
					done();
			    });
		});
		it('should return a json array', function(done){
			request(app)
		    	.get('/feed')
		    	.expect(300)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		should.not.exist(err);
		    		should.exist(res);
		    		res.body.should.be.an.Array.and.an.Object;
		    		res.body.should.have.length(2);
			        done()
			    });
		});
		it('should return all feeds', function(done){
			request(app)
		    	.get('/feed')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.should.have.length(2);
			        done()
			    });
		})
		it('should return likedByUser as true if a given user liked a feed', function(done){
			request(app)
		    	.get('/feed?userid=10152666156158057')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.forEach(function(feed) {
					    feed.likedByUser.should.be.true;
					});
					done();
			    });
		});
		it('should return likedByUser as false if a given user did not like a feed', function(done){
			request(app)
		    	.get('/feed?userid=10152666156158060')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.forEach(function(feed) {
					    feed.likedByUser.should.be.false;
					});
					done();
			    });
		});
		it('should return likedByUser as true/false if a given user liked/did not like feeds', function(done){
			request(app)
		    	.get('/feed?userid=10152666156158058')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.forEach(function(feed) {
		    			if(feed._id == '54412000f8d9b3020084c224')
		    				feed.likedByUser.should.be.true;
		    			else
		    				feed.likedByUser.should.be.false;
					});
					done();
			    });
		});
  	});
  	
  	describe('#GET /feed/:id', function(){
  		it('should return code 200', function(done){
			request(app)
		    	.get('/feed/54412000f8d9b3020084c223')
		    	.expect(200)
		    	.end(function(err, res){
		    		if (err) return done(err);
					done();
			    });
		});
		it('should return a Content-Type application/json', function(done){
			request(app)
		    	.get('/feed/54412000f8d9b3020084c223')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
					done();
			    });
		});
		it('should return a correct json objetc', function(done){
			request(app)
		    	.get('/feed/54412000f8d9b3020084c223')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		should.not.exist(err);
		    		should.exist(res);
		    		res.body.should.be.an.Object;

		    		should.exist(res.body._id);
		    		should.exist(res.body.from);
		    		res.body.from.should.be.an.Object;
		    		should.exist(res.body.from.name);
		    		should.exist(res.body.from.facebookid);
		    		should.exist(res.body.message);
		    		should.exist(res.body.lastModified);
		    		should.exist(res.body.created_time);
		    		should.exist(res.body.likedByUser);
					done();
			    });
		});
		it('should return a feed with a given id', function(done){
			request(app)
		    	.get('/feed/54412000f8d9b3020084c223')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		should.not.exist(err);
		    		should.exist(res);
		    		res.body.should.be.an.Object;

		    		res.body._id.should.equal('54412000f8d9b3020084c223');
		    		res.body.from.name.should.equal('Jonathan Diosa');
		    		res.body.from.facebookid.should.equal('10152666156158057');
		    		res.body.message.should.equal('Me voy de pesca');
		    		res.body.lastModified.should.equal('2014-10-17T13:56:11.601Z');
		    		res.body.created_time.should.equal('2014-10-17T13:56:11.601Z');
					done();
			    });
		});
		it('should return likedByUser as true if a given user liked the feed', function(done){
			request(app)
		    	.get('/feed/54412000f8d9b3020084c223?userid=10152666156158057')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.likedByUser.should.be.true;
					done();
			    });
		});
		it('should return likedByUser as false if a given user did not like the feed', function(done){
			request(app)
		    	.get('/feed/54412000f8d9b3020084c223?userid=10152666156158058')
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.likedByUser.should.be.false;
					done();
			    });
		});

  	});
	

  	describe('#POST /feed', function(){
  		it('should return code 200', function(done){
			request(app)
		    	.post('/feed')
		    	.send(newfeed)
		    	.expect(200)
		    	.end(function(err, res){
		    		if (err) return done(err);
					done();
			    });
		});
		it('should return a Content-Type application/json', function(done){
			request(app)
		    	.post('/feed')
		    	.send(newfeed)
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
					done();
			    });
		});
		it('should return a correct json objetc', function(done){
			request(app)
		    	.post('/feed')
		    	.send(newfeed)
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.should.be.an.Object;
		    		should.exist(res.body._id);
		    		should.exist(res.body.from);
		    		res.body.from.should.be.an.Object;
		    		should.exist(res.body.from.name);
		    		should.exist(res.body.from.facebookid);
		    		should.exist(res.body.message);
		    		should.exist(res.body.lastModified);
		    		should.exist(res.body.created_time);
					done();
			    });
		});
		it('should return a json objetc with same information entered', function(done){
			request(app)
		    	.post('/feed')
		    	.send(newfeed)
		    	.expect(200)
		    	.expect('Content-Type', /json/)
		    	.end(function(err, res){
		    		if (err) return done(err);
		    		res.body.from.name.should.equal('Jonathan Diosa');
		    		res.body.from.facebookid.should.equal('10152666156158057');
		    		res.body.message.should.equal('Me voy para el penol');
					done();
			    });
		});
  	}) 
});

var feeds = [
				{
				    from: {
				        name: "Jonathan Diosa",
				        facebookid: "10152666156158057"
				    },
				    message: "Me voy de pesca",
				    lastModified: "2014-10-17T13:56:11.601Z",
				    created_time: "2014-10-17T13:56:11.601Z",
				    _id: new BSON.ObjectID('54412000f8d9b3020084c223'),
				    like: [
				        {
				            from: {
				                name: "Jonathan Diosa",
				                facebookid: "10152666156158057"
				            }
				        }
				    ],
				    likes: 1
				},
				{
				    from: {
				        name: "Jose Diosa",
				        facebookid: "10152666156158058"
				    },
				    message: "Me voy para los llanos",
				    lastModified: "2014-10-17T13:56:11.601Z",
				    created_time: "2014-10-17T13:56:11.601Z",
				    _id: new BSON.ObjectID('54412000f8d9b3020084c224'),
				    like: [
				        {
				            from: {
				                name: "Jonathan Diosa",
				                facebookid: "10152666156158057"
				            }
				        },
				        {
				            from: {
				                name: "Jose Diosa",
				                facebookid: "10152666156158058"
				            }
				        }
				    ],
				    likes: 1
				}
			];

var newfeed = 
				{
				    from: {
				        name: "Jonathan Diosa",
				        facebookid: "10152666156158057"
				    },
				    message: "Me voy para el penol",				    
				};