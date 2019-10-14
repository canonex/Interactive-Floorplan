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


(function(g){

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


  //Create a button
  function createButton(context, id, title, func) {
      var button = document.createElement("input");
      button.id=id;
      button.type = "button";
      button.value = title;
      button.onclick = func;
      context.appendChild(button);
  }


	//Starting here
	g.onload = function(){

		//If plan obj exists
		if( document.getElementById('floorplan') ) {


      var formSearch = document.getElementById('form-search');
      createButton(formSearch, "collapse-button", "Collassa", collapseFloor);
      createButton(formSearch, "collapse-button", "Ripristina", restoreFloor);

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

})(window);
