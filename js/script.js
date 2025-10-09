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

// Скрытие/показ header отключено - header теперь статичный

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

// Активное подсвечивание TOC при прокрутке
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.content-section-block[id]');

    if (sections.length === 0 || tocLinks.length === 0) return;

    function highlightActiveSection() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Плавная прокрутка при клике на ссылки TOC
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
}

// Добавление класса при прокрутке для header
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Управление выпадающими меню
document.addEventListener('DOMContentLoaded', function() {
    // Запуск анимации печатной машинки только если элемент существует
    if (typewriterElement) {
        typeWriter();
    }

    // Инициализация Table of Contents
    initTableOfContents();

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

    // Функция копирования кода
    const copyButtons = document.querySelectorAll('.code-copy-btn');

    copyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block-container').querySelector('code');
            const textToCopy = codeBlock.textContent;

            // Копирование в буфер обмена
            navigator.clipboard.writeText(textToCopy).then(function() {
                // Изменение текста кнопки
                const originalText = button.textContent;
                button.textContent = '✓ Скопировано';
                button.classList.add('copied');

                // Возврат к исходному состоянию через 2 секунды
                setTimeout(function() {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('Ошибка при копировании: ', err);
            });
        });
    });
});

// Кнопка "Вверх" для мобильных устройств
const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    // Показываем кнопку при прокрутке вниз на 300px
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Плавная прокрутка наверх при клике
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
