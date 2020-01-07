// Interactive floorplan
// Riccardo Gagliarducci @ Accademia Sironi
// v.0.1

/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
Lesser GNU General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//// TODO:
// select / add to selection / deselect action
// search, using selections


var interfloorplan = (function(g){

  console.log('Hello Sironi!');


	var floorplan = {};


	//Svg tspan function
	function svgTspan(svg, id, content, x, y) {

	  var aTspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');

		aTspan.textContent = content;
		aTspan.setAttributeNS(null, "class", "descrText");
		aTspan.setAttributeNS(null, "id", id);
		aTspan.setAttributeNS(null, "x", x);
		aTspan.setAttributeNS(null, "y", y);

	  return aTspan;
	}






  /**
   * Creates a button
   * id     string  the id of the created element
   * title  string  the title  of the created element
   * function  string  the name of the function to call when clicked
   */
  function createButton(id, title, func) {
      var button = document.createElement("input");
      button.id=id;
      button.type = "button";
      button.value = title;
      button.onclick = func;
      return button;
  }

  /**
   * Creates a input
   * id     string  the id of the created element
   * name  string  the name  of the created element
   */
  function createInput(id, name) {
      var inputF = document.createElement("input");
      inputF.id=id;
      inputF.type = "text";
      inputF.name = name;
      return inputF;
  }


  /**
   * Creates a form
   * id     string  the id of the created element
   */
  function createForm(id) {
      var form = document.createElement("form");
      form.id=id;
      return form;
  }


  /**
   * Creates the interface for interaction with the plan
   * context object the ui parent element
   * name string  the name for the interface
   */
  function createInterface(context, name) {

    var form = createForm( name+"-form-debuh" );

    var collapseButton = createButton( name+"collapse-button", "Collassa", createForm );
    var restoreButton = createButton( name+"collapse-button", "Ripristina", createForm );

    var classroomInput = createInput( name+"floorplan-search", "Cerca aule" );
    var floorInput = createInput( name+"show-floor", "Mostra piano" );

    form.appendChild( collapseButton );
    form.appendChild( restoreButton );
    form.appendChild( document.createElement('br') )
    form.appendChild( document.createTextNode("Cerca: ")  );
    form.appendChild( classroomInput );
    form.appendChild( document.createTextNode("Mostra: ")  );
    form.appendChild( floorInput );
    context.appendChild( form );

  }


  /**
   * Gets the id from nconf and creates missing elements
   *
   * nconf
   * debug
   */
  function nconfDom(nconf, debug){
    LOG("Debug:", debug);
    LOG("Config", nconf);

    //Set the class maps should have to be parsed
    mapclass = "interfloorplan";

    //Load all maps
    maps=document.getElementsByClassName( mapclass );

    //Looping on each map
    for (let map of maps) {

      //Discover by id the optional ui box
      var ui = document.getElementById( map.id+"-ui" );
      if (ui) {
        LOG("Create ui");
        createInterface(ui, map.id);
      }

    }



    return true;


    if (debug == true) {
      //Get parent Element and use it as context for the interface
      var uiContainer = document.getElementById(nconf.parentElement);
      LOG(uiContainer);
      createInterface(uiContainer);
    }




		//If plan svg exists
		if( document.getElementById('floorplan') ) {

      var formSearch = document.getElementById('form-search');


			var svg = document.getElementById('floorplan').contentDocument;

			//Active elements
			var aule = svg.getElementsByClassName('aula');
      var floors = svg.getElementsByClassName("floor");

      //Search behaviour
      var searchInput = document.getElementById('floorplan-search');
      //Show behaviour
      var showInput = document.getElementById('show-floor');

      //Mouse hover behaviour
			for (let aula of aule) {

				//Create text when mouse over
				aula.addEventListener('mouseover', function() {

						var content = this.dataset.use;
						var parent = this.parentElement;
						var label = parent.getElementsByClassName('piano');

						var labelText = label[0].firstChild;
						var x = labelText.getAttribute('x');
						var y = labelText.getAttribute('y');

						aChild = svgTspan(svg, 'currentHover', content, x, parseInt(y)+12);
						label[0].appendChild(aChild);
				});

				//Remove text when leaving
				aula.addEventListener('mouseleave', function() {

					var parent = this.parentElement;
					var label = parent.getElementsByClassName('piano');

					var removeme = svg.getElementById('currentHover');

					label[0].removeChild(removeme);

				});

			}; //For aule


      //Event  writing
      searchInput.addEventListener('keyup', function() {

        if (searchInput.value.length > 1) {

          var iSearch = searchInput.value.toUpperCase()

          for (let aula of aule) {

            var aulaId = aula.id.toUpperCase();
            var aulaUse = aula.dataset.use.toUpperCase();

            //Clear all
            aula.classList.remove( "selected");

            //Seach in id and in data-use
            if( aulaId.indexOf(iSearch) > -1 || aulaUse.indexOf(iSearch) > -1 ) {

              aula.classList.add( "selected");

            }
          }
        } else {
          for (let aula of aule) {
            aula.classList.remove( "selected");
          }
        }
      });


      //Displace behaviour
      //Collapse
      function collapseFloor(){

        for (let foor of floors) {
          deltax=50;
          deltay=-800;
          foor.transform.baseVal.getItem(0).setTranslate(deltax,deltay);
        }

      };

      //Restore
      function restoreFloor(){

        for (let foor of floors) {
          posx=foor.dataset.posx;
          posy=foor.dataset.posy;
          foor.transform.baseVal.getItem(0).setTranslate(posx,posy);
        }

      };


      //Event  writing
      showInput.addEventListener('keyup', function() {

        if (showInput.value.length > 1) {

          collapseFloor();

          var iSearch = showInput.value.toUpperCase()

          for (let floor of floors) {

            var floorId = floor.id.toUpperCase();

            //Clear all
            floor.style.display = 'none';

            //Seach in id and in data-use
            if( floorId.indexOf(iSearch) > -1 ) {

              floor.style.display = 'inline';

            }
          }
        } else {
          for (let floor of floors) {
            floor.style.display = 'inline';
          }
          restoreFloor();
        }
      });


		} //If floorplan

	};




/**
* Init part ___________________________________________________________________
*/

    /**
     * Check if variable is a string, whether created as
     * var a = "string"
     * or
     * var a = new String("string")
     *
     * x  string  the string to test
     */
    function isString(x) {
      return Object.prototype.toString.call(x) === "[object String]"
    }


    /**
     * Retrieve the configuration by XMLHttpRequest
     * URL  string  The url where the configuration is stored
     * debug bool Indicates whether to print debug info
     */
    function getConfig(URL, debug){

      //Reclaring local used variable
      var req;

      //Creating a XHR object
      req=new XMLHttpRequest();
      //Initializing the request
      req.open("GET",URL,true);
      //Send a default asynchronous request
      req.send();
      //If returns an error
      req.onerror = function () {
        LOG("Error during configuration request.");
      };

      //When the state of the communication chages, this event is fired: readyState contains the current state.
      req.onreadystatechange = function () { //Courtesy of https://www.mattlunn.me.uk/blog/2011/11/handling-an-ajax-response-in-javascript-with-or-without-jquery/

        LOG("Req state: ", this.readyState)//Status from 1 to 4

        if (this.readyState == 4) { // If the HTTP request has completed
          if (this.status == 200) { // If the HTTP response code is 200 (e.g. successful)
            var result = JSON.parse(this.responseText); // Retrieve the response text
            //Result not empty
            if (result){
              //Fires the config loading
              nconfDom(result, debug);
            } else {
              LOG("Error state: ", 11); //Custom error
            };
          } else {
            LOG("Error state: ", 10); //Custom error
          };
        };// ready 4
      };
    };


/**
* Public part _________________________________________________________________
*/


  // Return a public object
  return {

    /**
     * Load configuration objects
     */
    load: function (nconf=defConf, debug=false) {

      //Disabling console when debug is disabled (default)
      //Use LOG() instead of console.log() in this script
      LOG = debug ? console.log.bind(console) : function () {};

      //If is string should be an address where to retrieve the configuration
      if ( isString(nconf) ) {

        LOG( "Loading configuration...");

        //Load config before nconfDom()
        //Debug is not a global param to be able to debug a single function
        getConfig(nconf, debug);

      } else {

        //Directly skip the loading
        nconfDom(nconf, debug);

      }
    }

    //TODO B provide a destroy method

  }


})(window);
