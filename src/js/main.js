$(document).ready(function() {
    $('.header__burger').click(function(event) {
        $('.header__burger').toggleClass('header__burger--active');
        $('.header__menu').toggleClass('header__menu--active');
        $('body').toggleClass('lock');
    });

    $('.header__link, .btn__link').click(function(event) {
        if (window.innerWidth < 768) {
            $('.header__burger').removeClass('header__burger--active');
            $('.header__menu').removeClass('header__menu--active');
            $('body').removeClass('lock');
        }
    });
});
