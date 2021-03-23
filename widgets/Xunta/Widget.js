define(['dojo/_base/declare', 'jimu/BaseWidget', "esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/lang", "esri/SpatialReference", "esri/graphic", "esri/symbols/SimpleFillSymbol"], function (declare, BaseWidget, Query, QueryTask, lang, SpatialReference, Graphic, SimpleFillSymbol) {

  return declare([BaseWidget], {

    baseClass: 'xunta',

    cargaConcellos: function cargaConcellos() {
      var codigoProvincia = this.selectProvincias.value;
      if (codigoProvincia === -1) return;

      this.selectConcellos.innerHTML = '';

      var queryTask = new QueryTask(this.config.concellosService);

      var query = new Query();
      query.returnGeometry = false;
      query.outFields = ["CODCONC", "CONCELLO"];
      query.orderByFields = ["CONCELLO"];
      query.where = "CODPROV = " + codigoProvincia;

      queryTask.execute(query, lang.hitch(this, function (results) {
        var opt = document.createElement('option');
        opt.value = -1;
        opt.text = "Seleccione concello";
        this.selectConcellos.add(opt);
        for (var i = 0; i < results.features.length; i++) {
          opt = document.createElement('option');
          opt.value = results.features[i].attributes.CODCONC;
          opt.text = results.features[i].attributes.CONCELLO;
          this.selectConcellos.add(opt);
        }
      }));
    },
    cargaParroquias: function cargaParroquias() {
      var codigoParroquia = this.selectConcellos.value;
      if (codigoParroquia === -1) return;
      this.selectParroquias.innerHTML = '';

      var queryTask = new QueryTask(this.config.parroquiasService);
      var query = new Query();
      query.returnGeometry = false;
      query.outFields = ["CODPARRO", "PARROQUIA"];
      query.orderByFields = ["PARROQUIA"];
      query.where = "CODCONC = " + codigoParroquia;

      queryTask.execute(query, lang.hitch(this, function (results) {
        var opt = document.createElement('option');
        opt.value = -1;
        opt.text = "Seleccione parroquia";
        this.selectParroquias.add(opt);
        for (var i = 0; i < results.features.length; i++) {
          opt = document.createElement('option');
          opt.value = results.features[i].attributes.CODPARRO;
          opt.text = results.features[i].attributes.PARROQUIA;
          this.selectParroquias.add(opt);
        }
      }));
    },
    zoomConcello: function zoomConcello() {
      var codigoConcello = this.selectConcellos.value;
      if (codigoConcello === -1) return;

      var queryTask = new QueryTask(this.config.concellosService);
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = ["CODCONC", "CONCELLO"];
      query.orderByFields = ["CONCELLO"];
      query.where = "CODCONC = " + codigoConcello;
      query.outSpatialReference = new SpatialReference(102100);

      queryTask.execute(query, lang.hitch(this, function (results) {
        if (results.features.length > 0) {
          console.log('results zoomConcello', results);
          var geom = results.features[0].geometry;
          this.map.graphics.clear();
          this.map.graphics.add(new Graphic(geom, new SimpleFillSymbol()));
          this.map.setExtent(geom.getExtent(), true);
        }
      }));
    },
    zoomParroquia: function zoomParroquia() {
      var codigoParroquia = this.selectParroquias.value;
      if (codigoParroquia === -1) return;

      console.log('codigoParroquia', codigoParroquia);
      var queryTask = new QueryTask(this.config.parroquiasService);
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = ["CODPARRO", "PARROQUIA"];
      query.orderByFields = ["PARROQUIA"];
      query.where = "CODPARRO = " + codigoParroquia;
      query.outSpatialReference = new SpatialReference(102100);

      queryTask.execute(query, lang.hitch(this, function (results) {
        console.log('results zoomParroquia', results);
        if (results.features.length > 0) {
          var geom = results.features[0].geometry;
          this.map.graphics.clear();
          this.map.graphics.add(new Graphic(geom, new SimpleFillSymbol()));
          this.map.setExtent(geom.getExtent(), true);
        }
      }));
    }
  });
});
//# sourceMappingURL=Widget.js.map
