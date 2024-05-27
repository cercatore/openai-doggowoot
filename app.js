'use strict'
/*******************************************
*
*
*********************************************/

var app = angular.module('myApp',
	[
	'ngRoute',
	'ngMessages',
	'ngAnimate',
	'ngProgress',
	'ngFileUpload',
	'myApp.costanti',
	'myApp.waveModule',
	'myApp.callback',
	'shared',
	'jobs',
	'shopper',
	'anotherModule',
	
	'myApp.Gitter'

	
	

	//'ngTable'

	])

var user;


// const setLocalStorageItem = Cl(prop, value) => {
// 	localStorage.setItem(prop, value);
// });

// const getLocalStorageItem = ClientFunction(prop => {
// 	return localStorage.getItem(prop);
// });

// Register the previously created AuthInterceptor.
function successLogin(result) {

}


// messaging.setBackgroundMessageHandler( (message) => {
	// console.log(message);
// });

let token;
app.controller('homeController' , ['$rootScope', '$scope', '$firebaseAuth', '$location', '$log' , 'clSettings', function ($rootScope, $scope, $location, log, settings){
	this.user = {};
	const $log = log.info;
	
	$rootScope.working = false;
	this.hasFinished = 'non voglio vivere cosi cerca qualcosa';
	$rootScope.user = firebase.auth().currentUser;
	let facebook_url = "";
	this.user.email = "cbagnato77@gmail.com"
		// $location.path("/kikass");
	/****************************************************
	 * 
	 * SIGNIN NEW METHOD 
	 *  OTP PASSWORD email.page.link
	 * callback https://localhost/?
	 */
	 this.kiki = () => {
		let dumb = settings.actionCodeSettings
		$log( dumb.url)

        firebase.auth().sendSignInLinkToEmail(this.user.email, dumb )
            .then(() => {
              // The link was successfully sent. Inform the user.
              // Save the email locally so you don't need to ask the user for it again
              // if they open the link on the same device.
              window.localStorage.setItem('emailForSignIn', email);
              $log("all done.");
              // ...
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              $log( errorCode + " " + error.message)


              // ...
        });

      }
	  /****************************************************
	 * 
	 * SIGNIN NEW METHOD as 26 august by modofo
	 */
	this.sigin2608 = () => {
		//  auth.settings.appVerificationDisabledForTesting = true;

		var phoneNumber = "+393519243517";
		var testVerificationCode = "123456";
		
		// This will render a fake reCAPTCHA as appVerificationDisabledForTesting is true.
		// This will resolve after rendering without app verification.
		var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
		appVerifier.prototype = () => {
			func = function() {
				// if (b) {
				// 	return true;
				// }
				return true;
			};
			return {
				verify: func
			}

		}
		// signInWithPhoneNumber will call appVerifier.verify() which will resolve with a fake
		// reCAPTCHA response.
		firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
			.then(function (confirmationResult) {
			// confirmationResult can resolve with the whitelisted testVerificationCode above.
			$log(confirmationResult)
			return confirmationResult.confirm(testVerificationCode)
			}).catch( error => {
			// Error; SMS not sent
			$log(error);

			});
	}

	this.signInNormal = ( ) => {
	  $rootScope.working = true;
		firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)
			.then(
				function(firebaseUser){
					$rootScope.rightPath = "signedin";
					$rootScope.userLoggedIn = firebaseUser.email;
					//  5 dicembre: ce un errore. token non e quello che voglio(stringa)
					$rootScope.token = firebaseUser.getIdToken().then(token =>{
						window.localStorage.setItem('token' , token);

					})
					console.log("********* changed " );
					user = firebaseUser;  // ALL FIX
					$location.path('/dash')  // TODO : FIX
				  console.log("Signed in as:", firebaseUser.getIdToken());
				}
			)

			.catch(
				( error) => $scope.message= error.message
				//$location.path('/500');
			)
		}
	this.signInFacebook = () => {
		$rootScope.working = 1;
		$rootScope.ticker= "facebook signin...";
		FB.login(function(response) {
			// handle the response
			let res = response.authResponse;
			
			if (res) {
				console.log(response.authResponse); 
				
				$rootScope.fb_user.token = res.accessToken;
				$rootScope.fb_user.id = res.userID;
				$rootScope.fb_user.email = res.email;
				$rootScope.fb_user.name = 'not blabla';
				$rootScope.user = $rootScope.fb_user;
				FB.api(`me?fields=name,email,picture`, function(response) {
					try{
						let user = {};
					user.email = response.email;
					user.displaName = response.name;
					}catch(err){_show_error("no named", $scope)}
					user.profilePic = response.picture.data.url;
					$rootScope.user = user;

	
				});
				// Logged into your webpage and Facebook.
				
				// let rresult = $https.get(facebook_url)
			  } else {
				// The person is not logged into your webpage or we are unable to tell. 
				console.log("balbaalla");
			  }
		  }, {scope: 'public_profile, email'});
	}

	this.signInFacebook_old = () => {
		let provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope("public_profile");
		provider.addScope("email");


		firebase.auth().signInWithRedirect(provider).then(function(result) {
				//TODO $rootScope.user = firebaseUser.uid;
		console.log("login successful. access token:" + result.credentials.accessToken);
		window.localStorage.setItem("cl_once",result.credentials.accessToken);

		// console.log("FB Signed in as:", firebaseUser.uid);
		}).catch(function(error) {
			_show_error(error, $scope);
			console.log("FB Authentication failed:", error);
		});
	}

	this.signInGoogle = () => {
		// 	auth.$signInWithPopup("google").then((firebaseUser)=>{
		// 	console.log("G+ Signed in as:", firebaseUser.uid);
		// }).catch(function(error) {
		//  console.log("G Authentication failed:", error);
		// });
		$rootScope.working=1;
		let myauth = firebase.auth();
		let provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope("email");
		provider.addScope("profile");
		console.log("google redirecting" );
		console.log(provider);
		firebase.auth().signInWithPopup(provider).then(result=> {
			console.log("google redirecting ..." + result);
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// if ( token || token == undefined || token ==='') alert("token is null");
			window.localStorage.setItem("cl_once" , token);
			// The signed-in user info.
			var user = result.user;
			$rootScope.rightPath = 1;
			$rootScope.userLoggedIn = result.user.displayName || result.user.email || "anonymous";// +++498534??? add data
			// user.getIdToken().then( token => {window.localStorage.setItem("token", token);confirm("hello ! " + token.substring(0,5) );});


			$rootScope.user = angular.copy(user);
			console.log(user);
			// ...
			}).catch( error => _show_error(error, $scope)
			);
	};
	this.signInGithub = () => {
		let provider = new firebase.auth.GithubAuthProvider();
		provider.addScope("repo");
		firebase.auth().signInWithPopup(provider).then(result=>{
			successLogin(result);
			$rootScope.rightPath = true;
			$rootScope.userLoggedIn = result.user.email || result.user.displayName || "pazienza";
		}).catch(error=>console.log(error))
	}

	this.sendEmailForgot = () => {

		firebase.auth().sendPasswordResetEmail(this.user.email).then(function() {
		console.log("// Email sent. to " + this.user.email);
		}).catch(function(error) {
			_show_error(error, $scope)
		});
	}


}])
// GLOBAL FUNCTION MODDING
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
function _show_error(error, $scope)  {
	let found = error.message.match(/password/gi);
	if (found) $scope.message = error;
		else $scope.message = "Something went wrong. Please try again";


}
// firebase.auth().onAuthStateChanged(function(_user) {
// 	user = _user
//   if (user) {
//     //alert("user signed in")
// 		var check = angular.element(document).scope().rightPath;
// 		if ( check !== undefined && check !== '');
// 			// else window.location.href = "http://" + window.location.hostname + "/404"
// 		angular.element(document).scope().userLogged = "Ciao " + user.email;

// 		var newtoken = user.getIdToken().then(function (data) { window.localStorage.setItem('token', ("" + data).trim());
// 		console.log("****************** loggedIN changed ");})

//   } else {
// 		try{
// 			angular.element(document).scope().userLogged = "perfavore fai login";

// 		}catch(err){}
//     console.log("**************** out");
//   }
// });

function getNext(){
	return new Date().getTime()
}



app.value('categorieHC' , [ "FIRST COURSE" , "SECOND COURSE" , "SIDE DISHES" , "BEVERAGES"]);


app.factory("aracnoService" , function( $http, $location, $parse, $document){
	let service = {};
	function mastica(data) {
		 let obj = [];
		 for(let i=0;i<data.length;i++){
				let tmp = {};
				tmp.value = data[i].name;
				obj.push(tmp);
			}
			return obj;
	}
	

	// service.uploadNext = ( firestore,  collName ):String => {
		// firestore.collection( collName).doc
	// }
	service.uploadToStorage = ( sacco, clientId, file, data, propName, prog, usero)  => {
		// let {} = params;
		let ref = firebase.storage().ref().child(clientId + '-images').child( file.name);
		var metadata = {
			contentType: 'image/*',
			"claudio" : file.name
		  };
		// sacco.uploading = 1;
		if (typeof data !== 'string') throw new Error('UPLOAD: well, type of data  should be dataUrl, not file');
		let task = ref.putString(data, "data_url") // TODO: lasc\iare in bianco
		if (usero ) prog.set(15);
		
		// was prog.start(): fixed time increase
		task.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'

		function(snapshot) {
		  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress.toFixed(0) + '% done');
			// sacco.profile_identify = 'images/paperino.png';

		  switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
			  console.log('Upload is paused');
			  break;
			case firebase.storage.TaskState.RUNNING: // or 'app.ning'
				console.log('Upload is running');
				if (usero) prog.set( progress.toFixed(0) );
			  break;
		  }
		}, function(error) {

		// A full list of error codes is available at
		// https://firebase.google.com/docs/storage/web/handle-errors
		switch (error.code) {
		  case 'storage/unauthorized':
			// User doesn't have permission to access the object
			console.log(error.code);
			break;

		  case 'storage/canceled':
			console.log(error.code);
			// User canceled the upload
			break;
	  	case 'storage/unknown':
			console.log(error.code);
			// Unknown error occurred, inspect error.serverResponse
			break;
		default:console.log("error " + error.code);
		}
	  }, function() {
		// Upload completed successfully, now we can get the download URL
		task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		  console.log('File available at', downloadURL);
			let ref = task.snapshot.ref;
			sacco.aggiornaUser(downloadURL, null, file, data);
			window.localStorage.setItem('image', downloadURL);
			sacco[propName] = downloadURL;
			if (usero) {
				prog.set(100);
				prog.complete()
			}
			sacco.$apply();

		});
	  });

	}
	return service;
})
app.factory("services", ['$http' , "clSettings", function($http , serviceBase ) {
  var docName = "portate"
    var obj = {};
	//if (!ss ) alert("goes wrong");
	obj.insertPortata = function (customer) {
		var notify = $("div[ajax-result]");

		return $http.post(serviceBase + docName + '?apiKey=LC-wif-orODQhsURWZf43a-I0x2hjhIf' , customer)
			.success(function (data, status, headers, config) {
				$("[ajax-prog]").hide();
				notify.show();
				notify.html("<div class='center-block'><h3>CARICAMENTO CON SUCCESSO</h3></div>")
				window.setTimeout(function (){
					notify.hide();
				},2000)
				//alert(JSON.stringify(data))
			})
			.error(function (data, status){
				alert(status)
			})
			.complete(function (){
				$("[ajax-prog]").show();
			})
		};
	obj.getAllPortate = function(){

		return $http.get(serviceBase + docName + '?apiKey=LC-wif-orODQhsURWZf43a-I0x2hjhIf')
			.error(function (data, status){
					alert(status)
			})
		}
	obj.getPortata = function(customerID){
        return $http.get(serviceBase + docName+ '/' + customerID + '?apiKey=LC-wif-orODQhsURWZf43a-I0x2hjhIf');
    }
	obj.getPortateCategoryFilter = function(category){
		var q={"category": category };
		return $http.get(serviceBase + docName + '?apiKey=LC-wif-orODQhsURWZf43a-I0x2hjhIf&q=' + angular.toJson(q) )
		.error(function (data, status){
					alert(status + "\n " + JSON.stringify(data) )
			})
		}
	obj.catArray = [ "PRIMI" , "SECONDI" , "CONTORNI" , "BIBITE"];

	obj.insertComanda = function(itemComanda){
        return $http.post(serviceBase + 'comande' + '?apiKey=LC-wif-orODQhsURWZf43a-I0x2hjhIf' , itemComanda)
			.error( function ( data, status) {
				alert(status)
            })
	}

	return obj;

}])



var routes = [ "/burp" , "/home" , "/signup" , "/chat" , "/batch", "/kikass"];

app.config(
  function($routeProvider, $httpProvider) {
		  //alert ("useXDomain prop is " + $httpProvider.defaults.useXDomain)
	// $httpProvider.interceptors.push('BearerAuthInterceptor');

    $routeProvider
      
	 
	  .when( "/home" , {
			title : 'home4',
			templateUrl: 'homeComponent/home.html',
			controller : 'homeController as main'

		})
		.when(  "/signup", {
		 		title: 'YOLO PLAYGROUND',
				templateUrl: 'former/register.html',
				controller:"playCtrl as main"
		})
		.when( '/404' , {
				title: '404 not found',
				templateUrl: 'mixed/404.html'
		})
		.when(  "/chat", {
			title:'chat',
			templateUrl: 'chat/room.html',
			controller: 'chatController as control'
		})
		.when( '/movie' , {
			title:'my obiettivo',
			templateUrl: 'movie/movieDetail.html',
			controller: 'movieController as ctrl'
		})
		.when( '/coraggio', {
			templateUrl:"movie/batch.html",
			controller:'batch as ba'
		})

		.when('/burp2', {
			templateUrl:'burps/animalmap.html',
			controller:'burpsCtrl as main'
		})
		.when('/kikass', {
			templateUrl:'kikass/kikass.html',
			controller:'kikass as main'
		})
		.when('/dash', {
			templateUrl:'homeComponent/user_dash.html',
			controller:'appCtrl as main'
		})
		.when('/azione', {
			templateUrl:"burps/burps.html",
			controller:'burpsCtrl as main'
		})
		.when('/maia' , {
			templateUrl:"chat/customerchat.html",
			controller:'burpsCtrl as main'
		})
		.when('/404' , {
			templateUrl:"404/404.html"
		})
		.when('200', {
			templateUrl:"200.html"
		})
		.when('/prefs' , {
			templateUrl:"prefs_debug/stats_page.html",
			controller:"prefcontroller as main"
		})
		.when('/home', {
			templateUrl:"siwave/wave.html",
			controller:"signinCtrl as main"
			
		})
		.when ('/callback' , {
			templateUrl:"siwave/callback.html",
			controller:"callCtrl as main"
		
		})
		.when ('/dash_message', {
			templateUrl:"siwave/dashboard.html",
			controller:"goCtrl as main"
		})
		.when ('/jobs', {
			templateUrl:"jobs/jobsView.html",
			controller:"jobsCtrl"
		})
		.when ('/vision', {
			templateUrl:"vision/dash_record.html",
			controller:"visionController as main"
		})
		.when ('/tickets', {
			templateUrl:"ticket_setting/ticket.html",
			controller:"ticketCtrl as main"
		})
		.when ('/test_upload', {
			templateUrl:"tailwind/navbar_test_upload.html",
			controller:"autoController as main"
		})
		.when ('/default', {
			templateUrl:"portfolio/index.html"
		})
		.when ('/suca', {
			templateUrl:"gitter/message.view.html",
			controller:"gitterCtrl as main"
		})
		
		.otherwise({
			redirectTo:"/jobs"
		})




});

function printString(out, ticker, delay, resolve){
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
		  console.log(ticker)
		  out += ticker;
          resolve()
        },
        delay + 1
      )
    })
  }
const waitaminuteDone = async() =>{
	await printString("1111111", 300);
	$rootScope.app_loading = 'ok load';

}
function myawesomeroute (path) {

}

const  guardIron = (function ( serv, lista){
	//#pointer to prefs array
			var oddi = 'c' + '20190306';
			var check = 0;
			var list = lista;
			function save(prop, value){
				if ( typeof list.oddi === 'undefined' )  { list[oddi] ={};list.oddi.prop=value;}
						list.oddi.prop = value;
					serv.setItem('preference', list)
			}
			function init(){
				list = serv.getItem('preference');

			}
			function isArray (value) {
				return typeof value === 'array' || value instanceof Array;
			}
			init();
			return {
				sayHello: () => { return 'hello' ; },
				load : () => { ///if (!check) alert('error!');else {
				  list['c20190306'] = {};
					list['c20190306'].debug = true;
					serv.setItem('preference', list);
					return list;
				},
				save: (prop, value)=>{ save(prop, value)}

			}
		}
)(window.localStorage, "")
function InitializeCoins ( db, settings ) {
	try {
		let readValue = localStorage.getItem ( settings.VAR_CR_LABEL_COINS || "coins");
		if ( !readValue) {
			localStorage.setItem ( settings.VAR_CR_LABEL_COINS || "coins", true );
			checkSystem()
		}
	}catch (error){console.log(error)}
	
};

app.run(['$location', '$rootScope', 'clSettings', '$timeout', function($location, $rootScope, settings, $timeout) {

	$rootScope.loginActions  = [ 'LOGOUT', 'I MIEI AMICI', 'FEEDBACK'];
	$rootScope.splashLoad = true;
	$rootScope.locale = window.localStorage.getItem("cl_locale");
	$rootScope.clientId = window.localStorage.getItem("deviceId") || '1234567890';
	settings.storageBase = (!window.locale ) ? $rootScope.clientId + "" : "";
	$rootScope.display_annoy = window.cordova !== undefined; 

	$rootScope.searchbar = "http://google.com/?q="; 
	$rootScope.alert = () => { alert("https://google.com/q=dogs+OR+pets+" + $rootScope.somevar );
	}
  // let self = (this);
	// self.guard = window.localStorage;
	let $proj = {};
		
	$proj.locale = window.localStorage.getItem("cl_locale");
	$proj.deviceID = $rootScope.clientId;
	$proj.routes = window.routes;
	$proj.token = window.localStorage.getItem("messagingToken") ? "ok" : "";
	$rootScope.project = $proj;
	$rootScope.navbar = {} ;
	$rootScope.navbar.debug = () => {
		try{
			dialogConfirm(JSON.stringify($rootScope.project));
		}
		catch (err){
			confirm(window.localStorage.getItem("messagingToken"));
		}
		 
			 window.localStorage.setItem('preference', [])

	}
	$rootScope.fb_user = {};
	
	$rootScope.createPref = ( user) => {
		if (!user) throw new Error('no user');
		db.collection('users').doc(user.email).set({}, {merge:true});
	  }
  
	let coins = InitializeCoins(firebase.firestore(), settings);






	
	$rootScope.move = () => {
		let last = settings.history.pop();
		
		var options = {
			direction: 'right',
			duration: 650,
			iosdelay: 0,
			androiddelay: 0,
			fixedPixelsTop: 45,
			href: last   
		  };   //& last = "/" + last 
		console.log(last);
		$location.path("#" + last);
	}
	$rootScope.$watch("user", function(newvalue,oldvalue){
		console.log("redirecting to dashboard...");
		let token = window.localStorage.getItem("token");
		let user = newvalue;

	})			//http://localhost/message?blabla=
	settings.doggobackend = "http://" + window.location.host + "/message?blabla:";
	// settings.$watch('storageUrl', function( val, old){
	// 	console.log('watchdog1' + val);
	// 	if ( ! ( val && val != '')) generalAracno = 1;
	// })

	// firebase.auth().getRedirectResult().then((log => console.log(log.credential.accessToken)))
		// .catch(error => console.log(error))
		
	firebase.auth().onAuthStateChanged(function(_user) {
		console.log("state changed.");
		$rootScope.working = true;
		$rootScope.$apply();
		// alert($rootScope.debug + " dbeig np go");
		if (_user && $rootScope.debug !== 'go' ){
			let token = window.localStorage.getItem("cl_once");
			if (token) console.log( token.slice(0,16));
			$rootScope.user = _user;
			console.log(_user);
			$timeout(()=>{
				console.log("tutto previsto 32333. ");
				$location.path('dashboard')
			},1300);
			console.log("blabla asseytt one(true): " + (_user.uid ) );
		}
		else { console.log("logout.")}
	});
	
	FB.Event.subscribe("auth.statusChange", function(res){
		$rootScope.working = true;
		if (res.status === 'connected'){
			console.log("facebook auth change");
			console.log(res.authResponse );
			FB.api(`me?fields=name,email,picture`, function(response) {
				$rootScope.user ={};
				$rootScope.user.email = response.email;
				$rootScope.user.displayName = response.name;
				$rootScope.user.profilePic = response.picture.data.url;
				$location.path('/dash')
				$rootScope.message = JSON.pruned(response);

			});
		}
		else {
			$rootScope.userLoggedIn = res.status;
			$location.path('/500');
		}
	    },
	    error=>{$rootScope.message="somethign fb huhu"+error;$location.path('/500')}
	);

	$rootScope.logout = () => { // NOT THIS
		firebase.auth().signOut().then(_=> {
				// Sign-out successful.
				$timeout(()=>{
					console.log("tutto previsto 32333. " + _);
					$rootScope.rightPath = false;
					$rootScope.userLoggedIn = 'ciao';
					$location.path('/500')
				},300);

			}, function(error) {
				// An error happened.
				console.log(error)
			});
		}
	$rootScope.fblogout = () => {
		FB.logout( function(response){
			console.log(response.status);
		})
	}


	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			try{
				
				console.log(current.$$route.originalPath);

				settings.history.push(current.$$route.originalPath.replace("/", "")); // nop operation
				
			}
			catch( err){}
			});

	$rootScope.$on('$routeChangeError', function (event, current, previous) {
		$location.path('#coraggio');// TODO EANRING WARNING ESAURITO
	});
}]);
// two additional optional parameters :
//   - the maximal depth (default : 6)
//   - the maximal length of arrays (default : 50)
// GitHub : https://github.com/Canop/JSON.prune
// This is based on Douglas Crockford's code ( https://github.com/douglascrockford/JSON-js/blob/master/json2.js )
(function () {
var DEFAULT_MAX_DEPTH = 6;
var DEFAULT_ARRAY_MAX_LENGTH = 50;
var seen; // Same variable used for all stringifications

Date.prototype.toPrunedJSON = Date.prototype.toJSON;
String.prototype.toPrunedJSON = String.prototype.toJSON;

var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	meta = {    // table of character substitutions
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};

function quote(string) {
	escapable.lastIndex = 0;
	return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
		var c = meta[a];
		return typeof c === 'string'
			? c
			: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	}) + '"' : '"' + string + '"';
}

function str(key, holder, depthDecr, arrayMaxLength) {
	var i,          // The loop counter.
		k,          // The member key.
		v,          // The member value.
		length,
		partial,
		value = holder[key];
	if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
		value = value.toPrunedJSON(key);
	}

	switch (typeof value) {
	case 'string':
		return quote(value);
	case 'number':
		return isFinite(value) ? String(value) : 'null';
	case 'boolean':
	case 'null':
		return String(value);
	case 'object':
		if (!value) {
			return 'null';
		}
		if (depthDecr<=0 || seen.indexOf(value)!==-1) {
			return '"-pruned-"';
		}
		seen.push(value);
		partial = [];
		if (Object.prototype.toString.apply(value) === '[object Array]') {
			length = Math.min(value.length, arrayMaxLength);
			for (i = 0; i < length; i += 1) {
				partial[i] = str(i, value, depthDecr-1, arrayMaxLength) || 'null';
			}
			v = partial.length === 0
				? '[]'
				: '[' + partial.join(',') + ']';
			return v;
		}
		for (k in value) {
			if (Object.prototype.hasOwnProperty.call(value, k)) {
				try {
					v = str(k, value, depthDecr-1, arrayMaxLength);
					if (v) partial.push(quote(k) + ':' + v);
				} catch (e) { 
					// this try/catch due to some "Accessing selectionEnd on an input element that cannot have a selection." on Chrome
				}
			}
		}
		v = partial.length === 0
			? '{}'
			: '{\n' + partial.join(',\n') + '}';
		return v;
	}
}

JSON.pruned = function (value, depthDecr, arrayMaxLength) {
	seen = [];
	depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
	arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
	return str('', {'': value}, depthDecr, arrayMaxLength);
};

}());

const global = window || document; // (in browser...)


const OldPromise = global.Promise; 

global.Promise = class Promise extends OldPromise {
  constructor(executor) {
    // do whatever you want here, but must call super()
    
    super(executor); // call native Promise constructor
  }
};

