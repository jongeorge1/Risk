var localStorageDB = (function () {

    var db = null,
    loadedCallback = null;

    function initDb(callback) {
        loadedCallback = callback;
        try {
            if (window.openDatabase) {
                db = openDb();

                // check if first run and we need to initialise tables
                initTables();

                if (db) {
                    db.transaction(function (tx) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS HealthcareProfessionals (Id unique, Title, FirstName, Surname, PracticeName, Telephone, Street, Town)', [], function (tx, result) {
                            // TODO remove before going live
                            var ticks = createId();
                            tx.executeSql('INSERT INTO HealthcareProfessionals (Id, Title, FirstName, Surname, PracticeName, Telephone, Street, Town) VALUES (?,?,?,?,?,?,?,?)', [ticks, 'Dr', 'Mark', 'Short', 'Techno House Surgery', '09123 674738', 'Windy Lane', 'Letchworth']);
                        });
                    });
                }
            } else {
                steal.dev.log('Web Databases not supported');
            }
        } catch (e) {
            steal.dev.log('error occurred during DB init, Web Database supported?');
        }
    }

    function getRows(sql) {
        db = openDb();
        var dfrd = $.Deferred();
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                function (tx1, result) {
                    steal.dev.log('select succeeded');
                    steal.dev.log(result);
                    dfrd.resolve(result.rows);
                },
                function (tx1, error) {
                    logError(error, sql);
                }
        );
        });

        return dfrd.promise();
    }

    function getSingleRow(sql) {
        db = openDb();
        var dfrd = $.Deferred();
        db.transaction(function (tx) {
            tx.executeSql(sql, [],
                function (tx1, result) {
                    steal.dev.log('select succeeded');
                    steal.dev.log(result);
                    dfrd.resolve(result.rows.item(0));
                },
                function (tx1, error) {
                    logError(error, sql);
                }
        );
        });

        return dfrd.promise();
    }

    function openDb() {
        return openDatabase("zoladexDB", "1.0", "Zoladex Mobile App", 200000);
    }

    function createId() {
        var date = new Date();
        return date.getTime();
    }

    function logError(error, sql) {
        steal.dev.log('Transaction with the device database failed - ' + error.message + '\nOffending SQL:\n"' + sql + "'");
    }

    function addHcp(hcp, success, error) {

        db = openDb();

        var ticks = createId();

        var deferred = $.Deferred();

        db.transaction(function (tx) {

            var sql = "INSERT INTO HealthcareProfessionals (Id, Title, FirstName, Surname, PracticeName, Telephone, Street, Town) VALUES (" + ticks + ", '" + hcp.title + "','" + hcp.firstname + "', '" + hcp.surname + "', '" + hcp.practicename + "', '" + hcp.tel + "', '" + hcp.street + "', '" + hcp.town + "')";

            steal.dev.log(sql);

            tx.executeSql(
                sql,
                [],
                function () {
                    steal.dev.log("Insert succeeded!");
                    deferred.resolve(ticks);
                },
                function (tx1, error) {
                    logError(error, sql);
                    deferred.resolve(0);
                }
            );


            return deferred.promise();
        });

        // wire up callbacks to defered
        deferred.then(success);
        deferred.fail(error);
    }

    function updateHcp(hcp, success, error) {

        var deferred = $.Deferred();

        db.transaction(function (tx) {

            var sql = "UPDATE HealthcareProfessionals SET Title= '" + hcp.Title + "', FirstName='" + hcp.FirstName + "', Surname='" + hcp.Surname + "', PracticeName='" + hcp.PracticeName + "', Telephone = '" + hcp.Telephone + "', Street='" + hcp.Street + "', Town='" + hcp.Town + "' WHERE Id=" + hcp.id;

            tx.executeSql(
                sql,
                [],
                function () {
                    steal.dev.log("Update succeeded!");
                    deferred.resolve(true);
                },
                function (tx1, error) {
                    logError(error, sql);
                    deferred.resolve(false);
                }
            );
        });

        // wire up callbacks to defered
        deferred.then(success);
        deferred.fail(error);
    }

    function initTables() {
        // check if tables exist otherwise create and fill
        checkTableExists("HealthcareLocations", function (tx) {
            // create table for storing Practices/Hospitals
            tx.executeSql('CREATE TABLE IF NOT EXISTS HealthcareLocations (Id unique, Name)'); //TODO add lots more fields later
        });

        checkTableExists("ApointmentTypes", function (tx) {
            // create table
            tx.executeSql('CREATE TABLE IF NOT EXISTS ApointmentTypes (Id unique, Name)', [], function (tx, result) {
                // populate
                tx.executeSql('INSERT INTO ApointmentTypes (Id, Name) VALUES (1,"PSA test")');
                tx.executeSql('INSERT INTO ApointmentTypes (Id, Name) VALUES (2,"Follow up")');
                tx.executeSql('INSERT INTO ApointmentTypes (Id, Name) VALUES (3,"Zoladex injection")');
                tx.executeSql('INSERT INTO ApointmentTypes (Id, Name) VALUES (4,"Surgery")');
                tx.executeSql('INSERT INTO ApointmentTypes (Id, Name) VALUES (5,"Chemotherapy")');
                tx.executeSql('INSERT INTO ApointmentTypes (Id, Name) VALUES (6,"Radiotherapy")');
            });
        });

        checkTableExists("PatientSymptoms", function (tx) {
            // create table
            tx.executeSql('CREATE TABLE IF NOT EXISTS PatientSymptoms (Id unique, Date, Time, SymptomId, WarningSign)', [], function (tx, result) {
                // populate
                var currentDate = new Date();
                tx.executeSql('INSERT INTO PatientSymptoms (Id, Date, Time, SymptomId, WarningSign) VALUES (1,"' + currentDate + '", ' + currentDate.getTime() + ', 1, "true")');
                tx.executeSql('INSERT INTO PatientSymptoms (Id, Date, Time, SymptomId, WarningSign) VALUES (2,"' + currentDate + '", ' + currentDate.getTime() + ', 1, "true")');
                tx.executeSql('INSERT INTO PatientSymptoms (Id, Date, Time, SymptomId, WarningSign) VALUES (3,"' + currentDate + '", ' + currentDate.getTime() + ', 1, "true")');
                tx.executeSql('INSERT INTO PatientSymptoms (Id, Date, Time, SymptomId, WarningSign) VALUES (4,"' + currentDate + '", ' + currentDate.getTime() + ', 1, "true")');
            });
        });

        checkTableExists("Symptoms", function (tx) {
            // create table
            tx.executeSql('CREATE TABLE IF NOT EXISTS Symptoms (Id unique, Description, WarningSign)', [], function (tx, result) {
                
                // populate
                tx.executeSql('INSERT INTO Symptoms (Id, Description, WarningSign) VALUES (1, "Pain in lower Back", "true")');
                tx.executeSql('INSERT INTO Symptoms (Id, Description, WarningSign) VALUES (2, "Pain in lower Back", "true")');
                tx.executeSql('INSERT INTO Symptoms (Id, Description, WarningSign) VALUES (3, "Pain in lower Back", "true")');
                tx.executeSql('INSERT INTO Symptoms (Id, Description, WarningSign) VALUES (4, "Pain in lower Back", "true")');
                
            });
        });
    }

    // checks if a table exists in the database and if not calls the callback
    function checkTableExists(tablename, doesntexistcallback) {
        if (db) {
            db.transaction(function (tx) {
                tx.executeSql('select DISTINCT tbl_name from sqlite_master where tbl_name = "' + tablename + '"', [], function (tx, result) {
                    if (!result.rows.length) {
                        doesntexistcallback(tx);
                    }
                });
            });
        }
    }

    function deleteHcp(id, success, error) {

        var deferred = $.Deferred();

        db.transaction(function (tx) {

            var sql = "DELETE FROM HealthcareProfessionals WHERE Id= " + id;

            tx.executeSql(
                sql,
                [],
                function () {
                    steal.dev.log("Delete succeeded!");
                    deferred.resolve(true);
                },
                function (tx1, error) {
                    logError(error, sql);
                    deferred.resolve(false);
                }
            );
        });

        // wire up callbacks to defered
        deferred.then(success);
        deferred.fail(error);
    }

    return {
        init: initDb,
        getRows: getRows,
        getSingleRow: getSingleRow,
        addHcp: addHcp,
        updateHcp: updateHcp,
        deleteHcp: deleteHcp
    };
})();


