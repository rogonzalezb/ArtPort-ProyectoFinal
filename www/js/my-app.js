// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [{
      path: '/registro/',
      url: 'registro.html',
    },
    {
      path: '/ingresar/',
      url: 'ingresar.html',
    },
    {
      path: '/index/',
      url: 'index.html',
    },
    {
      path: '/inicio/',
      url: 'inicio.html',
    },
    {
      path: '/perf-personal-normal/',
      url: 'perf-personal-normal.html',
    },
    {
      path: '/perf-personal-artista/',
      url: 'perf-personal-artista.html',
    },
    {
      path: '/post-nuevo/',
      url: 'post-nuevo.html',
    },
    {
      path: '/buscar/',
      url: 'buscar.html',
    },
    {
      path: '/perf-ajeno/',
      url: 'perf-ajeno.html',
    },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');
var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();
var colUsuarios = db.collection("usuarios");
var colPostTexto = db.collection("postsTexto");
var colPostImagen = db.collection("postImagen");
var colUsuariosSeguidos = db.collection("usuariosSeguidos");
var colPostMixto = db.collection("postMixto");

var email = $$('#idOculto').text();
var idUsuario = "";

var tag = $$('#textTag').val();
var usuaAjeno = "";
var nombreBusc = "";
var usSeguidos = [];
var iconoAjeno = "";
var imgUrl = "";
var miIcono = "";
var iconoAj = "";


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function(e) {
  // Do something here when page loaded and initialized
  console.log(e);
})


// --------------------------------INDEX -------------------------------------------
$$(document).on('page:init', '.page[data-name="index"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');
  // app.toolbar.hide('#botToolbar');

  $$('#home').on('click', function() {
    mainView.router.navigate('/inicio/');
  })
  $$('#buscar').on('click', function() {
    mainView.router.navigate('/buscar/');
  })
  $$('#postNuevo').on('click', function() {
    mainView.router.navigate('/post-nuevo/');
  })

  $$('#aIngreso').on('click', function() {
    mainView.router.navigate('/ingresar/');
  })
  $$('#aRegistro').on('click', function() {
    mainView.router.navigate('/registro/');
  })



})


// ----------------------------------REGISTRO------------------------------------------
$$(document).on('page:init', '.page[data-name="registro"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  // app.navbar.hide('#topNavbar');
  // app.toolbar.hide('#botToolbar');

  $$('#noArtista').on('click', fnActivar);
  $$('#artista').on('click', fnActivar2);

  $$('#btnRegistro').on('click', fnRegistrar);


})


//-------------------------------------------------------INGRESAR----------------------------------------------
$$(document).on('page:init', '.page[data-name="ingresar"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  $$('#btnIngresar').on('click', fnIngresar);


})


//----------------------------------------------------------INICIO----------------------------------------------
$$(document).on('page:init', '.page[data-name="inicio"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.show('#topNavbar');
  email = $$('#idOculto').text();

  colUsuarios.doc(email).get()
    .then((doc) => {
      storage.ref().child(doc.data().icono).getDownloadURL()
        .then(function(url) {
          console.log("url: " + url);
          $$('#imgMiPerfil').attr('src', url);
        }).catch((error) => {
          console.log("Error getting documents: ", error);
        })
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    })

  colUsuariosSeguidos.doc(email).get()
    .then((doc) => {
      console.log(email);
      ar = doc.data().nombreUsuariosSeguidos;
      for (var i = 0; i < ar.length; i++) {
        usuAr = ar[i];

        colPostMixto.where('usuario', '==', usuAr).orderBy('fechaPublicacion', 'desc').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

              if (doc.data().tipoPost == 'texto') {
                date = new Date((doc.data().fechaPublicacion).toDate());
                console.log(doc.data().miIcono);

                    $$('#inicioContenido').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="' +
                      doc.data().miIcono + '" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
                      '</div></div><div class="card-content"><h3>' + doc.data().titulo +
                      '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');

              } else if (doc.data().tipoPost == 'imagen') {
                date = new Date((doc.data().fechaPublicacion).toDate());
                storage.ref().child(doc.data().archivo).getDownloadURL()
                  .then(function(url) {
                    console.log("url: " + url);
                    imgUrl = url;

                    $$('#inicioContenido').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="' +
                      doc.data().miIcono + '" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
                      '</div></div><div class="card-content"><img src="' + imgUrl + '" width="100%" /><h3>' +
                      doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');

                  })
                  .catch(function(error) {
                    console.log("Error: " + error);
                  })
              }
            })
          }).catch(function(error) {
            console.log("Error: " + error);
          })
      }
    }).catch(function(error) {
      console.log("Error: " + error);
    })





})




//----------------------------------------------------PERFIL PERSONAL NORMAL-----------------------------------------
$$(document).on('page:init', '.page[data-name="perf-personal-normal"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  idUsuario = $$('#idOculto').html();
  console.log(idUsuario);

  fnTomarDatosPerfilNor();



  colPostTexto.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        date = new Date((doc.data().fechaPublicacion).toDate());

        $$('#tab-1').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="'
        + doc.data().miIcono +'" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
          '</div><div class="demo-facebook-date">' + date + '</div></div><div class="card-content"><h3>' + doc.data().titulo +
          '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


  colPostImagen.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        date = new Date((doc.data().fechaPublicacion).toDate());

        storage.ref().child(doc.data().archivo).getDownloadURL()
          .then(function(url) {
            console.log("url: " + url);
            imgUrl = url;

            $$('#tab-1').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="'
            + doc.data().miIcono +'" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
              '</div><div class="demo-facebook-date">' + date + '</div></div><div class="card-content"><img src="' + imgUrl + '" width="100%" /><h3>' +
              doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');

          }).catch(function(error) {
            console.log("Error: " + error);
          });

      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });




})


//--------------------------------------------------PERFIL PERSONAL ARTISTA-----------------------------------------
$$(document).on('page:init', '.page[data-name="perf-personal-artista"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  idUsuario = $$('#idOculto').html();
  console.log('mi email: ' + idUsuario);

  fnTomarDatosPerfilArt();


  colPostTexto.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        date = new Date((doc.data().fechaPublicacion).toDate());
        $$('#tab2').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="'
        + doc.data().miIcono +'" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
          '</div><div class="demo-facebook-date">' + date + '</div></div><div class="card-content"><h3>' + doc.data().titulo +
          '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


  colPostImagen.where('email', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        date = new Date((doc.data().fechaPublicacion).toDate());

        storage.ref().child(doc.data().archivo).getDownloadURL() //pongo la ruta de la imagen en el storage
          .then(function(url) {
            console.log("url: " + url);
            imgUrl = url;

            if (doc.data().mostrarEn == 'galeria') {
              // $$('#tab1').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="'
              // + doc.data().miIcono +'" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
              //   '</div><div class="demo-facebook-date">' + date + '</div></div><div class="card-content"><img src="' + imgUrl + '" width="100%" /><h3>' +
              //   doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');
              $$('#contenidoTab').append('<div class="contGaleria column"><img class="imgGaleria" src="' + imgUrl + '"/></div>');

            } else if (doc.data().mostrarEn == 'general') {
              $$('#tab2').append('<div class="card demo-facebook-card no-shadow"><div class="card-header"><div class="demo-facebook-avatar"><img class="iconito" src="'
              + doc.data().miIcono +'" width="34" height="34" /></div><div class="demo-facebook-name">' + doc.data().usuario +
                '</div><div class="demo-facebook-date">' + date + '</div></div><div class="card-content"><img src="' + imgUrl + '" width="100%" /><h3>' +
                doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p></div><div class="card-footer"><p>' + doc.data().tags + '</p></div></div>');
            }

          }).catch(function(error) {
            console.log("Error: " + error);
          });

      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });


})



//------------------------------------POST NUEVO-----------------------------------------
$$(document).on('page:init', '.page[data-name="post-nuevo"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');
  app.toolbar.hide('#botToolbar');

  $$('#nuevoTexto').on('click', fnTextActivo);
  $$('#nuevaImg').on('click', fnImgActivo);

  var tagArray = [];

  $$('#agregarTag').on('click', function() {
    tag = $$('#textTag').val();
    console.log("tag: " + tag);
    sumarTag = tagArray.push(tag);
    console.log(tagArray);
    $$('#contenedorTags').append('<div class="chip"><div class="chip-label">#' +
      tag + '</div><a href="#" class="chip-delete"></a></div>');
  });

  $$('.chip-delete').on('click', borrarTag);

  $$('#btnPublicar').on('click', function() {
    nombOculto = $$('#nombreOculto').html();
    titText = $$('#tituloText').val();
    descText = $$('#descripText').val();
    emailOculto = $$('#idOculto').html();
    tipeOculto = $$('#tipoOculto').html();
    tArray = tagArray;
    tiempoPublicacion = firebase.firestore.FieldValue.serverTimestamp();
    console.log(titText + ", " + descText + ", " + tArray);

    colUsuarios.doc(emailOculto).get()
      .then((doc) => {
        storage.ref().child(doc.data().icono).getDownloadURL()
          .then(function(url) {
            console.log("url: " + url);
            miIcono = url;

            if ($$('#nuevoTexto').prop("checked")) {

              colPostTexto.add({
                usuario: nombOculto,
                tipeUser: tipeOculto,
                email: emailOculto,
                titulo: titText,
                descripcion: descText,
                tags: tArray,
                fechaPublicacion: tiempoPublicacion,
                miIcono: miIcono,
              })
              colPostMixto.add({
                usuario: nombOculto,
                tipoPost: 'texto',
                tipeUser: tipeOculto,
                email: emailOculto,
                titulo: titText,
                descripcion: descText,
                tags: tArray,
                fechaPublicacion: tiempoPublicacion,
                miIcono: miIcono,
              })

              mainView.router.navigate('/inicio/');

            } else if ($$('#nuevaImg').prop("checked")) {
              archivo = document.getElementById("file").files[0];

              storage.ref(emailOculto + '/' + archivo.name).put(archivo);
              console.log(archivo.name);

              archivoPath = (emailOculto + '/' + archivo.name);
              console.log(archivoPath);

              if ($$('#edadATP').prop("checked")) {
                var edadContenido = $$('#edadATP').val();
                console.log(edadContenido);
              } else if ($$('#edadDieciocho').prop("checked")) {
                var edadContenido = $$('#edadDieciocho').val();
                console.log(edadContenido);
              }

              if ($$('#postGaleria').prop("checked")) {
                var dondeMostrar = $$('#postGaleria').val();
                console.log(dondeMostrar);
              } else if ($$('#postGeneral').prop("checked")) {
                var dondeMostrar = $$('#postGeneral').val();
                console.log(dondeMostrar);
              }

              colPostImagen.add({
                usuario: nombOculto,
                archivo: archivoPath,
                tipeUser: tipeOculto,
                email: emailOculto,
                titulo: titText,
                descripcion: descText,
                tags: tArray,
                rating: edadContenido,
                mostrarEn: dondeMostrar,
                fechaPublicacion: tiempoPublicacion,
                miIcono: miIcono,
              })
              colPostMixto.add({
                usuario: nombOculto,
                tipoPost: 'imagen',
                archivo: archivoPath,
                tipeUser: tipeOculto,
                email: emailOculto,
                titulo: titText,
                descripcion: descText,
                tags: tArray,
                rating: edadContenido,
                mostrarEn: dondeMostrar,
                fechaPublicacion: tiempoPublicacion,
                miIcono: miIcono,
              })

              mainView.router.navigate('/inicio/');

            };

          }).catch(function(error) {
            console.log("Error: " + error);
          })
      }).catch(function(error) {
        console.log("Error: " + error);
      })

    })

});


// ----------------------------------BUSCAR------------------------------------------
$$(document).on('page:init', '.page[data-name="buscar"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  colUsuarios.orderBy('nombreUsuario').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().nombreUsuario);
        $$('#resultadosBusqueda').append('<li class="item-content btnBuscador"><div class="item-inner"><div class="item-title">' +
          doc.data().nombreUsuario + '</div></div></li>');
      });

      $$('.btnBuscador').on('click', function() {
        nombreBusc = $$(this).text();
        console.log(nombreBusc);

        mainView.router.navigate('/perf-ajeno/');
      })
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });

})


//-----------------------------------PERFIL AJENO----------------------------------------------
$$(document).on('page:init', '.page[data-name="perf-ajeno"]', function(e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("listo!");

  app.navbar.hide('#topNavbar');

  uAjeno = nombreBusc;
  email = $$('#idOculto').html();
  console.log(uAjeno);

  $$('#usuarioAjeno').html(uAjeno);

  colUsuarios.where('nombreUsuario', '==', uAjeno).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        eml = doc.id;
        tUsuario = doc.data().tipoUsuario;
        console.log(eml + 'y ' + tUsuario);

        if (tUsuario == 'artista') {
          $$('#divTabs').prepend('<a href="#tabAjeno1" class="button tab-link tab-link-active">Galeria</a>');
          $$('#contTabs').prepend('<div id="tabAjeno1" class="tab tab-active"></div>');
          $$('#tabAjeno2Activo').removeClass('tab-link-active');
          $$('#tabAjeno2').removeClass('tab-active');

        } else if (tUsuario == 'noArtista') {
          // nada
        }

        colPostTexto.where('email', '==', eml).orderBy('fechaPublicacion', 'desc').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              date = new Date((doc.data().fechaPublicacion).toDate());
              $$('#tabAjeno2').append('<div class=""><h3>' + doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' +
                doc.data().tags + '</p><p>' + date + '</p></div>');
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });


        colPostImagen.where('email', '==', eml).orderBy('fechaPublicacion', 'desc').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              date = new Date((doc.data().fechaPublicacion).toDate());

              if (doc.data().tipeUser == 'artista') {
                storage.ref().child(doc.data().archivo).getDownloadURL() //pongo la ruta de la imagen en el storage
                  .then(function(url) {
                    console.log("url: " + url);
                    // $$("#fotosubida").attr("src", url);
                    imgUrl = url;

                    if (doc.data().mostrarEn == 'galeria') {
                      $$('#tabAjeno1').append('<div class="imgTab"><img style="width:90vw" src="' + imgUrl + '"><h3>' +
                        doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
                    } else if (doc.data().mostrarEn == 'general') {
                      $$('#tabAjeno2').append('<div class="imgTab"><img style="width:90vw" src="' + imgUrl + '"><h3>' +
                        doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');
                    }

                  }).catch(function(error) {
                    console.log("Error: " + error);
                  });
              } else if (doc.data().tipeUser == 'noArtista') {
                storage.ref().child(doc.data().archivo).getDownloadURL() //pongo la ruta de la imagen en el storage
                  .then(function(url) {
                    console.log("url: " + url);
                    // $$("#fotosubida").attr("src", url);
                    imgUrl = url;
                    $$('#tabAjeno2').append('<div class="imgTab"><img style="width:98vw" src="' + imgUrl + '"><h3>' +
                      doc.data().titulo + '</h3><p>' + doc.data().descripcion + '</p><p>' + doc.data().tags + '</p><p>' + date + '</p></div>');

                  }).catch(function(error) {
                    console.log("Error: " + error);
                  });
              }

            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });

      })
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });


  colUsuariosSeguidos.doc(email).get()
    .then((doc) => {
      arr = doc.data().nombreUsuariosSeguidos;
      console.log(arr);
      u = uAjeno;
      console.log(u);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == u) {
          $$('#btnSeguir').addClass('seguido').removeClass('sinSeguir');
          $$('#imgBtnSeguir').attr('src', 'img/018-remove-user.png');
        } else {
          //nada
        }
      }
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });


  $$('#btnSeguir').on('click', function() {
    email = $$('#idOculto').html();
    us = uAjeno;

    colUsuariosSeguidos.doc(email).get()
      .then((doc) => {

        if ($$('#btnSeguir').hasClass('sinSeguir')) {
          $$('#btnSeguir').removeClass('sinSeguir').addClass('seguido');
          $$('#imgBtnSeguir').attr('src', 'img/018-remove-user.png');
          // array = doc.data().nombreUsuariosSeguidos;
          // console.log(array);
          array = usSeguidos;
          console.log(array);
          array.push(us);
          datos = {
            nombreUsuariosSeguidos: array
          };
          colUsuariosSeguidos.doc(email).set(datos);
          console.log('Usuario seguido');

        } else if ($$('#btnSeguir').hasClass('seguido')) {
          $$('#btnSeguir').removeClass('seguido').addClass('sinSeguir');
          $$('#imgBtnSeguir').attr('src', 'img/019-add-user.png');

          for (var i = 0; i < arr.length; i++) {
            if (arr[i] === us) {
              arr.splice(i, 1);
              i--;
            }
          }
          console.log(arr);
          return colUsuariosSeguidos.doc(email).update({
              nombreUsuariosSeguidos: arr
            })
            .then(() => {
              console.log("Document successfully updated!");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });

          console.log('Usuario dejado de seguir');
        }

      }).catch((error) => {
        console.log("Error getting documents: ", error);
      });

  });



})









//  ---------------------------------------  FUNCIONES  --------------------------------------------------

function fnActivar() {
  $$('#noArtista').addClass('activo');
  $$('#artista').removeClass('activo');
}

function fnActivar2() {
  $$('#artista').addClass('activo');
  $$('#noArtista').removeClass('activo');
}

function fnRegistrar() {

  rEmail = $$('#regEmail').val();
  rPass = $$('#regPass').val();
  rUsua = $$('#regUsuario').val();
  rFec = $$('#regFecha').val();

  firebase.auth().createUserWithEmailAndPassword(rEmail, rPass)
    .then(function() {

      if ($$('#noArtista').hasClass("activo")) {
        var tipoUsuario = $$('#noArtista').val();
      } else if ($$('#artista').hasClass("activo")) {
        var tipoUsuario = $$('#artista').val();
      }

      archivo = document.getElementById("imgRegistro").files[0];
      storage.ref(rEmail + '/' + archivo.name).put(archivo);
      console.log(archivo.name);
      archivoPath = (rEmail + '/' + archivo.name);
      console.log(archivoPath);

      datos = {
        nombreUsuario: rUsua,
        tipoUsuario: tipoUsuario,
        fecha: rFec,
        icono: archivoPath
      };
      colUsuarios.doc(rEmail).set(datos);
      console.log('Usuario creado');


      if (tipoUsuario == 'artista') {
        var miNombre = rUsua;
        console.log('Mi usuario: ' + miNombre);

        $$('#idOculto').html(rEmail);
        $$('#tipoOculto').html(tipoUsuario);

        fnMiPerfilArtista();

        mainView.router.navigate('/inicio/');

      } else if (tipoUsuario == 'noArtista') {
        var miNombre = rUsua;
        console.log('Mi usuario: ' + miNombre);

        $$('#idOculto').html(rEmail);
        $$('#tipoOculto').html(tipoUsuario);

        fnMiPerfilNormal();

        mainView.router.navigate('/inicio/');
      }

    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('Clave muy débil.');
      } else {
        alert(errorCode + "|" + errorMessage);
      }
      console.log(error);
    });


}

function fnIngresar() {

  var email = $$('#emailLogin').val();
  var password = $$('#passLogin').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("ingresaste");

      colUsuarios.doc(email).get().then((doc) => {
        if (doc.exists) {
          var dbTipoUsuario = doc.data().tipoUsuario;
          console.log('documento existe');
          console.log('tipo usuario: ' + dbTipoUsuario);

          if (dbTipoUsuario == 'artista') {
            var miNombre = doc.data().nombreUsuario;
            console.log('Mi usuario: ' + miNombre);

            $$('#idOculto').html(email);
            $$('#tipoOculto').html(dbTipoUsuario);
            $$('#nombreOculto').html(miNombre);

            fnMiPerfilArtista();

            mainView.router.navigate('/inicio/');

          } else if (dbTipoUsuario == 'noArtista') {
            var miNombre = doc.data().nombreUsuario;
            console.log('Mi usuario: ' + miNombre);

            $$('#idOculto').html(email);
            $$('#tipoOculto').html(dbTipoUsuario);
            $$('#nombreOculto').html(miNombre);

            fnMiPerfilNormal();

            mainView.router.navigate('/inicio/');
          }

        }
      })

    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + errorMessage);
    });

}

function fnMiPerfilArtista() {
  $$('#miPerfil').on('click', function() {
    mainView.router.navigate('/perf-personal-artista/');
  })
}

function fnMiPerfilNormal() {
  $$('#miPerfil').on('click', function() {
    mainView.router.navigate('/perf-personal-normal/');
  })
}

function fnTomarDatosPerfilArt() {

  colUsuarios.doc(idUsuario).get().then((doc) => {
    if (doc.exists) {
      console.log('documento existe');

      miUsuario = doc.data().nombreUsuario;
      miImagen = doc.data().icono;
      console.log('Mi usuario: ' + miUsuario);
      $$('#miUsuarioArtista').html(miUsuario);

      storage.ref().child(miImagen).getDownloadURL()
        .then(function(url) {
          console.log("url: " + url);
          imgUrl = url;
          $$('#iconoArt').attr('src', url);
        }).catch(function(error) {
          console.log("Error: " + error);
        });

    }
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + errorMessage);
  });

}

function fnTomarDatosPerfilNor() {

  colUsuarios.doc(idUsuario).get().then((doc) => {
    if (doc.exists) {
      console.log('documento existe');

      miUsuario = doc.data().nombreUsuario;
      miImagen = doc.data().icono;
      console.log('Mi usuario: ' + miUsuario);
      $$('#miUsuarioNormal').html(miUsuario);

      storage.ref().child(miImagen).getDownloadURL()
        .then(function(url) {
          console.log("url: " + url);
          imgUrl = url;
          $$('#iconoNor').attr('src', url);
        }).catch(function(error) {
          console.log("Error: " + error);
        });

    }
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + errorMessage);
  });

}

function borrarTag(e) {
  e.preventDefault();
  var chip = $$(this).parents('.chip');
  chip.remove();
}

function fnTextActivo() {
  // $$('#nuevoTexto').addClass('activo');
  // $$('#nuevaImg').removeClass('activo');
  $$('.subirImagen').attr('hidden', true);
}

function fnImgActivo() {
  var tipoU = $$('#tipoOculto').html();

  if (tipoU == 'artista') {
    // $$('#nuevaImg').addClass('activo');
    // $$('#nuevoTexto').removeClass('activo');
    $$('.subirImagen').removeAttr('hidden');
  } else if (tipoU == 'noArtista') {
    // $$('#nuevaImg').addClass('activo');
    // $$('#nuevoTexto').removeClass('activo');
    $$('.subirImagen').removeAttr('hidden');
    $$('.unicoImgArtista').attr('hidden', true);
  }

}
