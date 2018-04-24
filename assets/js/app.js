// inside out project STEP-105
window.onload = init()

function init() {

    window.addEventListener('scroll', function(e) {
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 300,
            header = document.querySelector("header");
        if (distanceY > shrinkOn) {
            classie.add(header, "smaller");
        } else {
            if (classie.has(header, "smaller")) {
                classie.remove(header, "smaller");
            }
        }
    });


    $.ajax({
        method: 'GET',
        url: 'https://me.tylercbecker.com/wp-json/wp-api-menus/v2/menus/2',
        dataType: 'json',
        success: function(data) {
            $('nav').hide();
            var menu = menuBuilder(data.items);
            $('nav').html(menu).slideDown();
            $('nav li a').click(function() {
                getPage($(this).data("pgid"));
            });
            getPage(74);
            $("#loaderDiv").fadeOut("slow");
        },
        error: function() {
            console.log('all is not good');
        }
    });


$.ajax({
    method: 'GET',
    url: 'http://me.tylercbecker.com/wp-json/wp-api-menus/v2/menus/3',
    dataType: 'json',
    success: function (data) {
        var menu = menuBuilder(data.items, 'genLinks', 'footer-ul');
        $('#genLinks').replaceWith(menu);
        $('#genLinks a').click(function () {
            getPage($(this).data("pgid"));
        });
    },
    error: function() {
        console.log('all is not good');
    }
});
    getPosts();
  }



function menuBuilder(obj, targetEl, classInfo) {
    var theMenu = '';
    if (obj.length > 0) {
        let target = (targetEl)?' id="'+targetEl+'"':'';
        let elClass = (classInfo)?' class="'+classInfo+'"':'';
        theMenu = theMenu + '<ul' +target+''+elClass+'>';
        console.log(theMenu+''+target);
        obj.forEach(function(item) {
            theMenu = theMenu + '<li><a href="#" data-pgid="' + item.object_id + '">' + item.title + '</a>';
            if (item.children) {
                theMenu = theMenu + menuBuilder(item.children);
            }
            theMenu = theMenu + '</li>';
        });
        theMenu = theMenu + '</ul>';
    } else {
        console.log('no data');
    }
    return theMenu;
}

function getPage(obj) {
    $("#loaderDiv").fadeIn("slow");
    $.ajax({
        method: 'GET',
        url: 'https://me.tylercbecker.com/wp-json/wp/v2/pages/' + obj,
        dataType: 'json',
        success: function(data) {
            var pgbuild = '';
            pgbuild = '<section><div class="container">' + data.content.rendered + '</div></section>';
            $("#content").fadeOut(function() {
                $('html').animate({
                    scrollTop: 0
                }, 'slow'); //IE, FF
                $('body').animate({
                    scrollTop: 0
                }, 'slow'); //chrome, don't know if Safari works
                $(this).html(pgbuild).fadeIn();
                $("#loaderDiv").fadeOut("slow");
            });
        },
        error: function() {
            console.log('bad');
        }
    });

}

function getPosts() {
        $("#latestPosts").html('<p id="postLdr"><i class="fa fa=cogs"></i>Loading Posts</p>');
  $.ajax({
      method: 'GET',
      url: 'http://me.tylercbecker.com/wp-json/wp/v2/posts?orderby=date&order=asc&per_page=5',
      dataType: 'json',
      success: function (data) {
          data.forEach(function (item) {
            var myDate = new Date(item.date);

            $("#latestPosts").prepend('<p>' + item.title.rendered + '<span>' +
             myDate.getMonth() + '-' + myDate.getDay() + '-' + myDate.getFullYear() + '</span></p>');

          });
          $("#postLdr").remove();
        },
        error: function (){
          console.log('bad');
        }
      });
  }
