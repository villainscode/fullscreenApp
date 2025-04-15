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

// 사이드바 초기화 함수
function initSidebar() {
    console.log('사이드바 초기화 시작');
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('사이드바 요소를 찾을 수 없음');
        return;
    }

    const savedWidth = localStorage.getItem('sidebarWidth');
    sidebar.style.width = savedWidth ? `${savedWidth}px` : '256px';

    // 메뉴 트리 렌더링
    console.log('메뉴 트리 렌더링 시작');
    renderTreeMenu(menuData.menuItems);
    console.log('메뉴 트리 렌더링 완료');
}

// 사이드바 객체 내보내기
export const sidebar = {
    template: `
        <aside class="sidebar h-full bg-gray-800 flex-shrink-0 no-drag overflow-y-auto custom-scrollbar" id="sidebar">
            <div class="p-4 text-white">
                <h2 class="text-xl font-bold mb-4">메뉴</h2>
                <div id="tree-menu" class="space-y-2"></div>
            </div>
        </aside>
    `,
    init: initSidebar
};