$(function(){
	$('body').append('<div id="clipjs">');
	$('body').append('<button id="captureBtn">Capture Feedback</button>');
	$('#clipjs').append('<div id="feedControl"><button id="cancelBtn">Cancel</button><button id="saveBtn">Save</button></div>');

	$(document).on('click','#captureBtn',function(){
		$("#captureBtn").hide();
		$("#clipjs").append('<canvas id="captureCanvas">');
		$("body").addClass("overflow-disable");

		html2canvas(document.body, {
			allowTaint: true,
			onrendered: function(canvas) {
				console.log(document.body.scrollHeight);
				var extra_canvas = document.createElement('canvas');
             	extra_canvas.setAttribute('width', document.body.scrollWidth);
             	extra_canvas.setAttribute('height', document.body.scrollHeight);
        		var ctx = extra_canvas.getContext('2d');
             	ctx.drawImage(canvas, 0, 0, document.body.scrollWidth, document.body.scrollHeight);
             	var myImage = extra_canvas.toDataURL("image/jpg");
             	var image = new Image();
             	image.src = myImage;
				// Invoked when the picture is loaded
				image.onload = function (event) {

					// Display screenShot
					var screenShot = new createjs.Bitmap(event.target) ;
					stage.addChild(screenShot);
					stage.update();

					enableDrag(screenShot);
					
				}

			  	$("#clipjs").fadeIn(200);

			    init();
			}
		});

	}).on('click',"#cancelBtn",function(){
		$("#clipjs").fadeOut(200,function(){
			$("canvas",this).remove();
			$("#captureBtn").fadeIn(200);
			$("body").removeClass("overflow-disable");
		});

	}).on('click',"#saveBtn",function(){
		exportAndSaveCanvas();
	})
})

var canvas;
var stage;

/**
	 * Init 
	 */
	function init() {
		
		canvas = document.getElementById("captureCanvas");
		stage = new createjs.Stage(canvas);

		// Enable touch support
		if (createjs.Touch.isSupported()) { createjs.Touch.enable(stage); }

		displayLabel();
		
	}


	/**
	 * Display Label
	 */
	displayLabel = function () {

		// Create a new Text object and a rectangle Shape object, and position them inside a container
		var container = new createjs.Container();
		container.x = 400;
		container.y = 80;
		container.rotation = 45;

		var target = new createjs.Shape();
		target.graphics.beginFill("#F00").drawRect(-10,-10,180,60).beginFill("#FFF");
		container.addChild(target);

		var txt = new createjs.Text("Monalisa", "36px Arial", "#FFF");
		txt.textBaseline = "top";
		container.addChild(txt);

		stage.addChild(container);

		// Enable drag'n'drop
		enableDrag(container)

	}

	/**
	 * Display Monalisa
	 */
	displayScreenShot = function () {

		var image = new Image();
		image.src = img;
		
		// Invoked when the picture is loaded
		image.onload = function (event) {

			// Display screenShot
			var screenShot = new createjs.Bitmap(event.target) ;
			stage.addChild(screenShot);
			stage.update();
			
		}


	}


	/**
     * Enable drag'n'drop on DisplayObjects
     */
	enableDrag = function (item) {

		// OnPress event handler
		item.onPress = function(evt) {

			var offset = {	x:item.x-evt.stageX, 
							y:item.y-evt.stageY};

			// Bring to front
			stage.addChild(item);

			// Mouse Move event handler
			evt.onMouseMove = function(ev) {
				
				item.x = ev.stageX+offset.x;
				item.y = ev.stageY+offset.y;
				stage.update();
			}
		}
	}

	/**
     * Export and save the canvas as PNG 
     */
	function exportAndSaveCanvas()  {

		// Get the canvas screenshot as JPEG
		var screenshot = Canvas2Image.saveAsJPEG(canvas, true);

		// This is a little trick to get the SRC attribute from the generated <img> screenshot
		canvas.parentNode.appendChild(screenshot);
		screenshot.id = "canvasimage";		
		data = $('#canvasimage').attr('src');
		canvas.parentNode.removeChild(screenshot);


		// Send the screenshot to PHP to save it on the server
		var url = 'clipjs/upload/export.php';
		$.ajax({ 
		    type: "POST", 
		    url: url,
		    dataType: 'text',
		    data: {
		        base64data : data
		    }
		});



	}

	/**
     * Export and display the canvas as PNG in a new wind	ow
     */
	function exportAndView()  {

		var screenshot = Canvas2Image.saveAsPNG(canvas, true);
		var win = window.open();
		$(win.document.body).html(screenshot );
	}


	// capture screen
	function captureScreen(){
		html2canvas(document.body, {
		  onrendered: function(canvas) {
		    document.body.appendChild(canvas);
		  }
		});
	}