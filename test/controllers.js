var app = require('../bin/www');
var request = require('supertest');
var Routes = require('../models/routes');

describe('Controller Tests:', function(){
	
	before(function(){
		return Routes.remove({}, {multi:true})
	});
	
	describe('Get all user routes', function(){
		it('should return empty routes', function(done){
			request(app)
		    	.get('/user-routes')
		    	.set('Accept', 'application/json')
		    	.expect('Content-Type', /json/)
		    	.expect(200)
		    	.end(function(err,res){
		    		if(err){ return done(err); }
		    		res.body.length.should.be.exactly(0);
		    		done();
		    	});
		});
	});
	
	var newRoute;
	describe('Create new user route', function(){
		it('should create one user route', function(done){
			request(app)
	    	.post('/user-routes')
	    	.send({method: "GET", params: [], path: "/coches/marcas",
	    		   response:{code:"200",type:"application/json",data:'[{"marca":"Ford"},{"marca":"Renault"}]'}})
	    	.set('Accept', 'application/json')
	    	.expect('Content-Type', /json/)
	    	.expect(201)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		newRoute = res.body;
	    		res.body._id.should.not.be.empty;
	    		done();
	    	});
		});
	});
	
	describe('Invoke the new user route', function(){
		it('should return json: [{"marca":"Ford"},{"marca":"Renault"}]', function(done){
			request(app)
	    	.get(newRoute.path)
	    	.set('Accept', 'application/json')
	    	.expect('Content-Type', /json/)
	    	.expect(200)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		res.body.length.should.be.exactly(2)
	    		done();
	    	});
		});
		it('with params also should return json: [{"marca":"Ford"},{"marca":"Renault"}]', function(done){
			request(app)
	    	.get(newRoute.path+'?param=1234')
	    	.set('Accept', 'application/json')
	    	.expect('Content-Type', /json/)
	    	.expect(200)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		res.body.length.should.be.exactly(2)
	    		done();
	    	});
		});
	});
	
	describe('Modify the previously created user route', function(){
		it('should modify the existing user route', function(done){
			newRoute.response.data = '[{"marca":"Chrysler"},{"marca":"Volvo"}]';
			newRoute.params=[];
			newRoute.params[0]={key:"key1", value:"value1"}
			request(app)
	    	.put('/user-routes')
	    	.send(newRoute)
	    	.set('Accept', 'application/json')
	    	.expect(200)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		done();
	    	});
		});
	});
	
	describe('Invoke the modified user route', function(){
		it('without params should return 404', function(done){
			request(app)
	    	.get(newRoute.path)
	    	.set('Accept', 'application/json')
	    	.expect(404, done);
		});
		it('with params should return json: [{"marca":"Chrysler"},{"marca":"Volvo"}]', function(done){
			request(app)
	    	.get(newRoute.path+'?key1=value1')
	    	.set('Accept', 'application/json')
	    	.expect('Content-Type', /json/)
	    	.expect(200)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		res.body.length.should.be.exactly(2);
	    		res.body[0].marca.should.be.exactly("Chrysler");
	    		done();
	    	});
		});
		it('with incorrect params should return 404', function(done){
			request(app)
	    	.get(newRoute.path+'?key2=value2')
	    	.set('Accept', 'application/json')
	    	.expect(404,done)
		});
	});

	describe('Create new user POST route', function(){
		it('should create one POST user route', function(done){
			request(app)
	    	.post('/user-routes')
	    	.send({method: "POST", params: [], path: "/coches/marcas",
	    		   response:{code:"201",type:"application/json",data:'{"_id":"asdfasdf", "marca":"Ferrari"}'}})
	    	.set('Accept', 'application/json')
	    	.expect('Content-Type', /json/)
	    	.expect(201)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		newRoute = res.body;
	    		res.body._id.should.not.be.empty;
	    		done();
	    	});
		});
	});
	
	describe('Invoke the POST user route', function(){
		it('should return json: {"_id":"asdfasdf", "marca":"Ferrari"}', function(done){
			request(app)
	    	.post(newRoute.path)
	    	.set('Accept', 'application/json')
	    	.expect('Content-Type', /json/)
	    	.expect(201)
	    	.end(function(err,res){
	    		if(err){ return done(err); }
	    		console.log(res.body);
	    		res.body.marca.should.be.exactly("Ferrari")
	    		done();
	    	});
		});
	});
});