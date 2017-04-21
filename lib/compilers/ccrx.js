var Compile = require('../base-compiler');
var exec = require('../exec');


function compileCcrx(info, env) {
    var compiler = new Compile(info, env);
    compiler.compiler.supportsIntel = false;
    compiler.optionsForFilter = function (filters, outputFilename) {
        var options = ['-output=src=' + this.filename(outputFilename)];
        return options;
    };
    if (process.platform == "linux") {
        var wine = "wine";
        var origExec = compiler.exec;
        compiler.exec = function (command, args, options) {
            if (command.toLowerCase().endsWith(".exe")) {
                args.unshift(command);
                command = wine;
                return exec.execute("wine", args)
            }
            return origExec(command, args, options)
            
        };
        compiler.filename = function (fn) {
            return 'Z:' + fn;
        };
    }

    return compiler.initialise();
}

module.exports = compileCcrx;
