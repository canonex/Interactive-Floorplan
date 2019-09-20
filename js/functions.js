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

	//Starting here
	g.onload = function(){

		//If plan obj exists
		if( document.getElementById('floorplan') ) {

			var svg = document.getElementById('floorplan').contentDocument;

			//Active elements
			var aule = svg.getElementsByClassName('aula');

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

			}
		}
	};

})(window);
