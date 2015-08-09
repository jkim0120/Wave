$(document).on('ready page:load', function() {

  // Canvas Script
  var pointer = $('.pointer');
  var wrapper = $('.canvas-wrapper');
  var canvas = $('.canvas')[0];
  if (canvas != undefined) var ctx = canvas.getContext('2d');
  var startX = 0; var startY = 0;
  var endX = 0; var endY = 0;
  var grad;

  function gradient() {
    grad = ctx.createLinearGradient(startX, startY, endX, endY);
    grad.addColorStop(0.1, 'white');
    grad.addColorStop(1, 'black');
    return grad;
  }

  function line() {
    if (startX != endX && startY != endY) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient();
      ctx.stroke();
    }
  }

  function init() {
    canvas.width = wrapper.width();
    canvas.height = wrapper.height();
  }

  // Tracker Script
  var eventSource = new EventSource(`https://api.particle.io/v1/devices/${ gon.id }/events/?access_token=${ gon.token }`);

  eventSource.addEventListener('Coordinates', function(e) {
    var rawData = JSON.parse(e.data);
    var parsedData = JSON.parse(rawData.data);
    $('.x').html(parsedData.X);
    $('.y').html(parsedData.Y);
    var xPercent = parsedData.X / 10;
    var yPercent = parsedData.Y / 8;

    init();
    pointer.animate({
      'left': xPercent+'%',
      'top': yPercent+'%' },
      {
        duration: 200,
        progress: function() {
          endX = pointer.position().left + 5;
          endY = pointer.position().top + 5;
          line(); },
        complete: function() {
          startX = endX;
          startY = endY; }
      }
    );
  }, false)
})
