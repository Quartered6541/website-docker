// Эффект печатной машинки для меняющихся слов
const words = ['приложения', 'быстрее', 'контейнеры', 'эффективно'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');
const typingSpeed = 150;
const deletingSpeed = 100;
const pauseBetweenWords = 2000;
const pauseAfterDeleting = 500;

function typeWriter() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        // Удаляем символы
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Добавляем символы
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    // Если слово полностью напечатано
    if (!isDeleting && charIndex === currentWord.length) {
        speed = pauseBetweenWords;
        isDeleting = true;
    }
    // Если слово полностью удалено
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = pauseAfterDeleting;
    }

    setTimeout(typeWriter, speed);
}

// Скрытие/показ header при прокрутке
let lastScrollTop = 0;
const header = document.getElementById('main-header');
const mobileNavElement = document.getElementById('mobile-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Прокрутка вниз - скрываем header и мобильное меню
        header.style.transform = 'translateY(-100%)';
        if (mobileNavElement.style.display === 'block') {
            mobileNavElement.style.transform = 'translateY(-100%)';
        }
    } else {
        // Прокрутка вверх - показываем header
        header.style.transform = 'translateY(0)';
        if (mobileNavElement.style.display === 'block') {
            mobileNavElement.style.transform = 'translateY(0)';
        }
    }

    lastScrollTop = scrollTop;
});

// Управление бургер-меню
const burgerMenu = document.getElementById('burger-menu');
const mobileNav = document.getElementById('mobile-nav');
let isMenuOpen = false;

burgerMenu.addEventListener('click', function() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        mobileNav.style.display = 'block';
    } else {
        mobileNav.style.display = 'none';
    }
});

// Закрытие мобильного меню при изменении размера окна
window.addEventListener('resize', function() {
    if (window.innerWidth > 1300 && isMenuOpen) {
        mobileNav.style.display = 'none';
        isMenuOpen = false;
    }
});

// Управление выпадающими меню
document.addEventListener('DOMContentLoaded', function() {
    // Запуск анимации печатной машинки только если элемент существует
    if (typewriterElement) {
        typeWriter();
    }

    // Получаем все кнопки выпадающих меню
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            const menu = dropdown.querySelector('.dropdown-menu');

            // Закрываем все остальные меню
            document.querySelectorAll('.dropdown-menu.show').forEach(function(openMenu) {
                if (openMenu !== menu) {
                    openMenu.classList.remove('show');
                }
            });

            // Переключаем текущее меню
            menu.classList.toggle('show');
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(function(menu) {
                menu.classList.remove('show');
            });
        }
    });

    // Управление мобильными выпадающими меню
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    mobileDropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            const arrow = this.querySelector('span');

            // Переключаем видимость подменю
            if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
                dropdownMenu.style.display = 'block';
                arrow.textContent = '▲';
            } else {
                dropdownMenu.style.display = 'none';
                arrow.textContent = '▼';
            }
        });
    });
});
