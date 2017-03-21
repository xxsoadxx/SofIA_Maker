
function MainCtrl() {

}

function SofiaCtrl($scope, $http) {
    console.log("SofIACtrl");

    var rs = new RiveScript();
    // Load our files from the brain/ folder.
    rs.loadFile([
        /*"../SofIA_Brain/lastversion.rive"*/
        "../SofIA_Brain/vars.rive",
        "../SofIA_Brain/arrays.rive",
        "../SofIA_Brain/questions.rive",
        "../SofIA_Brain/substitution.rive",
    ], on_load_success, on_load_error);
    function on_load_success() {
        rs.sortReplies();
        var data = rs.deparse();
        $scope.botdata = data;

    }
    function on_load_error(err) {
        console.log("Loading error: " + err);
    }
    $scope.msginput = "";
    $scope.intents = [];
    $scope.showvar = false;
    $scope.showarray = false;
    $scope.analizar = false;
    $scope.formData = [];
    $scope.intentForm = [];
    $scope.formData.text = "";
    $scope.formData.respuesta = "Unknown";
    $scope.varForm = [];
    $scope.varForm.name = "";
    $scope.varForm.value = "";
    $scope.intentForm.intent = "";
    $scope.intentForm.component = "";
    $scope.intentForm.components = [];

    $scope.sendmsg = function () {
        
        var string = '<div class="left"><div class="chat-message active">'+$scope.msginput+'</div></div>';
        $('.chatcontent').append(string);
       
        var result = rs.reply("user", $scope.msginput);
        $scope.msginput = "";
        var string = '<div class="right"><div class="chat-message" style="background-color: #efefef">'+result+'</div></div>';
        $('.chatcontent').append(string);
    }

    $scope.delete = function (parm) {
        console.log("delete");

        for (var x in $scope.intentForm.components) {
            if ($scope.intentForm.components[x] === parm) {
                $scope.intentForm.components.splice(x, 1);
            }
        }


        if ($scope.intentForm.component !== "" && existe == false) {
            $scope.intentForm.components.push($scope.intentForm.component);
        }
    }

    $scope.add = function () {
        console.log("add");
        var existe = false;
        for (var x in $scope.intentForm.components) {
            if ($scope.intentForm.components[x] === $scope.intentForm.component) {
                existe = true;
            }
        }


        if ($scope.intentForm.component !== "" && existe == false) {

            $scope.intentForm.components.push($scope.intentForm.component);
            $scope.intentForm.component = "";
        }
    }
    $scope.variable = function () {
        if ($scope.varForm.name !== "" && $scope.varForm.value !== "") {

    
                var variab = '! var ' + $scope.varForm.name + ' = ' + $scope.varForm.value;
                $scope.botdata.begin.var[$scope.varForm.name]=$scope.varForm.value;

                rs.stream(variab);
                $('#resultvar').text(variab);
                $scope.varForm.name = "";
                $scope.varForm.value = "";
                $scope.showvar = true;
                
          

        }
    }

    $scope.intent = function () {
        if ($scope.intentForm.intent !== "" && $scope.intentForm.components.length > 0) {

            var array = '! array ' + $scope.intentForm.intent + ' = ';
            for (var x = 0; x < $scope.intentForm.components.length; x++) {

                var len = $scope.intentForm.components.length - 1;
                if (x === len) {
                    array = array + $scope.intentForm.components[x] + '\n'
                } else {
                    array = array + $scope.intentForm.components[x] + '|'
                }


            }
            console.log(array);
            rs.stream(array);
            $scope.showarray = true;
            $('#resultarray').text(array);
            

        
            $scope.botdata.begin.array[$scope.intentForm.intent] = $scope.intentForm.components;
            $scope.intentForm.components = [];
            $scope.intentForm.intent = "";
            $scope.intentForm.component = "";
        }
    }

    $scope.process = function () {
        var selected = [];
        $('#detected input:checked').each(function () {
            selected.push($(this).attr('id'));
        });
        console.log(selected);
        if(selected.length > 0){
        count = 0;
        $scope.permutresult = "";
        permute(selected, function () {
            var string = "";
            string = "+ [*] ";
            for (element in this) {
                string = string + '(@' + this[element] + ") [*] ";
            }
            string = string.replace(/ +$/, '\n');
            string = string + "- <bot " + $scope.formData.respuesta + ">\n\n"
            console.log(string.length);

            //console.log(string); 
            rs.stream(string);
            $scope.permutresult = $scope.permutresult + string;
            count++;
        });
        console.log($scope.permutresult);

        $scope.processed = true;
        $('#result').text($scope.permutresult);
        
        console.log('There have been ' + count + ' permutations');
        }else{
            $scope.processed = true;
            $('#result').text("Seleccione intentos");
        }

    }
    $scope.loadarray = function (key,value) {
        $scope.intentForm.intent = key;
        $scope.intentForm.components = value;
    }
    $scope.loadvar = function (key,value) {
        $scope.varForm.name = key;
        $scope.varForm.value = value;
    }
    $scope.download = function () {
        var data = rs.deparse();
        var text = rs.stringify(data);
        download("last_version.rive", text);

    }
    $scope.analize = function () {

        $scope.intents = [];


        $scope.processed = false;
        $scope.formData.auxtext = $scope.formData.text;
        var result = rs.reply("user", $scope.formData.text);
        console.log(result);
        $scope.intents = [];

        console.log("entro");
        $scope.analizar = true;


        for (var variable in $scope.botdata.begin.var) {

            var consola = result.includes($scope.botdata.begin.var[variable]);
            console.log(consola);
            if (consola === true) {
                console.log(variable);
                $('#resp').val(variable);

            }
        }

        for (var name in $scope.botdata.begin.array) {

            var value = $scope.botdata.begin.array[name];

            var match2 = false;
            color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
            for (var key in value) {

                var aux = ' ' + $scope.formData.text + ' ';
                if (aux.indexOf(' '+value[key]) != -1) {
                    var match2 = true;

                    $scope.formData.auxtext = $scope.formData.auxtext.replace(value[key], '<span style="color: ' + color + '">' + value[key] + '</span>');
                }


            }

            if (match2) {
                console.log(name);
                $scope.intents.push({ "name": name, "color": color });
            }
        }

        console.log('<h2>' + $scope.formData.auxtext + '</h2>');
        $('#text').html('<h2>' + $scope.formData.auxtext + '</h2>');


    }
};

/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .controller('SofiaCtrl', SofiaCtrl)
    .controller('MainCtrl', MainCtrl)


// noprotect
function swap(arr, a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

function factorial(n) {
    var val = 1;
    for (var i = 1; i < n; i++) {
        val *= i;
    }
    return val;
}


function permute(perm, func) {
    var total = factorial(perm.length);

    for (var j = 0, i = 0, inc = 1; j < total; j++ , inc *= -1, i += inc) {

        for (; i < perm.length - 1 && i >= 0; i += inc) {
            func.call(perm);
            swap(perm, i, i + 1);
        }

        func.call(perm);

        if (inc === 1) {
            swap(perm, 0, 1);
        } else {
            swap(perm, perm.length - 1, perm.length - 2);
        }
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}



