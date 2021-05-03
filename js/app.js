var app = new function () {
    this.url = '';
    this.method = 'GET';
    this.headers = [];
    this.payload = {};
    this.response = {};
    this.error = {};
    
    // Json visor
    this.jsonViewer = new JSONViewer();
    document.getElementById("iBodyFormated").appendChild(this.jsonViewer.getContainer());
	
    this.jsonViewerH = new JSONViewer();
    document.getElementById("iRHeaderFormated").appendChild(this.jsonViewerH.getContainer());

    // Metodo generico para reutilizar llamada
    this.httpService = function (callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(this.method, this.url.trim(), true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response, xhr);
            } else {
                callback(status, xhr.response, xhr);
            }
        };
        xhr.onerror = function (e) {
            callback(e.target.status, null, e.target);
        };
        xhr.send(this.payload);
    };

    // Hacemos la llamada para obtener las respuesta
    this.doRequest = function () {
        that = this; // Guardamos scope
        showLoading(true);
        this.httpService(function (err, data, xhr) {
            showLoading(false);
            that.response = data;
            that.error = err;
            console.log(err, data);
            that.processResponse(err, data, xhr);
        });
    };

    this.getUserInput = function () {
        this.url = document.getElementById("iUrl").value || '';
        this.method = document.getElementById("iMethod").value || 'GET';
        this.headers = document.getElementById("iHeaders").value || [];
        this.payload = document.getElementById("iPayload").value || {};
        if (this.url !== '') this.doRequest();
    };

    this.processResponse = function (err, data, xhr) {
        console.log(xhr);
        that = this; // Guardamos scope
        if(xhr && xhr.status) document.getElementById("iStatus").innerHTML = xhr.status;
        if(xhr && xhr.status === 0) document.getElementById("iStatus").innerHTML = xhr.status;
	if(xhr && && xhr.status > 0 && isJSON(getResponseHeaderMap(xhr))) that.jsonViewerH.showJSON(getResponseHeaderMap(xhr));
        if(xhr && xhr.response) document.getElementById("iBody").innerHTML = JSON.stringify(xhr.response, undefined, 4);
        if(xhr && xhr.response && isJSON(xhr.response)) that.jsonViewer.showJSON(xhr.response);
    }

    this.onAbrirPopUp = function (item) {
        MostrarEditar();
        // Configuramos los botones
        document.getElementById("iBtnModificar").setAttribute("onclick", 'app.Modificar(' + this.materias[item].id + ',' + item + ')');
        document.getElementById("iBtnEliminar").setAttribute("onclick", 'app.Borrar(' + this.materias[item].id + ',' + item + ')');

        // Setemaos los datos de la materia
        document.getElementById("iNombre").value = this.materias[item].nombre;

        var select = document.getElementById("iCuatrimestre");
        select.options[this.materias[item].cuatrimestre].selected = true;

        document.getElementById("iCuatrimestre").disabled = true;
        document.getElementById("iMañana").checked = (this.materias[item].turno === 'Mañana');
        document.getElementById("iNoche").checked = (this.materias[item].turno === 'Noche');
        document.getElementById("iFecha").value = DateToHTMLFormat(StringToDate(this.materias[item].fechaFinal));
    }
}
// Inicializamos
//app.init();

function cleanInputs() {
    document.getElementById('spoiler').style.display = 'none';
}

function showLoading(bool) {
    if (bool) {
        document.getElementById('iAction').classList.add("d-none");
        document.getElementById('iAction').classList.remove("d-block");
        document.getElementById('iLoading').classList.remove("d-none");
        document.getElementById('iLoading').classList.add("d-block");
    } else {
        document.getElementById('iAction').classList.add("d-block");
        document.getElementById('iAction').classList.remove("d-none");
        document.getElementById('iLoading').classList.remove("d-block");
        document.getElementById('iLoading').classList.add("d-none");
    }
}

function isJSON(str){
    try {
        const strJSON = JSON.stringify(str);
        const json = JSON.parse(strJSON);
        if(typeof(str) == 'string')
            if(str.length == 0)
                return false;
    }
    catch(e){
        return false;
    }
    return true;
}

function getResponseHeaderMap(xhr) {
  const headers = {};
  xhr.getAllResponseHeaders()
      .trim()
      .split(/[\r\n]+/)
      .map(value => value.split(/: /))
      .forEach(keyValue => {
        headers[keyValue[0].trim()] = keyValue[1].trim();
      });
  return headers;
}
