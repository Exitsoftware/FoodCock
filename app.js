var express = require('express');
var request = require('request');
// HTML Node js parser
var cheerio = require('cheerio');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


console.log('Server Start');


var d = new Date();
var month = d.getMonth();
var date = d.getDate();
var year = d.getFullYear();
console.log(year);
var place = 255;





app.get('/test',function(req, page_res){
    console.log(req.query);
    
    var place = req.query.placeCode;
    console.log(place);
    var url = 'http://www.hanyang.ac.kr/web/www/-'+place+'?p_p_id=foodView_WAR_foodportlet&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=2&_foodView_WAR_foodportlet_sFoodDateDay='+date+'&_foodView_WAR_foodportlet_sFoodDateYear='+year+'&_foodView_WAR_foodportlet_action=view&_foodView_WAR_foodportlet_sFoodDateMonth='+month;
    
    console.log(url);
    
    var sendData = {};
    request.get(url, function(err, res, next){
        if(err) console.log(err);
        else{

            var $ = cheerio.load(res.body);
            var place = $('.sub-head').children('h3').text();
            var list = $('.d-title2');
            var type = $('.thumbnails');
            var day = $('.day-selc');
            day = day.text().replace(/\t/gi,'').replace(/\r/gi,'').split('\n');
            day = day[2]+' '+day[3];
            console.log(day);
            console.log(place);
            
            sendData.place = place;
            sendData.day = day;
            sendData.data = [];

            for(var i = 0; i < type.length; i++){
                var title = $(list[i]).text();

                sendData.data.push({});
                var currentData = sendData.data[i];
                currentData.type = title;
                currentData.menus = [];

                var element = $(type[i]).children('.span3').children('.thumbnail');;
                for(var j = 0; j < element.length; j++){

                    var set = {};
                    var temp = $(element[j])
                    var menu = temp.children('h3').text();
                    var price = temp.children('.price').text();
                    set.menu = menu;
                    set.price = price;
                    console.log(set);
                    currentData.menus.push(set);
                }  
            }

        }
        console.log(sendData);
        page_res.send(sendData);
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
