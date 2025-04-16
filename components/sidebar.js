// 설정 컴포넌트 임포트
import { settings } from './settings.js';

// 메뉴 데이터 정의
const menuData = {
    menuItems: [
        {
            "id": 1,
            "name": "프로젝트",
            "type": "folder",
            "children": [
                {
                    "id": 11,
                    "name": "프로젝트 1",
                    "type": "folder",
                    "children": [
                        {
                            "id": 111,
                            "name": "문서 1",
                            "type": "file"
                        },
                        {
                            "id": 112,
                            "name": "문서 2",
                            "type": "file"
                        }
                    ]
                },
                {
                    "id": 12,
                    "name": "프로젝트 2",
                    "type": "folder",
                    "children": [
                        {
                            "id": 121,
                            "name": "문서 3",
                            "type": "file"
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "name": "문서",
            "type": "folder",
            "children": [
                {
                    "id": 21,
                    "name": "개인 문서",
                    "type": "folder",
                    "children": []
                },
                {
                    "id": 22,
                    "name": "공유 문서",
                    "type": "folder",
                    "children": []
                }, 
                {
                    "id": 24,
                    "name": "문서 3",
                    "type": "file"
                }
            ]
        },
        {
            "id": 3,
            "name": "설정",
            "type": "folder",
            "children": []
        }
    ]
};

// 트리 메뉴 렌더링 함수
function renderTreeMenu(items, level = 0, parentContainer = null) {
    const container = parentContainer || document.getElementById('tree-menu');
    if (!container) {
        console.error('메뉴 컨테이너를 찾을 수 없음');
        return;
    }

    // 폴더를 먼저, 파일을 나중에 정렬
    items.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type === 'folder' ? -1 : 1;
    });

    items.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.className = `tree-item ${item.type}`;
        itemElement.dataset.id = item.id;
        itemElement.dataset.type = item.type;

        // 폴더인 경우
        if (item.type === 'folder') {
            const hasChildren = item.children && item.children.length > 0;
            
            // 토글 생성
            const toggle = document.createElement('span');
            toggle.className = 'toggle';
            
            // 하위 메뉴가 있는 경우에만 토글 아이콘 표시
            if (hasChildren) {
                toggle.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
            } else {
                toggle.style.visibility = 'hidden';
            }
            
            // 아이콘 생성
            const icon = document.createElement('span');
            icon.className = 'icon';

            // 하위 메뉴 유무에 따라 다른 폴더 아이콘 설정
            if (hasChildren) {
                // 하위 메뉴가 있는 경우 접힌 폴더 아이콘 (토글 시 변경됨)
                icon.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>';
            } else {
                // 하위 메뉴가 없는 경우 문서 폴더 아이콘 (변경되지 않음)
                icon.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>';
            }
            
            // 이름 생성
            const name = document.createElement('span');
            name.className = 'name';
            name.textContent = item.name;
            
            // 요소 순서: 토글 > 아이콘 > 이름
            itemElement.appendChild(toggle);
            itemElement.appendChild(icon);
            itemElement.appendChild(name);
            
            // 부모 컨테이너에 항목 추가
            container.appendChild(itemElement);
            
            // 하위 메뉴가 있는 경우만 확장/축소 기능 추가
            if (hasChildren) {
                // 자식 컨테이너 생성
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'children hidden';
                childrenContainer.dataset.parentId = item.id;
                
                // 토글 클릭 이벤트
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    childrenContainer.classList.toggle('hidden');
                    toggle.classList.toggle('rotate-90');
                    
                    // 하위 메뉴가 있는 경우에만 폴더 아이콘 변경
                    if (hasChildren) {
                        if (childrenContainer.classList.contains('hidden')) {
                            // 닫힌 폴더 아이콘
                            icon.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>';
                        } else {
                            // 열린 폴더 아이콘
                            icon.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>';
                        }
                    }
                    // 하위 메뉴가 없는 경우 아이콘 변경 없음
                });
                
                // 항목 클릭으로 토글하기
                itemElement.addEventListener('click', (e) => {
                    if (e.target === itemElement || e.target === name || e.target === icon) {
                        toggle.click();
                    }
                });
                
                // 자식 컨테이너 추가
                container.appendChild(childrenContainer);
                
                // 자식 메뉴 렌더링
                renderTreeMenu(item.children, level + 1, childrenContainer);
            }
        } 
        // 파일인 경우
        else {
            // 아이콘 자리 빈 공간 추가 (정렬용)
            const spacer = document.createElement('span');
            spacer.className = 'toggle';
            spacer.style.visibility = 'hidden';
            
            // 아이콘 생성
            const icon = document.createElement('span');
            icon.className = 'icon';
            icon.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>';
            
            // 이름 생성
            const name = document.createElement('span');
            name.className = 'name';
            name.textContent = item.name;
            
            // 요소 배치: 스페이서 > 아이콘 > 이름
            itemElement.appendChild(spacer);
            itemElement.appendChild(icon);
            itemElement.appendChild(name);
            
            // 부모 컨테이너에 항목 추가
            container.appendChild(itemElement);
        }

        // 항목에 컨텍스트 메뉴 이벤트 추가
        itemElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, item);
        });
    });
}

// 컨텍스트 메뉴 표시 함수
function showContextMenu(e, item) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'fixed bg-gray-700 text-white rounded shadow-lg py-1 z-50';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'block w-full text-left px-4 py-2 hover:bg-gray-600';
    deleteButton.textContent = '삭제';
    
    deleteButton.addEventListener('click', () => {
        if (item.type === 'folder' && item.children && item.children.length > 0) {
            if (confirm('하위 메뉴가 있습니다. 정말 삭제하시겠습니까?')) {
                deleteItem(item.id);
            }
        } else {
            deleteItem(item.id);
        }
        contextMenu.remove();
    });

    contextMenu.appendChild(deleteButton);
    document.body.appendChild(contextMenu);

    const closeMenu = () => {
        contextMenu.remove();
        document.removeEventListener('click', closeMenu);
    };

    document.addEventListener('click', closeMenu);
}

// 아이템 삭제 함수
function deleteItem(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.remove();
    }
    const childrenContainer = document.querySelector(`[data-parent-id="${id}"]`);
    if (childrenContainer) {
        childrenContainer.remove();
    }
}

// 검색 기능 구현
function searchItems(searchTerm) {
    // 모든 트리 아이템 선택
    const treeItems = document.querySelectorAll('.tree-item');
    
    // 검색어가 비어있으면 모든 항목 표시
    if (!searchTerm.trim()) {
        treeItems.forEach(item => {
            item.style.display = '';
        });
        return;
    }
    
    // 검색어와 일치하는 항목만 표시
    treeItems.forEach(item => {
        const name = item.querySelector('.name').textContent.toLowerCase();
        if (name.includes(searchTerm.toLowerCase())) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 새 폴더 생성 함수
function createNewFolder(folderName) {
    if (!folderName.trim()) return;
    
    // 새 폴더 ID 생성 (기존 ID 중 최대값 + 1)
    let maxId = 0;
    document.querySelectorAll('.tree-item').forEach(item => {
        const id = parseInt(item.dataset.id);
        if (id > maxId) maxId = id;
    });
    
    const newFolderId = maxId + 1;
    
    // 새 폴더 객체 생성
    const newFolder = {
        id: newFolderId,
        name: folderName,
        type: 'folder',
        children: []
    };
    
    // 루트에 새 폴더 추가
    menuData.menuItems.push(newFolder);
    
    // 트리 메뉴 다시 렌더링
    const treeMenu = document.getElementById('tree-menu');
    treeMenu.innerHTML = '';
    renderTreeMenu(menuData.menuItems);
}

// 폴더 생성 모달 표시
function showCreateFolderModal() {
    // 이미 모달이 있다면 제거
    const existingModal = document.getElementById('create-folder-modal');
    if (existingModal) existingModal.remove();
    
    // 모달 배경 생성
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modalOverlay.id = 'create-folder-modal';
    
    // 모달 컨텐츠 생성
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gray-800 rounded-lg p-6 w-80';
    
    // 모달 제목
    const modalTitle = document.createElement('h3');
    modalTitle.className = 'text-white text-lg font-medium mb-4';
    modalTitle.textContent = '새 폴더 만들기';
    
    // 입력 필드
    const inputContainer = document.createElement('div');
    inputContainer.className = 'mb-4';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'folder-name-input';
    input.className = 'bg-gray-700 text-white w-full px-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white ring-2 ring-white appearance-none';
    input.placeholder = '폴더 이름을 입력하세요';
    
    inputContainer.appendChild(input);
    
    // 버튼 컨테이너
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-end space-x-2';
    
    // 취소 버튼
    const cancelButton = document.createElement('button');
    cancelButton.className = 'px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600';
    cancelButton.textContent = '취소';
    cancelButton.addEventListener('click', () => {
        modalOverlay.remove();
    });
    
    // 생성 버튼
    const createButton = document.createElement('button');
    createButton.className = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500';
    createButton.textContent = '생성';
    createButton.addEventListener('click', () => {
        const folderName = input.value;
        createNewFolder(folderName);
        modalOverlay.remove();
    });
    
    // 엔터 키 이벤트 추가
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            createButton.click();
        }
    });
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(createButton);
    
    // 모달에 요소 추가
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(inputContainer);
    modalContent.appendChild(buttonContainer);
    modalOverlay.appendChild(modalContent);
    
    // 모달 표시
    document.body.appendChild(modalOverlay);
    
    // 입력 필드에 포커스
    setTimeout(() => {
        input.focus();
    }, 100);
}

// 사이드바 초기화 함수
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('사이드바 요소를 찾을 수 없음');
        return;
    }

    // CSS 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        #sidebar {
            transition: all 0.3s ease-in-out;
            will-change: width, opacity, margin-left;
        }
        #sidebar-toggle-container {
            transition: all 0.3s ease-in-out;
            will-change: transform;
        }
        #show-sidebar-btn {
            transition: opacity 0.3s ease;
            cursor: pointer;
            z-index: 1000;
        }
        #settings-container {
            flex: 1;
        }
        /* 중요: 사이드바가 숨겨졌을 때 버튼 표시 */
        .sidebar-hidden ~ #show-sidebar-btn {
            display: flex !important;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    const savedWidth = localStorage.getItem('sidebarWidth');
    sidebar.style.width = savedWidth ? `${savedWidth}px` : '256px';

    // 메뉴 트리 렌더링
    renderTreeMenu(menuData.menuItems);
    
    // 검색 기능 초기화
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchItems(e.target.value);
        });
    }
    
    // 폴더 추가 버튼 초기화
    const addFolderBtn = document.getElementById('add-folder-btn');
    if (addFolderBtn) {
        addFolderBtn.addEventListener('click', () => {
            showCreateFolderModal();
        });
    }

    // 설정 컴포넌트 초기화 (settings.js에서 가져온 함수 사용)
    const settingsContainer = document.getElementById('settings-container');
    if (settingsContainer) {
        settings.create(settingsContainer);
    }

    // 사이드바 토글 기능 초기화
    initSidebarToggle();
    
    // 설정 스타일 시트 로드
    loadStylesheet('/assets/styles/settings.css');
}

// 스타일시트 로드 함수
function loadStylesheet(path) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    document.head.appendChild(link);
}

// 사이드바 토글 기능 초기화 함수
function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const showSidebarBtn = document.getElementById('show-sidebar-btn');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    
    // 토글 컨테이너 위치 고정 (항상 같은 위치에 유지)
    sidebarToggleContainer.style.position = 'fixed';
    sidebarToggleContainer.style.left = '15px'; // 5px 우측으로 이동
    sidebarToggleContainer.style.bottom = '15px'; // 5px 위로 이동
    
    // 로컬 스토리지에서 사이드바 상태 확인
    const isSidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
    
    // 초기 상태 설정
    if (isSidebarHidden) {
        sidebar.style.width = '0';
        sidebar.style.opacity = '0';
        sidebar.style.marginLeft = '-256px';
        sidebar.style.overflow = 'hidden';
        showSidebarBtn.classList.remove('hidden');
        
        // 아이콘 변경 (숨겨진 상태)
        sidebarToggleBtn.innerHTML = `
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
        `;
        
        // 외부 버튼 아이콘 크기 일치
        showSidebarBtn.innerHTML = `
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
        `;
    } else {
        // 사이드바 표시 - 저장된 너비 사용
        const savedWidth = localStorage.getItem('sidebarWidth');
        sidebar.style.width = savedWidth ? `${savedWidth}px` : '256px'; // 저장된 너비 또는 기본값 사용
        sidebar.style.opacity = '1';
        sidebar.style.marginLeft = '0'; // 원래 위치로 복원
        sidebar.style.overflow = 'auto'; // 내용 스크롤 가능
        showSidebarBtn.classList.add('hidden');
        
        // 아이콘 변경 (표시된 상태)
        sidebarToggleBtn.innerHTML = `
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
        `;
        
        // 외부 버튼 아이콘 크기 일치
        showSidebarBtn.innerHTML = `
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
        `;
    }
    
    // 사이드바 내부 토글 버튼 클릭 이벤트
    sidebarToggleBtn.addEventListener('click', () => toggleSidebar(true));
    
    // 사이드바 표시 버튼 클릭 이벤트
    showSidebarBtn.addEventListener('click', () => toggleSidebar(false));
}

// 사이드바 토글 함수 개선
function toggleSidebar(hide) {
    const sidebar = document.getElementById('sidebar');
    const showSidebarBtn = document.getElementById('show-sidebar-btn');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarToggleContainer = document.getElementById('sidebar-toggle-container');
    
    if (hide) {
        // 사이드바 숨기기 (너비를 0으로 하지만 완전히 숨기지 않음)
        sidebar.style.width = '0';
        sidebar.style.opacity = '0'; 
        sidebar.style.marginLeft = '-256px'; // 왼쪽으로 이동시켜 화면에서 완전히 제거
        sidebar.style.overflow = 'hidden'; // 내용이 튀어나오지 않도록
        
        // 토글 컨테이너 위치 유지 (위치 고정)
        sidebarToggleContainer.style.position = 'fixed';
        sidebarToggleContainer.style.left = '15px'; // 5px 우측으로 이동
        sidebarToggleContainer.style.bottom = '15px'; // 5px 위로 이동
        
        // 보이기 버튼 표시 (위치 계산 제거)
        showSidebarBtn.classList.remove('hidden');
        
        // 내부 아이콘 변경
        sidebarToggleBtn.innerHTML = `
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
        `;
        
        // 외부 버튼 아이콘 크기 일치
        showSidebarBtn.innerHTML = `
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
        `;
        
        // 로컬 스토리지에 상태 저장
        localStorage.setItem('sidebarHidden', 'true');
    } else {
        // 사이드바 표시 - 저장된 너비 사용
        const savedWidth = localStorage.getItem('sidebarWidth');
        sidebar.style.width = savedWidth ? `${savedWidth}px` : '256px'; // 저장된 너비 또는 기본값 사용
        sidebar.style.opacity = '1';
        sidebar.style.marginLeft = '0'; // 원래 위치로 복원
        sidebar.style.overflow = 'auto'; // 내용 스크롤 가능
        
        // 토글 컨테이너 위치 유지 (위치 고정)
        sidebarToggleContainer.style.position = 'fixed';
        sidebarToggleContainer.style.left = '15px'; // 5px 우측으로 이동
        sidebarToggleContainer.style.bottom = '15px'; // 5px 위로 이동
        
        // 보이기 버튼 숨김
        showSidebarBtn.classList.add('hidden');
        
        // 아이콘 변경
        sidebarToggleBtn.innerHTML = `
            <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
        `;
        
        // 외부 버튼 아이콘 크기 일치
        showSidebarBtn.innerHTML = `
            <svg class="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
        `;
        
        // 로컬 스토리지에 상태 저장
        localStorage.setItem('sidebarHidden', 'false');
    }
}

// 사이드바 템플릿
const sidebarTemplate = `
    <div class="sidebar-wrapper relative">
        <aside class="sidebar h-full flex-shrink-0 no-drag overflow-y-auto custom-scrollbar flex flex-col transition-all duration-300 ease-in-out" id="sidebar" style="background-color: #2b2d30;">
            <div class="p-4 text-white flex-grow">
                <!-- 검색 영역 -->
                <div class="relative mb-4">
                    <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <div class="w-4 h-4 flex items-center justify-center text-white">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <input type="text" id="search-input" class="w-full pl-10 pr-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white appearance-none" placeholder="검색어를 입력하세요">
                </div>
                
                <!-- 폴더 섹션 -->
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-sm font-medium">Folder</h2>
                    <button id="add-folder-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors">
                        <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke-width="2" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8" />
                        </svg>
                    </button>
                </div>
                
                <!-- 트리 메뉴 영역 -->
                <div id="tree-menu" class="space-y-2"></div>
            </div>
            
            <!-- 하단 설정 영역 -->
            <div class="p-3 border-t border-gray-700 relative flex justify-between items-center">
                <!-- 설정 컴포넌트가 여기에 추가됩니다 -->
                <div id="settings-container" class="flex-1"></div>
                
                <!-- 사이드바 토글 버튼 추가 -->
                <button id="sidebar-toggle-btn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors">
                    <svg class="w-5 h-5" style="color: var(--sidebar-toggle-icon);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </aside>
    </div>
    
    <!-- 사이드바 보이기 버튼 - 화면 하단에 고정 -->
    <div id="sidebar-toggle-container" class="fixed left-[15px] bottom-[15px] z-50 transition-all duration-300 ease-in-out">
        <button id="show-sidebar-btn" class="text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors hidden" style="background-color: var(--sidebar-toggle-bg);">
            <svg class="w-5 h-5" style="color: var(--sidebar-toggle-icon);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
        </button>
    </div>
`;

// 사이드바 객체 내보내기 수정
export const sidebar = {
    template: sidebarTemplate,
    init: initSidebar
};