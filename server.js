const express = require('express');
const compression = require('compression');
const mysql      = require('mysql');
const bodyParser = require("body-parser"); // Body parser for fetch posted data
const async = require("async");


const CONTEXT = '/APMIS';
const PORT = 4000;

const app = express();


app.use(compression());
app.use(require('cors')());
app.use(bodyParser.json()); // Body parser use JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(PORT,'localhost', () =>
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
);

var db_config = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'apmis'
 }
 


  function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
handleDisconnect();

app.get('/getCommodity',  function(req,res){ 
connection.query(`
SELECT * FROM commodity inner join price on commodity.id = price.commodity_id group by commodity.name`, function (error, results) {
	if (error) throw error;
	res.json(results); 
  });
});

app.get('/getWeekly',  function(req,res){ 
	connection.query(`
	SELECT * FROM commodity inner join weekly on commodity.id = weekly.commodity_id`, function (error, results) {
		if (error) throw error;
		res.json(results); 
	  });
	});

app.post('/addWeekly',function(req,res){
	console.log(req.body.item)
	connection.query('INSERT INTO weekly  SET ? ON DUPLICATE KEY UPDATE ?', [req.body.item, req.body.item], function (error, results, fields) {
		if (error) throw error;
		res.json(results);
	});
});

app.post('/delWeekly',function(req,res){
    console.log(req.body.id)
    connection.query('DELETE from weekly where id = ?', [req.body.id], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/getSelected',  function(req,res){ 
	var query = "SELECT * from commodity where id=?";
	    var data = [req.body.id];
			query = mysql.format(query,data);
			console.log(query); 
		connection.query(query, function (error, results) {
			if (error) throw error;
			res.json(results); 
		  });
});

app.post('/getCommodity',  function(req,res){ 
	var query = "SELECT *, YEAR(date_surveyed) as year FROM price WHERE  commodity_id = ? ORDER by prov, area, date_surveyed DESC";
	    var data = [req.body.id];
			query = mysql.format(query,data);
			console.log(query); 
		connection.query(query, function (error, results) {
			if (error) throw error;
			res.json(results); 
		  });
});

app.post('/deleteData',  function(req,res){ 
	var query = "DELETE FROM `price` WHERE `price`.`id` = ?";
	    var data = [req.body.id];
			query = mysql.format(query,data);
			console.log(query); 
		connection.query(query, function (error, results) {
			if (error) throw error;
			res.json(results); 
		  });
});

app.post('/saveData',  function(req,res){ 
console.log(req.body);
var item = req.body.item;
	if(item.id!=null){
		var query = "UPDATE  price SET prov = ?,area = ? ,date_surveyed = ?,price = ?,high = ?,low = ? WHERE id = ?";
	    var data = [item.prov,item.area,item.date_surveyed,item.price,item.high,item.low,item.id];
	}else{
		var query = "INSERT INTO price (commodity_id, area, prov, price, high, low, date_surveyed)VALUES ( ?,?,?,?,?,?,?)";
	    var data = [item.comm_id,item.area,item.prov,item.price,item.high,item.low,item.date_surveyed];
	}
		query = mysql.format(query,data);
		console.log(query); 
		connection.query(query, function (error, results) {
			if (error) throw error;
			res.json(results); 
		  });
});

app.post('/monthlyReports', function(req, res){
	var query = "SELECT DISTINCT(commodity_id)  as commodity_id , name, category FROM price INNER JOIN commodity on price.commodity_id = commodity.id where MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ?";
	    var data = [req.body.month, req.body.year];
			query = mysql.format(query,data);
			console.log(query); 
		connection.query(query, function (error, results) {
			var itemsProcessed = 0;
			if (error) throw error;
					async.each(results, function(eachRow, callback){
				var data1 = [req.body.month, req.body.year, eachRow.commodity_id];
				async.parallel({
				bxu: function(callback) {
				var query1="SELECT price, high, low FROM price where area = 'Butuan City' and MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ? and commodity_id = ? LIMIT 1";
				 query1 = mysql.format(query1,data1); 
				 connection.query(query1, function (error, rows) {
					 if(rows) callback(null, rows[0]);
						else  callback(null, null);
			
				 });
					
			
				},
				cbr: function(callback) {
					
				var query1="SELECT price, high, low FROM price where area = 'Cabadbaran City' and MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ? and commodity_id = ? LIMIT 1";
				 query1 = mysql.format(query1,data1);
				 connection.query(query1, function (error, rows) {
						 if(rows) callback(null, rows[0]);
						else  callback(null, null);
			
				 });
				
				},
				sfr: function(callback) {
					
				var query1="SELECT price, high, low FROM price where area = 'San Francisco' and MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ? and commodity_id = ? LIMIT 1";
				 query1 = mysql.format(query1,data1);
				 connection.query(query1, function (error, rows) {
						 if(rows) callback(null, rows[0]);
						else  callback(null, null);
			
				 });
				
				},
				sjs: function(callback) {
					
				var query1="SELECT price, high, low FROM price where area = 'San Jose' and MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ? and commodity_id = ? LIMIT 1";
				 query1 = mysql.format(query1,data1);
				 connection.query(query1, function (error, rows) {
						 if(rows) callback(null, rows[0]);
						else  callback(null, null);
			
				 });
				
				},
				sur: function(callback) {
					
				var query1="SELECT price, high, low FROM price where area = 'Surigao City' and MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ? and commodity_id = ? LIMIT 1";
				 query1 = mysql.format(query1,data1);
				 connection.query(query1, function (error, rows) {
						 if(rows) callback(null, rows[0]);
						else  callback(null, null);
			
				 });
				
				},
				tan: function(callback) {
					
				var query1="SELECT price, high, low FROM price where area = 'Tandag City' and MONTH(date_surveyed) = ? and YEAR(date_surveyed) = ? and commodity_id = ? LIMIT 1";
				 query1 = mysql.format(query1,data1);
				 connection.query(query1, function (error, rows) {
						 if(rows) callback(null, rows[0]);
						else  callback(null, null);
			
				 });
				
				},
				}, function(err, resultsParallel) {
					eachRow.bxu = resultsParallel.bxu;
					eachRow.cbr = resultsParallel.cbr;
					eachRow.sfr = resultsParallel.sfr;
					eachRow.sjs = resultsParallel.sjs;
					eachRow.sur = resultsParallel.sur;
					eachRow.tan = resultsParallel.tan;
					
					itemsProcessed++;
					// console.log(eachRow);
					if(itemsProcessed === results.length) {
						res.json(results); 
					}
					
				});
				
			}, function(err) {
				if( err ) {
				  console.log(err);
				} else {
					// console.log(results);
					console.log('Each async is done!');
				}
			});
			// res.json(results); 
		  });	
})

app.post('/get3MosAgo',  function(req,res){ 
	var query = "SELECT * FROM price WHERE  commodity_id = ? && area = ? order by date_surveyed";
	    var data = [req.body.id, req.body.area];
			query = mysql.format(query,data);
			console.log(query); 
		connection.query(query, function (error, results) {
			var itemsProcessed = 0;
			if (error) throw error;
	
			
			async.each(results, function(eachRow, callback){
				var data1 = [eachRow.date_surveyed, eachRow.date_surveyed, req.body.area, req.body.id];
				async.parallel({
				get3mos: function(callback) {
				var query1="SELECT * FROM price WHERE MONTH(date_surveyed) =  Month(DATE_ADD(?, INTERVAL -3 MONTH)) && YEAR(date_surveyed) =  YEAR(DATE_ADD(?, INTERVAL -3 MONTH)) && area=? && commodity_id = ?  order by date_surveyed asc limit 1 ";
				
				 query1 = mysql.format(query1,data1);
				// console.log(query1); 
				 connection.query(query1, function (error, rows) {
					 if(rows[0] == undefined) callback(null, null);
					 else callback(null, rows[0].price);
			
				 });
					
			
				},
				get1mos: function(callback) {
					
					var query1="SELECT * FROM price WHERE MONTH(date_surveyed) =  Month(DATE_ADD(?, INTERVAL -1 MONTH)) && YEAR(date_surveyed) =  YEAR(DATE_ADD(?, INTERVAL -1 MONTH)) && area=? && commodity_id = ?  order by date_surveyed asc limit 1 ";
					query1 = mysql.format(query1,data1);
				// console.log(query1); 
				 connection.query(query1, function (error, rows) {
					if(rows[0] == undefined) callback(null, null);
					else callback(null, rows[0].price);
			
				 });
				
				},
				get12mos: function(callback) {
					
					var query1="SELECT * FROM price WHERE MONTH(date_surveyed) =  Month(DATE_ADD(?, INTERVAL -12 MONTH)) && YEAR(date_surveyed) =  YEAR(DATE_ADD(?, INTERVAL -12 MONTH)) && area=? && commodity_id = ?  order by date_surveyed asc limit 1 ";
					query1 = mysql.format(query1,data1);
				// console.log(query1); 
				 connection.query(query1, function (error, rows) {
					if(rows[0] == undefined) callback(null, null);
					else callback(null, rows[0].price);
			
				 });
				
				},
				}, function(err, resultsParallel) {
					eachRow.get3mos = resultsParallel.get3mos;
					eachRow.get1mos = resultsParallel.get1mos;
					eachRow.get12mos = resultsParallel.get12mos;
					itemsProcessed++;
					// console.log(eachRow);
					if(itemsProcessed === results.length) {
						res.json(results); 
					}
					
				});
				
			}, function(err) {
				if( err ) {
				  console.log(err);
				} else {
					// console.log(results);
					console.log('Each async is done!');
				}
			});
						
		
			
		
				
			
			
		  });
		  
});



  

