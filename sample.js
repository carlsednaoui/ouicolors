var colors = {
  salesforce: ['344A5F', '2A94D6', 'F0F1F2', 'FFFFFF', '4EB1CB', 'CF5C60', '717ECD', '4AB471', 'F3AE4E', 'D96383'],
  flatuicolors: ['2FD1AF', '1ABC9C', '19B698', '16A085', '40D47E', '2ECC71', '2CC36B', '27AE60', '4AA3DF', '3498DB', '2E8ECE', '2980B9', 'A66BBE', '9B59B6', '9B50BA', '8E44AD', '3D566E', '34495E', '354B60', '2C3E50', 'F2CA27', 'F1C40F', 'F4A62A', 'F39C12', 'E98B39', 'E67E22', 'EC5E00', 'D35400', 'EA6153', 'E74C3C', 'D14233', 'C0392B', 'FBFCFC', 'ECF0F1', 'CBD0D3', 'BDC3C7', 'A3B1B2', '95A5A6', '8C9899', '8C9899' ]
};

$.each(colors, function(key, value) {
  var listTitle = document.createElement('h2');
  listTitle.innerHTML = key;
  $('#colorList').append(listTitle);

  var list = document.createElement('ul');
  $.each(value, function(i, color) {
    var item = document.createElement('li');
    item.innerHTML = '<p>#' + color + '</p>';
    
    $(item).css({'background-color': '#' + color});
    $(list).append(item);  
  });
  $('#colorList').append(list);
});

$('#toggle').on('click', function() {
  $('body').toggleClass('light');
});
