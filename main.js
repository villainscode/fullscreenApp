const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

/**
 * 윈도우 컨트롤 명령 상수
 * 윈도우 컨트롤 관련 IPC 이벤트 이름 정의
 */
const WINDOW_COMMANDS = {
    MINIMIZE: 'minimize-window',
    MAXIMIZE: 'maximize-window',
    CLOSE: 'close-window'
};

/**
 * 메인 윈도우 관리를 담당하는 클래스
 * 윈도우 생성, 표시, 컨트롤 이벤트 처리 등을 관리
 */
class WindowManager {
    /**
     * WindowManager 생성자
     * 초기 메인 윈도우를 null로 설정
     */
    constructor() {
        this.mainWindow = null;
    }

    /**
     * 메인 윈도우를 생성하고 초기 설정을 수행
     * @returns {BrowserWindow} 생성된 윈도우 객체
     */
    createWindow() {
        // 윈도우 생성 및 기본 설정
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true
            },
            frame: false,
            backgroundColor: '#ffffff'
        });

        // HTML 파일 로드
        this.mainWindow.loadFile('index.html');
        
        // 개발 환경에서는 개발자 도구 자동 실행
        if (process.env.NODE_ENV === 'development') {
            this.mainWindow.webContents.openDevTools();
        }

        // 윈도우 닫힘 이벤트 처리
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
            TrayManager.destroy();
        });
        
        return this.mainWindow;
    }

    /**
     * 윈도우가 존재하면 보여주고, 없으면 새로 생성
     * @returns {BrowserWindow} 표시된 윈도우 객체
     */
    showWindow() {
        if (!this.mainWindow) {
            return this.createWindow();
        } else {
            this.mainWindow.show();
            return this.mainWindow;
        }
    }

    /**
     * 윈도우 컨트롤(최소화, 최대화, 닫기) 이벤트 핸들러 설정
     * IPC 이벤트 리스너를 등록하여 렌더러 프로세스와 통신
     */
    handleWindowControls() {
        // 윈도우 최소화 이벤트 핸들러
        ipcMain.on(WINDOW_COMMANDS.MINIMIZE, () => {
            if (this.mainWindow) {
                this.mainWindow.minimize();
            }
        });

        // 윈도우 최대화/복원 이벤트 핸들러
        ipcMain.on(WINDOW_COMMANDS.MAXIMIZE, () => {
            if (this.mainWindow) {
                if (this.mainWindow.isMaximized()) {
                    this.mainWindow.unmaximize();
                } else {
                    this.mainWindow.maximize();
                }
            }
        });

        // 윈도우 닫기 이벤트 핸들러
        ipcMain.on(WINDOW_COMMANDS.CLOSE, () => {
            if (this.mainWindow) {
                this.mainWindow.close();
            } else {
                app.quit();
            }
        });
    }
}

/**
 * 시스템 트레이 아이콘 관리를 담당하는 클래스
 * 트레이 아이콘 생성, 컨텍스트 메뉴 설정, 이벤트 처리 등을 관리
 */
class TrayManager {
    // 정적 트레이 인스턴스 저장
    static tray = null;

    /**
     * 트레이 아이콘 이미지 생성
     * OS별로 적절한 크기의 아이콘 제공
     * @returns {Electron.NativeImage} 트레이에 사용될 아이콘 이미지
     */
    static createTrayIcon() {
        // 아이콘 경로 및 이미지 로드
        const iconPath = path.resolve(__dirname, '/assets/icon.png');
        const trayIcon = nativeImage.createFromPath(iconPath);
        
        // macOS는 16x16 사이즈 사용
        return process.platform === 'darwin'
            ? trayIcon.resize({ width: 16, height: 16 })
            : trayIcon;
    }

    /**
     * 트레이 아이콘 생성 및 초기 설정
     * 컨텍스트 메뉴 및 이벤트 핸들러 등록
     * @param {WindowManager} windowManager - 윈도우 관리자 인스턴스
     * @returns {Electron.Tray|null} 생성된 트레이 객체 또는 null
     */
    static create(windowManager) {
        try {
            // 기존 트레이가 있다면 제거
            this.destroy();

            // 트레이 아이콘 생성
            const trayIcon = this.createTrayIcon();
            this.tray = new Tray(trayIcon);
            
            // macOS에서는 더블클릭 이벤트 무시
            if (process.platform === 'darwin') {
                this.tray.setIgnoreDoubleClickEvents(true);
            }

            // 컨텍스트 메뉴 생성
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: '열기',
                    click: () => windowManager.showWindow()
                },
                {
                    label: '종료',
                    click: () => {
                        this.destroy();
                        app.quit();
                    }
                }
            ]);
            
            // 트레이 설정
            this.tray.setToolTip('Full Screen App');
            this.tray.setContextMenu(contextMenu);
            this.tray.on('click', () => windowManager.showWindow());

            console.log('트레이 아이콘이 생성되었습니다.');
            return this.tray;
        } catch (error) {
            console.error('트레이 아이콘 생성 오류:', error);
            return null;
        }
    }

    /**
     * 트레이 아이콘 제거
     * 메모리 누수 방지를 위해 트레이 객체 정리
     */
    static destroy() {
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
    }
}

/**
 * 전체 애플리케이션 생명주기를 관리하는 클래스
 * 앱 초기화, 이벤트 설정 등을 담당
 */
class Application {
    /**
     * Application 클래스 생성자
     * WindowManager 인스턴스를 초기화
     */
    constructor() {
        this.windowManager = new WindowManager();
    }

    /**
     * 애플리케이션 이벤트 핸들러 등록
     * 앱 생명주기 관련 이벤트 처리
     */
    setupAppEvents() {
        // 모든 창이 닫히면 앱 종료 (macOS 제외)
        app.on('window-all-closed', () => {
            app.quit();
        });

        // macOS에서 dock 아이콘 클릭 시 창 생성
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.windowManager.createWindow();
            }
        });
    }

    /**
     * 애플리케이션 초기화
     * - 앱 준비 완료 시 윈도우 생성
     * - 윈도우 컨트롤 이벤트 핸들러 설정
     * - 트레이 아이콘 생성
     * - 앱 생명주기 이벤트 처리
     */
    init() {
        // 앱 이벤트 핸들러 설정
        this.setupAppEvents();

        // 앱이 준비되면 윈도우 및 트레이 생성
        app.whenReady().then(() => {
            // 메인 윈도우 생성
            this.windowManager.createWindow();
            
            // 윈도우 컨트롤 이벤트 핸들러 설정
            this.windowManager.handleWindowControls();
            
            // 트레이 아이콘 생성
            TrayManager.create(this.windowManager);
        });
    }
}

// 애플리케이션 인스턴스 생성 및 초기화
const application = new Application();
application.init(); 