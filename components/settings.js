// 글꼴 크기 적용 함수
function applyFontSize(size) {
    // 사이드바 글꼴 크기 변경
    const treeItems = document.querySelectorAll('.tree-item .name');
    const searchInput = document.getElementById('search-input');
    
    // 사이드바 내 트리 항목
    treeItems.forEach(item => {
        item.style.fontSize = `${size}pt`;
    });
    
    // 검색 입력창
    if (searchInput) {
        searchInput.style.fontSize = `${size}pt`;
    }
    
    // 콘텐츠 영역 (헤더와 푸터 제외)
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        const contentElements = contentArea.querySelectorAll('p, h1, h2, h3, span, div:not(header *, footer *)');
        contentElements.forEach(element => {
            // 헤더와 푸터 요소가 아닌 경우에만 크기 변경
            if (!element.closest('header') && !element.closest('footer')) {
                element.style.fontSize = `${size}pt`;
            }
        });
    }
}

// 설정 메뉴 표시 함수
function toggleSettingsMenu(e) {
    // 이벤트 전파 중단
    if (e) {
        e.stopPropagation();
    }
    
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu.style.display === 'none' || settingsMenu.classList.contains('hidden')) {
        settingsMenu.style.display = 'block';
        settingsMenu.classList.remove('hidden');
    } else {
        settingsMenu.style.display = 'none';
        settingsMenu.classList.add('hidden');
    }
}

// 설정 초기화 함수
function initSettings() {
    // 외부 스타일시트 확인 및 로드
    const settingsStylesheet = document.querySelector('link[href*="settings.css"]');
    if (!settingsStylesheet) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'assets/styles/settings.css';
        document.head.appendChild(link);
    }
    
    // 저장된 글꼴 크기 적용
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 14;
    applyFontSize(savedFontSize);
    
    // 설정 버튼 초기화
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            // 이벤트 객체 전달
            toggleSettingsMenu(e);
        });
    }
    
    // 설정 메뉴 내부 클릭 시 이벤트 전파 중단
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu) {
        settingsMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // 화면 클릭 시 설정 메뉴 닫기
    document.addEventListener('click', (e) => {
        const settingsMenu = document.getElementById('settings-menu');
        // settingsBtn 제외 조건은 유지 (settingsBtn은 자체 핸들러에서 처리)
        if (settingsMenu && (settingsMenu.style.display === 'block' || !settingsMenu.classList.contains('hidden'))) {
            settingsMenu.style.display = 'none';
            settingsMenu.classList.add('hidden');
        }
    });
    
    // 글꼴 크기 조절 기능 초기화
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    const currentFontSize = document.getElementById('current-font-size');

    // 로컬 스토리지에서 저장된 글꼴 크기 불러오기
    let fontSize = parseInt(localStorage.getItem('fontSize')) || 14;
    currentFontSize.textContent = `${fontSize}pt`;

    // 초기 글꼴 크기 적용
    applyFontSize(fontSize);

    // 글꼴 크기 감소 버튼
    if (fontSizeDecrease) {
        fontSizeDecrease.addEventListener('click', () => {
            if (fontSize > 8) { // 최소 크기 제한
                fontSize -= 1;
                currentFontSize.textContent = `${fontSize}pt`;
                applyFontSize(fontSize);
                localStorage.setItem('fontSize', fontSize.toString());
            }
        });
    }

    // 글꼴 크기 증가 버튼
    if (fontSizeIncrease) {
        fontSizeIncrease.addEventListener('click', () => {
            if (fontSize < 24) { // 최대 크기 제한
                fontSize += 1;
                currentFontSize.textContent = `${fontSize}pt`;
                applyFontSize(fontSize);
                localStorage.setItem('fontSize', fontSize.toString());
            }
        });
    }
    
    // 테마 버튼 초기화
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');
    
    if (lightThemeBtn && darkThemeBtn) {
        // 저장된 테마 값을 확인
        const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        
        // 초기 상태 설정
        updateThemeButtonsState(isDarkTheme);
        
        // 라이트 테마 버튼 클릭 이벤트
        lightThemeBtn.addEventListener('click', () => {
            updateThemeButtonsState(false);
            applyTheme(false);
            localStorage.setItem('darkTheme', 'false');
        });
        
        // 다크 테마 버튼 클릭 이벤트
        darkThemeBtn.addEventListener('click', () => {
            updateThemeButtonsState(true);
            applyTheme(true);
            localStorage.setItem('darkTheme', 'true');
        });
    }
}

// 테마 적용 함수
function applyTheme(isDarkTheme) {
    const body = document.body;
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    }
}

// 테마 버튼 상태 업데이트 함수
function updateThemeButtonsState(isDarkTheme) {
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');
    
    if (isDarkTheme) {
        darkThemeBtn.classList.add('active');
        lightThemeBtn.classList.remove('active');
    } else {
        lightThemeBtn.classList.add('active');
        darkThemeBtn.classList.remove('active');
    }
}

// 설정 메뉴 HTML 템플릿
function getSettingsTemplate() {
    return `
        <div class="flex items-center relative">
            <button id="settings-btn" class="settings-btn">
                <svg class="settings-svg-icon" viewBox="0 0 24 24">
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </button>
            
            <!-- 설정 메뉴 레이어 -->
            <div id="settings-menu" class="settings-menu hidden" style="display: none;">
                <div class="settings-title">테마 설정</div>
                <div class="theme-toggle-container">
                    <div class="theme-icons-container">
                        <button id="light-theme-btn" class="theme-icon-btn" title="라이트 모드">
                            <svg class="settings-svg-icon" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        </button>
                        <button id="dark-theme-btn" class="theme-icon-btn active" title="다크 모드">
                            <svg class="settings-svg-icon" viewBox="0 0 24 24">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- 글꼴 크기 설정 추가 -->
                <div class="font-size-section">
                    <div class="settings-title mb-2">글꼴 크기</div>
                    <div class="font-size-controls">
                        <button id="font-size-decrease" class="font-size-btn">
                            <svg class="settings-svg-icon" viewBox="0 0 24 24">
                                <path d="M20 12H4"></path>
                            </svg>
                        </button>
                        <span id="current-font-size" class="current-font-size">14pt</span>
                        <button id="font-size-increase" class="font-size-btn">
                            <svg class="settings-svg-icon" viewBox="0 0 24 24">
                                <path d="M12 4v16m-8-8h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 설정 컴포넌트 초기화와 설정 메뉴 추가
function createSettingsComponent(container) {
    if (!container) return;
    
    // 설정 메뉴 추가
    container.innerHTML = getSettingsTemplate();
    
    // 설정 초기화
    initSettings();
}

// 설정 기능 내보내기
export const settings = {
    init: initSettings,
    create: createSettingsComponent,
    applyFontSize: applyFontSize,
    toggleMenu: toggleSettingsMenu
}; 