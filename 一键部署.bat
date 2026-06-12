@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo ============================================
echo   牛香香·草原爱宠营 一键部署 v1.5.0
echo ============================================
echo.

REM Check tcb login
echo [1/4] 检查CloudBase登录状态...
tcb env list -e cloudbase-4gvjj5qn247cd61a >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] 未登录CloudBase，请先登录...
    echo.
    echo 请选择登录方式:
    echo   A^) 浏览器登录（推荐）
    echo   B^) API密钥登录
    echo.
    set /p method="请输入 A 或 B: "
    if /i "!method!"=="A" (
        echo 正在打开浏览器登录...
        tcb login
    ) else (
        echo 请输入腾讯云API密钥:
        set /p apiKeyId="SecretID: "
        set /p apiKey="SecretKey: "
        tcb login --apiKeyId !apiKeyId! --apiKey !apiKey!
    )
    if %errorlevel% neq 0 (
        echo [X] 登录失败，请重试
        pause
        exit /b 1
    )
)

echo [OK] CloudBase已登录

REM Deploy H5 to static hosting
echo.
echo [2/4] 部署H5页面到静态托管...
tcb hosting deploy ./h5 -e cloudbase-4gvjj5qn247cd61a
if %errorlevel% neq 0 (
    echo [!] H5部署失败
    echo     请确认静态托管已开通: https://console.cloud.tencent.com/tcb/hosting
    pause
    exit /b 1
)
echo [OK] H5页面部署成功

REM Init database config
echo.
echo [3/4] 初始化数据库配置...
node deploy/init-config.js
if %errorlevel% neq 0 (
    echo [!] 数据库初始化失败，尝试备用方式...
    echo     请在微信开发者工具中右键 cloudfunctions/initConfig 上传并部署
    pause
    exit /b 1
)
echo [OK] 数据库配置初始化成功

REM Done
echo.
echo [4/4] ============================================
echo.
echo   部署完成！
echo.
echo   H5页面: https://cloudbase-4gvjj5qn247cd61a-1304825656.tcloudbaseapp.com/h5/
echo   数据库: config集合 (ugc_enabled=false)
echo   小程序: 微信开发者工具上传代码
echo.
echo ============================================
echo.
echo 下一步:
echo   1. 确认admin页面UGC开关为关闭状态
echo   2. 微信开发者工具提交审核
echo   3. 审核通过后，admin页面开启UGC
echo.
pause
