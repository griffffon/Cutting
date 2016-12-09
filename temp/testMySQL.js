/**
 * Created by gzelinskiy on 09.12.16.
 */
var executeQuery = require('../lib/mysql').executeQuery;

executeQuery('SELECT 1 + 1 AS solution', function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});

executeQuery('SELECT 2 + 2 AS solution', function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});

executeQuery('SELECT 3 + 3 AS solution', function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});

executeQuery('SELECT 4 + 4 AS solution', function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});